import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck, Search, Plus, Trash2, X,
  KeyRound, Users, Lock, CheckCircle2,
  AlertTriangle, UserRound
} from "lucide-react";

import {
  getRoles,
  getPermissions,
  getRolePermissions,
  assignPermission,
  removePermission,
} from "../services/administration/rolePermissionService";

const translations = {
  en: {
    title: "Role Permissions",
    subtitle: "Assign and manage permissions for system roles.",
    roles: "Roles",
    permissions: "Permissions",
    assignments: "Total Assignments",
    searchRoles: "Search roles...",
    searchPermissions: "Search permissions...",
    selectRole: "Select a permission",
    assigned: "Assigned Permissions",
    available: "Available Permissions",
    add: "Assign Permission",
    remove: "Remove",
    all: "All Permissions",
    read: "Read",
    manage: "Manage",
    noRoles: "No roles found.",
    noPermissions: "No permissions found.",
    noAssigned: "No permissions assigned to this role.",
    noAvailable: "All permissions have been assigned.",
    confirmRemove: "Are you sure you want to remove this permission from the role?",
    cancel: "Cancel",
    confirm: "Remove Permission",
    close: "Close",
    role: "Role",
    code: "Permission Code",
    description: "Description",
    actions: "Actions",
    success: "Permission assigned successfully.",
    duplicate: "This permission is already assigned to this role.",
    selectPermission: "Please select a permission.",
    addTitle: "Assign Permission",
    removeTitle: "Remove Permission",
    assignedCount: "Assigned",
    loading: "Loading data...",
    loadError: "Failed to load data.",
    assignError: "Failed to assign permission.",
    removeError: "Failed to remove permission.",
  },

  fa: {
    title: "صلاحیت‌های نقش‌ها",
    subtitle: "اختصاص و مدیریت صلاحیت‌ها برای نقش‌های سیستم.",
    roles: "نقش‌ها",
    permissions: "صلاحیت‌ها",
    assignments: "مجموع اختصاص‌ها",
    searchRoles: "جستجوی نقش‌ها...",
    searchPermissions: "جستجوی صلاحیت‌ها...",
    selectRole: "یک صلاحیت را انتخاب کنید",
    assigned: "صلاحیت‌های اختصاص‌یافته",
    available: "صلاحیت‌های موجود",
    add: "اختصاص صلاحیت",
    remove: "حذف",
    all: "تمام صلاحیت‌ها",
    read: "مشاهده",
    manage: "مدیریت",
    noRoles: "نقشی پیدا نشد.",
    noPermissions: "صلاحیتی پیدا نشد.",
    noAssigned: "هیچ صلاحیتی به این نقش اختصاص نیافته است.",
    noAvailable: "تمام صلاحیت‌ها اختصاص یافته‌اند.",
    confirmRemove: "آیا مطمئن هستید که می‌خواهید این صلاحیت را از نقش حذف کنید؟",
    cancel: "لغو",
    confirm: "حذف صلاحیت",
    close: "بستن",
    role: "نقش",
    code: "کد صلاحیت",
    description: "توضیحات",
    actions: "عملیات",
    success: "صلاحیت با موفقیت اختصاص یافت.",
    duplicate: "این صلاحیت قبلاً به این نقش اختصاص یافته است.",
    selectPermission: "لطفاً یک صلاحیت انتخاب کنید.",
    addTitle: "اختصاص صلاحیت",
    removeTitle: "حذف صلاحیت",
    assignedCount: "اختصاص‌یافته",
    loading: "در حال دریافت اطلاعات...",
    loadError: "دریافت اطلاعات ناموفق بود.",
    assignError: "اختصاص صلاحیت ناموفق بود.",
    removeError: "حذف صلاحیت ناموفق بود.",
  },

  ps: {
    title: "د رولونو اجازې",
    subtitle: "د سیستم رولونو ته اجازې ورکړئ او مدیریت یې کړئ.",
    roles: "رولونه",
    permissions: "اجازې",
    assignments: "د ټولو تړنو شمېر",
    searchRoles: "د رولونو لټون...",
    searchPermissions: "د اجازو لټون...",
    selectRole: "یوه اجازه وټاکئ",
    assigned: "ورکړل شوې اجازې",
    available: "موجودې اجازې",
    add: "اجازه ورکول",
    remove: "لرې کول",
    all: "ټولې اجازې",
    read: "لیدل",
    manage: "مدیریت",
    noRoles: "هیڅ رول ونه موندل شو.",
    noPermissions: "هیڅ اجازه ونه موندل شوه.",
    noAssigned: "دې رول ته اجازه نه ده ورکړل شوې.",
    noAvailable: "ټولې اجازې ورکړل شوې دي.",
    confirmRemove: "ایا غواړئ دا اجازه له رول څخه لرې کړئ؟",
    cancel: "لغوه",
    confirm: "اجازه لرې کول",
    close: "بندول",
    role: "رول",
    code: "د اجازې کوډ",
    description: "توضیحات",
    actions: "کړنې",
    success: "اجازه په بریالیتوب ورکړل شوه.",
    duplicate: "دا اجازه مخکې دې رول ته ورکړل شوې ده.",
    selectPermission: "مهرباني وکړئ یوه اجازه وټاکئ.",
    addTitle: "اجازه ورکول",
    removeTitle: "اجازه لرې کول",
    assignedCount: "ورکړل شوې",
    loading: "د معلوماتو ترلاسه کولو په حال کې...",
    loadError: "د معلوماتو ترلاسه کول ناکام شول.",
    assignError: "اجازه ورکول ناکام شول.",
    removeError: "د اجازې لرې کول ناکام شول.",
  },
};

export default function RolePermissions() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedRole, setSelectedRole] = useState(null);

  const [roleSearch, setRoleSearch] = useState("");
  const [permissionSearch, setPermissionSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [modal, setModal] = useState(null);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [newPermission, setNewPermission] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const language = document.documentElement.lang || "en";
  const t = translations[language] || translations.en;
  const rtl = ["fa", "ps"].includes(language);

  const getErrorMessage = (err, fallback) => {
    const data = err.response?.data;

    if (data?.message) return data.message;
    if (data?.detail) return data.detail;
    if (data?.error) return data.error;

    return err.message || fallback;
  };

  // Load all required data from backend
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [rolesData, permissionsData, assignmentsData] =
        await Promise.all([
          getRoles(),
          getPermissions(),
          getRolePermissions(),
        ]);

      if (
        !Array.isArray(rolesData) ||
        !Array.isArray(permissionsData) ||
        !Array.isArray(assignmentsData)
      ) {
        throw new Error(t.loadError);
      }

      setRoles(rolesData);
      setPermissions(permissionsData);
      setAssignments(assignmentsData);

      // Select the first available role when none is selected
      setSelectedRole((previous) => {
        if (rolesData.some((role) => role.id === previous)) {
          return previous;
        }

        return rolesData.length > 0 ? rolesData[0].id : null;
      });
    } catch (err) {
      console.error("Loading role permissions error:", err);
      setError(getErrorMessage(err, t.loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentRole = roles.find(
    (role) => role.id === selectedRole
  );

  const currentAssignments = assignments.filter(
    (item) => item.role_id === selectedRole
  );

  const assignedPermissions = permissions.filter((permission) =>
    currentAssignments.some(
      (item) => item.permission_id === permission.id
    )
  );

  const availablePermissions = permissions.filter(
    (permission) =>
      !currentAssignments.some(
        (item) => item.permission_id === permission.id
      )
  );

  // Search roles
  const filteredRoles = useMemo(() => {
    return roles.filter((role) =>
      (role.name || "")
        .toLowerCase()
        .includes(roleSearch.toLowerCase())
    );
  }, [roles, roleSearch]);

  // Search and filter permissions
  const filterPermissions = (items) => {
    return items.filter((permission) => {
      const code = permission.code || "";

      const matchesSearch =
        code.toLowerCase().includes(permissionSearch.toLowerCase()) ||
        (permission.description || "")
          .toLowerCase()
          .includes(permissionSearch.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "read" && code.endsWith(".read")) ||
        (filter === "manage" && code.endsWith(".manage"));

      return matchesSearch && matchesFilter;
    });
  };

  const filteredAssigned = filterPermissions(assignedPermissions);
  const filteredAvailable = filterPermissions(availablePermissions);

  // Assign permission through backend
  const handleAssign = async () => {
    if (!newPermission) {
      setError(t.selectPermission);
      return;
    }

    if (selectedRole === null) {
      setError(t.loadError);
      return;
    }

    const permissionId = Number(newPermission);

    const exists = assignments.some(
      (item) =>
        item.role_id === selectedRole &&
        item.permission_id === permissionId
    );

    if (exists) {
      setError(t.duplicate);
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await assignPermission({
        role_id: selectedRole,
        permission_id: permissionId,
      });

      if (response?.severity || response?.detail) {
        throw new Error(response.detail || t.assignError);
      }

      await loadData();

      setModal(null);
      setNewPermission("");
      setError("");
    } catch (err) {
      console.error("Assign permission error:", err);
      setError(getErrorMessage(err, t.assignError));
    } finally {
      setSaving(false);
    }
  };

  // Remove permission through backend
  const handleRemove = async () => {
    if (!selectedPermission) return;

    try {
      setSaving(true);
      setError("");

      // Delete by role_permissions.id, not permission.id
      await removePermission(selectedPermission.assignmentId);

      await loadData();

      setModal(null);
      setSelectedPermission(null);
    } catch (err) {
      console.error("Remove permission error:", err);
      setError(getErrorMessage(err, t.removeError));
    } finally {
      setSaving(false);
    }
  };

  const cardClass =
    "rounded-2xl border border-gray-200 bg-white text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white";

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-blue-900";

  const mutedText = "text-gray-500 dark:text-gray-400";

  const buttonClass =
    "rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700";

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className="min-h-screen space-y-6 bg-gray-50 p-4 text-gray-800 transition-colors dark:bg-gray-900 dark:text-white sm:p-6"
    >
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40">
              <ShieldCheck size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">{t.title}</h1>
              <p className={`mt-1 text-sm ${mutedText}`}>
                {t.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && !modal && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className={`${cardClass} p-5`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${mutedText}`}>{t.roles}</p>
                <h2 className="mt-2 text-3xl font-bold">
                  {roles.length}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40">
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className={`${cardClass} p-5`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${mutedText}`}>{t.permissions}</p>
                <h2 className="mt-2 text-3xl font-bold">
                  {permissions.length}
                </h2>
              </div>

              <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/40">
                <KeyRound size={24} />
              </div>
            </div>
          </div>

          <div className={`${cardClass} p-5`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${mutedText}`}>{t.assignments}</p>
                <h2 className="mt-2 text-3xl font-bold">
                  {assignments.length}
                </h2>
              </div>

              <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-900/40">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className={`${cardClass} py-16 text-center`}>
            <p className={mutedText}>{t.loading}</p>
          </div>
        ) : roles.length === 0 ? (
          <div className={`${cardClass} py-16 text-center`}>
            <Users size={35} className="mx-auto mb-3 opacity-40" />
            <p className={mutedText}>{t.noRoles}</p>
          </div>
        ) : (
          /* Main Content */
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

            {/* Roles Sidebar */}
            <div className="space-y-4 lg:col-span-4">
              <div className={`${cardClass} p-4`}>
                <h2 className="mb-4 flex items-center gap-2 font-semibold">
                  <Users size={19} className="text-blue-600" />
                  {t.roles}
                </h2>

                <div className="relative mb-4">
                  <Search
                    size={18}
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                      rtl ? "right-4" : "left-4"
                    }`}
                  />

                  <input
                    value={roleSearch}
                    onChange={(e) => setRoleSearch(e.target.value)}
                    placeholder={t.searchRoles}
                    className={`${inputClass} ${
                      rtl ? "pr-11" : "pl-11"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  {filteredRoles.map((role) => {
                    const count = assignments.filter(
                      (item) => item.role_id === role.id
                    ).length;

                    const active = selectedRole === role.id;

                    return (
                      <button
                        key={role.id}
                        onClick={() => {
                          setSelectedRole(role.id);
                          setPermissionSearch("");
                          setFilter("all");
                        }}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-start transition ${
                          active
                            ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30"
                            : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`rounded-xl p-2 ${
                              active
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900"
                                : "bg-gray-100 text-gray-500 dark:bg-gray-700"
                            }`}
                          >
                            <UserRound size={20} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold">
                              {role.name}
                            </p>
                            <p className={`mt-1 truncate text-xs ${mutedText}`}>
                              {role.description || "—"}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                            active
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}

                  {filteredRoles.length === 0 && (
                    <p className={`py-8 text-center text-sm ${mutedText}`}>
                      {t.noRoles}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Permissions Area */}
            <div className="space-y-4 lg:col-span-8">

              {/* Selected Role Header */}
              {currentRole && (
                <div className={`${cardClass} flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center`}>
                  <div>
                    <p className={`text-sm ${mutedText}`}>{t.role}</p>
                    <h2 className="mt-1 text-xl font-bold">
                      {currentRole.name}
                    </h2>
                    <p className={`mt-1 text-sm ${mutedText}`}>
                      {currentRole.description || "—"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 px-4 py-3 dark:bg-blue-900/30">
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      {t.assignedCount}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-200">
                      {assignedPermissions.length}
                    </p>
                  </div>
                </div>
              )}

              {/* Search and Filter */}
              <div className={`${cardClass} p-4`}>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search
                      size={18}
                      className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                        rtl ? "right-4" : "left-4"
                      }`}
                    />

                    <input
                      value={permissionSearch}
                      onChange={(e) => setPermissionSearch(e.target.value)}
                      placeholder={t.searchPermissions}
                      className={`${inputClass} ${
                        rtl ? "pr-11" : "pl-11"
                      }`}
                    />
                  </div>

                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className={`${inputClass} sm:w-48`}
                  >
                    <option value="all">{t.all}</option>
                    <option value="read">{t.read}</option>
                    <option value="manage">{t.manage}</option>
                  </select>
                </div>
              </div>

              {/* Assigned Permissions */}
              <div className={`${cardClass} overflow-hidden`}>
                <div className="flex flex-col justify-between gap-3 border-b border-gray-200 p-5 dark:border-gray-700 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 size={19} className="text-green-600" />
                      {t.assigned}
                    </h3>

                    <p className={`mt-1 text-sm ${mutedText}`}>
                      {assignedPermissions.length} {t.assignedCount}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setNewPermission("");
                      setError("");
                      setModal("add");
                    }}
                    disabled={availablePermissions.length === 0}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={18} />
                    {t.add}
                  </button>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAssigned.map((permission) => {
                    const assignment = currentAssignments.find(
                      (item) => item.permission_id === permission.id
                    );

                    return (
                      <div
                        key={assignment?.id}
                        className="flex flex-col justify-between gap-3 p-4 transition hover:bg-gray-50 dark:hover:bg-gray-700/30 sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0">
                          <span className="inline-block rounded-lg bg-blue-100 px-3 py-1.5 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            {permission.code}
                          </span>

                          <p className={`mt-2 text-sm ${mutedText}`}>
                            {permission.description || "—"}
                          </p>
                        </div>

                        <button
                          title={t.remove}
                          onClick={() => {
                            setSelectedPermission({
                              ...permission,
                              assignmentId: assignment.id,
                            });
                            setError("");
                            setModal("delete");
                          }}
                          className="flex shrink-0 items-center justify-center gap-2 self-start rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/30 sm:self-center"
                        >
                          <Trash2 size={16} />
                          {t.remove}
                        </button>
                      </div>
                    );
                  })}

                  {filteredAssigned.length === 0 && (
                    <div className={`py-10 text-center text-sm ${mutedText}`}>
                      <Lock size={30} className="mx-auto mb-3 opacity-40" />
                      {assignedPermissions.length === 0
                        ? t.noAssigned
                        : t.noPermissions}
                    </div>
                  )}
                </div>
              </div>

              {/* Available Permissions */}
              <div className={`${cardClass} overflow-hidden`}>
                <div className="border-b border-gray-200 p-5 dark:border-gray-700">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <KeyRound size={19} className="text-purple-600" />
                    {t.available}
                  </h3>

                  <p className={`mt-1 text-sm ${mutedText}`}>
                    {availablePermissions.length} {t.permissions}
                  </p>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAvailable.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0">
                        <span className="inline-block rounded-lg bg-gray-100 px-3 py-1.5 font-mono text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                          {permission.code}
                        </span>

                        <p className={`mt-2 text-sm ${mutedText}`}>
                          {permission.description || "—"}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setNewPermission(String(permission.id));
                          setError("");
                          setModal("add");
                        }}
                        className="flex shrink-0 items-center justify-center gap-2 self-start rounded-lg px-3 py-2 text-sm text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-900/30 sm:self-center"
                      >
                        <Plus size={16} />
                        {t.add}
                      </button>
                    </div>
                  ))}

                  {filteredAvailable.length === 0 && (
                    <div className={`py-10 text-center text-sm ${mutedText}`}>
                      {availablePermissions.length === 0
                        ? t.noAvailable
                        : t.noPermissions}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            <div className={`${cardClass} my-auto w-full max-w-lg p-6 shadow-2xl`}>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {modal === "add" ? t.addTitle : t.removeTitle}
                </h2>

                <button
                  onClick={() => setModal(null)}
                  disabled={saving}
                  className={buttonClass}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Assign Permission */}
              {modal === "add" && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      {t.role}
                    </label>

                    <input
                      value={currentRole?.name || ""}
                      disabled
                      className={`${inputClass} opacity-70`}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      {t.permissions}
                    </label>

                    <select
                      value={newPermission}
                      onChange={(e) => {
                        setNewPermission(e.target.value);
                        setError("");
                      }}
                      className={inputClass}
                    >
                      <option value="">{t.selectRole}</option>

                      {availablePermissions.map((permission) => (
                        <option
                          key={permission.id}
                          value={permission.id}
                        >
                          {permission.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <p className="flex items-center gap-2 text-sm text-red-500">
                      <AlertTriangle size={16} />
                      {error}
                    </p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleAssign}
                      disabled={saving}
                      className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "..." : t.add}
                    </button>

                    <button
                      onClick={() => setModal(null)}
                      disabled={saving}
                      className="rounded-xl border border-gray-300 px-5 py-3 transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              )}

              {/* Remove Permission */}
              {modal === "delete" && selectedPermission && (
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-900/30">
                      <AlertTriangle size={23} />
                    </div>

                    <div>
                      <p className="font-medium">{t.confirmRemove}</p>

                      <p className={`mt-2 font-mono text-sm ${mutedText}`}>
                        {selectedPermission.code}
                      </p>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleRemove}
                      disabled={saving}
                      className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "..." : t.confirm}
                    </button>

                    <button
                      onClick={() => setModal(null)}
                      disabled={saving}
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