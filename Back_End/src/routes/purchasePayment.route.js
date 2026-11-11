
const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')
router.get('/purchase_payments', authenticateToken, authorizePermission('purchases.read'),(_, res) => {
    carpetDB
        .query(`SELECT * FROM purchase_payments;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})
router.get('/purchase_payments/:id', authenticateToken, authorizePermission('purchases.read'),(req, res) => {
    const {id} = req.params
    carpetDB    
        .query(`SELECT * FROM purchase_payments WHERE id = $1;`, [id])
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.post('/purchase_payments', authenticateToken, authorizePermission('purchases.manage'),(req, res) => {
    const {purchase_id,payment_date,payment_method,amount,currency_id,exchange_rate,notes,created_by} = req.body
    carpetDB
        .query(`INSERT INTO purchase_payments (purchase_id,payment_date,payment_method,amount,currency_id,exchange_rate,notes,created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [purchase_id, payment_date, payment_method, amount, currency_id, exchange_rate, notes, created_by])
        .then(() => res.json({message: 'New Purchase payment Has Been Added!'}))
        .catch((error) => res.json(error))

})

module.exports = router