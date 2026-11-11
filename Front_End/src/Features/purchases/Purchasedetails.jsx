

import { useMemo, useState } from "react";
import {
  Search, Plus, Pencil, Trash2, Eye, X,
  ShoppingBag, Package, MapPin, Hash, DollarSign
} from "lucide-react";

const translations = {
  en: {
    title: "Purchase Details",
    subtitle: "Manage purchased carpet items",
    totalItems: "Total Items",
    totalQuantity: "Total Quantity",
    totalAmount: "Total Amount",
    search: "Search by purchase, carpet or location...",
    add: "Add Detail",
    id: "ID",
    purchase: "Purchase ID",
    carpet: "Carpet ID",
    location: "Location ID",
    quantity: "Quantity",
    price: "Purchase Price",
    amount: "Line Total",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    save: "Save",
    cancel: "Cancel",
    addTitle: "Add Purchase Detail",
    editTitle: "Edit Purchase Detail",
    details: "Detail Information",
    noData: "No purchase details found",
    confirmDelete: "Are you sure you want to delete this item?",
    required: "Please fill in all required fields.",
    close: "Close"
  },
  fa: {
    title: "جزئیات خرید",
    subtitle: "مدیریت اقلام خریداری‌شده فرش",
    totalItems: "تعداد اقلام",
    totalQuantity: "مجموع تعداد",
    totalAmount: "مجموع قیمت",
    search: "جستجو بر اساس خرید، فرش یا موقعیت...",
    add: "افزودن جزئیات",
    id: "شناسه",
    purchase: "شناسه خرید",
    carpet: "شناسه فرش",
    location: "شناسه موقعیت",
    quantity: "تعداد",
    price: "قیمت خرید",
    amount: "مجموع قیمت",
    actions: "عملیات",
    edit: "ویرایش",
    delete: "حذف",
    view: "مشاهده",
    save: "ذخیره",
    cancel: "لغو",
    addTitle: "افزودن جزئیات خرید",
    editTitle: "ویرایش جزئیات خرید",
    details: "معلومات جزئیات",
    noData: "جزئیات خریدی یافت نشد",
    confirmDelete: "آیا از حذف این مورد اطمینان دارید؟",
    required: "لطفاً تمام فیلدهای ضروری را تکمیل کنید.",
    close: "بستن"
  },
  ps: {
    title: "د پېرود تفصیلات",
    subtitle: "د پېرودل شوو غالیو توکي اداره کړئ",
    totalItems: "د توکو شمېر",
    totalQuantity: "ټول شمېر",
    totalAmount: "ټوله بیه",
    search: "د پېرود، غالۍ یا ځای له مخې لټون...",
    add: "تفصیلات زیات کړئ",
    id: "شمېره",
    purchase: "د پېرود شمېره",
    carpet: "د غالۍ شمېره",
    location: "د ځای شمېره",
    quantity: "اندازه",
    price: "د پېرود بیه",
    amount: "ټوله بیه",
    actions: "کړنې",
    edit: "سمون",
    delete: "حذف",
    view: "کتل",
    save: "ساتل",
    cancel: "لغوه",
    addTitle: "د پېرود تفصیلات زیاتول",
    editTitle: "د پېرود تفصیلات سمول",
    details: "د تفصیلاتو معلومات",
    noData: "د پېرود تفصیلات ونه موندل شول",
    confirmDelete: "ایا غواړئ دا توکی حذف کړئ؟",
    required: "مهرباني وکړئ ټول اړین ځایونه ډک کړئ.",
    close: "بندول"
  }
};

const initialData = [
  { id: 1, purchase_id: 1, carpet_id: 1, location_id: 2, quantity: 1, purchase_price: 35000 },
  { id: 2, purchase_id: 2, carpet_id: 2, location_id: 2, quantity: 1, purchase_price: 28000 },
  { id: 3, purchase_id: 3, carpet_id: 3, location_id: 2, quantity: 1, purchase_price: 9000 },
  { id: 4, purchase_id: 4, carpet_id: 4, location_id: 5, quantity: 1, purchase_price: 18000 },
  { id: 5, purchase_id: 5, carpet_id: 5, location_id: 2, quantity: 1, purchase_price: 4000 }
];

const emptyForm = {
  purchase_id: "",
  carpet_id: "",
  location_id: "",
  quantity: 1,
  purchase_price: ""
};

export default function PurchaseDetail() {
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
        item.carpet_id,
        item.location_id
      ].some(value => String(value).toLowerCase().includes(term))
    );
  }, [data, search]);

  const totalQuantity = data.reduce(
    (sum, item) => sum + Number(item.quantity), 0
  );

  const totalAmount = data.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.purchase_price), 0
  );

  const money = value => Number(value).toLocaleString();

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = item => {
    setEditingId(item.id);
    setForm({
      purchase_id: item.purchase_id,
      carpet_id: item.carpet_id,
      location_id: item.location_id,
      quantity: item.quantity,
      purchase_price: item.purchase_price
    });
    setModal(true);
  };

  const handleSave = e => {
    e.preventDefault();

    const requiredFields = [
      form.purchase_id,
      form.carpet_id,
      form.location_id,
      form.quantity,
      form.purchase_price
    ];

    if (requiredFields.some(value => value === "" || value === null)) {
      alert(t.required);
      return;
    }

    const item = {
      ...form,
      purchase_id: Number(form.purchase_id),
      carpet_id: Number(form.carpet_id),
      location_id: Number(form.location_id),
      quantity: Number(form.quantity),
      purchase_price: Number(form.purchase_price)
    };

    if (
      item.quantity <= 0 ||
      item.purchase_price < 0 ||
      !Number.isFinite(item.purchase_price)
    ) {
      alert(t.required);
      return;
    }

    if (editingId) {
      setData(prev =>
        prev.map(row =>
          row.id === editingId ? { ...row, ...item } : row
        )
      );
    } else {
      const newId = Math.max(0, ...data.map(row => row.id)) + 1;
      setData(prev => [...prev, { id: newId, ...item }]);
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
      label: t.totalItems,
      value: data.length,
      icon: Package,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30"
    },
    {
      label: t.totalQuantity,
      value: totalQuantity,
      icon: ShoppingBag,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30"
    },
    {
      label: t.totalAmount,
      value: money(totalAmount),
      icon: DollarSign,
      color: "text-green-600 bg-green-100 dark:bg-green-900/30"
    }
  ];

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="min-h-full space-y-6 bg-gray-50 p-4 dark:bg-gray-950 sm:p-6">

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

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <div className="relative max-w-md">
            <Search
              size={18}
              className={`absolute top-3 text-gray-400 ${rtl ? "right-3" : "left-3"}`}
            />
            <input
              type="text"
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
                {[t.id, t.purchase, t.carpet, t.location, t.quantity, t.price, t.amount, t.actions].map((heading, i) => (
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
                  <td className="px-5 py-4 text-gray-700 dark:text-gray-300">#{item.carpet_id}</td>
                  <td className="px-5 py-4 text-gray-700 dark:text-gray-300">#{item.location_id}</td>
                  <td className="px-5 py-4 text-gray-700 dark:text-gray-300">{item.quantity}</td>
                  <td className="px-5 py-4 text-gray-700 dark:text-gray-300">{money(item.purchase_price)}</td>
                  <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                    {money(item.quantity * item.purchase_price)}
                  </td>
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
                  <td colSpan="8" className="px-5 py-12 text-center text-gray-500 dark:text-gray-400">
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
                  {t.purchase} #{item.purchase_id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{t.carpet}</p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">#{item.carpet_id}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{t.location}</p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">#{item.location_id}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{t.quantity}</p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">{item.quantity}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{t.price}</p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">{money(item.purchase_price)}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.amount}</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {money(item.quantity * item.purchase_price)}
                  </p>
                </div>
                <div className="flex gap-1">
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
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingId ? t.editTitle : t.addTitle}
              </h2>
              <button onClick={() => setModal(false)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 p-5">
              {[
                { key: "purchase_id", label: t.purchase, min: 1 },
                { key: "carpet_id", label: t.carpet, min: 1 },
                { key: "location_id", label: t.location, min: 1 },
                { key: "quantity", label: t.quantity, min: 1 },
                { key: "purchase_price", label: t.price, min: 0 }
              ].map(field => (
                <div key={field.key}>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    min={field.min}
                    step={field.key === "purchase_price" ? "0.01" : "1"}
                    required
                    value={form[field.key]}
                    onChange={e => setForm({
                      ...form,
                      [field.key]: e.target.value
                    })}
                    className={inputClass}
                  />
                </div>
              ))}

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-gray-900">
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
                [t.carpet, viewItem.carpet_id],
                [t.location, viewItem.location_id],
                [t.quantity, viewItem.quantity],
                [t.price, money(viewItem.purchase_price)],
                [t.amount, money(viewItem.quantity * viewItem.purchase_price)]
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-gray-100 pb-3 text-sm dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">{label}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
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
