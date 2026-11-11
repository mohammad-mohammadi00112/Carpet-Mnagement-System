
const carpetDB = require('../configDb')

const getSaleProfits = async () => {
    const result = await carpetDB.query(`
        SELECT
            s.id AS sale_id,

           GREATEST(s.total_amount - COALESCE(s.tax_amount, 0), 0)
            * CASE
                WHEN s.currency_id = 1 THEN 1
                ELSE s.exchange_rate
              END AS revenue,

            COALESCE(SUM(
                sd.quantity * pc.average_cost
            ), 0) AS cost,

            COUNT(sd.id) FILTER (
                WHERE pc.average_cost IS NULL
            ) AS missing_cost

        FROM sales s

        LEFT JOIN sales_details sd
            ON sd.sale_id = s.id

        LEFT JOIN LATERAL (
            SELECT
                SUM(
                    pd.quantity * pd.purchase_price *
                    CASE
                        WHEN p.currency_id = 1 THEN 1
                        ELSE p.exchange_rate
                    END
                ) / NULLIF(SUM(pd.quantity), 0) AS average_cost

            FROM purchase_details pd
            JOIN purchases p ON p.id = pd.purchase_id

            WHERE pd.carpet_id = sd.carpet_id
              AND p.purchase_date <= s.sale_date::date
              AND p.status = 'active'
        ) pc ON TRUE

        WHERE s.status = 'active'

        GROUP BY s.id
        ORDER BY s.id`
    )
    const sales = result.rows.map(row => ({
        sale_id: row.sale_id,
        revenue: Number(row.revenue),
        cost: Number(row.cost),
        profit: Number(row.revenue) - Number(row.cost)
    }))

    return {
        sales,
        totalProfit: sales.reduce((sum, sale) => sum + sale.profit, 0)
    }
}
 
module.exports = { getSaleProfits }