from database import SessionLocal
from models import Order, User

def check_orders():
    db = SessionLocal()
    orders = db.query(Order).all()
    print(f"Total Orders: {len(orders)}")
    for o in orders:
        user = db.query(User).filter(User.id == o.user_id).first()
        print(f"Order #{o.id} | User: {user.email} | Total: ${o.total_amount} | Status: {o.status}")
    db.close()

if __name__ == "__main__":
    check_orders()
