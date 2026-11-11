
const carpetDB = require('../configDb')
const { getSaleProfits } = require('./profit.service')
const getExpenseReport = async () => {
    const result = await carpetDB.query(`
        SELECT
            COALESCE(SUM(
                CASE
                    WHEN currency_id = 1 THEN amount
                    ELSE amount * exchange_rate
                END
            ) FILTER (
                WHERE expense_date = CURRENT_DATE
            ), 0) AS daily,

            COALESCE(SUM(
                CASE
                    WHEN currency_id = 1 THEN amount
                    ELSE amount * exchange_rate
                END
            ) FILTER (
                WHERE DATE_TRUNC('month', expense_date) =
                      DATE_TRUNC('month', CURRENT_DATE)
            ), 0) AS monthly,

            COALESCE(SUM(
                CASE
                    WHEN currency_id = 1 THEN amount
                    ELSE amount * exchange_rate
                END
            ), 0) AS total

        FROM expenses`
    )

    return result.rows[0]
}
const getSalesReport = async () => {
    const result = await carpetDB.query(`
        SELECT
            COALESCE(SUM(
                CASE
                    WHEN currency_id = 1 THEN total_amount
                    ELSE total_amount * exchange_rate
                END
            ) FILTER (
                WHERE sale_date::date = CURRENT_DATE
            ), 0) AS daily,

            COALESCE(SUM(
                CASE
                    WHEN currency_id = 1 THEN total_amount
                    ELSE total_amount * exchange_rate
                END
            ) FILTER (
                WHERE DATE_TRUNC('month', sale_date) =
                      DATE_TRUNC('month', CURRENT_DATE)
            ), 0) AS monthly,

            COALESCE(SUM(
                CASE
                    WHEN currency_id = 1 THEN total_amount
                    ELSE total_amount * exchange_rate
                END
            ), 0) AS total

        FROM sales
        WHERE status = 'active'`
    )

    return result.rows[0]
}
const getPurchaseReport = async () => {
    const result = await carpetDB.query(`
        SELECT
            COALESCE(SUM(
                CASE
                    WHEN currency_id = 1 THEN total_amount
                    ELSE total_amount * exchange_rate
                END
            ) FILTER (
                WHERE purchase_date = CURRENT_DATE
            ), 0) AS daily,

            COALESCE(SUM(
                CASE
                    WHEN currency_id = 1 THEN total_amount
                    ELSE total_amount * exchange_rate
                END
            ) FILTER (
                WHERE DATE_TRUNC('month', purchase_date) =
                      DATE_TRUNC('month', CURRENT_DATE)
            ), 0) AS monthly,

            COALESCE(SUM(
                CASE
                    WHEN currency_id = 1 THEN total_amount
                    ELSE total_amount * exchange_rate
                END
            ), 0) AS total

        FROM purchases
        WHERE status = 'active'
   ` )

    return result.rows[0]
}
const getProfitLossReport = async () => {
    const saleReport = await getSaleProfits()
    const result = await carpetDB.query(`
        SELECT COALESCE(SUM(
            CASE
                WHEN currency_id = 1 THEN amount
                ELSE amount * exchange_rate
            END
        ), 0) AS expenses
        FROM expenses`
    )

    const sales = saleReport.sales.reduce(
        (sum, sale) => sum + sale.revenue, 0
    )
    const expenses = Number(result.rows[0].expenses)
    return {
        sales,
        grossProfit: saleReport.totalProfit,
        expenses,
        profit: saleReport.totalProfit - expenses
    }
}

module.exports = { getExpenseReport, getSalesReport, getPurchaseReport, getProfitLossReport }