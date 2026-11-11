

import { useMemo, useState } from "react";
import {
  Search, Plus, Eye, Edit, Trash2, X, ShoppingCart,
  Wallet, CheckCircle, Clock, XCircle, Filter, MapPin
} from "lucide-react";

const translations = {
  en: {
    title: "Purchases", subtitle: "Manage your carpet purchases",
    total: "Total Purchases", amount: "Total Amount", paid: "Paid", unpaid: "Unpaid",
    search: "Search purchases...", add: "New Purchase", all: "All",
    paidStatus: "Paid", partial: "Partial", unpaidStatus: "Unpaid",
    active: "Active", cancelled: "Cancelled", date: "Date",
    supplier: "Supplier", employee: "Employee", place: "Purchase Place",
    currency: "Currency", rate: "Exchange Rate", totalAmount: "Total Amount",
    paymentStatus: "Payment Status", status: "Record Status", notes: "Notes",
    actions: "Actions", searchFilter: "Search & Filters", noData: "No purchases found",
    addTitle: "Add Purchase", editTitle: "Edit Purchase", details: "Purchase Details",
    save: "Save Purchase", update: "Update Purchase", cancel: "Cancel",
    close: "Close", delete: "Delete", view: "View", edit: "Edit",
    confirmDelete: "Are you sure you want to delete this purchase?",
    selectSupplier: "Select supplier", selectEmployee: "Select employee",
    selectCurrency: "Select currency", required: "Please fill in required fields.",
    purchaseDate: "Purchase Date", id: "Purchase ID", createdBy: "Created By",
    notesPlaceholder: "Enter purchase notes...", allPayments: "All Payment Statuses",
    allRecords: "All Record Statuses", herat: "Herat", success: "Purchase saved successfully",
    no: "No.", quantityInfo: "Purchase details can be managed in the Purchase Details section."
  },
  fa: {
    title: "خریدها", subtitle: "مدیریت خریدهای فرش",
    total: "مجموع خریدها", amount: "مجموع مبلغ", paid: "پرداخت‌شده", unpaid: "پرداخت‌نشده",
    search: "جستجوی خریدها...", add: "خرید جدید", all: "همه",
    paidStatus: "پرداخت‌شده", partial: "نیمه‌پرداخت", unpaidStatus: "پرداخت‌نشده",
    active: "فعال", cancelled: "لغوشده", date: "تاریخ",
    supplier: "تأمین‌کننده", employee: "کارمند", place: "محل خرید",
    currency: "واحد پول", rate: "نرخ تبادله", totalAmount: "مجموع مبلغ",
    paymentStatus: "وضعیت پرداخت", status: "وضعیت ثبت", notes: "یادداشت",
    actions: "عملیات", searchFilter: "جستجو و فیلتر", noData: "خریدی پیدا نشد",
    addTitle: "افزودن خرید", editTitle: "ویرایش خرید", details: "جزئیات خرید",
    save: "ثبت خرید", update: "ذخیره تغییرات", cancel: "انصراف",
    close: "بستن", delete: "حذف", view: "مشاهده", edit: "ویرایش",
    confirmDelete: "آیا از حذف این خرید مطمئن هستید؟",
    selectSupplier: "انتخاب تأمین‌کننده", selectEmployee: "انتخاب کارمند",
    selectCurrency: "انتخاب واحد پول", required: "لطفاً فیلدهای ضروری را تکمیل کنید.",
    purchaseDate: "تاریخ خرید", id: "شماره خرید", createdBy: "ثبت‌کننده",
    notesPlaceholder: "یادداشت خرید را وارد کنید...", allPayments: "تمام وضعیت‌های پرداخت",
    allRecords: "تمام وضعیت‌های ثبت", herat: "هرات", success: "خرید با موفقیت ثبت شد",
    no: "شماره", quantityInfo: "جزئیات خرید در بخش جزئیات خرید مدیریت می‌شود."
  },
  ps: {
    title: "پېرودونه", subtitle: "د غالیو د پېرودونو مدیریت",
    total: "ټول پېرودونه", amount: "ټوله اندازه", paid: "تادیه شوي", unpaid: "نا تادیه شوي",
    search: "پېرودونه ولټوئ...", add: "نوی پېرود", all: "ټول",
    paidStatus: "تادیه شوی", partial: "نیمه تادیه", unpaidStatus: "نا تادیه شوی",
    active: "فعال", cancelled: "لغوه شوی", date: "نېټه",
    supplier: "عرضه کوونکی", employee: "کارمند", place: "د پېرود ځای",
    currency: "اسعار", rate: "د تبادلې نرخ", totalAmount: "ټوله اندازه",
    paymentStatus: "د تادیې حالت", status: "د ثبت حالت", notes: "یادښتونه",
    actions: "کړنې", searchFilter: "لټون او فلټر", noData: "پېرود ونه موندل شو",
    addTitle: "پېرود زیاتول", editTitle: "پېرود سمول", details: "د پېرود جزئیات",
    save: "پېرود ثبتول", update: "بدلونونه ثبتول", cancel: "لغوه",
    close: "بندول", delete: "ړنګول", view: "لیدل", edit: "سمول",
    confirmDelete: "ایا ډاډه یاست چې دا پېرود ړنګ کړئ؟",
    selectSupplier: "عرضه کوونکی وټاکئ", selectEmployee: "کارمند وټاکئ",
    selectCurrency: "اسعار وټاکئ", required: "مهرباني وکړئ اړین ځایونه ډک کړئ.",
    purchaseDate: "د پېرود نېټه", id: "د پېرود شمېره", createdBy: "ثبت کوونکی",
    notesPlaceholder: "د پېرود یادښتونه ولیکئ...", allPayments: "د تادیې ټول حالتونه",
    allRecords: "د ثبت ټول حالتونه", herat: "هرات", success: "پېرود په بریالیتوب ثبت شو",
    no: "شمېره", quantityInfo: "د پېرود جزئیات د پېرود د جزئیاتو په برخه کې اداره کېږي."
  }
};

const initialPurchases = [
  { id: 1, supplier_id: 1, employee_id: 1, purchase_date: "2026-09-01", purchase_place: "Herat", currency_id: 1, exchange_rate: 1, total_amount: 35000, payment_status: "paid", status: "active", notes: "First purchase", created_by: 1 },
  { id: 2, supplier_id: 2, employee_id: 1, purchase_date: "2026-09-03", purchase_place: "Mashhad", currency_id: 2, exchange_rate: 70, total_amount: 28000, payment_status: "partial", status: "active", notes: "Imported carpets", created_by: 1 },
  { id: 3, supplier_id: 3, employee_id: 3, purchase_date: "2026-09-05", purchase_place: "Peshawar", currency_id: 1, exchange_rate: 1, total_amount: 9000, payment_status: "unpaid", status: "active", notes: "Wholesale order", created_by: 1 },
  { id: 4, supplier_id: 4, employee_id: 1, purchase_date: "2026-09-08", purchase_place: "Mazar", currency_id: 1, exchange_rate: 1, total_amount: 18000, payment_status: "paid", status: "active", notes: "Used carpet lot", created_by: 1 },
  { id: 5, supplier_id: 5, employee_id: 3, purchase_date: "2026-09-10", purchase_place: "Kabul", currency_id: 1, exchange_rate: 1, total_amount: 4000, payment_status: "paid", status: "active", notes: "Machine-made stock", created_by: 1 }
];

const suppliers = [
  { id: 1, name: "Sami Ahmadi" },
  { id: 2, name: "Reza Karimi" },
  { id: 3, name: "Omar Khan" },
  { id: 4, name: "Latif Hosseini" },
  { id: 5, name: "Nabi Noori" }
];

const employees = [
  { id: 1, name: "Employee #1" },
  { id: 3, name: "Employee #3" }
];

const currencies = [
  { id: 1, name: "AFN" },
  { id: 2, name: "EUR" }
];

const emptyForm = {
  supplier_id: "",
  employee_id: "",
  purchase_date: new Date().toISOString().slice(0, 10),
  purchase_place: "",
  currency_id: "1",
  exchange_rate: "1",
  total_amount: "",
  payment_status: "unpaid",
  status: "active",
  notes: "",
  created_by: 1
};

const money = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(Number(value || 0));

export default function Purchases() {
  const language = localStorage.getItem("language") || "en";
  const t = translations[language] || translations.en;
  const isRTL = language === "fa" || language === "ps";

  const [purchases, setPurchases] = useState(initialPurchases);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredPurchases = useMemo(() => {
    return purchases.filter((purchase) => {
      const supplier = suppliers.find((s) => s.id === Number(purchase.supplier_id));
      const searchText = `${purchase.id} ${supplier?.name || ""} ${purchase.purchase_place || ""}`.toLowerCase();

      return (
        searchText.includes(search.toLowerCase()) &&
        (paymentFilter === "all" || purchase.payment_status === paymentFilter) &&
        (statusFilter === "all" || purchase.status === statusFilter)
      );
    });
  }, [purchases, search, paymentFilter, statusFilter]);

  const totalAmount = purchases.reduce((sum, item) => sum + Number(item.total_amount || 0), 0);
  const paidAmount = purchases.filter((p) => p.payment_status === "paid").reduce((sum, p) => sum + Number(p.total_amount || 0), 0);
  const unpaidAmount = purchases.filter((p) => p.payment_status === "unpaid").reduce((sum, p) => sum + Number(p.total_amount || 0), 0);

  const getSupplier = (id) => suppliers.find((s) => s.id === Number(id))?.name || `Supplier #${id}`;
  const getEmployee = (id) => employees.find((e) => e.id === Number(id))?.name || `Employee #${id}`;
  const getCurrency = (id) => currencies.find((c) => c.id === Number(id))?.name || "—";

  const openAdd = () => {
    setForm(emptyForm);
    setSelected(null);
    setError("");
    setModal("form");
  };

  const openEdit = (purchase) => {
    setSelected(purchase);
    setForm({ ...purchase, supplier_id: String(purchase.supplier_id), employee_id: String(purchase.employee_id), currency_id: String(purchase.currency_id) });
    setError("");
    setModal("form");
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!form.supplier_id || !form.employee_id || !form.purchase_date || !form.total_amount || Number(form.total_amount) < 0) {
      setError(t.required);
      return;
    }

    const data = {
      ...form,
      supplier_id: Number(form.supplier_id),
      employee_id: Number(form.employee_id),
      currency_id: Number(form.currency_id),
      exchange_rate: Number(form.exchange_rate || 1),
      total_amount: Number(form.total_amount)
    };

    if (selected) {
      setPurchases((prev) => prev.map((p) => p.id === selected.id ? { ...p, ...data } : p));
    } else {
      setPurchases((prev) => [...prev, { ...data, id: Math.max(0, ...prev.map((p) => p.id)) + 1 }]);
    }

    setModal("");
    setSelected(null);
    setError("");
  };

  const handleDelete = (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    setPurchases((prev) => prev.filter((p) => p.id !== id));
    setModal("");
  };

  const statusBadge = (status) => {
    const styles = {
      paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      partial: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      unpaid: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      active: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
    };
    const labels = {
      paid: t.paidStatus, partial: t.partial, unpaid: t.unpaidStatus,
      active: t.active, cancelled: t.cancelled
    };
    return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || styles.cancelled}`}>{labels[status] || status}</span>;
  };

  const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-6 p-3 sm:p-5 lg:p-6 text-gray-800 dark:text-gray-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
          <Plus size={18} /> {t.add}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: t.total, value: purchases.length, icon: ShoppingCart, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
          { label: t.amount, value: money(totalAmount), icon: Wallet, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
          { label: t.paid, value: money(paidAmount), icon: CheckCircle, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
          { label: t.unpaid, value: money(unpaidAmount), icon: Clock, color: "text-red-600 bg-red-100 dark:bg-red-900/30" }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="mt-2 text-xl font-bold">{item.value}</p>
                </div>
                <div className={`rounded-xl p-3 ${item.color}`}><Icon size={22} /></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <Filter size={17} /> {t.searchFilter}
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <Search className={`absolute top-3 text-gray-400 ${isRTL ? "right-3" : "left-3"}`} size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} className={`${inputClass} ${isRTL ? "pr-10" : "pl-10"}`} />
          </div>
          <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className={inputClass}>
            <option value="all">{t.allPayments}</option>
            <option value="paid">{t.paidStatus}</option>
            <option value="partial">{t.partial}</option>
            <option value="unpaid">{t.unpaidStatus}</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass}>
            <option value="all">{t.allRecords}</option>
            <option value="active">{t.active}</option>
            <option value="cancelled">{t.cancelled}</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-4 py-4 dark:border-gray-700">
          <h2 className="font-semibold">{t.title} ({filteredPurchases.length})</h2>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1050px] text-sm">
            <thead className="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                {[t.id, t.date, t.supplier, t.employee, t.place, t.totalAmount, t.paymentStatus, t.status, t.actions].map((heading) => (
                  <th key={heading} className="px-4 py-3 text-start font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredPurchases.map((p) => (
                <tr key={p.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800/60">
                  <td className="px-4 py-3 font-medium">#{p.id}</td>
                  <td className="px-4 py-3">{p.purchase_date}</td>
                  <td className="px-4 py-3">{getSupplier(p.supplier_id)}</td>
                  <td className="px-4 py-3">{getEmployee(p.employee_id)}</td>
                  <td className="px-4 py-3">{p.purchase_place || "—"}</td>
                  <td className="px-4 py-3 font-semibold">{money(p.total_amount)} {getCurrency(p.currency_id)}</td>
                  <td className="px-4 py-3">{statusBadge(p.payment_status)}</td>
                  <td className="px-4 py-3">{statusBadge(p.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button title={t.view} onClick={() => { setSelected(p); setModal("view"); }} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"><Eye size={17} /></button>
                      <button title={t.edit} onClick={() => openEdit(p)} className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30"><Edit size={17} /></button>
                      <button title={t.delete} onClick={() => handleDelete(p.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPurchases.length === 0 && <tr><td colSpan="9" className="px-4 py-12 text-center text-gray-500">{t.noData}</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-3 md:hidden">
          {filteredPurchases.map((p) => (
            <div key={p.id} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold">#{p.id} · {getSupplier(p.supplier_id)}</span>
                {statusBadge(p.payment_status)}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-gray-500">{t.date}</p><p className="mt-1">{p.purchase_date}</p></div>
                <div><p className="text-xs text-gray-500">{t.place}</p><p className="mt-1">{p.purchase_place || "—"}</p></div>
                <div className="col-span-2"><p className="text-xs text-gray-500">{t.totalAmount}</p><p className="mt-1 font-bold">{money(p.total_amount)} {getCurrency(p.currency_id)}</p></div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 dark:border-gray-700">
                {statusBadge(p.status)}
                <div className="flex gap-1">
                  <button onClick={() => { setSelected(p); setModal("view"); }} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"><Eye size={17} /></button>
                  <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"><Edit size={17} /></button>
                  <button onClick={() => handleDelete(p.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={17} /></button>
                </div>
              </div>
            </div>
          ))}
          {filteredPurchases.length === 0 && <p className="py-10 text-center text-gray-500">{t.noData}</p>}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5">
          <div className="my-auto w-full max-w-2xl rounded-xl bg-white shadow-xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
              <h2 className="text-lg font-bold">{modal === "view" ? t.details : selected ? t.editTitle : t.addTitle}</h2>
              <button onClick={() => setModal("")} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} /></button>
            </div>

            {modal === "view" && selected ? (
              <div className="space-y-4 p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    [t.id, `#${selected.id}`],
                    [t.supplier, getSupplier(selected.supplier_id)],
                    [t.employee, getEmployee(selected.employee_id)],
                    [t.date, selected.purchase_date],
                    [t.place, selected.purchase_place || "—"],
                    [t.currency, getCurrency(selected.currency_id)],
                    [t.rate, selected.exchange_rate],
                    [t.totalAmount, `${money(selected.total_amount)} ${getCurrency(selected.currency_id)}`],
                    [t.paymentStatus, statusBadge(selected.payment_status)],
                    [t.status, statusBadge(selected.status)],
                    [t.createdBy, selected.created_by]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <p className="mb-1 text-xs text-gray-500">{label}</p>
                      <div className="text-sm font-medium">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <p className="mb-1 text-xs text-gray-500">{t.notes}</p>
                  <p className="text-sm">{selected.notes || "—"}</p>
                </div>
                <p className="flex items-center gap-2 text-xs text-gray-500"><MapPin size={14} /> {t.quantityInfo}</p>
                <button onClick={() => setModal("")} className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">{t.close}</button>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4 p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="space-y-1.5 text-sm">
                    <span>{t.supplier} *</span>
                    <select className={inputClass} value={form.supplier_id} onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}>
                      <option value="">{t.selectSupplier}</option>
                      {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1.5 text-sm">
                    <span>{t.employee} *</span>
                    <select className={inputClass} value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })}>
                      <option value="">{t.selectEmployee}</option>
                      {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1.5 text-sm">
                    <span>{t.purchaseDate} *</span>
                    <input type="date" className={inputClass} value={form.purchase_date} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })} />
                  </label>
                  <label className="space-y-1.5 text-sm">
                    <span>{t.place}</span>
                    <input className={inputClass} value={form.purchase_place || ""} onChange={(e) => setForm({ ...form, purchase_place: e.target.value })} placeholder="Herat..." />
                  </label>
                  <label className="space-y-1.5 text-sm">
                    <span>{t.currency}</span>
                    <select className={inputClass} value={form.currency_id} onChange={(e) => setForm({ ...form, currency_id: e.target.value, exchange_rate: e.target.value === "1" ? "1" : form.exchange_rate })}>
                      {currencies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1.5 text-sm">
                    <span>{t.rate}</span>
                    <input type="number" min="0" step="0.000001" className={inputClass} value={form.exchange_rate} onChange={(e) => setForm({ ...form, exchange_rate: e.target.value })} />
                  </label>
                  <label className="space-y-1.5 text-sm">
                    <span>{t.totalAmount} *</span>
                    <input type="number" min="0" step="0.01" className={inputClass} value={form.total_amount} onChange={(e) => setForm({ ...form, total_amount: e.target.value })} />
                  </label>
                  <label className="space-y-1.5 text-sm">
                    <span>{t.paymentStatus}</span>
                    <select className={inputClass} value={form.payment_status} onChange={(e) => setForm({ ...form, payment_status: e.target.value })}>
                      <option value="paid">{t.paidStatus}</option>
                      <option value="partial">{t.partial}</option>
                      <option value="unpaid">{t.unpaidStatus}</option>
                    </select>
                  </label>
                  <label className="space-y-1.5 text-sm">
                    <span>{t.status}</span>
                    <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="active">{t.active}</option>
                      <option value="cancelled">{t.cancelled}</option>
                    </select>
                  </label>
                </div>
                <label className="block space-y-1.5 text-sm">
                  <span>{t.notes}</span>
                  <textarea rows="3" className={inputClass} value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder={t.notesPlaceholder} />
                </label>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end dark:border-gray-700">
                  <button type="button" onClick={() => setModal("")} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">{t.cancel}</button>
                  <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">{selected ? t.update : t.save}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
