const carpetDB = require('../configDb')
const { addStock } = require('./inventory.service')

const updateReturnTotal = async (returnId, client = carpetDB) => {
    const result = await client.query(`
        SELECT COALESCE(SUM(quantity * refund_price), 0) AS total
        FROM sale_return_details
        WHERE return_id = $1`
    , [returnId])

    await client.query(`
        UPDATE sale_returns
        SET refund_amount = $1
        WHERE id = $2`
    , [result.rows[0].total, returnId])
}

const addReturnDetail = async (returnId, salesDetailId, locationId, quantity, refundPrice, client = carpetDB) => {
    const saleDetail = await client.query(`
        SELECT quantity, carpet_id
        FROM sales_details
        WHERE id = $1
        FOR UPDATE`
    , [salesDetailId])

    if (!saleDetail.rows.length) throw new Error('Sale detail not found')

    const returnedResult = await client.query(`
        SELECT COALESCE(SUM(quantity), 0) AS returned
        FROM sale_return_details
        WHERE sales_detail_id = $1`
    , [salesDetailId])

    const { quantity: sold, carpet_id } = saleDetail.rows[0]
    const remaining = Number(sold) - Number(returnedResult.rows[0].returned)

    if (Number(quantity) > remaining) {
        throw new Error(`Only ${remaining} items can be returned`)
    }

    await client.query(`
        INSERT INTO sale_return_details
        (return_id, sales_detail_id, location_id, quantity, refund_price)
        VALUES ($1, $2, $3, $4, $5)`
    , [returnId, salesDetailId, locationId, quantity, refundPrice])

    await addStock(carpet_id, locationId, quantity, client)
    await updateReturnTotal(returnId, client)
}

module.exports = { updateReturnTotal, addReturnDetail }