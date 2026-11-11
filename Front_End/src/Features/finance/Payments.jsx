

import { useMemo, useState } from "react";
import {
  Search, Plus, X, Pencil, Trash2, CreditCard, Banknote,
  Wallet, ArrowDownLeft, CalendarDays, UserRound, Receipt,
  CheckCircle2, Clock, ChevronLeft, ChevronRight, Filter
} from "lucide-react";
import { useTranslation } from "react-i18next";

const translations = {
  en: {
    title: "Payments", subtitle: "Manage customer payments",
    add: "Add Payment", edit: "Edit Payment", delete: "Delete Payment",
    search: "Search payments...", allMethods: "All Methods",
    allTypes: "All Types", allCurrencies: "All Currencies",
    total: "Total Payments", records: "Payment Records",
    cash: "Cash", card: "Card", bank_transfer: "Bank Transfer",
    check: "Check", deposit: "Deposit", installment: "Installment",
    full_payment: "Full Payment", refund: "Refund",
    sale: "Sale", employee: "Received By", date: "Payment Date",
    method: "Payment Method", type: "Payment Type", amount: "Amount",
    currency: "Currency", exchangeRate: "Exchange Rate",
    saleAmount: "Amount in Sale Currency", actions: "Actions",
    save: "Save Payment", update: "Update Payment", cancel: "Cancel",
    confirmDelete: "Are you sure you want to delete this payment?",
    noPayments: "No payments found", required: "This field is required",
    successAdd: "Payment added successfully",
    successEdit: "Payment updated successfully",
    successDelete: "Payment deleted successfully",
    previous: "Previous", next: "Next", showing: "Showing",
    of: "of", entries: "entries", close: "Close",
    all: "All", paymentDetails: "Payment Details",
    selectSale: "Select Sale", selectEmployee: "Select Employee",
    selectCurrency: "Select Currency", noDescription: "No payments yet",
    clearFilters: "Clear Filters"
  },
  fa: {
    title: "پرداخت‌ها", subtitle: "مدیریت پرداخت‌های مشتریان",
    add: "افزودن پرداخت", edit: "ویرایش پرداخت",
    delete: "حذف پرداخت", search: "جستجوی پرداخت‌ها...",
    allMethods: "همه روش‌ها", allTypes: "همه انواع",
    allCurrencies: "همه ارزها", total: "مجموع پرداخت‌ها",
    records: "تعداد پرداخت‌ها", cash: "نقدی", card: "کارت",
    bank_transfer: "انتقال بانکی", check: "چک",
    deposit: "پیش‌پرداخت", installment: "قسط",
    full_payment: "پرداخت کامل", refund: "بازپرداخت",
    sale: "فروش", employee: "دریافت‌کننده", date: "تاریخ پرداخت",
    method: "روش پرداخت", type: "نوع پرداخت", amount: "مبلغ",
    currency: "ارز", exchangeRate: "نرخ تبدیل",
    saleAmount: "مبلغ به ارز فروش", actions: "عملیات",
    save: "ثبت پرداخت", update: "به‌روزرسانی پرداخت",
    cancel: "لغو", confirmDelete: "آیا از حذف این پرداخت مطمئن هستید؟",
    noPayments: "پرداختی یافت نشد", required: "این فیلد الزامی است",
    successAdd: "پرداخت با موفقیت ثبت شد",
    successEdit: "پرداخت با موفقیت ویرایش شد",
    successDelete: "پرداخت با موفقیت حذف شد",
    previous: "قبلی", next: "بعدی", showing: "نمایش",
    of: "از", entries: "مورد", close: "بستن",
    all: "همه", paymentDetails: "جزئیات پرداخت",
    selectSale: "انتخاب فروش", selectEmployee: "انتخاب کارمند",
    selectCurrency: "انتخاب ارز", noDescription: "هنوز پرداختی ثبت نشده",
    clearFilters: "پاک کردن فیلترها"
  },
  ps: {
    title: "تادیات", subtitle: "د پیرودونکو د تادیاتو مدیریت",
    add: "تادیه اضافه کړئ", edit: "تادیه سمول",
    delete: "تادیه حذف کړئ", search: "تادیات ولټوئ...",
    allMethods: "ټولې طریقې", allTypes: "ټول ډولونه",
    allCurrencies: "ټولې پیسې", total: "د تادیاتو مجموعه",
    records: "د تادیاتو شمېر", cash: "نغدې",
    card: "کارت", bank_transfer: "بانکي انتقال", check: "چک",
    deposit: "مخکینۍ تادیه", installment: "قسط",
    full_payment: "بشپړه تادیه", refund: "بېرته ورکول",
    sale: "پلور", employee: "ترلاسه کوونکی",
    date: "د تادیې نېټه", method: "د تادیې طریقه",
    type: "د تادیې ډول", amount: "اندازه", currency: "اسعار",
    exchangeRate: "د تبادلې نرخ", saleAmount: "د پلور په اسعارو اندازه",
    actions: "کړنې", save: "تادیه ثبت کړئ",
    update: "تادیه تازه کړئ", cancel: "لغوه",
    confirmDelete: "ایا غواړئ دا تادیه حذف کړئ؟",
    noPayments: "تادیه ونه موندل شوه", required: "دا برخه اړینه ده",
    successAdd: "تادیه په بریالیتوب ثبت شوه",
    successEdit: "تادیه په بریالیتوب بدله شوه",
    successDelete: "تادیه په بریالیتوب حذف شوه",
    previous: "مخکینی", next: "بل", showing: "ښودل",
    of: "له", entries: "ریکارډونه", close: "بندول",
    all: "ټول", paymentDetails: "د تادیې معلومات",
    selectSale: "پلور وټاکئ", selectEmployee: "کارمند وټاکئ",
    selectCurrency: "اسعار وټاکئ", noDescription: "تر اوسه تادیه نشته",
    clearFilters: "فلټرونه پاک کړئ"
  }
};

const methods = ["cash", "card", "bank_transfer", "check"];
const types = ["deposit", "installment", "full_payment", "refund"];

const initialPayments = [
  {
    id: 1, sale_id: 101, received_by: 1,
    payment_date: "2026-11-10T10:30",
    payment_method: "cash", payment_type: "deposit",
    amount: 20000, currency_id: 1,
    exchange_rate_to_sale: 1, amount_in_sale_currency: 20000
  },
  {
    id: 2, sale_id: 102, received_by: 2,
    payment_date: "2026-11-10T12:15",
    payment_method: "card", payment_type: "full_payment",
    amount: 45000, currency_id: 1,
    exchange_rate_to_sale: 1, amount_in_sale_currency: 45000
  },
  {
    id: 3, sale_id: 103, received_by: 1,
    payment_date: "2026-11-11T09:20",
    payment_method: "bank_transfer", payment_type: "installment",
    amount: 100, currency_id: 2,
    exchange_rate_to_sale: 70, amount_in_sale_currency: 7000
  },
  {
    id: 4, sale_id: 104, received_by: 3,
    payment_date: "2026-11-11T11:00",
    payment_method: "check", payment_type: "refund",
    amount: 5000, currency_id: 1,
    exchange_rate_to_sale: 1, amount_in_sale_currency: 5000
  }
];

// Sample dropdown data
const sales = [
  { id: 101, label: "Sale #101" },
  { id: 102, label: "Sale #102" },
  { id: 103, label: "Sale #103" },
  { id: 104, label: "Sale #104" }
];

const employees = [
  { id: 1, label: "Ahmad" },
  { id: 2, label: "Mohammad" },
  { id: 3, label: "Ali" }
];

const currencies = [
  { id: 1, label: "AFN" },
  { id: 2, label: "EUR" }
];

const emptyForm = {
  sale_id: "",
  received_by: "",
  payment_date: new Date().toISOString().slice(0, 16),
  payment_method: "cash",
  payment_type: "deposit",
  amount: "",
  currency_id: "1",
  exchange_rate_to_sale: "1",
  amount_in_sale_currency: ""
};

export default function Payments() {
  const { i18n } = useTranslation();

  const language =
    i18n.resolvedLanguage?.split("-")[0] ||
    i18n.language?.split("-")[0] || "en";

  const t = translations[language] || translations.en;
  const isRTL = ["fa", "ps"].includes(language);

  const [payments, setPayments] = useState(initialPayments);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");
  const pageSize = 6;

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const query = search.toLowerCase();

      const matchesSearch =
        String(payment.id).includes(query) ||
        String(payment.sale_id).includes(query) ||
        (employees.find(e => e.id === payment.received_by)?.label || "")
          .toLowerCase().includes(query);

      return matchesSearch &&
        (!methodFilter || payment.payment_method === methodFilter) &&
        (!typeFilter || payment.payment_type === typeFilter) &&
        (!currencyFilter || String(payment.currency_id) === currencyFilter);
    });
  }, [payments, search, methodFilter, typeFilter, currencyFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const currentPayments = filteredPayments.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalAmount = payments.reduce(
    (sum, payment) => sum + Number(payment.amount_in_sale_currency || 0), 0
  );

  const formatMoney = (amount) =>
    new Intl.NumberFormat(language === "en" ? "en-US" : "fa-AF")
      .format(Number(amount || 0));

  const getMethodLabel = (method) => t[method] || method;
  const getTypeLabel = (type) => t[type] || type;

  const getCurrency = (id) =>
    currencies.find(currency => currency.id === Number(id))?.label || "-";

  const getEmployee = (id) =>
    employees.find(employee => employee.id === Number(id))?.label || "-";

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (payment) => {
    setEditingId(payment.id);
    setForm({
      ...payment,
      sale_id: String(payment.sale_id),
      received_by: String(payment.received_by),
      currency_id: String(payment.currency_id),
      amount: String(payment.amount),
      exchange_rate_to_sale: String(payment.exchange_rate_to_sale),
      amount_in_sale_currency: String(payment.amount_in_sale_currency)
    });
    setModal(true);
  };

  const updateField = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };

      if (field === "amount" || field === "exchange_rate_to_sale") {
        const amount = Number(field === "amount" ? value : next.amount);
        const rate = Number(
          field === "exchange_rate_to_sale"
            ? value
            : next.exchange_rate_to_sale
        );

        next.amount_in_sale_currency =
          amount && rate ? String((amount * rate).toFixed(2)) : "";
      }

      if (field === "currency_id" && value === "1") {
        next.exchange_rate_to_sale = "1";
        next.amount_in_sale_currency = next.amount || "";
      }

      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const requiredFields = [
      "sale_id", "received_by", "payment_date",
      "payment_method", "payment_type", "amount", "currency_id"
    ];

    if (requiredFields.some(field => !form[field])) {
      notify(t.required);
      return;
    }

    const paymentData = {
      ...form,
      id: editingId || Math.max(0, ...payments.map(p => p.id)) + 1,
      sale_id: Number(form.sale_id),
      received_by: Number(form.received_by),
      currency_id: Number(form.currency_id),
      amount: Number(form.amount),
      exchange_rate_to_sale: Number(form.exchange_rate_to_sale || 1),
      amount_in_sale_currency: Number(form.amount_in_sale_currency || form.amount)
    };

    if (editingId) {
      setPayments(prev =>
        prev.map(payment =>
          payment.id === editingId ? paymentData : payment
        )
      );
      notify(t.successEdit);
    } else {
      setPayments(prev => [paymentData, ...prev]);
      notify(t.successAdd);
    }

    setModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = () => {
    setPayments(prev => prev.filter(payment => payment.id !== deleteId));
    setDeleteId(null);
    notify(t.successDelete);
  };

  const clearFilters = () => {
    setSearch("");
    setMethodFilter("");
    setTypeFilter("");
    setCurrencyFilter("");
    setPage(1);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

  const methodIcon = (method) => {
    if (method === "cash") return <Banknote size={16} />;
    if (method === "card") return <CreditCard size={16} />;
    if (method === "bank_transfer") return <ArrowDownLeft size={16} />;
    return <Receipt size={16} />;
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:p-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t.subtitle}
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          {t.add}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.total}</p>
              <h2 className="mt-2 text-2xl font-bold">
                {formatMoney(totalAmount)}
              </h2>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Wallet size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.records}</p>
              <h2 className="mt-2 text-2xl font-bold">{payments.length}</h2>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Receipt size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.cash}</p>
              <h2 className="mt-2 text-2xl font-bold">
                {payments.filter(p => p.payment_method === "cash").length}
              </h2>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <Banknote size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Filter size={17} />
          {t.paymentDetails}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
            <Search className={`absolute top-3 text-slate-400 ${isRTL ? "right-3" : "left-3"}`} size={17} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder={t.search}
              className={`${inputClass} ${isRTL ? "pr-10" : "pl-10"}`}
            />
          </div>

          <select
            value={methodFilter}
            onChange={e => { setMethodFilter(e.target.value); setPage(1); }}
            className={inputClass}
          >
            <option value="">{t.allMethods}</option>
            {methods.map(method => (
              <option key={method} value={method}>{t[method]}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
            className={inputClass}
          >
            <option value="">{t.allTypes}</option>
            {types.map(type => (
              <option key={type} value={type}>{t[type]}</option>
            ))}
          </select>

          <select
            value={currencyFilter}
            onChange={e => { setCurrencyFilter(e.target.value); setPage(1); }}
            className={inputClass}
          >
            <option value="">{t.allCurrencies}</option>
            {currencies.map(currency => (
              <option key={currency.id} value={currency.id}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={clearFilters}
          className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {t.clearFilters}
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
              <tr>
                {[ "#", t.sale, t.employee, t.date, t.method, t.type, t.amount, t.saleAmount, t.actions ].map((heading, index) => (
                  <th key={index} className="px-4 py-4 text-start font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentPayments.map(payment => (
                <tr key={payment.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-4 font-medium">#{payment.id}</td>
                  <td className="px-4 py-4">#{payment.sale_id}</td>
                  <td className="px-4 py-4">{getEmployee(payment.received_by)}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {new Date(payment.payment_date).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-2.5 py-1.5 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                      {methodIcon(payment.payment_method)}
                      {getMethodLabel(payment.payment_method)}
                    </span>
                  </td>
                  <td className="px-4 py-4">{getTypeLabel(payment.payment_type)}</td>
                  <td className="px-4 py-4 font-semibold">
                    {formatMoney(payment.amount)} {getCurrency(payment.currency_id)}
                  </td>
                  <td className="px-4 py-4 font-semibold">
                    {formatMoney(payment.amount_in_sale_currency)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(payment)}
                        title={t.edit}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        onClick={() => setDeleteId(payment.id)}
                        title={t.delete}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <Receipt size={35} className="mx-auto mb-3 opacity-40" />
            {t.noPayments}
          </div>
        )}
      </div>

      {/* Mobile and Tablet Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        {currentPayments.map(payment => (
          <div key={payment.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="font-bold">#{payment.id}</span>
              <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                {getTypeLabel(payment.payment_type)}
              </span>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">{t.sale}</span>
                <span>#{payment.sale_id}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">{t.employee}</span>
                <span>{getEmployee(payment.received_by)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">{t.method}</span>
                <span className="flex items-center gap-1.5">
                  {methodIcon(payment.payment_method)}
                  {getMethodLabel(payment.payment_method)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">{t.date}</span>
                <span>{new Date(payment.payment_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="text-slate-500">{t.amount}</span>
                <span className="font-bold">
                  {formatMoney(payment.amount)} {getCurrency(payment.currency_id)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">{t.saleAmount}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatMoney(payment.amount_in_sale_currency)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button onClick={() => openEdit(payment)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10">
                <Pencil size={17} />
              </button>
              <button onClick={() => setDeleteId(payment.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPayments.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
          {t.noPayments}
        </div>
      )}

      {/* Pagination */}
      {filteredPayments.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.showing} {Math.min((page - 1) * pageSize + 1, filteredPayments.length)}-
            {Math.min(page * pageSize, filteredPayments.length)} {t.of} {filteredPayments.length} {t.entries}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 p-2 disabled:opacity-40 dark:border-slate-700"
            >
              {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <span className="px-3 text-sm">{page} / {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-slate-200 p-2 disabled:opacity-40 dark:border-slate-700"
            >
              {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5">
          <div className="my-auto max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-slate-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-bold">{editingId ? t.edit : t.add}</h2>
              <button onClick={() => setModal(false)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>{t.sale} *</label>
                <select required value={form.sale_id} onChange={e => updateField("sale_id", e.target.value)} className={inputClass}>
                  <option value="">{t.selectSale}</option>
                  {sales.map(sale => <option key={sale.id} value={sale.id}>{sale.label}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>{t.employee} *</label>
                <select required value={form.received_by} onChange={e => updateField("received_by", e.target.value)} className={inputClass}>
                  <option value="">{t.selectEmployee}</option>
                  {employees.map(employee => <option key={employee.id} value={employee.id}>{employee.label}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>{t.date} *</label>
                <input required type="datetime-local" value={form.payment_date} onChange={e => updateField("payment_date", e.target.value)} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>{t.method} *</label>
                <select required value={form.payment_method} onChange={e => updateField("payment_method", e.target.value)} className={inputClass}>
                  {methods.map(method => <option key={method} value={method}>{t[method]}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>{t.type} *</label>
                <select required value={form.payment_type} onChange={e => updateField("payment_type", e.target.value)} className={inputClass}>
                  {types.map(type => <option key={type} value={type}>{t[type]}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>{t.currency} *</label>
                <select required value={form.currency_id} onChange={e => updateField("currency_id", e.target.value)} className={inputClass}>
                  <option value="">{t.selectCurrency}</option>
                  {currencies.map(currency => <option key={currency.id} value={currency.id}>{currency.label}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>{t.amount} *</label>
                <input required min="0.01" step="0.01" type="number" value={form.amount} onChange={e => updateField("amount", e.target.value)} className={inputClass} placeholder="0.00" />
              </div>

              <div>
                <label className={labelClass}>{t.exchangeRate}</label>
                <input min="0.000001" step="0.000001" type="number" value={form.exchange_rate_to_sale} onChange={e => updateField("exchange_rate_to_sale", e.target.value)} className={inputClass} placeholder="1.000000" />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>{t.saleAmount}</label>
                <input readOnly type="number" value={form.amount_in_sale_currency} className={`${inputClass} bg-slate-50 dark:bg-slate-800/60`} />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:col-span-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setModal(false)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                  {t.cancel}
                </button>
                <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  {editingId ? t.update : t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10">
              <Trash2 size={23} />
            </div>
            <h3 className="text-center text-lg font-bold">{t.delete}</h3>
            <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">{t.confirmDelete}</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium dark:border-slate-700">
                {t.cancel}
              </button>
              <button onClick={handleDelete} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700">
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm text-white shadow-xl">
          <CheckCircle2 size={18} className="text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
