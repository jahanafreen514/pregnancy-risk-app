from collections.abc import Callable

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

from app.config.security import ALGORITHM
from app.config.settings import get_settings
from app.models.user_model import User


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            get_settings().secret_key,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )


    user = await User.get(user_id)

    if not user or not user.is_active:
        raise HTTPException(
            status_code=401,
            detail="Account unavailable"
        )

    return user



def require_roles(*roles: str) -> Callable:

    async def dependency(
        user: User = Depends(get_current_user)
    ) -> User:

        if user.role not in roles:
            raise HTTPException(
                status_code=403,
                detail="Insufficient permissions"
            )

        return user

    return dependency