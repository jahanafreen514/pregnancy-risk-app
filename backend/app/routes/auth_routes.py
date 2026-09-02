from datetime import datetime, timezone
import secrets

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
ALGORITHM
)
from app.config.settings import get_settings

from app.models.user_model import User
from app.models.doctor_model import DoctorProfile
from app.models.password_reset_model import PasswordResetToken
from app.schemas.password_reset_schema import ForgotPasswordRequest, ResetPasswordRequest, VerifyEmailRequest, ChangePasswordRequest
from app.config.security import hash_password
from app.services.email_service import send_email
from app.services.notification_service import notify_user
from app.middleware.auth_middleware import get_current_user

router = APIRouter(
prefix="/auth",
tags=["Authentication"]
)


async def _login_for_role(form_data: OAuth2PasswordRequestForm, required_role: str):
    user = await User.find_one(User.email == form_data.username.lower())
    if not user or not user.is_active or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if user.role != required_role:
        raise HTTPException(status_code=403, detail=f"This account is not registered as a {required_role}")
    if required_role == "doctor":
        profile = await DoctorProfile.find_one(DoctorProfile.user_id == str(user.id))
        if not profile or not profile.is_verified or profile.verification_status != "approved":
            raise HTTPException(status_code=403, detail="Doctor verification is pending or has not been approved")
    token_data = {"sub": str(user.id), "role": user.role}
    return {"access_token": create_access_token(token_data), "refresh_token": create_refresh_token(token_data), "token_type": "bearer", "user": {"id": str(user.id), "name": user.name, "email": user.email, "role": user.role, "country_code": user.country_code, "phone": user.phone, "selected_doctor": user.selected_doctor, "is_active": user.is_active, "is_email_verified": user.is_email_verified, "created_at": user.created_at}}


def otp_expired(expires_at: datetime) -> bool:
    """MongoDB may deserialize UTC values without tzinfo; normalize before comparison."""
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    return expires_at <= datetime.now(timezone.utc)


@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
async def forgot_password(payload: ForgotPasswordRequest):
    """Issue a short-lived OTP without revealing whether an account exists."""
    if not get_settings().email_enabled:
        raise HTTPException(status_code=503, detail="Email delivery is not configured. Set SMTP_USERNAME, SMTP_PASSWORD and SMTP_FROM in .env.")
    user = await User.find_one(User.email == str(payload.email).lower())
    if user:
        otp = f"{secrets.randbelow(1_000_000):06d}"
        await PasswordResetToken.find(
            PasswordResetToken.user_id == str(user.id), PasswordResetToken.purpose == "password_reset", PasswordResetToken.used == False
        ).update({"$set": {"used": True}})
        token = PasswordResetToken(user_id=str(user.id), otp_hash=hash_password(otp), purpose="password_reset")
        await token.insert()
        await send_email(
            user.email,
            "GlowCare password reset OTP",
            f"Your password reset OTP is {otp}. It expires in 15 minutes. Do not share it with anyone.",
        )
    return {"message": "If this email is registered, an OTP has been sent."}


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):
    user = await User.find_one(User.email == str(payload.email).lower())
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    token = await PasswordResetToken.find_one(
        PasswordResetToken.user_id == str(user.id), PasswordResetToken.purpose == "password_reset", PasswordResetToken.used == False
    )
    if not token or otp_expired(token.expires_at) or not verify_password(payload.otp, token.otp_hash):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    user.password_hash = hash_password(payload.new_password)
    await user.save()
    token.used = True
    await token.save()
    return {"message": "Password changed successfully. Please sign in again."}


@router.post("/change-password")
async def change_password(payload: ChangePasswordRequest, user: User = Depends(get_current_user)):
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if payload.current_password == payload.new_password:
        raise HTTPException(status_code=400, detail="New password must be different")
    user.password_hash = hash_password(payload.new_password)
    await user.save()
    await notify_user(str(user.id), "Password changed", "Your GlowCare password was changed successfully.", "security")
    return {"message": "Password changed successfully."}


@router.post("/validate-reset-otp")
async def validate_reset_otp(payload: VerifyEmailRequest):
    """Validate an OTP before showing the reset-password form; does not consume it."""
    user = await User.find_one(User.email == str(payload.email).lower())
    token = await PasswordResetToken.find_one(
        PasswordResetToken.user_id == str(user.id), PasswordResetToken.purpose == "password_reset", PasswordResetToken.used == False
    ) if user else None
    if not token or otp_expired(token.expires_at) or not verify_password(payload.otp, token.otp_hash):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    return {"message": "OTP verified."}


@router.post("/verify-email")
async def verify_email(payload: VerifyEmailRequest):
    user = await User.find_one(User.email == str(payload.email).lower())
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    token = await PasswordResetToken.find_one(
        PasswordResetToken.user_id == str(user.id), PasswordResetToken.purpose == "email_verification", PasswordResetToken.used == False
    )
    if not token or otp_expired(token.expires_at) or not verify_password(payload.otp, token.otp_hash):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    user.is_email_verified = True
    token.used = True
    await user.save()
    await token.save()
    return {"message": "Email verified successfully."}


@router.post("/resend-verification", status_code=status.HTTP_202_ACCEPTED)
async def resend_verification(payload: ForgotPasswordRequest):
    if not get_settings().email_enabled:
        raise HTTPException(status_code=503, detail="Email delivery is not configured. Set SMTP_USERNAME, SMTP_PASSWORD and SMTP_FROM in .env.")
    user = await User.find_one(User.email == str(payload.email).lower())
    if user and not user.is_email_verified:
        await _send_verification_otp(user)
    return {"message": "If verification is required, a new OTP has been sent."}


async def _send_verification_otp(user: User) -> None:
    otp = f"{secrets.randbelow(1_000_000):06d}"
    await PasswordResetToken.find(
        PasswordResetToken.user_id == str(user.id), PasswordResetToken.purpose == "email_verification", PasswordResetToken.used == False
    ).update({"$set": {"used": True}})
    await PasswordResetToken(user_id=str(user.id), otp_hash=hash_password(otp), purpose="email_verification").insert()
    await send_email(user.email, "Verify your GlowCare email", f"Your GlowCare verification OTP is {otp}. It expires in 15 minutes.")

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

    await notify_user(str(user.id), "Welcome to GlowCare", "Your account was created successfully. Please verify your email to secure your account.", "account")
    if get_settings().email_enabled:
        await _send_verification_otp(user)

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
            "is_email_verified": user.is_email_verified,
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
            "is_email_verified": user.is_email_verified,
            "created_at": user.created_at
        }
    }

# =====================================================
# ROLE-SPECIFIC LOGIN
# =====================================================

@router.post("/doctor-login", response_model=TokenResponse)
async def doctor_login(form_data: OAuth2PasswordRequestForm = Depends()):
    return await _login_for_role(form_data, "doctor")


@router.post("/admin-login", response_model=TokenResponse)
async def admin_login(form_data: OAuth2PasswordRequestForm = Depends()):
    return await _login_for_role(form_data, "admin")


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
            get_settings().secret_key,
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
