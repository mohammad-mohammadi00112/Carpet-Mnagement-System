const carpetDB = require('../configDb')

const updateInventory = async (carpetId, locationId, change, client = carpetDB) => {
    await client.query(`
        INSERT INTO inventory (carpet_id, location_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (carpet_id, location_id)
        DO UPDATE SET
            quantity = inventory.quantity + EXCLUDED.quantity,
            updated_at = CURRENT_TIMESTAMP`
    , [carpetId, locationId, change])
}

const addStock = async (carpetId, locationId, quantity, client = carpetDB) => {
    await updateInventory(carpetId, locationId, quantity, client)
}

const removeStock = async (carpetId, locationId, quantity, client = carpetDB) => {
    const result = await client.query(`
        UPDATE inventory
        SET quantity = quantity - $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE carpet_id = $2
          AND location_id = $3
          AND quantity >= $1
        RETURNING *`
    , [quantity, carpetId, locationId])

    if (!result.rows.length) {
        throw new Error('Insufficient inventory or inventory record not found!')
    }
}

module.exports = { addStock, removeStock }