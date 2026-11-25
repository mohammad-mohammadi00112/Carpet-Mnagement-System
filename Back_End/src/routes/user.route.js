
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const carpetDB = require('../configDb');
const authenticateToken = require('../meddilewares/auth.middleware');
const authorizePermission = require('../meddilewares/authorize.middleware');
const validateRequest = require('../meddilewares/validation.middleware');

const router = express.Router();

router.use(express.json());

const SALT_ROUNDS = 12;

// Allowed fields for updating users
const ALLOWED_UPDATE_FIELDS = [
    'employee_id',
    'role_id',
    'username',
    'is_active'
];

// --------------------------------------------------
// LOGIN
// --------------------------------------------------

router.post('/login', validateRequest, async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required.'
            });
        }

        const result = await carpetDB.query(`
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
        `, [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: 'Username or password is incorrect.'
            });
        }

        const user = result.rows[0];

        if (!user.is_active) {
            return res.status(403).json({
                message: 'Your account is inactive.'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Username or password is incorrect.'
            });
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
        );

        return res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                username: user.username,
                role_id: user.role_id,
                role_name: user.role_name
            }
        });

    } catch (error) {
        console.error('Login Error:', error);

        return res.status(500).json({
            message: 'Internal server error.'
        });
    }
});

// --------------------------------------------------
// GET ALL USERS
// --------------------------------------------------

router.get(
    '/users',
    authenticateToken,
    authorizePermission('admin.manage'),
    async (req, res) => {
        try {
            const result = await carpetDB.query(`
                SELECT
                    id,
                    employee_id,
                    role_id,
                    username,
                    is_active,
                    created_at,
                    last_login
                FROM users
                ORDER BY id DESC;
            `);

            return res.status(200).json(result.rows);

        } catch (error) {
            console.error('Get Users Error:', error);

            return res.status(500).json({
                message: 'Failed to retrieve users.'
            });
        }
    }
);

// --------------------------------------------------
// GET USER BY ID
// --------------------------------------------------

router.get(
    '/users/:id',
    authenticateToken,
    authorizePermission('admin.manage'),
    async (req, res) => {
        try {
            const { id } = req.params;

            const result = await carpetDB.query(`
                SELECT
                    id,
                    employee_id,
                    role_id,
                    username,
                    is_active,
                    created_at,
                    last_login
                FROM users
                WHERE id = $1;
            `, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: 'User not found.'
                });
            }

            return res.status(200).json(result.rows[0]);

        } catch (error) {
            console.error('Get User Error:', error);

            return res.status(500).json({
                message: 'Failed to retrieve user.'
            });
        }
    }
);

// --------------------------------------------------
// CREATE USER
// --------------------------------------------------

router.post(
    '/users',
    authenticateToken,
    authorizePermission('admin.manage'),
    async (req, res) => {
        try {
            const {
                employee_id,
                role_id,
                username,
                password,
                is_active = true
            } = req.body;

            // Validate required fields
            if (
                !employee_id ||
                !role_id ||
                !username ||
                !password
            ) {
                return res.status(400).json({
                    message: 'All required fields must be provided.'
                });
            }

            if (typeof password !== 'string' || password.length < 6) {
                return res.status(400).json({
                    message: 'Password must contain at least 6 characters.'
                });
            }

            if (typeof username !== 'string' || !username.trim()) {
                return res.status(400).json({
                    message: 'Username is required.'
                });
            }

            // Hash plain password
            const hashedPassword = await bcrypt.hash(
                password,
                SALT_ROUNDS
            );

            const result = await carpetDB.query(`
                INSERT INTO users (
                    employee_id,
                    role_id,
                    username,
                    password_hash,
                    is_active
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING
                    id,
                    employee_id,
                    role_id,
                    username,
                    is_active,
                    created_at;
            `, [
                employee_id,
                role_id,
                username.trim(),
                hashedPassword,
                is_active
            ]);

            return res.status(201).json({
                message: 'User created successfully.',
                user: result.rows[0]
            });

        } catch (error) {
            console.error('Create User Error:', error);

            if (error.code === '23505') {
                return res.status(409).json({
                    message: 'Username already exists.'
                });
            }

            if (error.code === '23503') {
                return res.status(400).json({
                    message: 'Selected employee or role does not exist.'
                });
            }

            return res.status(500).json({
                message: 'Failed to create user.'
            });
        }
    }
);

// --------------------------------------------------
// UPDATE USER
// --------------------------------------------------

router.put(
    '/users/:id',
    authenticateToken,
    authorizePermission('admin.manage'),
    async (req, res) => {
        try {
            const { id } = req.params;

            const {
                employee_id,
                role_id,
                username,
                password,
                is_active
            } = req.body;

            if (
                !employee_id ||
                !role_id ||
                !username ||
                typeof is_active !== 'boolean'
            ) {
                return res.status(400).json({
                    message: 'Invalid or missing user fields.'
                });
            }

            if (typeof username !== 'string' || !username.trim()) {
                return res.status(400).json({
                    message: 'Username is required.'
                });
            }

            const values = [
                employee_id,
                role_id,
                username.trim(),
                is_active
            ];

            let sql = `
                UPDATE users
                SET
                    employee_id = $1,
                    role_id = $2,
                    username = $3,
                    is_active = $4
            `;

            // Update password only if a new one was provided
            if (password !== undefined && password !== '') {
                if (
                    typeof password !== 'string' ||
                    password.length < 6
                ) {
                    return res.status(400).json({
                        message: 'Password must contain at least 6 characters.'
                    });
                }

                const hashedPassword = await bcrypt.hash(
                    password,
                    SALT_ROUNDS
                );

                values.push(hashedPassword);

                sql += `, password_hash = $${values.length}`;
            }

            values.push(id);

            sql += `
                WHERE id = $${values.length}
                RETURNING
                    id,
                    employee_id,
                    role_id,
                    username,
                    is_active,
                    created_at;
            `;

            const result = await carpetDB.query(sql, values);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: 'User not found.'
                });
            }

            return res.status(200).json({
                message: 'User updated successfully.',
                user: result.rows[0]
            });

        } catch (error) {
            console.error('Update User Error:', error);

            if (error.code === '23505') {
                return res.status(409).json({
                    message: 'Username already exists.'
                });
            }

            if (error.code === '23503') {
                return res.status(400).json({
                    message: 'Selected employee or role does not exist.'
                });
            }

            return res.status(500).json({
                message: 'Failed to update user.'
            });
        }
    }
);

// --------------------------------------------------
// PATCH USER
// --------------------------------------------------

router.patch(
    '/users/:id',
    authenticateToken,
    authorizePermission('admin.manage'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const entries = Object.entries(req.body);

            if (entries.length === 0) {
                return res.status(400).json({
                    message: 'No fields provided for update.'
                });
            }

            const invalidFields = entries
                .filter(([key]) =>
                    !ALLOWED_UPDATE_FIELDS.includes(key)
                )
                .map(([key]) => key);

            if (invalidFields.length > 0) {
                return res.status(400).json({
                    message: 'Invalid fields.',
                    invalidFields
                });
            }

            const values = [];
            const changes = [];

            for (const [key, value] of entries) {
                if (key === 'username') {
                    if (
                        typeof value !== 'string' ||
                        !value.trim()
                    ) {
                        return res.status(400).json({
                            message: 'Invalid username.'
                        });
                    }
                }

                if (key === 'is_active' && typeof value !== 'boolean') {
                    return res.status(400).json({
                        message: 'Invalid account status.'
                    });
                }

                values.push(
                    key === 'username' ? value.trim() : value
                );

                changes.push(`${key} = $${values.length}`);
            }

            values.push(id);

            const result = await carpetDB.query(`
                UPDATE users
                SET ${changes.join(', ')}
                WHERE id = $${values.length}
                RETURNING
                    id,
                    employee_id,
                    role_id,
                    username,
                    is_active,
                    created_at;
            `, values);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: 'User not found.'
                });
            }

            return res.status(200).json({
                message: 'User updated successfully.',
                user: result.rows[0]
            });

        } catch (error) {
            console.error('Patch User Error:', error);

            if (error.code === '23505') {
                return res.status(409).json({
                    message: 'Username already exists.'
                });
            }

            if (error.code === '23503') {
                return res.status(400).json({
                    message: 'Selected employee or role does not exist.'
                });
            }

            return res.status(500).json({
                message: 'Failed to update user.'
            });
        }
    }
);

// --------------------------------------------------
// DELETE USER
// --------------------------------------------------

router.delete(
    '/users/:id',
    authenticateToken,
    authorizePermission('admin.manage'),
    async (req, res) => {
        try {
            const { id } = req.params;

            const result = await carpetDB.query(`
                DELETE FROM users
                WHERE id = $1
                RETURNING id;
            `, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: 'User not found.'
                });
            }

            return res.status(200).json({
                message: 'User deleted successfully.'
            });

        } catch (error) {
            console.error('Delete User Error:', error);

            if (error.code === '23503') {
                return res.status(409).json({
                    message: 'This user cannot be deleted because it is referenced by other records.'
                });
            }

            return res.status(500).json({
                message: 'Failed to delete user.'
            });
        }
    }
);

module.exports = router;
