

const carpetDB = require('../configDb')
const { BASE_CURRENCY_ID_SQL } = require('./baseCurrency')

const getLatestExchangeRate = async (currencyId) => {
    const baseResult = await carpetDB.query(`SELECT (${BASE_CURRENCY_ID_SQL}) AS id`)
    if (Number(currencyId) === Number(baseResult.rows[0]?.id)) return 1

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

