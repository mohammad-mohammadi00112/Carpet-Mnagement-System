

const carpetDB = require('../configDb')

const getLatestExchangeRate = async (currencyId) => {
    if (Number(currencyId) === 1) return 1

    const result = await carpetDB.query(`
        SELECT rate_to_base
        FROM exchange_rates
        WHERE currency_id = $1
        AND rate_date <= CURRENT_DATE
        ORDER BY rate_date DESC
        LIMIT 1
    `, [currencyId])

    if (!result.rows.length) {
        throw new Error('Exchange rate not found')
    }

    return Number(result.rows[0].rate_to_base)
}

module.exports = { getLatestExchangeRate }

