const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())

const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

const {
    updateSaleTotals,
    updateSaleTotalsForIds
} = require('../services/sale.service')

const { addStock, removeStock } = require('../services/inventory.service')

const transaction = require('../utils/transaction')

// Validate Sale Detail Values
const validateSaleDetail = (quantity, sale_price, discount = 0) => {
    if (
        !Number.isFinite(Number(quantity)) ||
        !Number.isFinite(Number(sale_price)) ||
        !Number.isFinite(Number(discount)) ||
        Number(quantity) <= 0 ||
        Number(sale_price) < 0 ||
        Number(discount) < 0 ||
        Number(discount) > Number(quantity) * Number(sale_price)
    ) {
        return false
    }

    return true
}

// GET All Sale Details
router.get('/sales_details', authenticateToken, authorizePermission('sales.read'), async (_, res) => {
    try {
        const result = await carpetDB.query(
            'SELECT * FROM sales_details'
        )

        res.json(result.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// GET Sale Detail By ID
router.get('/sales_details/:id', authenticateToken, authorizePermission('sales.read'), async (req, res) => {
    try {
        const result = await carpetDB.query(
            'SELECT * FROM sales_details WHERE id = $1',
            [req.params.id]
        )

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Sale Detail Not Found!' })
        }

        res.json(result.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// POST Sale Detail
router.post('/sales_details', authenticateToken, authorizePermission('sales.manage'), async (req, res) => {
    const {
        sale_id,
        carpet_id,
        location_id,
        quantity,
        sale_price,
        discount
    } = req.body

    if (!validateSaleDetail(quantity, sale_price, discount ?? 0)) {
        return res.status(400).json({ message: 'Invalid sale details values!' })
    }

    try {
        const result = await transaction(async (client) => {

            await removeStock(carpet_id, location_id, quantity, client)

            await client.query(`
                INSERT INTO sales_details (
                    sale_id, carpet_id, location_id,
                    quantity, sale_price, discount
                )
                VALUES ($1, $2, $3, $4, $5, $6)`
                , [
                    sale_id,
                    carpet_id,
                    location_id,
                    quantity,
                    sale_price,
                    discount ?? 0
                ])

            return await updateSaleTotals(sale_id, client)
        })

        res.json({
            message: 'New Details Has Been Saved!',
            sale: result
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// PUT Sale Detail
router.put('/sales_details/:id', authenticateToken, authorizePermission('sales.manage'), async (req, res) => {
    const { id } = req.params

    const {
        sale_id,
        carpet_id,
        location_id,
        quantity,
        sale_price,
        discount
    } = req.body

    if (!validateSaleDetail(quantity, sale_price, discount ?? 0)) {
        return res.status(400).json({ message: 'Invalid sale details values!' })
    }

    try {
        const result = await transaction(async (client) => {

            const oldSale = await client.query(`
                SELECT sale_id, carpet_id, location_id, quantity
                FROM sales_details
                WHERE id = $1
                FOR UPDATE`
                , [id])

            if (!oldSale.rows.length) {
                return { notFound: true }
            }

            const oldDetail = oldSale.rows[0]
            // Return old stock
            await addStock(
                oldDetail.carpet_id,
                oldDetail.location_id,
                oldDetail.quantity,
                client
            )

            // Remove new stock
            await removeStock(
                carpet_id,
                location_id,
                quantity,
                client
            )

            await client.query(`
                UPDATE sales_details SET
                    sale_id = $1,
                carpet_id = $2,
                location_id = $3,
                quantity = $4,
                sale_price = $5,
                discount = $6
                WHERE id = $7`
                , [
                    sale_id,
                    carpet_id,
                    location_id,
                    quantity,
                    sale_price,
                    discount ?? 0,
                    id
                ])

            await updateSaleTotalsForIds(
                oldDetail.sale_id,
                sale_id,
                client
            )

            return { success: true }
        })

        if (result.notFound) {
            return res.status(404).json({ message: 'Sale Detail Not Found!' })
        }

        res.json({ message: 'Details Has Been Updated!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// PATCH Sale Detail
router.patch('/sales_details/:id', authenticateToken, authorizePermission('sales.manage'), async (req, res) => {
    const { id } = req.params

    const allowed = [
        'sale_id',
        'carpet_id',
        'location_id',
        'quantity',
        'sale_price',
        'discount'
    ]

    const entries = Object.entries(req.body).filter(
        ([key]) => allowed.includes(key)
    )

    if (!entries.length) {
        return res.status(400).json({ message: 'No valid fields provided!' })
    }

    const changes = entries.map(
        ([key], index) => `${ key } = $${ index + 1}`
).join(', ')

const values = entries.map(([, value]) => value)

try {
    const result = await transaction(async (client) => {

        const oldSale = await client.query(`
            SELECT sale_id, carpet_id, location_id,
            quantity, sale_price, discount
                FROM sales_details
                WHERE id = $1
                FOR UPDATE`
            , [id])

        if (!oldSale.rows.length) {
            return { notFound: true }
        }

        const detail = oldSale.rows[0]

        const quantity = req.body.quantity ?? detail.quantity
        const sale_price = req.body.sale_price ?? detail.sale_price
        const discount = req.body.discount ?? detail.discount

        if (!validateSaleDetail(quantity, sale_price, discount)) {
            return { invalid: true }
        }

        const newSaleId = req.body.sale_id ?? detail.sale_id
        const newCarpetId = req.body.carpet_id ?? detail.carpet_id
        const newLocationId = req.body.location_id ?? detail.location_id

        // Return old stock
        await addStock(
            detail.carpet_id,
            detail.location_id,
            detail.quantity,
            client
        )

        // Remove new stock
        await removeStock(
            newCarpetId,
            newLocationId,
            quantity,
            client
        )

        await client.query(`
            UPDATE sales_details
                SET ${ changes }
                WHERE id = $${ values.length + 1 }`
            , [...values, id])

        await updateSaleTotalsForIds(
            detail.sale_id,
            newSaleId,
            client
        )

        return { success: true }
    })

    if (result.notFound) {
        return res.status(404).json({ message: 'Sale Detail Not Found!' })
    }
    if (result.invalid) {
        return res.status(400).json({ message: 'Invalid sale details values!' })
    }

    res.json({ message: 'Sale Detail Has Been Updated!' })
} catch (error) {
    res.status(500).json({ message: error.message })
}
})

// DELETE Sale Detail
router.delete('/sales_details/:id', authenticateToken, authorizePermission('sales.manage'), async (req, res) => {
    try {
        const result = await transaction(async (client) => {

            const deleted = await client.query(`
                DELETE FROM sales_details
                WHERE id = $1
                RETURNING sale_id, carpet_id, location_id, quantity`
                , [req.params.id])

            if (!deleted.rows.length) {
                return { notFound: true }
            }

            const detail = deleted.rows[0]

            // Return stock
            await addStock(
                detail.carpet_id,
                detail.location_id,
                detail.quantity,
                client
            )

            await updateSaleTotals(detail.sale_id, client)

            return { success: true }
        })

        if (result.notFound) {
            return res.status(404).json({ message: 'Sale Detail Not Found!' })
        }

        res.json({ message: 'Detail Has Been Deleted!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router