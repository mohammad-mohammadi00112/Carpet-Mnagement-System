import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  ShoppingCart,
  Package,
  DollarSign,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  getSaleDetails,
  createSaleDetail,
  updateSaleDetail,
  deleteSaleDetail,
} from "../services/sales/saleDetailService";

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
    saving: "Saving...",
    cancel: "Cancel",
    addTitle: "Add Sale Detail",
    editTitle: "Edit Sale Detail",
    details: "Sale Detail Information",
    noData: "No sale details found",
    loading: "Loading sale details...",
    confirmDelete: "Are you sure you want to delete this item?",
    required: "Please enter valid values in all required fields.",
    salePlaceholder: "Enter sale ID",
    carpetPlaceholder: "Enter carpet ID",
    locationPlaceholder: "Enter location ID",
    qtyPlaceholder: "Enter quantity",
    pricePlaceholder: "Enter sale price",
    discountPlaceholder: "Enter discount",
    close: "Close",
    currency: "AFN",
    retry: "Retry",
    refresh: "Refresh",
    loadError: "Could not load sale details.",
    saveError: "Could not save sale detail.",
    deleteError: "Could not delete sale detail.",
    createSuccess: "Sale detail created successfully.",
    updateSuccess: "Sale detail updated successfully.",
    deleteSuccess: "Sale detail deleted successfully.",
    stockHint: "Stock is updated automatically when sale details are added, edited or deleted.",
  },
  fa: {
    title: "جزئیات فروش",
    subtitle: "مدیریت اقلام شامل‌شده در فروش‌ها",
    search: "جستجوی فروش، قالین یا موقعیت...",
    add: "افزودن جزئیات فروش",
    total: "تعداد اقلام",
    quantity: "مجموع تعداد",
    revenue: "مجموع مبلغ",
    discounts: "مجموع تخفیف‌ها",
    sale: "شماره فروش",
    carpet: "شماره قالین",
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
    saving: "در حال ذخیره...",
    cancel: "لغو",
    addTitle: "افزودن جزئیات فروش",
    editTitle: "ویرایش جزئیات فروش",
    details: "معلومات جزئیات فروش",
    noData: "هیچ جزئیات فروشی یافت نشد",
    loading: "در حال بارگذاری جزئیات فروش...",
    confirmDelete: "آیا مطمئن هستید که این مورد حذف شود؟",
    required: "لطفاً مقادیر معتبر را در تمام خانه‌های ضروری وارد کنید.",
    salePlaceholder: "شماره فروش را وارد کنید",
    carpetPlaceholder: "شماره قالین را وارد کنید",
    locationPlaceholder: "شماره موقعیت را وارد کنید",
    qtyPlaceholder: "تعداد را وارد کنید",
    pricePlaceholder: "قیمت فروش را وارد کنید",
    discountPlaceholder: "تخفیف را وارد کنید",
    close: "بستن",
    currency: "افغانی",
    retry: "تلاش دوباره",
    refresh: "بارگذاری دوباره",
    loadError: "بارگذاری جزئیات فروش انجام نشد.",
    saveError: "ذخیره جزئیات فروش انجام نشد.",
    deleteError: "حذف جزئیات فروش انجام نشد.",
    createSuccess: "جزئیات فروش موفقانه ثبت شد.",
    updateSuccess: "جزئیات فروش موفقانه ویرایش شد.",
    deleteSuccess: "جزئیات فروش موفقانه حذف شد.",
    stockHint: "موجودی هنگام افزودن، ویرایش یا حذف جزئیات فروش به‌صورت خودکار تغییر می‌کند.",
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
    saving: "ساتل کېږي...",
    cancel: "لغوه",
    addTitle: "د پلور جزئیات اضافه کړئ",
    editTitle: "د پلور جزئیات سمول",
    details: "د پلور جزئیاتو معلومات",
    noData: "د پلور جزئیات ونه موندل شول",
    loading: "د پلور جزئیات پورته کېږي...",
    confirmDelete: "ایا غواړئ دا توکی ړنګ کړئ؟",
    required: "مهرباني وکړئ ټول اړین ځایونه سم ډک کړئ.",
    salePlaceholder: "د پلور شمېره ولیکئ",
    carpetPlaceholder: "د غالۍ شمېره ولیکئ",
    locationPlaceholder: "د ځای شمېره ولیکئ",
    qtyPlaceholder: "شمېر ولیکئ",
    pricePlaceholder: "د پلور بیه ولیکئ",
    discountPlaceholder: "تخفیف ولیکئ",
    close: "بندول",
    currency: "افغانۍ",
    retry: "بیا هڅه",
    refresh: "بیا پورته کول",
    loadError: "د پلور جزئیات پورته نه شول.",
    saveError: "د پلور جزئیات ثبت نه شول.",
    deleteError: "د پلور جزئیات ړنګ نه شول.",
    createSuccess: "د پلور جزئیات په بریالیتوب ثبت شول.",
    updateSuccess: "د پلور جزئیات په بریالیتوب سم شول.",
    deleteSuccess: "د پلور جزئیات په بریالیتوب ړنګ شول.",
    stockHint: "زېرمه د پلور جزئیاتو په زیاتولو، سمولو او ړنګولو سره په اتومات ډول بدلېږي.",
  },
};

const emptyForm = {
  sale_id: "",
  carpet_id: "",
  location_id: "",
  quantity: "1",
  sale_price: "",
  discount: "0",
};

const money = (value, language) =>
  Number(value || 0).toLocaleString(
    language === "en" ? "en-US" : language === "ps" ? "ps-AF" : "fa-IR",
    { maximumFractionDigits: 2 }
  );

export default function SaleDetails() {
  const language = localStorage.getItem("language") || "en";
  const t = translations[language] || translations.en;
  const isRTL = language === "fa" || language === "ps";

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSaleDetails();
      setDetails(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || t.loadError);
    } finally {
      setLoading(false);
    }
  }, [t.loadError]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const filteredDetails = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return details;
    return details.filter((item) =>
      [item.id, item.sale_id, item.carpet_id, item.location_id]
        .some((value) => String(value ?? "").toLowerCase().includes(term))
    );
  }, [details, search]);

  const totalQuantity = details.reduce(
    (sum, item) => sum + Number(item.quantity || 0), 0
  );

  const totalAmount = details.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.sale_price || 0) - Number(item.discount || 0), 0
  );

  const totalDiscount = details.reduce(
    (sum, item) => sum + Number(item.discount || 0), 0
  );

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      sale_id: String(item.sale_id ?? ""),
      carpet_id: String(item.carpet_id ?? ""),
      location_id: String(item.location_id ?? ""),
      quantity: String(item.quantity ?? 1),
      sale_price: String(item.sale_price ?? ""),
      discount: String(item.discount ?? 0),
    });
    setViewItem(null);
    setError("");
    setModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModal(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const quantity = Number(form.quantity);
    const salePrice = Number(form.sale_price);
    const discount = Number(form.discount || 0);

    if (
      !form.sale_id || !form.carpet_id || !form.location_id ||
      form.quantity === "" || form.sale_price === "" ||
      !Number.isFinite(quantity) || !Number.isFinite(salePrice) ||
      !Number.isFinite(discount) || quantity <= 0 ||
      salePrice < 0 || discount < 0 ||
      discount > quantity * salePrice
    ) {
      setError(t.required);
      return;
    }

    const detailData = {
      sale_id: Number(form.sale_id),
      carpet_id: Number(form.carpet_id),
      location_id: Number(form.location_id),
      quantity,
      sale_price: salePrice,
      discount,
    };

    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (editingId !== null) {
        await updateSaleDetail(editingId, detailData);
        setNotice(t.updateSuccess);
      } else {
        await createSaleDetail(detailData);
        setNotice(t.createSuccess);
      }

      setModal(false);
      setEditingId(null);
      setForm({ ...emptyForm });
      await fetchDetails();
    } catch (err) {
      setError(err.response?.data?.message || t.saveError);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.confirmDelete)) return;

    setDeletingId(id);
    setError("");
    setNotice("");

    try {
      await deleteSaleDetail(id);
      setDetails((current) => current.filter((item) => item.id !== id));
      setViewItem(null);
      setNotice(t.deleteSuccess);
    } catch (err) {
      setError(err.response?.data?.message || t.deleteError);
    } finally {
      setDeletingId(null);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white";

  const cardClass =
    "rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900";

  const Field = ({ label, children }) => (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-6 p-3 text-gray-800 dark:text-gray-100 sm:p-5 lg:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={fetchDetails} className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            <RefreshCw size={17} /> {t.refresh}
          </button>
          <button onClick={openAdd} className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Plus size={18} /> {t.add}
          </button>
        </div>
      </div>

      {notice && <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">{notice}</div>}
      {error && <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"><AlertCircle size={17} />{error}</div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={cardClass}>
          <div className="flex items-center justify-between"><p className="text-sm text-gray-500 dark:text-gray-400">{t.total}</p><ShoppingCart className="text-blue-500" /></div>
          <p className="mt-3 text-2xl font-bold">{details.length}</p>
        </div>
        <div className={cardClass}>
          <div className="flex items-center justify-between"><p className="text-sm text-gray-500 dark:text-gray-400">{t.quantity}</p><Package className="text-purple-500" /></div>
          <p className="mt-3 text-2xl font-bold">{money(totalQuantity, language)}</p>
        </div>
        <div className={cardClass}>
          <div className="flex items-center justify-between"><p className="text-sm text-gray-500 dark:text-gray-400">{t.revenue}</p><DollarSign className="text-green-500" /></div>
          <p className="mt-3 text-2xl font-bold">{money(totalAmount, language)}</p>
          <p className="mt-1 text-xs text-gray-400">{t.currency}</p>
        </div>
        <div className={cardClass}>
          <div className="flex items-center justify-between"><p className="text-sm text-gray-500 dark:text-gray-400">{t.discounts}</p><DollarSign className="text-orange-500" /></div>
          <p className="mt-3 text-2xl font-bold">{money(totalDiscount, language)}</p>
          <p className="mt-1 text-xs text-gray-400">{t.currency}</p>
        </div>
      </div>

      <div className={cardClass}>
        <div className="relative w-full sm:max-w-md">
          <Search size={18} className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? "right-3" : "left-3"}`} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} className={`${inputClass} ${isRTL ? "pr-10" : "pl-10"}`} />
        </div>

        <p className="mt-3 text-xs text-gray-400">{t.stockHint}</p>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500"><RefreshCw size={18} className="animate-spin" />{t.loading}</div>
        ) : (
          <>
            <div className="mt-5 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    {[t.sale, t.carpet, t.location, t.qty, t.price, t.discount, t.amount, t.actions].map((heading) => <th key={heading} className="px-3 py-3 text-start font-semibold">{heading}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filteredDetails.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                      <td className="px-3 py-4 font-semibold">#{item.sale_id}</td>
                      <td className="px-3 py-4">#{item.carpet_id}</td>
                      <td className="px-3 py-4">#{item.location_id}</td>
                      <td className="px-3 py-4">{item.quantity}</td>
                      <td className="px-3 py-4">{money(item.sale_price, language)}</td>
                      <td className="px-3 py-4 text-orange-500">{money(item.discount, language)}</td>
                      <td className="px-3 py-4 font-semibold">{money(Number(item.quantity) * Number(item.sale_price) - Number(item.discount), language)}</td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewItem(item)} className="rounded-lg p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20" title={t.view}><Eye size={17} /></button>
                          <button onClick={() => openEdit(item)} className="rounded-lg p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20" title={t.edit}><Pencil size={17} /></button>
                          <button disabled={deletingId === item.id} onClick={() => handleDelete(item.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-40 dark:hover:bg-red-900/20" title={t.delete}><Trash2 size={17} /></button>
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
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold">#{item.id} · {t.sale} #{item.sale_id}</span>
                    <span className="text-sm font-semibold text-green-600">{money(Number(item.quantity) * Number(item.sale_price) - Number(item.discount), language)} {t.currency}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <p className="text-gray-500 dark:text-gray-400">{t.carpet}: <span className="font-medium text-gray-800 dark:text-white">#{item.carpet_id}</span></p>
                    <p className="text-gray-500 dark:text-gray-400">{t.location}: <span className="font-medium text-gray-800 dark:text-white">#{item.location_id}</span></p>
                    <p className="text-gray-500 dark:text-gray-400">{t.qty}: <span className="font-medium text-gray-800 dark:text-white">{item.quantity}</span></p>
                    <p className="text-gray-500 dark:text-gray-400">{t.price}: <span className="font-medium text-gray-800 dark:text-white">{money(item.sale_price, language)}</span></p>
                    <p className="text-gray-500 dark:text-gray-400">{t.discount}: <span className="font-medium text-gray-800 dark:text-white">{money(item.discount, language)}</span></p>
                  </div>
                  <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                    <button onClick={() => setViewItem(item)} className="rounded-lg p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"><Eye size={17} /></button>
                    <button onClick={() => openEdit(item)} className="rounded-lg p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"><Pencil size={17} /></button>
                    <button disabled={deletingId === item.id} onClick={() => handleDelete(item.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-40 dark:hover:bg-red-900/20"><Trash2 size={17} /></button>
                  </div>
                </div>
              ))}
            </div>

            {filteredDetails.length === 0 && <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">{t.noData}</p>}
          </>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3" onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) closeModal(); }}>
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">{editingId !== null ? t.editTitle : t.addTitle}</h2>
              <button type="button" onClick={closeModal} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={t.sale}><input type="number" min="1" required value={form.sale_id} onChange={(e) => setForm({ ...form, sale_id: e.target.value })} placeholder={t.salePlaceholder} className={inputClass} /></Field>
                <Field label={t.carpet}><input type="number" min="1" required value={form.carpet_id} onChange={(e) => setForm({ ...form, carpet_id: e.target.value })} placeholder={t.carpetPlaceholder} className={inputClass} /></Field>
                <Field label={t.location}><input type="number" min="1" required value={form.location_id} onChange={(e) => setForm({ ...form, location_id: e.target.value })} placeholder={t.locationPlaceholder} className={inputClass} /></Field>
                <Field label={t.qty}><input type="number" min="1" step="1" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder={t.qtyPlaceholder} className={inputClass} /></Field>
                <Field label={t.price}><input type="number" min="0" step="any" required value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} placeholder={t.pricePlaceholder} className={inputClass} /></Field>
                <Field label={t.discount}><input type="number" min="0" step="any" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder={t.discountPlaceholder} className={inputClass} /></Field>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeModal} disabled={saving} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800">{t.cancel}</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{saving ? t.saving : t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3" onMouseDown={(e) => { if (e.target === e.currentTarget) setViewItem(null); }}>
          <div className="my-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">{t.details} #{viewItem.id}</h2>
              <button onClick={() => setViewItem(null)} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} /></button>
            </div>

            <div className="space-y-3 text-sm">
              {[
                [t.sale, `#${viewItem.sale_id}`],
                [t.carpet, `#${viewItem.carpet_id}`],
                [t.location, `#${viewItem.location_id}`],
                [t.qty, viewItem.quantity],
                [t.price, `${money(viewItem.sale_price, language)} ${t.currency}`],
                [t.discount, `${money(viewItem.discount, language)} ${t.currency}`],
                [t.amount, `${money(Number(viewItem.quantity) * Number(viewItem.sale_price) - Number(viewItem.discount), language)} ${t.currency}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3 border-b border-gray-100 pb-2 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-2">
              <button onClick={() => openEdit(viewItem)} className="flex-1 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white"><Pencil size={15} className="inline" /> {t.edit}</button>
              <button onClick={() => setViewItem(null)} className="flex-1 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold dark:bg-gray-800">{t.close}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
