
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  Plus,
  X,
  ClipboardList,
  MapPin,
  UserRound,
  CalendarDays,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw
} from "lucide-react";

import {
  getStockMovements,
  createStockAdjustment
} from "../services/stockMovment/StockMovement";

const translations = {
  en: {
    title: "Stock Movements",
    subtitle: "Track all inventory movements",
    search: "Search by carpet, code or note...",
    all: "All Types",
    purchase: "Purchase",
    sale: "Sale",
    sale_return: "Sale Return",
    transfer_in: "Transfer In",
    transfer_out: "Transfer Out",
    adjustment: "Adjustment",
    allLocations: "All Locations",
    addAdjustment: "New Adjustment",
    carpet: "Carpet",
    location: "Location",
    quantity: "Quantity Change",
    note: "Note",
    cancel: "Cancel",
    save: "Save Adjustment",
    type: "Movement Type",
    date: "Date",
    createdBy: "Created By",
    noData: "No stock movements found",
    loading: "Loading...",
    error: "Something went wrong",
    required: "Please fill in all required fields",
    success: "Adjustment created successfully",
    total: "Total Movements",
    purchases: "Purchases",
    sales: "Sales",
    adjustments: "Adjustments",
    positive: "Increase",
    negative: "Decrease",
    selectLocation: "Select Location",
    carpetId: "Carpet ID",
    quantityPlaceholder: "+5 or -2"
  },

  fa: {
    title: "حرکت موجودی",
    subtitle: "پیگیری تمام تغییرات موجودی",
    search: "جستجو بر اساس قالین، کود یا توضیحات...",
    all: "تمام انواع",
    purchase: "خرید",
    sale: "فروش",
    sale_return: "برگشت فروش",
    transfer_in: "انتقال ورودی",
    transfer_out: "انتقال خروجی",
    adjustment: "اصلاح موجودی",
    allLocations: "تمام موقعیت‌ها",
    addAdjustment: "اصلاح جدید",
    carpet: "قالین",
    location: "موقعیت",
    quantity: "تغییر تعداد",
    note: "توضیحات",
    cancel: "لغو",
    save: "ثبت اصلاح",
    type: "نوع حرکت",
    date: "تاریخ",
    createdBy: "ثبت‌کننده",
    noData: "هیچ حرکت موجودی پیدا نشد",
    loading: "در حال بارگذاری...",
    error: "مشکلی رخ داده است",
    required: "لطفاً تمام فیلدهای ضروری را خانه‌پری کنید",
    success: "اصلاح موجودی موفقانه ثبت شد",
    total: "مجموع حرکات",
    purchases: "خریدها",
    sales: "فروش‌ها",
    adjustments: "اصلاحات",
    positive: "افزایش",
    negative: "کاهش",
    selectLocation: "انتخاب موقعیت",
    carpetId: "آی‌دی قالین",
    quantityPlaceholder: "+5 یا -2"
  },

  ps: {
    title: "د موجودۍ حرکتونه",
    subtitle: "د موجودۍ ټول بدلونونه تعقیب کړئ",
    search: "د قالین، کوډ یا یادښت له مخې لټون...",
    all: "ټول ډولونه",
    purchase: "پېرود",
    sale: "پلور",
    sale_return: "د پلور بېرته ستنېدل",
    transfer_in: "داخلي انتقال",
    transfer_out: "بهرنی انتقال",
    adjustment: "د موجودۍ اصلاح",
    allLocations: "ټول ځایونه",
    addAdjustment: "نوې اصلاح",
    carpet: "قالین",
    location: "ځای",
    quantity: "د شمېر بدلون",
    note: "یادښت",
    cancel: "لغوه",
    save: "اصلاح ثبتول",
    type: "د حرکت ډول",
    date: "نېټه",
    createdBy: "ثبت کوونکی",
    noData: "د موجودۍ کوم حرکت ونه موندل شو",
    loading: "بار کېږي...",
    error: "یوه ستونزه رامنځته شوه",
    required: "مهرباني وکړئ اړین معلومات بشپړ کړئ",
    success: "د موجودۍ اصلاح په بریالیتوب ثبت شوه",
    total: "ټول حرکتونه",
    purchases: "پېرودونه",
    sales: "پلورونه",
    adjustments: "اصلاحات",
    positive: "زیاتوالی",
    negative: "کموالی",
    selectLocation: "ځای وټاکئ",
    carpetId: "د قالین پېژندشمېره",
    quantityPlaceholder: "+5 یا -2"
  }
};

const movementTypes = [
  "purchase",
  "sale",
  "sale_return",
  "transfer_in",
  "transfer_out",
  "adjustment"
];

const StockMovements = ({ language: languageProp }) => {
  const { i18n } = useTranslation();

  const language = (
    i18n.resolvedLanguage ||
    i18n.language ||
    languageProp ||
    localStorage.getItem("language") ||
    "en"
  ).split("-")[0];

  const t = translations[language] || translations.en;
  const isRTL = language === "fa" || language === "ps";

  const [movements, setMovements] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    carpet_id: "",
    location_id: "",
    quantity_change: "",
    note: ""
  });

  const loadMovements = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStockMovements();
      setMovements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || t.error);
    } finally {
      setLoading(false);
    }
  }, [t.error]);

  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  const locations = useMemo(() => {
    return [
      ...new Map(
        movements.map((item) => [
          item.location_id,
          {
            id: item.location_id,
            name: item.location
          }
        ])
      ).values()
    ];
  }, [movements]);

  const filteredMovements = useMemo(() => {
    return movements.filter((item) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        (item.carpet || "").toLowerCase().includes(searchText) ||
        (item.code || "").toLowerCase().includes(searchText) ||
        (item.note || "").toLowerCase().includes(searchText);

      const matchesType =
        typeFilter === "all" || item.movement_type === typeFilter;

      const matchesLocation =
        locationFilter === "all" ||
        String(item.location_id) === locationFilter;

      return matchesSearch && matchesType && matchesLocation;
    });
  }, [movements, search, typeFilter, locationFilter]);

  const stats = useMemo(() => ({
    total: movements.length,
    purchases: movements.filter(
      (item) => item.movement_type === "purchase"
    ).length,
    sales: movements.filter(
      (item) => item.movement_type === "sale"
    ).length,
    adjustments: movements.filter(
      (item) => item.movement_type === "adjustment"
    ).length
  }), [movements]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.carpet_id ||
      !form.location_id ||
      !form.quantity_change ||
      Number(form.quantity_change) === 0
    ) {
      setError(t.required);
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await createStockAdjustment({
        carpet_id: Number(form.carpet_id),
        location_id: Number(form.location_id),
        quantity_change: Number(form.quantity_change),
        note: form.note
      });

      setForm({
        carpet_id: "",
        location_id: "",
        quantity_change: "",
        note: ""
      });

      setShowModal(false);
      setSuccess(t.success);

      await loadMovements();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || t.error);
    } finally {
      setSaving(false);
    }
  };

  const getMovementStyle = (type) => {
    switch (type) {
      case "purchase":
      case "sale_return":
      case "transfer_in":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";

      case "sale":
      case "transfer_out":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";

      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };

  const getMovementIcon = (type) => {
    switch (type) {
      case "purchase":
      case "sale_return":
      case "transfer_in":
        return <ArrowDownLeft size={16} />;

      case "sale":
      case "transfer_out":
        return <ArrowUpRight size={16} />;

      default:
        return <RefreshCw size={16} />;
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const locale =
      language === "fa"
        ? "fa-AF"
        : language === "ps"
          ? "ps-AF"
          : "en-US";

    return new Date(date).toLocaleString(locale);
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full space-y-6 bg-slate-50 p-4 text-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t.subtitle}
          </p>
        </div>

        <button
          onClick={() => {
            setError("");
            setSuccess("");
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          {t.addAdjustment}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300">
          {success}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: t.total, value: stats.total, icon: ClipboardList },
          { label: t.purchases, value: stats.purchases, icon: ArrowDownLeft },
          { label: t.sales, value: stats.sales, icon: ArrowUpRight },
          { label: t.adjustments, value: stats.adjustments, icon: RefreshCw }
        ].map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <Icon size={20} className="shrink-0 text-blue-600 dark:text-blue-400" />
              </div>

              <p className="mt-3 text-2xl font-bold text-slate-800 dark:text-white">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            className={`${inputClass} ps-10`}
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={`${inputClass} lg:w-48`}
        >
          <option value="all">{t.all}</option>
          {movementTypes.map((type) => (
            <option key={type} value={type}>
              {t[type]}
            </option>
          ))}
        </select>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className={`${inputClass} lg:w-48`}
        >
          <option value="all">{t.allLocations}</option>
          {locations.map((location) => (
            <option key={location.id} value={String(location.id)}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      {/* Movements Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-start text-sm">
            <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="px-5 py-4">{t.carpet}</th>
                <th className="px-5 py-4">{t.type}</th>
                <th className="px-5 py-4">{t.location}</th>
                <th className="px-5 py-4">{t.quantity}</th>
                <th className="px-5 py-4">{t.note}</th>
                <th className="px-5 py-4">{t.createdBy}</th>
                <th className="px-5 py-4">{t.date}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    {t.loading}
                  </td>
                </tr>
              ) : filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    {t.noData}
                  </td>
                </tr>
              ) : (
                filteredMovements.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-800/70"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-800 dark:text-slate-100">
                        {item.carpet}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {item.code}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${getMovementStyle(item.movement_type)}`}>
                        {getMovementIcon(item.movement_type)}
                        {t[item.movement_type] || item.movement_type}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={14} />
                        {item.location || "—"}
                      </span>
                    </td>

                    <td
                      className={`px-5 py-4 font-semibold ${
                        Number(item.quantity_change) > 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {Number(item.quantity_change) > 0 ? "+" : ""}
                      {item.quantity_change}
                    </td>

                    <td className="max-w-[200px] truncate px-5 py-4 text-slate-600 dark:text-slate-300">
                      {item.note || "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1">
                        <UserRound size={14} />
                        {item.created_by_name || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={14} />
                        {formatDate(item.created_at)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjustment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">

            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {t.addAdjustment}
              </h2>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.carpet}
                </label>

                <input
                  type="number"
                  min="1"
                  value={form.carpet_id}
                  onChange={(e) =>
                    setForm({ ...form, carpet_id: e.target.value })
                  }
                  placeholder={t.carpetId}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.location}
                </label>

                <select
                  value={form.location_id}
                  onChange={(e) =>
                    setForm({ ...form, location_id: e.target.value })
                  }
                  className={inputClass}
                  required
                >
                  <option value="">{t.selectLocation}</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.quantity}
                </label>

                <input
                  type="number"
                  value={form.quantity_change}
                  onChange={(e) =>
                    setForm({ ...form, quantity_change: e.target.value })
                  }
                  placeholder={t.quantityPlaceholder}
                  className={inputClass}
                  required
                />

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t.positive}: +5 | {t.negative}: -2
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.note}
                </label>

                <textarea
                  value={form.note}
                  onChange={(e) =>
                    setForm({ ...form, note: e.target.value })
                  }
                  rows={3}
                  className={inputClass}
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? t.loading : t.save}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockMovements;
