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

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
