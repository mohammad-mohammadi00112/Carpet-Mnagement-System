

const carpetDB = require('../configDb')
const validateRequest = require('./validation.middleware')

const authorizePermission = (permissionCode) => {
    return (req, res, next) => {
        carpetDB
            .query(`
                SELECT permissions.code
                FROM role_permissions
                JOIN permissions
                    ON role_permissions.permission_id = permissions.id
                WHERE role_permissions.role_id = $1
                AND permissions.code = $2;`
            , [req.user.role_id, permissionCode])
            .then((result) => {
                if (result.rows.length === 0) {
                    return res.json({
                        message: 'Access Denied! You do not have permission.'
                    })
                }
                validateRequest(req, res, next)
            })
            .catch((error) => {
                res.json({ message: error.message })
            })
    }
}

module.exports = authorizePermission