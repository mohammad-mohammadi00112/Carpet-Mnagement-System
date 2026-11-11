
const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

router.get('/purchases', authenticateToken, authorizePermission('purchases.read'),(_, res) => {
    carpetDB
        .query(`SELECT * FROM purchases;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.get('/purchases/:id', authenticateToken, authorizePermission('purchases.read'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`SELECT * FROM purchases WHERE id = $1;`, [id])
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})
router.post('/purchases', authenticateToken, authorizePermission('purchases.manage'),(req, res) => {
    const { supplier_id, employee_id, purchase_date, purchase_place,
        currency_id, exchange_rate, total_amount, payment_status, status, notes, created_by } = req.body

    carpetDB
        .query(`INSERT INTO purchases (supplier_id,employee_id,purchase_date,purchase_place,
            currency_id,exchange_rate,total_amount,payment_status,status,notes,created_by)
            VALUES ($1, $2,$3,$4, $5, $6, $7, $8, $9, $10,$11 )
            `, [supplier_id, employee_id, purchase_date, purchase_place, currency_id, exchange_rate, total_amount, payment_status, status, notes, created_by])
        .then(() => res.json({ message: 'New Purchase saved Successfully' }))
        .catch((error) => res.json(error))
})

router.delete('/purchases/:id', authenticateToken, authorizePermission('purchases.manage'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`DELETE FROM purchases WHERE id = $1;`, [id])
        .then(() => res.json({ message: 'Purchase Has Been Deleted!' }))
        .catch((error) => res.json(error))
})

router.patch('/purchases/:id', authenticateToken, authorizePermission('purchases.manage'),(req, res) => {
    const { id } = req.params
    const entries = Object.entries(req.body)
    const changes = entries.map((entry, index) =>
        `${entry[0]} = $${index + 1}`
    ).join(',')
    const value = entries.map(entry => entry[1])

    carpetDB
        .query(`UPDATE purchases SET ${changes}  WHERE id = $${value.length + 1}
        `, [...value, id])
        .then(() => res.json({ message: 'Purchase Has Been Updated!' }))
        .catch((error) => res.json(error))
})

router.put('/purchases/:id', authenticateToken, authorizePermission('purchases.manage'),(req, res) => {
    const {id}  = req.params
    const { supplier_id, employee_id, purchase_date, purchase_place,
        currency_id, exchange_rate, total_amount, payment_status, status, notes, created_by } = req.body

    carpetDB
        .query(`UPDATE purchases 
                SET 
                    supplier_id = $1,
                    employee_id = $2,
                    purchase_date = $3,
                    purchase_place = $4,
                    currency_id = $5,
                    exchange_rate = $6,
                    total_amount = $7,
                    payment_status = $8,
                    status = $9,
                    notes = $10,
                    created_by = $11
                WHERE id = $12;
            `, [supplier_id, employee_id, purchase_date, purchase_place, currency_id, exchange_rate,
                 total_amount, payment_status, status, notes, created_by, id])
        .then(() => res.json({ message: 'Purchase Has Been Updated!' }))
        .catch((error) => res.json(error))


})

module.exports = router