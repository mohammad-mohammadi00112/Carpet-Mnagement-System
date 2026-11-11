
const carpetDB = require('../configDb')

const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

router.get('/currencies', authenticateToken, authorizePermission('settings.read'),(_, res) => {
    carpetDB
        .query(`SELECT * FROM currencies;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.get('/currencies/:id', authenticateToken, authorizePermission('settings.read'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`SELECT * FROM currencies WHERE id = ${id};`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.post('/currencies', authenticateToken, authorizePermission('settings.manage'),(req, res) => {
    const { code, name, symbol, is_base, is_active } = req.body
    carpetDB
        .query(`INSERT INTO currencies (code, name, symbol, is_base, is_active)
        VALUES ($1, $2, $3, $4, $5)
        `,[code, name, symbol, is_base, is_active])
        .then(() => res.json({ message: 'One Currency Has Been Added!'}))
        .catch((error) => res.json(error))
})
 
router.delete('/currencies/:id', authenticateToken, authorizePermission('settings.manage'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`DELETE FROM currencies WHERE id = ${id};`)
        .then(() => res.json({ message: 'One Currency Has Been Deleted!' }))
        .catch((error) => res.json(error))
})

router.put('/currencies/:id', authenticateToken, authorizePermission('settings.manage'),(req, res) => {
    const { id } = req.params
    const { code, name, symbol, is_base, is_active } = req.body
    carpetDB
        .query(`UPDATE currencies
                SET 
                code = $1,
                name = $2,
                symbol = $3,
                is_base = $4,
                is_active = $5
                WHERE id = $6;
            `, [code, name, symbol, is_base, is_active, id])
        .then(() => res.json({ message: 'Currency Has Been Updated!' }))
        .catch((error) => res.json(error))

})

router.patch('/currencies/:id', authenticateToken, authorizePermission('settings.manage'),(req, res) => {
    const { id } = req.params
    const entries = Object.entries(req.body)
    const changes = entries.map((entry, index) => 
        `${entry[0]}=$${index + 1}`
    ).join(',')
    const value = entries.map(entry => entry[1])

    carpetDB
        .query(`UPDATE currencies
                SET 
                ${changes}
                WHERE id = $${value.length + 1}
            `,[...value,id])
        .then(() => res.json({message: 'currency Has Been Updated!'}))
        .catch((error) => res.json(error))
})


module.exports = router