
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  X,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  Eye,
  CalendarDays,
  Pencil,
  Trash2,
  RefreshCw,
  Clock
} from "lucide-react";

import {
  getSales,
  createSale,
  updateSale,
  deleteSale
} from "../services/sales/saleService";

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
    discount: "Discount",
    payment: "Payment Status",
    status: "Record Status",
    dueDate: "Due Date",
    notes: "Notes",
    actions: "Actions",
    active: "Active",
    cancelled: "Cancelled",
    createTitle: "Create New Sale",
    editTitle: "Edit Sale",
    customerId: "Customer ID",
    employeeId: "Employee ID",
    currencyId: "Currency ID",
    saleDate: "Sale Date",
    tax: "Tax Amount",
    selectPayment: "Select Payment Status",
    save: "Save Sale",
    update: "Update Sale",
    cancel: "Cancel",
    close: "Close",
    enterNotes: "Enter sale notes...",
    required: "Please fill in the required fields correctly.",
    noResults: "No sales found",
    details: "View Details",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this sale?",
    loading: "Loading sales...",
    saving: "Saving...",
    deleting: "Deleting...",
    loadError: "Failed to load sales.",
    saveError: "Failed to save sale.",
    deleteError: "Failed to delete sale.",
    records: "sales",
    retry: "Try Again",
    saleCreated: "Sale created successfully.",
    saleUpdated: "Sale updated successfully.",
    saleDeleted: "Sale deleted successfully.",
    customerLabel: "Customer",
    employeeLabel: "Employee",
    due: "Due",
    noNotes: "No notes"
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
    discount: "تخفیف",
    payment: "وضعیت پرداخت",
    status: "وضعیت ثبت",
    dueDate: "تاریخ سررسید",
    notes: "یادداشت",
    actions: "عملیات",
    active: "فعال",
    cancelled: "لغو شده",
    createTitle: "ثبت فروش جدید",
    editTitle: "ویرایش فروش",
    customerId: "شناسه مشتری",
    employeeId: "شناسه کارمند",
    currencyId: "شناسه واحد پول",
    saleDate: "تاریخ فروش",
    tax: "مقدار مالیه",
    selectPayment: "انتخاب وضعیت پرداخت",
    save: "ثبت فروش",
    update: "ذخیره تغییرات",
    cancel: "لغو",
    close: "بستن",
    enterNotes: "یادداشت فروش را وارد کنید...",
    required: "لطفاً خانه‌های ضروری را درست تکمیل کنید.",
    noResults: "هیچ فروشی پیدا نشد",
    details: "مشاهده جزئیات",
    edit: "ویرایش",
    delete: "حذف",
    confirmDelete: "آیا مطمئن هستید که می‌خواهید این فروش را حذف کنید؟",
    loading: "در حال دریافت فروشات...",
    saving: "در حال ذخیره...",
    deleting: "در حال حذف...",
    loadError: "دریافت فروشات ناموفق بود.",
    saveError: "ثبت فروش ناموفق بود.",
    deleteError: "حذف فروش ناموفق بود.",
    records: "فروش",
    retry: "تلاش دوباره",
    saleCreated: "فروش با موفقیت ثبت شد.",
    saleUpdated: "فروش با موفقیت ویرایش شد.",
    saleDeleted: "فروش با موفقیت حذف شد.",
    customerLabel: "مشتری",
    employeeLabel: "کارمند",
    due: "بدهی",
    noNotes: "بدون یادداشت"
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
    discount: "تخفیف",
    payment: "د تادیې حالت",
    status: "د ثبت حالت",
    dueDate: "د تادیې وروستۍ نېټه",
    notes: "یادښت",
    actions: "کړنې",
    active: "فعال",
    cancelled: "لغوه شوې",
    createTitle: "نوې پلورنه ثبتول",
    editTitle: "پلورنه سمول",
    customerId: "د پېرودونکي پېژندشمېره",
    employeeId: "د کارکوونکي پېژندشمېره",
    currencyId: "د پیسو واحد پېژندشمېره",
    saleDate: "د پلورنې نېټه",
    tax: "مالیه",
    selectPayment: "د تادیې حالت وټاکئ",
    save: "پلورنه ثبتول",
    update: "بدلونونه ثبتول",
    cancel: "لغوه",
    close: "تړل",
    enterNotes: "د پلورنې یادښت ولیکئ...",
    required: "مهرباني وکړئ اړین معلومات سم بشپړ کړئ.",
    noResults: "هیڅ پلورنه ونه موندل شوه",
    details: "جزئیات وګورئ",
    edit: "سمون",
    delete: "ړنګول",
    confirmDelete: "ایا ډاډه یاست چې دا پلورنه ړنګول غواړئ؟",
    loading: "پلورنې ترلاسه کېږي...",
    saving: "ثبت کېږي...",
    deleting: "ړنګېږي...",
    loadError: "د پلورنو ترلاسه کول ناکام شول.",
    saveError: "د پلورنې ثبت ناکام شو.",
    deleteError: "د پلورنې ړنګول ناکام شول.",
    records: "پلورنې",
    retry: "بیا هڅه",
    saleCreated: "پلورنه په بریالیتوب ثبت شوه.",
    saleUpdated: "پلورنه په بریالیتوب سمه شوه.",
    saleDeleted: "پلورنه په بریالیتوب ړنګه شوه.",
    customerLabel: "پېرودونکی",
    employeeLabel: "کارکوونکی",
    due: "پور",
    noNotes: "یادښت نشته"
  }
};

const getLocalDateTime = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const toDateTimeInput = (value) => {
  if (!value) return getLocalDateTime();

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return getLocalDateTime();

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const getErrorMessage = (error, fallback) => {
  return error.response?.data?.message ||
    error.response?.data?.error ||
    fallback;
};

const Sale = () => {
  const language = localStorage.getItem("language") || "en";
  const t = translations[language] || translations.en;
  const rtl = ["fa", "ps"].includes(language);

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [editingSale, setEditingSale] = useState(null);

  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    customer_id: "",
    employee_id: "",
    sale_date: getLocalDateTime(),
    currency_id: "1",
    exchange_rate: "1",
    tax_amount: "0",
    payment_status: "unpaid",
    status: "active",
    due_date: "",
    notes: ""
  });

  const money = (value) =>
    new Intl.NumberFormat(
      language === "en" ? "en-US" : language === "ps" ? "ps-AF" : "fa-IR"
    ).format(Number(value || 0));

  const dateFormat = (value) => {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString(
      language === "en" ? "en-US" : language === "ps" ? "ps-AF" : "fa-IR"
    );
  };

  const fetchSales = async () => {
    try {
      setLoading(true);
      setApiError("");

      const data = await getSales();
      setSales(Array.isArray(data) ? data : data.sales || []);
    } catch (err) {
      console.error("Failed to fetch sales:", err);
      setApiError(getErrorMessage(err, t.loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

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
        statusFilter === "all" ||
        sale.status === statusFilter;

      return matchesSearch && matchesPayment && matchesStatus;
    });
  }, [sales, search, paymentFilter, statusFilter]);

  const totalRevenue = sales
    .filter((sale) => sale.status === "active")
    .reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0);

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
      value: sales.filter((sale) => sale.payment_status === "paid").length,
      icon: CheckCircle2,
      color: "emerald"
    },
    {
      label: t.unpaid,
      value: sales.filter((sale) => sale.payment_status === "unpaid").length,
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
      sale_date: getLocalDateTime(),
      currency_id: "1",
      exchange_rate: "1",
      tax_amount: "0",
      payment_status: "unpaid",
      status: "active",
      due_date: "",
      notes: ""
    });

    setError("");
    setEditingSale(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (sale) => {
    setEditingSale(sale);

    setForm({
      customer_id: String(sale.customer_id ?? ""),
      employee_id: String(sale.employee_id ?? ""),
      sale_date: toDateTimeInput(sale.sale_date),
      currency_id: String(sale.currency_id ?? "1"),
      exchange_rate: String(sale.exchange_rate ?? "1"),
      tax_amount: String(sale.tax_amount ?? "0"),
      payment_status: sale.payment_status || "unpaid",
      status: sale.status || "active",
      due_date: sale.due_date
        ? String(sale.due_date).slice(0, 10)
        : "",
      notes: sale.notes || ""
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const customerId = Number(form.customer_id);
    const employeeId = Number(form.employee_id);
    const currencyId = Number(form.currency_id);
    const exchangeRate = Number(form.exchange_rate);
    const tax = Number(form.tax_amount);

    if (
      !form.customer_id ||
      !form.employee_id ||
      !form.sale_date ||
      !form.currency_id ||
      !Number.isInteger(customerId) ||
      customerId <= 0 ||
      !Number.isInteger(employeeId) ||
      employeeId <= 0 ||
      !Number.isInteger(currencyId) ||
      currencyId <= 0 ||
      !Number.isFinite(exchangeRate) ||
      exchangeRate <= 0 ||
      !Number.isFinite(tax) ||
      tax < 0
    ) {
      setError(t.required);
      return;
    }

    const saleData = {
      customer_id: customerId,
      employee_id: employeeId,
      sale_date: form.sale_date,
      currency_id: currencyId,
      exchange_rate: exchangeRate,
      tax_amount: tax,
      payment_status: form.payment_status,
      status: form.status,
      due_date: form.due_date || null,
      notes: form.notes.trim() || null
    };

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingSale) {
        await updateSale(editingSale.id, saleData);
        setSuccess(t.saleUpdated);
      } else {
        await createSale(saleData);
        setSuccess(t.saleCreated);
      }

      await fetchSales();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Failed to save sale:", err);
      setError(getErrorMessage(err, t.saveError));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sale) => {
    const confirmed = window.confirm(
      `${t.confirmDelete} (#${sale.id})`
    );

    if (!confirmed) return;

    try {
      setDeletingId(sale.id);
      setApiError("");
      setSuccess("");

      await deleteSale(sale.id);

      setSales((previous) =>
        previous.filter((item) => item.id !== sale.id)
      );

      if (selectedSale?.id === sale.id) {
        setSelectedSale(null);
      }

      setSuccess(t.saleDeleted);
    } catch (err) {
      console.error("Failed to delete sale:", err);
      setApiError(getErrorMessage(err, t.deleteError));
    } finally {
      setDeletingId(null);
    }
  };

  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
  };

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t.subtitle}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          {t.newSale}
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
          <span>{success}</span>
          <button onClick={() => setSuccess("")}>
            <X size={17} />
          </button>
        </div>
      )}

      {apiError && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
          <span>{apiError}</span>
          <button
            onClick={fetchSales}
            className="inline-flex items-center gap-2 font-semibold"
          >
            <RefreshCw size={15} />
            {t.retry}
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                    {stat.label}
                  </p>
                  <p className="mt-2 break-words text-xl font-bold text-slate-800 dark:text-white sm:text-2xl">
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
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
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
                rtl ? "pl-3 pr-10" : "pl-10 pr-3"
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

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-500 dark:text-slate-400">
            <RefreshCw size={19} className="animate-spin" />
            {t.loading}
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <ShoppingCart size={38} />
            <p className="mt-3 text-sm">{t.noResults}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                  <tr>
                    {[
                      t.saleId,
                      t.customer,
                      t.employee,
                      t.date,
                      t.amount,
                      t.discount,
                      t.payment,
                      t.status,
                      t.actions
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap px-4 py-3 text-start font-medium"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSales.map((sale) => (
                    <tr
                      key={sale.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-800 dark:text-white">
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

                      <td className="whitespace-nowrap px-4 py-4 font-medium text-rose-600 dark:text-rose-400">
                        {money(sale.discount)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                            paymentStyles[sale.payment_status] || ""
                          }`}
                        >
                          {t[sale.payment_status] || sale.payment_status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                            sale.status === "active"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                          }`}
                        >
                          {t[sale.status] || sale.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedSale(sale)}
                            title={t.details}
                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            onClick={() => openEditModal(sale)}
                            title={t.edit}
                            className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => handleDelete(sale)}
                            disabled={deletingId === sale.id}
                            title={t.delete}
                            className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                          >
                            {deletingId === sale.id ? (
                              <RefreshCw size={17} className="animate-spin" />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile and Tablet Cards */}
            <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800 md:grid-cols-2 lg:hidden">
              {filteredSales.map((sale) => (
                <div key={sale.id} className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-slate-800 dark:text-white">
                      #{sale.id}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        paymentStyles[sale.payment_status] || ""
                      }`}
                    >
                      {t[sale.payment_status] || sale.payment_status}
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

                    <div>
                      <p className="text-xs text-slate-400">{t.discount}</p>
                      <p className="mt-1 font-semibold text-rose-600 dark:text-rose-400">
                        {money(sale.discount)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">{t.status}</p>
                      <p className="mt-1 text-slate-700 dark:text-slate-200">
                        {t[sale.status] || sale.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => setSelectedSale(sale)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                    >
                      <Eye size={15} />
                      {t.details}
                    </button>

                    <button
                      onClick={() => openEditModal(sale)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                    >
                      <Pencil size={15} />
                      {t.edit}
                    </button>

                    <button
                      onClick={() => handleDelete(sale)}
                      disabled={deletingId === sale.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 disabled:opacity-50 dark:bg-rose-500/10 dark:text-rose-400"
                    >
                      <Trash2 size={15} />
                      {deletingId === sale.id ? t.deleting : t.delete}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create / Edit Sale Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {editingSale ? t.editTitle : t.createTitle}
              </h2>

              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ["customer_id", t.customerId, "number"],
                  ["employee_id", t.employeeId, "number"],
                  ["currency_id", t.currencyId, "number"],
                  ["sale_date", t.saleDate, "datetime-local"],
                  ["exchange_rate", "Exchange Rate", "number"],
                  ["tax_amount", t.tax, "number"],
                  ["due_date", t.dueDate, "date"]
                ].map(([name, label, type]) => (
                  <div key={name}>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {label}
                    </label>

                    <input
                      type={type}
                      min={type === "number" ? (name === "customer_id" || name === "employee_id" || name === "currency_id" ? "1" : "0") : undefined}
                      step={type === "number" ? "0.01" : undefined}
                      required={[
                        "customer_id",
                        "employee_id",
                        "currency_id",
                        "sale_date",
                        "exchange_rate"
                      ].includes(name)}
                      value={form[name]}
                      onChange={(e) =>
                        setForm((previous) => ({
                          ...previous,
                          [name]: e.target.value
                        }))
                      }
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
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        payment_status: e.target.value
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="unpaid">{t.unpaid}</option>
                    <option value="partial">{t.partial}</option>
                    <option value="paid">{t.paid}</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.status}
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        status: e.target.value
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="active">{t.active}</option>
                    <option value="cancelled">{t.cancelled}</option>
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
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      notes: e.target.value
                    }))
                  }
                  placeholder={t.enterNotes}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === "fa"
                  ? "مبلغ نهایی و تخفیف پس از ثبت جزئیات فروش به‌صورت خودکار محاسبه می‌شوند."
                  : language === "ps"
                    ? "وروستۍ اندازه او تخفیف د پلورنې د جزئیاتو له ثبت وروسته په اتومات ډول محاسبه کېږي."
                    : "Total amount and discount are calculated automatically from sale details."}
              </p>

              {error && (
                <p className="text-sm text-rose-600 dark:text-rose-400">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
                >
                  {t.cancel}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && <RefreshCw size={16} className="animate-spin" />}
                  {saving ? t.saving : editingSale ? t.update : t.save}
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
            <div className="mb-5 flex items-center justify-between gap-3">
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
                [t.payment, t[selectedSale.payment_status] || selectedSale.payment_status],
                [t.status, t[selectedSale.status] || selectedSale.status],
                [t.dueDate, dateFormat(selectedSale.due_date)]
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800"
                >
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-1 break-words font-semibold text-slate-800 dark:text-white">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-xs text-slate-400">{t.notes}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">
                {selectedSale.notes || t.noNotes}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => {
                  setSelectedSale(null);
                  openEditModal(selectedSale);
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                <Pencil size={16} />
                {t.edit}
              </button>

              <button
                onClick={() => setSelectedSale(null)}
                className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sale;
