const carpetDB = require('../configDb')

const updateSalePaymentStatus = async (saleId, client = carpetDB) => {
    const result = await client.query(`
        SELECT
            s.total_amount,
            COALESCE(SUM(p.amount_in_sale_currency), 0) AS paid_amount
        FROM sales s
        LEFT JOIN payments p ON p.sale_id = s.id
        WHERE s.id = $1
        GROUP BY s.id`
    , [saleId])

    if (!result.rows.length) {
        throw new Error('Sale not found')
    }

    const { total_amount, paid_amount } = result.rows[0]

    const total = Number(total_amount)
    const paid = Number(paid_amount)

    const status = total <= 0 || paid <= 0
        ? 'unpaid'
        : paid >= total
            ? 'paid'
            : 'partial'

    await client.query(`
        UPDATE sales
        SET payment_status = $1
        WHERE id = $2`
    , [status, saleId])

    return { total, paid, status }
}

module.exports = { updateSalePaymentStatus }