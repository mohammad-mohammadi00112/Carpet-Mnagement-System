

import { useMemo, useState } from "react";
import {
  Search, Plus, X, Pencil, Trash2, Coins, CheckCircle2,
  CircleDollarSign, Power, Star, ChevronLeft, ChevronRight,
  Filter, Globe, AlertTriangle
} from "lucide-react";
import { useTranslation } from "react-i18next";

const translations = {
  en: {
    title: "Currencies",
    subtitle: "Manage system currencies and base currency settings",
    add: "Add Currency",
    edit: "Edit Currency",
    delete: "Delete Currency",
    search: "Search by code or name...",
    total: "Total Currencies",
    active: "Active Currencies",
    inactive: "Inactive Currencies",
    base: "Base Currency",
    code: "Currency Code",
    name: "Currency Name",
    symbol: "Symbol",
    status: "Status",
    actions: "Actions",
    isBase: "Set as Base Currency",
    isActive: "Active Currency",
    activeLabel: "Active",
    inactiveLabel: "Inactive",
    yes: "Yes",
    no: "No",
    all: "All",
    allStatus: "All Status",
    save: "Save Currency",
    update: "Update Currency",
    cancel: "Cancel",
    confirmDelete: "Are you sure you want to delete this currency?",
    noCurrencies: "No currencies found",
    required: "This field is required",
    invalidCode: "Currency code must contain exactly 3 letters",
    successAdd: "Currency added successfully",
    successEdit: "Currency updated successfully",
    successDelete: "Currency deleted successfully",
    previous: "Previous",
    next: "Next",
    showing: "Showing",
    of: "of",
    entries: "entries",
    clearFilters: "Clear Filters",
    baseWarning: "Only one base currency is allowed. Setting this currency as base will replace the previous base currency.",
    baseBadge: "Base",
    noSymbol: "No symbol",
    confirmBase: "Confirm Base Currency Change",
    confirmBaseMessage: "This currency will become the system's base currency. The previous base currency will lose that status.",
    confirm: "Confirm",
    details: "Currency Details",
    duplicateCode: "This currency code already exists",
    deleteBase: "You cannot delete the base currency. Set another currency as base first."
  },
  fa: {
    title: "ارزها",
    subtitle: "مدیریت ارزهای سیستم و تنظیم ارز اصلی",
    add: "افزودن ارز",
    edit: "ویرایش ارز",
    delete: "حذف ارز",
    search: "جستجو بر اساس کد یا نام...",
    total: "مجموع ارزها",
    active: "ارزهای فعال",
    inactive: "ارزهای غیرفعال",
    base: "ارز اصلی",
    code: "کد ارز",
    name: "نام ارز",
    symbol: "نماد",
    status: "وضعیت",
    actions: "عملیات",
    isBase: "تعیین به‌عنوان ارز اصلی",
    isActive: "ارز فعال",
    activeLabel: "فعال",
    inactiveLabel: "غیرفعال",
    yes: "بلی",
    no: "نخیر",
    all: "همه",
    allStatus: "همه وضعیت‌ها",
    save: "ثبت ارز",
    update: "به‌روزرسانی ارز",
    cancel: "لغو",
    confirmDelete: "آیا از حذف این ارز مطمئن هستید؟",
    noCurrencies: "هیچ ارزی یافت نشد",
    required: "این فیلد الزامی است",
    invalidCode: "کد ارز باید دقیقاً سه حرف داشته باشد",
    successAdd: "ارز با موفقیت اضافه شد",
    successEdit: "ارز با موفقیت ویرایش شد",
    successDelete: "ارز با موفقیت حذف شد",
    previous: "قبلی",
    next: "بعدی",
    showing: "نمایش",
    of: "از",
    entries: "مورد",
    clearFilters: "پاک کردن فیلترها",
    baseWarning: "فقط یک ارز می‌تواند اصلی باشد. با تعیین این ارز به‌عنوان ارز اصلی، ارز اصلی قبلی جایگزین می‌شود.",
    baseBadge: "اصلی",
    noSymbol: "بدون نماد",
    confirmBase: "تأیید تغییر ارز اصلی",
    confirmBaseMessage: "این ارز به ارز اصلی سیستم تبدیل می‌شود و ارز اصلی قبلی این وضعیت را از دست می‌دهد.",
    confirm: "تأیید",
    details: "جزئیات ارز",
    duplicateCode: "این کد ارز قبلاً ثبت شده است",
    deleteBase: "ارز اصلی قابل حذف نیست. ابتدا ارز دیگری را به‌عنوان ارز اصلی تعیین کنید."
  },
  ps: {
    title: "اسعار",
    subtitle: "د سیستم د اسعارو او اصلي اسعارو مدیریت",
    add: "اسعار اضافه کړئ",
    edit: "اسعار سمول",
    delete: "اسعار حذف کړئ",
    search: "د کوډ یا نوم له مخې لټون...",
    total: "ټول اسعار",
    active: "فعال اسعار",
    inactive: "غیرفعال اسعار",
    base: "اصلي اسعار",
    code: "د اسعارو کوډ",
    name: "د اسعارو نوم",
    symbol: "نښه",
    status: "حالت",
    actions: "کړنې",
    isBase: "د اصلي اسعارو په توګه ټاکل",
    isActive: "فعال اسعار",
    activeLabel: "فعال",
    inactiveLabel: "غیرفعال",
    yes: "هو",
    no: "نه",
    all: "ټول",
    allStatus: "ټول حالتونه",
    save: "اسعار ثبت کړئ",
    update: "اسعار تازه کړئ",
    cancel: "لغوه",
    confirmDelete: "ایا غواړئ دا اسعار حذف کړئ؟",
    noCurrencies: "اسعار ونه موندل شول",
    required: "دا برخه اړینه ده",
    invalidCode: "د اسعارو کوډ باید درې توري ولري",
    successAdd: "اسعار په بریالیتوب اضافه شول",
    successEdit: "اسعار په بریالیتوب بدل شول",
    successDelete: "اسعار په بریالیتوب حذف شول",
    previous: "مخکینی",
    next: "بل",
    showing: "ښودل",
    of: "له",
    entries: "ریکارډونه",
    clearFilters: "فلټرونه پاک کړئ",
    baseWarning: "یوازې یو اسعار اصلي کېدای شي. د دې اسعارو په ټاکلو سره به پخواني اصلي اسعار بدل شي.",
    baseBadge: "اصلي",
    noSymbol: "نښه نشته",
    confirmBase: "د اصلي اسعارو بدلون تایید کړئ",
    confirmBaseMessage: "دا اسعار به د سیستم اصلي اسعار شي او پخواني اصلي اسعار به دا حالت له لاسه ورکړي.",
    confirm: "تایید",
    details: "د اسعارو معلومات",
    duplicateCode: "دا د اسعارو کوډ مخکې ثبت شوی",
    deleteBase: "اصلي اسعار نشي حذف کېدای. لومړی بل اسعار اصلي وټاکئ."
  }
};

const initialCurrencies = [
  { id: 1, code: "AFN", name: "Afghan Afghani", symbol: "؋", is_base: true, is_active: true },
  { id: 2, code: "USD", name: "US Dollar", symbol: "$", is_base: false, is_active: true },
  { id: 3, code: "EUR", name: "Euro", symbol: "€", is_base: false, is_active: true },
  { id: 4, code: "PKR", name: "Pakistani Rupee", symbol: "₨", is_base: false, is_active: false },
  { id: 5, code: "IRR", name: "Iranian Rial", symbol: "﷼", is_base: false, is_active: true }
];

const emptyForm = {
  code: "",
  name: "",
  symbol: "",
  is_base: false,
  is_active: true
};

export default function Currencies() {
  const { i18n } = useTranslation();

  const language =
    i18n.resolvedLanguage?.split("-")[0] ||
    i18n.language?.split("-")[0] ||
    "en";

  const t = translations[language] || translations.en;
  const isRTL = ["fa", "ps"].includes(language);

  const [currencies, setCurrencies] = useState(initialCurrencies);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [baseCandidate, setBaseCandidate] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");

  const pageSize = 6;

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };

  const filteredCurrencies = useMemo(() => {
    return currencies.filter(currency => {
      const query = search.toLowerCase();

      const matchesSearch =
        currency.code.toLowerCase().includes(query) ||
        currency.name.toLowerCase().includes(query) ||
        (currency.symbol || "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "" ||
        (statusFilter === "active" && currency.is_active) ||
        (statusFilter === "inactive" && !currency.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [currencies, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCurrencies.length / pageSize)
  );

  const currentCurrencies = filteredCurrencies.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const activeCount = currencies.filter(c => c.is_active).length;
  const inactiveCount = currencies.filter(c => !c.is_active).length;
  const baseCurrency = currencies.find(c => c.is_base);

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (currency) => {
    setEditingId(currency.id);
    setForm({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol || "",
      is_base: currency.is_base,
      is_active: currency.is_active
    });
    setModal(true);
  };

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const code = form.code.trim().toUpperCase();
    const name = form.name.trim();
    const symbol = form.symbol.trim();

    if (!code || !name) {
      notify(t.required);
      return;
    }

    if (!/^[A-Z]{3}$/.test(code)) {
      notify(t.invalidCode);
      return;
    }

    const duplicate = currencies.some(
      currency =>
        currency.code.toUpperCase() === code &&
        currency.id !== editingId
    );

    if (duplicate) {
      notify(t.duplicateCode);
      return;
    }

    const currencyData = {
      ...form,
      code,
      name,
      symbol
    };

    if (form.is_base) {
      setBaseCandidate({ ...currencyData, id: editingId });
      setModal(false);
      return;
    }

    saveCurrency(currencyData);
  };

  const saveCurrency = (currencyData) => {
    if (editingId) {
      setCurrencies(prev =>
        prev.map(currency =>
          currency.id === editingId
            ? { ...currency, ...currencyData }
            : currency
        )
      );
      notify(t.successEdit);
    } else {
      const newCurrency = {
        ...currencyData,
        id: Math.max(0, ...currencies.map(c => c.id)) + 1
      };
      setCurrencies(prev => [newCurrency, ...prev]);
      notify(t.successAdd);
    }

    setModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const confirmBaseChange = () => {
    if (!baseCandidate) return;

    const candidate = baseCandidate;

    setCurrencies(prev => {
      let updated = prev.map(currency => ({
        ...currency,
        is_base: false
      }));

      if (candidate.id) {
        updated = updated.map(currency =>
          currency.id === candidate.id
            ? { ...currency, ...candidate, is_base: true }
            : currency
        );
      } else {
        updated = [
          {
            ...candidate,
            id: Math.max(0, ...prev.map(c => c.id)) + 1,
            is_base: true
          },
          ...updated
        ];
      }

      return updated;
    });

    notify(editingId ? t.successEdit : t.successAdd);
    setBaseCandidate(null);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = () => {
    const currency = currencies.find(c => c.id === deleteId);

    if (currency?.is_base) {
      setDeleteId(null);
      notify(t.deleteBase);
      return;
    }

    setCurrencies(prev => prev.filter(c => c.id !== deleteId));
    setDeleteId(null);
    notify(t.successDelete);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPage(1);
  };

  const toggleActive = (currency) => {
    setCurrencies(prev =>
      prev.map(c =>
        c.id === currency.id
          ? { ...c, is_active: !c.is_active }
          : c
      )
    );
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
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

        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          {t.add}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.total}</p>
              <h2 className="mt-2 text-2xl font-bold">{currencies.length}</h2>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Coins size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.active}</p>
              <h2 className="mt-2 text-2xl font-bold">{activeCount}</h2>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CheckCircle2 size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.inactive}</p>
              <h2 className="mt-2 text-2xl font-bold">{inactiveCount}</h2>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <Power size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.base}</p>
              <h2 className="mt-2 truncate text-xl font-bold">
                {baseCurrency
                  ? `${baseCurrency.code} (${baseCurrency.symbol || ""})`
                  : "-"}
              </h2>
            </div>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
              <Star size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* Base Currency Information */}
      {baseCurrency && (
        <div className="flex flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/30 sm:flex-row sm:items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
            <Globe size={21} />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
              {t.base}: {baseCurrency.name} ({baseCurrency.code})
            </p>
            <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
              {baseCurrency.symbol || t.noSymbol}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Filter size={17} />
          {t.details}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="relative">
            <Search
              size={17}
              className={`absolute top-3 text-slate-400 ${isRTL ? "right-3" : "left-3"}`}
            />
            <input
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t.search}
              className={`${inputClass} ${isRTL ? "pr-10" : "pl-10"}`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className={inputClass}
          >
            <option value="">{t.allStatus}</option>
            <option value="active">{t.activeLabel}</option>
            <option value="inactive">{t.inactiveLabel}</option>
          </select>
        </div>

        <button
          onClick={clearFilters}
          className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {t.clearFilters}
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-sm">
            <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
              <tr>
                {["#", t.code, t.name, t.symbol, t.base, t.status, t.actions].map((heading, index) => (
                  <th key={index} className="px-4 py-4 text-start font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentCurrencies.map(currency => (
                <tr
                  key={currency.id}
                  className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <td className="px-4 py-4 font-medium">{currency.id}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-bold tracking-wide dark:bg-slate-800">
                      {currency.code}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium">{currency.name}</td>
                  <td className="px-4 py-4 text-lg">{currency.symbol || "-"}</td>
                  <td className="px-4 py-4">
                    {currency.is_base ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-2.5 py-1.5 text-xs font-semibold text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                        <Star size={13} />
                        {t.baseBadge}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleActive(currency)}
                      disabled={currency.is_base && currency.is_active}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                        currency.is_active
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                      } disabled:cursor-not-allowed disabled:opacity-70`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${currency.is_active ? "bg-emerald-500" : "bg-red-500"}`} />
                      {currency.is_active ? t.activeLabel : t.inactiveLabel}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(currency)}
                        title={t.edit}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        onClick={() => setDeleteId(currency.id)}
                        title={t.delete}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCurrencies.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <Coins size={35} className="mx-auto mb-3 opacity-40" />
            {t.noCurrencies}
          </div>
        )}
      </div>

      {/* Mobile and Tablet Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        {currentCurrencies.map(currency => (
          <div
            key={currency.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  {currency.symbol || currency.code.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold">{currency.code}</h3>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    {currency.name}
                  </p>
                </div>
              </div>

              {currency.is_base && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-purple-50 px-2 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                  <Star size={12} />
                  {t.baseBadge}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                onClick={() => toggleActive(currency)}
                disabled={currency.is_base && currency.is_active}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold disabled:opacity-70 ${
                  currency.is_active
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                    : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                }`}
              >
                {currency.is_active ? t.activeLabel : t.inactiveLabel}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(currency)}
                  className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                >
                  <Pencil size={17} />
                </button>
                <button
                  onClick={() => setDeleteId(currency.id)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCurrencies.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
          {t.noCurrencies}
        </div>
      )}

      {/* Pagination */}
      {filteredCurrencies.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.showing} {Math.min((page - 1) * pageSize + 1, filteredCurrencies.length)}-
            {Math.min(page * pageSize, filteredCurrencies.length)} {t.of} {filteredCurrencies.length} {t.entries}
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 p-2 disabled:opacity-40 dark:border-slate-700"
            >
              {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <span className="px-3 text-sm">{page} / {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-slate-200 p-2 disabled:opacity-40 dark:border-slate-700"
            >
              {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5">
          <div className="my-auto max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-slate-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-bold">
                {editingId ? t.edit : t.add}
              </h2>
              <button
                onClick={() => setModal(false)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div>
                <label className={labelClass}>{t.code} *</label>
                <input
                  required
                  maxLength={3}
                  value={form.code}
                  onChange={e => updateField("code", e.target.value.toUpperCase())}
                  className={inputClass}
                  placeholder="AFN"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Example: AFN, USD, EUR
                </p>
              </div>

              <div>
                <label className={labelClass}>{t.name} *</label>
                <input
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={e => updateField("name", e.target.value)}
                  className={inputClass}
                  placeholder="Afghan Afghani"
                />
              </div>

              <div>
                <label className={labelClass}>{t.symbol}</label>
                <input
                  maxLength={10}
                  value={form.symbol}
                  onChange={e => updateField("symbol", e.target.value)}
                  className={inputClass}
                  placeholder="؋"
                />
              </div>

              <div className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.is_base}
                    onChange={e => updateField("is_base", e.target.checked)}
                    className="h-4 w-4 rounded accent-blue-600"
                  />
                  <span className="text-sm font-medium">{t.isBase}</span>
                </label>

                <p className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                  {t.baseWarning}
                </p>

                <div className="border-t border-slate-100 pt-3 dark:border-slate-700">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={e => updateField("is_active", e.target.checked)}
                      className="h-4 w-4 rounded accent-blue-600"
                    />
                    <span className="text-sm font-medium">{t.isActive}</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {editingId ? t.update : t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Base Currency Confirmation */}
      {baseCandidate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10">
              <Star size={23} />
            </div>
            <h3 className="text-center text-lg font-bold">{t.confirmBase}</h3>
            <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
              {t.confirmBaseMessage}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setBaseCandidate(null);
                  setForm(emptyForm);
                  setEditingId(null);
                }}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium dark:border-slate-700"
              >
                {t.cancel}
              </button>
              <button
                onClick={confirmBaseChange}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10">
              <Trash2 size={23} />
            </div>
            <h3 className="text-center text-lg font-bold">{t.delete}</h3>
            <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
              {t.confirmDelete}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium dark:border-slate-700"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[70] flex max-w-[90%] -translate-x-1/2 items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm text-white shadow-xl">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
