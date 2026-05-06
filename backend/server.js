const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectMongo = require('./config/db.mongo');
const { errorHandler, notFound } = require('./middleware/error.middleware');

dotenv.config();

// Connect to databases
connectMongo();

const app = express();

app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Setup Routes (to be imported)
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/orders', require('./modules/orders/orders.routes'));
app.use('/api/inventory', require('./modules/inventory/inventory.routes'));
app.use('/api/shipments', require('./modules/shipments/shipments.routes'));
app.use('/api/suppliers', require('./modules/suppliers/suppliers.routes'));

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
