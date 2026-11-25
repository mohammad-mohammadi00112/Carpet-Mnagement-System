// Resolve the configured base currency at query time rather than relying on
// a particular SERIAL ID in the live database.
const BASE_CURRENCY_ID_SQL = `COALESCE(
    (SELECT base_currency_id FROM shop_settings ORDER BY id DESC LIMIT 1),
    (SELECT id FROM currencies WHERE is_base = TRUE ORDER BY id LIMIT 1),
    1
)`;

const isBaseCurrencySQL = (currencyIdExpression) =>
    `${currencyIdExpression} = (${BASE_CURRENCY_ID_SQL})`;

module.exports = { BASE_CURRENCY_ID_SQL, isBaseCurrencySQL };
