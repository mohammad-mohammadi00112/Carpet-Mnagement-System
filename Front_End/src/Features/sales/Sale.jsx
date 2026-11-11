

import { useMemo, useState } from "react";
import {
  Search, Plus, X, ShoppingCart, CheckCircle2,
  Clock, AlertCircle, Eye, CalendarDays
} from "lucide-react";

const translations = {
  en: {
    title: "Sales Management",
    subtitle: "Manage and track all carpet sales",
    newSale: "New Sale",
    totalSales: "Total Sales",
    totalRevenue: "Total Revenue",
    paid: "Paid",
    partial: "Partially Paid",
    unpaid: "Unpaid",
    search: "Search sale, customer or notes...",
    allPayments: "All Payment Status",
    allRecords: "All Records",
    saleId: "Sale ID",
    customer: "Customer",
    employee: "Employee",
    date: "Sale Date",
    amount: "Total Amount",
    payment: "Payment Status",
    status: "Record Status",
    dueDate: "Due Date",
    notes: "Notes",
    actions: "Actions",
    active: "Active",
    cancelled: "Cancelled",
    createTitle: "Create New Sale",
    customerId: "Customer ID",
    employeeId: "Employee ID",
    currencyId: "Currency ID",
    saleDate: "Sale Date",
    discount: "Discount",
    tax: "Tax Amount",
    total: "Total Amount",
    selectPayment: "Select Payment Status",
    save: "Save Sale",
    cancel: "Cancel",
    close: "Close",
    enterNotes: "Enter sale notes...",
    required: "Please fill in the required fields correctly.",
    noResults: "No sales found",
    details: "View Details",
    due: "Due",
    records: "sales",
    customerLabel: "Customer",
    employeeLabel: "Employee"
  },
  fa: {
    title: "مدیریت فروشات",
    subtitle: "مدیریت و پیگیری تمام فروش‌های فرش",
    newSale: "فروش جدید",
    totalSales: "مجموع فروشات",
    totalRevenue: "مجموع عواید",
    paid: "پرداخت‌شده",
    partial: "پرداخت قسمی",
    unpaid: "پرداخت‌نشده",
    search: "جستجوی فروش، مشتری یا یادداشت...",
    allPayments: "تمام وضعیت‌های پرداخت",
    allRecords: "تمام وضعیت‌ها",
    saleId: "شماره فروش",
    customer: "مشتری",
    employee: "کارمند",
    date: "تاریخ فروش",
    amount: "مجموع مبلغ",
    payment: "وضعیت پرداخت",
    status: "وضعیت ثبت",
    dueDate: "تاریخ سررسید",
    notes: "یادداشت",
    actions: "عملیات",
    active: "فعال",
    cancelled: "لغو شده",
    createTitle: "ثبت فروش جدید",
    customerId: "شناسه مشتری",
    employeeId: "شناسه کارمند",
    currencyId: "شناسه واحد پول",
    saleDate: "تاریخ فروش",
    discount: "تخفیف",
    tax: "مقدار مالیه",
    total: "مجموع مبلغ",
    selectPayment: "انتخاب وضعیت پرداخت",
    save: "ثبت فروش",
    cancel: "لغو",
    close: "بستن",
    enterNotes: "یادداشت فروش را وارد کنید...",
    required: "لطفاً خانه‌های ضروری را درست تکمیل کنید.",
    noResults: "هیچ فروشی پیدا نشد",
    details: "مشاهده جزئیات",
    due: "بدهی",
    records: "فروش",
    customerLabel: "مشتری",
    employeeLabel: "کارمند"
  },
  ps: {
    title: "د پلورنو مدیریت",
    subtitle: "د غالیو ټولې پلورنې اداره او تعقیب کړئ",
    newSale: "نوې پلورنه",
    totalSales: "ټولې پلورنې",
    totalRevenue: "ټول عواید",
    paid: "تادیه شوې",
    partial: "نیمه تادیه شوې",
    unpaid: "تادیه شوې نه ده",
    search: "پلورنه، پېرودونکی یا یادښت ولټوئ...",
    allPayments: "د تادیې ټول حالتونه",
    allRecords: "ټول حالتونه",
    saleId: "د پلورنې شمېره",
    customer: "پېرودونکی",
    employee: "کارکوونکی",
    date: "د پلورنې نېټه",
    amount: "ټوله اندازه",
    payment: "د تادیې حالت",
    status: "د ثبت حالت",
    dueDate: "د تادیې وروستۍ نېټه",
    notes: "یادښت",
    actions: "کړنې",
    active: "فعال",
    cancelled: "لغوه شوې",
    createTitle: "نوې پلورنه ثبتول",
    customerId: "د پېرودونکي پېژندشمېره",
    employeeId: "د کارکوونکي پېژندشمېره",
    currencyId: "د پیسو واحد پېژندشمېره",
    saleDate: "د پلورنې نېټه",
    discount: "تخفیف",
    tax: "مالیه",
    total: "ټوله اندازه",
    selectPayment: "د تادیې حالت وټاکئ",
    save: "پلورنه ثبتول",
    cancel: "لغوه",
    close: "تړل",
    enterNotes: "د پلورنې یادښت ولیکئ...",
    required: "مهرباني وکړئ اړین معلومات سم بشپړ کړئ.",
    noResults: "هیڅ پلورنه ونه موندل شوه",
    details: "جزئیات وګورئ",
    due: "پور",
    records: "پلورنې",
    customerLabel: "پېرودونکی",
    employeeLabel: "کارکوونکی"
  }
};

const initialSales = [
  {
    id: 1,
    customer_id: 1,
    employee_id: 2,
    sale_date: "2026-10-01T10:00",
    currency_id: 1,
    exchange_rate: 1,
    discount: 0,
    tax_amount: 0,
    total_amount: 42000,
    payment_status: "paid",
    status: "active",
    due_date: null,
    notes: "Cash sale",
    created_by: 2
  },
  {
    id: 2,
    customer_id: 2,
    employee_id: 2,
    sale_date: "2026-10-02T11:00",
    currency_id: 1,
    exchange_rate: 1,
    discount: 1000,
    tax_amount: 0,
    total_amount: 33000,
    payment_status: "partial",
    status: "active",
    due_date: "2026-10-20",
    notes: "Partly on credit",
    created_by: 2
  },
  {
    id: 3,
    customer_id: 3,
    employee_id: 5,
    sale_date: "2026-10-03T12:00",
    currency_id: 1,
    exchange_rate: 1,
    discount: 500,
    tax_amount: 0,
    total_amount: 12000,
    payment_status: "unpaid",
    status: "active",
    due_date: "2026-10-25",
    notes: "Wholesale sale",
    created_by: 5
  },
  {
    id: 4,
    customer_id: 4,
    employee_id: 5,
    sale_date: "2026-10-04T13:00",
    currency_id: 1,
    exchange_rate: 1,
    discount: 0,
    tax_amount: 0,
    total_amount: 24000,
    payment_status: "paid",
    status: "active",
    due_date: null,
    notes: "Paid in full",
    created_by: 5
  },
  {
    id: 5,
    customer_id: 5,
    employee_id: 2,
    sale_date: "2026-10-05T15:00",
    currency_id: 1,
    exchange_rate: 1,
    discount: 0,
    tax_amount: 0,
    total_amount: 6000,
    payment_status: "partial",
    status: "active",
    due_date: "2026-10-18",
    notes: "Balance due",
    created_by: 2
  }
];

const Sale = () => {
  const language = localStorage.getItem("language") || "en";
  const t = translations[language] || translations.en;
  const rtl = ["fa", "ps"].includes(language);

  const [sales, setSales] = useState(initialSales);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customer_id: "",
    employee_id: "",
    sale_date: new Date().toISOString().slice(0, 16),
    currency_id: "1",
    discount: "0",
    tax_amount: "0",
    total_amount: "",
    payment_status: "unpaid",
    due_date: "",
    notes: ""
  });

  const money = (value) =>
    new Intl.NumberFormat(language === "en" ? "en-US" : "fa-IR").format(
      Number(value || 0)
    );

  const dateFormat = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString(
      language === "en" ? "en-US" : language === "ps" ? "ps-AF" : "fa-IR"
    );
  };

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        String(sale.id).includes(searchText) ||
        `customer #${sale.customer_id}`.toLowerCase().includes(searchText) ||
        `employee #${sale.employee_id}`.toLowerCase().includes(searchText) ||
        (sale.notes || "").toLowerCase().includes(searchText);

      const matchesPayment =
        paymentFilter === "all" ||
        sale.payment_status === paymentFilter;

      const matchesStatus =
        statusFilter === "all" || sale.status === statusFilter;

      return matchesSearch && matchesPayment && matchesStatus;
    });
  }, [sales, search, paymentFilter, statusFilter]);

  const totalRevenue = sales
    .filter((sale) => sale.status === "active")
    .reduce((sum, sale) => sum + Number(sale.total_amount), 0);

  const stats = [
    {
      label: t.totalSales,
      value: sales.length,
      icon: ShoppingCart,
      color: "blue"
    },
    {
      label: t.totalRevenue,
      value: money(totalRevenue),
      icon: CalendarDays,
      color: "violet"
    },
    {
      label: t.paid,
      value: sales.filter((s) => s.payment_status === "paid").length,
      icon: CheckCircle2,
      color: "emerald"
    },
    {
      label: t.unpaid,
      value: sales.filter((s) => s.payment_status === "unpaid").length,
      icon: AlertCircle,
      color: "rose"
    }
  ];

  const paymentStyles = {
    paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    partial: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    unpaid: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
  };

  const resetForm = () => {
    setForm({
      customer_id: "",
      employee_id: "",
      sale_date: new Date().toISOString().slice(0, 16),
      currency_id: "1",
      discount: "0",
      tax_amount: "0",
      total_amount: "",
      payment_status: "unpaid",
      due_date: "",
      notes: ""
    });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const total = Number(form.total_amount);
    const discount = Number(form.discount);
    const tax = Number(form.tax_amount);

    if (
      !form.customer_id ||
      !form.employee_id ||
      !form.sale_date ||
      !form.currency_id ||
      !Number.isFinite(total) ||
      total < 0 ||
      !Number.isFinite(discount) ||
      discount < 0 ||
      !Number.isFinite(tax) ||
      tax < 0
    ) {
      setError(t.required);
      return;
    }

    const newSale = {
      id: Math.max(0, ...sales.map((s) => s.id)) + 1,
      customer_id: Number(form.customer_id),
      employee_id: Number(form.employee_id),
      sale_date: form.sale_date,
      currency_id: Number(form.currency_id),
      exchange_rate: 1,
      discount,
      tax_amount: tax,
      total_amount: total,
      payment_status: form.payment_status,
      status: "active",
      due_date: form.due_date || null,
      notes: form.notes,
      created_by: Number(form.employee_id)
    };

    setSales((prev) => [newSale, ...prev]);
    setShowModal(false);
    resetForm();
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t.subtitle}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          {t.newSale}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = {
            blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
            violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
            emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
            rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
          };

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${colors[stat.color]}`}>
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search
              size={18}
              className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
                rtl ? "right-3" : "left-3"
              }`}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.search}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white ${
                rtl ? "pr-10 pl-3" : "pl-10 pr-3"
              }`}
            />
          </div>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="all">{t.allPayments}</option>
            <option value="paid">{t.paid}</option>
            <option value="partial">{t.partial}</option>
            <option value="unpaid">{t.unpaid}</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="all">{t.allRecords}</option>
            <option value="active">{t.active}</option>
            <option value="cancelled">{t.cancelled}</option>
          </select>
        </div>
      </div>

      {/* Sales Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800">
          <h2 className="font-semibold text-slate-800 dark:text-white">
            {t.title}
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {filteredSales.length} {t.records}
          </span>
        </div>

        {filteredSales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <ShoppingCart size={38} />
            <p className="mt-3 text-sm">{t.noResults}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                  <tr>
                    {[
                      t.saleId,
                      t.customer,
                      t.employee,
                      t.date,
                      t.amount,
                      t.payment,
                      t.status,
                      t.actions
                    ].map((heading) => (
                      <th key={heading} className="whitespace-nowrap px-4 py-3 text-start font-medium">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-4 font-semibold text-slate-800 dark:text-white">
                        #{sale.id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-300">
                        Customer #{sale.customer_id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-300">
                        Employee #{sale.employee_id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-500 dark:text-slate-400">
                        {dateFormat(sale.sale_date)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-800 dark:text-white">
                        {money(sale.total_amount)}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${paymentStyles[sale.payment_status]}`}>
                          {t[sale.payment_status]}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                          sale.status === "active"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                        }`}>
                          {t[sale.status]}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setSelectedSale(sale)}
                          title={t.details}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile and Tablet Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSales.map((sale) => (
                <div key={sale.id} className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-slate-800 dark:text-white">
                      #{sale.id}
                    </span>
                    <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${paymentStyles[sale.payment_status]}`}>
                      {t[sale.payment_status]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">{t.customer}</p>
                      <p className="mt-1 text-slate-700 dark:text-slate-200">
                        Customer #{sale.customer_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{t.employee}</p>
                      <p className="mt-1 text-slate-700 dark:text-slate-200">
                        Employee #{sale.employee_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{t.date}</p>
                      <p className="mt-1 text-slate-700 dark:text-slate-200">
                        {dateFormat(sale.sale_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{t.amount}</p>
                      <p className="mt-1 font-bold text-slate-800 dark:text-white">
                        {money(sale.total_amount)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSale(sale)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400"
                  >
                    <Eye size={16} />
                    {t.details}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* New Sale Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {t.createTitle}
              </h2>
              <button onClick={closeModal} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ["customer_id", t.customerId, "number"],
                  ["employee_id", t.employeeId, "number"],
                  ["currency_id", t.currencyId, "number"],
                  ["sale_date", t.saleDate, "datetime-local"],
                  ["discount", t.discount, "number"],
                  ["tax_amount", t.tax, "number"],
                  ["total_amount", t.total, "number"],
                  ["due_date", t.dueDate, "date"]
                ].map(([name, label, type]) => (
                  <div key={name}>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {label}
                    </label>
                    <input
                      type={type}
                      min={type === "number" ? "0" : undefined}
                      step={type === "number" ? "0.01" : undefined}
                      required={["customer_id", "employee_id", "currency_id", "sale_date", "total_amount"].includes(name)}
                      value={form[name]}
                      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                ))}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.payment}
                  </label>
                  <select
                    value={form.payment_status}
                    onChange={(e) => setForm({ ...form, payment_status: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="unpaid">{t.unpaid}</option>
                    <option value="partial">{t.partial}</option>
                    <option value="paid">{t.paid}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.notes}
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder={t.enterNotes}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {error && <p className="text-sm text-rose-600">{error}</p>}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sale Details Modal */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {t.details} #{selectedSale.id}
              </h2>
              <button
                onClick={() => setSelectedSale(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                [t.customer, `Customer #${selectedSale.customer_id}`],
                [t.employee, `Employee #${selectedSale.employee_id}`],
                [t.date, dateFormat(selectedSale.sale_date)],
                [t.amount, money(selectedSale.total_amount)],
                [t.discount, money(selectedSale.discount)],
                [t.tax, money(selectedSale.tax_amount)],
                [t.payment, t[selectedSale.payment_status]],
                [t.status, t[selectedSale.status]],
                [t.dueDate, dateFormat(selectedSale.due_date)]
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-1 font-semibold text-slate-800 dark:text-white">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {selectedSale.notes && (
              <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-xs text-slate-400">{t.notes}</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                  {selectedSale.notes}
                </p>
              </div>
            )}

            <button
              onClick={() => setSelectedSale(null)}
              className="mt-5 w-full rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sale;
