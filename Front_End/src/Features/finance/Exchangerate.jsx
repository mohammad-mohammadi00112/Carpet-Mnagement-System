

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  Plus,
  X,
  RefreshCw,
  CalendarDays,
  Coins,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  History,
  CircleDollarSign,
  CheckCircle2
} from "lucide-react";

const translations = {
  en: {
    title: "Exchange Rates",
    subtitle: "Manage currency exchange rates and view rate history.",
    addRate: "Add Exchange Rate",
    totalRecords: "Total Records",
    currencies: "Currencies",
    latestRate: "Latest Rate",
    search: "Search currency...",
    allCurrencies: "All Currencies",
    currency: "Currency",
    rate: "Rate to Base",
    date: "Rate Date",
    createdBy: "Created By",
    createdAt: "Created At",
    actions: "Actions",
    history: "Exchange Rate History",
    noRecords: "No exchange rates found.",
    addTitle: "Add New Exchange Rate",
    selectCurrency: "Select Currency",
    enterRate: "Enter exchange rate",
    selectDate: "Select date",
    cancel: "Cancel",
    save: "Save Rate",
    required: "Please complete all required fields.",
    success: "Exchange rate added successfully.",
    previous: "Previous",
    next: "Next",
    showing: "Showing",
    of: "of",
    records: "records",
    baseCurrency: "Base Currency",
    active: "Active",
    rateInfo: "1 unit of selected currency = this amount in base currency.",
    noCurrency: "No currencies available",
    today: "Today",
    clear: "Clear filters"
  },
  fa: {
    title: "نرخ تبادله ارز",
    subtitle: "مدیریت نرخ‌های تبادله و مشاهده تاریخچه نرخ ارزها.",
    addRate: "ثبت نرخ جدید",
    totalRecords: "مجموع ثبت‌ها",
    currencies: "تعداد ارزها",
    latestRate: "آخرین نرخ",
    search: "جستجوی ارز...",
    allCurrencies: "تمام ارزها",
    currency: "ارز",
    rate: "نرخ به ارز پایه",
    date: "تاریخ نرخ",
    createdBy: "ثبت‌کننده",
    createdAt: "تاریخ ثبت",
    actions: "عملیات",
    history: "تاریخچه نرخ تبادله",
    noRecords: "هیچ نرخ تبادله‌ای پیدا نشد.",
    addTitle: "ثبت نرخ تبادله جدید",
    selectCurrency: "انتخاب ارز",
    enterRate: "نرخ تبادله را وارد کنید",
    selectDate: "انتخاب تاریخ",
    cancel: "لغو",
    save: "ثبت نرخ",
    required: "لطفاً تمام فیلدهای ضروری را تکمیل کنید.",
    success: "نرخ تبادله با موفقیت ثبت شد.",
    previous: "قبلی",
    next: "بعدی",
    showing: "نمایش",
    of: "از",
    records: "ثبت",
    baseCurrency: "ارز پایه",
    active: "فعال",
    rateInfo: "یک واحد از ارز انتخاب‌شده برابر با این مقدار از ارز پایه است.",
    noCurrency: "هیچ ارزی موجود نیست",
    today: "امروز",
    clear: "پاک کردن فیلترها"
  },
  ps: {
    title: "د اسعارو د تبادلې نرخونه",
    subtitle: "د اسعارو د تبادلې نرخونه او تاریخچه مدیریت کړئ.",
    addRate: "نوی نرخ ثبت کړئ",
    totalRecords: "ټول ثبتونه",
    currencies: "د اسعارو شمېر",
    latestRate: "وروستی نرخ",
    search: "د اسعارو لټون...",
    allCurrencies: "ټول اسعار",
    currency: "اسعار",
    rate: "اساسي اسعارو ته نرخ",
    date: "د نرخ نېټه",
    createdBy: "ثبت کوونکی",
    createdAt: "د ثبت نېټه",
    actions: "کړنې",
    history: "د تبادلې نرخونو تاریخچه",
    noRecords: "د تبادلې نرخ ونه موندل شو.",
    addTitle: "د تبادلې نوی نرخ ثبتول",
    selectCurrency: "اسعار وټاکئ",
    enterRate: "د تبادلې نرخ ولیکئ",
    selectDate: "نېټه وټاکئ",
    cancel: "لغوه",
    save: "نرخ ثبت کړئ",
    required: "مهرباني وکړئ ټول اړین ځایونه ډک کړئ.",
    success: "د تبادلې نرخ په بریالیتوب ثبت شو.",
    previous: "مخکینی",
    next: "راتلونکی",
    showing: "ښودل",
    of: "له",
    records: "ثبتونو",
    baseCurrency: "اساسي اسعار",
    active: "فعال",
    rateInfo: "د ټاکل شوي اسعارو یوه واحده د اساسي اسعارو له دې مقدار سره برابره ده.",
    noCurrency: "هیڅ اسعار نشته",
    today: "نن",
    clear: "فلټرونه پاک کړئ"
  }
};

// Mock currencies
const initialCurrencies = [
  { id: 1, code: "AFN", name: "Afghan Afghani", symbol: "؋", is_base: true },
  { id: 2, code: "USD", name: "US Dollar", symbol: "$", is_base: false },
  { id: 3, code: "EUR", name: "Euro", symbol: "€", is_base: false },
  { id: 4, code: "PKR", name: "Pakistani Rupee", symbol: "₨", is_base: false },
  { id: 5, code: "IRR", name: "Iranian Rial", symbol: "﷼", is_base: false }
];

// Mock exchange rate history
const initialRates = [
  {
    id: 1,
    currency_id: 2,
    rate_to_base: 70.5,
    rate_date: "2026-11-11",
    created_by: "Admin",
    created_at: "2026-11-11T09:30:00"
  },
  {
    id: 2,
    currency_id: 3,
    rate_to_base: 81.25,
    rate_date: "2026-11-11",
    created_by: "Admin",
    created_at: "2026-11-11T09:35:00"
  },
  {
    id: 3,
    currency_id: 4,
    rate_to_base: 0.25,
    rate_date: "2026-11-10",
    created_by: "Manager",
    created_at: "2026-11-10T10:20:00"
  },
  {
    id: 4,
    currency_id: 2,
    rate_to_base: 69.8,
    rate_date: "2026-11-09",
    created_by: "Admin",
    created_at: "2026-11-09T08:15:00"
  },
  {
    id: 5,
    currency_id: 5,
    rate_to_base: 0.0017,
    rate_date: "2026-11-08",
    created_by: "Manager",
    created_at: "2026-11-08T11:00:00"
  },
  {
    id: 6,
    currency_id: 3,
    rate_to_base: 80.9,
    rate_date: "2026-11-07",
    created_by: "Admin",
    created_at: "2026-11-07T09:00:00"
  }
];

const today = () => new Date().toISOString().split("T")[0];

export default function ExchangeRates() {
  const { i18n } = useTranslation();

  const language =
    i18n.resolvedLanguage?.split("-")[0] ||
    i18n.language?.split("-")[0] ||
    "en";

  const t = translations[language] || translations.en;
  const isRTL = ["fa", "ps"].includes(language);

  const [currencies] = useState(initialCurrencies);
  const [rates, setRates] = useState(initialRates);
  const [search, setSearch] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({
    currency_id: "",
    rate_to_base: "",
    rate_date: today()
  });

  const pageSize = 5;

  const baseCurrency = currencies.find((currency) => currency.is_base);

  const getCurrency = (id) =>
    currencies.find((currency) => currency.id === Number(id));

  const filteredRates = useMemo(() => {
    return [...rates]
      .filter((item) => {
        const currency = getCurrency(item.currency_id);

        const matchesSearch =
          !search ||
          currency?.name.toLowerCase().includes(search.toLowerCase()) ||
          currency?.code.toLowerCase().includes(search.toLowerCase());

        const matchesCurrency =
          currencyFilter === "all" ||
          item.currency_id === Number(currencyFilter);

        const matchesDate =
          !dateFilter || item.rate_date === dateFilter;

        return matchesSearch && matchesCurrency && matchesDate;
      })
      .sort((a, b) => {
        return (
          new Date(b.rate_date).getTime() -
          new Date(a.rate_date).getTime()
        );
      });
  }, [rates, search, currencyFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRates.length / pageSize));

  const paginatedRates = filteredRates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const latestRate = [...rates].sort(
    (a, b) => new Date(b.rate_date) - new Date(a.rate_date)
  )[0];

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const resetForm = () => {
    setForm({
      currency_id: "",
      rate_to_base: "",
      rate_date: today()
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.currency_id ||
      !form.rate_to_base ||
      !form.rate_date ||
      Number(form.rate_to_base) <= 0
    ) {
      showToast(t.required);
      return;
    }

    const selectedCurrency = getCurrency(form.currency_id);

    if (selectedCurrency?.is_base) {
      showToast(t.required);
      return;
    }

    const newRate = {
      id: Date.now(),
      currency_id: Number(form.currency_id),
      rate_to_base: Number(form.rate_to_base),
      rate_date: form.rate_date,
      created_by: "Admin",
      created_at: new Date().toISOString()
    };

    setRates((previous) => [newRate, ...previous]);
    setShowModal(false);
    resetForm();
    setCurrentPage(1);
    showToast(t.success);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      language === "fa" ? "fa-AF" : language === "ps" ? "ps-AF" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric"
      }
    );
  };

  const formatNumber = (number) =>
    Number(number).toLocaleString(language === "en" ? "en-US" : "fa-AF", {
      maximumFractionDigits: 6
    });

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900";

  const cardClass =
    "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900";

  const clearFilters = () => {
    setSearch("");
    setCurrencyFilter("all");
    setDateFilter("");
    setCurrentPage(1);
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen space-y-6 bg-gray-50 p-4 text-gray-800 dark:bg-gray-950 dark:text-gray-100 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              <RefreshCw size={22} />
            </div>
            <h1 className="text-2xl font-bold">{t.title}</h1>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t.subtitle}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          {t.addRate}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.totalRecords}
              </p>
              <h2 className="mt-2 text-2xl font-bold">{rates.length}</h2>
            </div>
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              <History size={23} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.currencies}
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {new Set(rates.map((rate) => rate.currency_id)).size}
              </h2>
            </div>
            <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
              <Coins size={23} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.latestRate}
              </p>
              <h2 className="mt-2 truncate text-xl font-bold">
                {latestRate
                  ? formatNumber(latestRate.rate_to_base)
                  : "-"}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {latestRate
                  ? getCurrency(latestRate.currency_id)?.code
                  : ""}
              </p>
            </div>
            <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-900/40 dark:text-green-400">
              <TrendingUp size={23} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.baseCurrency}
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {baseCurrency?.code || "-"}
              </h2>
              <p className="mt-1 text-xs text-green-600">
                {t.active}
              </p>
            </div>
            <div className="rounded-xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400">
              <CircleDollarSign size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      <div className={cardClass}>
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <History size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold">{t.history}</h2>
          </div>
          <span className="text-sm text-gray-500">
            {filteredRates.length} {t.records}
          </span>
        </div>

        {/* Filters */}
        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
            <Search
              size={18}
              className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                isRTL ? "right-3" : "left-3"
              }`}
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t.search}
              className={`${inputClass} ${isRTL ? "pr-10" : "pl-10"}`}
            />
          </div>

          <div className="relative">
            <Filter
              size={17}
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                isRTL ? "right-3" : "left-3"
              }`}
            />
            <select
              value={currencyFilter}
              onChange={(e) => {
                setCurrencyFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`${inputClass} appearance-none ${
                isRTL ? "pr-10" : "pl-10"
              }`}
            >
              <option value="all">{t.allCurrencies}</option>
              {currencies
                .filter((currency) => !currency.is_base)
                .map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="relative">
            <CalendarDays
              size={17}
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                isRTL ? "right-3" : "left-3"
              }`}
            />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`${inputClass} ${isRTL ? "pr-10" : "pl-10"}`}
            />
          </div>

          <button
            onClick={clearFilters}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {t.clear}
          </button>
        </div>

        {/* Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[750px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400">
                <th className="px-4 py-4 text-start font-semibold">#</th>
                <th className="px-4 py-4 text-start font-semibold">
                  {t.currency}
                </th>
                <th className="px-4 py-4 text-start font-semibold">
                  {t.rate}
                </th>
                <th className="px-4 py-4 text-start font-semibold">
                  {t.date}
                </th>
                <th className="px-4 py-4 text-start font-semibold">
                  {t.createdBy}
                </th>
                <th className="px-4 py-4 text-start font-semibold">
                  {t.createdAt}
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedRates.map((item, index) => {
                const currency = getCurrency(item.currency_id);

                return (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
                  >
                    <td className="px-4 py-4 text-gray-500">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                          {currency?.symbol || currency?.code?.slice(0, 1)}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {currency?.code || "-"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {currency?.name || "-"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-bold text-gray-800 dark:text-gray-100">
                        {formatNumber(item.rate_to_base)}
                      </span>
                      <span className="ms-2 text-xs text-gray-400">
                        {baseCurrency?.code}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                      {formatDate(item.rate_date)}
                    </td>

                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                      {item.created_by}
                    </td>

                    <td className="px-4 py-4 text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {paginatedRates.map((item) => {
            const currency = getCurrency(item.currency_id);

            return (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      {currency?.symbol || currency?.code?.slice(0, 1)}
                    </div>
                    <div>
                      <p className="font-bold">{currency?.code}</p>
                      <p className="text-xs text-gray-500">
                        {currency?.name}
                      </p>
                    </div>
                  </div>

                  <div className="text-end">
                    <p className="text-lg font-bold">
                      {formatNumber(item.rate_to_base)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {baseCurrency?.code}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-3 text-sm dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500">{t.date}</p>
                    <p className="mt-1 font-medium">
                      {formatDate(item.rate_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t.createdBy}</p>
                    <p className="mt-1 font-medium">{item.created_by}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredRates.length === 0 && (
          <div className="py-12 text-center">
            <History className="mx-auto mb-3 text-gray-400" size={36} />
            <p className="text-sm text-gray-500">{t.noRecords}</p>
          </div>
        )}

        {/* Pagination */}
        {filteredRates.length > 0 && (
          <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row">
            <p className="text-sm text-gray-500">
              {t.showing}{" "}
              {(currentPage - 1) * pageSize + 1} -{" "}
              {Math.min(currentPage * pageSize, filteredRates.length)}{" "}
              {t.of} {filteredRates.length} {t.records}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                className="rounded-lg border border-gray-200 p-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="px-3 text-sm font-medium">
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
                className="rounded-lg border border-gray-200 p-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add rate modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-bold">{t.addTitle}</h2>
                <p className="mt-1 text-xs text-gray-500">
                  {t.rateInfo}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  {t.currency} *
                </label>

                <select
                  required
                  value={form.currency_id}
                  onChange={(e) =>
                    setForm({ ...form, currency_id: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="">{t.selectCurrency}</option>
                  {currencies
                    .filter((currency) => !currency.is_base)
                    .map((currency) => (
                      <option key={currency.id} value={currency.id}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  {t.rate} *
                </label>

                <input
                  required
                  type="number"
                  min="0.000001"
                  step="0.000001"
                  value={form.rate_to_base}
                  onChange={(e) =>
                    setForm({ ...form, rate_to_base: e.target.value })
                  }
                  placeholder={t.enterRate}
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-gray-500">
                  {t.rateInfo}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  {t.date} *
                </label>

                <input
                  required
                  type="date"
                  value={form.rate_date}
                  onChange={(e) =>
                    setForm({ ...form, rate_date: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {t.cancel}
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <CheckCircle2 size={17} />
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm text-white shadow-lg">
          <CheckCircle2 size={18} className="text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
