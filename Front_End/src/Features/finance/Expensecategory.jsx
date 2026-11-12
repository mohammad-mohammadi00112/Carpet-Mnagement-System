
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Tags,
  Layers,
  FileText,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FolderOpen,
  Tag,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import {
  getExpenseCategories,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
} from "../services/finance/expenseCategoryService";

const translations = {
  en: {
    title: "Expense Categories",
    subtitle: "Organize and manage your business expense categories",
    add: "Add Category",
    total: "Total Categories",
    withDescription: "With Description",
    withoutDescription: "Without Description",
    records: "Total Records",
    search: "Search categories...",
    categoryDetails: "Category Details",
    name: "Category Name",
    description: "Description",
    actions: "Actions",
    addTitle: "Add New Category",
    editTitle: "Edit Category",
    enterName: "Enter category name",
    enterDescription: "Enter category description",
    save: "Save Category",
    update: "Update Category",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    confirmDelete: "Are you sure you want to delete this category?",
    noCategories: "No categories found",
    noCategoriesDesc: "Start by adding your first expense category.",
    showing: "Showing",
    of: "of",
    previous: "Previous",
    next: "Next",
    clear: "Clear Search",
    noDescription: "No description",
    categorySaved: "Category added successfully",
    categoryUpdated: "Category updated successfully",
    categoryDeleted: "Category deleted successfully",
    close: "Close",
    filtered: "Filtered Categories",
    all: "All Categories",
    nameHint: "Choose a clear and unique category name.",
    descriptionHint: "Add additional information about this category.",
    nameRequired: "Please enter a category name.",
    duplicateName: "This category name already exists.",
    deleteWarning: "This action cannot be undone.",
    cancelDelete: "Keep Category",
    confirm: "Yes, Delete",
    loading: "Loading categories...",
    loadError: "Failed to load categories.",
    saveError: "Failed to save category.",
    deleteError: "Failed to delete category.",
    serverError: "Something went wrong. Please try again.",
    retry: "Try Again",
    load: "Refresh",
  },

  fa: {
    title: "دسته‌بندی مصارف",
    subtitle: "دسته‌بندی و مدیریت مصارف تجارت شما",
    add: "افزودن دسته‌بندی",
    total: "مجموع دسته‌بندی‌ها",
    withDescription: "دارای توضیحات",
    withoutDescription: "بدون توضیحات",
    records: "تعداد کل",
    search: "جستجوی دسته‌بندی‌ها...",
    categoryDetails: "جزئیات دسته‌بندی‌ها",
    name: "نام دسته‌بندی",
    description: "توضیحات",
    actions: "عملیات",
    addTitle: "افزودن دسته‌بندی جدید",
    editTitle: "ویرایش دسته‌بندی",
    enterName: "نام دسته‌بندی را وارد کنید",
    enterDescription: "توضیحات دسته‌بندی را وارد کنید",
    save: "ذخیره دسته‌بندی",
    update: "به‌روزرسانی دسته‌بندی",
    cancel: "لغو",
    delete: "حذف",
    edit: "ویرایش",
    confirmDelete: "آیا مطمئن هستید که این دسته‌بندی حذف شود؟",
    noCategories: "دسته‌بندی یافت نشد",
    noCategoriesDesc: "با افزودن اولین دسته‌بندی مصارف شروع کنید.",
    showing: "نمایش",
    of: "از",
    previous: "قبلی",
    next: "بعدی",
    clear: "پاک کردن جستجو",
    noDescription: "بدون توضیحات",
    categorySaved: "دسته‌بندی موفقانه اضافه شد",
    categoryUpdated: "دسته‌بندی موفقانه ویرایش شد",
    categoryDeleted: "دسته‌بندی موفقانه حذف شد",
    close: "بستن",
    filtered: "دسته‌بندی‌های جستجو شده",
    all: "تمام دسته‌بندی‌ها",
    nameHint: "یک نام واضح و منحصربه‌فرد انتخاب کنید.",
    descriptionHint: "اطلاعات اضافی درباره این دسته‌بندی بنویسید.",
    nameRequired: "لطفاً نام دسته‌بندی را وارد کنید.",
    duplicateName: "این نام دسته‌بندی قبلاً وجود دارد.",
    deleteWarning: "این عمل قابل برگشت نیست.",
    cancelDelete: "حفظ دسته‌بندی",
    confirm: "بلی، حذف شود",
    loading: "در حال دریافت دسته‌بندی‌ها...",
    loadError: "دریافت دسته‌بندی‌ها ناموفق بود.",
    saveError: "ذخیره دسته‌بندی ناموفق بود.",
    deleteError: "حذف دسته‌بندی ناموفق بود.",
    serverError: "مشکلی رخ داد. دوباره تلاش کنید.",
    retry: "تلاش دوباره",
    load: "بارگذاری مجدد",
  },

  ps: {
    title: "د لګښتونو کټګورۍ",
    subtitle: "د خپلې سوداګرۍ د لګښتونو کټګورۍ تنظیم او اداره کړئ",
    add: "کټګوري اضافه کړئ",
    total: "ټولې کټګورۍ",
    withDescription: "له تشریح سره",
    withoutDescription: "له تشریح پرته",
    records: "ټول ریکارډونه",
    search: "کټګورۍ ولټوئ...",
    categoryDetails: "د کټګوریو جزئیات",
    name: "د کټګورۍ نوم",
    description: "تشریح",
    actions: "کړنې",
    addTitle: "نوې کټګوري اضافه کول",
    editTitle: "کټګوري سمول",
    enterName: "د کټګورۍ نوم ولیکئ",
    enterDescription: "د کټګورۍ تشریح ولیکئ",
    save: "کټګوري ثبت کړئ",
    update: "کټګوري تازه کړئ",
    cancel: "لغوه",
    delete: "ړنګول",
    edit: "سمول",
    confirmDelete: "ایا ډاډه یاست چې دا کټګوري ړنګه کړئ؟",
    noCategories: "کومه کټګوري ونه موندل شوه",
    noCategoriesDesc: "د خپلې لومړۍ کټګورۍ په اضافه کولو پیل وکړئ.",
    showing: "ښودل",
    of: "له",
    previous: "مخکینی",
    next: "راتلونکی",
    clear: "لټون پاک کړئ",
    noDescription: "تشریح نشته",
    categorySaved: "کټګوري په بریالیتوب اضافه شوه",
    categoryUpdated: "کټګوري په بریالیتوب تازه شوه",
    categoryDeleted: "کټګوري په بریالیتوب ړنګه شوه",
    close: "بندول",
    filtered: "لټول شوې کټګورۍ",
    all: "ټولې کټګورۍ",
    nameHint: "یو روښانه او ځانګړی نوم وټاکئ.",
    descriptionHint: "د دې کټګورۍ په اړه نور معلومات ولیکئ.",
    nameRequired: "مهرباني وکړئ د کټګورۍ نوم ولیکئ.",
    duplicateName: "دا نوم مخکې شتون لري.",
    deleteWarning: "دا کړنه بېرته نه شي راګرځېدای.",
    cancelDelete: "کټګوري وساتئ",
    confirm: "هو، ړنګ یې کړئ",
    loading: "کټګورۍ ترلاسه کېږي...",
    loadError: "د کټګوریو ترلاسه کول ناکام شول.",
    saveError: "د کټګورۍ ثبتول ناکام شول.",
    deleteError: "د کټګورۍ حذف ناکام شو.",
    serverError: "یوه ستونزه رامنځته شوه. بیا هڅه وکړئ.",
    retry: "بیا هڅه وکړئ",
    load: "بیا تازه کول",
  },
};

const initialForm = {
  name: "",
  description: "",
};

const normalizeName = (value) =>
  value.trim().toLocaleLowerCase();

export default function ExpenseCategory() {
  const { i18n } = useTranslation();

  const language =
    i18n.resolvedLanguage?.split("-")[0] ||
    i18n.language?.split("-")[0] ||
    "en";

  const t = translations[language] || translations.en;
  const isRTL = ["fa", "ps"].includes(language);

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const pageSize = 6;

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getExpenseCategories();

      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Expense categories error:", err);
      setError(t.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showMessage = (message) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 3000);
  };

  // Search
  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter(
      (category) =>
        category.name?.toLowerCase().includes(query) ||
        (category.description || "").toLowerCase().includes(query)
    );
  }, [categories, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / pageSize)
  );

  const paginatedCategories = filteredCategories.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const withDescription = categories.filter(
    (category) => category.description?.trim()
  ).length;

  const withoutDescription =
    categories.length - withDescription;

  // Modal functions
  const openAddModal = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setForm({
      name: category.name || "",
      description: category.description || "",
    });

    setEditingId(category.id);
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingId(null);
    setForm(initialForm);
    setError("");
  };

  // Save category
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) {
      setError(t.nameRequired);
      return;
    }

    const duplicate = categories.some(
      (category) =>
        normalizeName(category.name) === normalizeName(name) &&
        category.id !== editingId
    );

    if (duplicate) {
      setError(t.duplicateName);
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data = {
        name,
        description: description || null,
      };

      if (editingId !== null) {
        await updateExpenseCategory(editingId, data);
        showMessage(t.categoryUpdated);
      } else {
        await createExpenseCategory(data);
        showMessage(t.categorySaved);
      }

      closeModal();
      setPage(1);
      await fetchCategories();
    } catch (err) {
      console.error("Save category error:", err);

      setError(
        err.response?.data?.code === "23505"
          ? t.duplicateName
          : t.saveError
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete category
  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;

    try {
      setDeleting(true);

      await deleteExpenseCategory(deleteTarget.id);

      setDeleteTarget(null);
      setPage(1);

      showMessage(t.categoryDeleted);

      await fetchCategories();
    } catch (err) {
      console.error("Delete category error:", err);

      setDeleteTarget(null);
      showMessage(t.deleteError);
    } finally {
      setDeleting(false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };

  const changePage = (newPage) => {
    setPage(Math.min(Math.max(1, newPage), totalPages));
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500/10";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

  const stats = [
    {
      label: t.total,
      value: categories.length,
      icon: Tags,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    },
    {
      label: t.withDescription,
      value: withDescription,
      icon: FileText,
      color: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    },
    {
      label: t.withoutDescription,
      value: withoutDescription,
      icon: FolderOpen,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    },
    {
      label: t.records,
      value: categories.length,
      icon: Layers,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    },
  ];

  const Pagination = () => (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-4 dark:border-gray-800 sm:flex-row">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t.showing} {(page - 1) * pageSize + 1} -{" "}
        {Math.min(page * pageSize, filteredCategories.length)} {t.of}{" "}
        {filteredCategories.length}
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => changePage(page - 1)}
          className="rounded-lg border border-gray-200 p-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
        >
          {isRTL ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
        </button>

        <span className="text-sm font-medium">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => changePage(page + 1)}
          className="rounded-lg border border-gray-200 p-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
        >
          {isRTL ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
        </button>
      </div>
    </div>
  );

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen space-y-6 bg-gray-50 p-3 text-gray-900 dark:bg-gray-950 dark:text-white sm:p-5 lg:p-7"
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t.title}
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchCategories}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            {t.load}
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            {t.add}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    {loading ? "—" : stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={18} className="text-blue-600" />
          <h2 className="font-semibold">{t.categoryDetails}</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="relative">
            <Search
              size={17}
              className={`absolute top-3.5 text-gray-400 ${
                isRTL ? "right-3" : "left-3"
              }`}
            />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t.search}
              className={`${inputClass} ${isRTL ? "pr-10" : "pl-10"}`}
            />
          </div>

          <button
            onClick={clearSearch}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RefreshCw size={15} />
            {t.clear}
          </button>
        </div>
      </div>

      {/* Filtered Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-900/50 dark:bg-blue-500/5">
        <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
          {t.filtered}
        </span>

        <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
          {loading ? "—" : filteredCategories.length}
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-16 dark:border-gray-800 dark:bg-gray-900">
          <Loader2 size={35} className="animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {t.loading}
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && !showModal && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-500/10">
          <AlertCircle size={32} className="mx-auto text-red-500" />

          <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>

          <button
            onClick={fetchCategories}
            className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            {t.retry}
          </button>
        </div>
      )}

      {/* Categories Table */}
      {!loading && !error && (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-sm">
                <thead className="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  <tr>
                    {[t.name, t.description, t.actions].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap px-5 py-4 text-start font-semibold"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {paginatedCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="transition hover:bg-gray-50/80 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            <Tag size={19} />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100">
                              {category.name}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              ID: {category.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="max-w-[400px] px-5 py-4">
                        <p className="truncate text-gray-500 dark:text-gray-400">
                          {category.description || t.noDescription}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(category)}
                            title={t.edit}
                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-500/10"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(category)}
                            title={t.delete}
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCategories.length === 0 && (
              <div className="px-4 py-14 text-center">
                <Tags size={35} className="mx-auto mb-3 text-gray-300" />
                <h3 className="font-semibold">{t.noCategories}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t.noCategoriesDesc}
                </p>
              </div>
            )}

            {filteredCategories.length > 0 && <Pagination />}
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {paginatedCategories.map((category) => (
              <div
                key={category.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <Tag size={20} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {category.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        ID: {category.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => openEditModal(category)}
                      title={t.edit}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(category)}
                      title={t.delete}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-3 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t.description}
                  </p>

                  <p className="mt-1 break-words text-sm text-gray-700 dark:text-gray-300">
                    {category.description || t.noDescription}
                  </p>
                </div>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white px-4 py-12 text-center dark:border-gray-800 dark:bg-gray-900">
                <Tags size={35} className="mx-auto mb-3 text-gray-300" />
                <h3 className="font-semibold">{t.noCategories}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t.noCategoriesDesc}
                </p>
              </div>
            )}

            {filteredCategories.length > 0 && (
              <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
                <button
                  disabled={page === 1}
                  onClick={() => changePage(page - 1)}
                  className="rounded-lg border border-gray-200 p-2 disabled:opacity-40 dark:border-gray-700"
                >
                  {isRTL ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
                </button>

                <span className="text-sm font-medium">
                  {page} / {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => changePage(page + 1)}
                  className="rounded-lg border border-gray-200 p-2 disabled:opacity-40 dark:border-gray-700"
                >
                  {isRTL ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800 sm:px-6">
              <div>
                <h2 className="text-lg font-bold">
                  {editingId !== null ? t.editTitle : t.addTitle}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {t.categoryDetails}
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                title={t.close}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
              <div>
                <label className={labelClass}>
                  {t.name} *
                </label>

                <input
                  required
                  maxLength={200}
                  autoFocus
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    setError("");
                  }}
                  placeholder={t.enterName}
                  className={inputClass}
                />

                <p className="mt-1.5 text-xs text-gray-400">
                  {t.nameHint}
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  {t.description}
                </label>

                <textarea
                  rows={4}
                  maxLength={1000}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder={t.enterDescription}
                  className={`${inputClass} resize-none`}
                />

                <p className="mt-1.5 text-xs text-gray-400">
                  {t.descriptionHint}
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  <AlertCircle size={17} />
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {t.cancel}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={17} />
                  )}

                  {saving
                    ? "..."
                    : editingId !== null
                      ? t.update
                      : t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:bg-gray-900 sm:p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              <AlertCircle size={25} />
            </div>

            <h2 className="mt-4 text-lg font-bold">
              {t.confirmDelete}
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {deleteTarget.name}
            </p>

            <p className="mt-1 text-xs text-red-500">
              {t.deleteWarning}
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {t.cancelDelete}
              </button>

              <button
                disabled={deleting}
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] flex max-w-[90vw] -translate-x-1/2 items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-xl">
          <CheckCircle2 size={17} className="shrink-0 text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
