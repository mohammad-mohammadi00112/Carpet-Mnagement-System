const test = require('node:test')
const assert = require('node:assert/strict')

const {
    getPurchasePaymentSummary,
    updatePurchasePaymentStatus
} = require('../src/services/purchasePayment.service')
const {
    updateSalePaymentStatus,
    validateSaleRefund
} = require('../src/services/payment.service')

const purchaseClient = (paidBase, purchase = {}) => {
    const updates = []
    return {
        updates,
        async query(sql) {
            if (sql.includes('FROM purchases')) {
                return { rows: [{
                    total_amount: purchase.total ?? '1000.00',
                    currency_id: purchase.currencyId ?? 1,
                    purchase_base_rate: purchase.rate ?? '1'
                }] }
            }
            if (sql.includes('FROM purchase_payments')) {
                return { rows: [{ paid_in_base: String(paidBase) }] }
            }
            updates.push(...arguments)
            return { rows: [] }
        }
    }
}

test('purchase payment status reflects unpaid, partial, and fully paid totals', async () => {
    for (const [paid, status] of [[0, 'unpaid'], [400, 'partial'], [1000, 'paid']]) {
        const client = purchaseClient(paid)
        const summary = await updatePurchasePaymentStatus(1, client)
        assert.equal(summary.status, status)
        assert.equal(client.updates[1][0], status)
    }
})

test('purchase payment summary converts paid base currency to purchase currency', async () => {
    const summary = await getPurchasePaymentSummary(
        1,
        purchaseClient(500, { total: '1000', currencyId: 2, rate: '2' })
    )
    assert.equal(summary.paid, 250)
    assert.equal(summary.balance, 750)
    assert.equal(summary.status, 'partial')
})

test('sale payment status uses net payments after refunds', async () => {
    let statusUpdate
    const client = {
        async query(sql) {
            if (sql.includes('SELECT') && sql.includes('FROM sales s')) {
                assert.match(sql, /payment_type = 'refund'[\s\S]*THEN -/)
                return { rows: [{ total_amount: '1000', paid_amount: '600' }] }
            }
            statusUpdate = arguments[1]
            return { rows: [] }
        }
    }

    const result = await updateSalePaymentStatus(7, client)
    assert.equal(result.status, 'partial')
    assert.equal(result.balance, 400)
    assert.deepEqual(statusUpdate, ['partial', 7])
})

test('refund validation rejects refunds above the unrefunded receipts', async () => {
    const client = {
        async query(sql) {
            if (sql.includes('FROM sales')) return { rows: [{ id: 7 }] }
            return { rows: [{ received: '1000', refunded: '300' }] }
        }
    }

    await validateSaleRefund(7, 700, client)
    await assert.rejects(
        validateSaleRefund(7, 700.01, client),
        /Refund exceeds the amount received/
    )
})
