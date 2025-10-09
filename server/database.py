from pymongo import MongoClient

# Replace with your MongoDB URI if using Atlas
MONGO_URI = "mongodb://localhost:27017/"

# Create a client connection
client = MongoClient(MONGO_URI)

# Choose database
db = client["seotron_db"]

# (Optional) Choose collections directly
users_collection = db["users"]
seo_reports_collection = db["seo_reports"]



# -------------------------
# SEO Helpers
# -------------------------
def save_seo_report(user_id: str, url: str, result: dict):
    report = {
        "user_id": user_id,
        "url": url,
        "result": result,
        "created_at": datetime.utcnow()
    }
    return seo_collection.insert_one(report)

def get_user_reports(user_id: str):
    return list(seo_collection.find({"user_id": user_id}))