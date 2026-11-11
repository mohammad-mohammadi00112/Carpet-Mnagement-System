
const carpetDB = require('../configDb')

const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

router.get('/locations', authenticateToken, authorizePermission('settings.read'),(_, res) => {
    carpetDB
        .query(`SELECT * FROM locations;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.get('/locations/:id', authenticateToken, authorizePermission('settings.read'),(req, res) => {
    const { id } = req.params

    carpetDB
        .query(`SELECT * FROM locations WHERE id = ${id};`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})


router.post('/locations', authenticateToken, authorizePermission('settings.manage'),(req, res) => {
    console.log("LOCATION ROUTE REACHED");
    console.log("REQUEST BODY:", req.body);

    const { name, type, address, description, is_active } = req.body;

    carpetDB
        .query(`
            INSERT INTO locations (name, type, address, description, is_active)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `, [name, type, address, description, is_active])
        .then(result => res.status(201).json(result.rows[0]))
        .catch(error => {
            console.log("DATABASE ERROR:", error.message);
            res.status(500).json({ message: error.message });
        });
});

router.delete('/locations/:id', authenticateToken, authorizePermission('settings.manage'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`DELETE FROM locations WHERE id = $1;`,[id])
        .then(() => res.json({ message: 'Location Has Been Deleted!' }))
        .catch((error) => res.json(error))
})

router.put('/locations/:id', authenticateToken, authorizePermission('settings.manage'),(req, res) => {
    const { id } = req.params
    const { name, type, address, description, is_active } = req.body
    carpetDB
        .query(`UPDATE locations
                SET 
                    name = $1,
                    type = $2,
                    address = $3,
                    description = $4,
                    is_active = $5
                WHERE id = $6;
            `, [name, type, address, description, is_active, id])
        .then(() => res.json({ message: 'Locations Has Been Updated!'}))
        .catch((error) => res.json(error))
})

router.patch('/locations/:id', authenticateToken, authorizePermission('settings.manage'),(req, res) => {
    const { id } = req.params
    const entries = Object.entries(req.body)
    const changes = entries.map((entry, index) =>
        `${entry[0]} = $${index + 1}`
    ).join(',')
    const value = entries.map(entry => entry[1])
    carpetDB
        .query(`UPDATE locations
                SET 
                    ${changes}
                WHERE id = $${value.length + 1};
            `, [...value, id])
        .then(() => res.json({ message: 'Location Has Been Updated!' }))
        .catch((error) => res.json(error))
})

module.exports = router