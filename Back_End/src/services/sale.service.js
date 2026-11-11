const carpetDB = require('../configDb')

const updateSaleTotals = async (saleId, client = carpetDB) => {
    const result = await client.query( `
       UPDATE sales AS s
        SET
            discount = totals.discount,
            total_amount = totals.subtotal - totals.discount + COALESCE(s.tax_amount, 0),
            updated_at = CURRENT_TIMESTAMP
        FROM (
            SELECT
                COALESCE(SUM(quantity * sale_price), 0) AS subtotal,
                COALESCE(SUM(discount), 0) AS discount
            FROM sales_details
            WHERE sale_id = $1
        ) AS totals
        WHERE s.id = $1
        RETURNING s.*`
    , [saleId])

    if (!result.rows.length) {
        throw new Error('Sale not found')
    }

    return result.rows[0]
}

const updateSaleTotalsForIds = async (...args) => {
    let client = carpetDB

    if (args.length && typeof args[args.length - 1].release === 'function') {
        client = args.pop()
    }

    const ids = [...new Set(
        args.filter(id => id !== undefined && id !== null)
    )]

    const results = []

    for (const id of ids) {
        results.push(await updateSaleTotals(id, client))
    }

    return results
}

module.exports = { updateSaleTotals, updateSaleTotalsForIds }