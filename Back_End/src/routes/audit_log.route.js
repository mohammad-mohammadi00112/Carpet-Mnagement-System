
const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')


router.get('/audit_log', authenticateToken, authorizePermission('reports.read'),(_, res) => {
    carpetDB    
        .query(`SELECT * FROM audit_log;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.get('/audit_log/:id', authenticateToken, authorizePermission('reports.read'),(req, res) => {
    const {id}  = req.params
    carpetDB
        .query(`SELECT * FROM audit_log WHERE id = $1;`, [id])
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

module.exports = router