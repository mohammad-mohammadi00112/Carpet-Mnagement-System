

import { useMemo, useState } from "react";
import {
  Search, Plus, Pencil, Trash2, Eye, X,
  Users, UserCheck, UserX, Building2, Phone, Mail, MapPin
} from "lucide-react";

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
    notes: "Notes",
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
    contact: "Contact Information"
  },
  fa: {
    title: "تأمین‌کنندگان",
    subtitle: "مدیریت تأمین‌کنندگان فرش",
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
    notes: "یادداشت‌ها",
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
    notes: "یادښتونه",
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
    contact: "د اړیکې معلومات"
  }
};

const initialData = [
  {
    id: 1,
    first_name: "Sami",
    last_name: "Ahmadi",
    company_name: "Herat Carpet Supply",
    phone: "0790000001",
    email: "sami@example.com",
    address: "Herat, Afghanistan",
    description: "Local carpet supplier",
    notes: "",
    is_active: true
  },
  {
    id: 2,
    first_name: "Reza",
    last_name: "Karimi",
    company_name: "Mashhad Rugs",
    phone: "0790000002",
    email: "reza@example.com",
    address: "Mashhad, Iran",
    description: "Iranian carpet supplier",
    notes: "",
    is_active: true
  },
  {
    id: 3,
    first_name: "Omar",
    last_name: "Khan",
    company_name: "Khan Trading",
    phone: "0790000003",
    email: "omar@example.com",
    address: "Peshawar, Pakistan",
    description: "Wholesale supplier",
    notes: "",
    is_active: true
  },
  {
    id: 4,
    first_name: "Latif",
    last_name: "Hosseini",
    company_name: "Balkh Handmade",
    phone: "0790000004",
    email: "latif@example.com",
    address: "Mazar, Afghanistan",
    description: "Handmade carpets",
    notes: "",
    is_active: true
  },
  {
    id: 5,
    first_name: "Nabi",
    last_name: "Noori",
    company_name: "Noori Textiles",
    phone: "0790000005",
    email: "nabi@example.com",
    address: "Kabul, Afghanistan",
    description: "Machine-made carpets",
    notes: "",
    is_active: true
  }
];

const emptyForm = {
  first_name: "",
  last_name: "",
  company_name: "",
  phone: "",
  email: "",
  address: "",
  description: "",
  notes: "",
  is_active: true
};

export default function Suppliers() {
  const language = localStorage.getItem("language") || "en";
  const t = translations[language] || translations.en;
  const rtl = language === "fa" || language === "ps";

  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

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

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = item => {
    setEditingId(item.id);
    setForm({
      first_name: item.first_name,
      last_name: item.last_name || "",
      company_name: item.company_name || "",
      phone: item.phone || "",
      email: item.email || "",
      address: item.address || "",
      description: item.description || "",
      notes: item.notes || "",
      is_active: item.is_active
    });
    setModal(true);
  };

  const handleSave = e => {
    e.preventDefault();

    if (!form.first_name.trim()) {
      alert(t.required);
      return;
    }

    if (editingId) {
      setData(prev =>
        prev.map(item =>
          item.id === editingId ? { ...item, ...form } : item
        )
      );
    } else {
      const newId = Math.max(0, ...data.map(item => item.id)) + 1;
      setData(prev => [...prev, { id: newId, ...form }]);
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

  const toggleStatus = id => {
    setData(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, is_active: !item.is_active }
          : item
      )
    );
  };

  const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900";

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

  const fullName = item =>
    `${item.first_name} ${item.last_name || ""}`.trim();

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

      {/* Suppliers Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-800 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
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

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                {[t.id, t.name, t.company, t.phone, t.email, t.status, t.actions].map((heading, i) => (
                  <th key={i} className="whitespace-nowrap px-5 py-4 text-start font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredData.map(item => (
                <tr key={item.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-5 py-4 font-medium text-gray-700 dark:text-gray-300">
                    #{item.id}
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {fullName(item)}
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
                    <button
                      onClick={() => toggleStatus(item.id)}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.is_active
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {item.is_active ? t.activeStatus : t.inactiveStatus}
                    </button>
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
                        title={t.delete}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
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
            <div
              key={item.id}
              className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {fullName(item)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    #{item.id} · {item.company_name || "-"}
                  </p>
                </div>

                <button
                  onClick={() => toggleStatus(item.id)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    item.is_active
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {item.is_active ? t.activeStatus : t.inactiveStatus}
                </button>
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
                  className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  <Eye size={17} />
                </button>
                <button
                  onClick={() => openEdit(item)}
                  className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                >
                  <Pencil size={17} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
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
                onClick={() => setModal(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
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
                  rows="2"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.notes}
                </label>
                <textarea
                  rows="2"
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className={inputClass}
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={e => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded accent-blue-600"
                />
                {t.activeStatus}
              </label>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:col-span-2 sm:flex-row sm:justify-end">
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
                [t.notes, viewItem.notes || "-"],
                [t.status, viewItem.is_active ? t.activeStatus : t.inactiveStatus]
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-4 border-b border-gray-100 pb-3 text-sm dark:border-gray-800"
                >
                  <span className="text-gray-500 dark:text-gray-400">{label}</span>
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
