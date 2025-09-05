from fastapi import FastAPI
from pydantic import BaseModel, EmailStr
from database import users_collection

# FastAPI app
app = FastAPI()

# Pydantic model for validation
class User(BaseModel):
    name: str
    email: EmailStr
    password: str

# Root route
@app.get("/")
def home():
    return {"message": "SEOtron Backend Running "}

# Fetch all users
@app.get("/users")
def get_users():
    users = list(users_collection.find({}, {"_id": 0}))
    return {"users": users}

# Add a new user
@app.post("/users")
def add_user(user: User):
    users_collection.insert_one(user.dict())
    return {"message": "User added successfully"}
