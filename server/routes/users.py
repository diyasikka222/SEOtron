from fastapi import APIRouter, HTTPException, Depends, Body
from pydantic import BaseModel, EmailStr
from models.user import User
from database import users_collection
from bson import ObjectId
from utils.auth import hash_password, verify_password
from utils.jwt import create_access_token, verify_access_token
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta

# ✅ No prefix here, main.py handles "/users"
router = APIRouter(tags=["Users"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")


# ----------- Request Schemas -----------
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ----------- Endpoints -----------

# Create user (Signup)
@router.post("/signup")
def create_user(user: User):
    # Check if user already exists
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    # Hash password before saving
    user.password = hash_password(user.password)
    user_dict = user.dict()
    result = users_collection.insert_one(user_dict)

    return {"id": str(result.inserted_id), "message": "User created successfully"}


# Login user → return JWT
@router.post("/login")
def login_user(credentials: UserLogin):
    user = users_collection.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    # Generate JWT
    token_expires = timedelta(minutes=30)
    token = create_access_token({"sub": str(user["_id"])}, expires_delta=token_expires)

    return {"access_token": token, "token_type": "bearer"}


# Get all users (protected)
@router.get("/all")
def get_users(token: str = Depends(oauth2_scheme)):
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    users = []
    for user in users_collection.find():
        user["_id"] = str(user["_id"])  # convert ObjectId to string
        user.pop("password", None)      # don’t expose password
        users.append(user)
    return users


# Get single user (protected)
@router.get("/{user_id}")
def get_user(user_id: str, token: str = Depends(oauth2_scheme)):
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])
    user.pop("password", None)
    return user


# Get current user from JWT
@router.get("/me")
def get_me(token: str = Depends(oauth2_scheme)):
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("sub")
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["_id"] = str(user["_id"])
    user.pop("password", None)
    return user


# Update user (protected)
@router.put("/{user_id}")
def update_user(user_id: str, update: dict = Body(...), token: str = Depends(oauth2_scheme)):
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or no changes")
    return {"message": "User updated successfully"}


# Delete user (protected)
@router.delete("/{user_id}")
def delete_user(user_id: str, token: str = Depends(oauth2_scheme)):
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    result = users_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}
