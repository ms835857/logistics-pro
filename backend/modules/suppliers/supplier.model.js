const db = require('../../config/db.postgres');

const findAll = async () => {
    const result = await db.query('SELECT * FROM suppliers ORDER BY id DESC');
    return result.rows;
};

const findById = async (id) => {
    const result = await db.query('SELECT * FROM suppliers WHERE id = $1', [id]);
    return result.rows[0];
};

const findByIds = async (ids) => {
    if (!ids || ids.length === 0) return [];
    // Creating parameterized query like $1, $2, $3
    const params = ids.map((_, i) => `$${i + 1}`).join(',');
    const result = await db.query(`SELECT * FROM suppliers WHERE id IN (${params}) ORDER BY id DESC`, ids);
    return result.rows;
};

const create = async (data) => {
    const { name, contact_person, email, phone, address, country } = data;
    const result = await db.query(
        `INSERT INTO suppliers (name, contact_person, email, phone, address, country) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [name, contact_person, email, phone, address, country]
    );
    return result.rows[0];
};

const update = async (id, data) => {
    const { name, contact_person, email, phone, address, country, is_active } = data;
    const result = await db.query(
        `UPDATE suppliers SET 
         name = COALESCE($1, name),
         contact_person = COALESCE($2, contact_person),
         email = COALESCE($3, email),
         phone = COALESCE($4, phone),
         address = COALESCE($5, address),
         country = COALESCE($6, country),
         is_active = COALESCE($7, is_active)
         WHERE id = $8 RETURNING *`,
        [name, contact_person, email, phone, address, country, is_active, id]
    );
    return result.rows[0];
};

const softDelete = async (id) => {
    const result = await db.query(
        'UPDATE suppliers SET is_active = false WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};

module.exports = {
    findAll,
    findById,
    findByIds,
    create,
    update,
    softDelete
};
