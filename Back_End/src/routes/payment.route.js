const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())

const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

const { updateSalePaymentStatus } = require('../services/payment.service')

const transaction = require('../utils/transaction')

// GET All Payments
router.get('/payments', authenticateToken, authorizePermission('payments.read'), async (_, res) => {
    try {
        const result = await carpetDB.query(
            'SELECT * FROM payments'
        )

        res.json(result.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// GET Payment By ID
router.get('/payments/:id', authenticateToken, authorizePermission('payments.read'), async (req, res) => {
    try {
        const result = await carpetDB.query(
            'SELECT * FROM payments WHERE id = $1',
            [req.params.id]
        )

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Payment Not Found!' })
        }

        res.json(result.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// POST Payment
router.post('/payments', authenticateToken, authorizePermission('payments.manage'), async (req, res) => {
    const {
        sale_id,
        received_by,
        payment_date,
        payment_method,
        payment_type,
        amount,
        currency_id,
        exchange_rate_to_sale
    } = req.body

    const amount_in_sale_currency = Number(amount) * Number(exchange_rate_to_sale)

    try {
        await transaction(async (client) => {

            await client.query(`
                INSERT INTO payments(
                    sale_id,
                    received_by,
                    payment_date,
                    payment_method,
                    payment_type,
                    amount,
                    currency_id,
                    exchange_rate_to_sale,
                    amount_in_sale_currency
                )
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`
                , [
                    sale_id,
                    received_by,
                    payment_date,
                    payment_method,
                    payment_type,
                    amount,
                    currency_id,
                    exchange_rate_to_sale,
                    amount_in_sale_currency
                ])

            await updateSalePaymentStatus(sale_id, client)
        })

        res.json({ message: 'Payment Has Been Saved!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// PUT Payment
router.put('/payments/:id', authenticateToken, authorizePermission('payments.manage'), async (req, res) => {
    const { id } = req.params

    const {
        sale_id,
        received_by,
        payment_date,
        payment_method,
        payment_type,
        amount,
        currency_id,
        exchange_rate_to_sale,
        amount_in_sale_currency
    } = req.body

    try {
        const result = await transaction(async (client) => {

            const oldPayment = await client.query(`
                SELECT sale_id
                FROM payments
                WHERE id = $1
                FOR UPDATE`
                , [id])

            if (!oldPayment.rows.length) {
                return { notFound: true }
            }

            const oldSaleId = oldPayment.rows[0].sale_id

            await client.query(`
                UPDATE payments
                SET
                    sale_id = $1,
                    received_by = $2,
                    payment_date = $3,
                    payment_method = $4,
                    payment_type = $5,
                    amount = $6,
                    currency_id = $7,
                    exchange_rate_to_sale = $8,
                    amount_in_sale_currency = $9
                WHERE id = $10`
            , [
                sale_id,
                received_by,
                payment_date,
                payment_method,
                payment_type,
                amount,
                currency_id,
                exchange_rate_to_sale,
                amount_in_sale_currency,
                id
            ])

            await updateSalePaymentStatus(oldSaleId, client)

            if (Number(oldSaleId) !== Number(sale_id)) {
                await updateSalePaymentStatus(sale_id, client)
            }

            return { success: true }
        })

        if (result.notFound) {
            return res.status(404).json({ message: 'Payment Not Found!' })
        }

        res.json({ message: 'Payment Has Been Updated!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// PATCH Payment
router.patch('/payments/:id', authenticateToken, authorizePermission('payments.manage'), async (req, res) => {
    const { id } = req.params

    const allowed = [
        'sale_id',
        'received_by',
        'payment_date',
        'payment_method',
        'payment_type',
        'amount',
        'currency_id',
        'exchange_rate_to_sale',
        'amount_in_sale_currency'
    ]

    const entries = Object.entries(req.body)

    if (!entries.length) {
        return res.status(400).json({ message: 'No fields to update' })
    }

    if (entries.some(([key]) => !allowed.includes(key))) {
        return res.status(400).json({ message: 'Invalid field' })
    }

    try {
        const result = await transaction(async (client) => {

            const oldPayment = await client.query(`
                SELECT sale_id, amount, exchange_rate_to_sale
                FROM payments
                WHERE id = $1
                FOR UPDATE`
            , [id])

            if (!oldPayment.rows.length) {
                return { notFound: true }
            }

            const oldSaleId = oldPayment.rows[0].sale_id
            const updates = Object.fromEntries(entries)

            if ('amount' in updates || 'exchange_rate_to_sale' in updates) {
                const amount = updates.amount ?? oldPayment.rows[0].amount

                const rate = updates.exchange_rate_to_sale ??
                    oldPayment.rows[0].exchange_rate_to_sale

                updates.amount_in_sale_currency = Number(amount) * Number(rate)
            }

            const finalEntries = Object.entries(updates)

            const changes = finalEntries.map(
                ([key], index) => `${key} = $${index + 1}`
            ).join(', ')

            const values = finalEntries.map(([, value]) => value)

            await client.query(`
                UPDATE payments
                SET ${changes}
                WHERE id = $${values.length + 1}`
            , [...values, id])

            const newSaleId = updates.sale_id ?? oldSaleId

            await updateSalePaymentStatus(oldSaleId, client)

            if (Number(oldSaleId) !== Number(newSaleId)) {
                await updateSalePaymentStatus(newSaleId, client)
            }

            return { success: true }
        })

        if (result.notFound) {
            return res.status(404).json({ message: 'Payment Not Found!' })
        }

        res.json({ message: 'Payment Has Been Updated!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// DELETE Payment
router.delete('/payments/:id', authenticateToken, authorizePermission('payments.manage'), async (req, res) => {
    try {
        const result = await transaction(async (client) => {

            const deleted = await client.query(`
                DELETE FROM payments
                WHERE id = $1
                RETURNING sale_id`
            , [req.params.id])
            if (!deleted.rows.length) {
                return { notFound: true }
            }

            const saleId = deleted.rows[0].sale_id
            await updateSalePaymentStatus(saleId, client)

            return { success: true }
        })

        if (result.notFound) {
            return res.status(404).json({ message: 'Payment Not Found!' })
        }

        res.json({ message: 'Payment Has Been Deleted!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router