
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Eye, Pencil, Trash2, X, Users,
  UserCheck, UserX, ShieldCheck
} from "lucide-react";

import {
  getUsers,
  getEmployees,
  getRoles,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser
} from "../services/administration/userService";

const translations = {
  en: {
    title: "Users", subtitle: "Manage system users and account access",
    add: "Add User", search: "Search users...",
    total: "Total Users", active: "Active Users",
    inactive: "Inactive Users", roles: "Assigned Roles",
    username: "Username", employee: "Employee", role: "Role",
    lastLogin: "Last Login", created: "Created At",
    status: "Status", actions: "Actions", activeStatus: "Active",
    inactiveStatus: "Inactive", save: "Save User",
    update: "Update User", cancel: "Cancel",
    edit: "Edit", view: "View", delete: "Delete",
    noData: "No users found",
    confirm: "Are you sure you want to delete this user?",
    details: "User Details", close: "Close",
    required: "Username is required",
    password: "Password", newPassword: "New Password (optional)",
    employeeName: "Select Employee", selectRole: "Select Role",
    never: "Never logged in", passwordHint: "Leave empty to keep the current password.",
    allRoles: "All Roles", allStatus: "All Statuses",
    loading: "Loading users...",
    error: "Something went wrong",
    passwordRequired: "Password is required",
    success: "Operation completed successfully",
  },
  fa: {
    title: "کاربران", subtitle: "مدیریت کاربران سیستم و دسترسی حساب‌ها",
    add: "افزودن کاربر", search: "جستجوی کاربران...",
    total: "مجموع کاربران", active: "کاربران فعال",
    inactive: "کاربران غیرفعال", roles: "نقش‌های اختصاص‌یافته",
    username: "نام کاربری", employee: "کارمند", role: "نقش",
    lastLogin: "آخرین ورود", created: "تاریخ ایجاد",
    status: "وضعیت", actions: "عملیات", activeStatus: "فعال",
    inactiveStatus: "غیرفعال", save: "ثبت کاربر",
    update: "ویرایش کاربر", cancel: "لغو",
    edit: "ویرایش", view: "مشاهده", delete: "حذف",
    noData: "کاربری پیدا نشد",
    confirm: "آیا از حذف این کاربر مطمئن هستید؟",
    details: "جزئیات کاربر", close: "بستن",
    required: "نام کاربری الزامی است",
    password: "رمز عبور", newPassword: "رمز عبور جدید (اختیاری)",
    employeeName: "انتخاب کارمند", selectRole: "انتخاب نقش",
    never: "هرگز وارد نشده",
    passwordHint: "برای حفظ رمز قبلی، این قسمت را خالی بگذارید.",
    allRoles: "همه نقش‌ها", allStatus: "همه وضعیت‌ها",
    loading: "در حال دریافت کاربران...",
    error: "مشکلی به وجود آمده است",
    passwordRequired: "رمز عبور الزامی است",
    success: "عملیات با موفقیت انجام شد",
  },
  ps: {
    title: "کاروونکي", subtitle: "د سیسټم کاروونکي او حسابونه اداره کړئ",
    add: "نوی کاروونکی", search: "کاروونکي ولټوئ...",
    total: "ټول کاروونکي", active: "فعال کاروونکي",
    inactive: "غیرفعال کاروونکي", roles: "ټاکل شوي رولونه",
    username: "کارن نوم", employee: "کارمند", role: "رول",
    lastLogin: "وروستی ننوتل", created: "د جوړېدو نېټه",
    status: "حالت", actions: "کړنې", activeStatus: "فعال",
    inactiveStatus: "غیرفعال", save: "ثبتول",
    update: "سمون", cancel: "لغوه",
    edit: "سمون", view: "کتل", delete: "ړنګول",
    noData: "کاروونکی ونه موندل شو",
    confirm: "ایا د دې کاروونکي له ړنګولو ډاډه یاست؟",
    details: "د کاروونکي معلومات", close: "بندول",
    required: "کارن نوم اړین دی",
    password: "پټنوم", newPassword: "نوی پټنوم (اختیاري)",
    employeeName: "کارمند وټاکئ", selectRole: "رول وټاکئ",
    never: "تر اوسه نه دی ننوتلی",
    passwordHint: "د اوسني پټنوم ساتلو لپاره دا تش پرېږدئ.",
    allRoles: "ټول رولونه", allStatus: "ټول حالتونه",
    loading: "کاروونکي ترلاسه کېږي...",
    error: "ستونزه رامنځته شوه",
    passwordRequired: "پټنوم اړین دی",
    success: "عملیات په بریالیتوب ترسره شول",
  },
};

const emptyForm = {
  employee_id: "",
  role_id: "",
  username: "",
  password: "",
  is_active: true,
};

export default function User() {
  const language = localStorage.getItem("language") || "en";
  const t = translations[language] || translations.en;
  const rtl = ["fa", "ps"].includes(language);

  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setPageError("");

    try {
      const [usersData, employeesData, rolesData] = await Promise.all([
        getUsers(),
        getEmployees(),
        getRoles(),
      ]);

      const employeeList = employeesData.map(employee => ({
        ...employee,
        name: `${employee.first_name || ""} ${employee.last_name || ""}`.trim(),
      }));

      const formattedUsers = usersData.map(user => {
        const employee = employeeList.find(
          e => Number(e.id) === Number(user.employee_id)
        );

        const role = rolesData.find(
          r => Number(r.id) === Number(user.role_id)
        );

        return {
          ...user,
          employee_name: employee?.name || "—",
          role_name: role?.name || "—",
          last_login: user.last_login || null,
        };
      });

      setUsers(formattedUsers);
      setEmployees(employeeList);
      setRoles(rolesData);

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
    return users.filter(user => {
      const text = `${user.username} ${user.employee_name} ${user.role_name}`.toLowerCase();

      return (
        text.includes(search.toLowerCase()) &&
        (filter === "all" ||
          (filter === "active" ? user.is_active : !user.is_active)) &&
        (roleFilter === "all" || String(user.role_id) === roleFilter)
      );
    });
  }, [users, search, filter, roleFilter]);

  const stats = [
    { label: t.total, value: users.length, icon: Users },
    {
      label: t.active,
      value: users.filter(u => u.is_active).length,
      icon: UserCheck,
    },
    {
      label: t.inactive,
      value: users.filter(u => !u.is_active).length,
      icon: UserX,
    },
    {
      label: t.roles,
      value: new Set(users.map(u => u.role_id)).size,
      icon: ShieldCheck,
    },
  ];

  const openAdd = () => {
    setSelected(null);
    setForm({
      ...emptyForm,
      role_id: roles.find(r => r.name === "Seller")?.id?.toString() || "",
    });
    setError("");
    setModal("form");
  };

  const openEdit = user => {
    setSelected(user);

    setForm({
      employee_id: user.employee_id?.toString() || "",
      role_id: user.role_id?.toString() || "",
      username: user.username || "",
      password: "",
      is_active: Boolean(user.is_active),
    });

    setError("");
    setModal("form");
  };

  const saveUser = async e => {
    e.preventDefault();
    setError("");

    if (!form.username.trim()) {
      setError(t.required);
      return;
    }

    if (!selected && !form.password.trim()) {
      setError(t.passwordRequired);
      return;
    }

    if (!form.employee_id || !form.role_id) {
      setError("Please select employee and role.");
      return;
    }

    const data = {
      employee_id: Number(form.employee_id),
      role_id: Number(form.role_id),
      username: form.username.trim(),
      is_active: form.is_active,
    };

    if (form.password.trim()) {
      data.password = form.password;
    }

    setSaving(true);

    try {
      if (selected) {
        await updateUser(selected.id, data);
      } else {
        await createUser(data);
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

  const toggleStatus = async user => {
    try {
      await updateUserStatus(user.id, !user.is_active);
      await loadData();
    } catch (err) {
      setPageError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message
      );
    }
  };

  const handleDelete = async id => {
    if (!window.confirm(t.confirm)) return;

    try {
      await deleteUser(id);
      await loadData();
    } catch (err) {
      setPageError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message
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
          <Plus size={18} /> {t.add}
        </button>
      </div>

      {pageError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {pageError}
          <button
            onClick={loadData}
            className="ms-3 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:flex">
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className={`${fieldClass} md:w-40`}
            >
              <option value="all">{t.allStatus}</option>
              <option value="active">{t.activeStatus}</option>
              <option value="inactive">{t.inactiveStatus}</option>
            </select>

            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className={`${fieldClass} md:w-44`}
            >
              <option value="all">{t.allRoles}</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          {loading ? (
            <p className="py-10 text-center text-gray-500">{t.loading}</p>
          ) : (
            <table className="w-full min-w-[850px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  {[
                    t.username, t.employee, t.role,
                    t.lastLogin, t.created, t.status, t.actions,
                  ].map(item => (
                    <th key={item} className="px-3 py-3 text-start font-semibold">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map(user => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                  >
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950">
                          <Users size={17} />
                        </div>
                        <span className="font-medium">{user.username}</span>
                      </div>
                    </td>

                    <td className="px-3 py-4">{user.employee_name}</td>

                    <td className="px-3 py-4">
                      <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                        {user.role_name}
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleString()
                        : t.never}
                    </td>

                    <td className="px-3 py-4">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-3 py-4">
                      <button
                        onClick={() => toggleStatus(user)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.is_active
                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {user.is_active ? t.activeStatus : t.inactiveStatus}
                      </button>
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          title={t.view}
                          onClick={() => {
                            setSelected(user);
                            setModal("view");
                          }}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          title={t.edit}
                          onClick={() => openEdit(user)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          title={t.delete}
                          onClick={() => handleDelete(user.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-gray-500">
                      {t.noData}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

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
                  [t.username, selected.username],
                  [t.employee, selected.employee_name],
                  [t.role, selected.role_name],
                  [
                    t.lastLogin,
                    selected.last_login
                      ? new Date(selected.last_login).toLocaleString()
                      : t.never,
                  ],
                  [
                    t.created,
                    selected.created_at
                      ? new Date(selected.created_at).toLocaleDateString()
                      : "—",
                  ],
                  [
                    t.status,
                    selected.is_active ? t.activeStatus : t.inactiveStatus,
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
              <form onSubmit={saveUser} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>{t.employee}</label>
                    <select
                      required
                      value={form.employee_id}
                      onChange={e =>
                        setForm({ ...form, employee_id: e.target.value })
                      }
                      className={fieldClass}
                    >
                      <option value="">{t.employeeName}</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>{t.username} *</label>
                    <input
                      required
                      value={form.username}
                      onChange={e =>
                        setForm({ ...form, username: e.target.value })
                      }
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      {selected ? t.newPassword : t.password + " *"}
                    </label>
                    <input
                      type="password"
                      required={!selected}
                      value={form.password}
                      onChange={e =>
                        setForm({ ...form, password: e.target.value })
                      }
                      className={fieldClass}
                    />
                    {selected && (
                      <p className="mt-1 text-xs text-gray-500">
                        {t.passwordHint}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>{t.role}</label>
                    <select
                      required
                      value={form.role_id}
                      onChange={e =>
                        setForm({ ...form, role_id: e.target.value })
                      }
                      className={fieldClass}
                    >
                      <option value="">{t.selectRole}</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="flex items-center gap-2 text-sm sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={e =>
                        setForm({ ...form, is_active: e.target.checked })
                      }
                    />
                    {t.activeStatus}
                  </label>
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
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
                    {saving ? "..." : selected ? t.update : t.save}
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