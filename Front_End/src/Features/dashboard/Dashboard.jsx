
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Wallet,
  ShoppingCart,
  TrendingUp,
  Package,
  Users,
  Truck,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  ArrowRight,
  Plus,
  Receipt,
  Boxes,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  ShoppingBag,
  ArrowLeftRight,
  ChartNoAxesCombined,
  RefreshCw,
  Loader2,
} from "lucide-react";

import api from "../services/api";


// ======================================================

const STAT_CONFIG = {
  sales: { icon: Wallet, color: "teal" },
  purchases: { icon: ShoppingCart, color: "blue" },
  profit: { icon: TrendingUp, color: "emerald" },
  inventory: { icon: Package, color: "violet" },
  customers: { icon: Users, color: "orange" },
  suppliers: { icon: Truck, color: "pink" },
  receivables: { icon: CreditCard, color: "amber" },
  expenses: { icon: Receipt, color: "rose" },
};

const INVENTORY_COLORS = [
  "bg-teal-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-pink-500",
];

const ACTIVITY_CONFIG = {
  sales: {
    icon: ShoppingCart,
    color: "teal",
  },
  inventory: {
    icon: Package,
    color: "blue",
  },
  payment: {
    icon: CreditCard,
    color: "emerald",
  },
  expense: {
    icon: Receipt,
    color: "rose",
  },
}

const colorStyles = {
  teal: "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  pink: "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
}

// ======================================================

const translations = {
  en: {
    dashboard: "Dashboard",
    welcome: "Welcome back! Here's what's happening in your store.",
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisYear: "This Year",
    totalSales: "Total Sales",
    totalPurchases: "Total Purchases",
    netProfit: "Net Profit",
    totalInventory: "Total Inventory",
    totalCustomers: "Total Customers",
    totalSuppliers: "Total Suppliers",
    receivables: "Customer Receivables",
    totalExpenses: "Total Expenses",
    vsLastPeriod: "vs previous period",
    salesOverview: "Sales & Purchases Overview",
    sales: "Sales",
    purchases: "Purchases",
    inventoryOverview: "Inventory Overview",
    totalStock: "Total Stock",
    inStock: "In Stock",
    lowStock: "Low Stock",
    recentSales: "Recent Sales",
    viewAll: "View All",
    invoice: "Invoice",
    customer: "Customer",
    date: "Date",
    amount: "Amount",
    status: "Status",
    completed: "Completed",
    pending: "Pending",
    recentActivities: "Recent Activities",
    quickActions: "Quick Actions",
    newSale: "New Sale",
    newPurchase: "New Purchase",
    addCarpet: "Add Carpet",
    addCustomer: "Add Customer",
    addExpense: "Add Expense",
    stockTransfer: "Stock Transfer",
    people: "people",
    pieces: "pieces",
    lowStockAlert: "Low Stock Alert",
    lowStockMessage: "Some carpets are running low on stock.",
    financialSummary: "Financial Summary",
    saleActivity: "Sale",
    carpetActivity: "Stock movement",
    paymentActivity: "Customer payment",
    transferActivity: "Stock transfer",
    newCarpet: "New Carpet Added",
    paymentReceived: "Payment Received",
    newExpense: "New Expense",
    vsPrevious: "Compared with previous period",
    inventoryNote: "Stock quantities across all locations",
    totalRevenue: "Total Revenue",
    totalCost: "Total Cost",
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
    sun: "Sun",
    manageQuickly: "Manage your store quickly",
    noData: "No data available",
    loading: "Loading dashboard...",
    retry: "Try Again",
    loadError: "Failed to load dashboard data.",
    noRecentSales: "No recent sales found.",
    noActivities: "No recent activities.",
    noInventory: "No inventory data available.",
    refresh: "Refresh",
  },

  fa: {
    dashboard: "داشبورد",
    welcome: "خوش آمدید! در اینجا خلاصه فعالیت‌های فروشگاه شما قرار دارد.",
    today: "امروز",
    thisWeek: "این هفته",
    thisMonth: "این ماه",
    thisYear: "امسال",
    totalSales: "مجموع فروشات",
    totalPurchases: "مجموع خریدها",
    netProfit: "سود خالص",
    totalInventory: "موجودی قالین‌ها",
    totalCustomers: "مجموع مشتریان",
    totalSuppliers: "مجموع تأمین‌کنندگان",
    receivables: "طلب از مشتریان",
    totalExpenses: "مجموع مصارف",
    vsLastPeriod: "در مقایسه با دوره قبل",
    salesOverview: "گزارش فروشات و خریدها",
    sales: "فروشات",
    purchases: "خریدها",
    inventoryOverview: "نمای کلی موجودی",
    totalStock: "مجموع موجودی",
    inStock: "موجود",
    lowStock: "موجودی کم",
    recentSales: "آخرین فروشات",
    viewAll: "مشاهده همه",
    invoice: "فاکتور",
    customer: "مشتری",
    date: "تاریخ",
    amount: "مبلغ",
    status: "وضعیت",
    completed: "تکمیل شده",
    pending: "در انتظار",
    recentActivities: "فعالیت‌های اخیر",
    quickActions: "دسترسی سریع",
    newSale: "فروش جدید",
    newPurchase: "خرید جدید",
    addCarpet: "افزودن قالین",
    addCustomer: "افزودن مشتری",
    addExpense: "ثبت مصرف",
    stockTransfer: "انتقال موجودی",
    people: "نفر",
    pieces: "عدد",
    lowStockAlert: "هشدار موجودی کم",
    lowStockMessage: "موجودی بعضی از قالین‌ها رو به کاهش است.",
    financialSummary: "خلاصه مالی",
    saleActivity: "فروش",
    carpetActivity: "حرکت موجودی",
    paymentActivity: "پرداخت مشتری",
    transferActivity: "انتقال موجودی",
    newCarpet: "افزودن قالین جدید",
    paymentReceived: "دریافت پرداخت",
    newExpense: "مصرف جدید",
    vsPrevious: "در مقایسه با دوره قبلی",
    inventoryNote: "موجودی تمام محل‌های نگهداری",
    totalRevenue: "مجموع عواید",
    totalCost: "مجموع هزینه",
    mon: "دوشنبه",
    tue: "سه‌شنبه",
    wed: "چهارشنبه",
    thu: "پنجشنبه",
    fri: "جمعه",
    sat: "شنبه",
    sun: "یکشنبه",
    manageQuickly: "مدیریت سریع فروشگاه",
    noData: "اطلاعاتی موجود نیست",
    loading: "داشبورد در حال بارگذاری است...",
    retry: "تلاش دوباره",
    loadError: "دریافت اطلاعات داشبورد موفق نشد.",
    noRecentSales: "فروش اخیری وجود ندارد.",
    noActivities: "فعالیت اخیری وجود ندارد.",
    noInventory: "اطلاعات موجودی موجود نیست.",
    refresh: "تازه‌سازی",
  },

  ps: {
    dashboard: "ډشبورډ",
    welcome: "ښه راغلاست! دلته ستاسو د پلورنځي د فعالیتونو لنډیز دی.",
    today: "نن",
    thisWeek: "دا اونۍ",
    thisMonth: "دا میاشت",
    thisYear: "سږ کال",
    totalSales: "ټول خرڅلاو",
    totalPurchases: "ټولې پېرودنې",
    netProfit: "خالصه ګټه",
    totalInventory: "د غالیو موجودي",
    totalCustomers: "ټول پېرودونکي",
    totalSuppliers: "ټول عرضه کوونکي",
    receivables: "د پېرودونکو طلب",
    totalExpenses: "ټول لګښتونه",
    vsLastPeriod: "له تېرې مودې سره پرتله",
    salesOverview: "د خرڅلاو او پېرودنې راپور",
    sales: "خرڅلاو",
    purchases: "پېرودنې",
    inventoryOverview: "د موجودۍ لنډیز",
    totalStock: "ټوله موجودي",
    inStock: "موجود",
    lowStock: "کمه موجودي",
    recentSales: "وروستي خرڅلاوونه",
    viewAll: "ټول وګورئ",
    invoice: "رسید",
    customer: "پېرودونکی",
    date: "نېټه",
    amount: "اندازه",
    status: "حالت",
    completed: "بشپړ شوی",
    pending: "تر کار لاندې",
    recentActivities: "وروستي فعالیتونه",
    quickActions: "چټک لاسرسی",
    newSale: "نوی خرڅلاو",
    newPurchase: "نوې پېرودنه",
    addCarpet: "غالی زیاتول",
    addCustomer: "پېرودونکی زیاتول",
    addExpense: "لګښت ثبتول",
    stockTransfer: "د موجودۍ لېږد",
    people: "کسان",
    pieces: "دانې",
    lowStockAlert: "د کمې موجودۍ خبرتیا",
    lowStockMessage: "د ځینو غالیو موجودي کمه شوې ده.",
    financialSummary: "مالي لنډیز",
    saleActivity: "خرڅلاو",
    carpetActivity: "د موجودۍ حرکت",
    paymentActivity: "د پېرودونکي تادیه",
    transferActivity: "د موجودۍ لېږد",
    newCarpet: "نوې غالۍ اضافه شوه",
    paymentReceived: "تادیه ترلاسه شوه",
    newExpense: "نوی لګښت",
    vsPrevious: "له تېرې مودې سره پرتله",
    inventoryNote: "د ټولو ځایونو د موجودۍ شمېر",
    totalRevenue: "ټول عواید",
    totalCost: "ټول لګښت",
    mon: "دوشنبه",
    tue: "سه‌شنبه",
    wed: "چهارشنبه",
    thu: "پنجشنبه",
    fri: "جمعه",
    sat: "شنبه",
    sun: "یکشنبه",
    manageQuickly: "خپل پلورنځی په چټکۍ اداره کړئ",
    noData: "معلومات نشته",
    loading: "ډشبورډ د بارولو په حال کې دی...",
    retry: "بیا هڅه",
    loadError: "د ډشبورډ معلومات ترلاسه نه شول.",
    noRecentSales: "وروستي خرڅلاوونه نشته.",
    noActivities: "وروستي فعالیتونه نشته.",
    noInventory: "د موجودۍ معلومات نشته.",
    refresh: "تازه کول",
  },
};

// ======================================================

const formatNumber = (value, language = "en") => {
  return Number(value || 0).toLocaleString(
    language === "fa" ? "fa-AF" : language === "ps" ? "ps-AF" : "en-US",
    {
      maximumFractionDigits: 2,
    }
  )
}

const formatCurrency = (value, language = "en") => {
  return `${formatNumber(value, language)} AFN`;
};

const formatDate = (value, language = "en") => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  const locale =
    language === "fa"
      ? "fa-AF"
      : language === "ps"
        ? "ps-AF"
        : "en-US";

  return date.toLocaleString(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatChange = (value, language = "en") => {
  const number = Number(value || 0);
  const sign = number > 0 ? "+" : "";

  return `${sign}${formatNumber(number, language)}%`;
};

// ======================================================
// DASHBOARD COMPONENT

function Dashboard() {
  const { i18n } = useTranslation();

  const language = i18n.language?.split("-")[0] || "en";
  const isRTL = ["fa", "ps"].includes(language);
  const t = translations[language] || translations.en;

  const [period, setPeriod] = useState("thisWeek");
  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ====================================================
  // FETCH DASHBOARD DATA
  // ====================================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard", {
        params: { period },
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Dashboard request failed");
      }

      setDashboardData(response.data.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          t.loadError
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [period]);

  // ====================================================
  // PERIOD OPTIONS
  // ====================================================

  const periods = [
    { key: "today", label: t.today },
    { key: "thisWeek", label: t.thisWeek },
    { key: "thisMonth", label: t.thisMonth },
    { key: "thisYear", label: t.thisYear },
  ];

  // ====================================================
  // STAT LABELS
  // ====================================================

  const statLabels = {
    sales: t.totalSales,
    purchases: t.totalPurchases,
    profit: t.netProfit,
    inventory: t.totalInventory,
    customers: t.totalCustomers,
    suppliers: t.totalSuppliers,
    receivables: t.receivables,
    expenses: t.totalExpenses,
  };

  // ====================================================
  // QUICK ACTIONS
  // ====================================================

  const quickActions = [
    { icon: Plus, label: t.newSale, color: "teal" },
    { icon: ShoppingBag, label: t.newPurchase, color: "blue" },
    { icon: Package, label: t.addCarpet, color: "violet" },
    { icon: Users, label: t.addCustomer, color: "orange" },
    { icon: Receipt, label: t.addExpense, color: "rose" },
    { icon: ArrowLeftRight, label: t.stockTransfer, color: "emerald" },
  ];

  // ====================================================
  // NORMALIZED DATA
  // ====================================================

  const stats = dashboardData?.stats || [];
  const chart = dashboardData?.chart || [];
  const recentSales = dashboardData?.recentSales || [];
  const inventory = dashboardData?.inventory || {};
  const inventoryCategories = inventory.categories || [];
  const activities = dashboardData?.activities || [];

  const financialSummary = dashboardData?.financialSummary || {
    totalRevenue: 0,
    totalCost: 0,
    totalExpenses: 0,
    netProfit: 0,
  };

  const totalStock = Number(inventory.totalStock || 0);

  // Chart height normalization
  const chartMax = Math.max(
    1,
    ...chart.flatMap((item) => [
      Number(item.sales || 0),
      Number(item.purchases || 0),
    ])
  )

  // Financial chart percentages
  const revenue = Math.max(0, Number(financialSummary.totalRevenue || 0));
  const cost = Math.max(0, Number(financialSummary.totalCost || 0));
  const expenses = Math.max(0, Number(financialSummary.totalExpenses || 0));

  const financialTotal = revenue + cost + expenses;

  const revenuePercent =
    financialTotal > 0 ? (revenue / financialTotal) * 100 : 0;

  const costPercent =
    financialTotal > 0
      ? (cost / financialTotal) * 100
      : 0;

  const expensePercent =
    financialTotal > 0
      ? (expenses / financialTotal) * 100
      : 0;

  const financialGradient = `conic-gradient(
    #14b8a6 0% ${revenuePercent}%,
    #3b82f6 ${revenuePercent}% ${revenuePercent + costPercent}%,
    #f59e0b ${revenuePercent + costPercent}% 100%
  )`;

  // ====================================================
  // LOADING STATE
  // ====================================================

  if (loading && !dashboardData) {
    return (
      <main
        dir={isRTL ? "rtl" : "ltr"}
        className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950"
      >
        <div className="flex flex-col items-center gap-3 text-teal-600 dark:text-teal-400">
          <Loader2 size={38} className="animate-spin" />
          <p className="text-sm font-medium">{t.loading}</p>
        </div>
      </main>
    );
  }

  // ====================================================
  // ERROR STATE
  // ====================================================

  if (error && !dashboardData) {
    return (
      <main
        dir={isRTL ? "rtl" : "ltr"}
        className="flex min-h-screen items-center justify-center bg-slate-50 p-5 dark:bg-slate-950"
      >
        <div className="flex max-w-md flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <AlertTriangle size={40} className="text-rose-500" />

          <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            {t.loadError}
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchDashboard}
            className="mt-5 flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            <RefreshCw size={16} />
            {t.retry}
          </button>
        </div>
      </main>
    );
  }

  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen w-full bg-slate-50 p-3 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 sm:p-5 lg:p-7"
    >
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* PAGE HEADING */}

        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {t.dashboard}
            </h1>

            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              {t.welcome}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <CalendarDays size={17} />
              <span>
                {new Date().toLocaleDateString(
                  language === "fa"
                    ? "fa-AF"
                    : language === "ps"
                      ? "ps-AF"
                      : "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={fetchDashboard}
              disabled={loading}
              title={t.refresh}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition hover:text-teal-600 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-teal-400"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </header>

        {/* ERROR MESSAGE */}

        {error && dashboardData && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
            <span>{error}</span>
            <button
              type="button"
              onClick={fetchDashboard}
              className="font-semibold underline"
            >
              {t.retry}
            </button>
          </div>
        )}

        {/* STATISTICS */}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const config = STAT_CONFIG[item.key];

            if (!config) return null;

            const Icon = config.icon;
            const positive = Boolean(item.positive);
            const value = Number(item.value || 0);

            return (
              <article
                key={item.key}
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {statLabels[item.key]}
                    </p>

                    <div className="mt-3 flex flex-wrap items-baseline gap-1.5">
                      <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {formatNumber(value, language)}
                      </span>

                      <span className="text-xs font-medium text-slate-400">
                        {item.unit === "AFN"
                          ? "AFN"
                          : ["pieces", "pcs"].includes(item.unit)
                            ? t.pieces
                            : item.unit
                              ? t.people
                              : ""}
                      </span>
                    </div>
                  </div>

                  <div className={`rounded-xl p-3 ${colorStyles[config.color]}`}>
                    <Icon size={22} />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`flex items-center gap-0.5 rounded-md px-1.5 py-1 text-xs font-semibold ${
                      positive
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                    }`}
                  >
                    {positive ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}

                    {formatChange(item.change, language)}
                  </span>

                  <span className="text-xs text-slate-400">
                    {t.vsLastPeriod}
                  </span>
                </div>
              </article>
            );
          })}
        </section>

        {/* SALES CHART AND FINANCIAL SUMMARY */}

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* CHART */}

          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5 xl:col-span-2">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                  {t.salesOverview}
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t.vsPrevious}
                </p>
              </div>

              <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                {periods.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setPeriod(item.key)}
                    className={`rounded-lg px-2.5 py-2 text-xs font-medium transition ${
                      period === item.key
                        ? "bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-400"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                {t.sales}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                {t.purchases}
              </div>
            </div>

            <div className="relative mt-5 flex h-56 items-end justify-between gap-2 border-b border-slate-100 pb-0 dark:border-slate-800 sm:h-64 sm:gap-4">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-7">
                {[100, 75, 50, 25].map((line) => (
                  <div
                    key={line}
                    className="w-full border-t border-dashed border-slate-100 dark:border-slate-800"
                  />
                ))}
              </div>

              {chart.length > 0 ? (
                chart.map((item, index) => {
                  const salesHeight =
                    (Number(item.sales || 0) / chartMax) * 100;

                  const purchasesHeight =
                    (Number(item.purchases || 0) / chartMax) * 100;

                  return (
                    <div
                      key={`${item.day}-${index}`}
                      className="relative z-10 flex h-full flex-1 flex-col items-center justify-end"
                    >
                      <div className="flex h-[85%] w-full items-end justify-center gap-1 sm:gap-2">
                        <div
                          title={`${t.sales}: ${formatCurrency(item.sales, language)}`}
                          className="w-full max-w-7 rounded-t-md bg-teal-500 transition-all hover:bg-teal-400"
                          style={{ height: `${salesHeight}%` }}
                        />

                        <div
                          title={`${t.purchases}: ${formatCurrency(item.purchases, language)}`}
                          className="w-full max-w-7 rounded-t-md bg-blue-400 transition-all hover:bg-blue-300"
                          style={{ height: `${purchasesHeight}%` }}
                        />
                      </div>

                      <span className="mt-3 text-[10px] font-medium text-slate-400 sm:text-xs">
                        {t[item.day] || item.day}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="flex w-full items-center justify-center text-sm text-slate-400">
                  {t.noData}
                </div>
              )}
            </div>
          </article>

          {/* FINANCIAL SUMMARY */}

          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.financialSummary}
              </h2>

              <div className="rounded-lg bg-teal-50 p-2 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                <ChartNoAxesCombined size={19} />
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center">
              <div
                className="relative flex h-44 w-44 items-center justify-center rounded-full"
                style={{ background: financialGradient }}
              >
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900">
                  <span className="text-xs text-slate-400">
                    {t.totalRevenue}
                  </span>

                  <span className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                    {formatNumber(revenue, language)}
                  </span>

                  <span className="text-[10px] text-slate-400">
                    AFN
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              {[
                {
                  label: t.totalRevenue,
                  amount: revenue,
                  color: "bg-teal-500",
                },
                {
                  label: t.totalCost,
                  amount: cost,
                  color: "bg-blue-500",
                },
                {
                  label: t.totalExpenses,
                  amount: expenses,
                  color: "bg-amber-500",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />

                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {item.label}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(item.amount, language)}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* INVENTORY AND QUICK ACTIONS */}

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* INVENTORY */}

          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5 xl:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  {t.inventoryOverview}
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t.inventoryNote}
                </p>
              </div>

              <Boxes className="text-teal-500" size={22} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.totalStock}
                </p>

                <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                  {formatNumber(inventory.totalStock, language)}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-500/10">
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  {t.inStock}
                </p>

                <p className="mt-2 text-xl font-bold text-emerald-700 dark:text-emerald-400">
                  {formatNumber(inventory.inStock, language)}
                </p>
              </div>

              <div className="col-span-2 rounded-xl bg-amber-50 p-3 dark:bg-amber-500/10 sm:col-span-1">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  {t.lowStock}
                </p>

                <p className="mt-2 text-xl font-bold text-amber-700 dark:text-amber-400">
                  {formatNumber(inventory.lowStock, language)}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {inventoryCategories.length > 0 ? (
                inventoryCategories.map((item, index) => {
                  const color =
                    INVENTORY_COLORS[index % INVENTORY_COLORS.length];

                  const percentage =
                    totalStock > 0
                      ? (Number(item.quantity || 0) / totalStock) * 100
                      : 0;

                  return (
                    <div key={`${item.name}-${index}`}>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {item.name}
                          </p>

                          <p className="text-[11px] text-slate-400">
                            {item.category || ""}
                          </p>
                        </div>

                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {formatNumber(item.quantity, language)}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="py-5 text-center text-sm text-slate-400">
                  {t.noInventory}
                </p>
              )}
            </div>

            {Number(inventory.lowStock || 0) > 0 && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/20 dark:bg-amber-500/5">
                <AlertTriangle className="shrink-0 text-amber-600 dark:text-amber-400" size={20} />

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                    {t.lowStockAlert}
                  </p>

                  <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
                    {t.lowStockMessage}
                  </p>
                </div>
              </div>
            )}
          </article>

          {/* QUICK ACTIONS */}

          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <h2 className="font-bold text-slate-900 dark:text-white">
              {t.quickActions}
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {t.manageQuickly}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {quickActions.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex min-h-28 flex-col items-start justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-teal-200 hover:bg-teal-50/50 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-teal-500/30 dark:hover:bg-teal-500/5"
                  >
                    <div className={`rounded-lg p-2 ${colorStyles[item.color]}`}>
                      <Icon size={19} />
                    </div>

                    <span className="mt-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        {/* RECENT SALES AND ACTIVITIES */}

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* RECENT SALES */}

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
            <div className="flex items-center justify-between gap-2 p-4 sm:p-5">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  {t.recentSales}
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t.vsPrevious}
                </p>
              </div>

              <span className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
                {t.viewAll}
                <ArrowRight
                  size={14}
                  className={isRTL ? "rotate-180" : ""}
                />
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-start">
                <thead>
                  <tr className="border-y border-slate-100 bg-slate-50 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                    <th className="px-5 py-3 text-start font-medium">
                      {t.invoice}
                    </th>

                    <th className="px-5 py-3 text-start font-medium">
                      {t.customer}
                    </th>

                    <th className="px-5 py-3 text-start font-medium">
                      {t.date}
                    </th>

                    <th className="px-5 py-3 text-start font-medium">
                      {t.amount}
                    </th>

                    <th className="px-5 py-3 text-start font-medium">
                      {t.status}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentSales.length > 0 ? (
                    recentSales.map((sale) => (
                      <tr
                        key={sale.id}
                        className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                      >
                        <td className="px-5 py-4 text-xs font-semibold text-teal-600 dark:text-teal-400">
                          INV-{sale.id}
                        </td>

                        <td className="px-5 py-4 text-xs font-medium text-slate-700 dark:text-slate-200">
                          {sale.customer}
                        </td>

                        <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(sale.date, language)}
                        </td>

                        <td className="px-5 py-4 text-xs font-bold text-slate-800 dark:text-slate-200">
                          {formatCurrency(sale.amount, language)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${
                              sale.status === "completed"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                            }`}
                          >
                            {sale.status === "completed" ? (
                              <CheckCircle2 size={12} />
                            ) : (
                              <Clock size={12} />
                            )}

                            {t[sale.status] || sale.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-5 py-8 text-center text-sm text-slate-400"
                      >
                        {t.noRecentSales}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>

          {/* RECENT ACTIVITIES */}

          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white">
                {t.recentActivities}
              </h2>

              <Activity size={19} className="text-teal-500" />
            </div>

            <div className="mt-5 space-y-5">
              {activities.length > 0 ? (
                activities.map((activity, index) => {
                  const config =
                    ACTIVITY_CONFIG[activity.type] ||
                    ACTIVITY_CONFIG.inventory;

                  const Icon = config.icon;

                  const title = t[activity.title] || activity.title;

                  const detail =
                    t[activity.detail] || activity.detail || "";

                  return (
                    <div
                      key={`${activity.type}-${activity.time}-${index}`}
                      className="flex gap-3"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorStyles[config.color]}`}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                          {detail}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {formatDate(activity.time, language)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="py-5 text-center text-sm text-slate-400">
                  {t.noActivities}
                </p>
              )}
            </div>
          </article>
        </section>

        {/* FOOTER */}

        <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 pt-4 text-xs text-slate-400 dark:border-slate-800 sm:flex-row sm:items-center">
          <p>CarpetPro - Business Management System</p>
          <p>CarpetPro · 2026</p>
        </footer>
      </div>
    </main>
  );
}

export default Dashboard;
