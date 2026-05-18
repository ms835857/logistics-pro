# 📘 LogisticsPro Instruction Manual

This guide provides step-by-step instructions on how to set up, initialize, and run the **Logistics & Supply Chain Management System** on your local machine.

---

## 🛠 1. Prerequisites

Before starting, ensure you have the following installed:
*   **Node.js** (v18 or higher)
*   **PostgreSQL** (Running on port 5432)
*   **MongoDB Community Server** (Running on port 27017)

---

## ⚙️ 2. Database Preparation

### PostgreSQL Setup
1.  Open **pgAdmin 4**.
2.  Connect to your server.
3.  Right-click on **Databases** > **Create** > **Database...**
4.  Name the database exactly: `logistics_db`.
5.  Click **Save**.

### MongoDB Setup
1.  Ensure your MongoDB service is running (usually automatic after installation).
2.  No manual database creation is needed for MongoDB; the app will create it automatically.

---

## 🚀 3. Installation Steps

### Step 1: Backend Setup
1.  Open a terminal in the project root.
2.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  **Initialize the Database**: This script creates the tables and seeds dummy data.
    ```bash
    npm run init-db
    ```

### Step 2: Frontend Setup
1.  Open a **new** terminal in the project root.
2.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

---

## 🏃 4. Running the Application

To run the website, you must have **two terminals** open:

### Terminal 1: Start Backend
Inside the `backend` folder:
```bash
npm run dev
```
*The backend will start at `http://localhost:5000`.*

### Terminal 2: Start Frontend
Inside the `frontend` folder:
```bash
npm run dev
```
*The frontend will start at `http://localhost:5173`.*

---

## 🔑 5. Accessing the Website

1.  Open your browser and go to: `http://localhost:5173/`
2.  **Default Credentials**:
    *   **Admin User**:
        *   **Email**: `admin@logistics.pro`
        *   **Password**: `admin123`
    *   **Client 1 (TechCorp)**:
        *   **Email**: `tech@example.com`
        *   **Password**: `password123`
    *   **Client 2 (RetailMax)**:
        *   **Email**: `pharma@example.com`
        *   **Password**: `password123`

---

## 📝 6. Features Overview

*   **Dashboard**: View summary statistics.
*   **Orders**: Create, edit, and delete customer orders. (Automatically updates inventory stock).
*   **Inventory**: Manage stock levels. Items will turn **red** when stock is low.
*   **Shipments**: Create and track shipments with a status history timeline.
*   **Suppliers**: Manage your supply partners.

---

## 🗄️ 7. Database Integration & Hybrid Architecture

This application employs a **hybrid database model** combining PostgreSQL and MongoDB. They are not joined directly in the database server, but are stitched together at the **Application Layer (Node.js)** using **Manual Service-Layer Merging**.

### How They Connect:
*   **PostgreSQL (Relational Store)**: Manages structured business data requiring transaction safety (Orders, Inventory, Suppliers).
*   **MongoDB (NoSQL Document Store)**: Manages dynamic profiles (User Accounts) and detailed log objects (Shipment history timelines).
*   **Stitching Process**:
    1. PostgreSQL `orders` table holds the MongoDB string ID in a `user_id` column.
    2. MongoDB `shipments` collection holds the PostgreSQL integer ID in its `orderId` field.
    3. The backend queries both databases and joins them programmatically (e.g. stitching MongoDB company details onto PostgreSQL orders) before sending them to the UI.

### How to View the Databases:
*   **MongoDB Compass**:
    1. Open Compass and connect to `mongodb://localhost:27017`.
    2. Navigate to database `logistics_db` > collection `users` to inspect business users, company profiles, and account statuses.
*   **pgAdmin 4**:
    1. Open pgAdmin 4 and connect to your Server.
    2. Open database `logistics_db` > **Schemas** > **public** > **Tables**.
    3. View `orders`, `inventory`, and `suppliers` tables to inspect transactional database records.

---

---

## 🔀 8. Dual-Backend Coexistence & Switching

The system is now powered by **two identical backends** built with different technologies but sharing the same PostgreSQL + MongoDB databases and the exact same REST API endpoints:
1.  **Express Backend (Node.js/JavaScript)**: Located in `/backend`, running on port **`5000`**.
2.  **NestJS Backend (TypeScript)**: Located in `/backend-nest`, running on port **`5001`**.

You can run **either** backend individually, or even run both in parallel since they listen on different ports!

### How to Switch the Frontend Backend Target:
The frontend connects to the backend dynamically via the `VITE_API_BASE_URL` environment variable inside your frontend configuration:

1.  Open the file **`frontend/.env`**.
2.  **To use the Express Backend**:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```
3.  **To use the NestJS Backend**:
    ```env
    VITE_API_BASE_URL=http://localhost:5001/api
    ```
4.  Restart your frontend terminal (`npm run dev`) to apply the change.

---

## 🏗️ 9. Choosing the Right Backend: Comparison & Use Cases

Here is a guide to help you decide which backend to use depending on your development context:

| Feature / Criteria | 🚀 Express Backend (`/backend`) | 🛡️ NestJS Backend (`/backend-nest`) |
| :--- | :--- | :--- |
| **Language** | Plain JavaScript | TypeScript (100% typed) |
| **Architecture** | Minimalist, MVC (Controller-Route-Service structure) | Modular, Enterprise-grade (Module-Controller-Service structure) |
| **Features** | Simple file structure, standard routing | Built-in Dependency Injection, decorators, request validators |
| **Data Integrity** | Manual object mapping | Validation Pipes, strict DTOs (Data Transfer Objects) |
| **Best For** | - Rapid prototyping<br>- Simple custom scripts<br>- Smaller development teams | - Enterprise production systems<br>- Clean scalability and microservices<br>- Strict typed safety requirements |

### Development Recommendations:
*   **Use NestJS if**: You are preparing the project for large-scale production, writing unit/integration tests, or want a rigorous architectural structure where new features are cleanly isolated into encapsulated `@Modules`.
*   **Use Express if**: You want to quickly inspect a raw endpoint without TypeScript compilation overhead, perform quick database migrations, or prefer the simplicity of standard Javascript middleware.

---

## ❓ Troubleshooting

*   **ECONNREFUSED Error**: Ensure your PostgreSQL service is running in Windows Services.
*   **Database "logistics_db" does not exist**: Ensure you created the database in pgAdmin before running `init-db`.
*   **Vite Base URL changes not working**: If your changes to `frontend/.env` are not reflected in the UI, stop the frontend server (`Ctrl+C` in Terminal 2) and run `npm run dev` again to let Vite reload the environment variables.
*   **Tailwind CSS Errors**: The project uses Tailwind v4. If you see PostCSS errors, ensure you have run `npm install` in the frontend folder recently.

