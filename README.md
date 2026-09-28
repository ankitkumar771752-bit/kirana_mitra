# KiranaMitra Backend

This project is a Node.js + Express + MongoDB backend for a grocery and local store management application.

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
- MongoDB with Mongoose
- JWT authentication
- CORS
- Multer for file uploads

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a MongoDB database and update the `.env` file.

3. Start the server:
   ```bash
   npm run dev
   ```

4. The API will run on:
   ```bash
   http://localhost:5000
   ```

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
