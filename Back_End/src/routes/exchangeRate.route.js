

const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

router.get('/exchange_rates', authenticateToken, authorizePermission('settings.read'),(_, res) => {
    carpetDB
        .query(`SELECT * FROM exchange_rates;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.get('/exchange_rates/:id', authenticateToken, authorizePermission('settings.read'),(req, res) => {
    const {id} = req.params
    carpetDB    
        .query(`SELECT * FROM exchange_rates WHERE id = $1;`,[id])
        .then((result)  => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.post('/exchange_rates', authenticateToken, authorizePermission('settings.manage'),(req, res) => {
    const {currency_id,rate_to_base,rate_date,created_by} = req.body
    carpetDB
        .query(`INSERT INTO exchange_rates (currency_id,rate_to_base,rate_date,created_by)
            VALUES ($1, $2, $3, $4)
            `, [currency_id, rate_to_base, rate_date, created_by])
        .then(() => res.json({message: 'New Exchange Has Been Added!'}))
        .catch((error) => res.json(error))
})

module.exports = router