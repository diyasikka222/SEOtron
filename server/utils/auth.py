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
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# ✨ CRITICAL FIX 1: Set auto_error=False to prevent immediate 401 on missing token
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/users/login",
    auto_error=False,  # Don't automatically raise HTTP 401
)


class TokenData(BaseModel):
    user_id: Optional[str] = None


# --- Functions ---


def verify_password(plain_password, hashed_password):
    """Checks if a plain password matches a hashed one."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    """Hashes a password."""
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

    # Safely check for 'hashed_password' to prevent KeyError
    hashed_password = user.get("hashed_password")

    if not hashed_password or not verify_password(password, hashed_password):
        return None

    return user


# ✨ CRITICAL FIX 2: Change return type and logic for public access
async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
) -> Optional[dict]:
    """
    Dependency to get the current user. Returns a User dict if authenticated,
    or None if the token is missing/invalid (for public access).
    """
    if token is None:
        # No token provided, user is anonymous. This is allowed for public routes.
        return None

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # 'sub' (subject) of the token is the user's email
        email: str = payload.get("sub")

        if email is None:
            # Malformed payload
            return None

        # Uses the imported function
        user = get_user_by_email(email)
        if user is None:
            # User deleted since token creation
            return None

        # If successful, return the user dictionary
        return user

    except JWTError:
        # Token is expired or invalid signature
        return None
