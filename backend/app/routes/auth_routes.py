from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

from jose import JWTError, jwt

from app.schemas.user_schema import (
TokenResponse,
UserRegister
)

class RefreshTokenRequest(BaseModel):
    refresh_token: str

from app.services.auth_service import register

from app.config.security import (
create_access_token,
create_refresh_token,
verify_password,
SECRET_KEY,
ALGORITHM
)

from app.models.user_model import User

router = APIRouter(
prefix="/auth",
tags=["Authentication"]
)

# =====================================================

# REGISTER

# =====================================================

@router.post(
"/register",
response_model=TokenResponse,
status_code=status.HTTP_201_CREATED
)
async def register_user(payload: UserRegister):
    try:
        user = await register(payload)

    except ValueError as error:
        raise HTTPException(
            status_code=409,
            detail=str(error)
        )

    token_data = {
        "sub": str(user.id),
        "role": user.role
    }

    access_token = create_access_token(
        token_data
    )

    refresh_token = create_refresh_token(
        token_data
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",

        "user": {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "country_code": user.country_code,
            "phone": user.phone,
            "selected_doctor": user.selected_doctor,
            "is_active": user.is_active,
            "created_at": user.created_at
        }
    }

# =====================================================

# LOGIN

# =====================================================

@router.post(
    "/login",
    response_model=TokenResponse
)
async def login_user(
    form_data: OAuth2PasswordRequestForm = Depends()
):
    print(
        "LOGIN EMAIL:",
        form_data.username
    )

    # Find user by email
    user = await User.find_one(
        User.email == form_data.username
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    password_valid = verify_password(
        form_data.password,
        user.password_hash
    )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token_data = {
        "sub": str(user.id),
        "role": user.role
    }

    # Create short-life access token
    access_token = create_access_token(
        token_data
    )

    # Create long-life refresh token
    refresh_token = create_refresh_token(
        token_data
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",

        "user": {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "country_code": user.country_code,
            "phone": user.phone,
            "selected_doctor": user.selected_doctor,
            "is_active": user.is_active,
            "created_at": user.created_at
        }
    }

# =====================================================

# REFRESH ACCESS TOKEN

# =====================================================

@router.post("/refresh")
async def refresh_access_token(
    payload_data: RefreshTokenRequest
):
    try:
        payload = jwt.decode(
            payload_data.refresh_token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        # Only refresh tokens can create new access tokens
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=401,
                detail="Invalid refresh token"
            )

        user_id = payload.get("sub")
        role = payload.get("role")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid refresh token"
            )

        # Create new access token
        new_access_token = create_access_token(
            {
                "sub": user_id,
                "role": role
            }
        )

        return {
            "access_token": new_access_token,
            "token_type": "bearer"
        }
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Refresh token expired or invalid"
        )


# =====================================================

# OAUTH TOKEN ENDPOINT

# =====================================================

@router.post(
    "/token"
)
async def login_token(
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user = await User.find_one(
        User.email == form_data.username
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        form_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token_data = {
        "sub": str(user.id),
        "role": user.role
    }

    access_token = create_access_token(
        token_data
    )

    refresh_token = create_refresh_token(
        token_data
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
