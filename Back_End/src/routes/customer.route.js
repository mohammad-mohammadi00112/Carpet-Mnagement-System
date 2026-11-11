
const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

router.get('/customers', authenticateToken, authorizePermission('customers.read'),(_, res) => {
    carpetDB
        .query(`SELECT * FROM customers;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.get('/customers/:id', authenticateToken, authorizePermission('customers.read'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`SELECT * FROM customers WHERE id = ${id};`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))

})

router.post('/customers', authenticateToken, authorizePermission('customers.manage'),(req, res) => {
    const { first_name, last_name, phone, email, address, customer_type, credit_limit, notes, is_active } = req.body
    carpetDB
        .query(`INSERT INTO customers (first_name,last_name,phone,email,address,customer_type,credit_limit,notes,is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [first_name, last_name, phone, email, address, customer_type, credit_limit, notes, is_active])
        .then(() => res.json({ message: 'New Customer Has Been Saved In Compnay' }))
        .catch((error) => res.json(error))
})

router.delete('/customers/:id', authenticateToken, authorizePermission('customers.manage'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`DELETE FROM customers WHERE id = ${id};`)
        .then(() => res.json({ message: 'One Customer Has Been Deleted!' }))
        .catch((error) => res.json(error))
})

router.put('/customers/:id', authenticateToken, authorizePermission('customers.manage'),(req, res) => {
    const { first_name, last_name, phone, email, address, customer_type, credit_limit, notes, is_active } = req.body
    const { id } = req.params
    carpetDB
        .query(`UPDATE customers
            SET 
                first_name = $1,
                last_name = $2,
                phone = $3,
                email = $4,
                address = $5,
                customer_type = $6,
                credit_limit = $7,
                notes = $8,
                is_active = $9
            WHERE id = $10;
            `, [first_name, last_name, phone, email, address, customer_type, credit_limit, notes, is_active, id])
        .then(() => res.json({ message: 'Customer Has Been Updated!' }))
        .catch((error) => res.json(error))

})

router.patch('/customers/:id', authenticateToken, authorizePermission('customers.manage'),(req, res) => {
    const { id } = req.params
    const entries = Object.entries(req.body)

    const changes = entries.map((entry, index) =>
       ` ${entry[0]} = $${index + 1}`
    ).join(',')

    const values = entries.map(entry => entry[1])
    carpetDB.query(
        `UPDATE customers SET ${changes} WHERE id = $${values.length + 1}`,
        [...values, id]
    )
    .then(() => res.json({ message: 'Customer Has Been Updated!'}))
    .catch(error => res.json(error))
})



module.exports = router
