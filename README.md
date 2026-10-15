# KiranaMitra Backend

This project is a Node.js + Express + MySQL backend for a grocery and local store management application.

## Features

- Authentication using JWT
- User management
- Product management
- Categories
- Cart APIs
- Orders
- Stores
- Delivery
- Payment

## Tech Stack

- Node.js
- Express.js
- MySQL with `mysql2`
- JWT authentication
- CORS
- Multer for file uploads

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a MySQL database and configure `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in `.env`.
3. Select the database configured as `DB_NAME` and run [`database/schema.sql`](./database/schema.sql) to create the 14 tables used by the APIs.
4. Set `JWT_SECRET` in `.env`, then start the server:
   ```bash
   npm run dev
   ```

The API will run on:
   ```bash
   http://localhost:5000
   ```

## API Endpoints

Protected endpoints require `Authorization: Bearer <token>`. JSON request bodies use `Content-Type: application/json`.
Public sign-up creates customer accounts only. Provision the first admin account through a trusted database setup before using admin-only endpoints.

| Feature | Method | Endpoint | Access |
| --- | --- | --- | --- |
| Sign up | POST | `/api/auth/signup` | Public |
| Log in | POST | `/api/auth/login` | Public |
| Profile | GET, PUT | `/api/users/profile` | Authenticated |
| Users | GET, POST | `/api/users` | Admin |
| User by ID | GET, PUT, DELETE | `/api/users/:id` | Admin |
| Products | GET, POST | `/api/products` | Read public, create authenticated |
| Product by ID | GET, PUT, DELETE | `/api/products/:id` | Read public, change authenticated |
| Categories | GET, POST | `/api/categories` | Read public, change authenticated |
| Category by ID | PUT, DELETE | `/api/categories/:id` | Authenticated |
| Cart | GET, POST | `/api/cart` | Authenticated |
| Cart item | PUT, DELETE | `/api/cart/:id` | Authenticated |
| Orders | GET, POST | `/api/orders` | Authenticated |
| Order by ID | GET | `/api/orders/:id` | Authenticated |
| Order status | PUT | `/api/orders/:id/status` | Authenticated |
| Stores | GET, POST | `/api/stores` | Read public, create authenticated |
| Store by ID | GET, PUT, DELETE | `/api/stores/:id` | Read public, change authenticated |
| Deliveries | GET, POST | `/api/deliveries` | Authenticated |
| Delivery status | PUT | `/api/deliveries/:id/status` | Authenticated |
| Payments | GET, POST | `/api/payments` | Authenticated |
| Payment status | PUT | `/api/payments/:id/status` | Admin |

Cart requests use `{ "productId": "<product-id>", "quantity": 2 }`; update requests use `{ "quantity": 3 }`. Delivery creation uses `{ "orderId": "<order-id>", "assignedTo": "<user-id>" }`, where `assignedTo` is optional. Payment creation uses `{ "orderId": "<order-id>", "method": "upi" }`; accepted methods are `cash`, `card`, `upi`, and `wallet`. Payment records use the order total and start as `pending`. This API records payment data and status; no payment-provider charge or verification is configured.

## Project Structure

```bash
kiranamitra_backend/
├── config/
│   └── db.js
├── controllers/
│   ├── auth_controller.js
│   ├── user_controller.js
│   ├── product_controller.js
│   ├── category_controller.js
│   ├── cart_controller.js
│   ├── order_controller.js
│   ├── store_controller.js
│   ├── delivery_controller.js
│   └── payment_controller.js
├── models/
│   ├── user_model.js
│   ├── product_model.js
│   ├── order_model.js
│   └── store_model.js
├── routes/
│   ├── auth_routes.js
│   ├── user_routes.js
│   ├── product_routes.js
│   ├── category_routes.js
│   ├── cart_routes.js
│   ├── order_routes.js
│   ├── store_routes.js
│   ├── delivery_routes.js
│   └── payment_routes.js
├── middleware/
│   └── auth_middleware.js
├── uploads/
├── .env
├── server.js
├── package.json
└── README.md
```
