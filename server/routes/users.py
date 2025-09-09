from fastapi import APIRouter, HTTPException
from models import User
from database import users_collection
from bson import ObjectId

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# CREATE user
@router.post("/")
def create_user(user: User):
    user_dict = user.dict()
    result = users_collection.insert_one(user_dict)
    return {"id": str(result.inserted_id), "message": "User created successfully"}

# READ all users
@router.get("/")
def get_users():
    users = []
    for user in users_collection.find():
        user["_id"] = str(user["_id"])  # convert ObjectId to string
        users.append(user)
    return users

# READ single user
@router.get("/{user_id}")
def get_user(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])
    return user
