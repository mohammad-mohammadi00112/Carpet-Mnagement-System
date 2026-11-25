const { BASE_CURRENCY_ID_SQL } = require('./baseCurrency')

const getPurchasePaymentSummary = async (purchaseId, client, lock = false) => {
    const purchaseResult = await client.query(`
        SELECT total_amount, currency_id, exchange_rate,
            CASE WHEN currency_id = (${BASE_CURRENCY_ID_SQL})
                THEN 1 ELSE COALESCE(exchange_rate, 1) END AS purchase_base_rate
        FROM purchases
        WHERE id = $1
        ${lock ? 'FOR UPDATE' : ''}`, [purchaseId])

    if (!purchaseResult.rows.length) throw new Error('Purchase not found')

    const purchase = purchaseResult.rows[0]
    const paidResult = await client.query(`
        SELECT COALESCE(SUM(ROUND(
            amount * CASE WHEN currency_id = (${BASE_CURRENCY_ID_SQL})
                THEN 1 ELSE COALESCE(exchange_rate, 1) END
        , 2)), 0) AS paid_in_base
        FROM purchase_payments
        WHERE purchase_id = $1`, [purchaseId])

    const purchaseBaseRate = Number(purchase.purchase_base_rate)
    const totalBase = Number((Number(purchase.total_amount) * purchaseBaseRate).toFixed(2))
    const paidBase = Number(paidResult.rows[0].paid_in_base)
    const status = totalBase <= 0 || paidBase <= 0
        ? 'unpaid'
        : paidBase >= totalBase - 0.01
            ? 'paid'
            : 'partial'

    return {
        status,
        total: Number(purchase.total_amount),
        paid: Number((paidBase / purchaseBaseRate).toFixed(2)),
        balance: Number((Math.max(0, totalBase - paidBase) / purchaseBaseRate).toFixed(2)),
        totalBase,
        paidBase,
        balanceBase: Math.max(0, totalBase - paidBase),
        purchaseBaseRate,
        purchaseCurrencyId: Number(purchase.currency_id)
    }
}

const updatePurchasePaymentStatus = async (purchaseId, client) => {
    const summary = await getPurchasePaymentSummary(purchaseId, client, true)
    const status = summary.status

    await client.query(
        'UPDATE purchases SET payment_status = $1 WHERE id = $2',
        [status, purchaseId]
    )

    return summary
}

module.exports = { getPurchasePaymentSummary, updatePurchasePaymentStatus }
