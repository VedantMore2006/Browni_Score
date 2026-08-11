from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine, SessionLocal
import models
from auth import hash_password
from routes import auth as auth_routes
from routes import members as members_routes
from routes import points as points_routes
from routes import tasks as tasks_routes
from routes import warnings as warnings_routes
from routes import leaderboard as leaderboard_routes
from routes import admin as admin_routes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vitals&Vectors API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(members_routes.router)
app.include_router(points_routes.router)
app.include_router(tasks_routes.router)
app.include_router(warnings_routes.router)
app.include_router(leaderboard_routes.router)
app.include_router(admin_routes.router)


@app.get("/")
def root():
    return {"status": "Vitals&Vectors API online"}


@app.get("/health")
def health():
    return {"status": "ok"}


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
        print("Seeded default admin user -> username: admin / password: admin123")
    finally:
        db.close()


seed_admin()
