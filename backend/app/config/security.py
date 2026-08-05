from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt
from fastapi.security import OAuth2PasswordBearer

SECRET_KEY = "GlowCare@2026SecureKey"
ALGORITHM = "HS256"

# Access token: short lifetime

ACCESS_TOKEN_EXPIRE_MINUTES = 15

# Refresh token: long lifetime

REFRESH_TOKEN_EXPIRE_DAYS = 30

pwd_context = CryptContext(
schemes=["bcrypt"],
deprecated="auto"
)

oauth2_scheme = OAuth2PasswordBearer(
tokenUrl="/api/auth/login"
)

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(
        plain_password: str,
hashed_password: str
):
    return pwd_context.verify(
plain_password,
hashed_password
)

def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire,
        "type": "access"
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

def create_refresh_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )

    to_encode.update({
        "exp": expire,
        "type": "refresh"
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

