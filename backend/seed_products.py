import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import uuid

async def seed_products():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'test_database')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Clear existing products
    await db.products.delete_many({})
    
    products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Sukuna Domain T-Shirt",
            "category": "Anime T-Shirts",
            "description": "Premium oversized t-shirt featuring Sukuna's Domain Expansion artwork. High-quality DTF print that lasts forever.",
            "price": 899,
            "images": [
                "https://images.pexels.com/photos/33562235/pexels-photo-33562235.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                "https://images.unsplash.com/photo-1661110546797-d86cc72a2765?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHw0fHxvdmVyc2l6ZWQlMjBzdHJlZXR3ZWFyJTIwYW5pbWUlMjB0LXNoaXJ0JTIwbW9kZWx8ZW58MHx8fHwxNzgwMzkwMDQwfDA&ixlib=rb-4.1.0&q=85"
            ],
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "colors": ["Black", "White", "Red"],
            "stock": 100,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Naruto Hokage T-Shirt",
            "category": "Anime T-Shirts",
            "description": "Oversized tee with iconic Naruto Hokage design. Premium cotton with vibrant DTF printing.",
            "price": 849,
            "images": [
                "https://images.unsplash.com/photo-1593726891090-b4c6bc09c819?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwyfHxvdmVyc2l6ZWQlMjBzdHJlZXR3ZWFyJTIwYW5pbWUlMjB0LXNoaXJ0JTIwbW9kZWx8ZW58MHx8fHwxNzgwMzkwMDQwfDA&ixlib=rb-4.1.0&q=85"
            ],
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "colors": ["Black", "White", "Orange"],
            "stock": 80,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Death Note L T-Shirt",
            "category": "Anime T-Shirts",
            "description": "Classic Death Note L design on premium oversized tee. Perfect for anime lovers.",
            "price": 799,
            "images": [
                "https://images.unsplash.com/photo-1661110546797-d86cc72a2765?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHw0fHxvdmVyc2l6ZWQlMjBzdHJlZXR3ZWFyJTIwYW5pbWUlMjB0LXNoaXJ0JTIwbW9kZWx8ZW58MHx8fHwxNzgwMzkwMDQwfDA&ixlib=rb-4.1.0&q=85"
            ],
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "colors": ["Black", "White"],
            "stock": 120,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Attack on Titan Hoodie",
            "category": "Hoodies",
            "description": "Premium hoodie featuring Attack on Titan Survey Corps emblem. Warm and stylish.",
            "price": 1499,
            "images": [
                "https://images.pexels.com/photos/28523141/pexels-photo-28523141.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            ],
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "colors": ["Black", "Green", "Navy"],
            "stock": 60,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Demon Slayer Oversized Tee",
            "category": "Oversized T-Shirts",
            "description": "Ultra-oversized tee with stunning Demon Slayer artwork. Drop shoulder fit.",
            "price": 999,
            "images": [
                "https://images.unsplash.com/photo-1593726891090-b4c6bc09c819?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwyfHxvdmVyc2l6ZWQlMjBzdHJlZXR3ZWFyJTIwYW5pbWUlMjB0LXNoaXJ0JTIwbW9kZWx8ZW58MHx8fHwxNzgwMzkwMDQwfDA&ixlib=rb-4.1.0&q=85"
            ],
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "colors": ["Black", "White", "Red"],
            "stock": 90,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "One Piece Straw Hat Tee",
            "category": "Anime T-Shirts",
            "description": "Rep the Straw Hat crew with this premium anime tee. Bold print that stands out.",
            "price": 849,
            "images": [
                "https://images.unsplash.com/photo-1661110546797-d86cc72a2765?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHw0fHxvdmVyc2l6ZWQlMjBzdHJlZXR3ZWFyJTIwYW5pbWUlMjB0LXNoaXJ0JTIwbW9kZWx8ZW58MHx8fHwxNzgwMzkwMDQwfDA&ixlib=rb-4.1.0&q=85"
            ],
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "colors": ["Black", "White", "Yellow"],
            "stock": 75,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Tokyo Ghoul Kaneki Hoodie",
            "category": "Hoodies",
            "description": "Dark and stylish Tokyo Ghoul hoodie featuring Kaneki. Premium quality.",
            "price": 1599,
            "images": [
                "https://images.pexels.com/photos/33562235/pexels-photo-33562235.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            ],
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "colors": ["Black", "Grey"],
            "stock": 50,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "My Hero Academia Oversized Tee",
            "category": "Oversized T-Shirts",
            "description": "Show your hero spirit with this MHA oversized tee. Comfort meets style.",
            "price": 899,
            "images": [
                "https://images.unsplash.com/photo-1593726891090-b4c6bc09c819?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwyfHxvdmVyc2l6ZWQlMjBzdHJlZXR3ZWFyJTIwYW5pbWUlMjB0LXNoaXJ0JTIwbW9kZWx8ZW58MHx8fHwxNzgwMzkwMDQwfDA&ixlib=rb-4.1.0&q=85"
            ],
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "colors": ["Black", "White", "Green"],
            "stock": 85,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.products.insert_many(products)
    print(f"✅ Seeded {len(products)} products successfully!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_products())
