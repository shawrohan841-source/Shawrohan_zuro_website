import asyncio
import os
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
import random

async def seed_reviews():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'test_database')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Get all products
    products = await db.products.find({}, {"_id": 0}).to_list(100)
    
    # Indian names and cities
    names = [
        "Arjun Sharma", "Rohan Patel", "Aditya Kumar", "Vikram Singh", "Raj Mehta",
        "Priya Gupta", "Neha Reddy", "Anjali Joshi", "Kavya Nair", "Sanya Verma",
        "Abhishek Rao", "Karthik Iyer", "Rahul Das", "Varun Kapoor", "Siddharth Malhotra",
        "Riya Shah", "Ishita Desai", "Tanvi Agarwal", "Diya Chopra", "Simran Bhatia"
    ]
    
    cities = [
        "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
        "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow",
        "Chandigarh", "Indore", "Kochi", "Gurgaon", "Noida"
    ]
    
    reviews_text = [
        {"rating": 5, "comment": "Quality is insane bro 🔥 Print is so vibrant and the oversized fit is perfect!"},
        {"rating": 5, "comment": "Perfect oversized fit! Fabric quality is top-notch. Worth every rupee."},
        {"rating": 5, "comment": "Print quality is amazing! No fading even after multiple washes. Highly recommend!"},
        {"rating": 4, "comment": "Worth the price honestly. Good quality material and stitching is solid."},
        {"rating": 5, "comment": "Delivery was super fast! Packaging was premium. Love the design 💯"},
        {"rating": 5, "comment": "Best anime merch I've bought! The print is so detailed and colors pop out."},
        {"rating": 4, "comment": "Nice oversized fit. Fabric is thick and comfortable. Will order more."},
        {"rating": 5, "comment": "The quality is unreal! Feels premium and looks exactly like the pictures."},
        {"rating": 5, "comment": "DTF print quality is next level! Design looks sick. Definitely recommend ZURO."},
        {"rating": 4, "comment": "Great fit and material. Slightly expensive but quality justifies the price."},
        {"rating": 5, "comment": "Finally found good anime streetwear in India! Oversized fit is perfect for me."},
        {"rating": 5, "comment": "This is fire! 🔥 Quality is way better than other brands I've tried."},
        {"rating": 4, "comment": "Solid product. Fabric is soft and print is sharp. Fast delivery too."},
        {"rating": 5, "comment": "Loved it! The oversized look is exactly what I wanted. Premium quality fr."},
        {"rating": 5, "comment": "Best purchase ever! Print is vibrant, fabric is comfortable. 10/10"},
        {"rating": 5, "comment": "Bro the quality is insane for the price! Will definitely buy more designs."},
        {"rating": 4, "comment": "Good quality tee. Print is detailed and size chart is accurate."},
        {"rating": 5, "comment": "Amazing product! Oversized fit looks dope. Print quality is exceptional."},
        {"rating": 5, "comment": "Worth every penny! Fabric is premium and the anime design is so cool."},
        {"rating": 4, "comment": "Nice quality. Delivery was quick. Oversized fit is comfortable."}
    ]
    
    all_reviews = []
    
    for product in products:
        # Add 3-7 reviews per product
        num_reviews = random.randint(3, 7)
        
        for _ in range(num_reviews):
            review_data = random.choice(reviews_text)
            name = random.choice(names)
            city = random.choice(cities)
            days_ago = random.randint(1, 60)
            created_at = datetime.now(timezone.utc) - timedelta(days=days_ago)
            
            review = {
                "id": str(uuid.uuid4()),
                "product_id": product["id"],
                "user_id": "verified_customer",
                "user_name": name,
                "user_city": city,
                "rating": review_data["rating"],
                "comment": review_data["comment"],
                "verified_purchase": True,
                "created_at": created_at.isoformat()
            }
            
            all_reviews.append(review)
    
    # Clear existing reviews and insert new ones
    await db.reviews.delete_many({})
    if all_reviews:
        await db.reviews.insert_many(all_reviews)
    
    print(f"✅ Seeded {len(all_reviews)} reviews for {len(products)} products!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_reviews())
