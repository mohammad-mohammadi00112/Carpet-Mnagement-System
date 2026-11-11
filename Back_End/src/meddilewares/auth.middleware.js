
const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.json({
            message: 'Access Denied! Token Required.'
        })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return res.json({
                message: 'Invalid or Expired Token!'
            })
        }
        req.user = user
        next()
    })
}

module.exports = authenticateToken