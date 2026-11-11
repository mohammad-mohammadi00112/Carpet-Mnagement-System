
const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())

const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

router.get('/employees', authenticateToken, authorizePermission('employees.read'),(_, res) => {
    carpetDB
        .query(`SELECT * FROM employees;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.get('/employees/:id', authenticateToken, authorizePermission('employees.read'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`SELECT * FROM employees WHERE id = ${id};`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.post('/employees', authenticateToken, authorizePermission('employees.manage'),(req, res) => {

    const { first_name, last_name, phone } = req.body;

    carpetDB.query(`
        INSERT INTO employees(first_name, last_name, phone)
         VALUES ($1, $2, $3)`,
        [first_name, last_name, phone]
    )
        .then(() => {
            res.json({ message: 'Employee Saved Successfully' });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });

});
router.patch('/employees/:id', authenticateToken, authorizePermission('employees.manage'),(req, res) => {
    const {id} = req.params
    const entries = Object.entries(req.body)
    const changes = entries.map((entry, index) => 
        `${entry[0]}=$${index + 1}`
    ).join(',')
    const value = entries.map(entry => entry[1])
    carpetDB
        .query(`UPDATE employees
                SET 
                    ${changes}
                WHERE id = $${value.length + 1}
            `,[...value, id])
        .then(() => res.json({message: 'Employee Has Been Updated'}))
        .catch((error) => res.json(error))

})
router.put('/employees/:id', authenticateToken, authorizePermission('employees.manage'),(req, res) => {
    const { id } = req.params
    const { first_name, last_name, phone, email, job_title, salary, hire_date, status, shift_start, shift_end } = req.body

    carpetDB
        .query(`UPDATE employees
            SET 
                first_name = $1,
                last_name = $2,
                phone = $3,
                email = $4,
                job_title = $5,
                salary = $6,
                hire_date = $7,
                status = $8,
                shift_start = $9,
                shift_end = $10

            WHERE id = $11;
            `, [first_name, last_name, phone, email, job_title, salary, hire_date, status, shift_start, shift_end, id])
        .then(() => res.json({ message: 'Employee Has Been Updated!' }))
        .catch((error) => res.json(error))

})

router.delete('/employees/:id', authenticateToken, authorizePermission('employees.manage'),(req, res) => {
    const {id} = req.params
    carpetDB
        .query(`DELETE FROM employees WHERE id = $1;`,[id])
        .then(() => res.json({message: 'Employee Has Been Deleted!'}))
        .catch((error) => res.json(error))
})


module.exports = router
