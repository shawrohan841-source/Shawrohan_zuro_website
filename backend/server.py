from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, Header, Query, File, UploadFile, status
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import secrets
import razorpay
import resend
import asyncio
import requests
from bson import ObjectId

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"

# Razorpay Configuration
razorpay_client = razorpay.Client(auth=(os.environ['RAZORPAY_KEY_ID'], os.environ['RAZORPAY_KEY_SECRET']))

# Resend Configuration
resend.api_key = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

# Object Storage Configuration
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "zuro-ecommerce"
storage_key = None

app = FastAPI()
api_router = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=15), "type": "access"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        from bson import ObjectId
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_admin_user(request: Request) -> dict:
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ==================== OBJECT STORAGE HELPERS ====================

def init_storage():
    global storage_key
    if storage_key:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key

def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120
    )
    resp.raise_for_status()
    return resp.json()

def get_object(path: str) -> tuple[bytes, str]:
    key = init_storage()
    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key}, timeout=60
    )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

# ==================== MODELS ====================

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    phone: Optional[str] = None
    created_at: str

class ProductCreate(BaseModel):
    name: str
    category: str
    description: str
    price: float
class ProductCreate(BaseModel):
    name: str
    category: str
    description: str
    price: float
    images: List[str]
    videos: List[str] = []
    sizes: List[str] = ["S", "M", "L", "XL", "XXL"]
    colors: List[str] = ["Black", "White"]
    stock: int = 100
    featured: bool = False

class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    description: str
    price: float
    images: List[str]
    videos: List[str] = []
    sizes: List[str]
    colors: List[str]
    stock: int
    featured: bool
    created_at: str

class CartItem(BaseModel):
    product_id: str
    quantity: int
    size: str
    color: str

class OrderCreate(BaseModel):
    items: List[Dict[str, Any]]
    total: float
    payment_method: str
    shipping_address: Dict[str, str]
    coupon_code: Optional[str] = None

class ReviewCreate(BaseModel):
    product_id: str
    rating: int
    comment: str
    images: List[str] = []

class CouponValidate(BaseModel):
    code: str
    total: float

# ==================== STARTUP EVENTS ====================

@app.on_event("startup")
async def startup():
    try:
        init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
    
    await db.users.create_index("email", unique=True)
    await db.password_reset_tokens.create_index("expires_at", expireAfterSeconds=0)
    await db.login_attempts.create_index("identifier")
    
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@zuro.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "ZuroAdmin@2024")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "phone": None,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Admin password updated")
    
    os.makedirs("/app/memory", exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write(f"# Test Credentials\n\n")
        f.write(f"## Admin Account\n")
        f.write(f"- Email: {admin_email}\n")
        f.write(f"- Password: {admin_password}\n")
        f.write(f"- Role: admin\n\n")
        f.write(f"## Test User Account\n")
        f.write(f"- Email: test@zuro.com\n")
        f.write(f"- Password: Test@123\n")
        f.write(f"- Role: user\n\n")
        f.write(f"## Auth Endpoints\n")
        f.write(f"- POST /api/auth/register\n")
        f.write(f"- POST /api/auth/login\n")
        f.write(f"- GET /api/auth/me\n")
        f.write(f"- POST /api/auth/logout\n")

# ==================== AUTH ROUTES ====================

@api_router.post("/admin/auth/validate")
async def validate_admin_master(request: Request):
    """Validate the master admin password - hidden access gate"""
    data = await request.json()
    submitted_password = data.get("password", "")
    master_password = os.environ.get("ADMIN_MASTER_PASSWORD", "")
    
    if not master_password:
        raise HTTPException(status_code=500, detail="Admin access not configured")
    
    if submitted_password != master_password:
        # Log unauthorized attempt
        logger.warning(f"Failed admin gate attempt from IP: {request.client.host if request.client else 'unknown'}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Auto-login as admin user
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@zuro.com")
    admin_user = await db.users.find_one({"email": admin_email})
    
    if not admin_user:
        raise HTTPException(status_code=500, detail="Admin user not found")
    
    user_id = str(admin_user["_id"])
    access_token = create_access_token(user_id, admin_email)
    refresh_token = create_refresh_token(user_id)
    
    response = JSONResponse(content={"success": True, "message": "Admin authenticated"})
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return response

@api_router.post("/auth/register", response_model=UserResponse)
async def register(user: UserRegister, response: Response):
    email = user.email.lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(user.password)
    from bson import ObjectId
    user_doc = {
        "email": email,
        "password_hash": hashed,
        "name": user.name,
        "role": "user",
        "phone": user.phone,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return UserResponse(
        id=user_id,
        email=email,
        name=user.name,
        role="user",
        phone=user.phone,
        created_at=user_doc["created_at"]
    )

@api_router.post("/auth/login", response_model=UserResponse)
async def login(credentials: UserLogin, response: Response):
    email = credentials.email.lower()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return UserResponse(
        id=user_id,
        email=user["email"],
        name=user["name"],
        role=user.get("role", "user"),
        phone=user.get("phone"),
        created_at=user.get("created_at", "")
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(request: Request):
    user = await get_current_user(request)
    return UserResponse(
        id=user["_id"],
        email=user["email"],
        name=user["name"],
        role=user.get("role", "user"),
        phone=user.get("phone"),
        created_at=user.get("created_at", "")
    )

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}

# ==================== PRODUCT ROUTES ====================

@api_router.get("/products")
async def get_products(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
):
    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    
    products = await db.products.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    return products

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.post("/products")
async def create_product(product: ProductCreate, request: Request):
    await get_admin_user(request)
    product_doc = product.model_dump()
    product_doc["id"] = str(uuid.uuid4())
    product_doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.products.insert_one(product_doc)
    return {"message": "Product created", "id": product_doc["id"]}

@api_router.put("/products/{product_id}")
async def update_product(product_id: str, product: ProductCreate, request: Request):
    await get_admin_user(request)
    product_doc = product.model_dump()
    result = await db.products.update_one({"id": product_id}, {"$set": product_doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product updated"}

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, request: Request):
    await get_admin_user(request)
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}

@api_router.get("/categories")
async def get_categories():
    categories = await db.products.distinct("category")
    return categories

# ==================== CART ROUTES ====================

@api_router.get("/cart")
async def get_cart(request: Request):
    user = await get_current_user(request)
    cart = await db.cart.find_one({"user_id": user["_id"]}, {"_id": 0})
    if not cart:
        return {"items": []}
    return cart

@api_router.post("/cart/add")
async def add_to_cart(item: CartItem, request: Request):
    user = await get_current_user(request)
    cart = await db.cart.find_one({"user_id": user["_id"]})
    
    if not cart:
        await db.cart.insert_one({
            "user_id": user["_id"],
            "items": [item.model_dump()],
            "updated_at": datetime.now(timezone.utc).isoformat()
        })
    else:
        items = cart.get("items", [])
        found = False
        for i, cart_item in enumerate(items):
            if (cart_item["product_id"] == item.product_id and 
                cart_item["size"] == item.size and 
                cart_item["color"] == item.color):
                items[i]["quantity"] += item.quantity
                found = True
                break
        if not found:
            items.append(item.model_dump())
        await db.cart.update_one(
            {"user_id": user["_id"]},
            {"$set": {"items": items, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    return {"message": "Item added to cart"}

@api_router.delete("/cart/remove/{product_id}")
async def remove_from_cart(product_id: str, size: str, color: str, request: Request):
    user = await get_current_user(request)
    cart = await db.cart.find_one({"user_id": user["_id"]})
    if cart:
        items = [i for i in cart.get("items", []) if not (i["product_id"] == product_id and i["size"] == size and i["color"] == color)]
        await db.cart.update_one(
            {"user_id": user["_id"]},
            {"$set": {"items": items, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    return {"message": "Item removed from cart"}

# ==================== WISHLIST ROUTES ====================

@api_router.get("/wishlist")
async def get_wishlist(request: Request):
    user = await get_current_user(request)
    wishlist = await db.wishlist.find_one({"user_id": user["_id"]}, {"_id": 0})
    if not wishlist:
        return {"product_ids": []}
    return wishlist

@api_router.post("/wishlist/add/{product_id}")
async def add_to_wishlist(product_id: str, request: Request):
    user = await get_current_user(request)
    wishlist = await db.wishlist.find_one({"user_id": user["_id"]})
    if not wishlist:
        await db.wishlist.insert_one({
            "user_id": user["_id"],
            "product_ids": [product_id],
            "updated_at": datetime.now(timezone.utc).isoformat()
        })
    else:
        product_ids = wishlist.get("product_ids", [])
        if product_id not in product_ids:
            product_ids.append(product_id)
            await db.wishlist.update_one(
                {"user_id": user["_id"]},
                {"$set": {"product_ids": product_ids, "updated_at": datetime.now(timezone.utc).isoformat()}}
            )
    return {"message": "Added to wishlist"}

@api_router.delete("/wishlist/remove/{product_id}")
async def remove_from_wishlist(product_id: str, request: Request):
    user = await get_current_user(request)
    wishlist = await db.wishlist.find_one({"user_id": user["_id"]})
    if wishlist:
        product_ids = [pid for pid in wishlist.get("product_ids", []) if pid != product_id]
        await db.wishlist.update_one(
            {"user_id": user["_id"]},
            {"$set": {"product_ids": product_ids, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    return {"message": "Removed from wishlist"}

# ==================== ORDER ROUTES ====================

@api_router.post("/orders/create")
async def create_order(order: OrderCreate, request: Request):
    user = await get_current_user(request)
    
    # Server-side total calculation for security
    calculated_total = 0
    for item in order.items:
        product = await db.products.find_one({"id": item["product_id"]}, {"_id": 0})
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item['product_id']} not found")
        if product["stock"] < item["quantity"]:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product['name']}")
        calculated_total += product["price"] * item["quantity"]
    
    # Add shipping
    shipping = 0 if calculated_total > 999 else 99
    calculated_total += shipping
    
    order_doc = order.model_dump()
    order_doc["id"] = str(uuid.uuid4())
    order_doc["user_id"] = user["_id"]
    order_doc["status"] = "pending"
    order_doc["total"] = calculated_total  # Use server-calculated total
    order_doc["created_at"] = datetime.now(timezone.utc).isoformat()
    order_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    # Decrement stock
    for item in order.items:
        await db.products.update_one(
            {"id": item["product_id"]},
            {"$inc": {"stock": -item["quantity"]}}
        )
    
    await db.orders.insert_one(order_doc)
    await db.cart.delete_one({"user_id": user["_id"]})
    
    return {"message": "Order created", "order_id": order_doc["id"]}

@api_router.get("/orders")
async def get_orders(request: Request):
    user = await get_current_user(request)
    orders = await db.orders.find({"user_id": user["_id"]}, {"_id": 0}).to_list(100)
    return orders

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str, request: Request):
    user = await get_current_user(request)
    order = await db.orders.find_one({"id": order_id, "user_id": user["_id"]}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# ==================== PAYMENT ROUTES ====================

@api_router.post("/payment/razorpay/create-order")
async def create_razorpay_order(amount: float, request: Request):
    user = await get_current_user(request)
    razor_order = razorpay_client.order.create({
        "amount": int(amount * 100),
        "currency": "INR",
        "payment_capture": 1
    })
    return razor_order

@api_router.post("/payment/razorpay/verify")
async def verify_razorpay_payment(payment_id: str, order_id: str, signature: str, request: Request):
    user = await get_current_user(request)
    try:
        razorpay_client.utility.verify_payment_signature({
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature
        })
        return {"verified": True}
    except:
        raise HTTPException(status_code=400, detail="Payment verification failed")

# ==================== REVIEWS ====================

@api_router.get("/reviews/product/{product_id}")
async def get_reviews(product_id: str, sort: str = "newest", with_images: bool = False):
    query = {"product_id": product_id, "approved": {"$ne": False}}
    if with_images:
        query["images"] = {"$exists": True, "$ne": []}
    
    # Determine sort order
    sort_options = {
        "newest": [("created_at", -1)],
        "oldest": [("created_at", 1)],
        "highest": [("rating", -1), ("created_at", -1)],
        "lowest": [("rating", 1), ("created_at", -1)],
    }
    sort_order = sort_options.get(sort, [("created_at", -1)])
    
    reviews = await db.reviews.find(query, {"_id": 0}).sort(sort_order).to_list(200)
    
    # Calculate stats
    all_reviews = await db.reviews.find({"product_id": product_id, "approved": {"$ne": False}}, {"_id": 0}).to_list(500)
    total = len(all_reviews)
    average = sum(r["rating"] for r in all_reviews) / total if total > 0 else 0
    breakdown = {str(i): 0 for i in range(1, 6)}
    for r in all_reviews:
        breakdown[str(r["rating"])] = breakdown.get(str(r["rating"]), 0) + 1
    
    return {
        "reviews": reviews,
        "stats": {
            "total": total,
            "average": round(average, 1),
            "breakdown": breakdown
        }
    }

@api_router.post("/reviews")
async def create_review(review: ReviewCreate, request: Request):
    user = await get_current_user(request)
    
    # Check verified purchase: user must have a delivered or completed order with this product
    user_orders = await db.orders.find({"user_id": user["_id"]}).to_list(100)
    verified = False
    for order in user_orders:
        for item in order.get("items", []):
            if item.get("product_id") == review.product_id:
                verified = True
                break
        if verified:
            break
    
    # Check if user already reviewed this product
    existing = await db.reviews.find_one({"product_id": review.product_id, "user_id": user["_id"]})
    if existing:
        raise HTTPException(status_code=400, detail="You have already reviewed this product")
    
    review_doc = review.model_dump()
    review_doc["id"] = str(uuid.uuid4())
    review_doc["user_id"] = user["_id"]
    review_doc["user_name"] = user["name"]
    review_doc["user_city"] = user.get("city", "India")
    review_doc["verified_purchase"] = verified
    review_doc["approved"] = True  # Auto-approve, admin can moderate later
    review_doc["featured"] = False
    review_doc["created_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.reviews.insert_one(review_doc)
    return {"message": "Review added", "verified_purchase": verified}

@api_router.put("/reviews/{review_id}")
async def update_review(review_id: str, review: ReviewCreate, request: Request):
    user = await get_current_user(request)
    
    existing = await db.reviews.find_one({"id": review_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Review not found")
    
    if existing["user_id"] != user["_id"]:
        raise HTTPException(status_code=403, detail="Cannot edit others' reviews")
    
    update_data = {
        "rating": review.rating,
        "comment": review.comment,
        "images": review.images,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.reviews.update_one({"id": review_id}, {"$set": update_data})
    return {"message": "Review updated"}

@api_router.delete("/reviews/{review_id}")
async def delete_review(review_id: str, request: Request):
    user = await get_current_user(request)
    
    existing = await db.reviews.find_one({"id": review_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # User can delete their own, admin can delete any
    if existing["user_id"] != user["_id"] and user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Cannot delete others' reviews")
    
    await db.reviews.delete_one({"id": review_id})
    return {"message": "Review deleted"}

# Admin Review Moderation
@api_router.get("/admin/reviews")
async def get_admin_reviews(request: Request, skip: int = 0, limit: int = 100):
    await get_admin_user(request)
    limit = min(max(limit, 1), 500)
    reviews = await db.reviews.find({}, {"_id": 0}).sort([("created_at", -1)]).skip(skip).limit(limit).to_list(limit)
    return reviews

@api_router.put("/admin/reviews/{review_id}/moderate")
async def moderate_review(review_id: str, action: str, request: Request):
    await get_admin_user(request)
    
    update = {}
    if action == "approve":
        update["approved"] = True
    elif action == "reject":
        update["approved"] = False
    elif action == "feature":
        update["featured"] = True
    elif action == "unfeature":
        update["featured"] = False
    else:
        raise HTTPException(status_code=400, detail="Invalid action")
    
    result = await db.reviews.update_one({"id": review_id}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Send email notification when review is featured (best-effort, non-blocking)
    if action == "feature":
        try:
            review = await db.reviews.find_one({"id": review_id})
            if review:
                user = await db.users.find_one({"_id": ObjectId(review["user_id"])}) if review.get("user_id") else None
                if user and user.get("email") and resend.api_key:
                    try:
                        resend.Emails.send({
                            "from": SENDER_EMAIL,
                            "to": user["email"],
                            "subject": "🌟 Your ZURO review is now featured!",
                            "html": f"""
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #050505; color: #fff; padding: 40px;">
                                <h1 style="color: #fff; text-transform: uppercase; letter-spacing: 4px;">ZURO</h1>
                                <h2 style="color: #E60000;">Your review is now FEATURED!</h2>
                                <p>Hi {user.get('name', 'Customer')},</p>
                                <p>Great news! Your review has been featured by our team. It will now be highlighted on the product page for other customers to see.</p>
                                <p style="background: #111; padding: 20px; border-left: 3px solid #E60000;">"{review.get('comment', '')}"</p>
                                <p>Thank you for being part of the ZURO family!</p>
                                <p style="color: #888;">- The ZURO Team</p>
                            </div>
                            """
                        })
                    except Exception as e:
                        logger.warning(f"Failed to send featured review email: {e}")
        except Exception as e:
            logger.warning(f"Featured email notification error: {e}")
    
    return {"message": f"Review {action}d"}

@api_router.post("/admin/reviews/{review_id}/reply")
async def reply_to_review(review_id: str, request: Request):
    """Admin reply to a customer review"""
    user = await get_admin_user(request)
    data = await request.json()
    reply_text = data.get("reply", "").strip()
    
    if not reply_text:
        raise HTTPException(status_code=400, detail="Reply text required")
    
    if len(reply_text) > 2000:
        raise HTTPException(status_code=400, detail="Reply too long (max 2000 characters)")
    
    reply_data = {
        "text": reply_text,
        "admin_name": user.get("name", "ZURO Team"),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    result = await db.reviews.update_one(
        {"id": review_id},
        {"$set": {"admin_reply": reply_data}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Reply added", "reply": reply_data}

@api_router.delete("/admin/reviews/{review_id}/reply")
async def delete_review_reply(review_id: str, request: Request):
    await get_admin_user(request)
    result = await db.reviews.update_one(
        {"id": review_id},
        {"$unset": {"admin_reply": ""}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Reply deleted"}

# ==================== COUPONS ====================

@api_router.post("/coupons/validate")
async def validate_coupon(coupon: CouponValidate):
    coupon_doc = await db.coupons.find_one({"code": coupon.code.upper(), "active": True}, {"_id": 0})
    if not coupon_doc:
        raise HTTPException(status_code=404, detail="Invalid coupon code")
    
    expiry = datetime.fromisoformat(coupon_doc["expiry_date"])
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)
    if expiry < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Coupon expired")
    
    discount = 0
    if coupon_doc.get("discount_percent"):
        discount = coupon.total * (coupon_doc["discount_percent"] / 100)
    elif coupon_doc.get("discount_amount"):
        discount = coupon_doc["discount_amount"]
    
    return {"discount": discount, "final_total": coupon.total - discount}

@api_router.get("/admin/coupons")
async def get_admin_coupons(request: Request):
    await get_admin_user(request)
    coupons = await db.coupons.find({}, {"_id": 0}).to_list(100)
    return coupons

@api_router.post("/admin/coupons")
async def create_coupon(request: Request):
    await get_admin_user(request)
    data = await request.json()
    coupon_doc = {
        "id": str(uuid.uuid4()),
        "code": data["code"].upper(),
        "discount_percent": data.get("discount_percent", 0),
        "discount_amount": data.get("discount_amount", 0),
        "expiry_date": data["expiry_date"],
        "active": data.get("active", True),
        "used_count": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.coupons.insert_one(coupon_doc)
    return {"message": "Coupon created", "id": coupon_doc["id"]}

@api_router.put("/admin/coupons/{coupon_id}")
async def update_coupon(coupon_id: str, request: Request):
    await get_admin_user(request)
    data = await request.json()
    update_data = {}
    if "code" in data:
        update_data["code"] = data["code"].upper()
    if "discount_percent" in data:
        update_data["discount_percent"] = data["discount_percent"]
    if "discount_amount" in data:
        update_data["discount_amount"] = data["discount_amount"]
    if "expiry_date" in data:
        update_data["expiry_date"] = data["expiry_date"]
    if "active" in data:
        update_data["active"] = data["active"]
    
    result = await db.coupons.update_one({"id": coupon_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return {"message": "Coupon updated"}

@api_router.delete("/admin/coupons/{coupon_id}")
async def delete_coupon(coupon_id: str, request: Request):
    await get_admin_user(request)
    result = await db.coupons.delete_one({"id": coupon_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return {"message": "Coupon deleted"}

# ==================== ADMIN ROUTES ====================

@api_router.get("/admin/dashboard")
async def get_admin_dashboard(request: Request):
    await get_admin_user(request)
    
    total_orders = await db.orders.count_documents({})
    total_revenue = await db.orders.aggregate([
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]).to_list(1)
    total_users = await db.users.count_documents({"role": "user"})
    total_products = await db.products.count_documents({})
    
    return {
        "total_orders": total_orders,
        "total_revenue": total_revenue[0]["total"] if total_revenue else 0,
        "total_users": total_users,
        "total_products": total_products
    }

@api_router.get("/admin/orders")
async def get_all_orders(request: Request, skip: int = 0, limit: int = 50):
    await get_admin_user(request)
    orders = await db.orders.find({}, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    return orders

@api_router.put("/admin/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str, request: Request):
    await get_admin_user(request)
    
    # Validate status enum
    valid_statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
    
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order status updated"}

# ==================== STORAGE ROUTES ====================

@api_router.post("/storage/upload")
async def upload_file(file: UploadFile = File(...), request: Request = None):
    if request:
        user = await get_current_user(request)
        user_id = user["_id"]
    else:
        user_id = "guest"
    
    ext = file.filename.split(".")[-1] if "." in file.filename else "bin"
    path = f"{APP_NAME}/uploads/{user_id}/{uuid.uuid4()}.{ext}"
    data = await file.read()
    result = put_object(path, data, file.content_type or "application/octet-stream")
    
    await db.files.insert_one({
        "id": str(uuid.uuid4()),
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": file.content_type,
        "size": result["size"],
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    return {"url": f"/api/storage/files/{result['path']}", "path": result["path"]}

@api_router.get("/storage/files/{path:path}")
async def download_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    data, content_type = get_object(path)
    return Response(content=data, media_type=record.get("content_type", content_type))

# ==================== MIDDLEWARE & STARTUP ====================

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()