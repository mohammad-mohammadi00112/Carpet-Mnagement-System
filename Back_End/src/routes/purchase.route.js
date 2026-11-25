
const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')
const transaction = require('../utils/transaction')
const { updatePurchasePaymentStatus } = require('../services/purchasePayment.service')
const { BASE_CURRENCY_ID_SQL } = require('../services/baseCurrency')

const purchasesWithPaymentTotals = `
    SELECT p.*,
        (SELECT code FROM currencies WHERE id = (${BASE_CURRENCY_ID_SQL})) AS base_currency_code,
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
        ), 2) AS balance_amount,
        CASE
            WHEN p.total_amount <= 0 OR COALESCE(payments.paid_base, 0) <= 0 THEN 'unpaid'
            WHEN COALESCE(payments.paid_base, 0) >=
                ROUND(p.total_amount * CASE WHEN p.currency_id = (${BASE_CURRENCY_ID_SQL}) THEN 1
                    ELSE COALESCE(p.exchange_rate, 1) END, 2) - 0.01 THEN 'paid'
            ELSE 'partial'
        END AS calculated_payment_status
    FROM purchases p
    LEFT JOIN LATERAL (
        SELECT SUM(ROUND(pp.amount * CASE WHEN pp.currency_id = (${BASE_CURRENCY_ID_SQL}) THEN 1
            ELSE COALESCE(pp.exchange_rate, 1) END, 2)) AS paid_base
        FROM purchase_payments pp WHERE pp.purchase_id = p.id
    ) payments ON TRUE`

router.get('/purchases', authenticateToken, authorizePermission('purchases.read'),(_, res) => {
    carpetDB
        .query(`${purchasesWithPaymentTotals} ORDER BY p.purchase_date DESC, p.id DESC`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.get('/purchases/:id', authenticateToken, authorizePermission('purchases.read'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`${purchasesWithPaymentTotals} WHERE p.id = $1;`, [id])
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})
router.post('/purchases', authenticateToken, authorizePermission('purchases.manage'), async (req, res) => {
        const { supplier_id, employee_id, purchase_date, purchase_place,
        currency_id, exchange_rate, total_amount, status, notes, created_by } = req.body

    try {
      const purchaseId = await transaction(async client => {
        const inserted = await client.query(`INSERT INTO purchases (supplier_id,employee_id,purchase_date,purchase_place,
            currency_id,exchange_rate,total_amount,payment_status,status,notes,created_by)
            VALUES ($1, $2,$3,$4, $5, $6, $7, 'unpaid', $8, $9,$10 )
            RETURNING id`, [supplier_id, employee_id, purchase_date, purchase_place, currency_id, exchange_rate, total_amount, status, notes, created_by])
        await updatePurchasePaymentStatus(inserted.rows[0].id, client)
        return inserted.rows[0].id
      })
      res.status(201).json({ message: 'New Purchase saved Successfully', id: purchaseId })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
})

router.delete('/purchases/:id', authenticateToken, authorizePermission('purchases.manage'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`DELETE FROM purchases WHERE id = $1;`, [id])
        .then(() => res.json({ message: 'Purchase Has Been Deleted!' }))
        .catch((error) => res.json(error))
})

router.patch('/purchases/:id', authenticateToken, authorizePermission('purchases.manage'), async (req, res) => {
    const { id } = req.params
    const entries = Object.entries(req.body)
    const changes = entries.map((entry, index) =>
        `${entry[0]} = $${index + 1}`
    ).join(',')
    const value = entries.map(entry => entry[1])

    try {
      await transaction(async client => {
        await client.query(`UPDATE purchases SET ${changes} WHERE id = $${value.length + 1}`,
          [...value, id])
        await updatePurchasePaymentStatus(id, client)
      })
      res.json({ message: 'Purchase Has Been Updated!' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
})

router.put('/purchases/:id', authenticateToken, authorizePermission('purchases.manage'), async (req, res) => {
    const {id}  = req.params
    const { supplier_id, employee_id, purchase_date, purchase_place,
        currency_id, exchange_rate, total_amount, status, notes, created_by } = req.body

    try {
      await transaction(async client => {
        await client
        .query(`UPDATE purchases 
                SET 
                    supplier_id = $1,
                    employee_id = $2,
                    purchase_date = $3,
                    purchase_place = $4,
                    currency_id = $5,
                    exchange_rate = $6,
                    total_amount = $7,
                    status = $8,
                    notes = $9,
                    created_by = $10
                WHERE id = $11;
            `, [supplier_id, employee_id, purchase_date, purchase_place, currency_id, exchange_rate,
                 total_amount, status, notes, created_by, id])
        await updatePurchasePaymentStatus(id, client)
      })
      res.json({ message: 'Purchase Has Been Updated!' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }


})

module.exports = router
