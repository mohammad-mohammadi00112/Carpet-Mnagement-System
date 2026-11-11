

import { useMemo, useState } from "react";
import {
  Search, Plus, Pencil, Trash2, Eye, X,
  Wallet, CreditCard, Banknote, DollarSign
} from "lucide-react";

const translations = {
  en: {
    title: "Purchase Payments",
    subtitle: "Manage payments made for purchases",
    totalPayments: "Total Payments",
    totalAmount: "Total Paid",
    cashPayments: "Cash Payments",
    search: "Search by purchase ID or payment method...",
    add: "Add Payment",
    id: "ID",
    purchase: "Purchase ID",
    date: "Payment Date",
    method: "Payment Method",
    amount: "Amount",
    currency: "Currency ID",
    rate: "Exchange Rate",
    notes: "Notes",
    actions: "Actions",
    cash: "Cash",
    bank_transfer: "Bank Transfer",
    card: "Card",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    save: "Save",
    cancel: "Cancel",
    addTitle: "Add Purchase Payment",
    editTitle: "Edit Purchase Payment",
    details: "Payment Details",
    noData: "No payments found",
    confirmDelete: "Are you sure you want to delete this payment?",
    required: "Please fill in all required fields.",
    close: "Close",
    selectMethod: "Select payment method",
    createdBy: "Created By"
  },
  fa: {
    title: "پرداخت‌های خرید",
    subtitle: "مدیریت پرداخت‌های انجام‌شده برای خریدها",
    totalPayments: "تعداد پرداخت‌ها",
    totalAmount: "مجموع پرداختی",
    cashPayments: "پرداخت نقدی",
    search: "جستجو بر اساس شناسه خرید یا روش پرداخت...",
    add: "افزودن پرداخت",
    id: "شناسه",
    purchase: "شناسه خرید",
    date: "تاریخ پرداخت",
    method: "روش پرداخت",
    amount: "مبلغ",
    currency: "شناسه ارز",
    rate: "نرخ تبادله",
    notes: "یادداشت",
    actions: "عملیات",
    cash: "نقدی",
    bank_transfer: "انتقال بانکی",
    card: "کارت",
    edit: "ویرایش",
    delete: "حذف",
    view: "مشاهده",
    save: "ذخیره",
    cancel: "لغو",
    addTitle: "افزودن پرداخت خرید",
    editTitle: "ویرایش پرداخت خرید",
    details: "جزئیات پرداخت",
    noData: "پرداختی یافت نشد",
    confirmDelete: "آیا از حذف این پرداخت اطمینان دارید؟",
    required: "لطفاً تمام فیلدهای ضروری را تکمیل کنید.",
    close: "بستن",
    selectMethod: "روش پرداخت را انتخاب کنید",
    createdBy: "ثبت‌کننده"
  },
  ps: {
    title: "د پېرود تادیات",
    subtitle: "د پېرودونو د تادیاتو اداره",
    totalPayments: "د تادیاتو شمېر",
    totalAmount: "ټولې تادیې",
    cashPayments: "نغدي تادیې",
    search: "د پېرود شمېرې یا تادیې طریقې له مخې لټون...",
    add: "تادیه زیاتول",
    id: "شمېره",
    purchase: "د پېرود شمېره",
    date: "د تادیې نېټه",
    method: "د تادیې طریقه",
    amount: "اندازه",
    currency: "د اسعارو شمېره",
    rate: "د تبادلې نرخ",
    notes: "یادښتونه",
    actions: "کړنې",
    cash: "نغدې",
    bank_transfer: "بانکي لېږد",
    card: "کارت",
    edit: "سمون",
    delete: "حذف",
    view: "کتل",
    save: "ساتل",
    cancel: "لغوه",
    addTitle: "د پېرود تادیه زیاتول",
    editTitle: "د پېرود تادیه سمول",
    details: "د تادیې تفصیلات",
    noData: "تادیه ونه موندل شوه",
    confirmDelete: "ایا غواړئ دا تادیه حذف کړئ؟",
    required: "مهرباني وکړئ ټول اړین ځایونه ډک کړئ.",
    close: "بندول",
    selectMethod: "د تادیې طریقه وټاکئ",
    createdBy: "ثبت کوونکی"
  }
};

const initialData = [
  {
    id: 1,
    purchase_id: 1,
    payment_date: "2026-09-01T10:00",
    payment_method: "cash",
    amount: 35000,
    currency_id: 1,
    exchange_rate: 1,
    notes: "Paid in full",
    created_by: 1
  },
  {
    id: 2,
    purchase_id: 2,
    payment_date: "2026-09-03T11:00",
    payment_method: "bank_transfer",
    amount: 200,
    currency_id: 2,
    exchange_rate: 70,
    notes: "Part payment",
    created_by: 1
  },
  {
    id: 3,
    purchase_id: 3,
    payment_date: "2026-09-05T12:00",
    payment_method: "cash",
    amount: 0,
    currency_id: 1,
    exchange_rate: 1,
    notes: "Not paid yet",
    created_by: 1
  },
  {
    id: 4,
    purchase_id: 4,
    payment_date: "2026-09-08T09:30",
    payment_method: "card",
    amount: 18000,
    currency_id: 1,
    exchange_rate: 1,
    notes: "Paid in full",
    created_by: 1
  },
  {
    id: 5,
    purchase_id: 5,
    payment_date: "2026-09-10T14:00",
    payment_method: "cash",
    amount: 4000,
    currency_id: 1,
    exchange_rate: 1,
    notes: "Paid in full",
    created_by: 1
  }
];

const emptyForm = {
  purchase_id: "",
  payment_date: "",
  payment_method: "",
  amount: "",
  currency_id: "",
  exchange_rate: "",
  notes: "",
  created_by: 1
};

export default function PurchasePayments() {
  const language = localStorage.getItem("language") || "en";
  const t = translations[language] || translations.en;
  const rtl = language === "fa" || language === "ps";

  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredData = useMemo(() => {
    const term = search.toLowerCase().trim();

    return data.filter(item =>
      [
        item.id,
        item.purchase_id,
        item.payment_method,
        item.amount,
        item.currency_id
      ].some(value => String(value).toLowerCase().includes(term))
    );
  }, [data, search]);

  const totalAmount = data.reduce(
    (sum, item) => sum + Number(item.amount), 0
  );

  const cashCount = data.filter(
    item => item.payment_method === "cash"
  ).length;

  const money = value => Number(value).toLocaleString();

  const formatDate = value => {
    if (!value) return "-";
    return value.replace("T", " ");
  };

  const methodLabel = method => t[method] || method;

  const openAdd = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      payment_date: new Date().toISOString().slice(0, 16)
    });
    setModal(true);
  };

  const openEdit = item => {
    setEditingId(item.id);
    setForm({
      ...item,
      payment_date: item.payment_date.slice(0, 16)
    });
    setModal(true);
  };

  const handleSave = e => {
    e.preventDefault();

    if (
      !form.purchase_id ||
      !form.payment_date ||
      !form.payment_method ||
      form.amount === "" ||
      !form.currency_id ||
      form.exchange_rate === ""
    ) {
      alert(t.required);
      return;
    }

    const amount = Number(form.amount);
    const rate = Number(form.exchange_rate);

    if (
      !Number.isFinite(amount) ||
      amount < 0 ||
      !Number.isFinite(rate) ||
      rate <= 0
    ) {
      alert(t.required);
      return;
    }

    const payment = {
      ...form,
      purchase_id: Number(form.purchase_id),
      amount,
      currency_id: Number(form.currency_id),
      exchange_rate: rate,
      created_by: Number(form.created_by) || 1
    };

    if (editingId) {
      setData(prev =>
        prev.map(item =>
          item.id === editingId ? { ...item, ...payment } : item
        )
      );
    } else {
      const newId = Math.max(0, ...data.map(item => item.id)) + 1;
      setData(prev => [...prev, { id: newId, ...payment }]);
    }

    setModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = id => {
    if (window.confirm(t.confirmDelete)) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900";

  const stats = [
    {
      label: t.totalPayments,
      value: data.length,
      icon: Wallet,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30"
    },
    {
      label: t.totalAmount,
      value: money(totalAmount),
      icon: DollarSign,
      color: "text-green-600 bg-green-100 dark:bg-green-900/30"
    },
    {
      label: t.cashPayments,
      value: cashCount,
      icon: Banknote,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30"
    }
  ];

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className="min-h-full space-y-6 bg-gray-50 p-4 dark:bg-gray-950 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t.subtitle}
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          {t.add}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </h3>
                </div>
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <div className="relative max-w-md">
            <Search
              size={18}
              className={`absolute top-3 text-gray-400 ${rtl ? "right-3" : "left-3"}`}
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.search}
              className={`${inputClass} ${rtl ? "pr-10" : "pl-10"}`}
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                {[t.id, t.purchase, t.date, t.method, t.amount, t.currency, t.actions].map((heading, i) => (
                  <th key={i} className="whitespace-nowrap px-5 py-4 text-start font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredData.map(item => (
                <tr key={item.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-5 py-4 font-medium text-gray-700 dark:text-gray-300">#{item.id}</td>
                  <td className="px-5 py-4 text-gray-700 dark:text-gray-300">#{item.purchase_id}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-gray-700 dark:text-gray-300">{formatDate(item.payment_date)}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {methodLabel(item.payment_method)}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">{money(item.amount)}</td>
                  <td className="px-5 py-4 text-gray-700 dark:text-gray-300">#{item.currency_id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewItem(item)} title={t.view} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                        <Eye size={17} />
                      </button>
                      <button onClick={() => openEdit(item)} title={t.edit} className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30">
                        <Pencil size={17} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} title={t.delete} className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-gray-500 dark:text-gray-400">
                    {t.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="grid gap-3 p-4 md:hidden">
          {filteredData.map(item => (
            <div key={item.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">#{item.id}</span>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {methodLabel(item.payment_method)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{t.purchase}</p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">#{item.purchase_id}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{t.date}</p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">{formatDate(item.payment_date)}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{t.amount}</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">{money(item.amount)}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{t.currency}</p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">#{item.currency_id}</p>
                </div>
              </div>

              <div className="mt-3 flex justify-end gap-1 border-t border-gray-100 pt-3 dark:border-gray-700">
                <button onClick={() => setViewItem(item)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                  <Eye size={17} />
                </button>
                <button onClick={() => openEdit(item)} className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30">
                  <Pencil size={17} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30">
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <p className="py-10 text-center text-gray-500 dark:text-gray-400">
              {t.noData}
            </p>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingId ? t.editTitle : t.addTitle}
              </h2>
              <button onClick={() => setModal(false)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.purchase}</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={form.purchase_id}
                  onChange={e => setForm({ ...form, purchase_id: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.date}</label>
                <input
                  type="datetime-local"
                  required
                  value={form.payment_date}
                  onChange={e => setForm({ ...form, payment_date: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.method}</label>
                <select
                  required
                  value={form.payment_method}
                  onChange={e => setForm({ ...form, payment_method: e.target.value })}
                  className={inputClass}
                >
                  <option value="">{t.selectMethod}</option>
                  <option value="cash">{t.cash}</option>
                  <option value="bank_transfer">{t.bank_transfer}</option>
                  <option value="card">{t.card}</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.amount}</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.currency}</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={form.currency_id}
                  onChange={e => setForm({ ...form, currency_id: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.rate}</label>
                <input
                  type="number"
                  min="0.000001"
                  step="0.000001"
                  required
                  value={form.exchange_rate}
                  onChange={e => setForm({ ...form, exchange_rate: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.notes}</label>
                <textarea
                  rows="3"
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2 flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t.details} #{viewItem.id}
              </h2>
              <button onClick={() => setViewItem(null)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              {[
                [t.id, viewItem.id],
                [t.purchase, viewItem.purchase_id],
                [t.date, formatDate(viewItem.payment_date)],
                [t.method, methodLabel(viewItem.payment_method)],
                [t.amount, money(viewItem.amount)],
                [t.currency, viewItem.currency_id],
                [t.rate, viewItem.exchange_rate],
                [t.notes, viewItem.notes || "-"],
                [t.createdBy, viewItem.created_by]
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-gray-100 pb-3 text-sm dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">{label}</span>
                  <span className="max-w-[65%] break-words text-end font-semibold text-gray-900 dark:text-white">{value}</span>
                </div>
              ))}
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => setViewItem(null)}
                className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
