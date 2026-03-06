from database import SessionLocal, engine
from models import Base, User, Product
from auth import get_password_hash

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

    # 3. Create Products — 20+ across 5 categories
    products = [
        # ── Electronics ──────────────────────────────────────────────
        Product(
            name="Wireless Noise-Cancelling Headphones",
            description="Premium over-ear headphones with 40hr battery life, active noise cancellation, and Hi-Res audio. Perfect for music lovers and remote workers.",
            price=199.99,
            stock_quantity=50,
            category="Electronics",
            image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
        ),
        Product(
            name="Smartphone 15 Pro Max",
            description="Flagship smartphone with a 200MP camera system, titanium body, 4K ProRes video, and all-day battery. The ultimate mobile experience.",
            price=1199.00,
            stock_quantity=25,
            category="Electronics",
            image_url="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80"
        ),
        Product(
            name="4K Ultra HD Smart TV 55\"",
            description="Stunning 55-inch OLED display with Dolby Vision, HDR10+, built-in streaming apps, voice control, and ultra-thin bezel design.",
            price=899.00,
            stock_quantity=15,
            category="Electronics",
            image_url="https://images.unsplash.com/photo-1593359677879-a4bb92f4a1cf?w=600&auto=format&fit=crop&q=80"
        ),
        Product(
            name="Mechanical Gaming Keyboard",
            description="RGB backlit 100% mechanical keyboard with Cherry MX switches, aluminum frame, per-key lighting, and macro support for pro gamers.",
            price=149.99,
            stock_quantity=60,
            category="Electronics",
            image_url="https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&auto=format&fit=crop&q=80"
        ),
        Product(
            name="Wireless Charging Pad Pro",
            description="15W fast wireless charger compatible with all Qi devices. Slim, minimalist design with LED indicator and anti-slip surface.",
            price=39.99,
            stock_quantity=120,
            category="Electronics",
            image_url="https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&auto=format&fit=crop&q=80"
        ),
        Product(
            name="True Wireless Earbuds",
            description="Compact wireless earbuds with 6hr playtime, IPX5 water resistance, touch controls, and crystal-clear call quality.",
            price=89.99,
            stock_quantity=80,
            category="Electronics",
            image_url="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80"
        ),

        # ── Fashion ───────────────────────────────────────────────────
        Product(
            name="Premium Oxford Dress Shirt",
            description="Crafted from 100% Egyptian cotton, this slim-fit dress shirt features a spread collar, mother-of-pearl buttons, and wrinkle-resistant fabric.",
            price=79.99,
            stock_quantity=90,
            category="Fashion",
            image_url="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80"
        ),
        Product(
            name="Leather Crossbody Bag",
            description="Handcrafted full-grain leather crossbody bag with brass hardware, adjustable strap, interior organizer pockets, and a timeless minimalist look.",
            price=189.00,
            stock_quantity=35,
            category="Fashion",
            image_url="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80"
        ),
        Product(
            name="Ultralight Running Shoes",
            description="Engineered for speed and comfort, these running shoes feature carbon-fiber plate, responsive foam midsole, and breathable flyknit upper.",
            price=129.99,
            stock_quantity=45,
            category="Fashion",
            image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
        ),
        Product(
            name="Classic Aviator Sunglasses",
            description="Iconic polarized aviator sunglasses with UV400 protection, gold metal frame, gradient lenses, and a spring-loaded hinge for a perfect fit.",
            price=59.99,
            stock_quantity=100,
            category="Fashion",
            image_url="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80"
        ),
        Product(
            name="Slim Fit Chino Trousers",
            description="Versatile stretch-cotton chino trousers in a modern slim fit. Perfect for office or casual wear, available in multiple tones.",
            price=64.99,
            stock_quantity=75,
            category="Fashion",
            image_url="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80"
        ),

        # ── Home ──────────────────────────────────────────────────────
        Product(
            name="Scandinavian 3-Seat Sofa",
            description="Timeless Scandinavian design sofa with solid oak legs, high-density foam cushions, and removable washable covers in premium woven fabric.",
            price=799.00,
            stock_quantity=8,
            category="Home",
            image_url="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
        ),
        Product(
            name="Ceramic Coffee Pour-Over Set",
            description="Artisan ceramic dripper and server set for the perfect morning brew. Hand-thrown pottery with natural glaze, fits up to 4 cups.",
            price=49.99,
            stock_quantity=60,
            category="Home",
            image_url="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80"
        ),
        Product(
            name="Adjustable LED Desk Lamp",
            description="Architect-style LED desk lamp with 5 color temperatures, stepless dimming, USB-C charging port, and clamp mount for any desk.",
            price=69.99,
            stock_quantity=40,
            category="Home",
            image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"
        ),
        Product(
            name="Bamboo Cutting Board Set",
            description="Eco-friendly set of 3 bamboo cutting boards in graduated sizes, with juice grooves, non-slip feet, and natural antibacterial properties.",
            price=34.99,
            stock_quantity=90,
            category="Home",
            image_url="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=80"
        ),

        # ── Sports ────────────────────────────────────────────────────
        Product(
            name="Pro Yoga Mat — 6mm",
            description="Non-slip, extra-thick 6mm yoga mat made from natural tree rubber with alignment lines, carrying strap, and moisture-wicking surface.",
            price=54.99,
            stock_quantity=70,
            category="Sports",
            image_url="https://images.unsplash.com/photo-1601925228068-b0d4a44b78ba?w=600&auto=format&fit=crop&q=80"
        ),
        Product(
            name="Adjustable Dumbbell Set 5-50lb",
            description="Space-saving adjustable dumbbell set that replaces 15 pairs of weights. Fast dial adjustment system, ergonomic handle, and durable steel construction.",
            price=349.00,
            stock_quantity=20,
            category="Sports",
            image_url="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80"
        ),
        Product(
            name="Stainless Steel Water Bottle 32oz",
            description="Triple-wall vacuum-insulated water bottle keeps drinks cold 48hrs or hot 24hrs. Leak-proof lid, BPA-free, and rugged powder-coat finish.",
            price=29.99,
            stock_quantity=150,
            category="Sports",
            image_url="https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&auto=format&fit=crop&q=80"
        ),
        Product(
            name="GPS Smart Running Watch",
            description="Multi-sport GPS watch with heart rate monitoring, VO2 max tracking, 7-day battery, sleep tracking, and built-in maps navigation.",
            price=299.99,
            stock_quantity=30,
            category="Sports",
            image_url="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80"
        ),

        # ── Beauty ────────────────────────────────────────────────────
        Product(
            name="Hydrating Vitamin C Serum",
            description="Professional-strength 20% Vitamin C serum with hyaluronic acid and ferulic acid. Brightens skin tone, fades dark spots, and boosts collagen — visibly radiant in 4 weeks.",
            price=44.99,
            stock_quantity=85,
            category="Beauty",
            image_url="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop&q=80"
        ),
        Product(
            name="Luxury Perfume — Oud & Rose",
            description="An opulent blend of Bulgarian rose, aged oud wood, and white musk. Long-lasting 12hr projection with beautiful hand-blown glass bottle.",
            price=129.00,
            stock_quantity=40,
            category="Beauty",
            image_url="https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&auto=format&fit=crop&q=80"
        ),
        Product(
            name="Professional Makeup Brush Set",
            description="18-piece vegan makeup brush set with ultra-soft synthetic bristles, rose-gold ferrules, and a magnetic roll-up canvas case.",
            price=39.99,
            stock_quantity=65,
            category="Beauty",
            image_url="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
        ),
    ]

    for p in products:
        db.add(p)

    db.commit()
    print(f"Seeding completed! Added {len(products)} products.")
    db.close()

if __name__ == "__main__":
    seed_data()
