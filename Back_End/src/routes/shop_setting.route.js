

const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

router.get('/shop_settings', authenticateToken, authorizePermission('settings.read'),(_, res) => {
    carpetDB
        .query(`SELECT * FROM shop_settings;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})
router.get('/shop_settings/:id', authenticateToken, authorizePermission('settings.read'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`SELECT * FROM shop_settings WHERE id = $1;`, [id])
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})
router.delete('/shop_settings/:id', authenticateToken, authorizePermission('settings.manage'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`DELETE FROM shop_settings WHERE id = $1;`, [id])
        .then(() => res.json({message: 'One Setting Has Been Deleted!'}))
        .catch((error) => res.json(error))
})
router.post('/shop_settings', authenticateToken, authorizePermission('settings.manage'),(req, res) => {
    const { shop_name, phone, address, invoice_prefix, invoice_footer, tax_rate, base_currency_id } = req.body
    carpetDB
        .query(`INSERT INTO shop_settings (shop_name,phone,address,invoice_prefix,invoice_footer,tax_rate,base_currency_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [shop_name, phone, address, invoice_prefix, invoice_footer, tax_rate, base_currency_id])
        .then(() => res.json({ message: 'New Setting Has Been Added!' }))
        .catch((error) => res.json(error))
})
router.put('/shop_settings/:id', authenticateToken, authorizePermission('settings.manage'),(req, res) => {
    const { id } = req.params
    const { shop_name, phone, address, invoice_prefix, invoice_footer, tax_rate, base_currency_id } = req.body
    carpetDB
        .query(`UPDATE shop_settings
            SET
              shop_name = $1,
              phone = $2,
              address = $3,
              invoice_prefix = $4,
              invoice_footer = $5,
              tax_rate = $6,
              base_currency_id = $7
            WHERE id = $8;
            `, [shop_name, phone, address, invoice_prefix, invoice_footer, tax_rate, base_currency_id, id])
        .then(() => res.json({ message: 'Setting Has Been Updated!' }))
        .catch((error) => res.json(error))
})

router.patch('/shop_settings/:id', authenticateToken, authorizePermission('settings.manage'),(req, res) => {
    const { id } = req.params
    const entries = Object.entries(req.body)
    const changes = entries.map((entry, index) =>
        `${entry[0]} = $${index + 1}`
    ).join(',')
    const value = entries.map(entry => entry[1])
    carpetDB
        .query(`UPDATE shop_settings SET ${changes} WHERE id = $${value.length + 1}`, [...value, id])
        .then(() => res.json({ message: 'Some Parts Of Setting Has Been Updated!' }))
        .catch((error) => res.json(error))
})

module.exports = router