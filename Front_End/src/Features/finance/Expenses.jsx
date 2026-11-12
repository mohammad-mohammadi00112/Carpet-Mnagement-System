
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Plus, Search, Pencil, Trash2, X, Wallet,
  TrendingDown, CalendarDays, Receipt,
  Filter, ChevronLeft, ChevronRight, ArrowDownUp,
  RefreshCw
} from "lucide-react";

import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense
} from "../services/finance/expenseService";

const translations = {
  en: {
    title: "Expense Management",
    subtitle: "Manage and track your business expenses",
    add: "Add Expense",
    total: "Total Expenses",
    month: "This Month",
    records: "Total Records",
    categories: "Categories",
    search: "Search expenses...",
    allCategories: "All Categories",
    allCurrencies: "All Currencies",
    from: "From Date",
    to: "To Date",
    date: "Date",
    category: "Category",
    amount: "Amount",
    currency: "Currency",
    rate: "Exchange Rate",
    baseAmount: "Amount in AFN",
    description: "Description",
    createdBy: "Created By",
    actions: "Actions",
    addTitle: "Add New Expense",
    editTitle: "Edit Expense",
    selectCategory: "Select Category",
    selectCurrency: "Select Currency",
    enterAmount: "Enter amount",
    enterRate: "Enter exchange rate",
    enterDescription: "Enter expense description",
    save: "Save Expense",
    update: "Update Expense",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    confirmDelete: "Are you sure you want to delete this expense?",
    required: "Please fill in all required fields.",
    noExpenses: "No expenses found",
    noExpensesDesc: "Start by adding your first expense.",
    showing: "Showing",
    of: "of",
    previous: "Previous",
    next: "Next",
    clear: "Clear Filters",
    today: "Today",
    rent: "Rent",
    transport: "Transport",
    salary: "Salary",
    utilities: "Utilities",
    repair: "Repair",
    expenseSaved: "Expense added successfully",
    expenseUpdated: "Expense updated successfully",
    expenseDeleted: "Expense deleted successfully",
    totalFiltered: "Filtered Total",
    close: "Close",
    expenseDetails: "Expense Details",
    dateRequired: "Expense date is required",
    invalidRate: "Exchange rate must be greater than zero",
    noDescription: "No description",
    allTime: "All Time",
    loading: "Loading expenses...",
    loadError: "Failed to load expenses",
    saveError: "Failed to save expense",
    deleteError: "Failed to delete expense",
  },

  fa: {
    title: "مدیریت مصارف",
    subtitle: "مدیریت و پیگیری مصارف تجارت شما",
    add: "ثبت مصرف جدید",
    total: "مجموع مصارف",
    month: "مصارف این ماه",
    records: "تعداد مصارف",
    categories: "دسته‌بندی‌ها",
    search: "جستجوی مصارف...",
    allCategories: "تمام دسته‌بندی‌ها",
    allCurrencies: "تمام ارزها",
    from: "از تاریخ",
    to: "تا تاریخ",
    date: "تاریخ",
    category: "دسته‌بندی",
    amount: "مبلغ",
    currency: "واحد پول",
    rate: "نرخ تبادله",
    baseAmount: "مبلغ به افغانی",
    description: "توضیحات",
    createdBy: "ثبت‌کننده",
    actions: "عملیات",
    addTitle: "ثبت مصرف جدید",
    editTitle: "ویرایش مصرف",
    selectCategory: "انتخاب دسته‌بندی",
    selectCurrency: "انتخاب ارز",
    enterAmount: "مبلغ را وارد کنید",
    enterRate: "نرخ تبادله را وارد کنید",
    enterDescription: "توضیحات مصرف را وارد کنید",
    save: "ذخیره مصرف",
    update: "به‌روزرسانی مصرف",
    cancel: "لغو",
    delete: "حذف",
    edit: "ویرایش",
    confirmDelete: "آیا مطمئن هستید که این مصرف حذف شود؟",
    required: "لطفاً تمام فیلدهای ضروری را تکمیل کنید.",
    noExpenses: "مصرفی یافت نشد",
    noExpensesDesc: "با ثبت اولین مصرف خود شروع کنید.",
    showing: "نمایش",
    of: "از",
    previous: "قبلی",
    next: "بعدی",
    clear: "پاک کردن فیلترها",
    today: "امروز",
    rent: "کرایه",
    transport: "انتقالات",
    salary: "معاش",
    utilities: "برق و آب",
    repair: "ترمیمات",
    expenseSaved: "مصرف موفقانه ثبت شد",
    expenseUpdated: "مصرف موفقانه ویرایش شد",
    expenseDeleted: "مصرف موفقانه حذف شد",
    totalFiltered: "مجموع نتایج",
    close: "بستن",
    expenseDetails: "جزئیات مصرف",
    dateRequired: "تاریخ مصرف ضروری است",
    invalidRate: "نرخ تبادله باید بیشتر از صفر باشد",
    noDescription: "بدون توضیحات",
    allTime: "تمام مدت",
    loading: "در حال دریافت مصارف...",
    loadError: "دریافت مصارف ناموفق بود",
    saveError: "ذخیره مصرف ناموفق بود",
    deleteError: "حذف مصرف ناموفق بود",
  },

  ps: {
    title: "د لګښتونو مدیریت",
    subtitle: "د خپلې سوداګرۍ لګښتونه اداره او تعقیب کړئ",
    add: "نوی لګښت ثبت کړئ",
    total: "ټول لګښتونه",
    month: "د دې میاشتې لګښتونه",
    records: "د لګښتونو شمېر",
    categories: "کټګورۍ",
    search: "لګښتونه ولټوئ...",
    allCategories: "ټولې کټګورۍ",
    allCurrencies: "ټولې پیسې",
    from: "له نېټې",
    to: "تر نېټې",
    date: "نېټه",
    category: "کټګوري",
    amount: "اندازه",
    currency: "پیسې",
    rate: "د تبادلې نرخ",
    baseAmount: "په افغانیو کې اندازه",
    description: "تشریح",
    createdBy: "ثبت کوونکی",
    actions: "کړنې",
    addTitle: "نوی لګښت ثبتول",
    editTitle: "لګښت سمول",
    selectCategory: "کټګوري وټاکئ",
    selectCurrency: "پیسې وټاکئ",
    enterAmount: "اندازه ولیکئ",
    enterRate: "د تبادلې نرخ ولیکئ",
    enterDescription: "د لګښت تشریح ولیکئ",
    save: "لګښت ثبت کړئ",
    update: "لګښت تازه کړئ",
    cancel: "لغوه",
    delete: "ړنګول",
    edit: "سمول",
    confirmDelete: "ایا ډاډه یاست چې دا لګښت ړنګ کړئ؟",
    required: "مهرباني وکړئ اړین معلومات بشپړ کړئ.",
    noExpenses: "هیڅ لګښت ونه موندل شو",
    noExpensesDesc: "د خپل لومړي لګښت په ثبتولو پیل وکړئ.",
    showing: "ښودل",
    of: "له",
    previous: "مخکینی",
    next: "راتلونکی",
    clear: "فلټرونه پاک کړئ",
    today: "نن",
    rent: "کرایه",
    transport: "ترانسپورت",
    salary: "معاش",
    utilities: "برېښنا او اوبه",
    repair: "ترمیم",
    expenseSaved: "لګښت په بریالیتوب ثبت شو",
    expenseUpdated: "لګښت په بریالیتوب تازه شو",
    expenseDeleted: "لګښت په بریالیتوب ړنګ شو",
    totalFiltered: "د پایلو مجموعه",
    close: "بندول",
    expenseDetails: "د لګښت جزئیات",
    dateRequired: "د لګښت نېټه اړینه ده",
    invalidRate: "د تبادلې نرخ باید له صفر څخه لوړ وي",
    noDescription: "تشریح نشته",
    loading: "لګښتونه ترلاسه کېږي...",
    loadError: "د لګښتونو ترلاسه کول ناکام شول",
    saveError: "د لګښت ثبتول ناکام شول",
    deleteError: "د لګښت ړنګول ناکام شول",
  },
};

const categories = [
  { id: 1, name: "Rent" },
  { id: 2, name: "Transport" },
  { id: 3, name: "Salary" },
  { id: 4, name: "Utilities" },
  { id: 5, name: "Repair" },
];

const currencies = [
  { id: 1, code: "AFN" },
  { id: 2, code: "EUR" },
];

const initialForm = {
  category_id: "",
  expense_date: new Date().toISOString().slice(0, 10),
  amount: "",
  currency_id: "1",
  exchange_rate: "1",
  description: "",
};

const formatMoney = (value, currency = "AFN") =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(Number(value) || 0) + " " + currency;

export default function Expense() {
  const { i18n } = useTranslation();

  const language =
    i18n.resolvedLanguage?.split("-")[0] ||
    i18n.language?.split("-")[0] ||
    "en";

  const t = translations[language] || translations.en;
  const isRTL = ["fa", "ps"].includes(language);

  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const pageSize = 6;

  // Load expenses from Backend
  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(Array.isArray(data) ? data : []);
      setError("");
    } catch (error) {
      console.error("Failed to load expenses:", error);
      setError(error.response?.data?.message || t.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const getCategoryName = (id) => {
    const category = categories.find(
      (item) => item.id === Number(id)
    );

    if (!category) return "-";

    const key = category.name.toLowerCase();
    return t[key] || category.name;
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const query = search.toLowerCase();

      const matchesSearch =
        (expense.description || "").toLowerCase().includes(query) ||
        getCategoryName(expense.category_id).toLowerCase().includes(query);

      const matchesCategory =
        !categoryFilter ||
        Number(expense.category_id) === Number(categoryFilter);

      const matchesCurrency =
        !currencyFilter ||
        Number(expense.currency_id) === Number(currencyFilter);

      const expenseDate = String(expense.expense_date).slice(0, 10);

      const matchesFrom =
        !fromDate || expenseDate >= fromDate;

      const matchesTo =
        !toDate || expenseDate <= toDate;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesCurrency &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [
    expenses,
    search,
    categoryFilter,
    currencyFilter,
    fromDate,
    toDate,
    language,
  ]);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const totalAFN = expenses.reduce(
    (sum, item) =>
      sum + Number(item.amount) * Number(item.exchange_rate),
    0
  );

  const monthlyTotal = expenses
    .filter((item) =>
      String(item.expense_date).startsWith(currentMonth)
    )
    .reduce(
      (sum, item) =>
        sum + Number(item.amount) * Number(item.exchange_rate),
      0
    );

  const filteredTotal = filteredExpenses.reduce(
    (sum, item) =>
      sum + Number(item.amount) * Number(item.exchange_rate),
    0
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredExpenses.length / pageSize)
  );

  const paginatedExpenses = filteredExpenses.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const convertedAmount =
    Number(form.amount || 0) * Number(form.exchange_rate || 0);

  const showMessage = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const openAddModal = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (expense) => {
    setForm({
      category_id: String(expense.category_id),
      expense_date: String(expense.expense_date).slice(0, 10),
      amount: String(expense.amount),
      currency_id: String(expense.currency_id),
      exchange_rate: String(expense.exchange_rate),
      description: expense.description || "",
    });

    setEditingId(expense.id);
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(initialForm);
    setError("");
  };

  const handleCurrencyChange = (value) => {
    setForm((prev) => ({
      ...prev,
      currency_id: value,
      exchange_rate:
        value === "1"
          ? "1"
          : prev.exchange_rate === "1"
            ? ""
            : prev.exchange_rate,
    }));
  };

  // Save expense through Backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.category_id ||
      !form.expense_date ||
      !form.amount ||
      !form.currency_id
    ) {
      setError(t.required);
      return;
    }

    if (Number(form.amount) <= 0) {
      setError(t.required);
      return;
    }

    if (
      Number(form.exchange_rate) <= 0 ||
      !Number.isFinite(Number(form.exchange_rate))
    ) {
      setError(t.invalidRate);
      return;
    }

    const expenseData = {
      category_id: Number(form.category_id),
      expense_date: form.expense_date,
      amount: Number(form.amount),
      currency_id: Number(form.currency_id),
      exchange_rate: Number(form.exchange_rate),
      description: form.description.trim(),
      created_by: 1,
    };

    try {
      setSaving(true);
      setError("");

      if (editingId !== null) {
        await updateExpense(editingId, expenseData);
        showMessage(t.expenseUpdated);
      } else {
        await createExpense(expenseData);
        showMessage(t.expenseSaved);
      }

      await loadExpenses();
      setPage(1);
      closeModal();
    } catch (error) {
      console.error("Expense save error:", error);
      setError(error.response?.data?.message || t.saveError);
    } finally {
      setSaving(false);
    }
  };

  // Delete expense through Backend
  const handleDelete = async (id) => {
    if (!window.confirm(t.confirmDelete)) return;

    try {
      await deleteExpense(id);
      await loadExpenses();
      showMessage(t.expenseDeleted);
    } catch (error) {
      console.error("Expense delete error:", error);
      setError(error.response?.data?.message || t.deleteError);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setCurrencyFilter("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const changePage = (newPage) => {
    setPage(Math.min(Math.max(1, newPage), totalPages));
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

  const stats = [
    {
      label: t.total,
      value: formatMoney(totalAFN),
      icon: Wallet,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    },
    {
      label: t.month,
      value: formatMoney(monthlyTotal),
      icon: TrendingDown,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    },
    {
      label: t.records,
      value: expenses.length,
      icon: Receipt,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    },
    {
      label: t.categories,
      value: categories.length,
      icon: CalendarDays,
      color: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    },
  ];

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen space-y-6 bg-gray-50 p-3 text-gray-900 dark:bg-gray-950 dark:text-white sm:p-5 lg:p-7"
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            {t.add}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={18} className="text-blue-600" />
          <h2 className="font-semibold">{t.expenseDetails}</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="relative xl:col-span-2">
            <Search
              size={17}
              className={`absolute top-3.5 text-gray-400 ${isRTL ? "right-3" : "left-3"}`}
            />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t.search}
              className={`${inputClass} ${isRTL ? "pr-10" : "pl-10"}`}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className={inputClass}
          >
            <option value="">{t.allCategories}</option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {getCategoryName(cat.id)}
              </option>
            ))}
          </select>

          <select
            value={currencyFilter}
            onChange={(e) => {
              setCurrencyFilter(e.target.value);
              setPage(1);
            }}
            className={inputClass}
          >
            <option value="">{t.allCurrencies}</option>

            {currencies.map((currency) => (
              <option key={currency.id} value={currency.id}>
                {currency.code}
              </option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RefreshCw size={15} />
            {t.clear}
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>{t.from}</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>{t.to}</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Filtered total */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-900/50 dark:bg-blue-500/5">
        <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
          {t.totalFiltered}
        </span>

        <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
          {formatMoney(filteredTotal)}
        </span>
      </div>

      {/* Loading and Error */}
      {loading && (
        <div className="rounded-xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <RefreshCw size={25} className="mx-auto mb-3 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">{t.loading}</p>
        </div>
      )}

      {!loading && error && !showModal && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-500/10 dark:text-red-400">
          <span>{error}</span>
          <button
            onClick={loadExpenses}
            className="font-semibold underline"
          >
            {t.clear}
          </button>
        </div>
      )}

      {/* Desktop Table */}
      {!loading && (
        <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                <tr>
                  {[t.date, t.category, t.amount, t.currency, t.rate, t.baseAmount, t.description, t.actions].map((heading) => (
                    <th key={heading} className="whitespace-nowrap px-4 py-4 text-start font-semibold">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedExpenses.map((expense) => {
                  const currency = currencies.find(
                    (item) => item.id === Number(expense.currency_id)
                  );

                  return (
                    <tr
                      key={expense.id}
                      className="transition hover:bg-gray-50/80 dark:hover:bg-gray-800/50"
                    >
                      <td className="whitespace-nowrap px-4 py-4">
                        {String(expense.expense_date).slice(0, 10)}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium dark:bg-gray-800">
                          {getCategoryName(expense.category_id)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-semibold">
                        {formatMoney(expense.amount, currency?.code)}
                      </td>

                      <td className="px-4 py-4">
                        {currency?.code || "-"}
                      </td>

                      <td className="px-4 py-4">
                        {expense.exchange_rate}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-blue-600 dark:text-blue-400">
                        {formatMoney(Number(expense.amount) * Number(expense.exchange_rate))}
                      </td>

                      <td className="max-w-[180px] truncate px-4 py-4 text-gray-500">
                        {expense.description || t.noDescription}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(expense)}
                            title={t.edit}
                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-500/10"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(expense.id)}
                            title={t.delete}
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredExpenses.length === 0 && (
            <div className="px-4 py-14 text-center">
              <Receipt size={35} className="mx-auto mb-3 text-gray-300" />
              <h3 className="font-semibold">{t.noExpenses}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {t.noExpensesDesc}
              </p>
            </div>
          )}

          {filteredExpenses.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-4 dark:border-gray-800 sm:flex-row">
              <p className="text-sm text-gray-500">
                {t.showing} {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filteredExpenses.length)} {t.of} {filteredExpenses.length}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => changePage(page - 1)}
                  className="rounded-lg border border-gray-200 p-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
                >
                  {isRTL ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
                </button>

                <span className="text-sm font-medium">
                  {page} / {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => changePage(page + 1)}
                  className="rounded-lg border border-gray-200 p-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
                >
                  {isRTL ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Cards */}
      {!loading && (
        <div className="space-y-3 md:hidden">
          {paginatedExpenses.map((expense) => {
            const currency = currencies.find(
              (item) => item.id === Number(expense.currency_id)
            );

            return (
              <div
                key={expense.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                      {getCategoryName(expense.category_id)}
                    </span>

                    <p className="mt-3 text-xs text-gray-500">
                      {String(expense.expense_date).slice(0, 10)}
                    </p>

                    <h3 className="mt-1 text-lg font-bold">
                      {formatMoney(expense.amount, currency?.code)}
                    </h3>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(expense)}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-3 text-sm dark:border-gray-800">
                  <div>
                    <p className="text-xs text-gray-500">{t.rate}</p>
                    <p className="mt-1 font-medium">
                      {expense.exchange_rate}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">{t.baseAmount}</p>
                    <p className="mt-1 font-semibold text-blue-600 dark:text-blue-400">
                      {formatMoney(Number(expense.amount) * Number(expense.exchange_rate))}
                    </p>
                  </div>
                </div>

                {expense.description && (
                  <p className="mt-3 border-t border-gray-100 pt-3 text-sm text-gray-500 dark:border-gray-800">
                    {expense.description}
                  </p>
                )}
              </div>
            );
          })}

          {filteredExpenses.length === 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-12 text-center dark:border-gray-800 dark:bg-gray-900">
              <Receipt size={35} className="mx-auto mb-3 text-gray-300" />
              <h3 className="font-semibold">{t.noExpenses}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {t.noExpensesDesc}
              </p>
            </div>
          )}

          {filteredExpenses.length > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
              <button
                disabled={page === 1}
                onClick={() => changePage(page - 1)}
                className="rounded-lg border border-gray-200 p-2 disabled:opacity-40 dark:border-gray-700"
              >
                {isRTL ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
              </button>

              <span className="text-sm font-medium">
                {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => changePage(page + 1)}
                className="rounded-lg border border-gray-200 p-2 disabled:opacity-40 dark:border-gray-700"
              >
                {isRTL ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800 sm:px-6">
              <h2 className="text-lg font-bold">
                {editingId ? t.editTitle : t.addTitle}
              </h2>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>{t.category} *</label>

                  <select
                    required
                    value={form.category_id}
                    onChange={(e) =>
                      setForm({ ...form, category_id: e.target.value })
                    }
                    className={inputClass}
                  >
                    <option value="">{t.selectCategory}</option>

                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {getCategoryName(cat.id)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>{t.date} *</label>

                  <input
                    required
                    type="date"
                    value={form.expense_date}
                    onChange={(e) =>
                      setForm({ ...form, expense_date: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>{t.amount} *</label>

                  <input
                    required
                    min="0.01"
                    step="0.01"
                    type="number"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    placeholder={t.enterAmount}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>{t.currency} *</label>

                  <select
                    required
                    value={form.currency_id}
                    onChange={(e) =>
                      handleCurrencyChange(e.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">{t.selectCurrency}</option>

                    {currencies.map((currency) => (
                      <option key={currency.id} value={currency.id}>
                        {currency.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>{t.rate} *</label>

                  <input
                    required
                    min="0.000001"
                    step="any"
                    type="number"
                    value={form.exchange_rate}
                    disabled={form.currency_id === "1"}
                    onChange={(e) =>
                      setForm({ ...form, exchange_rate: e.target.value })
                    }
                    placeholder={t.enterRate}
                    className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800`}
                  />
                </div>

                <div>
                  <label className={labelClass}>{t.baseAmount}</label>

                  <div className={`${inputClass} flex items-center justify-between bg-gray-50 dark:bg-gray-800`}>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {formatMoney(convertedAmount)}
                    </span>

                    <ArrowDownUp size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>{t.description}</label>

                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder={t.enterDescription}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {t.cancel}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? t.loading : editingId ? t.update : t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
