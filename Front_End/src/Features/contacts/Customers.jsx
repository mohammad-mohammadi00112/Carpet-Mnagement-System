
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Eye, Pencil, Trash2, X, Users,
  UserCheck, Wallet, ShoppingBag
} from "lucide-react";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  updateCustomerStatus,
  deleteCustomer
} from "../services/contacts/customerService";

const translations = {
  en: {
    title: "Customers", subtitle: "Manage your customer information",
    add: "Add Customer", search: "Search customers...",
    total: "Total Customers", active: "Active Customers",
    retail: "Retail Customers", wholesale: "Wholesale Customers",
    name: "Full Name", phone: "Phone", email: "Email", address: "Address",
    type: "Customer Type", credit: "Credit Limit", notes: "Notes",
    status: "Status", actions: "Actions", activeStatus: "Active",
    inactive: "Inactive", retailType: "Retail", wholesaleType: "Wholesale",
    all: "All Customers", save: "Save Customer", update: "Update Customer",
    cancel: "Cancel", edit: "Edit", view: "View", delete: "Delete",
    first: "First Name", last: "Last Name", noData: "No customers found",
    confirm: "Are you sure you want to delete this customer?",
    details: "Customer Details", close: "Close",
    required: "First name is required",
    loading: "Loading customers...",
    loadError: "Failed to load customers",
    saveError: "Failed to save customer",
    deleteError: "Failed to delete customer",
    statusError: "Failed to update customer status",
  },
  fa: {
    title: "مشتریان", subtitle: "مدیریت اطلاعات مشتریان",
    add: "افزودن مشتری", search: "جستجوی مشتریان...",
    total: "مجموع مشتریان", active: "مشتریان فعال",
    retail: "مشتریان پرچون", wholesale: "مشتریان عمده‌فروش",
    name: "نام کامل", phone: "شماره تماس", email: "ایمیل", address: "آدرس",
    type: "نوع مشتری", credit: "حد اعتبار", notes: "یادداشت‌ها",
    status: "وضعیت", actions: "عملیات", activeStatus: "فعال",
    inactive: "غیرفعال", retailType: "پرچون", wholesaleType: "عمده‌فروش",
    all: "همه مشتریان", save: "ثبت مشتری", update: "ویرایش مشتری",
    cancel: "لغو", edit: "ویرایش", view: "مشاهده", delete: "حذف",
    first: "نام", last: "تخلص", noData: "مشتری پیدا نشد",
    confirm: "آیا از حذف این مشتری مطمئن هستید؟",
    details: "جزئیات مشتری", close: "بستن",
    required: "نام الزامی است",
    loading: "در حال دریافت مشتریان...",
    loadError: "دریافت مشتریان ناموفق بود",
    saveError: "ثبت یا ویرایش مشتری ناموفق بود",
    deleteError: "حذف مشتری ناموفق بود",
    statusError: "تغییر وضعیت مشتری ناموفق بود",
  },
  ps: {
    title: "پېرودونکي", subtitle: "د پېرودونکو معلومات اداره کړئ",
    add: "نوی پېرودونکی", search: "پېرودونکي ولټوئ...",
    total: "ټول پېرودونکي", active: "فعال پېرودونکي",
    retail: "پرچون پېرودونکي", wholesale: "عمده پېرودونکي",
    name: "بشپړ نوم", phone: "د اړیکې شمېره", email: "برېښنالیک", address: "پته",
    type: "د پېرودونکي ډول", credit: "د پور حد", notes: "یادښتونه",
    status: "حالت", actions: "کړنې", activeStatus: "فعال",
    inactive: "غیرفعال", retailType: "پرچون", wholesaleType: "عمده",
    all: "ټول پېرودونکي", save: "ثبتول", update: "سمون",
    cancel: "لغوه", edit: "سمون", view: "کتل", delete: "ړنګول",
    first: "نوم", last: "تخلص", noData: "پېرودونکی ونه موندل شو",
    confirm: "ایا د دې پېرودونکي له ړنګولو ډاډه یاست؟",
    details: "د پېرودونکي معلومات", close: "بندول",
    required: "نوم اړین دی",
    loading: "د پېرودونکو معلومات ترلاسه کېږي...",
    loadError: "د پېرودونکو ترلاسه کول ناکام شول",
    saveError: "د پېرودونکي ثبت یا سمون ناکام شو",
    deleteError: "د پېرودونکي ړنګول ناکام شول",
    statusError: "د پېرودونکي حالت بدلول ناکام شول",
  },
};

const emptyForm = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  address: "",
  customer_type: "retail",
  credit_limit: 0,
  notes: "",
  is_active: true,
};

export default function Customer() {
  const language = localStorage.getItem("language") || "en";
  const t = translations[language] || translations.en;
  const rtl = ["fa", "ps"].includes(language);

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || t.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filtered = useMemo(() => customers.filter((c) => {
    const text = `${c.first_name || ""} ${c.last_name || ""} ${c.phone || ""} ${c.email || ""}`.toLowerCase();

    return text.includes(search.toLowerCase()) &&
      (filter === "all" ||
        (filter === "active" ? c.is_active : c.customer_type === filter));
  }), [customers, search, filter]);

  const stats = [
    { label: t.total, value: customers.length, icon: Users },
    { label: t.active, value: customers.filter(c => c.is_active).length, icon: UserCheck },
    { label: t.retail, value: customers.filter(c => c.customer_type === "retail").length, icon: ShoppingBag },
    { label: t.wholesale, value: customers.filter(c => c.customer_type === "wholesale").length, icon: Wallet },
  ];

  const openAdd = () => {
    setForm({ ...emptyForm });
    setSelected(null);
    setError("");
    setModal("form");
  };

  const openEdit = (customer) => {
    setSelected(customer);
    setForm({
      ...emptyForm,
      ...customer,
      credit_limit: customer.credit_limit ?? 0,
      is_active: customer.is_active ?? true,
    });
    setError("");
    setModal("form");
  };

  const saveCustomer = async (e) => {
    e.preventDefault();

    if (!form.first_name.trim()) {
      setError(t.required);
      return;
    }

    try {
      setSaving(true);
      setError("");

      const customerData = {
        ...form,
        credit_limit: Number(form.credit_limit) || 0,
      };

      if (selected) {
        await updateCustomer(selected.id, customerData);
      } else {
        await createCustomer(customerData);
      }

      await loadCustomers();
      setModal("");
      setSelected(null);
      setForm({ ...emptyForm });
    } catch (err) {
      setError(err.response?.data?.message || err.message || t.saveError);
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (customer) => {
    try {
      setActionId(customer.id);
      setError("");

      await updateCustomerStatus(customer.id, !customer.is_active);

      setCustomers(prev => prev.map(c =>
        c.id === customer.id
          ? { ...c, is_active: !customer.is_active }
          : c
      ));
    } catch (err) {
      setError(err.response?.data?.message || err.message || t.statusError);
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.confirm)) return;

    try {
      setActionId(id);
      setError("");

      await deleteCustomer(id);

      setCustomers(prev => prev.filter(c => c.id !== id));

      if (selected?.id === id) {
        setSelected(null);
        setModal("");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || t.deleteError);
    } finally {
      setActionId(null);
    }
  };

  const fieldClass = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="space-y-6 p-3 sm:p-5 lg:p-6 text-gray-800 dark:text-gray-100">

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
        </div>

        <button onClick={openAdd} className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={18} /> {t.add}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
              <span className="rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-950">
                <Icon size={20} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search size={18} className={`absolute top-3 text-gray-400 ${rtl ? "right-3" : "left-3"}`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.search}
              className={`${fieldClass} ${rtl ? "pr-10" : "pl-10"}`}
            />
          </div>

          <select value={filter} onChange={e => setFilter(e.target.value)} className={`${fieldClass} md:w-52`}>
            <option value="all">{t.all}</option>
            <option value="active">{t.active}</option>
            <option value="retail">{t.retailType}</option>
            <option value="wholesale">{t.wholesaleType}</option>
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[850px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                {[t.name, t.phone, t.email, t.address, t.type, t.credit, t.status, t.actions].map(x => (
                  <th key={x} className="px-3 py-3 text-start font-semibold">{x}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-gray-500">{t.loading}</td>
                </tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                  <td className="px-3 py-4 font-medium">{c.first_name} {c.last_name}</td>
                  <td className="px-3 py-4">{c.phone || "—"}</td>
                  <td className="px-3 py-4">{c.email || "—"}</td>
                  <td className="px-3 py-4">{c.address || "—"}</td>

                  <td className="px-3 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${c.customer_type === "wholesale" ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"}`}>
                      {c.customer_type === "wholesale" ? t.wholesaleType : t.retailType}
                    </span>
                  </td>

                  <td className="px-3 py-4">{Number(c.credit_limit || 0).toLocaleString()}</td>

                  <td className="px-3 py-4">
                    <button
                      disabled={actionId === c.id}
                      onClick={() => handleStatus(c)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium disabled:opacity-50 ${c.is_active ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}
                    >
                      {c.is_active ? t.activeStatus : t.inactive}
                    </button>
                  </td>

                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <button title={t.view} onClick={() => { setSelected(c); setModal("view"); }} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Eye size={17} />
                      </button>

                      <button title={t.edit} onClick={() => openEdit(c)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950">
                        <Pencil size={17} />
                      </button>

                      <button
                        title={t.delete}
                        disabled={actionId === c.id}
                        onClick={() => handleDelete(c.id)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-gray-500">{t.noData}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900 sm:p-6">

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {modal === "view" ? t.details : selected ? t.update : t.add}
              </h2>
              <button onClick={() => setModal("")} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={20} />
              </button>
            </div>

            {modal === "view" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  [t.name, `${selected.first_name} ${selected.last_name || ""}`],
                  [t.phone, selected.phone],
                  [t.email, selected.email],
                  [t.address, selected.address],
                  [t.type, selected.customer_type],
                  [t.credit, Number(selected.credit_limit || 0).toLocaleString()],
                  [t.status, selected.is_active ? t.activeStatus : t.inactive],
                  [t.notes, selected.notes || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="mt-1 break-words text-sm font-medium">{value || "—"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={saveCustomer} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    ["first_name", t.first, true],
                    ["last_name", t.last],
                    ["phone", t.phone],
                    ["email", t.email],
                    ["address", t.address],
                  ].map(([key, label, required]) => (
                    <div key={key}>
                      <label className={labelClass}>{label}</label>
                      <input
                        required={required}
                        value={form[key] ?? ""}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        className={fieldClass}
                      />
                    </div>
                  ))}

                  <div>
                    <label className={labelClass}>{t.type}</label>
                    <select
                      value={form.customer_type}
                      onChange={e => setForm({ ...form, customer_type: e.target.value })}
                      className={fieldClass}
                    >
                      <option value="retail">{t.retailType}</option>
                      <option value="wholesale">{t.wholesaleType}</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>{t.credit}</label>
                    <input
                      type="number"
                      min="0"
                      value={form.credit_limit}
                      onChange={e => setForm({ ...form, credit_limit: e.target.value })}
                      className={fieldClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>{t.notes}</label>
                    <textarea
                      rows="3"
                      value={form.notes ?? ""}
                      onChange={e => setForm({ ...form, notes: e.target.value })}
                      className={fieldClass}
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={Boolean(form.is_active)}
                      onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    />
                    {t.activeStatus}
                  </label>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setModal("")}
                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700"
                  >
                    {t.cancel}
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? "..." : selected ? t.update : t.save}
                  </button>
                </div>
              </form>
            )}

            {modal === "view" && (
              <div className="mt-5 flex justify-end">
                <button onClick={() => setModal("")} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm text-white">
                  {t.close}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
