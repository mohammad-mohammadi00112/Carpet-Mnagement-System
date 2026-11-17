
const carpetDB = require('../configDb');
const express = require('express');
const router = express.Router();

const authenticateToken = require('../meddilewares/auth.middleware');
const authorizePermission = require('../meddilewares/authorize.middleware');

// Get all employees
router.get( '/employees', authenticateToken, authorizePermission('employees.read'), async (req, res) => {
        try {
            const result = await carpetDB.query(
                `SELECT * FROM employees ORDER BY id DESC`
            );

            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Get employee by ID
router.get( '/employees/:id', authenticateToken, authorizePermission('employees.read'), async (req, res) => {
        try {
            const { id } = req.params;

            const result = await carpetDB.query(
                `SELECT * FROM employees WHERE id = $1`,
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: 'Employee Not Found'
                });
            }

            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Create employee
router.post( '/employees',  authenticateToken, authorizePermission('employees.manage'),async (req, res) => {
        try {
            const {
                first_name,
                last_name,
                phone,
                email,
                national_id,
                emergency_phone,
                home_address,
                job_title,
                salary,
                hire_date,
                status,
                shift_start,
                shift_end,
                is_active
            } = req.body;

            if (!first_name || !first_name.trim()) {
                return res.status(400).json({
                    message: 'First name is required'
                });
            }

            const result = await carpetDB.query(
                `INSERT INTO employees (
                    first_name,
                    last_name,
                    phone,
                    email,
                    national_id,
                    emergency_phone,
                    home_address,
                    job_title,
                    salary,
                    hire_date,
                    status,
                    shift_start,
                    shift_end,
                    is_active
                )
                VALUES (
                    $1, $2, $3, $4, $5, $6, $7,
                    $8, $9, $10, $11, $12, $13, $14
                )
                RETURNING *`,
                [
                    first_name.trim(),
                    last_name || null,
                    phone || null,
                    email || null,
                    national_id || null,
                    emergency_phone || null,
                    home_address || null,
                    job_title || null,
                    salary === '' || salary == null ? null : Number(salary),
                    hire_date || null,
                    status || 'hired',
                    shift_start || null,
                    shift_end || null,
                    is_active ?? true
                ]
            );

            res.status(201).json({
                message: 'Employee Saved Successfully',
                employee: result.rows[0]
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Update employee status
router.patch( '/employees/:id',  authenticateToken, authorizePermission('employees.manage'),async (req, res) => {
        try {
            const { id } = req.params;
            const { is_active } = req.body;

            if (typeof is_active !== 'boolean') {
                return res.status(400).json({
                    message: 'Invalid employee status'
                });
            }

            const result = await carpetDB.query(
                `UPDATE employees
                 SET is_active = $1
                 WHERE id = $2
                 RETURNING *`,
                [is_active, id]
            );

            if (!result.rowCount) {
                return res.status(404).json({
                    message: 'Employee Not Found'
                });
            }

            res.json({
                message: 'Employee Status Updated',
                employee: result.rows[0]
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Update employee information
router.put( '/employees/:id',  authenticateToken, authorizePermission('employees.manage'),async (req, res) => {
        try {
            const { id } = req.params;

            const {
                first_name,
                last_name,
                phone,
                email,
                national_id,
                emergency_phone,
                home_address,
                job_title,
                salary,
                hire_date,
                status,
                shift_start,
                shift_end,
                is_active
            } = req.body;

            const result = await carpetDB.query(
                `UPDATE employees
                 SET
                    first_name = $1,
                    last_name = $2,
                    phone = $3,
                    email = $4,
                    national_id = $5,
                    emergency_phone = $6,
                    home_address = $7,
                    job_title = $8,
                    salary = $9,
                    hire_date = $10,
                    status = $11,
                    shift_start = $12,
                    shift_end = $13,
                    is_active = $14
                 WHERE id = $15
                 RETURNING *`,
                [
                    first_name,
                    last_name,
                    phone,
                    email,
                    national_id,
                    emergency_phone,
                    home_address,
                    job_title,
                    salary === '' || salary == null ? null : Number(salary),
                    hire_date || null,
                    status,
                    shift_start,
                    shift_end,
                    is_active ?? true,
                    id
                ]
            );

            if (!result.rowCount) {
                return res.status(404).json({
                    message: 'Employee Not Found'
                });
            }

            res.json({
                message: 'Employee Updated Successfully',
                employee: result.rows[0]
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Delete employee
router.delete('/employees/:id', authenticateToken, authorizePermission('employees.manage'),async (req, res) => {
        try {
            const { id } = req.params;

            const result = await carpetDB.query(
                `DELETE FROM employees
                 WHERE id = $1
                 RETURNING id`
                ,
                [id]
            );

            if (!result.rowCount) {
                return res.status(404).json({
                    message: 'Employee Not Found'
                });
            }

            res.json({
                message: 'Employee Deleted Successfully'
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router;
