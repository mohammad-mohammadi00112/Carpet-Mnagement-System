
const carpetDB = require('../configDb');

// ======================================================
// 1. PERIOD CONFIGURATION
// ======================================================

const PERIODS = {
    today: {
        start: 'CURRENT_DATE',
        end: "CURRENT_DATE + INTERVAL '1 day'",

        previousStart: "CURRENT_DATE - INTERVAL '1 day'",
        previousEnd: 'CURRENT_DATE',

        chartStart: 'CURRENT_DATE',
        chartEnd: "DATE_TRUNC('hour', CURRENT_TIMESTAMP)",
        chartInterval: "INTERVAL '1 hour'",
        chartFormat: 'HH24:00',
        chartUnit: 'hour'
    },

    thisWeek: {
        start: "DATE_TRUNC('week', CURRENT_DATE)",
        end: "CURRENT_DATE + INTERVAL '1 day'",

        previousStart: "DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 week'",
        previousEnd: "DATE_TRUNC('week', CURRENT_DATE)",

        chartStart: "DATE_TRUNC('week', CURRENT_DATE)",
        chartEnd: 'CURRENT_DATE',
        chartInterval: "INTERVAL '1 day'",
        chartFormat: 'Dy',
        chartUnit: 'day'
    },

    thisMonth: {
        start: "DATE_TRUNC('month', CURRENT_DATE)",
        end: "CURRENT_DATE + INTERVAL '1 day'",

        previousStart: "DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'",
        previousEnd: "DATE_TRUNC('month', CURRENT_DATE)",

        chartStart: "DATE_TRUNC('month', CURRENT_DATE)",
        chartEnd: 'CURRENT_DATE',
        chartInterval: "INTERVAL '1 day'",
        chartFormat: 'DD',
        chartUnit: 'day'
    },

    thisYear: {
        start: "DATE_TRUNC('year', CURRENT_DATE)",
        end: "CURRENT_DATE + INTERVAL '1 day'",

        previousStart: "DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 year'",
        previousEnd: "DATE_TRUNC('year', CURRENT_DATE)",

        chartStart: "DATE_TRUNC('year', CURRENT_DATE)",
        chartEnd: 'CURRENT_DATE',
        chartInterval: "INTERVAL '1 month'",
        chartFormat: 'Mon',
        chartUnit: 'month'
    }
};


// ======================================================
// 2. HELPER FUNCTIONS
// ======================================================

// Convert database values safely to numbers
const toNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
};


// Calculate percentage change
const calculateChange = (current, previous) => {
    current = toNumber(current);
    previous = toNumber(previous);

    if (previous === 0) {
        return current > 0 ? 100 : 0;
    }

    return Number(
        (((current - previous) / Math.abs(previous)) * 100).toFixed(2)
    );
};


// Get SQL date condition for selected period
const getPeriodCondition = (column, period, previous = false) => {
    const config = PERIODS[period];

    if (!config) {
        throw new Error(`Invalid dashboard period: ${period}`);
    }

    const start = previous
        ? config.previousStart
        : config.start;

    const end = previous
        ? config.previousEnd
        : config.end;

    return `${column} >= ${start} AND ${column} < ${end}`;
};


// Currency conversion to AFN
const currencyToAFN = (amount, currencyId, exchangeRate) => {
    return `
        (${amount} * CASE
            WHEN ${currencyId} = 1 THEN 1
            ELSE COALESCE(${exchangeRate}, 1)
        END)
    `;
};


// ======================================================
// 3. SALES AND PURCHASES SUMMARY
// ======================================================

const getSalesAndPurchasesSummary = async (period) => {
    const salesCondition = getPeriodCondition(
        'sale_date',
        period
    );

    const previousSalesCondition = getPeriodCondition(
        'sale_date',
        period,
        true
    );

    const purchasesCondition = getPeriodCondition(
        'purchase_date',
        period
    );

    const previousPurchasesCondition = getPeriodCondition(
        'purchase_date',
        period,
        true
    );

    const result = await carpetDB.query(`
        SELECT

            -- Current sales
            (
                SELECT COALESCE(
                    SUM(
                        ${currencyToAFN(
                            'total_amount',
                            'currency_id',
                            'exchange_rate'
                        )}
                    ),
                    0
                )
                FROM sales
                WHERE status = 'active'
                  AND ${salesCondition}
            ) AS sales,


            -- Previous sales
            (
                SELECT COALESCE(
                    SUM(
                        ${currencyToAFN(
                            'total_amount',
                            'currency_id',
                            'exchange_rate'
                        )}
                    ),
                    0
                )
                FROM sales
                WHERE status = 'active'
                  AND ${previousSalesCondition}
            ) AS previous_sales,


            -- Current purchases
            (
                SELECT COALESCE(
                    SUM(
                        ${currencyToAFN(
                            'total_amount',
                            'currency_id',
                            'exchange_rate'
                        )}
                    ),
                    0
                )
                FROM purchases
                WHERE status = 'active'
                  AND ${purchasesCondition}
            ) AS purchases,


            -- Previous purchases
            (
                SELECT COALESCE(
                    SUM(
                        ${currencyToAFN(
                            'total_amount',
                            'currency_id',
                            'exchange_rate'
                        )}
                    ),
                    0
                )
                FROM purchases
                WHERE status = 'active'
                  AND ${previousPurchasesCondition}
            ) AS previous_purchases

    `);

    return result.rows[0];
};


// ======================================================
// 4. DASHBOARD PROFIT
//
// Uses weighted average purchase cost.
//
// IMPORTANT:
// purchase_details.purchase_price must be
// the price of ONE carpet, not the total price.
// ======================================================

const getDashboardProfit = async (period) => {
    const currentCondition = getPeriodCondition(
        's.sale_date',
        period
    );

    const previousCondition = getPeriodCondition(
        's.sale_date',
        period,
        true
    );

    const result = await carpetDB.query(`
        SELECT

            -- =========================================
            -- CURRENT REVENUE (EXCLUDING TAX)
            -- =========================================

            COALESCE(
                SUM(
                    GREATEST(
                        s.total_amount - COALESCE(s.tax_amount, 0),
                        0
                    )
                    *
                    CASE
                        WHEN s.currency_id = 1 THEN 1
                        ELSE COALESCE(s.exchange_rate, 1)
                    END
                ) FILTER (
                    WHERE ${currentCondition}
                ),
                0
            ) AS current_revenue,


            -- =========================================
            -- CURRENT COST
            -- =========================================

            COALESCE(
                SUM(
                    COALESCE(sd_cost.cost, 0)
                ) FILTER (
                    WHERE ${currentCondition}
                ),
                0
            ) AS current_cost,


            -- =========================================
            -- PREVIOUS REVENUE
            -- =========================================

            COALESCE(
                SUM(
                    GREATEST(
                        s.total_amount - COALESCE(s.tax_amount, 0),
                        0
                    )
                    *
                    CASE
                        WHEN s.currency_id = 1 THEN 1
                        ELSE COALESCE(s.exchange_rate, 1)
                    END
                ) FILTER (
                    WHERE ${previousCondition}
                ),
                0
            ) AS previous_revenue,


            -- =========================================
            -- PREVIOUS COST
            -- =========================================

            COALESCE(
                SUM(
                    COALESCE(sd_cost.cost, 0)
                ) FILTER (
                    WHERE ${previousCondition}
                ),
                0
            ) AS previous_cost


        FROM sales s


        -- =============================================
        -- CALCULATE COST FOR EACH SALE
        -- =============================================

        LEFT JOIN LATERAL (

            SELECT

                COALESCE(
                    SUM(
                        sd.quantity * COALESCE(pc.average_cost, 0)
                    ),
                    0
                ) AS cost

            FROM sales_details sd


            -- Weighted average purchase cost
            LEFT JOIN LATERAL (

                SELECT

                    SUM(
                        pd.quantity
                        * pd.purchase_price
                        * CASE
                            WHEN p.currency_id = 1 THEN 1
                            ELSE COALESCE(p.exchange_rate, 1)
                          END
                    )
                    /
                    NULLIF(SUM(pd.quantity), 0) AS average_cost

                FROM purchase_details pd

                INNER JOIN purchases p
                    ON p.id = pd.purchase_id

                WHERE pd.carpet_id = sd.carpet_id

                  AND p.purchase_date <= s.sale_date::date

                  AND p.status = 'active'

                  AND pd.quantity > 0

            ) pc ON TRUE


            WHERE sd.sale_id = s.id

        ) sd_cost ON TRUE


        WHERE s.status = 'active'

    `);

    const row = result.rows[0];

    const revenue = toNumber(row.current_revenue);
    const cost = toNumber(row.current_cost);

    const previousRevenue = toNumber(row.previous_revenue);
    const previousCost = toNumber(row.previous_cost);

    return {
        revenue,
        cost,

        profit: revenue - cost,

        previousRevenue,
        previousCost,

        previousProfit: previousRevenue - previousCost
    };
};


// ======================================================
// 5. EXPENSE SUMMARY
// ======================================================

const getExpenseSummary = async (period) => {
    const currentCondition = getPeriodCondition(
        'expense_date',
        period
    );

    const previousCondition = getPeriodCondition(
        'expense_date',
        period,
        true
    );

    const result = await carpetDB.query(`
        SELECT

            COALESCE(
                SUM(
                    ${currencyToAFN(
                        'amount',
                        'currency_id',
                        'exchange_rate'
                    )}
                ) FILTER (
                    WHERE ${currentCondition}
                ),
                0
            ) AS expenses,


            COALESCE(
                SUM(
                    ${currencyToAFN(
                        'amount',
                        'currency_id',
                        'exchange_rate'
                    )}
                ) FILTER (
                    WHERE ${previousCondition}
                ),
                0
            ) AS previous_expenses

        FROM expenses
    `);

    return result.rows[0];
};


// ======================================================
// 6. CUSTOMERS AND SUPPLIERS
// ======================================================

const getContactsSummary = async (period) => {
    const customerCondition = getPeriodCondition(
        'created_at',
        period
    );

    const previousCustomerCondition = getPeriodCondition(
        'created_at',
        period,
        true
    );

    const supplierCondition = getPeriodCondition(
        'created_at',
        period
    );

    const previousSupplierCondition = getPeriodCondition(
        'created_at',
        period,
        true
    );

    const result = await carpetDB.query(`
        SELECT

            -- Total customers
            (
                SELECT COUNT(*)
                FROM customers
                WHERE is_active = TRUE
                  AND deleted_at IS NULL
            ) AS customers,


            -- New customers in current period
            (
                SELECT COUNT(*)
                FROM customers
                WHERE is_active = TRUE
                  AND deleted_at IS NULL
                  AND ${customerCondition}
            ) AS new_customers,


            -- New customers in previous period
            (
                SELECT COUNT(*)
                FROM customers
                WHERE is_active = TRUE
                  AND deleted_at IS NULL
                  AND ${previousCustomerCondition}
            ) AS previous_customers,


            -- Total suppliers
            (
                SELECT COUNT(*)
                FROM suppliers
                WHERE is_active = TRUE
                  AND deleted_at IS NULL
            ) AS suppliers,


            -- New suppliers in current period
            (
                SELECT COUNT(*)
                FROM suppliers
                WHERE is_active = TRUE
                  AND deleted_at IS NULL
                  AND ${supplierCondition}
            ) AS new_suppliers,


            -- New suppliers in previous period
            (
                SELECT COUNT(*)
                FROM suppliers
                WHERE is_active = TRUE
                  AND deleted_at IS NULL
                  AND ${previousSupplierCondition}
            ) AS previous_suppliers

    `);

    return result.rows[0];
};


// ======================================================
// 7. INVENTORY SUMMARY
// ======================================================

const getInventorySummary = async () => {
    const result = await carpetDB.query(`
        WITH carpet_stock AS (

            SELECT

                c.id AS carpet_id,

                COALESCE(
                    SUM(i.quantity),
                    0
                ) AS total_quantity

            FROM carpets c

            LEFT JOIN inventory i
                ON i.carpet_id = c.id

            WHERE c.deleted_at IS NULL
              AND c.is_active = TRUE

            GROUP BY c.id

        )

        SELECT

            COALESCE(
                SUM(total_quantity),
                0
            ) AS total_stock,


            COUNT(*) FILTER (
                WHERE total_quantity > 0
            ) AS in_stock,


            COUNT(*) FILTER (
                WHERE total_quantity > 0
                  AND total_quantity <= 5
            ) AS low_stock

        FROM carpet_stock
    `);

    return result.rows[0];
};


// ======================================================
// 8. INVENTORY BY CATEGORY
// ======================================================

const getInventoryByCategory = async () => {
    const result = await carpetDB.query(`
        SELECT

            COALESCE(
                cc.name,
                'Uncategorized'
            ) AS name,

            COALESCE(
                SUM(i.quantity),
                0
            ) AS quantity

        FROM inventory i

        INNER JOIN carpets c
            ON c.id = i.carpet_id

        LEFT JOIN carpet_categories cc
            ON cc.id = c.category_id

        WHERE c.deleted_at IS NULL
          AND c.is_active = TRUE

        GROUP BY cc.id, cc.name

        HAVING SUM(i.quantity) > 0

        ORDER BY quantity DESC
    `);

    const colors = [
        'teal',
        'blue',
        'purple',
        'orange',
        'green',
        'pink'
    ];

    return result.rows.map((row, index) => ({
        name: row.name,
        category: row.name,
        quantity: toNumber(row.quantity),
        color: colors[index % colors.length]
    }));
};


// ======================================================
// 9. CUSTOMER RECEIVABLES
// ======================================================

const getReceivables = async () => {
    const result = await carpetDB.query(`
        SELECT

            COALESCE(
                SUM(
                    GREATEST(
                        s.total_amount -
                        COALESCE(payment_totals.paid_amount, 0),
                        0
                    )
                    *
                    CASE
                        WHEN s.currency_id = 1 THEN 1
                        ELSE COALESCE(s.exchange_rate, 1)
                    END
                ),
                0
            ) AS receivables

        FROM sales s


        LEFT JOIN (

            SELECT

                sale_id,

                SUM(
                    CASE
                        WHEN payment_type = 'refund'
                            THEN -COALESCE(amount_in_sale_currency, 0)

                        ELSE COALESCE(amount_in_sale_currency, 0)
                    END
                ) AS paid_amount

            FROM payments

            GROUP BY sale_id

        ) payment_totals

            ON payment_totals.sale_id = s.id


        WHERE s.status = 'active'

    `);

    return toNumber(result.rows[0].receivables);
};


// ======================================================
// 10. RECENT SALES
// ======================================================

const getRecentSales = async () => {
    const result = await carpetDB.query(`
        SELECT

            s.id,

            COALESCE(
                NULLIF(
                    TRIM(
                        COALESCE(c.first_name, '') || ' ' ||
                        COALESCE(c.last_name, '')
                    ),
                    ''
                ),
                'Walk-in Customer'
            ) AS customer,

            s.sale_date AS date,

            (
                s.total_amount *
                CASE
                    WHEN s.currency_id = 1 THEN 1
                    ELSE COALESCE(s.exchange_rate, 1)
                END
            ) AS amount,

            CASE
                WHEN s.payment_status = 'paid'
                    THEN 'completed'
                ELSE 'pending'
            END AS status

        FROM sales s

        LEFT JOIN customers c
            ON c.id = s.customer_id

        WHERE s.status = 'active'

        ORDER BY s.sale_date DESC

        LIMIT 5
    `);

    return result.rows.map(row => ({
        ...row,
        amount: toNumber(row.amount)
    }));
};


// ======================================================
// 11. DASHBOARD CHART
// ======================================================

const getDashboardChart = async (period) => {
    const config = PERIODS[period];

    if (!config) {
        throw new Error('Invalid chart period');
    }

    const bucket = config.chartUnit;

    const salesCondition = getPeriodCondition(
        'sale_date',
        period
    );

    const purchasesCondition = getPeriodCondition(
        'purchase_date',
        period
    );

    const result = await carpetDB.query(`
        WITH time_buckets AS (

            SELECT generate_series(
                ${config.chartStart}::timestamp,
                ${config.chartEnd}::timestamp,
                ${config.chartInterval}
            ) AS bucket

        ),


        sales_data AS (

            SELECT

                DATE_TRUNC(
                    '${bucket}',
                    sale_date
                ) AS bucket,

                SUM(
                    total_amount *
                    CASE
                        WHEN currency_id = 1 THEN 1
                        ELSE COALESCE(exchange_rate, 1)
                    END
                ) AS total

            FROM sales

            WHERE status = 'active'
              AND ${salesCondition}

            GROUP BY DATE_TRUNC(
                '${bucket}',
                sale_date
            )

        ),


        purchases_data AS (

            SELECT

                DATE_TRUNC(
                    '${bucket}',
                    purchase_date
                ) AS bucket,

                SUM(
                    total_amount *
                    CASE
                        WHEN currency_id = 1 THEN 1
                        ELSE COALESCE(exchange_rate, 1)
                    END
                ) AS total

            FROM purchases

            WHERE status = 'active'
              AND ${purchasesCondition}

            GROUP BY DATE_TRUNC(
                '${bucket}',
                purchase_date
            )

        )


        SELECT

            TO_CHAR(
                tb.bucket,
                '${config.chartFormat}'
            ) AS day,

            COALESCE(
                sd.total,
                0
            ) AS sales,

            COALESCE(
                pd.total,
                0
            ) AS purchases

        FROM time_buckets tb

        LEFT JOIN sales_data sd
            ON sd.bucket = tb.bucket

        LEFT JOIN purchases_data pd
            ON pd.bucket = tb.bucket

        ORDER BY tb.bucket

    `);

    return result.rows.map(row => ({
        day: row.day,
        sales: toNumber(row.sales),
        purchases: toNumber(row.purchases)
    }));
};


// ======================================================
// 12. RECENT ACTIVITIES
// ======================================================

const getRecentActivities = async () => {
    const result = await carpetDB.query(`
        WITH activity_items AS (

            -- Sales
            SELECT

                'newSale' AS title,

                'Sale #' || s.id AS detail,

                s.sale_date AS time,

                'sales' AS type

            FROM sales s

            WHERE s.status = 'active'


            UNION ALL


            -- Inventory movements
            SELECT

                CASE
                    WHEN sm.movement_type IN (
                        'transfer_in',
                        'transfer_out'
                    )
                        THEN 'stockTransfer'

                    WHEN sm.movement_type = 'purchase'
                        THEN 'stockPurchased'

                    WHEN sm.movement_type = 'sale'
                        THEN 'stockSold'

                    WHEN sm.movement_type = 'sale_return'
                        THEN 'stockReturned'

                    WHEN sm.movement_type = 'adjustment'
                        THEN 'stockAdjusted'

                    ELSE 'stockMovement'
                END AS title,

                'Stock movement - Carpet #' || sm.carpet_id AS detail,

                sm.created_at AS time,

                'inventory' AS type

            FROM stock_movements sm


            UNION ALL


            -- Payments
            SELECT

                'paymentReceived' AS title,

                'Payment for Sale #' || p.sale_id AS detail,

                p.payment_date AS time,

                'payment' AS type

            FROM payments p

            WHERE p.payment_type IS DISTINCT FROM 'refund'


            UNION ALL


            -- Expenses
            SELECT

                'newExpense' AS title,

                COALESCE(
                    e.description,
                    'New expense'
                ) AS detail,

                e.created_at AS time,

                'expense' AS type

            FROM expenses e

        )


        SELECT *

        FROM activity_items

        ORDER BY time DESC

        LIMIT 10

    `);

    return result.rows;
};


// ======================================================
// 13. MAIN DASHBOARD SERVICE
// ======================================================

const getDashboardData = async (user, period = 'thisWeek') => {

    if (!PERIODS[period]) {
        throw new Error('Invalid dashboard period');
    }


    const [
        summary,
        profitData,
        expenseData,
        contacts,
        inventorySummary,
        inventoryCategories,
        receivables,
        recentSales,
        chart,
        activities
    ] = await Promise.all([

        getSalesAndPurchasesSummary(period),

        getDashboardProfit(period),

        getExpenseSummary(period),

        getContactsSummary(period),

        getInventorySummary(),

        getInventoryByCategory(),

        getReceivables(),

        getRecentSales(),

        getDashboardChart(period),

        getRecentActivities()

    ]);


    // ================================================
    // DATABASE VALUES
    // ================================================

    const sales = toNumber(summary.sales);
    const previousSales = toNumber(summary.previous_sales);

    const purchases = toNumber(summary.purchases);
    const previousPurchases = toNumber(summary.previous_purchases);

    const expenses = toNumber(expenseData.expenses);
    const previousExpenses = toNumber(expenseData.previous_expenses);

    const inventory = toNumber(inventorySummary.total_stock);


    // ================================================
    // NET PROFIT
    // ================================================

    const netProfit = profitData.profit - expenses;

    const previousNetProfit =
        profitData.previousProfit - previousExpenses;


    // ================================================
    // DASHBOARD STATISTICS
    // ================================================

    const stats = [

        {
            key: 'sales',
            value: sales,
            unit: 'AFN',
            change: calculateChange(sales, previousSales),
            positive: sales >= previousSales
        },

        {
            key: 'purchases',
            value: purchases,
            unit: 'AFN',
            change: calculateChange(purchases, previousPurchases),
            positive: purchases <= previousPurchases
        },

        {
            key: 'profit',
            value: netProfit,
            unit: 'AFN',
            change: calculateChange(netProfit, previousNetProfit),
            positive: netProfit >= previousNetProfit
        },

        {
            key: 'inventory',
            value: inventory,
            unit: 'pieces',
            change: 0,
            positive: true
        },

        {
            key: 'customers',
            value: toNumber(contacts.customers),
            unit: '',
            change: calculateChange(
                contacts.new_customers,
                contacts.previous_customers
            ),
            positive:
                toNumber(contacts.new_customers) >=
                toNumber(contacts.previous_customers)
        },

        {
            key: 'suppliers',
            value: toNumber(contacts.suppliers),
            unit: '',
            change: calculateChange(
                contacts.new_suppliers,
                contacts.previous_suppliers
            ),
            positive:
                toNumber(contacts.new_suppliers) >=
                toNumber(contacts.previous_suppliers)
        },

        {
            key: 'receivables',
            value: receivables,
            unit: 'AFN',
            change: 0,
            positive: true
        },

        {
            key: 'expenses',
            value: expenses,
            unit: 'AFN',
            change: calculateChange(expenses, previousExpenses),
            positive: expenses <= previousExpenses
        }

    ];


    // ================================================
    // FINAL DASHBOARD RESPONSE
    // ================================================

    return {

        stats,

        chart,

        financialSummary: {

            totalRevenue: profitData.revenue,

            totalCost: profitData.cost,

            totalExpenses: expenses,

            netProfit

        },

        inventory: {

            totalStock: inventory,

            inStock: toNumber(inventorySummary.in_stock),

            lowStock: toNumber(inventorySummary.low_stock),

            categories: inventoryCategories

        },

        recentSales,

        activities

    };

};


module.exports = {
    getDashboardData
};
