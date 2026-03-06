# E-commerce Web Application - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Local Development Setup](#local-development-setup)
6. [API Documentation](#api-documentation)
7. [Deployment Guide](#deployment-guide)
8. [Testing](#testing)
9. [Security](#security)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

A full-stack e-commerce web application built with React (Frontend) and FastAPI (Backend), using PostgreSQL (Neon) as the database. The application supports customer shopping flows and admin management capabilities.

### Key Capabilities
- **Customer Features**: Browse products, search/filter, shopping cart, checkout, order history
- **Admin Features**: Product management (CRUD), order management, status updates
- **Authentication**: JWT-based authentication with role-based access control
- **Database**: PostgreSQL via Neon for both local and production environments

---

## Features

### Customer Features
- User registration and login
- Product browsing with category filtering and search
- Shopping cart management (add, update, remove items)
- Secure checkout process
- Order history and tracking
- User profile management

### Admin Features
- Admin dashboard
- Product management (Create, Read, Update, Delete)
- Inventory management
- Order management and status updates
- View all customer orders

---

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS 3
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI 0.124+
- **Server**: Uvicorn (ASGI)
- **ORM**: SQLAlchemy 2.0
- **Authentication**: JWT (python-jose) + Passlib (pbkdf2_sha256)
- **Validation**: Pydantic 2.0
- **Database Driver**: psycopg2-binary

### Database
- **Production & Local**: PostgreSQL (via Neon)
- **Connection**: Environment variable `DATABASE_URL`

### Deployment
- **Backend Hosting**: Render (Web Service)
- **Frontend Hosting**: Render (Static Site)
- **Database**: Neon (Managed PostgreSQL)

---

## Project Structure

```
Ecommerce_webapp/
├── backend/
│   ├── routers/
│   │   ├── users.py          # User authentication endpoints
│   │   ├── products.py        # Product CRUD endpoints
│   │   └── orders.py          # Order management endpoints
│   ├── tests/
│   │   └── test_main.py       # Integration tests
│   ├── main.py                # FastAPI app entry point
│   ├── database.py            # Database configuration
│   ├── models.py              # SQLAlchemy models
│   ├── schemas.py             # Pydantic schemas
│   ├── crud.py                # Database operations
│   ├── auth.py                # Authentication logic
│   ├── seed.py                # Database seeding script
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (gitignored)
│   └── .env.example           # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── config/
│   │   │   └── api.js         # Axios configuration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env                   # Frontend env vars (gitignored)
├── venv/                      # Python virtual environment
├── README.md
├── Render_Deployment_Guide.md
├── architectural_design_document.md
├── business_requirements_document.md
├── ui_ux_wireframes.md
└── client_requirements.md
```

---

## Local Development Setup

### Prerequisites
- **Node.js**: v18.17+ (v20+ recommended)
- **Python**: 3.10+
- **Git**: Latest version
- **Neon Account**: For PostgreSQL database

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd Ecommerce_webapp
```

### Step 2: Backend Setup

1. **Create Virtual Environment**:
   ```bash
   python -m venv venv
   ```

2. **Activate Virtual Environment**:
   - **Windows**: `venv\Scripts\activate`
   - **Mac/Linux**: `source venv/bin/activate`

3. **Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     copy .env.example .env
     ```
   - Update `.env` with your Neon database URL:
     ```
     SECRET_KEY=your-secret-key-here
     DATABASE_URL=postgresql://user:password@host/database?sslmode=require
     ```

5. **Seed the Database**:
   ```bash
   python seed.py
   ```
   This creates:
   - Admin user: `admin@shop.com` / `admin123`
   - Customer user: `user@shop.com` / `user123`
   - Sample products

6. **Run Backend Server**:
   ```bash
   uvicorn main:app --reload
   ```
   Backend will be available at `http://localhost:8000`
   API Docs: `http://localhost:8000/docs`

### Step 3: Frontend Setup

1. **Navigate to Frontend**:
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Create `.env` file:
     ```bash
     echo VITE_API_URL=http://localhost:8000 > .env
     ```

4. **Run Frontend Server**:
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

### Step 4: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

**Test Credentials**:
- Admin: `admin@shop.com` / `admin123`
- Customer: `user@shop.com` / `user123`

---

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

#### Login
```http
POST /token
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=password123
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

#### Get Current User
```http
GET /users/me
Authorization: Bearer <token>
```

### Product Endpoints

#### List Products
```http
GET /products/?skip=0&limit=100&category=Electronics&search=phone
```

#### Get Product by ID
```http
GET /products/{product_id}
```

#### Create Product (Admin Only)
```http
POST /products/
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Description",
  "price": 99.99,
  "stock_quantity": 50,
  "category": "Electronics",
  "image_url": "https://example.com/image.jpg"
}
```

#### Update Product (Admin Only)
```http
PUT /products/{product_id}
Authorization: Bearer <admin-token>
```

#### Delete Product (Admin Only)
```http
DELETE /products/{product_id}
Authorization: Bearer <admin-token>
```

### Order Endpoints

#### Create Order
```http
POST /orders/
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {"product_id": 1, "quantity": 2}
  ],
  "shipping_address": "123 Main St, City, Country"
}
```

#### Get User Orders
```http
GET /orders/
Authorization: Bearer <token>
```

#### Get All Orders (Admin Only)
```http
GET /orders/
Authorization: Bearer <admin-token>
```

#### Update Order Status (Admin Only)
```http
PUT /orders/{order_id}/status?status=Shipped
Authorization: Bearer <admin-token>
```

---

## Deployment Guide

### Prerequisites
- GitHub account
- Neon account (neon.tech)
- Render account (render.com)

### Part 1: Prepare Code for Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify `.gitignore`**:
   Ensure these are gitignored:
   - `venv/`
   - `backend/.env`
   - `frontend/.env`
   - `backend/__pycache__/`
   - `frontend/node_modules/`

### Part 2: Database Setup (Neon)

1. Log in to **Neon Console** (neon.tech)
2. Create a **New Project**
3. Copy the **Connection String** from Dashboard
4. Keep it safe for the next steps

### Part 3: Backend Deployment (Render)

1. **Create Web Service**:
   - Go to Render Dashboard
   - Click **New +** → **Web Service**
   - Connect your GitHub repository

2. **Configure Service**:
   - **Name**: `ecommerce-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`

3. **Environment Variables**:
   Add these in the Environment tab:
   - `DATABASE_URL`: Your Neon connection string
   - `SECRET_KEY`: Generate a random string (e.g., `openssl rand -hex 32`)
   - `ALLOWED_ORIGINS`: (Leave blank, will update after frontend deployment)

4. **Deploy**:
   - Click **Create Web Service**
   - Wait for deployment to complete
   - **Copy the Service URL** (e.g., `https://ecommerce-backend.onrender.com`)

5. **Seed Database** (One-time):
   - Go to **Settings** → **Build & Deploy**
   - Temporarily change **Start Command** to:
     ```
     python seed.py && uvicorn main:app --host 0.0.0.0 --port 10000
     ```
   - Click **Save Changes** (triggers redeploy)
   - After successful deploy, change back to:
     ```
     uvicorn main:app --host 0.0.0.0 --port 10000
     ```

### Part 4: Frontend Deployment (Render)

1. **Create Static Site**:
   - Click **New +** → **Static Site**
   - Connect the same GitHub repository

2. **Configure Site**:
   - **Name**: `ecommerce-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Environment Variables**:
   - `VITE_API_URL`: Your backend URL from Part 3

4. **Deploy**:
   - Click **Create Static Site**
   - Wait for deployment
   - **Copy the Site URL** (e.g., `https://ecommerce-frontend.onrender.com`)

### Part 5: Connect Frontend and Backend

1. Go back to **Backend Web Service** in Render
2. Navigate to **Environment** tab
3. Update `ALLOWED_ORIGINS` with your frontend URL
4. Click **Save Changes** (triggers redeploy)

### Part 6: Verification

1. Open your frontend URL
2. Login with: `admin@shop.com` / `admin123`
3. Test:
   - Browse products
   - Add to cart
   - Checkout
   - View orders in admin dashboard

---

## Testing

### Backend Tests

Run integration tests:
```bash
cd backend
pytest
```

### Manual Testing Checklist

**Customer Flow**:
- [ ] Register new user
- [ ] Login
- [ ] Browse products
- [ ] Search products
- [ ] Filter by category
- [ ] Add product to cart
- [ ] Update cart quantities
- [ ] Remove from cart
- [ ] Checkout
- [ ] View order history

**Admin Flow**:
- [ ] Login as admin
- [ ] Access admin dashboard
- [ ] Create new product
- [ ] Update product
- [ ] Delete product
- [ ] View all orders
- [ ] Update order status

---

## Security

### Implemented Security Measures

1. **Authentication**:
   - JWT tokens with 30-minute expiration
   - Password hashing using pbkdf2_sha256
   - Role-based access control (Customer/Admin)

2. **Data Protection**:
   - HTTPS enforced in production
   - Environment variables for sensitive data
   - Database credentials never committed to Git

3. **Input Validation**:
   - Pydantic schemas validate all API inputs
   - SQL injection prevention via SQLAlchemy ORM

4. **CORS**:
   - Configured to allow only specific frontend origins
   - Credentials support enabled

### Security Best Practices

- Never commit `.env` files
- Rotate `SECRET_KEY` regularly
- Use strong passwords for admin accounts
- Keep dependencies updated
- Monitor Render logs for suspicious activity

---

## Troubleshooting

### Common Issues

#### Backend Won't Start

**Error**: `DATABASE_URL environment variable is required`
- **Solution**: Ensure `.env` file exists in `backend/` with valid `DATABASE_URL`

**Error**: `ModuleNotFoundError`
- **Solution**: Activate venv and run `pip install -r requirements.txt`

#### Frontend Build Fails

**Error**: `Node version mismatch`
- **Solution**: Upgrade Node.js to v20+ or downgrade Vite to v5.4.11

**Error**: `VITE_API_URL is undefined`
- **Solution**: Create `frontend/.env` with `VITE_API_URL=http://localhost:8000`

#### CORS Errors

**Error**: `Access to fetch blocked by CORS policy`
- **Solution**: 
  - Check `ALLOWED_ORIGINS` in backend `.env`
  - Ensure frontend URL is added to `ALLOWED_ORIGINS`
  - Restart backend server

#### Database Connection Issues

**Error**: `could not connect to server`
- **Solution**: 
  - Verify Neon connection string is correct
  - Check if `postgres://` needs to be `postgresql://`
  - Ensure `?sslmode=require` is appended

#### Render Deployment Fails

**Error**: `unexpected EOF while looking for matching backtick`
- **Solution**: Remove any trailing backticks from Start Command

**Error**: `Build failed`
- **Solution**: 
  - Check Render logs for specific error
  - Verify `requirements.txt` or `package.json` is correct
  - Ensure Root Directory is set correctly

### Getting Help

- **Backend API Docs**: Visit `/docs` endpoint for interactive API documentation
- **Render Logs**: Check deployment logs in Render dashboard
- **Database**: Use Neon console to verify data

---

## Maintenance

### Regular Tasks

1. **Update Dependencies**:
   ```bash
   # Backend
   pip install --upgrade -r requirements.txt
   
   # Frontend
   npm update
   ```

2. **Database Backups**:
   - Neon provides automatic backups
   - Export data periodically for redundancy

3. **Monitor Performance**:
   - Check Render metrics
   - Review API response times
   - Monitor database query performance

### Scaling Considerations

- **Backend**: Render auto-scales based on traffic
- **Database**: Upgrade Neon plan for more connections
- **Frontend**: Static sites scale automatically on Render

---

## License

This project is for educational purposes.

## Support

For issues or questions, refer to:
- Backend API Documentation: `/docs` endpoint
- Project Documentation: This file
- Deployment Guide: `Render_Deployment_Guide.md`
