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

        // Reset orders table
        console.log('Dropping old orders table...');
        await pgPool.query('DROP TABLE IF EXISTS orders CASCADE');

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
                total_price DECIMAL(10,2),
                delivery_address VARCHAR(300) NOT NULL,
                notes TEXT,
                invoice_number VARCHAR(50),
                status VARCHAR(50) DEFAULT 'pending',
                supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
                user_id VARCHAR(100),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        // 3. Connect to MongoDB and seed users first so we get their IDs
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log('Clearing old users and shipments...');
        await User.deleteMany({});
        await Shipment.deleteMany({});
        
        const salt = await bcrypt.genSalt(10);
        
        // Seed Admin
        const adminEmail = 'admin@logistics.pro';
        const adminPassword = await bcrypt.hash('admin123', salt);
        
        await User.findOneAndUpdate(
            { email: adminEmail },
            { 
                name: 'System Admin', 
                email: adminEmail, 
                password: adminPassword, 
                role: 'admin',
                is_active: true
            },
            { upsert: true, new: true }
        );
        console.log('Admin user seeded/updated.');

        // Seed Client 1
        const client1Email = 'tech@example.com';
        let client1 = await User.findOneAndUpdate(
            { email: client1Email },
            { 
                name: 'Ahmed Khan', 
                email: client1Email, 
                password: await bcrypt.hash('password123', salt), 
                role: 'user',
                company_name: 'TechCorp Solutions',
                company_address: '123 Business District, Karachi',
                company_phone: '+92-300-1234567',
                industry: 'Technology',
                is_active: true
            },
            { upsert: true, new: true }
        );
        console.log('Client 1 seeded/updated.');

        // Seed Client 2
        const client2Email = 'pharma@example.com';
        let client2 = await User.findOneAndUpdate(
            { email: client2Email },
            { 
                name: 'Sara Malik', 
                email: client2Email, 
                password: await bcrypt.hash('password123', salt), 
                role: 'user',
                company_name: 'RetailMax Pvt Ltd',
                company_address: '45 Commerce Street, Lahore',
                company_phone: '+92-321-9876543',
                industry: 'Retail',
                is_active: true
            },
            { upsert: true, new: true }
        );
        console.log('Client 2 seeded/updated.');

        // 2. Seed PostgreSQL Dummy Data
        console.log('Seeding PostgreSQL dummy data...');
        
        let supplier1Id, supplier2Id;
        const supplierCheck = await pgPool.query('SELECT * FROM suppliers');
        if (supplierCheck.rows.length === 0) {
            console.log('Seeding suppliers...');
            const s1 = await pgPool.query(`
                INSERT INTO suppliers (name, contact_person, email, phone, address, country) 
                VALUES ('Global Electronics', 'John Doe', 'john@global.com', '123456789', 'Tech Street 101', 'USA') RETURNING id
            `);
            supplier1Id = s1.rows[0].id;
            const s2 = await pgPool.query(`
                INSERT INTO suppliers (name, contact_person, email, phone, address, country) 
                VALUES ('Premium Foods Co.', 'Jane Smith', 'jane@premium.com', '987654321', 'Green Valley 42', 'Germany') RETURNING id
            `);
            supplier2Id = s2.rows[0].id;

            console.log('Seeding inventory...');
            await pgPool.query(`
                INSERT INTO inventory (product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold) 
                VALUES ('MacBook Pro 14', 'MAC-14-PRO', 15, 1999.99, 'Aisle 1', $1, 5)
            `, [supplier1Id]);
            await pgPool.query(`
                INSERT INTO inventory (product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold) 
                VALUES ('Organic Coffee', 'COF-ORG-500', 8, 15.50, 'Cold Storage', $2, 10)
            `, [supplier2Id]);
            await pgPool.query(`
                INSERT INTO inventory (product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold) 
                VALUES ('Wireless Mouse', 'WM-100', 50, 25.00, 'Aisle 2', $1, 20)
            `, [supplier1Id]);
            await pgPool.query(`
                INSERT INTO inventory (product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold) 
                VALUES ('Office Desk', 'DESK-500', 4, 150.00, 'Warehouse B', $1, 5)
            `, [supplier1Id]);
            await pgPool.query(`
                INSERT INTO inventory (product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold) 
                VALUES ('Green Tea Extract', 'GTE-200', 30, 12.00, 'Cold Storage', $2, 15)
            `, [supplier2Id]);
        } else {
            supplier1Id = supplierCheck.rows[0].id;
            supplier2Id = supplierCheck.rows[1]?.id || supplier1Id;
        }

        console.log('Seeding orders...');
        const orderCheck = await pgPool.query('SELECT count(*) FROM orders');
        if (parseInt(orderCheck.rows[0].count) === 0) {
            const o1 = await pgPool.query(`
                INSERT INTO orders (customer_name, customer_email, product_name, quantity, total_price, delivery_address, notes, invoice_number, status, supplier_id, user_id) 
                VALUES ($1, $2, 'MacBook Pro 14', 1, 1999.99, $3, 'Urgent delivery', 'INV-20231001-10001', 'dispatched', $4, $5)
                RETURNING id
            `, [client1.name, client1.email, client1.company_address, supplier1Id, client1._id.toString()]);
            
            const o2 = await pgPool.query(`
                INSERT INTO orders (customer_name, customer_email, product_name, quantity, total_price, delivery_address, notes, invoice_number, status, supplier_id, user_id) 
                VALUES ($1, $2, 'Wireless Mouse', 5, 125.00, $3, '', 'INV-20231005-10002', 'pending', $4, $5)
                RETURNING id
            `, [client1.name, client1.email, client1.company_address, supplier1Id, client1._id.toString()]);

            const o3 = await pgPool.query(`
                INSERT INTO orders (customer_name, customer_email, product_name, quantity, total_price, delivery_address, notes, invoice_number, status, supplier_id, user_id) 
                VALUES ($1, $2, 'Organic Coffee', 10, 155.00, $3, 'Please pack well', 'INV-20231008-10003', 'delivered', $4, $5)
                RETURNING id
            `, [client2.name, client2.email, client2.company_address, supplier2Id, client2._id.toString()]);

            // Clear old shipments just in case
            await Shipment.deleteMany({});

            console.log('Seeding shipments...');
            await Shipment.create({
                orderId: o1.rows[0].id.toString(),
                driverName: 'Mike Miller',
                vehicleNumber: 'TRUCK-001',
                originAddress: 'Global Electronics Warehouse',
                destinationAddress: client1.company_address,
                status: 'in-transit',
                estimatedDeliveryDate: new Date(Date.now() + 86400000 * 2),
                statusHistory: [
                    { status: 'preparing', note: 'Ready for pickup', updatedBy: 'Admin User' }, 
                    { status: 'in-transit', note: 'On the way', updatedBy: 'Admin User' }
                ]
            });

            await Shipment.create({
                orderId: o3.rows[0].id.toString(),
                driverName: 'Sarah Connor',
                vehicleNumber: 'VAN-102',
                originAddress: 'Premium Foods Storage',
                destinationAddress: client2.company_address,
                status: 'delivered',
                estimatedDeliveryDate: new Date(Date.now() - 86400000),
                statusHistory: [
                    { status: 'preparing', note: 'Packed', updatedBy: 'Admin User' },
                    { status: 'in-transit', note: 'Out for delivery', updatedBy: 'Admin User' },
                    { status: 'delivered', note: 'Signed by Sara', updatedBy: 'Admin User' }
                ]
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
