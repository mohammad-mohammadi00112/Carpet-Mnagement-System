
const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')
const { getLatestExchangeRate } = require('../services/currency.service')


router.get('/expenses', authenticateToken, authorizePermission('expenses.read'),(_, res) => {
    carpetDB
        .query(`SELECT * FROM expenses;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})
router.get('/expenses/:id', authenticateToken, authorizePermission('expenses.read'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`SELECT * FROM expenses WHERE id = $1;`, [id])
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})
router.delete('/expenses/:id', authenticateToken, authorizePermission('expenses.manage'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`DELETE FROM expenses WHERE id = $1;`, [id])
        .then(() => res.json({message: 'Expense has Been deleted!'}))
        .catch((error) => res.json(error))
})
router.post('/expenses', authenticateToken, authorizePermission('expenses.manage'), async (req, res) => {
    const { category_id, expense_date, amount, currency_id, description, created_by } = req.body

    try {
        const exchange_rate = await getLatestExchangeRate(currency_id)

        await carpetDB.query(`
            INSERT INTO expenses
            (category_id, expense_date, amount, currency_id, exchange_rate, description, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [category_id, expense_date, amount, currency_id, exchange_rate, description, created_by])

        res.json({ message: 'New Expense Has Been Added!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/expenses/:id', authenticateToken, authorizePermission('expenses.manage'),(req, res) => {
    const { id } = req.params
    const { category_id, expense_date, amount, currency_id, exchange_rate, description, created_by } = req.body
    carpetDB
        .query(`UPDATE expenses
                SET 
                    category_id = $1,
                    expense_date = $2,
                    amount = $3,
                    currency_id = $4,
                    exchange_rate = $5,
                    description = $6,
                    created_by = $7
                WHERE id = $8;
            `, [category_id, expense_date, amount, currency_id, exchange_rate, description, created_by, id])
        .then(() => res.json({ message: 'Expnse Has Been Updated!' }))
        .catch((error) => res.json(error))

})
router.patch('/expenses/:id', authenticateToken, authorizePermission('expenses.manage'),(req, res) => {
    const {id} = req.params
    const entries = Object.entries(req.body)
    const changes = entries.map((entry, index) =>
        `${entry[0]} = $${index + 1}` 
    ).join(',')
    const value = entries.map(entry => entry[1])
    carpetDB
        .query(`UPDATE expenses SET ${changes} WHERE id = $${value.length + 1}`, [...value,id])
        .then(() => res.json({message: 'Expense Has Been Updated!'}))
        .catch((error) => res.json(error))
})
module.exports = router