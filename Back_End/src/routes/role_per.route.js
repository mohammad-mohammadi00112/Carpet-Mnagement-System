
const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())

const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

router.get('/role_permissions', authenticateToken, authorizePermission('admin.manage'),(_, res) => {
    carpetDB
        .query(`SELECT * FROM role_permissions;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.get('/role_permissions/:id', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const {id} = req.params
    carpetDB
        .query(`SELECT * FROM role_permissions WHERE id = $1;`,[id])
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})
router.delete('/role_permissions/:id', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const {id} = req.params
    carpetDB
        .query(`DELETE  FROM role_permissions WHERE id = $1;`, [id])
        .then(() => res.json({message: 'One Permission Has Been Deleted!'}))
        .catch((error) => res.json(error))
})
router.post('/role_permissions', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const {role_id,permission_id} = req.body
    carpetDB    
        .query(`INSERT INTO role_permissions (role_id,permission_id)
            VALUES ($1, $2)
            `, [role_id, permission_id])
        .then(() => res.json({message: 'New Permission Has Been Saved!'}))
        .catch((error) => res.json(error))
})

module.exports = router