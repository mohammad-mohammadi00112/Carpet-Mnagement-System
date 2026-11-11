

import { useMemo, useState } from "react";
import {
  Search, Plus, Pencil, Trash2, X, Eye,
  ShoppingCart, Package, MapPin, DollarSign
} from "lucide-react";

const translations = {
  en: {
    title: "Sale Details",
    subtitle: "Manage items included in sales",
    search: "Search sale, carpet or location...",
    add: "Add Sale Detail",
    total: "Total Items",
    quantity: "Total Quantity",
    revenue: "Total Amount",
    discounts: "Total Discounts",
    sale: "Sale ID",
    carpet: "Carpet ID",
    location: "Location ID",
    qty: "Quantity",
    price: "Sale Price",
    discount: "Discount",
    amount: "Final Amount",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    save: "Save",
    cancel: "Cancel",
    addTitle: "Add Sale Detail",
    editTitle: "Edit Sale Detail",
    details: "Sale Detail Information",
    noData: "No sale details found",
    confirmDelete: "Are you sure you want to delete this item?",
    required: "Please fill in all required fields.",
    salePlaceholder: "Enter sale ID",
    carpetPlaceholder: "Enter carpet ID",
    locationPlaceholder: "Enter location ID",
    qtyPlaceholder: "Enter quantity",
    pricePlaceholder: "Enter sale price",
    discountPlaceholder: "Enter discount",
    close: "Close",
    currency: "AFN"
  },
  fa: {
    title: "جزئیات فروش",
    subtitle: "مدیریت اقلام شامل‌شده در فروش‌ها",
    search: "جستجوی فروش، فرش یا موقعیت...",
    add: "افزودن جزئیات فروش",
    total: "تعداد اقلام",
    quantity: "مجموع تعداد",
    revenue: "مجموع مبلغ",
    discounts: "مجموع تخفیف‌ها",
    sale: "شماره فروش",
    carpet: "شماره فرش",
    location: "شماره موقعیت",
    qty: "تعداد",
    price: "قیمت فروش",
    discount: "تخفیف",
    amount: "مبلغ نهایی",
    actions: "عملیات",
    edit: "ویرایش",
    delete: "حذف",
    view: "مشاهده",
    save: "ذخیره",
    cancel: "لغو",
    addTitle: "افزودن جزئیات فروش",
    editTitle: "ویرایش جزئیات فروش",
    details: "معلومات جزئیات فروش",
    noData: "هیچ جزئیات فروشی یافت نشد",
    confirmDelete: "آیا مطمئن هستید که این مورد حذف شود؟",
    required: "لطفاً تمام فیلدهای ضروری را خانه‌پری کنید.",
    salePlaceholder: "شماره فروش را وارد کنید",
    carpetPlaceholder: "شماره فرش را وارد کنید",
    locationPlaceholder: "شماره موقعیت را وارد کنید",
    qtyPlaceholder: "تعداد را وارد کنید",
    pricePlaceholder: "قیمت فروش را وارد کنید",
    discountPlaceholder: "تخفیف را وارد کنید",
    close: "بستن",
    currency: "افغانی"
  },
  ps: {
    title: "د پلور جزئیات",
    subtitle: "د پلور توکي مدیریت کړئ",
    search: "پلور، غالۍ یا ځای ولټوئ...",
    add: "د پلور جزئیات اضافه کړئ",
    total: "د توکو شمېر",
    quantity: "ټول شمېر",
    revenue: "ټوله اندازه",
    discounts: "ټول تخفیفونه",
    sale: "د پلور شمېره",
    carpet: "د غالۍ شمېره",
    location: "د ځای شمېره",
    qty: "شمېر",
    price: "د پلور بیه",
    discount: "تخفیف",
    amount: "وروستۍ اندازه",
    actions: "کړنې",
    edit: "سمون",
    delete: "ړنګول",
    view: "کتل",
    save: "ساتل",
    cancel: "لغوه",
    addTitle: "د پلور جزئیات اضافه کړئ",
    editTitle: "د پلور جزئیات سمول",
    details: "د پلور جزئیاتو معلومات",
    noData: "د پلور جزئیات ونه موندل شول",
    confirmDelete: "ایا غواړئ دا توکی ړنګ کړئ؟",
    required: "مهرباني وکړئ اړین معلومات بشپړ کړئ.",
    salePlaceholder: "د پلور شمېره ولیکئ",
    carpetPlaceholder: "د غالۍ شمېره ولیکئ",
    locationPlaceholder: "د ځای شمېره ولیکئ",
    qtyPlaceholder: "شمېر ولیکئ",
    pricePlaceholder: "د پلور بیه ولیکئ",
    discountPlaceholder: "تخفیف ولیکئ",
    close: "بندول",
    currency: "افغانۍ"
  }
};

const initialDetails = [
  { id: 1, sale_id: 1, carpet_id: 1, location_id: 1, quantity: 1, sale_price: 42000, discount: 0 },
  { id: 2, sale_id: 2, carpet_id: 2, location_id: 1, quantity: 1, sale_price: 34000, discount: 1000 },
  { id: 3, sale_id: 3, carpet_id: 3, location_id: 3, quantity: 1, sale_price: 12500, discount: 500 },
  { id: 4, sale_id: 4, carpet_id: 4, location_id: 5, quantity: 1, sale_price: 24000, discount: 0 },
  { id: 5, sale_id: 5, carpet_id: 5, location_id: 4, quantity: 1, sale_price: 6000, discount: 0 }
];

const emptyForm = {
  sale_id: "",
  carpet_id: "",
  location_id: "",
  quantity: 1,
  sale_price: "",
  discount: 0
};

export default function SaleDetails() {
  const language = localStorage.getItem("language") || "en";
  const t = translations[language] || translations.en;
  const isRTL = language === "fa" || language === "ps";

  const [details, setDetails] = useState(initialDetails);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const money = (value) =>
    Number(value || 0).toLocaleString(
      language === "en" ? "en-US" : language === "ps" ? "ps-AF" : "fa-IR"
    );

  const filteredDetails = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return details;

    return details.filter((item) =>
      [item.id, item.sale_id, item.carpet_id, item.location_id]
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [details, search]);

  const totalQuantity = details.reduce(
    (sum, item) => sum + Number(item.quantity), 0
  );

  const totalAmount = details.reduce(
    (sum, item) =>
      sum + Number(item.quantity) * Number(item.sale_price) - Number(item.discount),
    0
  );

  const totalDiscount = details.reduce(
    (sum, item) => sum + Number(item.discount), 0
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      sale_id: item.sale_id,
      carpet_id: item.carpet_id,
      location_id: item.location_id,
      quantity: item.quantity,
      sale_price: item.sale_price,
      discount: item.discount
    });
    setModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (
      !form.sale_id || !form.carpet_id || !form.location_id ||
      !form.quantity || !form.sale_price ||
      Number(form.quantity) <= 0 ||
      Number(form.sale_price) < 0 ||
      Number(form.discount) < 0
    ) {
      alert(t.required);
      return;
    }

    const item = {
      id: editingId || Math.max(0, ...details.map((d) => d.id)) + 1,
      sale_id: Number(form.sale_id),
      carpet_id: Number(form.carpet_id),
      location_id: Number(form.location_id),
      quantity: Number(form.quantity),
      sale_price: Number(form.sale_price),
      discount: Number(form.discount || 0)
    };

    if (editingId) {
      setDetails((prev) =>
        prev.map((d) => d.id === editingId ? item : d)
      );
    } else {
      setDetails((prev) => [...prev, item]);
    }

    setModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    setDetails((prev) => prev.filter((item) => item.id !== id));
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white";

  const cardClass =
    "rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-6 p-3 sm:p-5 lg:p-6 text-gray-800 dark:text-gray-100">

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          {t.add}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.total}</p>
            <ShoppingCart className="text-blue-500" />
          </div>
          <p className="mt-3 text-2xl font-bold">{details.length}</p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.quantity}</p>
            <Package className="text-purple-500" />
          </div>
          <p className="mt-3 text-2xl font-bold">{money(totalQuantity)}</p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.revenue}</p>
            <DollarSign className="text-green-500" />
          </div>
          <p className="mt-3 text-2xl font-bold">{money(totalAmount)}</p>
          <p className="mt-1 text-xs text-gray-400">{t.currency}</p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.discounts}</p>
            <DollarSign className="text-orange-500" />
          </div>
          <p className="mt-3 text-2xl font-bold">{money(totalDiscount)}</p>
          <p className="mt-1 text-xs text-gray-400">{t.currency}</p>
        </div>
      </div>

      <div className={cardClass}>
        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? "right-3" : "left-3"}`}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            className={`${inputClass} ${isRTL ? "pr-10" : "pl-10"}`}
          />
        </div>

        <div className="mt-5 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[850px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                {[t.sale, t.carpet, t.location, t.qty, t.price, t.discount, t.amount, t.actions].map((heading) => (
                  <th key={heading} className="px-3 py-3 text-start font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredDetails.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                  <td className="px-3 py-4 font-semibold">#{item.sale_id}</td>
                  <td className="px-3 py-4">#{item.carpet_id}</td>
                  <td className="px-3 py-4">#{item.location_id}</td>
                  <td className="px-3 py-4">{item.quantity}</td>
                  <td className="px-3 py-4">{money(item.sale_price)}</td>
                  <td className="px-3 py-4 text-orange-500">{money(item.discount)}</td>
                  <td className="px-3 py-4 font-semibold">{money(item.quantity * item.sale_price - item.discount)}</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewItem(item)} className="rounded-lg p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20" title={t.view}>
                        <Eye size={17} />
                      </button>
                      <button onClick={() => openEdit(item)} className="rounded-lg p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20" title={t.edit}>
                        <Pencil size={17} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" title={t.delete}>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid gap-3 md:hidden">
          {filteredDetails.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="font-bold">#{item.id} · {t.sale} #{item.sale_id}</span>
                <span className="text-sm font-semibold text-green-600">
                  {money(item.quantity * item.sale_price - item.discount)} {t.currency}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <p className="text-gray-500 dark:text-gray-400">{t.carpet}: <span className="font-medium text-gray-800 dark:text-white">#{item.carpet_id}</span></p>
                <p className="text-gray-500 dark:text-gray-400">{t.location}: <span className="font-medium text-gray-800 dark:text-white">#{item.location_id}</span></p>
                <p className="text-gray-500 dark:text-gray-400">{t.qty}: <span className="font-medium text-gray-800 dark:text-white">{item.quantity}</span></p>
                <p className="text-gray-500 dark:text-gray-400">{t.price}: <span className="font-medium text-gray-800 dark:text-white">{money(item.sale_price)}</span></p>
              </div>
              <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                <button onClick={() => setViewItem(item)} className="rounded-lg p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"><Eye size={17} /></button>
                <button onClick={() => openEdit(item)} className="rounded-lg p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"><Pencil size={17} /></button>
                <button onClick={() => handleDelete(item.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={17} /></button>
              </div>
            </div>
          ))}
        </div>

        {filteredDetails.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">{t.noData}</p>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">{editingId ? t.editTitle : t.addTitle}</h2>
              <button onClick={() => setModal(false)} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">{t.sale}</span>
                  <input type="number" min="1" required value={form.sale_id} onChange={(e) => setForm({ ...form, sale_id: e.target.value })} placeholder={t.salePlaceholder} className={inputClass} />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium">{t.carpet}</span>
                  <input type="number" min="1" required value={form.carpet_id} onChange={(e) => setForm({ ...form, carpet_id: e.target.value })} placeholder={t.carpetPlaceholder} className={inputClass} />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium">{t.location}</span>
                  <input type="number" min="1" required value={form.location_id} onChange={(e) => setForm({ ...form, location_id: e.target.value })} placeholder={t.locationPlaceholder} className={inputClass} />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium">{t.qty}</span>
                  <input type="number" min="1" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder={t.qtyPlaceholder} className={inputClass} />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium">{t.price}</span>
                  <input type="number" min="0" step="0.01" required value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} placeholder={t.pricePlaceholder} className={inputClass} />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium">{t.discount}</span>
                  <input type="number" min="0" step="0.01" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder={t.discountPlaceholder} className={inputClass} />
                </label>
              </div>

              <div className="flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setModal(false)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">{t.cancel}</button>
                <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">{t.details}</h2>
              <button onClick={() => setViewItem(null)} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} /></button>
            </div>

            <div className="space-y-3 text-sm">
              {[
                [t.sale, `#${viewItem.sale_id}`],
                [t.carpet, `#${viewItem.carpet_id}`],
                [t.location, `#${viewItem.location_id}`],
                [t.qty, viewItem.quantity],
                [t.price, `${money(viewItem.sale_price)} ${t.currency}`],
                [t.discount, `${money(viewItem.discount)} ${t.currency}`],
                [t.amount, `${money(viewItem.quantity * viewItem.sale_price - viewItem.discount)} ${t.currency}`]
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3 border-b border-gray-100 pb-2 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>

            <button onClick={() => setViewItem(null)} className="mt-5 w-full rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold dark:bg-gray-800">{t.close}</button>
          </div>
        </div>
      )}
    </div>
  );
}
