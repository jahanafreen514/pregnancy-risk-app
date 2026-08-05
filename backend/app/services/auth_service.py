from app.config.security import (
    create_access_token,
    hash_password,
    verify_password
)

from app.models.user_model import User
from app.schemas.user_schema import (
    LoginRequest,
    UserRegister
)


async def register(
    payload: UserRegister
) -> User:


    existing = await User.find_one(
        User.email == payload.email.lower()
    )


    if existing:
        raise ValueError(
            "Email already registered"
        )


    allowed_roles = {
        "user",
        "doctor"
    }


    if payload.role not in allowed_roles:
        raise ValueError(
            "Only user or doctor registration is allowed"
        )


    user = User(
        name=payload.name,
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        role=payload.role,
        country_code=payload.countryCode,
        phone=payload.phone,
        selected_doctor=payload.selectedDoctor
    )


    await user.insert()


    return user




async def login(
    payload: LoginRequest
):

    user = await User.find_one(
        User.email == payload.email.lower()
    )


    if (
        not user
        or not user.is_active
        or not verify_password(
            payload.password,
            user.password_hash
        )
    ):
        raise ValueError(
            "Invalid email or password"
        )


    token = create_access_token(
        {
            "sub": str(user.id),
            "role": user.role
        }
    )


    return user, token