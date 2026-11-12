
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  CalendarDays,
  Coins,
  TrendingUp,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Trash2,
} from "lucide-react";

import api from "../services/api";
import {
  getExchangeRates,
  createExchangeRate,
} from "../services/finance/exchangeRateService";

import { useAuth } from "../context/Authcontext";

const translations = {
  en: {
    title: "Exchange Rates",
    subtitle: "Manage currency exchange rates",
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
    noRecords: "No exchange rates found",
    addTitle: "Add New Exchange Rate",
    selectCurrency: "Select Currency",
    enterRate: "Enter exchange rate",
    selectDate: "Select date",
    cancel: "Cancel",
    save: "Save Rate",
    required: "Please fill in all required fields",
    success: "Exchange rate added successfully",
    previous: "Previous",
    next: "Next",
    showing: "Showing",
    of: "of",
    records: "records",
    baseCurrency: "Base Currency",
    active: "Active",
    rateInfo: "Enter how much one unit of this currency is worth in the base currency.",
    noCurrency: "No currencies available",
    today: "Today",
    clear: "Clear Filters",
    loading: "Loading exchange rates...",
    saving: "Saving...",
    loadError: "Failed to load exchange rates",
    saveError: "Failed to save exchange rate",
    employeeError: "Could not identify the logged-in employee. Please log in again.",
    currencyError: "Please select a valid currency",
    rateError: "Exchange rate must be greater than zero",
    dateError: "Please select a date",
    noBaseRate: "You cannot add an exchange rate for the base currency.",
    error: "Error",
    close: "Close",
  },

  fa: {
    title: "نرخ اسعار",
    subtitle: "مدیریت نرخ تبادله اسعار",
    addRate: "افزودن نرخ جدید",
    totalRecords: "مجموع ریکاردها",
    currencies: "تعداد اسعار",
    latestRate: "آخرین نرخ",
    search: "جستجوی ارز...",
    allCurrencies: "تمام اسعار",
    currency: "واحد پولی",
    rate: "نرخ به ارز پایه",
    date: "تاریخ نرخ",
    createdBy: "ثبت‌کننده",
    createdAt: "تاریخ ثبت",
    actions: "عملیات",
    history: "تاریخچه نرخ اسعار",
    noRecords: "هیچ نرخ ارزی پیدا نشد",
    addTitle: "افزودن نرخ جدید ارز",
    selectCurrency: "انتخاب ارز",
    enterRate: "نرخ تبادله را وارد کنید",
    selectDate: "انتخاب تاریخ",
    cancel: "لغو",
    save: "ثبت نرخ",
    required: "لطفاً تمام فیلدهای ضروری را تکمیل کنید",
    success: "نرخ ارز با موفقیت ثبت شد",
    previous: "قبلی",
    next: "بعدی",
    showing: "نمایش",
    of: "از",
    records: "ریکارد",
    baseCurrency: "ارز پایه",
    active: "فعال",
    rateInfo: "ارزش یک واحد از این ارز را به ارز پایه وارد کنید.",
    noCurrency: "هیچ ارزی موجود نیست",
    today: "امروز",
    clear: "پاک کردن فیلترها",
    loading: "در حال دریافت نرخ اسعار...",
    saving: "در حال ثبت...",
    loadError: "دریافت نرخ اسعار ناکام شد",
    saveError: "ثبت نرخ ارز ناکام شد",
    employeeError: "شناسه کارمند واردشده مشخص نشد. لطفاً دوباره وارد سیستم شوید.",
    currencyError: "لطفاً یک ارز معتبر انتخاب کنید",
    rateError: "نرخ تبادله باید بیشتر از صفر باشد",
    dateError: "لطفاً تاریخ را انتخاب کنید",
    noBaseRate: "برای ارز پایه نمی‌توانید نرخ تبادله ثبت کنید.",
    error: "خطا",
    close: "بستن",
  },

  ps: {
    title: "د اسعارو نرخونه",
    subtitle: "د اسعارو د تبادلې نرخونه اداره کړئ",
    addRate: "نوی نرخ اضافه کړئ",
    totalRecords: "ټول ریکارډونه",
    currencies: "اسعار",
    latestRate: "وروستی نرخ",
    search: "د اسعارو لټون...",
    allCurrencies: "ټول اسعار",
    currency: "اسعار",
    rate: "اصلي اسعارو ته نرخ",
    date: "د نرخ نېټه",
    createdBy: "ثبت کوونکی",
    createdAt: "د ثبت نېټه",
    actions: "کړنې",
    history: "د اسعارو د نرخونو تاریخچه",
    noRecords: "د اسعارو نرخونه ونه موندل شول",
    addTitle: "د نوي اسعارو نرخ اضافه کول",
    selectCurrency: "اسعار وټاکئ",
    enterRate: "د تبادلې نرخ ولیکئ",
    selectDate: "نېټه وټاکئ",
    cancel: "لغوه",
    save: "نرخ ثبت کړئ",
    required: "مهرباني وکړئ ټول اړین ځایونه ډک کړئ",
    success: "د اسعارو نرخ په بریالیتوب ثبت شو",
    previous: "مخکینی",
    next: "راتلونکی",
    showing: "ښودل",
    of: "له",
    records: "ریکارډونه",
    baseCurrency: "اصلي اسعار",
    active: "فعال",
    rateInfo: "د دې اسعارو د یوې واحدې ارزښت په اصلي اسعارو کې ولیکئ.",
    noCurrency: "اسعار شتون نه لري",
    today: "نن",
    clear: "فلټرونه پاک کړئ",
    loading: "د اسعارو نرخونه ترلاسه کېږي...",
    saving: "ثبت کېږي...",
    loadError: "د اسعارو نرخونو ترلاسه کول ناکام شول",
    saveError: "د اسعارو نرخ ثبتول ناکام شول",
    employeeError: "د ننوتلي کارمند پېژندنه ونه موندل شوه. بیا ننوتل وکړئ.",
    currencyError: "مهرباني وکړئ معتبر اسعار وټاکئ",
    rateError: "د تبادلې نرخ باید له صفر څخه لوړ وي",
    dateError: "مهرباني وکړئ نېټه وټاکئ",
    noBaseRate: "د اصلي اسعارو لپاره د تبادلې نرخ نه شئ ثبتولی.",
    error: "تېروتنه",
    close: "بندول",
  },
};

const formatNumber = (value) =>
  Number(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 4,
  });

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString();
};

export default function ExchangeRates({ language = "en" }) {
  const { user } = useAuth();

  const t = translations[language] || translations.en;
  const isRTL = language === "fa" || language === "ps";

  const employeeId = user?.id;

  const [currencies, setCurrencies] = useState([]);
  const [rates, setRates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;

  const [form, setForm] = useState({
    currency_id: "",
    rate_to_base: "",
    rate_date: new Date().toISOString().split("T")[0],
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    window.setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [ratesData, currenciesResponse] = await Promise.all([
        getExchangeRates(),
        api.get("/currencies"),
      ]);

      if (!Array.isArray(currenciesResponse.data)) {
        throw new Error("Invalid currencies response");
      }

      setRates(ratesData);
      setCurrencies(currenciesResponse.data);
    } catch (error) {
      console.error("Exchange rates loading error:", error);
      showToast(t.loadError, "error");
    } finally {
      setLoading(false);
    }
  }, [t.loadError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const baseCurrency = currencies.find(
    (currency) =>
      currency.is_base === true ||
      currency.is_base === 1 ||
      currency.is_base === "true"
  );

  const getCurrency = (currencyId) =>
    currencies.find(
      (currency) => Number(currency.id) === Number(currencyId)
    );

  const filteredRates = useMemo(() => {
    return rates
      .filter((item) => {
        const currency = getCurrency(item.currency_id);

        const currencyName = currency
          ? `${currency.name || ""} ${currency.code || ""}`
          : "";

        const matchesSearch = currencyName
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesCurrency =
          !selectedCurrency ||
          Number(item.currency_id) === Number(selectedCurrency);

        const matchesDate =
          !selectedDate ||
          String(item.rate_date).slice(0, 10) === selectedDate;

        return matchesSearch && matchesCurrency && matchesDate;
      })
      .sort(
        (a, b) =>
          new Date(b.rate_date).getTime() -
          new Date(a.rate_date).getTime()
      );
  }, [rates, currencies, search, selectedCurrency, selectedDate]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRates.length / recordsPerPage)
  );

  const paginatedRates = filteredRates.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      currency_id: "",
      rate_to_base: "",
      rate_date: new Date().toISOString().split("T")[0],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!employeeId) {
      showToast(t.employeeError, "error");
      return;
    }

    if (!form.currency_id) {
      showToast(t.currencyError, "error");
      return;
    }

    if (
      !form.rate_to_base ||
      Number(form.rate_to_base) <= 0 ||
      !Number.isFinite(Number(form.rate_to_base))
    ) {
      showToast(t.rateError, "error");
      return;
    }

    if (!form.rate_date) {
      showToast(t.dateError, "error");
      return;
    }

    if (
      baseCurrency &&
      Number(form.currency_id) === Number(baseCurrency.id)
    ) {
      showToast(t.noBaseRate, "error");
      return;
    }

    setSaving(true);

    try {
      const result = await createExchangeRate({
        currency_id: Number(form.currency_id),
        rate_to_base: Number(form.rate_to_base),
        rate_date: form.rate_date,
        created_by: Number(employeeId),
      });

      if (result?.severity === "ERROR" || result?.error) {
        throw new Error(result.message || t.saveError);
      }

      setShowModal(false);
      resetForm();

      await loadData();

      showToast(t.success, "success");
    } catch (error) {
      console.error("Exchange rate saving error:", error);
      showToast(error.message || t.saveError, "error");
    } finally {
      setSaving(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCurrency("");
    setSelectedDate("");
    setCurrentPage(1);
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  const latestRate = rates.length
    ? [...rates].sort(
        (a, b) =>
          new Date(b.rate_date).getTime() -
          new Date(a.rate_date).getTime()
      )[0]
    : null;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t.title}
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t.subtitle}
          </p>
        </div>

        <button
          onClick={openModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
        >
          <Plus size={19} />
          {t.addRate}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.totalRecords}
              </p>

              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                {rates.length}
              </h2>
            </div>

            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600">
              <Coins size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.currencies}
              </p>

              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                {currencies.length}
              </h2>
            </div>

            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600">
              <RefreshCw size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.latestRate}
              </p>

              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                {latestRate
                  ? formatNumber(latestRate.rate_to_base)
                  : "-"}
              </h2>
            </div>

            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search
              size={18}
              className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                isRTL ? "right-3" : "left-3"
              }`}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t.search}
              className={`w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 ${
                isRTL ? "pr-10 pl-3" : "pl-10 pr-3"
              }`}
            />
          </div>

          <select
            value={selectedCurrency}
            onChange={(e) => {
              setSelectedCurrency(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t.allCurrencies}</option>

            {currencies.map((currency) => (
              <option key={currency.id} value={currency.id}>
                {currency.name} {currency.code ? `(${currency.code})` : ""}
              </option>
            ))}
          </select>

          <div className="relative">
            <CalendarDays
              size={18}
              className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                isRTL ? "right-3" : "left-3"
              }`}
            />

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 ${
                isRTL ? "pr-10 pl-3" : "pl-10 pr-3"
              }`}
            />
          </div>

          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
          >
            <RefreshCw size={17} />
            {t.clear}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-800 dark:text-white">
            {t.history}
          </h2>

          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredRates.length} {t.records}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Loader2 size={32} className="animate-spin mb-3 text-blue-600" />
            {t.loading}
          </div>
        ) : filteredRates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
            <Coins size={42} className="mb-3 opacity-40" />
            <p>{t.noRecords}</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/70 text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-5 py-4">{t.currency}</th>
                    <th className="px-5 py-4">{t.rate}</th>
                    <th className="px-5 py-4">{t.date}</th>
                    <th className="px-5 py-4">{t.createdBy}</th>
                    <th className="px-5 py-4">{t.createdAt}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {paginatedRates.map((item) => {
                    const currency = getCurrency(item.currency_id);

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                      >
                        <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                          {currency?.name || `Currency #${item.currency_id}`}
                          {currency?.code && (
                            <span className="text-gray-400 ml-2">
                              ({currency.code})
                            </span>
                          )}

                          {baseCurrency &&
                            Number(item.currency_id) ===
                              Number(baseCurrency.id) && (
                              <span className="ml-2 text-xs text-blue-600">
                                {t.baseCurrency}
                              </span>
                            )}
                        </td>

                        <td className="px-5 py-4 font-semibold text-blue-600 dark:text-blue-400">
                          {formatNumber(item.rate_to_base)}
                        </td>

                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                          {formatDate(item.rate_date)}
                        </td>

                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                          {item.created_by ?? "-"}
                        </td>

                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                          {formatDate(item.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedRates.map((item) => {
                const currency = getCurrency(item.currency_id);

                return (
                  <div key={item.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {currency?.name || `Currency #${item.currency_id}`}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          {currency?.code || ""}
                        </p>
                      </div>

                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {formatNumber(item.rate_to_base)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-400">{t.date}</p>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">
                          {formatDate(item.rate_date)}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400">{t.createdBy}</p>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">
                          {item.created_by ?? "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400">{t.createdAt}</p>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">
                          {formatDate(item.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && filteredRates.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.showing}{" "}
              {(currentPage - 1) * recordsPerPage + 1} -{" "}
              {Math.min(
                currentPage * recordsPerPage,
                filteredRates.length
              )}{" "}
              {t.of} {filteredRates.length} {t.records}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 text-gray-700 dark:text-gray-300"
              >
                {isRTL ? (
                  <ChevronRight size={18} />
                ) : (
                  <ChevronLeft size={18} />
                )}
              </button>

              <span className="text-sm text-gray-600 dark:text-gray-300 px-2">
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 text-gray-700 dark:text-gray-300"
              >
                {isRTL ? (
                  <ChevronLeft size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add exchange rate modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                {t.addTitle}
              </h2>

              <button
                onClick={closeModal}
                disabled={saving}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.currency}
                </label>

                <select
                  name="currency_id"
                  value={form.currency_id}
                  onChange={handleFormChange}
                  required
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t.selectCurrency}</option>

                  {currencies
                    .filter(
                      (currency) =>
                        !baseCurrency ||
                        Number(currency.id) !== Number(baseCurrency.id)
                    )
                    .map((currency) => (
                      <option key={currency.id} value={currency.id}>
                        {currency.name}
                        {currency.code ? ` (${currency.code})` : ""}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.rate}
                </label>

                <input
                  type="number"
                  name="rate_to_base"
                  value={form.rate_to_base}
                  onChange={handleFormChange}
                  placeholder={t.enterRate}
                  min="0.000001"
                  step="any"
                  required
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />

                <p className="text-xs text-gray-400 mt-2">
                  {t.rateInfo}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.date}
                </label>

                <input
                  type="date"
                  name="rate_date"
                  value={form.rate_date}
                  onChange={handleFormChange}
                  required
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  {t.cancel}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium transition"
                >
                  {saving && <Loader2 size={18} className="animate-spin" />}
                  {saving ? t.saving : t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-5 ${
            isRTL ? "left-5" : "right-5"
          } z-[60] flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}

          <span className="text-sm font-medium">{toast.message}</span>

          <button onClick={() => setToast(null)}>
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
