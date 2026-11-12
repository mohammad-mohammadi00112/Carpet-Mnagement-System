
import { useMemo, useState } from "react";
import {
  ShieldCheck, Search, Plus, Eye, Pencil, Trash2,
  X, KeyRound, Lock, AlertTriangle
} from "lucide-react";

const initialPermissions = [
  { id: 1, code: "admin.manage", description: "Manage system administration and settings." },
  { id: 2, code: "carpets.read", description: "View carpet information." },
  { id: 3, code: "carpets.manage", description: "Create, update and delete carpets." },
  { id: 4, code: "customers.read", description: "View customer information." },
  { id: 5, code: "customers.manage", description: "Manage customer records." },
  { id: 6, code: "sales.read", description: "View sales and invoices." },
  { id: 7, code: "sales.manage", description: "Create and manage sales." },
  { id: 8, code: "purchases.read", description: "View purchase records." },
  { id: 9, code: "purchases.manage", description: "Manage purchases." },
  { id: 10, code: "inventory.read", description: "View inventory information." },
  { id: 11, code: "inventory.manage", description: "Manage inventory and stock." },
  { id: 12, code: "reports.read", description: "View system reports." },
];

const translations = {
  en: {
    title: "Permissions",
    subtitle: "Manage system permissions and access codes.",
    total: "Total Permissions",
    search: "Search permissions...",
    add: "Add Permission",
    code: "Permission Code",
    description: "Description",
    actions: "Actions",
    noData: "No permissions found.",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    addTitle: "Add New Permission",
    editTitle: "Edit Permission",
    viewTitle: "Permission Details",
    save: "Save Permission",
    update: "Update Permission",
    cancel: "Cancel",
    deleteTitle: "Delete Permission",
    deleteMessage: "Are you sure you want to delete this permission?",
    confirmDelete: "Delete",
    codeRequired: "Permission code is required.",
    codeExists: "This permission code already exists.",
    close: "Close",
    all: "All Permissions",
    read: "Read Permissions",
    manage: "Manage Permissions",
  },
  fa: {
    title: "صلاحیت‌ها",
    subtitle: "مدیریت صلاحیت‌ها و کدهای دسترسی سیستم.",
    total: "مجموع صلاحیت‌ها",
    search: "جستجوی صلاحیت‌ها...",
    add: "افزودن صلاحیت",
    code: "کد صلاحیت",
    description: "توضیحات",
    actions: "عملیات",
    noData: "هیچ صلاحیتی پیدا نشد.",
    view: "مشاهده",
    edit: "ویرایش",
    delete: "حذف",
    addTitle: "افزودن صلاحیت جدید",
    editTitle: "ویرایش صلاحیت",
    viewTitle: "جزئیات صلاحیت",
    save: "ذخیره صلاحیت",
    update: "به‌روزرسانی صلاحیت",
    cancel: "لغو",
    deleteTitle: "حذف صلاحیت",
    deleteMessage: "آیا مطمئن هستید که می‌خواهید این صلاحیت را حذف کنید؟",
    confirmDelete: "حذف",
    codeRequired: "کد صلاحیت الزامی است.",
    codeExists: "این کد صلاحیت قبلاً موجود است.",
    close: "بستن",
    all: "تمام صلاحیت‌ها",
    read: "صلاحیت‌های مشاهده",
    manage: "صلاحیت‌های مدیریت",
  },
  ps: {
    title: "اجازې",
    subtitle: "د سیستم اجازې او د لاسرسي کوډونه مدیریت کړئ.",
    total: "د ټولو اجازو شمېر",
    search: "د اجازو لټون...",
    add: "نوې اجازه",
    code: "د اجازې کوډ",
    description: "توضیحات",
    actions: "کړنې",
    noData: "هیڅ اجازه ونه موندل شوه.",
    view: "لیدل",
    edit: "سمول",
    delete: "حذف",
    addTitle: "نوې اجازه اضافه کول",
    editTitle: "د اجازې سمول",
    viewTitle: "د اجازې معلومات",
    save: "اجازه خوندي کول",
    update: "اجازه تازه کول",
    cancel: "لغوه",
    deleteTitle: "د اجازې حذف",
    deleteMessage: "ایا غواړئ دا اجازه حذف کړئ؟",
    confirmDelete: "حذف",
    codeRequired: "د اجازې کوډ اړین دی.",
    codeExists: "دا د اجازې کوډ مخکې موجود دی.",
    close: "بندول",
    all: "ټولې اجازې",
    read: "د لیدلو اجازې",
    manage: "د مدیریت اجازې",
  },
};

export default function Permissions() {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ code: "", description: "" });
  const [error, setError] = useState("");

  // Use the project's global language setting.
  const language = document.documentElement.lang || "en";
  const t = translations[language] || translations.en;

  const filteredPermissions = useMemo(() => {
    return permissions.filter((permission) => {
      const matchesSearch =
        permission.code.toLowerCase().includes(search.toLowerCase()) ||
        (permission.description || "").toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "read" && permission.code.endsWith(".read")) ||
        (filter === "manage" && permission.code.endsWith(".manage"));

      return matchesSearch && matchesFilter;
    });
  }, [permissions, search, filter]);

  const openAdd = () => {
    setForm({ code: "", description: "" });
    setSelected(null);
    setError("");
    setModal("add");
  };

  const openEdit = (permission) => {
    setSelected(permission);
    setForm({
      code: permission.code,
      description: permission.description || "",
    });
    setError("");
    setModal("edit");
  };

  const openView = (permission) => {
    setSelected(permission);
    setModal("view");
  };

  const handleSave = () => {
    const code = form.code.trim().toLowerCase();

    if (!code) {
      setError(t.codeRequired);
      return;
    }

    const exists = permissions.some(
      (permission) =>
        permission.code.toLowerCase() === code &&
        permission.id !== selected?.id
    );

    if (exists) {
      setError(t.codeExists);
      return;
    }

    if (modal === "add") {
      setPermissions((prev) => [
        ...prev,
        {
          id: Math.max(0, ...prev.map((item) => item.id)) + 1,
          code,
          description: form.description.trim(),
        },
      ]);
    } else {
      setPermissions((prev) =>
        prev.map((permission) =>
          permission.id === selected.id
            ? { ...permission, code, description: form.description.trim() }
            : permission
        )
      );
    }

    setModal(null);
    setError("");
  };

  const handleDelete = () => {
    setPermissions((prev) =>
      prev.filter((permission) => permission.id !== selected.id)
    );
    setModal(null);
    setSelected(null);
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-blue-900";

  const mutedText = "text-gray-500 dark:text-gray-400";

  const cardClass =
    "rounded-2xl border border-gray-200 bg-white text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white";

  const buttonClass =
    "rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700";

  const readCount = permissions.filter((p) => p.code.endsWith(".read")).length;
  const manageCount = permissions.filter((p) => p.code.endsWith(".manage")).length;

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 text-gray-800 transition-colors dark:bg-gray-900 dark:text-white sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40">
              <ShieldCheck size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t.title}</h1>
              <p className={`mt-1 text-sm ${mutedText}`}>{t.subtitle}</p>
            </div>
          </div>

          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            {t.add}
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className={`${cardClass} p-5`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${mutedText}`}>{t.total}</p>
                <h2 className="mt-2 text-3xl font-bold">{permissions.length}</h2>
              </div>
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40">
                <KeyRound size={24} />
              </div>
            </div>
          </div>

          <div className={`${cardClass} p-5`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${mutedText}`}>{t.read}</p>
                <h2 className="mt-2 text-3xl font-bold">{readCount}</h2>
              </div>
              <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-900/40">
                <Eye size={24} />
              </div>
            </div>
          </div>

          <div className={`${cardClass} p-5`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${mutedText}`}>{t.manage}</p>
                <h2 className="mt-2 text-3xl font-bold">{manageCount}</h2>
              </div>
              <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/40">
                <Lock size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`${cardClass} p-4`}>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                  language === "fa" || language === "ps" ? "right-4" : "left-4"
                }`}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.search}
                className={`${inputClass} ${
                  language === "fa" || language === "ps" ? "pr-11" : "pl-11"
                }`}
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`${inputClass} md:w-56`}
            >
              <option value="all">{t.all}</option>
              <option value="read">{t.read}</option>
              <option value="manage">{t.manage}</option>
            </select>
          </div>
        </div>

        {/* Permissions Table */}
        <div className={`${cardClass} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-sm">
              <thead className="bg-gray-100 dark:bg-gray-900">
                <tr>
                  <th className="px-5 py-4 text-start font-semibold">#</th>
                  <th className="px-5 py-4 text-start font-semibold">{t.code}</th>
                  <th className="px-5 py-4 text-start font-semibold">{t.description}</th>
                  <th className="px-5 py-4 text-center font-semibold">{t.actions}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPermissions.map((permission, index) => (
                  <tr
                    key={permission.id}
                    className="transition hover:bg-gray-50 dark:hover:bg-gray-700/40"
                  >
                    <td className="px-5 py-4">{index + 1}</td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-blue-100 px-3 py-1.5 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        {permission.code}
                      </span>
                    </td>

                    <td className={`max-w-md px-5 py-4 ${mutedText}`}>
                      {permission.description || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-1">
                        <button
                          title={t.view}
                          onClick={() => openView(permission)}
                          className={buttonClass}
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          title={t.edit}
                          onClick={() => openEdit(permission)}
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          title={t.delete}
                          onClick={() => {
                            setSelected(permission);
                            setModal("delete");
                          }}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/30"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPermissions.length === 0 && (
                  <tr>
                    <td colSpan="4" className={`px-5 py-12 text-center ${mutedText}`}>
                      <ShieldCheck size={35} className="mx-auto mb-3 opacity-40" />
                      {t.noData}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            <div className={`${cardClass} my-auto w-full max-w-lg p-6 shadow-2xl`}>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {modal === "add" && t.addTitle}
                  {modal === "edit" && t.editTitle}
                  {modal === "view" && t.viewTitle}
                  {modal === "delete" && t.deleteTitle}
                </h2>

                <button
                  onClick={() => setModal(null)}
                  className={buttonClass}
                >
                  <X size={20} />
                </button>
              </div>

              {(modal === "add" || modal === "edit") && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">{t.code}</label>
                    <input
                      value={form.code}
                      onChange={(e) => {
                        setForm({ ...form, code: e.target.value });
                        setError("");
                      }}
                      placeholder="e.g. carpets.read"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">{t.description}</label>
                    <textarea
                      rows="4"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder={t.description}
                      className={inputClass}
                    />
                  </div>

                  {error && (
                    <p className="flex items-center gap-2 text-sm text-red-500">
                      <AlertTriangle size={16} />
                      {error}
                    </p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSave}
                      className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
                    >
                      {modal === "add" ? t.save : t.update}
                    </button>
                    <button
                      onClick={() => setModal(null)}
                      className="rounded-xl border border-gray-300 px-5 py-3 transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              )}

              {modal === "view" && selected && (
                <div className="space-y-4">
                  <div>
                    <p className={`mb-2 text-sm ${mutedText}`}>{t.code}</p>
                    <p className="rounded-xl bg-blue-50 p-4 font-mono font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {selected.code}
                    </p>
                  </div>

                  <div>
                    <p className={`mb-2 text-sm ${mutedText}`}>{t.description}</p>
                    <p className="rounded-xl bg-gray-100 p-4 text-sm dark:bg-gray-900">
                      {selected.description || "—"}
                    </p>
                  </div>

                  <button
                    onClick={() => setModal(null)}
                    className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700"
                  >
                    {t.close}
                  </button>
                </div>
              )}

              {modal === "delete" && selected && (
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-900/30">
                      <AlertTriangle size={23} />
                    </div>
                    <div>
                      <p className="font-medium">{t.deleteMessage}</p>
                      <p className={`mt-2 font-mono text-sm ${mutedText}`}>
                        {selected.code}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleDelete}
                      className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-medium text-white transition hover:bg-red-700"
                    >
                      {t.confirmDelete}
                    </button>
                    <button
                      onClick={() => setModal(null)}
                      className="rounded-xl border border-gray-300 px-5 py-3 transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
