from sqlalchemy.orm import Session
import models, schemas
# Removed passlib import from here

# User API
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    # Import auth here to avoid circular dependency
    import auth
    hashed_password = auth.get_password_hash(user.password)
    # First user is admin for simplicity, or hardcode specific logic
    # Here default is customer.
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role="customer"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Product API
def get_products(db: Session, skip: int = 0, limit: int = 100, category: str = None, search: str = None):
    query = db.query(models.Product)
    if category:
        query = query.filter(models.Product.category == category)
    if search:
        query = query.filter(models.Product.name.contains(search))
    return query.offset(skip).limit(limit).all()

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: schemas.ProductCreate):
    db_product = get_product(db, product_id)
    if db_product:
        for key, value in product.dict().items():
            setattr(db_product, key, value)
        db.commit()
        db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if db_product:
        db.delete(db_product)
        db.commit()
    return db_product

# Order API
def create_order(db: Session, order: schemas.OrderCreate, user_id: int):
    # Calculate Total & Verify Stock
    total_amount = 0.0
    items_to_add = []
    
    for item in order.items:
        product = get_product(db, item.product_id)
        if not product or product.stock_quantity < item.quantity:
            raise Exception(f"Product {item.product_id} not available or insufficient stock")
        
        total_amount += product.price * item.quantity
        
        # Deduct stock
        product.stock_quantity -= item.quantity
        
        db_item = models.OrderItem(
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_purchase=product.price
        )
        items_to_add.append(db_item)
    
    db_order = models.Order(
        user_id=user_id,
        total_amount=total_amount,
        shipping_address=order.shipping_address,
        status="Processing"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Add items
    for db_item in items_to_add:
        db_item.order_id = db_order.id
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def get_user_orders(db: Session, user_id: int):
    return db.query(models.Order).filter(models.Order.user_id == user_id).all()

def get_all_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Order).offset(skip).limit(limit).all()

def update_order_status(db: Session, order_id: int, status: str):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if order:
        order.status = status
        db.commit()
        db.refresh(order)
    return order
