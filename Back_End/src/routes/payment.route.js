const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())

const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

const {
    calculateSalePaymentAmount,
    updateSalePaymentStatus,
    validateSaleRefund
} = require('../services/payment.service')

const transaction = require('../utils/transaction')
const { BASE_CURRENCY_ID_SQL } = require('../services/baseCurrency')

// GET All Payments
router.get('/payments', authenticateToken, authorizePermission('payments.read'), async (_, res) => {
    try {
        const result = await carpetDB.query(
            `SELECT p.*,
                ROUND((CASE WHEN p.payment_type = 'refund' THEN -1 ELSE 1 END) *
                    COALESCE(p.amount_in_sale_currency,
                        ROUND(p.amount * p.exchange_rate_to_sale, 2)) *
                    CASE WHEN s.currency_id = (${BASE_CURRENCY_ID_SQL}) THEN 1
                         ELSE COALESCE(s.exchange_rate, 1) END, 2) AS amount_in_base_currency,
                base_currency.code AS base_currency_code
             FROM payments p
             JOIN sales s ON s.id = p.sale_id
             LEFT JOIN currencies base_currency
                ON base_currency.id = (${BASE_CURRENCY_ID_SQL})
             ORDER BY p.payment_date DESC, p.id DESC`
        )

        res.json(result.rows)
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message })
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
        res.status(error.status || 500).json({ message: error.message })
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

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0 ||
        !Number.isFinite(Number(exchange_rate_to_sale)) || Number(exchange_rate_to_sale) <= 0) {
        return res.status(400).json({ message: 'Payment amount and exchange rate must be greater than zero.' })
    }

    try {
        await transaction(async (client) => {
            const sale = await client.query(
                'SELECT id FROM sales WHERE id = $1 FOR UPDATE', [sale_id]
            )
            if (!sale.rows.length) throw new Error('Sale not found')

            const amountInSaleCurrency = await calculateSalePaymentAmount(
                amount, exchange_rate_to_sale, client
            )
            if (payment_type === 'refund') {
                await validateSaleRefund(sale_id, amountInSaleCurrency, client)
            }

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
                    amountInSaleCurrency
                ])

            await updateSalePaymentStatus(sale_id, client)
        })

        res.json({ message: 'Payment Has Been Saved!' })
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message })
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
        exchange_rate_to_sale
    } = req.body

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0 ||
        !Number.isFinite(Number(exchange_rate_to_sale)) || Number(exchange_rate_to_sale) <= 0) {
        return res.status(400).json({ message: 'Payment amount and exchange rate must be greater than zero.' })
    }

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
            const saleIds = [...new Set([Number(oldSaleId), Number(sale_id)])].sort((a, b) => a - b)
            for (const saleId of saleIds) {
                const lockedSale = await client.query(
                    'SELECT id FROM sales WHERE id = $1 FOR UPDATE', [saleId]
                )
                if (!lockedSale.rows.length) throw new Error('Sale not found')
            }
            const amountInSaleCurrency = await calculateSalePaymentAmount(
                amount, exchange_rate_to_sale, client
            )
            if (payment_type === 'refund') {
                await validateSaleRefund(sale_id, amountInSaleCurrency, client, Number(id))
            }

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
                amountInSaleCurrency,
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
        res.status(error.status || 500).json({ message: error.message })
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
                SELECT sale_id, amount, exchange_rate_to_sale, payment_type
                FROM payments
                WHERE id = $1
                FOR UPDATE`
            , [id])

            if (!oldPayment.rows.length) {
                return { notFound: true }
            }

            const oldSaleId = oldPayment.rows[0].sale_id
            const updates = Object.fromEntries(entries)
            const newSaleId = updates.sale_id ?? oldSaleId
            const saleIds = [...new Set([Number(oldSaleId), Number(newSaleId)])].sort((a, b) => a - b)
            for (const saleId of saleIds) {
                const lockedSale = await client.query(
                    'SELECT id FROM sales WHERE id = $1 FOR UPDATE', [saleId]
                )
                if (!lockedSale.rows.length) throw new Error('Sale not found')
            }
            const amount = updates.amount ?? oldPayment.rows[0].amount
            const rate = updates.exchange_rate_to_sale ?? oldPayment.rows[0].exchange_rate_to_sale
            const paymentType = updates.payment_type ?? oldPayment.rows[0].payment_type
            if (!Number.isFinite(Number(amount)) || Number(amount) <= 0 ||
                !Number.isFinite(Number(rate)) || Number(rate) <= 0) {
                throw new Error('Payment amount and exchange rate must be greater than zero.')
            }
            const amountInSaleCurrency = await calculateSalePaymentAmount(amount, rate, client)
            if (paymentType === 'refund') {
                await validateSaleRefund(newSaleId, amountInSaleCurrency, client, Number(id))
            }
            updates.amount_in_sale_currency = amountInSaleCurrency

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
        res.status(error.status || 500).json({ message: error.message })
    }
})

// DELETE Payment
router.delete('/payments/:id', authenticateToken, authorizePermission('payments.manage'), async (req, res) => {
    try {
        const result = await transaction(async (client) => {
            const existing = await client.query(`
                SELECT sale_id FROM payments WHERE id = $1 FOR UPDATE`,
            [req.params.id])
            if (!existing.rows.length) return { notFound: true }

            const saleId = existing.rows[0].sale_id
            await client.query('SELECT id FROM sales WHERE id = $1 FOR UPDATE', [saleId])

            const deleted = await client.query(`
                DELETE FROM payments
                WHERE id = $1
                RETURNING sale_id`
            , [req.params.id])
            if (!deleted.rows.length) {
                return { notFound: true }
            }

            await updateSalePaymentStatus(saleId, client)

            return { success: true }
        })

        if (result.notFound) {
            return res.status(404).json({ message: 'Payment Not Found!' })
        }

        res.json({ message: 'Payment Has Been Deleted!' })
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message })
    }
})

module.exports = router
