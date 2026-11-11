
const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

router.get('/invoices', authenticateToken, authorizePermission('sales.read'),(_, res) => {
    carpetDB
        .query(`SELECT * FROM invoices;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})
router.get('/invoices/:id', authenticateToken, authorizePermission('sales.read'),(req, res) => {
    const {id} = req.params
    carpetDB    
        .query(`SELECT * FROM invoices WHERE id = $1;`,[id])
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.post('/invoices', authenticateToken, authorizePermission('sales.manage'),(req, res) => {
    const {sale_id,invoice_number,invoice_date,currency_id,tax_amount,total_amount} = req.body
    carpetDB    
        .query(`INSERT INTO invoices (sale_id,invoice_number,invoice_date,currency_id,tax_amount,total_amount)
            VALUES ($1, $2, $3, $4, $5, $6)
            `, [sale_id, invoice_number, invoice_date, currency_id, tax_amount, total_amount])
        .then(() => res.json({message: 'New Invoice Has Been Saved!'}))
        .catch((error) => res.json(error))
})

module.exports = router