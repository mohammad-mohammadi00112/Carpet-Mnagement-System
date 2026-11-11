

const convertExpenseToBase = (amount, currencyId, exchangeRate) => {
    if (Number(currencyId) === 1) return Number(amount)

    if (!exchangeRate || Number(exchangeRate) <= 0) {
        throw new Error('Invalid exchange rate')
    }

    return Number(amount) * Number(exchangeRate)
}

module.exports = { convertExpenseToBase }

