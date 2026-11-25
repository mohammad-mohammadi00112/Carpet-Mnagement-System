const carpetDB = require('../configDb')

const calculateSalePaymentAmount = async (amount, rate, client = carpetDB) => {
    const result = await client.query(
        'SELECT ROUND($1::numeric * $2::numeric, 2)::numeric AS amount',
        [amount, rate]
    )
    return result.rows[0].amount
}

const validateSaleRefund = async (saleId, refundAmount, client, excludedPaymentId = null) => {
    const sale = await client.query(
        'SELECT id FROM sales WHERE id = $1 FOR UPDATE', [saleId]
    )
    if (!sale.rows.length) throw Object.assign(new Error('Sale not found'), { status: 404 })

    const result = await client.query(`
        SELECT
            COALESCE(SUM(CASE WHEN payment_type <> 'refund'
                THEN COALESCE(amount_in_sale_currency, ROUND(amount * exchange_rate_to_sale, 2))
                ELSE 0 END), 0) AS received,
            COALESCE(SUM(CASE WHEN payment_type = 'refund'
                THEN COALESCE(amount_in_sale_currency, ROUND(amount * exchange_rate_to_sale, 2))
                ELSE 0 END), 0) AS refunded
        FROM payments
        WHERE sale_id = $1
          AND ($2::integer IS NULL OR id <> $2)`,
    [saleId, excludedPaymentId])

    const available = Number(result.rows[0].received) - Number(result.rows[0].refunded)
    if (Number(refundAmount) <= 0 || Number(refundAmount) > available + 0.005) {
        throw Object.assign(
            new Error(`Refund exceeds the amount received. Refundable balance: ${Math.max(0, available).toFixed(2)}`),
            { status: 400 }
        )
    }
}

const updateSalePaymentStatus = async (saleId, client = carpetDB) => {
    const result = await client.query(`
        SELECT
            s.total_amount,
            COALESCE(SUM(CASE WHEN p.payment_type = 'refund'
                THEN -COALESCE(p.amount_in_sale_currency, ROUND(p.amount * p.exchange_rate_to_sale, 2))
                ELSE COALESCE(p.amount_in_sale_currency, ROUND(p.amount * p.exchange_rate_to_sale, 2))
            END), 0) AS paid_amount
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

    const balance = Math.max(0, Number((total - paid).toFixed(2)))
    const status = total <= 0 || paid <= 0
        ? 'unpaid'
        : paid >= total - 0.01
            ? 'paid'
            : 'partial'

    await client.query(`
        UPDATE sales
        SET payment_status = $1
        WHERE id = $2`
    , [status, saleId])

    return { total, paid, balance, status }
}

module.exports = {
    calculateSalePaymentAmount,
    updateSalePaymentStatus,
    validateSaleRefund
}
