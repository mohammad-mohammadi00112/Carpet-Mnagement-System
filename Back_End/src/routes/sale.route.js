const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())

const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')
const { updateSaleTotals } = require('../services/sale.service')
const  transaction  = require('../utils/transaction')

// GET All Sales
router.get('/sales', authenticateToken, authorizePermission('sales.read'), async (_, res) => {
    try {
        const result = await carpetDB.query('SELECT * FROM sales')
        res.json(result.rows)
    } catch (error) {
        res.json(error)
    }
})

// GET Sale By ID
router.get('/sales/:id', authenticateToken, authorizePermission('sales.read'), async (req, res) => {
    try {
        const result = await carpetDB.query(
            'SELECT * FROM sales WHERE id = $1',
            [req.params.id]
        )
        res.json(result.rows)
    } catch (error) {
        res.json(error)
    }
})
// DELETE Sale
router.delete('/sales/:id', authenticateToken, authorizePermission('sales.manage'), async (req, res) => {
    try {
        await carpetDB.query(`
            DELETE FROM sales WHERE id = $1`,
            [req.params.id]
        )
        res.json({ message: 'Sale Has Been Deleted!' })
    } catch (error) {
        res.json(error)
    }
})

// POST Sale
router.post('/sales', authenticateToken, authorizePermission('sales.manage'), async (req, res) => {
    const {
        customer_id, employee_id, sale_date, currency_id,
        exchange_rate, tax_amount, payment_status, status,
        due_date, notes, created_by
    } = req.body

    try {
        const result = await carpetDB.query(`
            INSERT INTO sales (
                customer_id, employee_id, sale_date, currency_id,
                exchange_rate, discount, tax_amount, total_amount,
                payment_status, status, due_date, notes, created_by
            )
            VALUES ($1, $2, $3, $4, $5, 0, $6, 0, $7, $8, $9, $10, $11)
            RETURNING id`,
            [
                customer_id, employee_id, sale_date, currency_id,
                exchange_rate, tax_amount ?? 0, payment_status,
                status, due_date, notes, created_by
            ]
        )

        res.json({
            message: 'New Sales Has Been Saved!',
            sale_id: result.rows[0].id
        })
    } catch (error) {
        res.json(error)
    }
})

// PUT Sale
router.put('/sales/:id', authenticateToken, authorizePermission('sales.manage'), async (req, res) => {
    const { id } = req.params
    const {
        customer_id, employee_id, sale_date, currency_id,
        exchange_rate, tax_amount, payment_status, status,
        due_date, notes, created_by
    } = req.body

    try {
        const result = await transaction(async (client) => {
            await client.query(`
                UPDATE sales SET
                    customer_id = $1,
                    employee_id = $2,
                    sale_date = $3,
                    currency_id = $4,
                    exchange_rate = $5,
                    tax_amount = $6,
                    payment_status = $7,
                    status = $8,
                    due_date = $9,
                    notes = $10,
                    created_by = $11
                WHERE id = $12`,
                [
                    customer_id, employee_id, sale_date, currency_id,
                    exchange_rate, tax_amount ?? 0, payment_status,
                    status, due_date, notes, created_by, id
                ]
            )

            return await updateSaleTotals(id, client)
        })

        res.json(result)
    } catch (error) {
        res.json(error)
    }
})

// PATCH Sale
router.patch('/sales/:id', authenticateToken, authorizePermission('sales.manage'), async (req, res) => {
 const { id } = req.params
    const allowed = [
        'customer_id', 'employee_id', 'sale_date', 'currency_id',
        'exchange_rate', 'tax_amount', 'payment_status', 'status',
        'due_date', 'notes', 'created_by'
    ]

    const entries = Object.entries(req.body).filter(
        ([key]) => allowed.includes(key)
    )

    if (!entries.length) {
        return res.json({ message: 'No valid fields provided!' })
    }

    const changes = entries.map(
        ([key], index) => `${key} = $${index + 1}`
    ).join(', ')

    const values = entries.map(([, value]) => value)

    try {
        const result = await transaction(async (client) => {
            await client.query(`
                UPDATE sales SET ${changes}
                WHERE id = $${values.length + 1}`,
                [...values, id]
            )

            return await updateSaleTotals(id, client)
        })

        res.json(result)
    } catch (error) {
        res.json(error)
    }
})

module.exports = router