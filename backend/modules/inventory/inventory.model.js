const db = require('../../config/db.postgres');

const findAll = async () => {
    const result = await db.query('SELECT * FROM inventory ORDER BY id DESC');
    return result.rows;
};

const findById = async (id) => {
    const result = await db.query('SELECT * FROM inventory WHERE id = $1', [id]);
    return result.rows[0];
};

const findLowStock = async () => {
    const result = await db.query('SELECT * FROM inventory WHERE quantity_in_stock <= low_stock_threshold ORDER BY id DESC');
    return result.rows;
};

const create = async (data) => {
    const { product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold } = data;
    const result = await db.query(
        `INSERT INTO inventory (product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold]
    );
    return result.rows[0];
};

const update = async (id, data) => {
    const { product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold } = data;
    const result = await db.query(
        `UPDATE inventory SET 
         product_name = COALESCE($1, product_name),
         sku = COALESCE($2, sku),
         quantity_in_stock = COALESCE($3, quantity_in_stock),
         unit_price = COALESCE($4, unit_price),
         warehouse_location = COALESCE($5, warehouse_location),
         supplier_id = COALESCE($6, supplier_id),
         low_stock_threshold = COALESCE($7, low_stock_threshold)
         WHERE id = $8 RETURNING *`,
        [product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold, id]
    );
    return result.rows[0];
};

const updateStock = async (id, quantity) => {
    const result = await db.query(
        'UPDATE inventory SET quantity_in_stock = $1 WHERE id = $2 RETURNING *',
        [quantity, id]
    );
    return result.rows[0];
};

const deleteItem = async (id) => {
    const result = await db.query('DELETE FROM inventory WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

const findByProductName = async (product_name) => {
    const result = await db.query('SELECT * FROM inventory WHERE product_name = $1', [product_name]);
    return result.rows[0];
}

module.exports = {
    findAll,
    findById,
    findLowStock,
    create,
    update,
    updateStock,
    deleteItem,
    findByProductName
};
