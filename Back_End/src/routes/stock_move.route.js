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
            !Number.isFinite(Number(quantity_change)) ||
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

            // Get current inventory quantity
            const inventoryResult = await client.query(
                `SELECT quantity
                 FROM inventory
                 WHERE carpet_id = $1
                 AND location_id = $2
                 FOR UPDATE`,
                [carpetId, locationId]
            );

            const currentQuantity =
                inventoryResult.rows.length > 0
                    ? Number(inventoryResult.rows[0].quantity)
                    : 0;

            // Calculate new quantity
            const newQuantity = currentQuantity + quantityChange;

            // Prevent negative inventory
            if (newQuantity < 0) {
                await client.query('ROLLBACK');

                return res.status(400).json({
                    message: `Insufficient stock. Current quantity is ${currentQuantity}`
                });
            }

            // Insert or update inventory
            await client.query(
                `INSERT INTO inventory
                    (carpet_id, location_id, quantity)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (carpet_id, location_id)
                 DO UPDATE SET quantity = EXCLUDED.quantity`,
                [carpetId, locationId, newQuantity]
            );

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