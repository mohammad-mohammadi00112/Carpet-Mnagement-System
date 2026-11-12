

import { useMemo, useState } from "react";
import {
  Search,
  Eye,
  X,
  ClipboardList,
  User,
  Calendar,
  Database,
  Globe,
  Activity,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileJson,
} from "lucide-react";

const initialLogs = [
  {
    id: 1,
    user_id: 1,
    action: "INSERT",
    table_name: "carpets",
    record_id: 12,
    old_data: null,
    new_data: {
      code: "CRP-0012",
      name: "Persian Carpet",
      price: 25000,
      status: "active",
    },
    ip_address: "192.168.1.10",
    created_at: "2026-11-12T08:30:00",
  },
  {
    id: 2,
    user_id: 2,
    action: "UPDATE",
    table_name: "customers",
    record_id: 5,
    old_data: {
      phone: "0700000001",
      address: "Herat",
    },
    new_data: {
      phone: "0700000002",
      address: "Kabul",
    },
    ip_address: "192.168.1.12",
    created_at: "2026-11-12T09:15:00",
  },
  {
    id: 3,
    user_id: 1,
    action: "DELETE",
    table_name: "employees",
    record_id: 8,
    old_data: {
      first_name: "Ahmad",
      last_name: "Mohammadi",
      phone: "0700000003",
    },
    new_data: null,
    ip_address: "192.168.1.10",
    created_at: "2026-11-11T14:20:00",
  },
  {
    id: 4,
    user_id: 3,
    action: "INSERT",
    table_name: "sales",
    record_id: 24,
    old_data: null,
    new_data: {
      customer_id: 5,
      total_amount: 45000,
      payment_status: "paid",
    },
    ip_address: "192.168.1.15",
    created_at: "2026-11-11T11:45:00",
  },
  {
    id: 5,
    user_id: 2,
    action: "UPDATE",
    table_name: "inventory",
    record_id: 3,
    old_data: {
      quantity: 10,
    },
    new_data: {
      quantity: 15,
    },
    ip_address: "192.168.1.12",
    created_at: "2026-11-10T10:00:00",
  },
  {
    id: 6,
    user_id: 1,
    action: "DELETE",
    table_name: "expenses",
    record_id: 9,
    old_data: {
      amount: 5000,
      description: "Transportation",
    },
    new_data: null,
    ip_address: "192.168.1.10",
    created_at: "2026-11-09T16:30:00",
  },
];

const translations = {
  en: {
    title: "Audit Log",
    subtitle: "Monitor and review activities performed across your system.",
    total: "Total Activities",
    inserts: "Created Records",
    updates: "Updated Records",
    deletes: "Deleted Records",
    search: "Search by user, table, record ID or IP...",
    allActions: "All Actions",
    allTables: "All Tables",
    date: "Date",
    activity: "Activity",
    user: "User ID",
    table: "Table",
    record: "Record ID",
    ip: "IP Address",
    details: "Details",
    noLogs: "No audit records found.",
    showing: "Showing",
    of: "of",
    previous: "Previous",
    next: "Next",
    viewDetails: "View Details",
    activityDetails: "Activity Details",
    oldData: "Previous Data",
    newData: "New Data",
    noData: "No data available",
    system: "System",
    close: "Close",
    action: "Action",
    created: "Created",
    updated: "Updated",
    deleted: "Deleted",
    clear: "Clear Filters",
    unknown: "Unknown",
  },
  fa: {
    title: "گزارش فعالیت‌ها",
    subtitle: "فعالیت‌های انجام‌شده در سیستم را مشاهده و بررسی کنید.",
    total: "مجموع فعالیت‌ها",
    inserts: "رکوردهای ایجادشده",
    updates: "رکوردهای ویرایش‌شده",
    deletes: "رکوردهای حذف‌شده",
    search: "جستجو بر اساس کاربر، جدول، شماره رکورد یا IP...",
    allActions: "تمام عملیات",
    allTables: "تمام جدول‌ها",
    date: "تاریخ",
    activity: "فعالیت",
    user: "شناسه کاربر",
    table: "جدول",
    record: "شناسه رکورد",
    ip: "آدرس IP",
    details: "جزئیات",
    noLogs: "هیچ فعالیتی پیدا نشد.",
    showing: "نمایش",
    of: "از",
    previous: "قبلی",
    next: "بعدی",
    viewDetails: "مشاهده جزئیات",
    activityDetails: "جزئیات فعالیت",
    oldData: "اطلاعات قبلی",
    newData: "اطلاعات جدید",
    noData: "اطلاعاتی موجود نیست",
    system: "سیستم",
    close: "بستن",
    action: "عملیات",
    created: "ایجاد",
    updated: "ویرایش",
    deleted: "حذف",
    clear: "پاک‌کردن فیلترها",
    unknown: "نامشخص",
  },
  ps: {
    title: "د فعالیتونو راپور",
    subtitle: "په سیستم کې ترسره شوي فعالیتونه وګورئ او وڅېړئ.",
    total: "ټول فعالیتونه",
    inserts: "جوړ شوي ریکارډونه",
    updates: "سم شوي ریکارډونه",
    deletes: "حذف شوي ریکارډونه",
    search: "د کارونکي، جدول، ریکارډ یا IP له مخې لټون...",
    allActions: "ټول عملیات",
    allTables: "ټول جدولونه",
    date: "نېټه",
    activity: "فعالیت",
    user: "د کارونکي پېژند",
    table: "جدول",
    record: "د ریکارډ پېژند",
    ip: "IP پته",
    details: "جزئیات",
    noLogs: "هیڅ فعالیت ونه موندل شو.",
    showing: "ښودل",
    of: "له",
    previous: "مخکینی",
    next: "راتلونکی",
    viewDetails: "جزئیات وګورئ",
    activityDetails: "د فعالیت جزئیات",
    oldData: "پخواني معلومات",
    newData: "نوي معلومات",
    noData: "معلومات نشته",
    system: "سیستم",
    close: "بندول",
    action: "عملیات",
    created: "جوړول",
    updated: "سمول",
    deleted: "حذف",
    clear: "فلټرونه پاکول",
    unknown: "نامعلوم",
  },
};

const actionStyles = {
  INSERT: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  UPDATE: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  DELETE: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export default function AuditLog() {
  const lang = document.documentElement.lang || "en";
  const t = translations[lang] || translations.en;
  const isRtl = lang === "fa" || lang === "ps";

  const [logs] = useState(initialLogs);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [tableFilter, setTableFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState(null);
  const [page, setPage] = useState(1);

  const pageSize = 6;

  const tables = useMemo(
    () => [...new Set(logs.map((log) => log.table_name))],
    [logs]
  );

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const query = search.toLowerCase();

      const matchesSearch =
        String(log.user_id).includes(query) ||
        log.table_name.toLowerCase().includes(query) ||
        String(log.record_id).includes(query) ||
        String(log.ip_address || "").toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query);

      const matchesAction =
        actionFilter === "all" || log.action === actionFilter;

      const matchesTable =
        tableFilter === "all" || log.table_name === tableFilter;

      return matchesSearch && matchesAction && matchesTable;
    });
  }, [logs, search, actionFilter, tableFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));

  const currentLogs = filteredLogs.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const stats = [
    {
      label: t.total,
      value: logs.length,
      icon: ClipboardList,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
    },
    {
      label: t.inserts,
      value: logs.filter((log) => log.action === "INSERT").length,
      icon: Activity,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      label: t.updates,
      value: logs.filter((log) => log.action === "UPDATE").length,
      icon: RefreshCw,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10",
    },
    {
      label: t.deletes,
      value: logs.filter((log) => log.action === "DELETE").length,
      icon: Database,
      color: "text-red-600 bg-red-50 dark:bg-red-500/10",
    },
  ];

  const formatDate = (date) => {
    if (!date) return t.unknown;

    return new Date(date).toLocaleString(
      lang === "fa" ? "fa-IR" : lang === "ps" ? "ps-AF" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getActionLabel = (action) => {
    if (action === "INSERT") return t.created;
    if (action === "UPDATE") return t.updated;
    if (action === "DELETE") return t.deleted;
    return action;
  };

  const clearFilters = () => {
    setSearch("");
    setActionFilter("all");
    setTableFilter("all");
    setPage(1);
  };

  const hasFilters =
    search !== "" || actionFilter !== "all" || tableFilter !== "all";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
          <ClipboardList size={18} className="text-blue-600" />
          <span>{t.total}:</span>
          <strong>{logs.length}</strong>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">{stat.value}</h2>
                </div>
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1fr_200px_200px_auto]">
          <div className="relative">
            <Search
              size={18}
              className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
                isRtl ? "right-3" : "left-3"
              }`}
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t.search}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 ${
                isRtl ? "pr-10 pl-3" : "pl-10 pr-3"
              }`}
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="all">{t.allActions}</option>
            <option value="INSERT">{t.created}</option>
            <option value="UPDATE">{t.updated}</option>
            <option value="DELETE">{t.deleted}</option>
          </select>

          <select
            value={tableFilter}
            onChange={(e) => {
              setTableFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="all">{t.allTables}</option>
            {tables.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {t.clear}
            </button>
          )}
        </div>
      </div>

      {/* Audit Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-sm">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
              <tr>
                <th className="px-5 py-4 text-start font-semibold">ID</th>
                <th className="px-5 py-4 text-start font-semibold">{t.activity}</th>
                <th className="px-5 py-4 text-start font-semibold">{t.user}</th>
                <th className="px-5 py-4 text-start font-semibold">{t.table}</th>
                <th className="px-5 py-4 text-start font-semibold">{t.record}</th>
                <th className="px-5 py-4 text-start font-semibold">{t.ip}</th>
                <th className="px-5 py-4 text-start font-semibold">{t.date}</th>
                <th className="px-5 py-4 text-end font-semibold">{t.details}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentLogs.map((log) => (
                <tr
                  key={log.id}
                  className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <td className="px-5 py-4 font-medium">#{log.id}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        actionStyles[log.action] ||
                        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {getActionLabel(log.action)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-slate-400" />
                      {log.user_id ?? t.system}
                    </div>
                  </td>

                  <td className="px-5 py-4 font-medium">{log.table_name}</td>
                  <td className="px-5 py-4">#{log.record_id}</td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Globe size={15} />
                      {log.ip_address || "-"}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                    {formatDate(log.created_at)}
                  </td>

                  <td className="px-5 py-4 text-end">
                    <button
                      onClick={() => setSelectedLog(log)}
                      title={t.viewDetails}
                      className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-500/10"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {currentLogs.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    <ClipboardList size={32} className="mx-auto mb-3 opacity-40" />
                    {t.noLogs}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.showing} {filteredLogs.length === 0 ? 0 : (page - 1) * pageSize + 1}
            {" - "}
            {Math.min(page * pageSize, filteredLogs.length)} {t.of}{" "}
            {filteredLogs.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 p-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
            >
              {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            <span className="px-2 text-sm">
              {page} / {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-slate-200 p-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
            >
              {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedLog(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div>
                <h2 className="text-lg font-bold">{t.activityDetails}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  #{selectedLog.id} · {selectedLog.table_name}
                </p>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                  <p className="mb-2 text-xs text-slate-500">{t.action}</p>
                  <span
                    className={`inline-flex rounded-lg px-3 py-1.5 text-sm font-semibold ${
                      actionStyles[selectedLog.action] || ""
                    }`}
                  >
                    {getActionLabel(selectedLog.action)}
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                  <p className="mb-2 text-xs text-slate-500">{t.user}</p>
                  <p className="font-semibold">
                    {selectedLog.user_id ?? t.system}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                  <p className="mb-2 text-xs text-slate-500">{t.table}</p>
                  <p className="font-semibold">{selectedLog.table_name}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                  <p className="mb-2 text-xs text-slate-500">{t.record}</p>
                  <p className="font-semibold">#{selectedLog.record_id}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                  <p className="mb-2 text-xs text-slate-500">{t.ip}</p>
                  <p className="font-semibold">
                    {selectedLog.ip_address || "-"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                  <p className="mb-2 text-xs text-slate-500">{t.date}</p>
                  <p className="flex items-center gap-2 font-semibold">
                    <Calendar size={16} />
                    {formatDate(selectedLog.created_at)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                    <FileJson size={17} className="text-amber-600" />
                    <h3 className="font-semibold">{t.oldData}</h3>
                  </div>

                  <pre className="max-h-72 overflow-auto p-4 text-xs leading-6 text-slate-600 dark:text-slate-300">
                    {selectedLog.old_data
                      ? JSON.stringify(selectedLog.old_data, null, 2)
                      : t.noData}
                  </pre>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                    <FileJson size={17} className="text-emerald-600" />
                    <h3 className="font-semibold">{t.newData}</h3>
                  </div>

                  <pre className="max-h-72 overflow-auto p-4 text-xs leading-6 text-slate-600 dark:text-slate-300">
                    {selectedLog.new_data
                      ? JSON.stringify(selectedLog.new_data, null, 2)
                      : t.noData}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 p-5 dark:border-slate-800">
              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
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
