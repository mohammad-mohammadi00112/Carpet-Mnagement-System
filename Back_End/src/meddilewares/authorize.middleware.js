

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
                    return res.status(403).json({
                        message: 'Access Denied! You do not have permission.'
                    })
                }

                if (req.path.includes('shop_settings') && req.file) {
                    delete req.body.logo
                }
                validateRequest(req, res, next)
            })
            .catch((error) => {
                console.error('Permission lookup failed:', error)
                res.status(500).json({ message: 'Unable to verify permissions.' })
            })
    }
}

module.exports = authorizePermission
