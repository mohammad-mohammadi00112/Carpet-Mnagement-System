
const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

router.get('/sale_returns', authenticateToken, authorizePermission('sales.read'),(_, res) => {
    carpetDB
        .query(`SELECT * FROM sale_returns;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.get('/sale_returns/:id', authenticateToken, authorizePermission('sales.read'),(req, res) => {
    const {id} = req.params
    carpetDB    
        .query(`SELECT * FROM sale_returns WHERE id = $1;`, [id])
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.post('/sale_returns', authenticateToken, authorizePermission('sales.manage'),(req, res) => {
    const {sale_id,return_date,reason,refund_amount,processed_by}  = req.body
    carpetDB
        .query(`INSERT INTO sale_returns (sale_id,return_date,reason,refund_amount,processed_by)
            VALUES ($1, $2, $3, $4, $5)
            `, [sale_id, return_date, reason, refund_amount, processed_by])
        .then(() => res.json({message: 'New sale Return Has Been Added!'}))
        .catch((error) => res.json(error))
})

module.exports = router