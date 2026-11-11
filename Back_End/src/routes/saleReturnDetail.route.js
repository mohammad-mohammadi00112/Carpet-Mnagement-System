const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())

const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')
const transaction = require('../utils/transaction')
const { addReturnDetail } = require('../services/return.service')

router.get('/sale_return_details', authenticateToken, authorizePermission('sales.read'), (_, res) => {
    carpetDB
        .query(`SELECT * FROM sale_return_details;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.get('/sale_return_details/:id', authenticateToken, authorizePermission('sales.read'), (req, res) => {
    const { id } = req.params
    carpetDB
        .query(`SELECT * FROM sale_return_details WHERE id = $1;`, [id])
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.post('/sale_return_details', authenticateToken, authorizePermission('sales.manage'), async (req, res) => {
    const { return_id, sales_detail_id, location_id, quantity, refund_price } = req.body

    try {
        await transaction(async (client) => {
            await addReturnDetail(
                return_id,
                sales_detail_id,
                location_id,
                quantity,
                refund_price,
                client
            )
        })

        res.json({ message: 'New Return Details Has Been Saved!' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router