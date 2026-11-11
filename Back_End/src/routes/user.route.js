
const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')
const validateRequest = require('../meddilewares/validation.middleware')

router.post('/login', validateRequest,(req, res) => {
    const { username, password } = req.body
    carpetDB
        .query(`
            SELECT 
                users.id,
                users.username,
                users.password_hash,
                users.role_id,
                roles.name AS role_name,
                users.is_active
            FROM users
            LEFT JOIN roles ON users.role_id = roles.id
            WHERE users.username = $1;
        `, [username])
        .then(async (result) => {
            if (result.rows.length === 0) {
                return res.json({
                    message: 'Username or Password is Incorrect!'
                })
            }
            const user = result.rows[0]
            if (!user.is_active) {
                return res.json({
                    message: 'Your Account Is Inactive!'
                })
            }
            const isPasswordCorrect = await bcrypt.compare(
                password,
                user.password_hash
            )
            if (!isPasswordCorrect) {
                return res.json({
                    message: 'Username or Password is Incorrect!'
                })
            }
            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    role_id: user.role_id,
                    role_name: user.role_name
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN
                }
            )
            res.json({
                message: 'Login Successful!',
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    role_id: user.role_id,
                    role_name: user.role_name
                }
            })
        })
        .catch((error) => {
            res.json({message: error.message})
        })
})
router.get('/users', authenticateToken, authorizePermission('admin.manage'),(_, res) => {
    carpetDB
        .query('SELECT * FROM users;')
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.get('/users/:id', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`SELECT * FROM users WHERE id = ${id};`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))

})
router.post('/users', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const { employee_id, role_id, username, password_hash, is_active } = req.body
    carpetDB
        .query(`INSERT INTO users(employee_id, role_id, username, password_hash, is_active)
        VALUES ($1, $2, $3, $4, $5)
        `, [employee_id, role_id, username, password_hash, is_active])
        .then(() => res.json({ message: 'Another User Has Been Saved.' }))
        .catch((error) => res.json(error))

})
router.put('/users/:id', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const { id } = req.params
    const { employee_id, role_id, username, password_hash, is_active } = req.body
    carpetDB
        .query(`UPDATE users
                SET 
                    employee_id = $1,
                    role_id = $2,
                    username = $3,
                    password_hash = $4,
                    is_active = $5
                WHERE id = $6;
                `, [employee_id, role_id, username, password_hash, is_active, id])
        .then(() => res.json({ message: 'User Has Been Updated' }))
        .catch((error) => res.json(error))
})
router.patch('/users/:id', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const { id } = req.params
    const entries = Object.entries(req.body)
    const changes = entries.map((entry, index) =>
        `${entry[0]} = $${index + 1}`
    ).join(',')
    const value = entries.map(entry => entry[1])
    carpetDB
        .query(`UPDATE users
                SET 
                ${changes}
                WHERE id = $${value.length + 1};
            `, [...value, id])
        .then(() => res.json({ message: "User Has Been Updated Successfully!" }))
        .catch((error) => res.json(error))
})
router.delete('/users/:id', authenticateToken, authorizePermission('admin.manage'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`DELETE FROM users WHERE id = $1;`, [id])
        .then(() => res.json({ message: 'User Has Been deleted!' }))
        .catch((error) => res.json(error))
})

module.exports = router