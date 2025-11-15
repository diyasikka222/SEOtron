import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from database import get_user_by_email, get_user_by_id
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

# Load .env variables
load_dotenv()

# --- Config ---
SECRET_KEY = os.getenv("SECRET_KEY", "435768")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# --- Hashing ---
# ✨ FIX: Switched from "bcrypt" to "argon2"
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/users/login",
    auto_error=False,  # Don't automatically raise HTTP 401
)


class TokenData(BaseModel):
    user_id: Optional[str] = None


# --- Functions ---


def verify_password(plain_password, hashed_password):
    """Checks if a plain password matches a hashed one."""
    # FIX: No truncation needed for argon2
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    # FIX: No truncation needed for argon2
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Creates a new JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def authenticate_user(email: str, password: str) -> Optional[dict]:
    """Finds a user and verifies their password."""
    user = get_user_by_email(email)
    if not user:
        return None

    hashed_password = user.get("hashed_password")

    if not hashed_password or not verify_password(password, hashed_password):
        return None

    return user


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
) -> Optional[dict]:
    """
    Dependency to get the current user. Returns a User dict if authenticated,
    or None if the token is missing/invalid (for public access).
    """
    if token is None:
        return None

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            return None

        user = get_user_by_email(email)
        if user is None:
            return None

        return user

    except JWTError:
        return None
