from datetime import datetime
from typing import Any, Dict, List, Optional

from bson import ObjectId  # ✨ FIX: Import ObjectId explicitly
from pydantic import BaseModel, Field


# --- Onboarding Data Model ---
class OnboardingData(BaseModel):
    website: str
    pages: List[str] = Field(default_factory=list)
    keywords: List[str] = Field(default_factory=list)
    description: str = ""
    goals: List[str] = Field(default_factory=list)
    competitors: List[str] = Field(default_factory=list)
    createdAt: datetime


# --- User Model (Base for DB/Auth operations) ---
class User(BaseModel):
    username: str
    email: str
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.now)
    isOnboarded: bool = False
    plan: str = "Free"

    id: str = Field(None, alias="_id")

    class Config:
        # Allows Pydantic to handle non-standard keys like '_id' from MongoDB
        allow_population_by_field_name = True
        # Fixes the NameError by using the imported ObjectId
        json_encoders = {ObjectId: str}
