
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Pencil, Trash2, Eye, X,
  Users, UserCheck, UserX, Phone, Mail, MapPin
} from "lucide-react";

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  updateSupplierStatus,
  deleteSupplier
} from "../services/purchases/SupplierService";

const translations = {
  en: {
    title: "Suppliers",
    subtitle: "Manage your carpet suppliers",
    total: "Total Suppliers",
    active: "Active Suppliers",
    inactive: "Inactive Suppliers",
    search: "Search by name, company, phone or email...",
    add: "Add Supplier",
    id: "ID",
    name: "Full Name",
    firstName: "First Name",
    lastName: "Last Name",
    company: "Company Name",
    phone: "Phone",
    email: "Email",
    address: "Address",
    description: "Description",
    status: "Status",
    actions: "Actions",
    activeStatus: "Active",
    inactiveStatus: "Inactive",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    save: "Save",
    cancel: "Cancel",
    addTitle: "Add New Supplier",
    editTitle: "Edit Supplier",
    details: "Supplier Details",
    noData: "No suppliers found",
    confirmDelete: "Are you sure you want to delete this supplier?",
    required: "First name is required.",
    close: "Close",
    activate: "Activate",
    deactivate: "Deactivate",
    loading: "Loading suppliers...",
    saving: "Saving...",
    error: "Something went wrong. Please try again.",
    loadError: "Could not load suppliers.",
    contact: "Contact Information"
  },
  fa: {
    title: "تأمین‌کنندگان",
    subtitle: "مدیریت تأمین‌کنندگان قالین",
    total: "مجموع تأمین‌کنندگان",
    active: "تأمین‌کنندگان فعال",
    inactive: "تأمین‌کنندگان غیرفعال",
    search: "جستجو بر اساس نام، شرکت، تماس یا ایمیل...",
    add: "افزودن تأمین‌کننده",
    id: "شناسه",
    name: "نام کامل",
    firstName: "نام",
    lastName: "نام خانوادگی",
    company: "نام شرکت",
    phone: "شماره تماس",
    email: "ایمیل",
    address: "آدرس",
    description: "توضیحات",
    status: "وضعیت",
    actions: "عملیات",
    activeStatus: "فعال",
    inactiveStatus: "غیرفعال",
    edit: "ویرایش",
    delete: "حذف",
    view: "مشاهده",
    save: "ذخیره",
    cancel: "لغو",
    addTitle: "افزودن تأمین‌کننده جدید",
    editTitle: "ویرایش تأمین‌کننده",
    details: "جزئیات تأمین‌کننده",
    noData: "تأمین‌کننده‌ای یافت نشد",
    confirmDelete: "آیا از حذف این تأمین‌کننده اطمینان دارید؟",
    required: "وارد کردن نام الزامی است.",
    close: "بستن",
    activate: "فعال کردن",
    deactivate: "غیرفعال کردن",
    loading: "در حال دریافت اطلاعات...",
    saving: "در حال ذخیره...",
    error: "مشکلی رخ داد. لطفاً دوباره تلاش کنید.",
    loadError: "دریافت اطلاعات تأمین‌کنندگان موفق نشد.",
    contact: "اطلاعات تماس"
  },
  ps: {
    title: "عرضه کوونکي",
    subtitle: "د غالیو د عرضه کوونکو اداره",
    total: "ټول عرضه کوونکي",
    active: "فعال عرضه کوونکي",
    inactive: "غیرفعال عرضه کوونکي",
    search: "د نوم، شرکت، تلیفون یا ایمیل له مخې لټون...",
    add: "عرضه کوونکی زیاتول",
    id: "شمېره",
    name: "بشپړ نوم",
    firstName: "نوم",
    lastName: "تخلص",
    company: "د شرکت نوم",
    phone: "د اړیکې شمېره",
    email: "ایمیل",
    address: "پته",
    description: "تشریح",
    status: "حالت",
    actions: "کړنې",
    activeStatus: "فعال",
    inactiveStatus: "غیرفعال",
    edit: "سمون",
    delete: "حذف",
    view: "کتل",
    save: "ساتل",
    cancel: "لغوه",
    addTitle: "نوی عرضه کوونکی زیاتول",
    editTitle: "د عرضه کوونکي سمون",
    details: "د عرضه کوونکي تفصیلات",
    noData: "عرضه کوونکی ونه موندل شو",
    confirmDelete: "ایا غواړئ دا عرضه کوونکی حذف کړئ؟",
    required: "نوم اړین دی.",
    close: "بندول",
    activate: "فعالول",
    deactivate: "غیرفعالول",
    loading: "د عرضه کوونکو معلومات ترلاسه کېږي...",
    saving: "خوندي کېږي...",
    error: "یوه ستونزه رامنځته شوه. بیا هڅه وکړئ.",
    loadError: "د عرضه کوونکو معلومات ترلاسه نه شول.",
    contact: "د اړیکو معلومات"
  }
};

const emptyForm = {
  first_name: "",
  last_name: "",
  company_name: "",
  phone: "",
  email: "",
  address: "",
  description: "",
  is_active: true
};

export default function Suppliers() {
  const language = localStorage.getItem("language") || "en";
  const t = translations[language] || translations.en;
  const rtl = language === "fa" || language === "ps";

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900";

  const getErrorMessage = err =>
    err.response?.data?.message ||
    err.response?.data?.detail ||
    err.message ||
    t.error;

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getSuppliers();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(getErrorMessage(err) || t.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const filteredData = useMemo(() => {
    const term = search.toLowerCase().trim();

    return data.filter(item => {
      const matchesSearch = [
        item.id,
        item.first_name,
        item.last_name,
        item.company_name,
        item.phone,
        item.email,
        item.address
      ].some(value =>
        String(value || "").toLowerCase().includes(term)
      );

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.is_active) ||
        (statusFilter === "inactive" && !item.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const activeCount = data.filter(item => item.is_active).length;
  const inactiveCount = data.length - activeCount;

  const fullName = item =>
    `${item.first_name || ""} ${item.last_name || ""}`.trim();

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setModal(true);
  };

  const openEdit = item => {
    setEditingId(item.id);
    setForm({
      first_name: item.first_name || "",
      last_name: item.last_name || "",
      company_name: item.company_name || "",
      phone: item.phone || "",
      email: item.email || "",
      address: item.address || "",
      description: item.description || "",
      is_active: Boolean(item.is_active)
    });
    setError("");
    setModal(true);
  };

  const handleSave = async e => {
    e.preventDefault();

    if (!form.first_name.trim()) {
      setError(t.required);
      return;
    }

    const supplierData = {
      ...form,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      company_name: form.company_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      description: form.description.trim()
    };

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await updateSupplier(editingId, supplierData);
      } else {
        await createSupplier(supplierData);
      }

      await loadSuppliers();
      setModal(false);
      setEditingId(null);
      setForm({ ...emptyForm });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm(t.confirmDelete)) return;

    try {
      setActionId(id);
      setError("");

      await deleteSupplier(id);
      setData(prev => prev.filter(item => item.id !== id));

      if (viewItem?.id === id) {
        setViewItem(null);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const toggleStatus = async item => {
    try {
      setActionId(item.id);
      setError("");

      await updateSupplierStatus(item.id, !item.is_active);

      setData(prev =>
        prev.map(supplier =>
          supplier.id === item.id
            ? { ...supplier, is_active: !item.is_active }
            : supplier
        )
      );

      if (viewItem?.id === item.id) {
        setViewItem({
          ...item,
          is_active: !item.is_active
        });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const stats = [
    {
      label: t.total,
      value: data.length,
      icon: Users,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30"
    },
    {
      label: t.active,
      value: activeCount,
      icon: UserCheck,
      color: "text-green-600 bg-green-100 dark:bg-green-900/30"
    },
    {
      label: t.inactive,
      value: inactiveCount,
      icon: UserX,
      color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30"
    }
  ];

  const StatusButton = ({ item }) => (
    <button
      type="button"
      disabled={actionId === item.id}
      onClick={() => toggleStatus(item)}
      className={`rounded-full px-3 py-1 text-xs font-medium disabled:opacity-50 ${
        item.is_active
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
      }`}
    >
      {item.is_active ? t.activeStatus : t.inactiveStatus}
    </button>
  );

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

      {/* Error Message */}
      {error && !modal && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="shrink-0"
          >
            <X size={18} />
          </button>
        </div>
      )}

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

      {/* Suppliers Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-800 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search
              size={18}
              className={`absolute top-3 text-gray-400 ${
                rtl ? "right-3" : "left-3"
              }`}
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.search}
              className={`${inputClass} ${rtl ? "pr-10" : "pl-10"}`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className={`${inputClass} lg:w-48`}
          >
            <option value="all">{t.total}</option>
            <option value="active">{t.activeStatus}</option>
            <option value="inactive">{t.inactiveStatus}</option>
          </select>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
            {t.loading}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  <tr>
                    {[t.id, t.name, t.company, t.phone, t.email, t.status, t.actions].map(
                      (heading, i) => (
                        <th
                          key={i}
                          className="whitespace-nowrap px-5 py-4 text-start font-semibold"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredData.map(item => (
                    <tr
                      key={item.id}
                      className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-5 py-4 font-medium text-gray-700 dark:text-gray-300">
                        #{item.id}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {fullName(item) || "-"}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                        {item.company_name || "-"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-700 dark:text-gray-300">
                        {item.phone || "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                        {item.email || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <StatusButton item={item} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewItem(item)}
                            title={t.view}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            onClick={() => openEdit(item)}
                            title={t.edit}
                            className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={actionId === item.id}
                            title={t.delete}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/30"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredData.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-5 py-12 text-center text-gray-500 dark:text-gray-400"
                      >
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
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {fullName(item) || "-"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        #{item.id} · {item.company_name || "-"}
                      </p>
                    </div>

                    <StatusButton item={item} />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Phone size={15} />
                      <span>{item.phone || "-"}</span>
                    </div>

                    <div className="flex items-center gap-2 break-all text-gray-600 dark:text-gray-300">
                      <Mail size={15} />
                      <span>{item.email || "-"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <MapPin size={15} />
                      <span>{item.address || "-"}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end gap-1 border-t border-gray-100 pt-3 dark:border-gray-700">
                    <button
                      onClick={() => setViewItem(item)}
                      title={t.view}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      onClick={() => openEdit(item)}
                      title={t.edit}
                      className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={actionId === item.id}
                      title={t.delete}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/30"
                    >
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
          </>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingId ? t.editTitle : t.addTitle}
              </h2>

              <button
                onClick={() => {
                  setModal(false);
                  setError("");
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2"
            >
              {[
                { key: "first_name", label: t.firstName, required: true },
                { key: "last_name", label: t.lastName },
                { key: "company_name", label: t.company },
                { key: "phone", label: t.phone },
                { key: "email", label: t.email, type: "email" },
                { key: "address", label: t.address }
              ].map(field => (
                <div key={field.key}>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.label}
                  </label>

                  <input
                    type={field.type || "text"}
                    required={field.required || false}
                    value={form[field.key]}
                    onChange={e =>
                      setForm({ ...form, [field.key]: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.description}
                </label>

                <textarea
                  rows="3"
                  value={form.description}
                  onChange={e =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={e =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-blue-600"
                />
                {t.activeStatus}
              </label>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 sm:col-span-2">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:col-span-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setModal(false);
                    setError("");
                  }}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {t.cancel}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? t.saving : t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t.details} #{viewItem.id}
              </h2>

              <button
                onClick={() => setViewItem(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              {[
                [t.name, fullName(viewItem)],
                [t.company, viewItem.company_name || "-"],
                [t.phone, viewItem.phone || "-"],
                [t.email, viewItem.email || "-"],
                [t.address, viewItem.address || "-"],
                [t.description, viewItem.description || "-"],
                [
                  t.status,
                  viewItem.is_active ? t.activeStatus : t.inactiveStatus
                ]
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-4 border-b border-gray-100 pb-3 text-sm dark:border-gray-800"
                >
                  <span className="text-gray-500 dark:text-gray-400">
                    {label}
                  </span>

                  <span className="max-w-[65%] break-words text-end font-semibold text-gray-900 dark:text-white">
                    {value}
                  </span>
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
