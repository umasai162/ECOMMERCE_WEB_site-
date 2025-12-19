from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import users, products, orders
import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ecommerce API")

# CORS
import os
from dotenv import load_dotenv

load_dotenv()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

# Add allowed origins from env var
env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    origins.extend(env_origins.split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(products.router)
app.include_router(orders.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Ecommerce API"}
