
const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')


const auditLogQuery = `
    SELECT audit_log.*, users.username AS user_name
    FROM audit_log
    LEFT JOIN users ON users.id = audit_log.user_id
`;

router.get('/audit_log', authenticateToken, authorizePermission('reports.read'), (_, res) => {
    carpetDB
        .query(`${auditLogQuery} ORDER BY audit_log.created_at DESC, audit_log.id DESC`)
        .then((result) => res.json(result.rows))
        .catch((error) => {
            console.error('Get Audit Logs Error:', error);
            res.status(500).json({ message: 'Failed to load audit logs.' });
        });
})

router.get('/audit_log/:id', authenticateToken, authorizePermission('reports.read'),(req, res) => {
    const {id}  = req.params
    carpetDB
        .query(`${auditLogQuery} WHERE audit_log.id = $1;`, [id])
        .then((result) => {
            if (!result.rows.length) {
                return res.status(404).json({ message: 'Audit record not found.' });
            }
            res.json(result.rows[0]);
        })
        .catch((error) => {
            console.error('Get Audit Log Error:', error);
            res.status(500).json({ message: 'Failed to load audit record.' });
        });
})

module.exports = router
