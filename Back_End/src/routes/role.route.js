

const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')


router.get('/roles', authenticateToken, authorizePermission('admin.manage'),(_, res) => {
    carpetDB
        .query(`SELECT * FROM roles;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})
router.get('/roles/:id', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`SELECT * FROM roles WHERE id = $1;`, [id])
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.delete('/roles/:id', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`DELETE FROM roles WHERE id = $1;`, [id])
        .then(() => res.json({ message: 'One Role Has Been Deleted!' }))
        .catch((error) => res.json(error))
})

router.post('/roles', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const { name, description, is_system } = req.body

    carpetDB
        .query(`INSERT INTO roles (name, description, is_system)
        VALUES ($1, $2, $3)
        `, [name, description, is_system])
        .then(() => res.json({ message: 'New Role Has Been Added!' }))
        .catch((error) => res.json(error))
})

router.put('/roles/:id', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const { id } = req.params
    const { name, description, is_system } = req.body
    carpetDB
        .query(`UPDATE roles 
                SET 
                    name = $1,
                    description = $2,
                    is_system = $3
                WHERE id = $4;
                `, [name, description, is_system, id])
        .then(() => res.json({ message: 'Role Has Been Updated!' }))
        .catch((error) => res.json(error))

})

router.patch('/roles/:id', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const { id } = req.params
    const entries = Object.entries(req.body)
    const changes = entries.map((entry, index) =>
        `${entry[0]} = $${index + 1}`
    ).join(',')
    const value = entries.map(entry => entry[1])
    carpetDB
        .query(`UPDATE roles
                SET 
                ${changes}
                WHERE id = $${value.length + 1}
            `, [...value, id])
        .then(() => res.json({ message: 'Role Has Been Updated!' }))
        .catch((error) => res.json(error))
})

module.exports = router