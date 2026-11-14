const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())

const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

// Get all stock movements
router.get('/stock_movements', authenticateToken, authorizePermission('carpets.read'), (_, res) => {
    carpetDB
        .query(`
            SELECT
                sm.*,
                c.name AS carpet_name,
                c.code AS carpet_code
            FROM stock_movements sm
            LEFT JOIN carpets c ON sm.carpet_id = c.id`
        )
        .then((result) => res.json(result.rows))
        .catch((error) => res.status(500).json({ message: error.message }))
})

// Get stock movement by ID
router.get('/stock_movements/:id', authenticateToken, authorizePermission('carpets.read'), (req, res) => {
    const { id } = req.params

    carpetDB
        .query(`
            SELECT
                sm.*,
                c.name AS carpet_name,
                c.code AS carpet_code
            FROM stock_movements sm
            LEFT JOIN carpets c ON sm.carpet_id = c.id
            WHERE sm.id = $1`
        , [id])
        .then((result) => res.json(result.rows))
        .catch((error) => res.status(500).json({ message: error.message }))
})

module.exports = router