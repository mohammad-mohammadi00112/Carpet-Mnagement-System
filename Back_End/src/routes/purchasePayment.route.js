
const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')
const transaction = require('../utils/transaction')
const { BASE_CURRENCY_ID_SQL } = require('../services/baseCurrency')
const {
    getPurchasePaymentSummary,
    updatePurchasePaymentStatus
} = require('../services/purchasePayment.service')

router.get('/purchase_payments', authenticateToken, authorizePermission('purchases.read'), async (_, res) => {
    try {
        const result = await carpetDB.query(`
            SELECT pp.*,
                ROUND(pp.amount * CASE WHEN pp.currency_id = (${BASE_CURRENCY_ID_SQL}) THEN 1
                    ELSE COALESCE(pp.exchange_rate, 1) END, 2) AS amount_in_base_currency,
                base_currency.code AS base_currency_code
            FROM purchase_payments pp
            LEFT JOIN currencies base_currency
                ON base_currency.id = (${BASE_CURRENCY_ID_SQL})
            ORDER BY pp.payment_date DESC, pp.id DESC`)
        res.json(result.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/purchase_payments/:id', authenticateToken, authorizePermission('purchases.read'), async (req, res) => {
    try {
        const result = await carpetDB.query(
            'SELECT * FROM purchase_payments WHERE id = $1', [req.params.id]
        )
        if (!result.rows.length) return res.status(404).json({ message: 'Purchase payment not found' })
        res.json(result.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/purchase_payment_options', authenticateToken, authorizePermission('purchases.read'), async (req, res) => {
    try {
        const rateDate = req.query.date || new Date().toISOString().slice(0, 10)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(rateDate)) {
            return res.status(400).json({ message: 'Rate date must be a valid calendar date.' })
        }
        const [currenciesResult, purchasesResult] = await Promise.all([
            carpetDB.query(`
                SELECT c.id, c.code, c.name, c.symbol, c.id = (${BASE_CURRENCY_ID_SQL}) AS is_base,
                    CASE WHEN c.id = (${BASE_CURRENCY_ID_SQL}) THEN 1
                         ELSE rate.rate_to_base END AS rate_to_base
                FROM currencies c
                LEFT JOIN LATERAL (
                    SELECT er.rate_to_base
                    FROM exchange_rates er
                    WHERE er.currency_id = c.id AND er.rate_date <= $1::date
                    ORDER BY er.rate_date DESC, er.id DESC
                    LIMIT 1
                ) rate ON TRUE
                ORDER BY c.id`, [rateDate]),
            carpetDB.query(`
                SELECT p.*,
                    CASE WHEN p.currency_id = (${BASE_CURRENCY_ID_SQL}) THEN 1
                         ELSE COALESCE(p.exchange_rate, 1) END AS purchase_base_rate,
                    COALESCE(payments.paid_base, 0) AS paid_amount_base,
                    ROUND(p.total_amount * CASE WHEN p.currency_id = (${BASE_CURRENCY_ID_SQL}) THEN 1
                         ELSE COALESCE(p.exchange_rate, 1) END, 2) AS total_amount_base,
                    ROUND(GREATEST(
                        p.total_amount * CASE WHEN p.currency_id = (${BASE_CURRENCY_ID_SQL}) THEN 1
                             ELSE COALESCE(p.exchange_rate, 1) END - COALESCE(payments.paid_base, 0),
                        0
                    ), 2) AS balance_amount_base,
                    ROUND(COALESCE(payments.paid_base, 0) / NULLIF(
                        CASE WHEN p.currency_id = (${BASE_CURRENCY_ID_SQL}) THEN 1
                             ELSE COALESCE(p.exchange_rate, 1) END, 0
                    ), 2) AS paid_amount,
                    ROUND(GREATEST(
                        p.total_amount * CASE WHEN p.currency_id = (${BASE_CURRENCY_ID_SQL}) THEN 1
                             ELSE COALESCE(p.exchange_rate, 1) END - COALESCE(payments.paid_base, 0),
                        0
                    ) / NULLIF(
                        CASE WHEN p.currency_id = (${BASE_CURRENCY_ID_SQL}) THEN 1
                             ELSE COALESCE(p.exchange_rate, 1) END, 0
                    ), 2) AS balance_amount
                FROM purchases p
                LEFT JOIN LATERAL (
                    SELECT SUM(ROUND(pp.amount * CASE
                        WHEN pp.currency_id = (${BASE_CURRENCY_ID_SQL}) THEN 1
                        ELSE COALESCE(pp.exchange_rate, 1) END, 2)) AS paid_base
                    FROM purchase_payments pp WHERE pp.purchase_id = p.id
                ) payments ON TRUE
                ORDER BY p.purchase_date DESC, p.id DESC`)
        ])
        res.json({ currencies: currenciesResult.rows, purchases: purchasesResult.rows })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/purchase_payments', authenticateToken, authorizePermission('purchases.manage'), async (req, res) => {
    const {
        purchase_id, payment_date, payment_method, payment_mode = 'partial',
        amount, currency_id, exchange_rate, notes
    } = req.body

    if (!Number.isInteger(Number(purchase_id)) || Number(purchase_id) <= 0 ||
        !Number.isInteger(Number(currency_id)) || Number(currency_id) <= 0 ||
        !['partial', 'full'].includes(payment_mode) ||
        !Number.isFinite(Number(exchange_rate)) || Number(exchange_rate) <= 0 ||
        (payment_mode === 'partial' && (!Number.isFinite(Number(amount)) || Number(amount) <= 0))) {
        return res.status(400).json({ message: 'Invalid purchase payment details.' })
    }

    try {
        const result = await transaction(async client => {
            const summary = await getPurchasePaymentSummary(Number(purchase_id), client, true)
            const currency = await client.query(`
                SELECT c.id, c.id = (${BASE_CURRENCY_ID_SQL}) AS is_base,
                    (SELECT er.rate_to_base FROM exchange_rates er
                     WHERE er.currency_id = c.id AND er.rate_date <= $2::date
                     ORDER BY er.rate_date DESC, er.id DESC LIMIT 1) AS rate_to_base
                FROM currencies c WHERE c.id = $1`, [currency_id, String(payment_date).slice(0, 10)])
            if (!currency.rows.length) throw Object.assign(new Error('Selected currency was not found.'), { status: 400 })

            const paymentRate = currency.rows[0].is_base ? 1 : Number(currency.rows[0].rate_to_base)
            if (!Number.isFinite(paymentRate) || paymentRate <= 0) {
                throw Object.assign(new Error('No exchange rate is available for this currency and payment date.'), { status: 400 })
            }
            const remainingBase = summary.balanceBase
            if (remainingBase <= 0.005) {
                throw Object.assign(new Error('This purchase has no outstanding balance.'), { status: 400 })
            }

            let finalAmount
            if (payment_mode === 'full') {
                const amountResult = await client.query(
                    'SELECT ROUND($1::numeric / $2::numeric, 2)::text AS amount',
                    [remainingBase, paymentRate]
                )
                finalAmount = Number(amountResult.rows[0].amount)
            } else {
                finalAmount = Number(amount)
            }

            if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
                throw Object.assign(new Error('Payment amount must be greater than zero.'), { status: 400 })
            }

            const converted = await client.query(
                'SELECT ROUND($1::numeric * $2::numeric, 2)::numeric AS amount_base',
                [finalAmount, paymentRate]
            )
            const amountBase = Number(converted.rows[0].amount_base)

            if (payment_mode === 'partial' && amountBase >= remainingBase - 0.005) {
                throw Object.assign(new Error('A partial payment must be less than the remaining balance.'), { status: 400 })
            }
            if (amountBase > remainingBase + 0.005) {
                throw Object.assign(new Error('Payment cannot exceed the remaining balance.'), { status: 400 })
            }

            await client.query(`
                INSERT INTO purchase_payments
                    (purchase_id, payment_date, payment_method, amount, currency_id,
                     exchange_rate, notes, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [purchase_id, payment_date, payment_method, finalAmount, currency_id,
                paymentRate, notes || null, req.user?.id || null])

            const updated = await updatePurchasePaymentStatus(Number(purchase_id), client)
            return { amount: finalAmount, summary: updated }
        })

        res.status(201).json({
            message: 'New purchase payment has been added.',
            amount: result.amount,
            payment_status: result.summary.status,
            balance: result.summary.balance
        })
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message })
    }
})

module.exports = router
