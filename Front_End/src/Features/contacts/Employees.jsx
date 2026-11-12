
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Eye, Pencil, Trash2, X, Users,
  UserCheck, Wallet, Briefcase
} from "lucide-react";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee
} from "../services/contacts/employeeService";

const translations = {
  en: {
    title: "Employees", subtitle: "Manage employee information and work details",
    add: "Add Employee", search: "Search employees...",
    total: "Total Employees", active: "Active Employees",
    salary: "Total Monthly Salaries", positions: "Job Positions",
    name: "Full Name", phone: "Phone", email: "Email",
    job: "Job Title", salaryLabel: "Salary", hire: "Hire Date",
    status: "Employment Status", actions: "Actions",
    activeStatus: "Active", inactive: "Inactive", hired: "Hired",
    all: "All Employees", save: "Save Employee", update: "Update Employee",
    cancel: "Cancel", edit: "Edit", view: "View", delete: "Delete",
    first: "First Name", last: "Last Name", national: "National ID",
    emergency: "Emergency Phone", address: "Home Address",
    shiftStart: "Shift Start", shiftEnd: "Shift End",
    details: "Employee Details", close: "Close",
    noData: "No employees found",
    confirm: "Are you sure you want to delete this employee?",
    required: "First name is required",
    loading: "Loading employees...",
    loadError: "Failed to load employees",
    saveError: "Failed to save employee",
    deleteError: "Failed to delete employee",
    statusError: "Failed to update employee status",
  },
  fa: {
    title: "کارمندان", subtitle: "مدیریت اطلاعات و جزئیات کاری کارمندان",
    add: "افزودن کارمند", search: "جستجوی کارمندان...",
    total: "مجموع کارمندان", active: "کارمندان فعال",
    salary: "مجموع معاش ماهانه", positions: "تعداد وظایف",
    name: "نام کامل", phone: "شماره تماس", email: "ایمیل",
    job: "عنوان وظیفه", salaryLabel: "معاش", hire: "تاریخ استخدام",
    status: "وضعیت استخدام", actions: "عملیات",
    activeStatus: "فعال", inactive: "غیرفعال", hired: "استخدام‌شده",
    all: "همه کارمندان", save: "ثبت کارمند", update: "ویرایش کارمند",
    cancel: "لغو", edit: "ویرایش", view: "مشاهده", delete: "حذف",
    first: "نام", last: "تخلص", national: "شماره تذکره",
    emergency: "شماره اضطراری", address: "آدرس منزل",
    shiftStart: "شروع کاری", shiftEnd: "پایان کاری",
    details: "جزئیات کارمند", close: "بستن",
    noData: "کارمندی پیدا نشد",
    confirm: "آیا از حذف این کارمند مطمئن هستید؟",
    required: "نام الزامی است",
    loading: "در حال دریافت کارمندان...",
    loadError: "دریافت کارمندان ناموفق بود",
    saveError: "ثبت یا ویرایش کارمند ناموفق بود",
    deleteError: "حذف کارمند ناموفق بود",
    statusError: "تغییر وضعیت کارمند ناموفق بود",
  },
  ps: {
    title: "کارکوونکي", subtitle: "د کارکوونکو معلومات او کاري جزئیات اداره کړئ",
    add: "نوی کارکوونکی", search: "کارکوونکي ولټوئ...",
    total: "ټول کارکوونکي", active: "فعال کارکوونکي",
    salary: "ټول میاشتني معاشونه", positions: "د دندو شمېر",
    name: "بشپړ نوم", phone: "د اړیکې شمېره", email: "برېښنالیک",
    job: "دنده", salaryLabel: "معاش", hire: "د ګمارنې نېټه",
    status: "د ګمارنې حالت", actions: "کړنې",
    activeStatus: "فعال", inactive: "غیرفعال", hired: "ګمارل شوی",
    all: "ټول کارکوونکي", save: "ثبتول", update: "سمون",
    cancel: "لغوه", edit: "سمون", view: "کتل", delete: "ړنګول",
    first: "نوم", last: "تخلص", national: "د پېژندپاڼې شمېره",
    emergency: "بیړنۍ شمېره", address: "د کور پته",
    shiftStart: "د کار پیل", shiftEnd: "د کار پای",
    details: "د کارکوونکي معلومات", close: "بندول",
    noData: "کارکوونکی ونه موندل شو",
    confirm: "ایا د دې کارکوونکي له ړنګولو ډاډه یاست؟",
    required: "نوم اړین دی",
    loading: "د کارکوونکو معلومات ترلاسه کېږي...",
    loadError: "د کارکوونکو ترلاسه کول ناکام شول",
    saveError: "د کارکوونکي ثبت یا سمون ناکام شو",
    deleteError: "د کارکوونکي ړنګول ناکام شول",
    statusError: "د کارکوونکي حالت بدلول ناکام شول",
  },
};

const emptyForm = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  national_id: "",
  emergency_phone: "",
  home_address: "",
  job_title: "",
  salary: "",
  hire_date: "",
  status: "hired",
  shift_start: "08:00",
  shift_end: "17:00",
  is_active: true,
};

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message ||
  err.response?.data?.error ||
  err.message ||
  fallback;

export default function Employee() {
  const language = localStorage.getItem("language") || "en";
  const t = translations[language] || translations.en;
  const rtl = ["fa", "ps"].includes(language);

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, t.loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filtered = useMemo(() => employees.filter(emp => {
    const text = `${emp.first_name || ""} ${emp.last_name || ""} ${emp.phone || ""} ${emp.job_title || ""}`.toLowerCase();

    return text.includes(search.toLowerCase()) &&
      (filter === "all" ||
        (filter === "active" ? emp.is_active : emp.status === filter));
  }), [employees, search, filter]);

  const totalSalary = employees
    .filter(emp => emp.is_active)
    .reduce((sum, emp) => sum + Number(emp.salary || 0), 0);

  const stats = [
    { label: t.total, value: employees.length, icon: Users },
    { label: t.active, value: employees.filter(e => e.is_active).length, icon: UserCheck },
    { label: t.salary, value: totalSalary.toLocaleString(), icon: Wallet },
    { label: t.positions, value: new Set(employees.map(e => e.job_title).filter(Boolean)).size, icon: Briefcase },
  ];

  const openAdd = () => {
    setForm({ ...emptyForm });
    setSelected(null);
    setError("");
    setModal("form");
  };

  const openEdit = (employee) => {
    setSelected(employee);
    setForm({
      ...emptyForm,
      ...employee,
      salary: employee.salary ?? "",
      hire_date: employee.hire_date
        ? String(employee.hire_date).slice(0, 10)
        : "",
      shift_start: employee.shift_start
        ? String(employee.shift_start).slice(0, 5)
        : "08:00",
      shift_end: employee.shift_end
        ? String(employee.shift_end).slice(0, 5)
        : "17:00",
    });
    setError("");
    setModal("form");
  };

  const saveEmployee = async (e) => {
    e.preventDefault();

    if (!form.first_name.trim()) {
      setError(t.required);
      return;
    }

    try {
      setSaving(true);
      setError("");

      const employeeData = {
        ...form,
        salary: form.salary === "" ? null : Number(form.salary),
      };

      if (selected) {
        await updateEmployee(selected.id, employeeData);
      } else {
        await createEmployee(employeeData);
      }

      await loadEmployees();
      setModal("");
      setSelected(null);
      setForm({ ...emptyForm });
    } catch (err) {
      setError(getErrorMessage(err, t.saveError));
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (employee) => {
    try {
      setActionId(employee.id);
      setError("");

      await updateEmployeeStatus(employee.id, !employee.is_active);

      setEmployees(prev => prev.map(emp =>
        emp.id === employee.id
          ? { ...emp, is_active: !employee.is_active }
          : emp
      ));
    } catch (err) {
      setError(getErrorMessage(err, t.statusError));
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.confirm)) return;

    try {
      setActionId(id);
      setError("");

      await deleteEmployee(id);

      setEmployees(prev => prev.filter(emp => emp.id !== id));

      if (selected?.id === id) {
        setSelected(null);
        setModal("");
      }
    } catch (err) {
      setError(getErrorMessage(err, t.deleteError));
    } finally {
      setActionId(null);
    }
  };

  const fieldClass = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="space-y-6 p-3 text-gray-800 dark:text-gray-100 sm:p-5 lg:p-6">

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
            <option value="hired">{t.hired}</option>
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[850px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                {[t.name, t.phone, t.job, t.salaryLabel, t.hire, t.status, t.actions].map(x => (
                  <th key={x} className="px-3 py-3 text-start font-semibold">{x}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-gray-500">{t.loading}</td>
                </tr>
              ) : filtered.map(emp => (
                <tr key={emp.id} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                  <td className="px-3 py-4 font-medium">{emp.first_name} {emp.last_name}</td>
                  <td className="px-3 py-4">{emp.phone || "—"}</td>
                  <td className="px-3 py-4">{emp.job_title || "—"}</td>
                  <td className="px-3 py-4">{Number(emp.salary || 0).toLocaleString()}</td>
                  <td className="px-3 py-4">{emp.hire_date ? String(emp.hire_date).slice(0, 10) : "—"}</td>

                  <td className="px-3 py-4">
                    <button
                      disabled={actionId === emp.id}
                      onClick={() => handleStatus(emp)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium disabled:opacity-50 ${emp.is_active ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}
                    >
                      {emp.is_active ? t.activeStatus : t.inactive}
                    </button>
                  </td>

                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <button title={t.view} onClick={() => { setSelected(emp); setModal("view"); }} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Eye size={17} />
                      </button>

                      <button title={t.edit} onClick={() => openEdit(emp)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950">
                        <Pencil size={17} />
                      </button>

                      <button
                        title={t.delete}
                        disabled={actionId === emp.id}
                        onClick={() => handleDelete(emp.id)}
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
                  <td colSpan="7" className="py-10 text-center text-gray-500">{t.noData}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900 sm:p-6">

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
                  [t.national, selected.national_id],
                  [t.emergency, selected.emergency_phone],
                  [t.address, selected.home_address],
                  [t.job, selected.job_title],
                  [t.salaryLabel, Number(selected.salary || 0).toLocaleString()],
                  [t.hire, selected.hire_date ? String(selected.hire_date).slice(0, 10) : ""],
                  [t.status, selected.status],
                  [t.shiftStart, selected.shift_start],
                  [t.shiftEnd, selected.shift_end],
                  [t.active, selected.is_active ? t.activeStatus : t.inactive],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="mt-1 break-words text-sm font-medium">{value || "—"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={saveEmployee} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    ["first_name", t.first, "text", true],
                    ["last_name", t.last],
                    ["phone", t.phone, "tel"],
                    ["email", t.email, "email"],
                    ["national_id", t.national],
                    ["emergency_phone", t.emergency, "tel"],
                    ["home_address", t.address],
                    ["job_title", t.job],
                    ["salary", t.salaryLabel, "number"],
                    ["hire_date", t.hire, "date"],
                    ["shift_start", t.shiftStart, "time"],
                    ["shift_end", t.shiftEnd, "time"],
                  ].map(([key, label, type = "text", required = false]) => (
                    <div key={key}>
                      <label className={labelClass}>{label}</label>
                      <input
                        type={type}
                        required={required}
                        min={type === "number" ? "0" : undefined}
                        value={form[key] ?? ""}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        className={fieldClass}
                      />
                    </div>
                  ))}

                  <div>
                    <label className={labelClass}>{t.status}</label>
                    <select
                      value={form.status}
                      onChange={e => setForm({ ...form, status: e.target.value })}
                      className={fieldClass}
                    >
                      <option value="hired">{t.hired}</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2 text-sm">
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
                  <button type="button" onClick={() => setModal("")} className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700">
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
