from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config.settings import get_settings
from app.config.db import init_db

from app.routes import (
    admin_routes,
    admin_doctor_routes,
    alert_routes,
    appointment_routes,
    auth_routes,
    doctor_routes,
    prediction_routes,
    report_routes,
    user_routes,
    prescription_routes
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

    yield


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
# STATIC FILES
# ==========================================

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
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
    admin_doctor_routes.router,
    prediction_routes.router,
    report_routes.router,
    alert_routes.router,
    appointment_routes.router,
    prescription_routes.router,):
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