
const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

router.get('/stock_movements', authenticateToken, authorizePermission('carpets.read'),(_, res) => {
    carpetDB
        .query(`SELECT * FROM stock_movements;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.get('/stock_movements/:id', authenticateToken, authorizePermission('carpets.read'),(req, res) => {
    const {id} = req.params
    carpetDB
        .query(`SELECT * FROM stock_movements WHERE id = $1;`, [id])
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

module.exports = router