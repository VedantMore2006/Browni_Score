import os
import time

import models
from auth import hash_password
from database import Base, SessionLocal, engine
from fastapi import Depends, FastAPI, Request
from fastapi.exceptions import HTTPException, RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from logger import logger
from routes import admin as admin_routes
from routes import auth as auth_routes
from routes import leaderboard as leaderboard_routes
from routes import members as members_routes
from routes import points as points_routes
from routes import projects as projects_routes
from routes import tasks as tasks_routes
from routes import warnings as warnings_routes

# Create DB tables
Base.metadata.create_all(bind=engine)

# Ensure logs directory exists
os.makedirs("logs", exist_ok=True)

app = FastAPI(
    title="Vitals&Vectors API",
    version="1.0.0",
    description="Backend for the Vitals&Vectors research lab monitoring portal",
)

# ── CORS — allow all origins for Phase 1 local development ──────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request logging middleware ───────────────────────────────────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 1)
    logger.info(f"{request.method} {request.url.path} → {response.status_code} ({duration}ms)")
    return response


# ── Exception handlers ───────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again."}
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    if exc.status_code >= 500:
        logger.error(f"HTTP {exc.status_code}: {exc.detail}")
    elif exc.status_code in (401, 403):
        logger.warning(f"HTTP {exc.status_code}: {exc.detail} [{request.method} {request.url.path}]")
    else:
        logger.debug(f"HTTP {exc.status_code}: {exc.detail} [{request.method} {request.url.path}]")
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    errors = [f"{' → '.join(str(x) for x in e['loc'])}: {e['msg']}" for e in exc.errors()]
    logger.debug(f"Validation error on {request.method} {request.url.path}: {errors}")
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation failed", "errors": errors}
    )


# ── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth_routes.router)
app.include_router(members_routes.router)
app.include_router(points_routes.router)
app.include_router(tasks_routes.router)
app.include_router(warnings_routes.router)
app.include_router(leaderboard_routes.router)
app.include_router(admin_routes.router)
app.include_router(projects_routes.router)


# ── Root & health ────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "Vitals&Vectors API online", "version": "1.0.0"}


@app.get("/health")
def health():
    try:
        from sqlalchemy import text
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"status": "ok", "db": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "degraded", "db": "error"}


# ── Seed admin on startup ────────────────────────────────────────────────────
def seed_admin():
    db = SessionLocal()
    try:
        existing = db.query(models.Member).filter(models.Member.username == "admin").first()
        if existing:
            return
        admin = models.Member(
            name="Lab Lead",
            username="admin",
            password_hash=hash_password("admin123"),
            role="admin",
            points_total=100,
            rank="D",
            status="active",
        )
        db.add(admin)
        db.commit()
        logger.info("Seeded default admin user → username: admin / password: admin123")
    finally:
        db.close()


seed_admin()
