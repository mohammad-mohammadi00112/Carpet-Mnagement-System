const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())

const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

const { updatePurchaseTotalForIds } = require('../services/purchase.service')
const { addStock, removeStock } = require('../services/inventory.service')

const transaction = require('../utils/transaction')

// GET All Purchase Details
router.get('/purchase_details', authenticateToken, authorizePermission('purchases.read'), async (_, res) => {
    try {
        const result = await carpetDB.query(
            'SELECT * FROM purchase_details'
        )

        res.json(result.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// GET Purchase Detail By ID
router.get('/purchase_details/:id', authenticateToken, authorizePermission('purchases.read'), async (req, res) => {
    try {
        const result = await carpetDB.query(
            'SELECT * FROM purchase_details WHERE id = $1',
            [req.params.id]
        )

        if (!result.rows.length) {
            return res.status(404).json({
                message: 'Purchase Detail Not Found!'
            })
        }

        res.json(result.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// DELETE Purchase Detail
router.delete('/purchase_details/:id', authenticateToken, authorizePermission('purchases.manage'), async (req, res) => {
    try {
        const result = await transaction(async (client) => {

            const deleted = await client.query(`
                DELETE FROM purchase_details
                WHERE id = $1
                RETURNING purchase_id, carpet_id, location_id, quantity`
                , [req.params.id])

            if (!deleted.rows.length) {
                return { notFound: true }
            }

            const detail = deleted.rows[0]

            // Remove old stock
            await removeStock(
                detail.carpet_id,
                detail.location_id,
                detail.quantity,
                client
            )

            // Update purchase total
            await updatePurchaseTotalForIds(
                detail.purchase_id,
                client
            )

            return { success: true }
        })

        if (result.notFound) {
            return res.status(404).json({
                message: 'Purchase Detail Not Found!'
            })
        }

        res.json({ message: 'Purchase Detail Has Been Deleted!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// POST Purchase Detail
router.post('/purchase_details', authenticateToken, authorizePermission('purchases.manage'), async (req, res) => {
    const {
        purchase_id,
        carpet_id,
        location_id,
        quantity,
        purchase_price
    } = req.body

    try {
        await transaction(async (client) => {

            await client.query(`
                INSERT INTO purchase_details (
                    purchase_id,
                    carpet_id,
                    location_id,
                    quantity,
                    purchase_price
                )
                VALUES ($1, $2, $3, $4, $5)`
                , [
                    purchase_id,
                    carpet_id,
                    location_id,
                    quantity,
                    purchase_price
                ])

            // Add stock
            await addStock(
                carpet_id,
                location_id,
                quantity,
                client
            )

            // Update purchase total
            await updatePurchaseTotalForIds(
                purchase_id,
                client
            )
        })

        res.json({ message: 'New Purchase Detail Has Been Saved!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// PATCH Purchase Detail
router.patch('/purchase_details/:id', authenticateToken, authorizePermission('purchases.manage'), async (req, res) => {
    const { id } = req.params

    const allowedFields = [
        'purchase_id',
        'carpet_id',
        'location_id',
        'quantity',
        'purchase_price'
    ]

    const entries = Object.entries(req.body).filter(
        ([key]) => allowedFields.includes(key)
    )

    if (!entries.length) {
        return res.status(400).json({
            message: 'No valid fields provided!'
        })
    }

    const changes = entries.map(
        ([key], index) => `${key} = $${index + 1}`
    ).join(', ')

    const values = entries.map(([, value]) => value)

    try {
        const result = await transaction(async (client) => {

            const oldResult = await client.query(`
                SELECT purchase_id, carpet_id, location_id, quantity
                FROM purchase_details
                WHERE id = $1
                FOR UPDATE`
                , [id])

            if (!oldResult.rows.length) {
                return { notFound: true }
            }

            const oldDetail = oldResult.rows[0]

            const newPurchaseId = req.body.purchase_id ?? oldDetail.purchase_id
            const newCarpetId = req.body.carpet_id ?? oldDetail.carpet_id
            const newLocationId = req.body.location_id ?? oldDetail.location_id
            const newQuantity = req.body.quantity ?? oldDetail.quantity

            // Remove old stock
            await removeStock(
                oldDetail.carpet_id,
                oldDetail.location_id,
                oldDetail.quantity,
                client
            )

            // Add new stock
            await addStock(
                newCarpetId,
                newLocationId,
                newQuantity,
                client
            )

            await client.query(`
                UPDATE purchase_details
                SET ${changes}
                WHERE id = $${values.length + 1}`
                , [...values, id])

            // Update old and new purchase totals
            await updatePurchaseTotalForIds(
                oldDetail.purchase_id,
                newPurchaseId,
                client
            )

            return { success: true }
        })

        if (result.notFound) {
            return res.status(404).json({
                message: 'Purchase Detail Not Found!'
            })
        }

        res.json({ message: 'Purchase Detail Has Been Updated!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// PUT Purchase Detail
router.put('/purchase_details/:id', authenticateToken, authorizePermission('purchases.manage'), async (req, res) => {
    const { id } = req.params

    const {
        purchase_id,
        carpet_id,
        location_id,
        quantity,
        purchase_price
    } = req.body

    try {
        const result = await transaction(async (client) => {

            const oldResult = await client.query(`
                SELECT purchase_id, carpet_id, location_id, quantity
                FROM purchase_details
                WHERE id = $1
                FOR UPDATE`
                , [id])

            if (!oldResult.rows.length) {
                return { notFound: true }
            }

            const oldDetail = oldResult.rows[0]

            // Remove old stock
            await removeStock(
                oldDetail.carpet_id,
                oldDetail.location_id,
                oldDetail.quantity,
                client
            )

            // Add new stock
            await addStock(
                carpet_id,
                location_id,
                quantity,
                client
            )

            await client.query(`
                   UPDATE purchase_details
                SET
                    purchase_id = $1,
                    carpet_id = $2,
                    location_id = $3,
                    quantity = $4,
                    purchase_price = $5
                WHERE id = $6
            `, [
                purchase_id,
                carpet_id,
                location_id,
                quantity,
                purchase_price,
                id
            ])

            // Update old and new purchase totals
            await updatePurchaseTotalForIds(
                oldDetail.purchase_id,
                purchase_id,
                client
            )

            return { success: true }
        })

        if (result.notFound) {
            return res.status(404).json({
                message: 'Purchase Detail Not Found!'
            })
        }

        res.json({ message: 'Purchase Detail Has Been Updated!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router