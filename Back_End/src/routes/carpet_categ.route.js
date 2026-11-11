
const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())
const authenticateToken = require('../meddilewares/auth.middleware')
const authorizePermission = require('../meddilewares/authorize.middleware')

router.get('/carpet_categ', authenticateToken, authorizePermission('carpets.read'), (_, res) => {
    carpetDB
        .query(`SELECT * FROM carpet_categories;`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.get('/carpet_categ/:id', authenticateToken, authorizePermission('carpets.read'), (req, res) => {
    const { id } = req.params
    carpetDB
        .query(`SELECT * FROM carpet_categories WHERE id = ${id};`)
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.post('/carpet_categ', authenticateToken, authorizePermission('carpets.manage'), (req, res) => {
    const { name, description } = req.body
    carpetDB
        .query(`INSERT INTO carpet_categories (name, description)
            VALUES ($1, $2)`,
            [name, description]
        )
        .then(() => res.json('New Categories Has Been Saved!'))
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: error.message });
        });
})

router.put('/carpet_categ/:id', authenticateToken, authorizePermission('carpets.manage'), (req, res) => {
    const { id } = req.params
    const { name, description } = req.body

    carpetDB
        .query(`UPDATE carpet_categories 
                SET
                 name = $1, 
                 description = $2
                WHERE id = $3;
            `, [name, description, id])
        .then(() => res.json({ message: 'One category Has Been Updated!' }))
        .catch((error) => res.json(error))
})

router.delete('/carpet_categ/:id', authenticateToken, authorizePermission('carpets.manage'), (req, res) => {
    const { id } = req.params
    carpetDB
        .query(`DELETE FROM carpet_categories  WHERE id = ${id}`)
        .then(() => res.json({ message: 'One category Has Been Deleted From The List!' }))
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: error.message });
        });
})
router.patch('/carpet_categ/:id', authenticateToken, authorizePermission('carpets.manage'), (req, res) => {
    const { id } = req.params
    const entries = Object.entries(req.body)
    const changes = entries.map((entry, index) =>
        `${entry[0]} = $${index + 1}`
    ).join(',')
    const value = entries.map(entry => entry[1])
    carpetDB
        .query(`UPDATE carpet_categories
            SET ${changes}
            WHERE id = $${value.length + 1}
            `, [...value, id])
        .then(() => res.json({ message: 'category Has Been Updated!' }))
        .catch((error) => res.json(error))
})

module.exports = router

