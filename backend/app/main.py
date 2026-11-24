import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import get_settings
from app.config.db import init_db
from app.services.reminder_service import reminder_loop

from app.routes import (
    admin_routes,
    alert_routes,
    appointment_routes,
    call_routes,
    auth_routes,
    doctor_routes,
    prediction_routes,
    report_routes,
    user_routes,
    prescription_routes,
    notification_routes,
    reminder_routes,
    feedback_routes,
    contact_routes,
)


# ==========================================
# SETTINGS
# ==========================================

settings = get_settings()


# ==========================================
# APPLICATION LIFESPAN
# ==========================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    # Initialize MongoDB + Beanie models
    await init_db()
    reminder_task = asyncio.create_task(reminder_loop())
    try:
        yield
    finally:
        reminder_task.cancel()


# ==========================================
# FASTAPI APP
# ==========================================

app = FastAPI(
    title="GlowCare Pregnancy Risk API",
    version="1.0.0",
    description=(
        "Secure backend for maternal health "
        "monitoring and risk prediction."
    ),
    lifespan=lifespan,
)


# ==========================================
# CORS
# ==========================================

cors_origins = [
    origin.strip()
    for origin in settings.cors_origin_list
    if origin.strip()
]
default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://pregnancy-risk-app-olive.vercel.app",
]
for origin in default_origins:
    if origin not in cors_origins:
        cors_origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request, exc: Exception):
    import logging
    logging.getLogger(__name__).exception(f"Unhandled server error on {request.method} {request.url.path}: {exc}")
    from fastapi.responses import JSONResponse
    origin = request.headers.get("origin") or "https://pregnancy-risk-app-olive.vercel.app"
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc) or "Internal server error"},
        headers={
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
        }
    )


# ==========================================
# API ROUTES
# All routes start with /api
# ==========================================

for router in (
    auth_routes.router,
    user_routes.router,
    doctor_routes.router,
    admin_routes.router,
    prediction_routes.router,
    report_routes.router,
    alert_routes.router,
    appointment_routes.router,
    call_routes.router,
    prescription_routes.router,
    notification_routes.router,
    reminder_routes.router,
    feedback_routes.router,
    contact_routes.router,
):
    app.include_router(
        router,
        prefix="/api",
    )


# ==========================================
# ROOT
# ==========================================

@app.get(
    "/",
    tags=["Health"],
)
def root():

    return {
        "message": "GlowCare API is running",
        "docs": "/docs",
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get(
    "/health",
    tags=["Health"],
)
def health():

    return {
        "status": "ok",
    }
