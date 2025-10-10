from pymongo import MongoClient
from datetime import datetime

client = MongoClient("mongodb://localhost:27017")
db = client["seotron_db"]

# Collections
users_collection = db["users"]
seo_collection = db["seo_reports"]

def save_seo_report(user_id, url, data):
    report = {
        "user_id": user_id,
        "url": str(url),
        "data": data,
        "created_at": datetime.utcnow()
    }
    return seo_collection.insert_one(report)

def get_user_reports(user_id):
    return list(seo_collection.find({"user_id": user_id}))

