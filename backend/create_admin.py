from app.config.db import SessionLocal
from app.models.user_model import User
from app.config.security import hash_password

def create_admin():
    db = SessionLocal()

    # check if admin already exists
    existing_admin = db.query(User).filter(User.email == "admin@test.com").first()

    if existing_admin:
        print("❌ Admin already exists")
    else:
        admin = User(
    name="Admin", 
    email="admin@test.com",
    password_hash=hash_password("12345678"),
    role="admin",
    is_active=True
)

        db.add(admin)
        db.commit()
        print("✅ Admin created successfully")

    db.close()


if __name__ == "__main__":
    create_admin()