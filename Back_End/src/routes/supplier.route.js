
const carpetDB = require('../configDb')

const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

router.get('/suppliers', authenticateToken, authorizePermission('purchases.read'),(_, res) => {
    carpetDB
        .query(`SELECT * FROM suppliers;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})
router.get('/suppliers/:id', authenticateToken, authorizePermission('purchases.read'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`SELECT * FROM suppliers WHERE id = $1;`, [id])
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})
router.delete('/suppliers/:id', authenticateToken, authorizePermission('purchases.manage'), async (req, res) => {
    try {
        const { id } = req.params;

        const result = await carpetDB.query(
            `DELETE FROM suppliers WHERE id = $1 RETURNING id;`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: 'Supplier not found!'
            });
        }

        res.status(200).json({
            message: 'Supplier has been deleted!',
            id: result.rows[0].id
        });

    } catch (error) {
        console.error('Delete Supplier Error:', error.message);

        res.status(500).json({
            message: error.message
        });
    }
});
router.post('/suppliers', authenticateToken, authorizePermission('purchases.manage'),(req, res) => {
    const { first_name, last_name, company_name, phone, email, address, description, is_active } = req.body
    carpetDB
        .query(`INSERT INTO suppliers (first_name,last_name,company_name,phone,email,address,description,is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [first_name, last_name, company_name, phone, email, address, description, is_active])
        .then(() => res.json({ message: 'New Supplier Has Been Added!' }))
        .catch((error) => res.json(error))
})

router.put('/suppliers/:id', authenticateToken, authorizePermission('purchases.manage'),(req, res) => {
    const { id } = req.params
    const { first_name, last_name, company_name, phone, email, address, description, is_active } = req.body
    carpetDB
        .query(`UPDATE suppliers
                SET 
                    first_name = $1,
                    last_name = $2,
                    company_name = $3,
                    phone = $4,
                    email = $5,
                    address = $6,
                    description = $7,
                    is_active = $8
                WHERE id = $9;
                `,[first_name, last_name, company_name, phone,email, address, description,is_active,id])
        .then(() => res.json({ message: 'Supplier has Been Updated!' }))
        .catch((error) => res.json(error))

})

router.patch('/suppliers/:id', authenticateToken, authorizePermission('purchases.manage'),(req, res) => {

    const {id} = req.params
    const entries = Object.entries(req.body)
    const changes = entries.map((entry, index) => 
        `${entry[0]} = $${index + 1}`
    ).join(',')
    const value = entries.map(entry => entry[1])
    carpetDB
        .query(`UPDATE suppliers
                SET 
                ${changes}
                WHERE id = $${value.length + 1};
            `, [...value, id])
   
        .then(() => res.json('Supplier Has Been Updated!'))
        .catch((error) => res.json(error))
})

module.exports = router