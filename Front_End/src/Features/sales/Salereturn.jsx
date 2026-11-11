

import { useMemo, useState } from "react";
import {
  Search, Plus, X, RotateCcw, Wallet,
  CheckCircle2, Clock, Eye, CalendarDays
} from "lucide-react";

const translations = {
  en: {
    title: "Sales Returns",
    subtitle: "Manage customer returns and refunds",
    newReturn: "New Return",
    totalReturns: "Total Returns",
    refundTotal: "Total Refunds",
    todayReturns: "Return Records",
    search: "Search return, sale ID or reason...",
    allSales: "All Sales",
    returnId: "Return ID",
    saleId: "Sale ID",
    date: "Return Date",
    reason: "Return Reason",
    refund: "Refund Amount",
    processedBy: "Processed By",
    actions: "Actions",
    createTitle: "Create Sales Return",
    selectSale: "Select Sale",
    selectEmployee: "Select Employee",
    returnDate: "Return Date",
    enterReason: "Enter return reason...",
    refundAmount: "Refund Amount",
    save: "Save Return",
    cancel: "Cancel",
    close: "Close",
    details: "View Details",
    noResults: "No returns found",
    required: "Please complete all required fields.",
    records: "returns",
    customer: "Customer",
    employee: "Employee",
    status: "Return",
    currency: "AFN"
  },
  fa: {
    title: "برگشت فروشات",
    subtitle: "مدیریت برگشت اجناس و بازپرداخت پول مشتریان",
    newReturn: "ثبت برگشت جدید",
    totalReturns: "مجموع برگشت‌ها",
    refundTotal: "مجموع بازپرداخت",
    todayReturns: "تعداد ثبت‌ها",
    search: "جستجوی برگشت، شماره فروش یا دلیل...",
    allSales: "تمام فروش‌ها",
    returnId: "شماره برگشت",
    saleId: "شماره فروش",
    date: "تاریخ برگشت",
    reason: "دلیل برگشت",
    refund: "مبلغ بازپرداخت",
    processedBy: "ثبت‌کننده",
    actions: "عملیات",
    createTitle: "ثبت برگشت فروش",
    selectSale: "انتخاب فروش",
    selectEmployee: "انتخاب کارمند",
    returnDate: "تاریخ برگشت",
    enterReason: "دلیل برگشت را وارد کنید...",
    refundAmount: "مبلغ بازپرداخت",
    save: "ثبت برگشت",
    cancel: "لغو",
    close: "بستن",
    details: "مشاهده جزئیات",
    noResults: "هیچ برگشتی پیدا نشد",
    required: "لطفاً تمام خانه‌های ضروری را تکمیل کنید.",
    records: "برگشت",
    customer: "مشتری",
    employee: "کارمند",
    status: "برگشت",
    currency: "افغانی"
  },
  ps: {
    title: "د پلورنې بېرته راګرځول",
    subtitle: "د پېرودونکو د توکو بېرته راګرځول او پیسې ورکول اداره کړئ",
    newReturn: "نوی بېرته راګرځول",
    totalReturns: "ټول بېرته راګرځول",
    refundTotal: "د بېرته ورکړل شویو پیسو مجموعه",
    todayReturns: "د ثبتونو شمېر",
    search: "بېرته راګرځول، د پلورنې شمېره یا دلیل ولټوئ...",
    allSales: "ټولې پلورنې",
    returnId: "د بېرته راګرځولو شمېره",
    saleId: "د پلورنې شمېره",
    date: "د بېرته راګرځولو نېټه",
    reason: "د بېرته راګرځولو دلیل",
    refund: "د بېرته ورکړې اندازه",
    processedBy: "ثبت کوونکی",
    actions: "کړنې",
    createTitle: "د پلورنې بېرته راګرځول ثبتول",
    selectSale: "پلورنه وټاکئ",
    selectEmployee: "کارکوونکی وټاکئ",
    returnDate: "د بېرته راګرځولو نېټه",
    enterReason: "د بېرته راګرځولو دلیل ولیکئ...",
    refundAmount: "د بېرته ورکړې اندازه",
    save: "ثبتول",
    cancel: "لغوه",
    close: "تړل",
    details: "جزئیات وګورئ",
    noResults: "هیڅ بېرته راګرځول ونه موندل شو",
    required: "مهرباني وکړئ اړین معلومات بشپړ کړئ.",
    records: "بېرته راګرځول",
    customer: "پېرودونکی",
    employee: "کارکوونکی",
    status: "بېرته راګرځول",
    currency: "افغانۍ"
  }
};

const initialReturns = [
  {
    id: 1,
    sale_id: 1,
    return_date: "2026-10-06T09:00",
    reason: "Wrong color selected",
    refund_amount: 2000,
    processed_by: 1
  },
  {
    id: 2,
    sale_id: 2,
    return_date: "2026-10-07T09:30",
    reason: "Customer changed mind",
    refund_amount: 1000,
    processed_by: 1
  },
  {
    id: 3,
    sale_id: 3,
    return_date: "2026-10-08T10:00",
    reason: "Minor defect",
    refund_amount: 500,
    processed_by: 1
  },
  {
    id: 4,
    sale_id: 4,
    return_date: "2026-10-09T11:00",
    reason: "Size issue",
    refund_amount: 1500,
    processed_by: 1
  },
  {
    id: 5,
    sale_id: 5,
    return_date: "2026-10-10T12:00",
    reason: "Exchange requested",
    refund_amount: 300,
    processed_by: 1
  }
];

const salesOptions = [
  { id: 1, customer: "Customer #1", total: 42000 },
  { id: 2, customer: "Customer #2", total: 33000 },
  { id: 3, customer: "Customer #3", total: 12000 },
  { id: 4, customer: "Customer #4", total: 24000 },
  { id: 5, customer: "Customer #5", total: 6000 }
];

const SaleReturn = () => {
  const language = localStorage.getItem("language") || "en";
  const t = translations[language] || translations.en;
  const rtl = ["fa", "ps"].includes(language);

  const [returns, setReturns] = useState(initialReturns);
  const [search, setSearch] = useState("");
  const [saleFilter, setSaleFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    sale_id: "",
    return_date: new Date().toISOString().slice(0, 16),
    reason: "",
    refund_amount: "",
    processed_by: "1"
  });

  const money = (value) =>
    new Intl.NumberFormat(language === "en" ? "en-US" : "fa-IR").format(
      Number(value || 0)
    );

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString(
      language === "en" ? "en-US" : language === "ps" ? "ps-AF" : "fa-IR"
    );
  };

  const filteredReturns = useMemo(() => {
    return returns.filter((item) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        String(item.id).includes(searchText) ||
        String(item.sale_id).includes(searchText) ||
        item.reason.toLowerCase().includes(searchText);

      const matchesSale =
        saleFilter === "all" || item.sale_id === Number(saleFilter);

      return matchesSearch && matchesSale;
    });
  }, [returns, search, saleFilter]);

  const refundTotal = returns.reduce(
    (sum, item) => sum + Number(item.refund_amount),
    0
  );

  const stats = [
    {
      label: t.totalReturns,
      value: returns.length,
      icon: RotateCcw,
      color: "blue"
    },
    {
      label: t.refundTotal,
      value: money(refundTotal),
      icon: Wallet,
      color: "violet"
    },
    {
      label: t.todayReturns,
      value: returns.length,
      icon: CheckCircle2,
      color: "emerald"
    }
  ];

  const resetForm = () => {
    setForm({
      sale_id: "",
      return_date: new Date().toISOString().slice(0, 16),
      reason: "",
      refund_amount: "",
      processed_by: "1"
    });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const refund = Number(form.refund_amount);

    if (
      !form.sale_id ||
      !form.return_date ||
      !form.processed_by ||
      !form.reason.trim() ||
      !Number.isFinite(refund) ||
      refund < 0
    ) {
      setError(t.required);
      return;
    }

    const newReturn = {
      id: Math.max(0, ...returns.map((item) => item.id)) + 1,
      sale_id: Number(form.sale_id),
      return_date: form.return_date,
      reason: form.reason.trim(),
      refund_amount: refund,
      processed_by: Number(form.processed_by)
    };

    setReturns((prev) => [newReturn, ...prev]);
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
          {t.newReturn}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = {
            blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
            violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
            emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          };

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            value={saleFilter}
            onChange={(e) => setSaleFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="all">{t.allSales}</option>
            {salesOptions.map((sale) => (
              <option key={sale.id} value={sale.id}>
                #{sale.id} - {sale.customer}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Returns Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800">
          <h2 className="font-semibold text-slate-800 dark:text-white">
            {t.title}
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {filteredReturns.length} {t.records}
          </span>
        </div>

        {filteredReturns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <RotateCcw size={38} />
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
                      t.returnId,
                      t.saleId,
                      t.date,
                      t.reason,
                      t.refund,
                      t.processedBy,
                      t.actions
                    ].map((heading) => (
                      <th key={heading} className="whitespace-nowrap px-4 py-3 text-start font-medium">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredReturns.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-4 font-semibold text-slate-800 dark:text-white">
                        #{item.id}
                      </td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                        #{item.sale_id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-500 dark:text-slate-400">
                        {formatDate(item.return_date)}
                      </td>
                      <td className="max-w-56 px-4 py-4 text-slate-600 dark:text-slate-300">
                        {item.reason}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-rose-600">
                        {money(item.refund_amount)} {t.currency}
                      </td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                        #{item.processed_by}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setSelectedReturn(item)}
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
              {filteredReturns.map((item) => (
                <div key={item.id} className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-slate-800 dark:text-white">
                      #{item.id}
                    </span>
                    <span className="text-sm font-semibold text-rose-600">
                      {money(item.refund_amount)} {t.currency}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">{t.saleId}</p>
                      <p className="mt-1 text-slate-700 dark:text-slate-200">
                        #{item.sale_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{t.date}</p>
                      <p className="mt-1 text-slate-700 dark:text-slate-200">
                        {formatDate(item.return_date)}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {item.reason}
                  </p>

                  <button
                    onClick={() => setSelectedReturn(item)}
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

      {/* New Return Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {t.createTitle}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.saleId}
                </label>
                <select
                  required
                  value={form.sale_id}
                  onChange={(e) => setForm({ ...form, sale_id: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">{t.selectSale}</option>
                  {salesOptions.map((sale) => (
                    <option key={sale.id} value={sale.id}>
                      #{sale.id} - {sale.customer}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.returnDate}
                </label>
                <input
                  type="datetime-local"
                  required
                  value={form.return_date}
                  onChange={(e) => setForm({ ...form, return_date: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.refundAmount}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.refund_amount}
                  onChange={(e) => setForm({ ...form, refund_amount: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.processedBy}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={form.processed_by}
                  onChange={(e) => setForm({ ...form, processed_by: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.reason}
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder={t.enterReason}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {error && (
                <p className="text-sm text-rose-600">{error}</p>
              )}

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
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

      {/* Return Details Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {t.details} #{selectedReturn.id}
              </h2>
              <button
                onClick={() => setSelectedReturn(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                [t.returnId, `#${selectedReturn.id}`],
                [t.saleId, `#${selectedReturn.sale_id}`],
                [t.date, formatDate(selectedReturn.return_date)],
                [t.refund, `${money(selectedReturn.refund_amount)} ${t.currency}`],
                [t.processedBy, `#${selectedReturn.processed_by}`]
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-1 font-semibold text-slate-800 dark:text-white">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-xs text-slate-400">{t.reason}</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                {selectedReturn.reason}
              </p>
            </div>

            <button
              onClick={() => setSelectedReturn(null)}
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

export default SaleReturn;
