
const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()

router.use(express.json())

const path = require('path')
const fs = require('fs')

const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')
const upload = require('../meddilewares/uploadmiddleware')

// GET ALL SETTINGS
router.get(
    '/shop_settings',
    authenticateToken,
    authorizePermission('settings.read'),
    (_, res) => {
        carpetDB
            .query(`SELECT * FROM shop_settings;`)
            .then((result) => res.json(result.rows))
            .catch((error) => res.status(500).json({ message: error.message }))
    }
)

// GET SETTING BY ID
router.get(
    '/shop_settings/:id',
    authenticateToken,
    authorizePermission('settings.read'),
    (req, res) => {
        const { id } = req.params

        carpetDB
            .query(`SELECT * FROM shop_settings WHERE id = $1;`, [id])
            .then((result) => res.json(result.rows))
            .catch((error) => res.status(500).json({ message: error.message }))
    }
)

// DELETE SETTING
router.delete(
    '/shop_settings/:id',
    authenticateToken,
    authorizePermission('settings.manage'),
    (req, res) => {
        const { id } = req.params

        carpetDB
            .query(`DELETE FROM shop_settings WHERE id = $1;`, [id])
            .then(() => res.json({ message: 'One Setting Has Been Deleted!' }))
            .catch((error) => res.status(500).json({ message: error.message }))
    }
)

// CREATE SETTING
router.post(
    '/shop_settings',
    authenticateToken,
    upload.single('logo'),
    authorizePermission('settings.manage'),
    (req, res) => {
        const {
            shop_name,
            phone,
            address,
            invoice_prefix,
            invoice_footer,
            tax_rate,
            base_currency_id
        } = req.body

        const logo = req.file
            ? `/uploads/${req.file.filename}`
            : null

        carpetDB
            .query(
                `INSERT INTO shop_settings
                (shop_name, logo, phone, address, invoice_prefix, invoice_footer, tax_rate, base_currency_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *;`,
                [
                    shop_name,
                    logo,
                    phone,
                    address,
                    invoice_prefix,
                    invoice_footer,
                    tax_rate,
                    base_currency_id
                ]
            )
            .then((result) => res.json(result.rows[0]))
            .catch((error) => {
                if (req.file) {
                    fs.unlink(
                        path.join(__dirname, '../../uploads', req.file.filename),
                        () => {}
                    )
                }

                res.status(500).json({ message: error.message })
            })
    }
)

// UPDATE SETTING
router.put(
    '/shop_settings/:id',
    authenticateToken,
    upload.single('logo'),
    authorizePermission('settings.manage'),
    async (req, res) => {
        const { id } = req.params

        const {
            shop_name,
            phone,
            address,
            invoice_prefix,
            invoice_footer,
            tax_rate,
            base_currency_id
        } = req.body

        try {
            const oldResult = await carpetDB.query(
                `SELECT logo FROM shop_settings WHERE id = $1`,
                [id]
            )

            if (oldResult.rows.length === 0) {
                return res.status(404).json({ message: 'Settings not found' })
            }

            const oldLogo = oldResult.rows[0].logo

            const newLogo = req.file
                ? `/uploads/${req.file.filename}`
                : oldLogo

            const result = await carpetDB.query(
                `UPDATE shop_settings
                 SET shop_name = $1,
                     logo = $2,
                     phone = $3,
                     address = $4,
                     invoice_prefix = $5,
                     invoice_footer = $6,
                     tax_rate = $7,
                     base_currency_id = $8,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $9
                 RETURNING *;`,
                [
                    shop_name,
                    newLogo,
                    phone,
                    address,
                    invoice_prefix,
                    invoice_footer,
                    tax_rate,
                    base_currency_id,
                    id
                ]
            )

            if (req.file && oldLogo) {
                const oldFilePath = path.join(
                    __dirname,
                    '../../',
                    oldLogo.replace(/^\/+/, '')
                )

                if (fs.existsSync(oldFilePath)) {
                    fs.unlink(oldFilePath, () => {})
                }
            }

            res.json(result.rows[0])

        } catch (error) {
            if (req.file) {
                fs.unlink(
                    path.join(__dirname, '../../uploads', req.file.filename),
                    () => {}
                )
            }

            res.status(500).json({ message: error.message })
        }
    }
)

// PATCH SETTING
router.patch(
    '/shop_settings/:id',
    authenticateToken,
    authorizePermission('settings.manage'),
    (req, res) => {
        const { id } = req.params
        const entries = Object.entries(req.body)

        if (entries.length === 0) {
            return res.status(400).json({ message: 'No fields provided' })
        }

        const allowedFields = [
            'shop_name',
            'logo',
            'phone',
            'address',
            'invoice_prefix',
            'invoice_footer',
            'tax_rate',
            'base_currency_id'
        ]

        const invalidField = entries.find(
            ([key]) => !allowedFields.includes(key)
        )

        if (invalidField) {
            return res.status(400).json({
                message: `Invalid field: ${invalidField[0]}`
            })
        }

        const changes = entries
            .map(([key], index) => `${key} = $${index + 1}`)
            .join(', ')

        const values = entries.map((entry) => entry[1])

        carpetDB
            .query(
                `UPDATE shop_settings
                 SET ${changes}, updated_at = CURRENT_TIMESTAMP
                 WHERE id = $${values.length + 1}
                 RETURNING *;`,
                [...values, id]
            )
            .then((result) => res.json(result.rows[0]))
            .catch((error) => res.status(500).json({ message: error.message }))
    }
)

module.exports = router
