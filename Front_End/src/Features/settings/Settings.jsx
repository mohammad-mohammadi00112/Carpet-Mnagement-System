
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Store,
  ReceiptText,
  Wallet,
  Image as ImageIcon,
  Phone,
  MapPin,
  Hash,
  Percent,
  Coins,
  Save,
  RotateCcw,
  CheckCircle2,
  Info,
  Building2,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  getShopSettings,
  getCurrencies,
  createShopSettings,
  updateShopSettings,
} from "../services/settings/settingsSerivce";

const translations = {
  en: {
    title: "Shop Settings",
    subtitle: "Manage your shop information, invoices and financial preferences.",
    shopInfo: "Shop Information",
    shopInfoDesc: "Basic information about your carpet shop.",
    shopName: "Shop Name",
    shopNamePlaceholder: "Enter shop name",
    logo: "Shop Logo URL",
    logoPlaceholder: "Enter logo image URL",
    phone: "Phone Number",
    phonePlaceholder: "Enter phone number",
    address: "Shop Address",
    addressPlaceholder: "Enter shop address",
    invoice: "Invoice Settings",
    invoiceDesc: "Customize the appearance and numbering of your invoices.",
    prefix: "Invoice Prefix",
    prefixPlaceholder: "e.g. INV",
    footer: "Invoice Footer",
    footerPlaceholder: "Enter a message to appear at the bottom of invoices",
    preview: "Invoice Preview",
    previewDesc: "Preview your shop and invoice settings.",
    invoiceNumber: "Invoice Number",
    sampleItem: "Invoice Items",
    subtotal: "Subtotal",
    tax: "Tax",
    total: "Total",
    thankYou: "Thank you for your business!",
    finance: "Financial Settings",
    financeDesc: "Set your default tax rate and shop currency.",
    taxRate: "Tax Rate",
    currency: "Base Currency",
    currencyDesc: "The main currency used for shop transactions and reports.",
    system: "Settings Information",
    settingId: "Settings ID",
    lastUpdated: "Last Updated",
    notUpdated: "Not updated yet",
    save: "Save Changes",
    reset: "Reset Changes",
    saved: "Changes saved successfully.",
    required: "Shop name is required.",
    invalidTax: "Tax rate must be between 0 and 100.",
    noLogo: "Your logo preview will appear here.",
    uploadNote: "Enter an image URL to preview your shop logo.",
    general: "General",
    financial: "Finance",
    invoiceTab: "Invoices",
    settings: "Settings",
    loading: "Loading settings...",
    saving: "Saving...",
    loadError: "Failed to load settings.",
    saveError: "Failed to save settings.",
    retry: "Try Again",
    noCurrency: "No currencies available.",
    noSettings: "No shop settings found. Enter your shop information and save.",
    noRecord: "Not saved",
    currencyCode: "Currency",
  },
  fa: {
    title: "تنظیمات فروشگاه",
    subtitle: "اطلاعات فروشگاه، فاکتورها و تنظیمات مالی را مدیریت کنید.",
    shopInfo: "اطلاعات فروشگاه",
    shopInfoDesc: "اطلاعات اساسی فروشگاه قالین شما.",
    shopName: "نام فروشگاه",
    shopNamePlaceholder: "نام فروشگاه را وارد کنید",
    logo: "آدرس لوگوی فروشگاه",
    logoPlaceholder: "آدرس تصویر لوگو را وارد کنید",
    phone: "شماره تماس",
    phonePlaceholder: "شماره تماس را وارد کنید",
    address: "آدرس فروشگاه",
    addressPlaceholder: "آدرس فروشگاه را وارد کنید",
    invoice: "تنظیمات فاکتور",
    invoiceDesc: "ظاهر و شماره‌گذاری فاکتورهای خود را تنظیم کنید.",
    prefix: "پیشوند شماره فاکتور",
    prefixPlaceholder: "مثلاً INV",
    footer: "متن پایین فاکتور",
    footerPlaceholder: "پیامی برای نمایش در پایین فاکتور وارد کنید",
    preview: "پیش‌نمایش فاکتور",
    previewDesc: "پیش‌نمایش تنظیمات فروشگاه و فاکتور.",
    invoiceNumber: "شماره فاکتور",
    sampleItem: "اقلام فاکتور",
    subtotal: "مجموع فرعی",
    tax: "مالیات",
    total: "مجموع نهایی",
    thankYou: "از خرید شما سپاسگزاریم!",
    finance: "تنظیمات مالی",
    financeDesc: "نرخ مالیات و واحد پول اصلی فروشگاه را تعیین کنید.",
    taxRate: "نرخ مالیات",
    currency: "واحد پول اصلی",
    currencyDesc: "واحد پول اصلی برای معاملات و گزارش‌های فروشگاه.",
    system: "اطلاعات تنظیمات",
    settingId: "شناسه تنظیمات",
    lastUpdated: "آخرین به‌روزرسانی",
    notUpdated: "هنوز به‌روزرسانی نشده",
    save: "ذخیره تغییرات",
    reset: "بازنشانی تغییرات",
    saved: "تغییرات با موفقیت ذخیره شد.",
    required: "نام فروشگاه الزامی است.",
    invalidTax: "نرخ مالیات باید بین صفر تا صد باشد.",
    noLogo: "پیش‌نمایش لوگوی شما در اینجا نمایش داده می‌شود.",
    uploadNote: "برای پیش‌نمایش لوگو، آدرس تصویر را وارد کنید.",
    general: "عمومی",
    financial: "مالی",
    invoiceTab: "فاکتور",
    settings: "تنظیمات",
    loading: "در حال دریافت تنظیمات...",
    saving: "در حال ذخیره...",
    loadError: "دریافت تنظیمات ناکام شد.",
    saveError: "ذخیره تنظیمات ناکام شد.",
    retry: "تلاش دوباره",
    noCurrency: "هیچ ارزی موجود نیست.",
    noSettings: "تنظیمات فروشگاه پیدا نشد. اطلاعات فروشگاه را وارد و ذخیره کنید.",
    noRecord: "ذخیره نشده",
    currencyCode: "واحد پول",
  },
  ps: {
    title: "د هټۍ تنظیمات",
    subtitle: "د هټۍ معلومات، بلونه او مالي تنظیمات اداره کړئ.",
    shopInfo: "د هټۍ معلومات",
    shopInfoDesc: "ستاسو د قالینو پلورنځي بنسټیز معلومات.",
    shopName: "د هټۍ نوم",
    shopNamePlaceholder: "د هټۍ نوم ولیکئ",
    logo: "د هټۍ د لوګو لینک",
    logoPlaceholder: "د لوګو د انځور لینک ولیکئ",
    phone: "د اړیکې شمېره",
    phonePlaceholder: "د اړیکې شمېره ولیکئ",
    address: "د هټۍ پته",
    addressPlaceholder: "د هټۍ پته ولیکئ",
    invoice: "د بل تنظیمات",
    invoiceDesc: "د خپلو بلونو بڼه او شمېره تنظیم کړئ.",
    prefix: "د بل مخکینی کوډ",
    prefixPlaceholder: "لکه INV",
    footer: "د بل لاندې متن",
    footerPlaceholder: "د بل په پای کې د ښودلو لپاره پیغام ولیکئ",
    preview: "د بل مخکتنه",
    previewDesc: "د هټۍ او بل د تنظیماتو مخکتنه.",
    invoiceNumber: "د بل شمېره",
    sampleItem: "د بل توکي",
    subtotal: "فرعي مجموعه",
    tax: "مالیه",
    total: "ټوله مجموعه",
    thankYou: "ستاسو له پېرودنې مننه!",
    finance: "مالي تنظیمات",
    financeDesc: "د مالیې کچه او د هټۍ اصلي پیسه وټاکئ.",
    taxRate: "د مالیې کچه",
    currency: "اصلي پیسه",
    currencyDesc: "د هټۍ د معاملو او راپورونو اصلي پیسه.",
    system: "د تنظیماتو معلومات",
    settingId: "د تنظیماتو پېژند",
    lastUpdated: "وروستی تازه کېدل",
    notUpdated: "تر اوسه نه دي تازه شوي",
    save: "بدلونونه خوندي کړئ",
    reset: "بدلونونه بېرته راګرځول",
    saved: "بدلونونه په بریالیتوب خوندي شول.",
    required: "د هټۍ نوم اړین دی.",
    invalidTax: "د مالیې کچه باید له صفر څخه تر سلو پورې وي.",
    noLogo: "ستاسو د لوګو مخکتنه به دلته ښکاره شي.",
    uploadNote: "د لوګو د مخکتنې لپاره د انځور لینک ولیکئ.",
    general: "عمومي",
    financial: "مالي",
    invoiceTab: "بلونه",
    settings: "تنظیمات",
    loading: "د تنظیماتو معلومات ترلاسه کېږي...",
    saving: "خوندي کېږي...",
    loadError: "د تنظیماتو ترلاسه کول ناکام شول.",
    saveError: "د تنظیماتو خوندي کول ناکام شول.",
    retry: "بیا هڅه وکړئ",
    noCurrency: "اسعار شتون نه لري.",
    noSettings: "د هټۍ تنظیمات ونه موندل شول. معلومات ولیکئ او خوندي یې کړئ.",
    noRecord: "خوندي شوي نه دي",
    currencyCode: "پیسه",
  },
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500";

const labelClass =
  "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

const emptySettings = {
  id: null,
  shop_name: "",
  logo: "",
  phone: "",
  address: "",
  invoice_prefix: "",
  invoice_footer: "",
  tax_rate: "0",
  base_currency_id: "",
  updated_at: null,
};

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        <Icon size={20} />
      </div>

      <div>
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function getCurrencyName(currency) {
  return currency?.name || currency?.currency_name || currency?.code || currency?.currency_code || "";
}

function getCurrencyCode(currency) {
  return currency?.code || currency?.currency_code || "";
}

function getCurrencySymbol(currency) {
  return currency?.symbol || currency?.currency_symbol || getCurrencyCode(currency);
}

function mapSettings(data) {
  return {
    ...emptySettings,
    ...data,
    tax_rate: String(data.tax_rate ?? 0),
    base_currency_id: data.base_currency_id
      ? String(data.base_currency_id)
      : "",
    logo: data.logo || "",
  };
}

export default function Settings() {
  const lang = document.documentElement.lang || "en";
  const t = translations[lang] || translations.en;
  const isRtl = lang === "fa" || lang === "ps";

  const [settings, setSettings] = useState(emptySettings);
  const [savedSettings, setSavedSettings] = useState(emptySettings);
  const [currencies, setCurrencies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [activeTab, setActiveTab] = useState("general");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [settingsData, currenciesData] = await Promise.all([
        getShopSettings(),
        getCurrencies(),
      ]);

      setCurrencies(currenciesData);

      if (settingsData.length > 0) {
        const currentSettings = mapSettings(settingsData[0]);

        setSettings(currentSettings);
        setSavedSettings(currentSettings);
      } else {
        const firstCurrency = currenciesData[0];

        const newSettings = {
          ...emptySettings,
          base_currency_id: firstCurrency
            ? String(firstCurrency.id)
            : "",
        };

        setSettings(newSettings);
        setSavedSettings(newSettings);
      }
    } catch (err) {
      console.error("Settings loading error:", err);
      setError(err.message || t.loadError);
    } finally {
      setLoading(false);
    }
  }, [t.loadError]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateField = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

    setMessage("");
    setError("");
  };

  const selectedCurrency = useMemo(
    () =>
      currencies.find(
        (currency) =>
          Number(currency.id) === Number(settings.base_currency_id)
      ),
    [currencies, settings.base_currency_id]
  );

  const formatDate = (date) => {
    if (!date) return t.notUpdated;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return t.notUpdated;

    return parsedDate.toLocaleString(
      lang === "fa" ? "fa-IR" : lang === "ps" ? "ps-AF" : "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  const handleSave = async () => {
    if (!settings.shop_name.trim()) {
      setError(t.required);
      setMessage("");
      return;
    }

    const tax = Number(settings.tax_rate);

    if (!Number.isFinite(tax) || tax < 0 || tax > 100) {
      setError(t.invalidTax);
      setMessage("");
      return;
    }

    if (!settings.base_currency_id) {
      setError(t.noCurrency);
      setMessage("");
      return;
    }

    const payload = {
      shop_name: settings.shop_name.trim(),
      phone: settings.phone || null,
      address: settings.address || null,
      invoice_prefix: settings.invoice_prefix || null,
      invoice_footer: settings.invoice_footer || null,
      tax_rate: tax,
      base_currency_id: Number(settings.base_currency_id),
    };

    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (settings.id) {
        await updateShopSettings(settings.id, payload);
      } else {
        await createShopSettings(payload);
      }

      await loadSettings();
      setMessage(t.saved);
    } catch (err) {
      console.error("Settings saving error:", err);
      setError(err.message || t.saveError);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({ ...savedSettings });
    setMessage("");
    setError("");
  };

  const tabs = [
    { id: "general", label: t.general, icon: Store },
    { id: "invoice", label: t.invoiceTab, icon: ReceiptText },
    { id: "financial", label: t.financial, icon: Wallet },
  ];

  if (loading) {
    return (
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-slate-50 p-6 text-slate-600 dark:bg-slate-950 dark:text-slate-300"
      >
        <Loader2 size={35} className="animate-spin text-blue-600" />
        <p>{t.loading}</p>
      </div>
    );
  }

  if (error && !currencies.length) {
    return (
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center"
      >
        <AlertCircle size={40} className="text-red-500" />
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>

        <button
          type="button"
          onClick={loadSettings}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t.retry}
        </button>
      </div>
    );
  }

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:p-6"
    >
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-2.5 text-white">
            <Store size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">{t.title}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <Icon size={17} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {!settings.id && (
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-500/10 dark:text-blue-300">
          <Info size={19} className="mt-0.5 shrink-0" />
          <p>{t.noSettings}</p>
        </div>
      )}

      {/* General Settings */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <SectionHeading
              icon={Building2}
              title={t.shopInfo}
              description={t.shopInfoDesc}
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={labelClass}>{t.shopName}</label>
                <input
                  value={settings.shop_name}
                  onChange={(e) => updateField("shop_name", e.target.value)}
                  placeholder={t.shopNamePlaceholder}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>{t.phone}</label>
                <div className="relative">
                  <Phone
                    size={17}
                    className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
                      isRtl ? "right-3" : "left-3"
                    }`}
                  />
                  <input
                    value={settings.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder={t.phonePlaceholder}
                    className={`${inputClass} ${isRtl ? "pr-10" : "pl-10"}`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>{t.address}</label>
                <div className="relative">
                  <MapPin
                    size={17}
                    className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
                      isRtl ? "right-3" : "left-3"
                    }`}
                  />
                  <input
                    value={settings.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder={t.addressPlaceholder}
                    className={`${inputClass} ${isRtl ? "pr-10" : "pl-10"}`}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>{t.logo}</label>
                <div className="relative">
                  <ImageIcon
                    size={17}
                    className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
                      isRtl ? "right-3" : "left-3"
                    }`}
                  />
                  <input
                    value={settings.logo}
                    onChange={(e) => updateField("logo", e.target.value)}
                    placeholder={t.logoPlaceholder}
                    className={`${inputClass} ${isRtl ? "pr-10" : "pl-10"}`}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">{t.uploadNote}</p>
              </div>
            </div>
          </section>

          {/* Logo Preview */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold">{t.logo}</h3>

            <div className="mt-5 flex min-h-52 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt="Shop logo preview"
                  className="max-h-32 max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="mb-3 rounded-2xl bg-blue-50 p-4 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Store size={36} />
                </div>
              )}

              <p className="mt-3 text-center text-sm font-semibold">
                {settings.shop_name || t.shopName}
              </p>

              <p className="mt-1 text-center text-xs text-slate-400">
                {t.noLogo}
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* Invoice Settings */}
      {activeTab === "invoice" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <SectionHeading
              icon={ReceiptText}
              title={t.invoice}
              description={t.invoiceDesc}
            />

            <div className="space-y-5">
              <div>
                <label className={labelClass}>{t.prefix}</label>
                <div className="relative">
                  <Hash
                    size={17}
                    className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
                      isRtl ? "right-3" : "left-3"
                    }`}
                  />
                  <input
                    value={settings.invoice_prefix}
                    onChange={(e) =>
                      updateField("invoice_prefix", e.target.value)
                    }
                    placeholder={t.prefixPlaceholder}
                    className={`${inputClass} ${isRtl ? "pr-10" : "pl-10"}`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>{t.footer}</label>
                <textarea
                  rows={5}
                  value={settings.invoice_footer}
                  onChange={(e) =>
                    updateField("invoice_footer", e.target.value)
                  }
                  placeholder={t.footerPlaceholder}
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>
          </section>

          {/* Invoice Preview */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <SectionHeading
              icon={FileText}
              title={t.preview}
              description={t.previewDesc}
            />

            <div className="rounded-xl border border-slate-200 bg-white p-5 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
              <div className="flex items-start justify-between gap-3 border-b border-dashed border-slate-200 pb-4 dark:border-slate-700">
                <div className="min-w-0">
                  <h3 className="break-words text-lg font-bold">
                    {settings.shop_name || t.shopName}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {settings.phone}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {settings.address}
                  </p>
                </div>

                {settings.logo && (
                  <img
                    src={settings.logo}
                    alt="Logo"
                    className="h-12 w-12 shrink-0 object-contain"
                  />
                )}
              </div>

              <div className="py-4">
                <p className="text-xs text-slate-500">{t.invoiceNumber}</p>
                <p className="mt-1 font-bold">
                  {settings.invoice_prefix || "-"}- 
                </p>
              </div>

              <div className="border-y border-slate-200 py-3 dark:border-slate-700">
                <p className="text-sm text-slate-500">{t.sampleItem}</p>
                <p className="mt-2 text-sm text-slate-400">—</p>
              </div>

              <div className="space-y-2 py-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.subtotal}</span>
                  <span>—</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    {t.tax} ({settings.tax_rate || 0}%)
                  </span>
                  <span>—</span>
                </div>

                <div className="flex justify-between border-t border-slate-200 pt-3 font-bold dark:border-slate-700">
                  <span>{t.total}</span>
                  <span>{getCurrencySymbol(selectedCurrency)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-4 text-center text-xs text-slate-500 dark:border-slate-700">
                {settings.invoice_footer || t.thankYou}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Financial Settings */}
      {activeTab === "financial" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <SectionHeading
            icon={Wallet}
            title={t.finance}
            description={t.financeDesc}
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>{t.taxRate}</label>
              <div className="relative">
                <Percent
                  size={17}
                  className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
                    isRtl ? "right-3" : "left-3"
                  }`}
                />

                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={settings.tax_rate}
                  onChange={(e) => updateField("tax_rate", e.target.value)}
                  className={`${inputClass} ${isRtl ? "pr-10" : "pl-10"}`}
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                {t.financeDesc}
              </p>
            </div>

            <div>
              <label className={labelClass}>{t.currency}</label>
              <div className="relative">
                <Coins
                  size={17}
                  className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
                    isRtl ? "right-3" : "left-3"
                  }`}
                />

                <select
                  value={settings.base_currency_id}
                  onChange={(e) =>
                    updateField("base_currency_id", e.target.value)
                  }
                  className={`${inputClass} ${isRtl ? "pr-10" : "pl-10"}`}
                >
                  <option value="">{t.currency}</option>

                  {currencies.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                      {getCurrencyCode(currency)
                        ? `${getCurrencyCode(currency)} - `
                        : ""}
                      {getCurrencyName(currency)}
                    </option>
                  ))}
                </select>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                {t.currencyDesc}
              </p>
            </div>
          </div>

          {currencies.length === 0 && (
            <p className="mt-4 text-sm text-amber-600">
              {t.noCurrency}
            </p>
          )}
        </section>
      )}

      {/* Settings Information */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <SectionHeading
          icon={Info}
          title={t.system}
          description={t.subtitle}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs text-slate-500">{t.settingId}</p>
            <p className="mt-2 font-semibold">
              {settings.id ? `#${settings.id}` : t.noRecord}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs text-slate-500">{t.lastUpdated}</p>
            <p className="mt-2 text-sm font-semibold">
              {formatDate(settings.updated_at)}
            </p>
          </div>
        </div>
      </section>

      {/* Validation and Save */}
      {(error || message) && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 text-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-500/10 dark:text-red-400"
              : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-400"
          }`}
        >
          {error ? <Info size={18} /> : <CheckCircle2 size={18} />}
          {error || message}
        </div>
      )}

      <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row">
        <button
          type="button"
          onClick={handleReset}
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw size={17} />
          {t.reset}
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || currencies.length === 0}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <Save size={17} />
          )}
          {saving ? t.saving : t.save}
        </button>
      </div>
    </div>
  );
}
