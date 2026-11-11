const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())

const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

router.get('/inventory', authenticateToken, authorizePermission('carpets.read'), (req, res) => {
    carpetDB
        .query(`
            SELECT
                i.id,
                c.code,
                c.name,
                l.name AS location,
                i.quantity
            FROM inventory i
            JOIN carpets c ON c.id = i.carpet_id
            JOIN locations l ON l.id = i.location_id
            ORDER BY i.id;
        `)
        .then(result => res.json(result.rows))
        .catch(error => res.status(500).json({ message: error.message }))
})

router.get('/inventory/:id', authenticateToken, authorizePermission('carpets.read'), (req, res) => {
    const { id } = req.params

    carpetDB
        .query(`
            SELECT
                i.id,
                c.code,
                c.name,
                l.name AS location,
                i.quantity
            FROM inventory i
            JOIN carpets c ON c.id = i.carpet_id
            JOIN locations l ON l.id = i.location_id
            WHERE i.id = $1;
        `, [id])
        .then(result => res.json(result.rows))
        .catch(error => res.status(500).json({ message: error.message }))
})

module.exports = router