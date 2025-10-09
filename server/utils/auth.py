# # utils/auth.py
# from passlib.context import CryptContext
#
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
#
# def hash_password(password: str) -> str:
#     return pwd_context.hash(password)
#
# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return pwd_context.verify(plain_password, hashed_password)


from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from models.user import User
from .jwt import verify_access_token

# -----------------------
# Password helpers
# -----------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# -----------------------
# OAuth2 token scheme
# -----------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

# -----------------------
# Get current user
# -----------------------
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    payload = verify_access_token(token)
    if not payload or "user_id" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

    user = User.objects(id=payload["user_id"]).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

