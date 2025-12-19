from database import SessionLocal, engine
from models import Base, User, Product
from auth import get_password_hash
from datetime import datetime

def seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if data exists
    if db.query(User).first():
        print("Data already exists. Skipping seed.")
        db.close()
        return

    print("Seeding data...")

    # 1. Create Admin User
    admin_user = User(
        email="admin@shop.com",
        hashed_password=get_password_hash("admin123"),
        full_name="Super Admin",
        role="admin"
    )
    db.add(admin_user)

    # 2. Create Normal User
    normal_user = User(
        email="user@shop.com",
        hashed_password=get_password_hash("user123"),
        full_name="John Doe",
        role="customer"
    )
    db.add(normal_user)

    # 3. Create Products
    products = [
        Product(
            name="Wireless Headphones",
            description="High quality noise cancelling headphones.",
            price=199.99,
            stock_quantity=50,
            category="Electronics",
            image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
        ),
        Product(
             name="Smartphone 13 Pro",
             description="Latest model with stunning camera.",
             price=999.00,
             stock_quantity=20,
             category="Electronics",
             image_url="https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=500&auto=format&fit=crop&q=60"
        ),
        Product(
             name="Men's Casual Shirt",
             description="100% Cotton comfortable shirt.",
             price=49.99,
             stock_quantity=100,
             category="Fashion",
             image_url="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60"
        ),
        Product(
             name="Running Shoes",
             description="Lightweight sneakers for daily run.",
             price=89.99,
             stock_quantity=45,
             category="Fashion",
             image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60"
        ),
        Product(
             name="Modern Sofa",
             description="Comfortable 3-seater sofa for living room.",
             price=599.99,
             stock_quantity=5,
             category="Home",
             image_url="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60"
        ),
    ]

    for p in products:
        db.add(p)

    db.commit()
    print("Seeding completed successfully!")
    db.close()

if __name__ == "__main__":
    seed_data()
