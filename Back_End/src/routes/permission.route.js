
const carpetDB = require('../configDb')

const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

router.get('/permissions', authenticateToken, authorizePermission('admin.manage'),(_, res) => {
    carpetDB
        .query(`SELECT * FROM permissions;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})
router.get('/permissions/:id', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`SELECT * FROM permissions WHERE id = ${id};`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.delete('/permissions/:id', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`DELETE  FROM permissions WHERE id = $1;`,[id])
        .then(() => res.json({ message: 'Permission Has Been Deleted!' }))
        .catch((error) => res.json(error))
})

router.post('/permissions', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const { code, description } = req.body
    carpetDB
        .query(`INSERT INTO permissions (code , description)
        VALUES ($1, $2)
        
        `, [code, description])
        .then(() => res.json({ message: 'New Permission Has Been Saved!' }))
        .catch((error) => res.json(error))
})
router.put('/permissions/:id', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const { id } = req.params
    const { code, description } = req.body

    carpetDB
        .query(`UPDATE permissions
                SET 
                    code = $1,
                    description = $2
                WHERE id = $3
                `,[code, description, id])
        .then(() => res.json({ message: 'Permission Has Been Updated!' }))
        .catch((error) => res.json(error))
})

router.patch('/permissions/:id', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const { id } = req.params
    const entries = Object.entries(req.body)
    const changes = entries.map((entry, index) => 
        `${entry[0]} =$${index + 1}`
    ).join(',')
    const value = entries.map(entry => entry[1])
    carpetDB
        .query(`UPDATE permissions
                SET 
                ${changes}
                WHERE id = $${value.length + 1}
            `,[...value,id])
        .then(() => res.json({ message: 'Permission Updated Successfully!' }))
        .catch((error) => res.json(error))
})

module.exports = router