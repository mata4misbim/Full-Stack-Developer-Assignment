# StoreFront Management System — Backend

REST API สำหรับระบบ Marketplace ระหว่าง Seller และ Buyer
พัฒนาด้วย Django REST Framework และ JWT Authentication

---

# Tech Stack

| Component      | Technology                                  |
| -------------- | ------------------------------------------- |
| Language       | Python                                      |
| Framework      | Django 6.0.6 + Django REST Framework 3.17.1 |
| Database       | SQLite (`db.sqlite3`)                       |
| Authentication | JWT (`djangorestframework-simplejwt 5.5.1`) |
| CORS           | `django-cors-headers 4.9.0`                 |
| Image Upload   | Pillow 12.2.0                               |

---

# Testing

The backend includes unit tests for critical application flows.

Test coverage includes:

- User authentication
- Product creation
- Cart functionality
- Order checkout flow
- Inventory stock updates

Run tests using:

```bash
python manage.py test
```

The tests focus on validating critical business logic and API behavior.

# Project Structure

```bash
backend/
├── core/                  # Main project configuration
│   ├── settings.py        # Global settings
│   └── urls.py            # Root URLs
│
├── users/                 # Authentication (Register / Login)
├── products/              # Product management (CRUD)
├── cart/                  # Shopping cart
├── orders/                # Orders / Checkout
│
├── media/                 # Uploaded product images
├── manage.py
└── db.sqlite3             # SQLite database
```

---

# Setup & Installation

## 1. Activate Virtual Environment

### Windows

```bash
venv\Scripts\activate
```

### Mac / Linux

```bash
source venv/bin/activate
```

---

## 2. Install Dependencies

```bash
pip install -r requirements.txt
```

If `requirements.txt` does not exist:

```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers pillow
```

---

## 3. Run Database Migration

```bash
python manage.py migrate
```

---

## 4. Start Development Server

```bash
python manage.py runserver
```

Server URL:

```txt
http://localhost:8000
```

---

# Environment Variables

Current development settings are configured directly inside `settings.py`.

For production environments, sensitive values should be moved to environment variables.

| Variable               | Current Value  | Description                           |
| ---------------------- | -------------- | ------------------------------------- |
| SECRET_KEY             | In settings.py | Used for encryption and token signing |
| DEBUG                  | True           | Must be False in production           |
| ALLOWED_HOSTS          | []             | Add real domains when deploying       |
| CORS_ALLOW_ALL_ORIGINS | True           | Restrict origins in production        |

---

# API Endpoints

---

## Authentication — `/api/auth/`

| Method | Endpoint                   | Auth Required | Description                  |
| ------ | -------------------------- | ------------- | ---------------------------- |
| POST   | `/api/auth/register/`      | No            | Register new user            |
| POST   | `/api/auth/login/`         | No            | Login and receive JWT tokens |
| POST   | `/api/auth/login/refresh/` | No            | Refresh access token         |

### Register Request Example

```json
{
  "username": "metha",
  "email": "metha@example.com",
  "password": "yourpassword",
  "role": "seller"
}
```

### Login Response Example

```json
{
  "access": "eyJ...",
  "refresh": "eyJ..."
}
```

---

## Products — `/api/products/`

| Method | Endpoint              | Auth Required | Description        |
| ------ | --------------------- | ------------- | ------------------ |
| GET    | `/api/products/`      | No            | Get all products   |
| POST   | `/api/products/`      | Yes (Seller)  | Create new product |
| GET    | `/api/products/{id}/` | No            | Get product detail |
| PUT    | `/api/products/{id}/` | Yes           | Update product     |
| DELETE | `/api/products/{id}/` | Yes           | Delete product     |

---

## Cart — `/api/cart/`

| Method | Endpoint          | Auth Required | Description             |
| ------ | ----------------- | ------------- | ----------------------- |
| GET    | `/api/cart/`      | Yes           | Get current user's cart |
| POST   | `/api/cart/`      | Yes           | Add product to cart     |
| DELETE | `/api/cart/{id}/` | Yes           | Remove item from cart   |

---

## Orders — `/api/orders/`

| Method | Endpoint       | Auth Required | Description               |
| ------ | -------------- | ------------- | ------------------------- |
| GET    | `/api/orders/` | Yes           | Get order history         |
| POST   | `/api/orders/` | Yes           | Checkout and create order |

---

# Authentication

Protected endpoints require JWT access token in request headers:

```http
Authorization: Bearer <access_token>
```

---

# Architectural Decisions

## Django REST Framework

Chosen for:

- ModelSerializer support
- Generic Views
- Rapid API development
- Reduced boilerplate code

---

## SQLite

Chosen because:

- Lightweight
- Easy setup
- Suitable for development and technical assignments

---

## JWT Authentication

Used because:

- Stateless authentication
- Scalable API design
- No server-side session storage required

---

## App-Based Structure

Project is separated into:

- `users`
- `products`
- `cart`
- `orders`

This improves:

- maintainability
- separation of concerns
- scalability

---

## CORS Allow All

Enabled during development to allow frontend applications (React) to connect easily.

Production environments should restrict allowed origins.

---

# Core Features

- JWT Authentication
- Seller / Buyer role system
- Product CRUD
- Product image upload
- Shopping cart
- Checkout system
- Order history
- Inventory stock update

---

# Future Improvements

Potential improvements for production environments:

- Docker support
- CI/CD pipeline
- PostgreSQL
- Product filtering & search
- Pagination
- Cloud image storage (AWS S3 / Cloudinary)
- Unit & integration test coverage expansion

---

# StoreFront Management System — Frontend

Frontend application สำหรับระบบ Marketplace ระหว่าง Seller และ Buyer
พัฒนาด้วย React และ Vite

---

# Tech Stack

| Component         | Technology       |
| ----------------- | ---------------- |
| Framework         | React            |
| Build Tool        | Vite             |
| Language          | JavaScript       |
| Routing           | React Router DOM |
| API Communication | Fetch API        |
| Styling           | CSS              |

---

# Features

- User authentication (Register / Login)
- JWT token handling
- Product listing
- Product detail page
- Seller product management
- Shopping cart
- Checkout system
- Order history
- Product image upload

---

# Project Structure

```bash id="ck1l6i"
frontend/
├── public/
├── src/
│
│   ├── assets/                  # Static assets
│
│   ├── components/              # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductModal.jsx
│   │   └── CartProductCard.jsx
│   │
│   ├── pages/                   # Application pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ProductList.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── ManageProducts.jsx
│   │   ├── Cart.jsx
│   │   └── OrderHistory.jsx
│   │
│   ├── api.js                   # Fetch API requests
│   ├── App.jsx
│   ├── main.jsx
│   ├── App.css
│   └── index.css
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

# Installation & Setup

## 1. Install Dependencies

```bash id="1jlwm8"
npm install
```

---

## 2. Start Development Server

```bash id="2jlwm8"
npm run dev
```

Frontend will run at:

```txt id="3jlwm8"
http://localhost:5173
```

---

# Build for Production

```bash id="4jlwm8"
npm run build
```

---

# Environment Variables

Create `.env` file in the project root:

```env id="5jlwm8"
VITE_API_URL=http://localhost:8000/api
```

---

# Backend Connection

This frontend connects to the Django REST API backend.

Default backend URL:

```txt id="6jlwm8"
http://localhost:8000/api
```

---

# Authentication

JWT access tokens are stored on the client side and attached to protected API requests.

Example Authorization header:

```http id="7jlwm8"
Authorization: Bearer <access_token>
```

---

# API Communication

The frontend communicates with the backend using the native Fetch API.

A centralized API configuration is used to:

- manage the backend base URL
- attach JWT access tokens automatically
- simplify authenticated requests

Example configuration:

```javascript id="jlwmapi"
export const BASE_URL = "http://127.0.0.1:8000";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
```

This approach helps reduce duplicated request logic across the application.

---

# Core Pages

| Page           | Description                    |
| -------------- | ------------------------------ |
| Login          | User authentication            |
| Register       | Create buyer or seller account |
| ProductList    | Display all products           |
| ProductDetail  | Show product information       |
| ManageProducts | Seller product management      |
| Cart           | Shopping cart                  |
| OrderHistory   | User order history             |

---

# Architectural Decisions

## React + Vite

Chosen because:

- Fast development experience
- Lightweight tooling
- Simple configuration
- Fast hot reload

---

## Component-Based Structure

UI is separated into reusable components to improve:

- maintainability
- scalability
- readability

---

## Fetch API

Used because:

- Built directly into the browser
- Lightweight
- No additional dependency required

---

# Core Features

- JWT Authentication
- Seller / Buyer role system
- Product CRUD
- Product image upload
- Shopping cart
- Checkout system
- Order history
- Inventory stock updates

---

# Future Improvements

Potential improvements for production environments:

- Global state management
- Pagination
- Product filtering & search
- Responsive mobile optimization
- Better error handling
- Loading states / skeleton UI
- Unit testing

---
