

const convertExpenseToBase = (amount, currencyId, exchangeRate, baseCurrencyId) => {
    if (
        baseCurrencyId !== undefined &&
        Number(currencyId) === Number(baseCurrencyId)
    ) return Number(amount)

    if (!exchangeRate || Number(exchangeRate) <= 0) {
        throw new Error('Invalid exchange rate')
    }

    return Number(amount) * Number(exchangeRate)
}

module.exports = { convertExpenseToBase }

