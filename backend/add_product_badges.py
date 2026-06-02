import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
import random

async def add_labels():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'test_database')
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    products = await db.products.find({}).to_list(100)
    
    labels = ['TRENDING', 'BEST SELLER', 'LIMITED STOCK', None, None]
    
    for product in products:
        label = random.choice(labels)
        stock = random.randint(5, 120)
        await db.products.update_one(
            {'_id': product['_id']},
            {'$set': {'badge': label, 'stock': stock}}
        )
    
    print(f'✅ Updated {len(products)} products with badges and stock')
    client.close()

if __name__ == '__main__':
    asyncio.run(add_labels())
