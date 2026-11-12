
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Eye, Pencil, Trash2, X, Shield,
  ShieldCheck, ShieldPlus, Lock, Users
} from "lucide-react";

import {
  getRoles,
  getUsers,
  createRole,
  updateRole,
  deleteRole
} from "../services/administration/roleService";

const translations = {
  en: {
    title: "Roles", subtitle: "Manage system roles and access levels",
    add: "Add Role", search: "Search roles...",
    total: "Total Roles", system: "System Roles",
    custom: "Custom Roles", assigned: "Assigned Users",
    name: "Role Name", description: "Description",
    type: "Role Type", created: "Created At",
    actions: "Actions", systemRole: "System",
    customRole: "Custom", save: "Save Role",
    update: "Update Role", cancel: "Cancel",
    edit: "Edit", view: "View", delete: "Delete",
    noData: "No roles found",
    confirm: "Are you sure you want to delete this role?",
    details: "Role Details", close: "Close",
    required: "Role name is required",
    systemOnly: "System roles cannot be deleted.",
    systemEdit: "System roles cannot be modified.",
    descriptionPlaceholder: "Enter role description...",
    namePlaceholder: "Enter role name...",
    allTypes: "All Types",
    loading: "Loading roles...",
    error: "Something went wrong",
    duplicate: "This role name already exists.",
    saving: "Saving...",
    retry: "Retry",
    success: "Operation completed successfully",
  },

  fa: {
    title: "نقش‌ها", subtitle: "مدیریت نقش‌ها و سطح دسترسی سیستم",
    add: "افزودن نقش", search: "جستجوی نقش‌ها...",
    total: "مجموع نقش‌ها", system: "نقش‌های سیستمی",
    custom: "نقش‌های سفارشی", assigned: "کاربران اختصاص‌یافته",
    name: "نام نقش", description: "توضیحات",
    type: "نوع نقش", created: "تاریخ ایجاد",
    actions: "عملیات", systemRole: "سیستمی",
    customRole: "سفارشی", save: "ثبت نقش",
    update: "ویرایش نقش", cancel: "لغو",
    edit: "ویرایش", view: "مشاهده", delete: "حذف",
    noData: "نقشی پیدا نشد",
    confirm: "آیا از حذف این نقش مطمئن هستید؟",
    details: "جزئیات نقش", close: "بستن",
    required: "نام نقش الزامی است",
    systemOnly: "نقش‌های سیستمی قابل حذف نیستند.",
    systemEdit: "نقش‌های سیستمی قابل ویرایش نیستند.",
    descriptionPlaceholder: "توضیحات نقش را وارد کنید...",
    namePlaceholder: "نام نقش را وارد کنید...",
    allTypes: "همه انواع",
    loading: "در حال دریافت نقش‌ها...",
    error: "مشکلی به وجود آمده است",
    duplicate: "این نام نقش قبلاً وجود دارد.",
    saving: "در حال ذخیره...",
    retry: "تلاش مجدد",
    success: "عملیات با موفقیت انجام شد",
  },

  ps: {
    title: "رولونه", subtitle: "د سیسټم رولونه او د لاسرسي کچې اداره کړئ",
    add: "نوی رول", search: "رولونه ولټوئ...",
    total: "ټول رولونه", system: "سیسټمي رولونه",
    custom: "ځانګړي رولونه", assigned: "ټاکل شوي کاروونکي",
    name: "د رول نوم", description: "توضیحات",
    type: "د رول ډول", created: "د جوړېدو نېټه",
    actions: "کړنې", systemRole: "سیسټمي",
    customRole: "ځانګړی", save: "ثبتول",
    update: "سمون", cancel: "لغوه",
    edit: "سمون", view: "کتل", delete: "ړنګول",
    noData: "رول ونه موندل شو",
    confirm: "ایا د دې رول له ړنګولو ډاډه یاست؟",
    details: "د رول معلومات", close: "بندول",
    required: "د رول نوم اړین دی",
    systemOnly: "سیسټمي رولونه نه شي ړنګېدای.",
    systemEdit: "سیسټمي رولونه نه شي بدلېدای.",
    descriptionPlaceholder: "د رول توضیحات ولیکئ...",
    namePlaceholder: "د رول نوم ولیکئ...",
    allTypes: "ټول ډولونه",
    loading: "رولونه ترلاسه کېږي...",
    error: "ستونزه رامنځته شوه",
    duplicate: "دا رول نوم مخکې شتون لري.",
    saving: "ثبت کېږي...",
    retry: "بیا هڅه",
    success: "عملیات په بریالیتوب ترسره شول",
  },
};

const emptyForm = {
  name: "",
  description: "",
  is_system: false,
};

export default function Roles() {
  const language = localStorage.getItem("language") || "en";
  const t = translations[language] || translations.en;
  const rtl = ["fa", "ps"].includes(language);

  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setPageError("");

    try {
      const [rolesData, usersData] = await Promise.all([
        getRoles(),
        getUsers(),
      ]);

      setRoles(rolesData);
      setUsers(usersData);

    } catch (err) {
      setPageError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        t.error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    return roles.filter(role => {
      const text = `${role.name} ${role.description || ""}`.toLowerCase();

      return (
        text.includes(search.toLowerCase()) &&
        (
          filter === "all" ||
          (filter === "system" && role.is_system) ||
          (filter === "custom" && !role.is_system)
        )
      );
    });
  }, [roles, search, filter]);

  const stats = [
    {
      label: t.total,
      value: roles.length,
      icon: Shield,
    },
    {
      label: t.system,
      value: roles.filter(r => r.is_system).length,
      icon: ShieldCheck,
    },
    {
      label: t.custom,
      value: roles.filter(r => !r.is_system).length,
      icon: ShieldPlus,
    },
    {
      label: t.assigned,
      value: users.length,
      icon: Users,
    },
  ];

  const getAssignedUsers = roleId => {
    return users.filter(
      user => Number(user.role_id) === Number(roleId)
    ).length;
  };

  const openAdd = () => {
    setForm(emptyForm);
    setSelected(null);
    setError("");
    setModal("form");
  };

  const openEdit = role => {
    if (role.is_system) {
      window.alert(t.systemEdit);
      return;
    }

    setSelected(role);

    setForm({
      name: role.name || "",
      description: role.description || "",
      is_system: false,
    });

    setError("");
    setModal("form");
  };

  const saveRole = async e => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError(t.required);
      return;
    }

    const duplicate = roles.some(role =>
      role.name.toLowerCase() === form.name.trim().toLowerCase() &&
      Number(role.id) !== Number(selected?.id)
    );

    if (duplicate) {
      setError(t.duplicate);
      return;
    }

    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
      is_system: false,
    };

    setSaving(true);

    try {
      if (selected) {
        await updateRole(selected.id, data);
      } else {
        await createRole(data);
      }

      setModal("");
      setSelected(null);
      setForm(emptyForm);

      await loadData();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        t.error
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async role => {
    if (role.is_system) {
      window.alert(t.systemOnly);
      return;
    }

    const assignedCount = getAssignedUsers(role.id);

    if (assignedCount > 0) {
      window.alert(
        `This role is assigned to ${assignedCount} user(s). Reassign those users before deleting it.`
      );
      return;
    }

    if (!window.confirm(t.confirm)) return;

    try {
      setPageError("");
      await deleteRole(role.id);
      await loadData();

    } catch (err) {
      setPageError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        t.error
      );
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className="space-y-6 p-3 text-gray-800 dark:text-gray-100 sm:p-5 lg:p-6"
    >

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t.subtitle}
          </p>
        </div>

        <button
          onClick={openAdd}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus size={18} />
          {t.add}
        </button>
      </div>

      {/* Error */}

      {pageError && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          <span>{pageError}</span>

          <button
            onClick={loadData}
            className="font-semibold underline"
          >
            {t.retry}
          </button>
        </div>
      )}

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {label}
              </p>

              <span className="rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-950">
                <Icon size={20} />
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Roles Table */}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search
              size={18}
              className={`absolute top-3 text-gray-400 ${rtl ? "right-3" : "left-3"}`}
            />

            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.search}
              className={`${fieldClass} ${rtl ? "pr-10" : "pl-10"}`}
            />
          </div>

          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className={`${fieldClass} md:w-52`}
          >
            <option value="all">{t.allTypes}</option>
            <option value="system">{t.system}</option>
            <option value="custom">{t.custom}</option>
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
          {loading ? (
            <p className="py-10 text-center text-gray-500">
              {t.loading}
            </p>
          ) : (
            <table className="w-full min-w-[850px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  {[
                    t.name,
                    t.description,
                    t.type,
                    t.assigned,
                    t.created,
                    t.actions,
                  ].map(item => (
                    <th
                      key={item}
                      className="px-3 py-3 text-start font-semibold"
                    >
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map(role => (
                  <tr
                    key={role.id}
                    className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                  >

                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-950">
                          <Shield size={18} />
                        </span>

                        <span className="font-medium">
                          {role.name}
                        </span>
                      </div>
                    </td>

                    <td className="max-w-xs px-3 py-4 text-gray-500 dark:text-gray-400">
                      <span className="line-clamp-2">
                        {role.description || "—"}
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          role.is_system
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        }`}
                      >
                        {role.is_system ? t.systemRole : t.customRole}
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      {getAssignedUsers(role.id)}
                    </td>

                    <td className="px-3 py-4">
                      {role.created_at
                        ? new Date(role.created_at).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">

                        <button
                          title={t.view}
                          onClick={() => {
                            setSelected(role);
                            setModal("view");
                          }}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          title={t.edit}
                          onClick={() => openEdit(role)}
                          disabled={role.is_system}
                          className={`rounded-lg p-2 ${
                            role.is_system
                              ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
                              : "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                          }`}
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          title={t.delete}
                          onClick={() => handleDelete(role)}
                          disabled={role.is_system}
                          className={`rounded-lg p-2 ${
                            role.is_system
                              ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
                              : "text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                          }`}
                        >
                          <Trash2 size={17} />
                        </button>

                        {role.is_system && (
                          <Lock size={14} className="text-gray-400" />
                        )}

                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-10 text-center text-gray-500"
                    >
                      {t.noData}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900 sm:p-6">

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {modal === "view"
                  ? t.details
                  : selected
                    ? t.update
                    : t.add}
              </h2>

              <button
                onClick={() => setModal("")}
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            {modal === "view" && selected ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {[
                  [t.name, selected.name],
                  [t.description, selected.description],
                  [
                    t.type,
                    selected.is_system ? t.systemRole : t.customRole,
                  ],
                  [
                    t.assigned,
                    getAssignedUsers(selected.id),
                  ],
                  [
                    t.created,
                    selected.created_at
                      ? new Date(selected.created_at).toLocaleDateString()
                      : "—",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800"
                  >
                    <p className="text-xs text-gray-500">{label}</p>

                    <p className="mt-1 break-words text-sm font-medium">
                      {value || "—"}
                    </p>
                  </div>
                ))}

              </div>
            ) : (
              <form onSubmit={saveRole} className="space-y-4">

                <div>
                  <label className={labelClass}>
                    {t.name} *
                  </label>

                  <input
                    required
                    value={form.name}
                    onChange={e =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder={t.namePlaceholder}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    {t.description}
                  </label>

                  <textarea
                    rows="4"
                    value={form.description}
                    onChange={e =>
                      setForm({
                        ...form,
                        description: e.target.value,
                      })
                    }
                    placeholder={t.descriptionPlaceholder}
                    className={fieldClass}
                  />
                </div>

                <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                  <div className="flex items-center gap-2 text-sm">
                    <Lock size={16} className="text-gray-500" />
                    <span>{t.customRole}</span>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500">
                    {error}
                  </p>
                )}

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
                    {saving
                      ? t.saving
                      : selected
                        ? t.update
                        : t.save}
                  </button>

                </div>
              </form>
            )}

            {modal === "view" && (
              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setModal("")}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm text-white"
                >
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