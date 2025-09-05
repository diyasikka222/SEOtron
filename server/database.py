from pymongo import MongoClient

# Replace with your MongoDB URI if using Atlas
MONGO_URI = "mongodb://localhost:27017/"

# Create a client connection
client = MongoClient(MONGO_URI)

# Choose database
db = client["seotron_db"]

# (Optional) Choose collections directly
users_collection = db["users"]
