import { useState } from "react";
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
} from "lucide-react";

// Temporary demo data. Replace this object with real API data later.
const dashboardData = {
  stats: [
    { key: "sales", value: "125,500", unit: "AFN", change: "+12.5%", positive: true, icon: Wallet, color: "teal" },
    { key: "purchases", value: "68,000", unit: "AFN", change: "+8.2%", positive: true, icon: ShoppingCart, color: "blue" },
    { key: "profit", value: "32,750", unit: "AFN", change: "+15.3%", positive: true, icon: TrendingUp, color: "emerald" },
    { key: "inventory", value: "1,248", unit: "pieces", change: "-3.4%", positive: false, icon: Package, color: "violet" },
    { key: "customers", value: "186", unit: "people", change: "+6.8%", positive: true, icon: Users, color: "orange" },
    { key: "suppliers", value: "42", unit: "people", change: "+2.1%", positive: true, icon: Truck, color: "pink" },
    { key: "receivables", value: "48,500", unit: "AFN", change: "-5.2%", positive: true, icon: CreditCard, color: "amber" },
    { key: "expenses", value: "18,250", unit: "AFN", change: "+4.1%", positive: false, icon: Receipt, color: "rose" },
  ],
  chart: [
    { day: "mon", sales: 45, purchases: 25 },
    { day: "tue", sales: 68, purchases: 40 },
    { day: "wed", sales: 52, purchases: 30 },
    { day: "thu", sales: 85, purchases: 48 },
    { day: "fri", sales: 60, purchases: 35 },
    { day: "sat", sales: 95, purchases: 55 },
    { day: "sun", sales: 75, purchases: 42 },
  ],
  recentSales: [
    { id: "INV-1025", customer: "Ahmad Rahimi", date: "Today, 10:30 AM", amount: "15,500 AFN", status: "completed" },
    { id: "INV-1024", customer: "Mohammad Azizi", date: "Today, 09:15 AM", amount: "22,000 AFN", status: "pending" },
    { id: "INV-1023", customer: "Ali Ahmad", date: "Yesterday", amount: "8,500 AFN", status: "completed" },
    { id: "INV-1022", customer: "Nasir Sediqi", date: "Yesterday", amount: "12,500 AFN", status: "completed" },
    { id: "INV-1021", customer: "Bashir Khan", date: "Nov 10, 2026", amount: "6,000 AFN", status: "pending" },
  ],
  inventory: [
    { name: "Persian Carpet", category: "Traditional", quantity: 320, color: "bg-teal-500" },
    { name: "Turkish Carpet", category: "Modern", quantity: 245, color: "bg-blue-500" },
    { name: "Afghan Carpet", category: "Handmade", quantity: 180, color: "bg-violet-500" },
    { name: "Machine Carpet", category: "Machine Made", quantity: 390, color: "bg-amber-500" },
  ],
  activities: [
    { icon: ShoppingCart, title: "newSale", detail: "saleActivity", time: "10:30 AM", color: "teal" },
    { icon: Package, title: "newCarpet", detail: "carpetActivity", time: "09:45 AM", color: "blue" },
    { icon: CreditCard, title: "paymentReceived", detail: "paymentActivity", time: "09:15 AM", color: "emerald" },
    { icon: ArrowLeftRight, title: "stockTransfer", detail: "transferActivity", time: "Yesterday", color: "violet" },
  ],
};

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
    saleActivity: "Invoice INV-1025 was created.",
    carpetActivity: "A new carpet was added to inventory.",
    paymentActivity: "A customer payment was received.",
    transferActivity: "Stock was transferred to showroom.",
    newCarpet: "New Carpet Added",
    paymentReceived: "Payment Received",
    vsPrevious: "Compared with previous period",
    sampleData: "Demo Data",
    inventoryNote: "Stock quantities across all locations",
    totalRevenue: "Total Revenue",
    totalCost: "Total Cost",
    mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
    manageQuickly: "Manage your store quickly",
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
    saleActivity: "فاکتور INV-1025 ثبت شد.",
    carpetActivity: "یک قالین جدید به موجودی اضافه شد.",
    paymentActivity: "پرداخت مشتری دریافت شد.",
    transferActivity: "موجودی به نمایشگاه انتقال یافت.",
    newCarpet: "افزودن قالین جدید",
    paymentReceived: "دریافت پرداخت",
    vsPrevious: "در مقایسه با دوره قبلی",
    sampleData: "اطلاعات نمایشی",
    inventoryNote: "موجودی تمام محل‌های نگهداری",
    totalRevenue: "مجموع عواید",
    totalCost: "مجموع هزینه",
    mon: "دوشنبه", tue: "سه‌شنبه", wed: "چهارشنبه", thu: "پنجشنبه", fri: "جمعه", sat: "شنبه", sun: "یکشنبه",
    manageQuickly: "مدیریت سریع فروشگاه",
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
    saleActivity: "INV-1025 رسید جوړ شو.",
    carpetActivity: "نوې غالۍ موجودۍ ته اضافه شوه.",
    paymentActivity: "د پېرودونکي پیسې ترلاسه شوې.",
    transferActivity: "موجودي نندارتون ته ولېږدول شوه.",
    newCarpet: "نوې غالۍ اضافه شوه",
    paymentReceived: "تادیه ترلاسه شوه",
    vsPrevious: "له تېرې مودې سره پرتله",
    sampleData: "نمونوي معلومات",
    inventoryNote: "د ټولو ځایونو د موجودۍ شمېر",
    totalRevenue: "ټول عواید",
    totalCost: "ټول لګښت",
    mon: "دوشنبه", tue: "سه‌شنبه", wed: "چهارشنبه", thu: "پنجشنبه", fri: "جمعه", sat: "شنبه", sun: "یکشنبه",
    manageQuickly: "خپل پلورنځی په چټکۍ اداره کړئ",
  },
};

const colorStyles = {
  teal: "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  pink: "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
};

function Dashboard() {
  const { i18n } = useTranslation();
  const language = i18n.language?.split("-")[0] || "en";
  const isRTL = ["fa", "ps"].includes(language);
  const t = translations[language] || translations.en;
  const [period, setPeriod] = useState("thisWeek");

  const periods = [
    { key: "today", label: t.today },
    { key: "thisWeek", label: t.thisWeek },
    { key: "thisMonth", label: t.thisMonth },
    { key: "thisYear", label: t.thisYear },
  ];

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

  const totalStock = dashboardData.inventory.reduce((sum, item) => sum + item.quantity, 0);

  const quickActions = [
    { icon: Plus, label: t.newSale, color: "teal" },
    { icon: ShoppingBag, label: t.newPurchase, color: "blue" },
    { icon: Package, label: t.addCarpet, color: "violet" },
    { icon: Users, label: t.addCustomer, color: "orange" },
    { icon: Receipt, label: t.addExpense, color: "rose" },
    { icon: ArrowLeftRight, label: t.stockTransfer, color: "emerald" },
  ];

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen w-full bg-slate-50 p-3 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 sm:p-5 lg:p-7"
    >
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {t.dashboard}
              </h1>
              <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700 dark:border-teal-500/20 dark:bg-teal-500/10 dark:text-teal-400">
                {t.sampleData}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{t.welcome}</p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 sm:self-auto">
            <CalendarDays size={17} />
            <span>November 13, 2026</span>
          </div>
        </header>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardData.stats.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.key} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{statLabels[item.key]}</p>
                    <div className="mt-3 flex flex-wrap items-baseline gap-1.5">
                      <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{item.value}</span>
                      <span className="text-xs font-medium text-slate-400">
                        {item.unit === "AFN" ? "AFN" : item.unit === "pieces" ? t.pieces : t.people}
                      </span>
                    </div>
                  </div>
                  <div className={`rounded-xl p-3 ${colorStyles[item.color]}`}><Icon size={22} /></div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`flex items-center gap-0.5 rounded-md px-1.5 py-1 text-xs font-semibold ${item.positive ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"}`}>
                    {item.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {item.change}
                  </span>
                  <span className="text-xs text-slate-400">{t.vsLastPeriod}</span>
                </div>
              </article>
            );
          })}
        </section>

        {/* Sales chart and financial summary */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5 xl:col-span-2">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">{t.salesOverview}</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.vsPrevious}</p>
              </div>
              <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                {periods.map((item) => (
                  <button key={item.key} type="button" onClick={() => setPeriod(item.key)} className={`rounded-lg px-2.5 py-2 text-xs font-medium transition ${period === item.key ? "bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-400" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"}`}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><span className="h-2.5 w-2.5 rounded-full bg-teal-500" />{t.sales}</div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><span className="h-2.5 w-2.5 rounded-full bg-blue-400" />{t.purchases}</div>
            </div>

            <div className="relative mt-5 flex h-56 items-end justify-between gap-2 border-b border-slate-100 pb-0 dark:border-slate-800 sm:h-64 sm:gap-4">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-7">
                {[100, 75, 50, 25].map((line) => <div key={line} className="w-full border-t border-dashed border-slate-100 dark:border-slate-800" />)}
              </div>
              {dashboardData.chart.map((item) => (
                <div key={item.day} className="relative z-10 flex h-full flex-1 flex-col items-center justify-end">
                  <div className="flex h-[85%] w-full items-end justify-center gap-1 sm:gap-2">
                    <div className="w-full max-w-7 rounded-t-md bg-teal-500 transition-all hover:bg-teal-400" style={{ height: `${item.sales}%` }} />
                    <div className="w-full max-w-7 rounded-t-md bg-blue-400 transition-all hover:bg-blue-300" style={{ height: `${item.purchases}%` }} />
                  </div>
                  <span className="mt-3 text-[10px] font-medium text-slate-400 sm:text-xs">{t[item.day]}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{t.financialSummary}</h2>
              <div className="rounded-lg bg-teal-50 p-2 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400"><ChartNoAxesCombined size={19} /></div>
            </div>
            <div className="mt-6 flex flex-col items-center">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full" style={{ background: "conic-gradient(#14b8a6 0% 55%, #3b82f6 55% 78%, #f59e0b 78% 100%)" }}>
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900">
                  <span className="text-xs text-slate-400">{t.totalRevenue}</span>
                  <span className="mt-1 text-xl font-bold text-slate-900 dark:text-white">125.5K</span>
                  <span className="text-[10px] text-slate-400">AFN</span>
                </div>
              </div>
            </div>
            <div className="mt-7 space-y-4">
              {[
                { label: t.totalRevenue, amount: "125,500 AFN", color: "bg-teal-500" },
                { label: t.totalCost, amount: "48,000 AFN", color: "bg-blue-500" },
                { label: t.totalExpenses, amount: "18,250 AFN", color: "bg-amber-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${item.color}`} /><span className="text-xs text-slate-500 dark:text-slate-400">{item.label}</span></div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.amount}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* Inventory and quick actions */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5 xl:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">{t.inventoryOverview}</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.inventoryNote}</p>
              </div>
              <Boxes className="text-teal-500" size={22} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70"><p className="text-xs text-slate-500 dark:text-slate-400">{t.totalStock}</p><p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{totalStock.toLocaleString()}</p></div>
              <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-500/10"><p className="text-xs text-emerald-700 dark:text-emerald-400">{t.inStock}</p><p className="mt-2 text-xl font-bold text-emerald-700 dark:text-emerald-400">1,180</p></div>
              <div className="col-span-2 rounded-xl bg-amber-50 p-3 dark:bg-amber-500/10 sm:col-span-1"><p className="text-xs text-amber-700 dark:text-amber-400">{t.lowStock}</p><p className="mt-2 text-xl font-bold text-amber-700 dark:text-amber-400">18</p></div>
            </div>
            <div className="mt-6 space-y-5">
              {dashboardData.inventory.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.name}</p><p className="text-[11px] text-slate-400">{item.category}</p></div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.quantity}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.quantity / totalStock) * 100}%` }} /></div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/20 dark:bg-amber-500/5">
              <AlertTriangle className="shrink-0 text-amber-600 dark:text-amber-400" size={20} />
              <div className="min-w-0"><p className="text-sm font-semibold text-amber-800 dark:text-amber-300">{t.lowStockAlert}</p><p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">{t.lowStockMessage}</p></div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <h2 className="font-bold text-slate-900 dark:text-white">{t.quickActions}</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.manageQuickly}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {quickActions.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex min-h-28 flex-col items-start justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-teal-200 hover:bg-teal-50/50 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-teal-500/30 dark:hover:bg-teal-500/5">
                    <div className={`rounded-lg p-2 ${colorStyles[item.color]}`}><Icon size={19} /></div>
                    <span className="mt-3 text-xs font-semibold text-slate-700 dark:text-slate-200">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        {/* Recent sales and activities */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
            <div className="flex items-center justify-between gap-2 p-4 sm:p-5">
              <div><h2 className="font-bold text-slate-900 dark:text-white">{t.recentSales}</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.vsPrevious}</p></div>
              <span className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400">{t.viewAll}<ArrowRight size={14} className={isRTL ? "rotate-180" : ""} /></span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-start">
                <thead><tr className="border-y border-slate-100 bg-slate-50 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                  <th className="px-5 py-3 text-start font-medium">{t.invoice}</th><th className="px-5 py-3 text-start font-medium">{t.customer}</th><th className="px-5 py-3 text-start font-medium">{t.date}</th><th className="px-5 py-3 text-start font-medium">{t.amount}</th><th className="px-5 py-3 text-start font-medium">{t.status}</th>
                </tr></thead>
                <tbody>
                  {dashboardData.recentSales.map((sale) => (
                    <tr key={sale.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                      <td className="px-5 py-4 text-xs font-semibold text-teal-600 dark:text-teal-400">{sale.id}</td>
                      <td className="px-5 py-4 text-xs font-medium text-slate-700 dark:text-slate-200">{sale.customer}</td>
                      <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">{sale.date}</td>
                      <td className="px-5 py-4 text-xs font-bold text-slate-800 dark:text-slate-200">{sale.amount}</td>
                      <td className="px-5 py-4"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${sale.status === "completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"}`}>{sale.status === "completed" ? <CheckCircle2 size={12} /> : <Clock size={12} />}{t[sale.status]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <div className="flex items-center justify-between"><h2 className="font-bold text-slate-900 dark:text-white">{t.recentActivities}</h2><Activity size={19} className="text-teal-500" /></div>
            <div className="mt-5 space-y-5">
              {dashboardData.activities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={`${activity.title}-${index}`} className="flex gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorStyles[activity.color]}`}><Icon size={18} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t[activity.title]}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{t[activity.detail]}</p>
                      <p className="mt-1 text-[10px] text-slate-400">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 pt-4 text-xs text-slate-400 dark:border-slate-800 sm:flex-row sm:items-center">
          <p>CarpetPro - Business Management System</p>
          <p>{t.sampleData} · 2026</p>
        </footer>
      </div>
    </main>
  );
}

export default Dashboard;
