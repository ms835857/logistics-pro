"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt = __importStar(require("bcryptjs"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.join(__dirname, '../../.env') });
const pgPool = new pg_1.Pool({
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT || '5432'),
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});
const UserSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    company_name: String,
    company_address: String,
    company_phone: String,
    industry: String,
    is_active: { type: Boolean, default: true },
}, { timestamps: true });
const User = mongoose_1.default.model('User', UserSchema);
const ShipmentSchema = new mongoose_1.default.Schema({
    orderId: { type: String, required: true },
    trackingNumber: { type: String, unique: true },
    driverName: String,
    vehicleNumber: String,
    originAddress: String,
    destinationAddress: String,
    status: { type: String, default: 'preparing' },
    estimatedDeliveryDate: Date,
    actualDelivery: Date,
    statusHistory: [{
            status: String,
            note: String,
            updatedBy: String,
            timestamp: { type: Date, default: Date.now }
        }]
}, { timestamps: true });
ShipmentSchema.pre('save', function () {
    if (this.isNew && !this.trackingNumber) {
        const randomStr = Math.floor(100000 + Math.random() * 900000).toString();
        this.trackingNumber = `SHIP-${randomStr}`;
    }
});
const Shipment = mongoose_1.default.model('Shipment', ShipmentSchema);
const initDB = async () => {
    try {
        console.log('Connecting to PostgreSQL...');
        await pgPool.connect();
        console.log('PostgreSQL connected.');
        console.log('Dropping old tables...');
        await pgPool.query('DROP TABLE IF EXISTS orders CASCADE');
        await pgPool.query('DROP TABLE IF EXISTS inventory CASCADE');
        await pgPool.query('DROP TABLE IF EXISTS suppliers CASCADE');
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
        console.log('Connecting to MongoDB...');
        await mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/logistics_db');
        console.log('MongoDB connected.');
        console.log('Clearing old MongoDB data...');
        await User.deleteMany({});
        await Shipment.deleteMany({});
        console.log('Seeding MongoDB users...');
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);
        const clientPassword = await bcrypt.hash('password123', salt);
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@logistics.pro',
            password: adminPassword,
            role: 'admin',
            is_active: true,
        });
        const client1 = await User.create({
            name: 'Ahmed Khan',
            email: 'tech@example.com',
            password: clientPassword,
            role: 'user',
            company_name: 'TechCorp Solutions',
            company_address: '123 Business District, Karachi',
            company_phone: '+92-300-1234567',
            industry: 'Technology',
            is_active: true,
        });
        const client2 = await User.create({
            name: 'Sara Malik',
            email: 'pharma@example.com',
            password: clientPassword,
            role: 'user',
            company_name: 'RetailMax Pvt Ltd',
            company_address: '45 Commerce Street, Lahore',
            company_phone: '+92-321-9876543',
            industry: 'Retail',
            is_active: true,
        });
        console.log('Seeding PostgreSQL suppliers...');
        const s1 = await pgPool.query(`
      INSERT INTO suppliers (name, contact_person, email, phone, address, country) 
      VALUES ('Global Electronics', 'John Doe', 'john@global.com', '123456789', 'Tech Street 101', 'USA') RETURNING id
    `);
        const supplier1Id = s1.rows[0].id;
        const s2 = await pgPool.query(`
      INSERT INTO suppliers (name, contact_person, email, phone, address, country) 
      VALUES ('Premium Foods Co.', 'Jane Smith', 'jane@premium.com', '987654321', 'Green Valley 42', 'Germany') RETURNING id
    `);
        const supplier2Id = s2.rows[0].id;
        console.log('Seeding PostgreSQL inventory...');
        await pgPool.query(`
      INSERT INTO inventory (product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold) 
      VALUES ('MacBook Pro 14', 'MAC-14-PRO', 15, 1999.99, 'Aisle 1', $1, 5)
    `, [supplier1Id]);
        await pgPool.query(`
      INSERT INTO inventory (product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold) 
      VALUES ('Organic Coffee', 'COF-ORG-500', 8, 15.50, 'Cold Storage', $1, 10)
    `, [supplier2Id]);
        await pgPool.query(`
      INSERT INTO inventory (product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold) 
      VALUES ('Wireless Mouse', 'WM-100', 50, 25.00, 'Aisle 2', $1, 20)
    `, [supplier1Id]);
        console.log('Seeding PostgreSQL orders...');
        const o1 = await pgPool.query(`
      INSERT INTO orders (customer_name, customer_email, product_name, quantity, total_price, delivery_address, notes, invoice_number, status, supplier_id, user_id) 
      VALUES ($1, $2, 'MacBook Pro 14', 1, 1999.99, $3, 'Urgent delivery', 'INV-20231001-10001', 'dispatched', $4, $5)
      RETURNING id
    `, [client1.name, client1.email, client1.company_address, supplier1Id, client1._id.toString()]);
        const o3 = await pgPool.query(`
      INSERT INTO orders (customer_name, customer_email, product_name, quantity, total_price, delivery_address, notes, invoice_number, status, supplier_id, user_id) 
      VALUES ($1, $2, 'Organic Coffee', 10, 155.00, $3, 'Please pack well', 'INV-20231008-10003', 'delivered', $4, $5)
      RETURNING id
    `, [client2.name, client2.email, client2.company_address, supplier2Id, client2._id.toString()]);
        console.log('Seeding MongoDB shipments...');
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
        console.log('Database initialization completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};
initDB();
//# sourceMappingURL=init-db.js.map