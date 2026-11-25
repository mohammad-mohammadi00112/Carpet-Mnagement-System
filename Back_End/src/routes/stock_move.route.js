const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())

const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

// Get all stock movements

// Get all stock movements
router.get( '/stock_movements', authenticateToken, authorizePermission('carpets.read'), (_, res) => {
    carpetDB.query(`
      SELECT
        sm.*,
        c.name AS carpet_name,
        c.code AS carpet_code,
        l.name AS location,
        u.username AS created_by_name

      FROM stock_movements sm

      LEFT JOIN carpets c
        ON sm.carpet_id = c.id

      LEFT JOIN locations l
        ON sm.location_id = l.id

      LEFT JOIN users u
        ON sm.created_by = u.id

      ORDER BY sm.created_at DESC
    `)
      .then(result => res.json(result.rows))
      .catch(error => {
        console.error("Get Stock Movements Error:", error);
        res.status(500).json({ message: error.message });
      });
  }
);


// Get stock movement by ID
router.get('/stock_movements/:id',authenticateToken, authorizePermission('carpets.read'), (req, res) => {
    const { id } = req.params;
    carpetDB.query(`
      SELECT
        sm.*,
        c.name AS carpet_name,
        c.code AS carpet_code,
        l.name AS location,
        u.username AS created_by_name

      FROM stock_movements sm

      LEFT JOIN carpets c
        ON sm.carpet_id = c.id

      LEFT JOIN locations l
        ON sm.location_id = l.id

      LEFT JOIN users u
        ON sm.created_by = u.id

      WHERE sm.id = $1
    `, [id])
      .then(result => res.json(result.rows))
      .catch(error => {
        console.error("Get Stock Movement By ID Error:", error);
        res.status(500).json({ message: error.message });
      });
  }
);

 // Create Stock Adjustment
router.post('/stock_movements', authenticateToken, authorizePermission('carpets.manage'),async (req, res) => {
        const {
            carpet_id,
            location_id,
            quantity_change,
            note
        } = req.body;

        // Validate required fields
        if (
            !Number.isInteger(Number(carpet_id)) ||
            Number(carpet_id) <= 0 ||
            !Number.isInteger(Number(location_id)) ||
            Number(location_id) <= 0 ||
            quantity_change === undefined ||
            quantity_change === null ||
            quantity_change === "" ||
            !Number.isInteger(Number(quantity_change)) ||
            Number(quantity_change) === 0
        ) {
            return res.status(400).json({
                message: "Please provide valid carpet, location and quantity"
            });
        }

        const client = await carpetDB.connect();

        try {
            const carpetId = Number(carpet_id);
            const locationId = Number(location_id);
            const quantityChange = Number(quantity_change);

            // Get authenticated user ID
            const createdBy = req.user?.id ?? req.user?.userId;

            if (!createdBy) {
                return res.status(401).json({
                    message: "Authenticated user ID not found"
                });
            }

            await client.query('BEGIN');

            // Check if carpet exists
            const carpetResult = await client.query(
                'SELECT id FROM carpets WHERE id = $1',
                [carpetId]
            );

            if (carpetResult.rows.length === 0) {
                await client.query('ROLLBACK');

                return res.status(404).json({
                    message: "Carpet not found"
                });
            }

            // Check if location exists
            const locationResult = await client.query(
                'SELECT id FROM locations WHERE id = $1',
                [locationId]
            );

            if (locationResult.rows.length === 0) {
                await client.query('ROLLBACK');

                return res.status(404).json({
                    message: "Location not found"
                });
            }

            // Apply the adjustment atomically. Locking a missing inventory row
            // does not prevent concurrent inserts, so use one guarded upsert.
            const inventoryResult = quantityChange > 0
                ? await client.query(
                    `INSERT INTO inventory (carpet_id, location_id, quantity)
                     VALUES ($1, $2, $3)
                     ON CONFLICT (carpet_id, location_id)
                     DO UPDATE SET
                        quantity = inventory.quantity + EXCLUDED.quantity,
                        updated_at = CURRENT_TIMESTAMP
                     RETURNING id, quantity`,
                    [carpetId, locationId, quantityChange]
                )
                : await client.query(
                    `UPDATE inventory
                     SET quantity = quantity + $3,
                         updated_at = CURRENT_TIMESTAMP
                     WHERE carpet_id = $1
                       AND location_id = $2
                       AND quantity >= -$3::integer
                     RETURNING id, quantity`,
                    [carpetId, locationId, quantityChange]
                );

            if (!inventoryResult.rows.length) {
                const currentResult = await client.query(
                    'SELECT quantity FROM inventory WHERE carpet_id = $1 AND location_id = $2',
                    [carpetId, locationId]
                );
                const currentQuantity = Number(currentResult.rows[0]?.quantity ?? 0);
                await client.query('ROLLBACK');
                return res.status(400).json({
                    message: `Insufficient stock. Current quantity is ${currentQuantity}`
                });
            }
            const inventoryRow = inventoryResult.rows[0];
            const newQuantity = Number(inventoryRow.quantity);

            // Insert stock movement record
            const movementResult = await client.query(
                `INSERT INTO stock_movements
                    (carpet_id, location_id, movement_type,
                     quantity_change, note, created_by)
                 VALUES ($1, $2, 'adjustment', $3, $4, $5)
                 RETURNING *`,
                [
                    carpetId,
                    locationId,
                    quantityChange,
                    note || null,
                    createdBy
                ]
            );

            await client.query(
                `INSERT INTO audit_log
                    (user_id, action, table_name, record_id, old_data, new_data, ip_address)
                 VALUES (
                    $1, 'update', 'inventory', $2,
                    jsonb_build_object('quantity', $3::integer),
                    jsonb_build_object(
                        'quantity', $4::integer,
                        'carpet_id', $5::integer,
                        'location_id', $6::integer
                    ),
                    $7
                 )`,
                [
                    createdBy,
                    inventoryRow.id,
                    newQuantity - quantityChange,
                    newQuantity,
                    carpetId,
                    locationId,
                    req.ip
                ]
            );

            await client.query('COMMIT');

            res.status(201).json({
                message: "Stock adjustment created successfully",
                movement: movementResult.rows[0],
                current_quantity: newQuantity
            });

        } catch (error) {
            await client.query('ROLLBACK');

            console.error("Create Stock Adjustment Error:", error);

            res.status(500).json({
                message: error.message
            });

        } finally {
            client.release();
        }
    }
);



module.exports = router
