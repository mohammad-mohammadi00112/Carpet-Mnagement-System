
const carpetDB = require('../configDb');

const getStockMovements = async () => {
    const result = await carpetDB.query(`
        SELECT
            sm.*,
            c.name AS carpet,
            c.code,
            l.name AS location,
            u.username AS created_by_name
        FROM stock_movements sm
        JOIN carpets c ON sm.carpet_id = c.id
        JOIN locations l ON sm.location_id = l.id
        LEFT JOIN users u ON sm.created_by = u.id
        ORDER BY sm.created_at DESC;
    `);

    return result.rows;
};

const getStockMovementById = async (id) => {
    const result = await carpetDB.query(`
        SELECT
            sm.*,
            c.name AS carpet,
            c.code,
            l.name AS location,
            u.username AS created_by_name
        FROM stock_movements sm
        JOIN carpets c ON sm.carpet_id = c.id
        JOIN locations l ON sm.location_id = l.id
        LEFT JOIN users u ON sm.created_by = u.id
        WHERE sm.id = $1;
    `, [id]);

    return result.rows[0];
};

const createStockAdjustment = async ({
    carpet_id,
    location_id,
    quantity_change,
    note,
    created_by
}) => {
    const client = await carpetDB.connect();

    try {
        await client.query('BEGIN');

        const inventory = await client.query(`
            SELECT quantity
            FROM inventory
            WHERE carpet_id = $1 AND location_id = $2
            FOR UPDATE;
        `, [carpet_id, location_id]);

        const currentQuantity = inventory.rows[0]?.quantity ?? 0;
        const newQuantity = Number(currentQuantity) + Number(quantity_change);

        if (newQuantity < 0) {
            throw new Error('Insufficient inventory quantity.');
        }

        if (inventory.rows.length > 0) {
            await client.query(`
                UPDATE inventory
                SET quantity = $1, updated_at = CURRENT_TIMESTAMP
                WHERE carpet_id = $2 AND location_id = $3;
            `, [newQuantity, carpet_id, location_id]);
        } else {
            await client.query(`
                INSERT INTO inventory (carpet_id, location_id, quantity)
                VALUES ($1, $2, $3);
            `, [carpet_id, location_id, newQuantity]);
        }

        const movement = await client.query(`
            INSERT INTO stock_movements
            (carpet_id, location_id, movement_type, quantity_change, note, created_by)
            VALUES ($1, $2, 'adjustment', $3, $4, $5)
            RETURNING *;
        `, [carpet_id, location_id, quantity_change, note, created_by]);

        await client.query('COMMIT');

        return movement.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    getStockMovements,
    getStockMovementById,
    createStockAdjustment
};