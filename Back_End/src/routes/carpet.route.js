

const carpetDB = require('../configDb')
const express = require('express')
const router = express.Router()
router.use(express.json())

const authorizePermission = require('../meddilewares/authorize.middleware')
const authenticateToken = require('../meddilewares/auth.middleware')

router.get('/carpets',authenticateToken,authorizePermission('carpets.read'),(_, res) => {
    carpetDB
        .query('SELECT * FROM carpets;')
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))
})

router.get('/carpets/:id', authenticateToken,authorizePermission('carpets.read'),(req, res) => {
    const { id } = req.params
    carpetDB
        .query(`SELECT * FROM carpets WHERE id = $1;`, [id])
        .then((result) => res.json(result.rows))
        .catch((error) => res.json(error))

})

router.post('/carpets', authenticateToken,authorizePermission('carpets.manage'),(req, res) => {
    const { code, barcode, name, category_id, country_of_origin,
        width_cm, length_cm, material, type, weight_kg, color, design,
        condition, currency_id, purchase_price, sale_price, is_active } = req.body

    carpetDB
        .query(`INSERT INTO carpets (code,barcode,name,category_id,country_of_origin, width_cm,length_cm,material,type,weight_kg,color,
            design,condition,currency_id,purchase_price,sale_price,is_active)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);
            `,[code, barcode, name, category_id, country_of_origin, width_cm, length_cm, material,
                type, weight_kg, color, design, condition, currency_id, purchase_price, sale_price, is_active])
        .then(() => res.json({message: 'New Carpet Has Been Saved!'}))
        .catch((error) => res.json(error))
})

router.delete('/carpets/:id', authenticateToken,authorizePermission('carpets.manage'),(req, res) => {
    const {id} = req.params
    carpetDB
        .query(`DELETE FROM carpets WHERE id = $1;`, [id])
        .then(() => res.json('One Carpet Has Been Deleted From Database!'))
        .catch((error) => res.json(error)) 
})

router.put('/carpets/:id', authenticateToken,authorizePermission('carpets.manage'),(req, res) => {
    const {id} = req.params
     const { code, barcode, name, category_id, country_of_origin,
        width_cm, length_cm, material, type, weight_kg, color, design,
        condition, currency_id, purchase_price, sale_price, is_active } = req.body
    carpetDB
        .query(`UPDATE carpets
            SET 
            code = $1,
            barcode = $2,
            name = $3,
            category_id = $4,
            country_of_origin = $5,
            width_cm = $6,
            length_cm = $7,
            material = $8,
            type = $9,
            weight_kg = $10,
            color = $11,
            design = $12,
            condition = $13,
            currency_id = $14,
            purchase_price = $15,
            sale_price = $16,
            is_active = $17
            WHERE id = $18;
            `,[code, barcode, name, category_id, country_of_origin, width_cm, length_cm, material,
             type, weight_kg, color, design, condition, currency_id, purchase_price, sale_price, is_active, id])
        .then(() => res.json({message: 'One Carpet Has Been Updated!'}))
        .catch((error) => res.json(error))
})

router.patch('/carpets/:id', authenticateToken,authorizePermission('carpets.manage'),(req, res) => {
    const {id} = req.params
    const entries = Object.entries(req.body)
    const changes = entries.map((entry, index) => 
        `${entry[0]}= $${index + 1}`
    ).join(',')
    const value = entries.map(entry => entry[1])

    carpetDB
        .query(`UPDATE carpets 
            SET ${changes}
            WHERE id = $${value.length + 1}
            `, [...value,id])
        .then(() => res.json({message: 'Carpet Has Been Updated!'}))
        .catch((error) => res.json(error))
})

module.exports = router



