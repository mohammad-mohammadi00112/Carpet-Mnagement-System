

import { useEffect, useState } from "react";
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
} from "lucide-react";

const initialSettings = {
  id: 1,
  shop_name: "CarpetPro",
  logo: "",
  phone: "0700000000",
  address: "Herat, Afghanistan",
  invoice_prefix: "INV",
  invoice_footer: "Thank you for shopping with us!",
  tax_rate: "0",
  base_currency_id: "1",
  updated_at: "2026-11-12T08:00:00",
};

const currencies = [
  { id: "1", code: "AFN", name: "Afghan Afghani", symbol: "؋" },
  { id: "2", code: "USD", name: "US Dollar", symbol: "$" },
  { id: "3", code: "EUR", name: "Euro", symbol: "€" },
];

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
    previewDesc: "This is an example of how your invoice information may appear.",
    invoiceNumber: "Invoice Number",
    sampleItem: "Carpet Item",
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
    saved: "Changes saved successfully (demo only).",
    required: "Shop name is required.",
    invalidTax: "Tax rate must be between 0 and 100.",
    noLogo: "Your logo preview will appear here.",
    uploadNote: "Enter an image URL to preview your shop logo.",
    general: "General",
    financial: "Finance",
    invoiceTab: "Invoices",
    settings: "Settings",
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
    previewDesc: "نمونه‌ای از نحوه نمایش اطلاعات فاکتور.",
    invoiceNumber: "شماره فاکتور",
    sampleItem: "قالین نمونه",
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
    saved: "تغییرات با موفقیت ذخیره شد (صرفاً نمایشی).",
    required: "نام فروشگاه الزامی است.",
    invalidTax: "نرخ مالیات باید بین صفر تا صد باشد.",
    noLogo: "پیش‌نمایش لوگوی شما در اینجا نمایش داده می‌شود.",
    uploadNote: "برای پیش‌نمایش لوگو، آدرس تصویر را وارد کنید.",
    general: "عمومی",
    financial: "مالی",
    invoiceTab: "فاکتور",
    settings: "تنظیمات",
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
    previewDesc: "د بل د معلوماتو د ښودلو یوه بېلګه.",
    invoiceNumber: "د بل شمېره",
    sampleItem: "د قالین بېلګه",
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
    saved: "بدلونونه په بریالیتوب خوندي شول (یوازې نمایشي).",
    required: "د هټۍ نوم اړین دی.",
    invalidTax: "د مالیې کچه باید له صفر څخه تر سلو پورې وي.",
    noLogo: "ستاسو د لوګو مخکتنه به دلته ښکاره شي.",
    uploadNote: "د لوګو د مخکتنې لپاره د انځور لینک ولیکئ.",
    general: "عمومي",
    financial: "مالي",
    invoiceTab: "بلونه",
    settings: "تنظیمات",
  },
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500";

const labelClass =
  "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

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

export default function Settings() {
  const lang = document.documentElement.lang || "en";
  const t = translations[lang] || translations.en;
  const isRtl = lang === "fa" || lang === "ps";

  const [settings, setSettings] = useState(initialSettings);
  const [savedSettings, setSavedSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState("general");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setMessage("");
    setError("");
  };

  const handleSave = () => {
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

    const updated = {
      ...settings,
      updated_at: new Date().toISOString(),
    };

    setSettings(updated);
    setSavedSettings(updated);
    setMessage(t.saved);
    setError("");
  };

  const handleReset = () => {
    setSettings(savedSettings);
    setMessage("");
    setError("");
  };

  const formatDate = (date) => {
    if (!date) return t.notUpdated;

    return new Date(date).toLocaleString(
      lang === "fa" ? "fa-IR" : lang === "ps" ? "ps-AF" : "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  const tabs = [
    { id: "general", label: t.general, icon: Store },
    { id: "invoice", label: t.invoiceTab, icon: ReceiptText },
    { id: "financial", label: t.financial, icon: Wallet },
  ];

  const selectedCurrency = currencies.find(
    (currency) => currency.id === settings.base_currency_id
  );

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
                  {settings.invoice_prefix || "INV"}-00001
                </p>
              </div>

              <div className="border-y border-slate-200 py-3 dark:border-slate-700">
                <div className="flex justify-between text-sm">
                  <span>{t.sampleItem}</span>
                  <span>10,000</span>
                </div>
              </div>

              <div className="space-y-2 py-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.subtotal}</span>
                  <span>10,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    {t.tax} ({settings.tax_rate || 0}%)
                  </span>
                  <span>
                    {(10000 * (Number(settings.tax_rate) || 0)) / 100}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 font-bold dark:border-slate-700">
                  <span>{t.total}</span>
                  <span>
                    {(
                      10000 +
                      (10000 * (Number(settings.tax_rate) || 0)) / 100
                    ).toLocaleString()}
                    {" "}
                    {selectedCurrency?.symbol}
                  </span>
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
                  {currencies.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {t.currencyDesc}
              </p>
            </div>
          </div>
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
            <p className="mt-2 font-semibold">#{settings.id}</p>
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
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw size={17} />
          {t.reset}
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Save size={17} />
          {t.save}
        </button>
      </div>
    </div>
  );
}
