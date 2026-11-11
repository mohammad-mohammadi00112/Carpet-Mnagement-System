

const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

router.get('/expense_categories', authenticateToken, authorizePermission('expenses.read'),(_, res) => {
    carpetDB
        .query(`SELECT * FROM expense_categories;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.get('/expense_categories/:id', authenticateToken, authorizePermission('expenses.read'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`SELECT * FROM expense_categories WHERE id = ${id};`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.post('/expense_categories', authenticateToken, authorizePermission('expenses.manage'),(req, res) => {
    const { name, description } = req.body

    carpetDB
        .query(`INSERT INTO expense_categories (name,description)
        VALUES ($1, $2)
        `, [name, description])
        .then(() => res.json({ message: 'New Expense_categ Has Been Saved!' }))
        .catch((error) => res.json(error))

})

router.put('/expense_categories/:id', authenticateToken, authorizePermission('expenses.manage'),(req, res) => {
    const { id } = req.params
    const { name, description } = req.body
    carpetDB
        .query(`UPDATE expense_categories
                    SET 
                    name = $1,
                    description = $2
                    WHERE id = $3;
                `, [name, description, id])
        .then(() => res.json({ message: 'Expense_categ Has Been Updated!' }))
        .catch((error) => res.json(error))

})

router.patch('/expense_categories/:id', authenticateToken, authorizePermission('expenses.manage'),(req, res) => {
    const { id } = req.params
    const entries = Object.entries(req.body)
    const changes = entries.map((entry, index) => 
        `${entry[0]} = $${index + 1}`
    ).join(',')
    const value = entries.map(entry => entry[1])
    carpetDB
        .query(`UPDATE expense_categories
            SET 
                ${changes}
            WHERE id = $${value.length + 1}
            `,[...value,id])
        .then(() => res.json({ message: 'Expense_categ Has Been Updated!' }))
        .catch((error) => res.json(error))
})

router.delete('/expense_categories/:id', authenticateToken, authorizePermission('expenses.manage'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`DELETE FROM expense_categories WHERE id = $1;`,[id])
        .then(() => res.json({ message: 'One Expnse Deleted!' }))
        .catch((error) => res.json(error))
})

module.exports = router