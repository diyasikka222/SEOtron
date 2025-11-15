import os
from datetime import datetime
from typing import Any, Dict, List, Optional

import pymongo
from bson import ObjectId
from dotenv import load_dotenv  # Import load_dotenv
from pymongo.collection import Collection

# --- Database Connection ---
load_dotenv()  # Load environment variables from .env

# ✨ FIX: Use "MONGO_URI" from your .env file
# Provides a fallback to localhost if MONGO_URI is not found
MONGO_URI = os.getenv("MONGO_URI")
CLIENT = pymongo.MongoClient(MONGO_URI)
DB = CLIENT["seotron_db"]

# --- Collections ---
users_collection: Collection = DB["users"]
reports_collection: Collection = DB["seo_reports"]
onboarding_collection: Collection = DB["onboarding"]


def create_db_and_tables():
    """Creates collections on startup if they don't exist."""
    try:
        DB.create_collection("users")
        # Create a unique index for user emails
        users_collection.create_index("email", unique=True)
    except pymongo.errors.CollectionInvalid:
        pass  # Collection already exists

    try:
        DB.create_collection("seo_reports")
    except pymongo.errors.CollectionInvalid:
        pass

    try:
        DB.create_collection("onboarding")
    except pymongo.errors.CollectionInvalid:
        pass
    print("Database and collections initialized.")


# --- User Functions ---


def get_user_by_email(email: str) -> Optional[dict]:
    """Finds a user by their email."""
    user = users_collection.find_one({"email": email})
    if user:
        user["_id"] = str(user["_id"])  # Convert ObjectId to string
    return user


def get_user_by_id(user_id: str) -> Optional[dict]:
    """Finds a user by their string ID."""
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            user["_id"] = str(user["_id"])  # Convert ObjectId to string
        return user
    except Exception:
        return None


def create_user(user_data: dict) -> dict:
    """Creates a new user and returns them."""
    # Add default fields
    user_data["created_at"] = datetime.now()
    user_data["isOnboarded"] = False
    user_data["plan"] = "Free"

    result = users_collection.insert_one(user_data)
    new_user = get_user_by_id(str(result.inserted_id))
    return new_user


def update_user_onboarding(user_id: str, onboarding_data: dict) -> Optional[dict]:
    """
    Updates a user's isOnboarded status and saves their onboarding data.
    """
    try:
        # 1. Save the onboarding data to its own collection for cleanliness
        onboarding_collection.insert_one(
            {
                "user_id": ObjectId(user_id),
                "data": onboarding_data,
                "created_at": datetime.now(),
            }
        )

        # 2. Update the user's `isOnboarded` flag
        users_collection.update_one(
            {"_id": ObjectId(user_id)}, {"$set": {"isOnboarded": True}}
        )

        return get_user_by_id(user_id)

    except Exception as e:
        print(f"Error updating onboarding: {e}")
        return None


# --- Report Functions ---


def save_seo_report(user_id: str, url: str, data: dict):
    """Saves a new SEO analysis report."""
    report = {
        "user_id": ObjectId(user_id),  # Use ObjectId
        "url": str(url),
        "data": data,
        "created_at": datetime.utcnow(),
    }
    return reports_collection.insert_one(report)


def get_user_reports(user_id: str) -> List[dict]:
    """Gets all reports for a specific user."""
    reports = reports_collection.find({"user_id": ObjectId(user_id)}).sort(
        "created_at", -1
    )

    # Convert ObjectId to string for JSON serialization
    return [
        {**report, "_id": str(report["_id"]), "user_id": str(report["user_id"])}
        for report in reports
    ]
