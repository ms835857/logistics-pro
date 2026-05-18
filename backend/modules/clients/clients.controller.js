const User = require('../../models/user.schema');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pgPool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});

const getAllClients = async (req, res) => {
    try {
        // Fetch all client users from MongoDB
        const clients = await User.find({ role: 'user' }).select('-password').lean();
        
        // Fetch order counts from PostgreSQL
        const orderCountsResult = await pgPool.query('SELECT user_id, COUNT(*) as total_orders FROM orders GROUP BY user_id');
        const orderCountsMap = {};
        
        orderCountsResult.rows.forEach(row => {
            if (row.user_id) {
                orderCountsMap[row.user_id] = parseInt(row.total_orders);
            }
        });

        // Cross-database merge
        const mergedClients = clients.map(client => ({
            id: client._id,
            name: client.name,
            email: client.email,
            company_name: client.company_name,
            company_phone: client.company_phone,
            industry: client.industry,
            is_active: client.is_active,
            createdAt: client.createdAt,
            totalOrders: orderCountsMap[client._id.toString()] || 0
        }));

        res.status(200).json(mergedClients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch clients' });
    }
};

const deactivateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { is_active: false },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.status(200).json({ message: 'Client account deactivated', client: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to deactivate client' });
    }
};

module.exports = {
    getAllClients,
    deactivateClient
};
