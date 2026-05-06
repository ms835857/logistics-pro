const { Pool } = require('pg');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/user.schema');
const Shipment = require('../modules/shipments/shipment.schema');

dotenv.config();

const pgPool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});

const initDB = async () => {
    try {
        console.log('Connecting to PostgreSQL...');
        await pgPool.connect();
        console.log('PostgreSQL connected.');

        // 1. Create Tables
        console.log('Creating PostgreSQL tables...');
        
        await pgPool.query(`
            CREATE TABLE IF NOT EXISTS suppliers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                contact_person VARCHAR(100),
                email VARCHAR(150) UNIQUE,
                phone VARCHAR(30),
                address TEXT,
                country VARCHAR(100),
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        await pgPool.query(`
            CREATE TABLE IF NOT EXISTS inventory (
                id SERIAL PRIMARY KEY,
                product_name VARCHAR(150) NOT NULL UNIQUE,
                sku VARCHAR(100) UNIQUE,
                quantity_in_stock INTEGER NOT NULL DEFAULT 0,
                unit_price DECIMAL(10,2),
                warehouse_location VARCHAR(100),
                supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
                low_stock_threshold INTEGER DEFAULT 10,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        await pgPool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                customer_name VARCHAR(100) NOT NULL,
                customer_email VARCHAR(150),
                product_name VARCHAR(150) NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 1,
                total_price DECIMAL(10,2) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        // 2. Seed PostgreSQL Dummy Data
        console.log('Seeding dummy data...');
        
        const supplierCheck = await pgPool.query('SELECT count(*) FROM suppliers');
        if (parseInt(supplierCheck.rows[0].count) === 0) {
            console.log('Seeding suppliers...');
            const s1 = await pgPool.query(`
                INSERT INTO suppliers (name, contact_person, email, phone, address, country) 
                VALUES ('Global Electronics', 'John Doe', 'john@global.com', '123456789', 'Tech Street 101', 'USA') RETURNING id
            `);
            const s2 = await pgPool.query(`
                INSERT INTO suppliers (name, contact_person, email, phone, address, country) 
                VALUES ('Premium Foods Co.', 'Jane Smith', 'jane@premium.com', '987654321', 'Green Valley 42', 'Germany') RETURNING id
            `);

            console.log('Seeding inventory...');
            await pgPool.query(`
                INSERT INTO inventory (product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold) 
                VALUES ('MacBook Pro 14', 'MAC-14-PRO', 15, 1999.99, 'Aisle 1', $1, 5)
            `, [s1.rows[0].id]);
            await pgPool.query(`
                INSERT INTO inventory (product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold) 
                VALUES ('Organic Coffee', 'COF-ORG-500', 8, 15.50, 'Cold Storage', $1, 10)
            `, [s2.rows[0].id]);

            console.log('Seeding orders...');
            await pgPool.query(`
                INSERT INTO orders (customer_name, customer_email, product_name, quantity, total_price, status, supplier_id) 
                VALUES ('Alice Johnson', 'alice@example.com', 'MacBook Pro 14', 1, 1999.99, 'delivered', $1)
            `, [s1.rows[0].id]);
            await pgPool.query(`
                INSERT INTO orders (customer_name, customer_email, product_name, quantity, total_price, status, supplier_id) 
                VALUES ('Bob Wilson', 'bob@example.com', 'Organic Coffee', 2, 31.00, 'pending', $1)
            `, [s2.rows[0].id]);
        }

        // 3. Connect to MongoDB and seed admin/shipments
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        
        const adminEmail = 'admin@logistics.com';
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await User.create({ name: 'Admin', email: adminEmail, password: hashedPassword, role: 'admin' });
            console.log('Admin user seeded.');
        }

        const shipmentCount = await Shipment.countDocuments();
        if (shipmentCount === 0) {
            console.log('Seeding shipments...');
            await Shipment.create({
                orderId: '1',
                driverName: 'Mike Miller',
                vehicleNumber: 'TRUCK-001',
                originAddress: 'Warehouse A',
                destinationAddress: 'Main St 123',
                status: 'in-transit',
                statusHistory: [{ status: 'preparing', note: 'Ready for pickup' }, { status: 'in-transit', note: 'On the way' }]
            });
        }

        console.log('Database initialization and seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error during database initialization:', error);
        process.exit(1);
    }
};

initDB();
