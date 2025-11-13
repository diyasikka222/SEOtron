from typing import List, Optional

from database import create_user, get_user_by_email, update_user_onboarding
from fastapi import APIRouter, Depends, HTTPException, status

# Assuming this file is located at server/routes/users.py
from models.user import OnboardingData, User
from pydantic import BaseModel
from utils.auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    get_password_hash,
)

# --- Models for this file (Request/Response Bodies) ---


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserResponse(BaseModel):
    username: str
    email: str
    isOnboarded: bool
    plan: str


class LoginRequest(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    isOnboarded: bool


class OnboardingResponse(BaseModel):
    message: str
    userId: str
    isOnboarded: bool


# Your main.py handles the prefix="/users"
router = APIRouter(tags=["Users"])


# --- Signup Endpoint (Path: /users/signup) ---
@router.post(
    "/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def signup_user(user: UserCreate):
    db_user = get_user_by_email(user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_password = get_password_hash(user.password)
    new_user = user.dict()
    new_user["hashed_password"] = hashed_password
    del new_user["password"]

    created_user = create_user(new_user)
    return created_user


# --- Login Endpoint (Path: /users/login) ---
@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: LoginRequest):
    user = authenticate_user(form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user["email"]})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "isOnboarded": user.get("isOnboarded", False),
    }


# --- Get Current User Endpoint (Path: /users/me) ---
@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


# --- ONBOARDING ENDPOINT (Path: /users/me/onboard) ---
@router.post("/me/onboard", response_model=OnboardingResponse)
async def save_onboarding(
    data: OnboardingData, current_user: User = Depends(get_current_user)
):
    """
    Receives onboarding data from the frontend and saves it.
    This endpoint also sets the user's `isOnboarded` flag to True.
    """
    try:
        user_id = current_user["_id"]

        updated_user = update_user_onboarding(user_id, data.dict())

        if not updated_user:
            raise HTTPException(status_code=500, detail="Failed to update user status.")

        return {
            "message": "Onboarding data saved successfully.",
            "userId": user_id,
            "isOnboarded": updated_user.get("isOnboarded", False),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
