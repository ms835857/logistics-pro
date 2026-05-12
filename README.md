# Logistics & Supply Chain Management System

A full-stack web application designed for managing logistics, supply chain inventory, orders, shipments, and suppliers.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Databases:** MongoDB (Mongoose) for Users & Shipments, PostgreSQL (pg) for Orders, Inventory, Suppliers
- **Security:** JWT Authentication, bcryptjs
- **Frontend:** React.js (Vite), TailwindCSS, React Router DOM, Axios

## Installation

### Prerequisites
- Node.js installed
- MongoDB running on `localhost:27017`
- PostgreSQL running on `localhost:5432` with a database named `logistics_db` (or updated `.env`)

### Backend Setup
1. Open terminal and navigate to `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Configure `.env` file (copy from `.env.example` and set your credentials).
4. Run Database Initialization script:
   ```bash
   npm run init-db
   ```
   *This creates PostgreSQL tables and seeds the default admin user.*
5. Start backend server:
   ```bash
   npm run dev
   ```



### Frontend Setup
1. Open a new terminal and navigate to `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite server:
   ```bash
   npm run dev
   ```

## Default Admin Credentials
- **Email:** `admin@logistics.com`
- **Password:** `admin123`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT
- `GET /api/auth/me` - Get current user profile (Protected)

### Orders (Protected)
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order details
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order (Admin only)

### Inventory (Protected)
- `GET /api/inventory` - Get all items
- `GET /api/inventory/low-stock` - Get low stock items
- `GET /api/inventory/:id` - Get single item
- `POST /api/inventory` - Add new item (Admin only)
- `PUT /api/inventory/:id` - Update item (Admin only)
- `PATCH /api/inventory/:id/stock` - Update stock quantity
- `DELETE /api/inventory/:id` - Delete item (Admin only)

### Shipments (Protected)
- `GET /api/shipments` - Get all shipments
- `GET /api/shipments/:id` - Get single shipment
- `GET /api/shipments/track/:trackingNumber` - Track shipment (Public)
- `POST /api/shipments` - Create shipment
- `PATCH /api/shipments/:id/status` - Update status
- `DELETE /api/shipments/:id` - Delete shipment (Admin only)

### Suppliers (Protected)
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get single supplier
- `POST /api/suppliers` - Create supplier (Admin only)
- `PUT /api/suppliers/:id` - Update supplier (Admin only)
- `DELETE /api/suppliers/:id` - Deactivate supplier (Admin only)

## JWT Authentication
Every route except `/register`, `/login`, and `/track/:trackingNumber` requires a valid JWT token passed in the `Authorization` header as a Bearer token.

## Role-Based Access Control (RBAC)

The application implements a full role-based access control system with two distinct user roles: **Admin** and **User**.

### Roles and Permissions

**Admin**
- Has full access to the entire application and all endpoints.
- Can view, edit, and delete any Order, Shipment, Inventory item, or Supplier.
- Has exclusive access to user management (`/admin/users`) to change roles and delete accounts.

**User**
- Has limited access to the application, primarily focused on managing their own data.
- **Orders:** Can only view and cancel their own orders. Cannot delete orders.
- **Shipments:** Can only view shipments associated with their own orders. Cannot create, edit, or delete shipments.
- **Inventory & Suppliers:** Can view inventory levels and supplier details (read-only). Cannot add, edit, or delete items.
- **Profile:** Can update their own name, email, and password.

### Test Credentials

After running `npm run init-db`, the following default accounts are available:

- **Admin Account**
  - Email: `admin@logistics.com`
  - Password: `admin123`

- **User Account**
  - Email: `user@logistics.com`
  - Password: `user123`
