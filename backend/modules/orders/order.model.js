const db = require('../../config/db.postgres');

const findAll = async (userId = null) => {
    let query = 'SELECT * FROM orders';
    let params = [];
    if (userId) {
        query += ' WHERE user_id = $1';
        params.push(userId);
    }
    query += ' ORDER BY id DESC';
    const result = await db.query(query, params);
    return result.rows;
};

const findById = async (id) => {
    const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    return result.rows[0];
};

const create = async (data) => {
    const { customer_name, customer_email, product_name, quantity, total_price, supplier_id, user_id } = data;
    const result = await db.query(
        `INSERT INTO orders (customer_name, customer_email, product_name, quantity, total_price, supplier_id, user_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [customer_name, customer_email, product_name, quantity, total_price, supplier_id, user_id]
    );
    return result.rows[0];
};

const update = async (id, data) => {
    const { customer_name, customer_email, product_name, quantity, total_price, supplier_id, status } = data;
    const result = await db.query(
        `UPDATE orders SET 
         customer_name = COALESCE($1, customer_name),
         customer_email = COALESCE($2, customer_email),
         product_name = COALESCE($3, product_name),
         quantity = COALESCE($4, quantity),
         total_price = COALESCE($5, total_price),
         supplier_id = COALESCE($6, supplier_id),
         status = COALESCE($7, status)
         WHERE id = $8 RETURNING *`,
        [customer_name, customer_email, product_name, quantity, total_price, supplier_id, status, id]
    );
    return result.rows[0];
};

const updateStatus = async (id, status) => {
    const result = await db.query(
        'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
    );
    return result.rows[0];
};

const deleteOrder = async (id) => {
    const result = await db.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    updateStatus,
    deleteOrder
};
