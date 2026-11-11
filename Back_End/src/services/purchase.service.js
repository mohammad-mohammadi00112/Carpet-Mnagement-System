const carpetDB = require('../configDb')

const updatePurchaseTotal = async (purchaseId, client = carpetDB) => {
    const result = await client.query(`
        SELECT COALESCE(SUM(quantity * purchase_price), 0) AS total
        FROM purchase_details
        WHERE purchase_id = $1`
    , [purchaseId])

    await client.query(`
        UPDATE purchases
        SET total_amount = $1
        WHERE id = $2`
    , [result.rows[0].total, purchaseId])
}

const updatePurchaseTotalForIds = async (...args) => {
    let client = carpetDB

    if (args.length && typeof args[args.length - 1].release === 'function') {
        client = args.pop()
    }

    const ids = [...new Set(
        args.filter(id => id !== undefined && id !== null)
    )]

    for (const id of ids) {
        await updatePurchaseTotal(id, client)
    }
}

module.exports = { updatePurchaseTotal, updatePurchaseTotalForIds }