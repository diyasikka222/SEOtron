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
SECRET_KEY = os.getenv("SECRET_KEY", "your_fallback_secret_key_here_please_change")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# --- Hashing ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/users/login"
)  # Matches your login route


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

    # ✨ FIX: Use .get() to safely check for 'hashed_password'.
    # If it's missing (due to bad/old database data), authentication fails gracefully (returns None).
    hashed_password = user.get("hashed_password")

    if not hashed_password or not verify_password(password, hashed_password):
        return None

    return user


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    Dependency to get the current user from a token.
    This is used in all your protected endpoints.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # 'sub' (subject) of the token is the user's email
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception

        # Uses the imported function
        user = get_user_by_email(email)
        if user is None:
            raise credentials_exception

        # user["_id"] is already a string from get_user_by_email
        return user

    except JWTError:
        raise credentials_exception
