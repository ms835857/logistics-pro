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
2.  **Default Admin Login**:
    *   **Email**: `admin@logistics.com`
    *   **Password**: `admin123`

---

## 📝 6. Features Overview

*   **Dashboard**: View summary statistics.
*   **Orders**: Create, edit, and delete customer orders. (Automatically updates inventory stock).
*   **Inventory**: Manage stock levels. Items will turn **red** when stock is low.
*   **Shipments**: Create and track shipments with a status history timeline.
*   **Suppliers**: Manage your supply partners.

---

## ❓ Troubleshooting

*   **ECONNREFUSED Error**: Ensure your PostgreSQL service is running in Windows Services.
*   **Database "logistics_db" does not exist**: Ensure you created the database in pgAdmin before running `init-db`.
*   **Tailwind CSS Errors**: The project uses Tailwind v4. If you see PostCSS errors, ensure you have run `npm install` in the frontend folder recently.
