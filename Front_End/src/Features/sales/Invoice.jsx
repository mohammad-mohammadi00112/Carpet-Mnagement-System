
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  X,
  Eye,
  FileText,
  Printer,
  DollarSign,
  CalendarDays,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import {
  getInvoices,
  createInvoice,
} from "../services/sales/invocieService";

const translations = {
  en: {
    title: "Invoices",
    subtitle: "Manage and print customer invoices",
    search: "Search invoice number or sale ID...",
    add: "Create Invoice",
    total: "Total Invoices",
    revenue: "Total Invoice Amount",
    tax: "Total Tax",
    invoiceNo: "Invoice Number",
    sale: "Sale ID",
    date: "Invoice Date",
    currency: "Currency ID",
    taxAmount: "Tax Amount",
    totalAmount: "Total Amount",
    actions: "Actions",
    view: "View",
    print: "Print",
    addTitle: "Create Invoice",
    details: "Invoice Details",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    noData: "No invoices found",
    required: "Please fill in all required fields correctly.",
    invoicePlaceholder: "e.g. INV-0006",
    salePlaceholder: "Enter sale ID",
    currencyPlaceholder: "Enter currency ID",
    currencyLabel: "AFN",
    shop: "Carpet Management System",
    invoice: "INVOICE",
    refresh: "Refresh",
    loading: "Loading invoices...",
    saving: "Saving...",
    success: "Invoice created successfully.",
    loadError: "Failed to load invoices.",
    saveError: "Failed to create invoice.",
    duplicate: "Invoice number already exists.",
    searchEmpty: "No matching invoices found.",
  },

  fa: {
    title: "فاکتورها",
    subtitle: "مدیریت و چاپ فاکتورهای مشتریان",
    search: "جستجوی شماره فاکتور یا شماره فروش...",
    add: "ایجاد فاکتور",
    total: "تعداد فاکتورها",
    revenue: "مجموع مبلغ فاکتورها",
    tax: "مجموع مالیات",
    invoiceNo: "شماره فاکتور",
    sale: "شماره فروش",
    date: "تاریخ فاکتور",
    currency: "شماره ارز",
    taxAmount: "مبلغ مالیات",
    totalAmount: "مبلغ مجموع",
    actions: "عملیات",
    view: "مشاهده",
    print: "چاپ",
    addTitle: "ایجاد فاکتور",
    details: "جزئیات فاکتور",
    save: "ذخیره",
    cancel: "لغو",
    close: "بستن",
    noData: "هیچ فاکتوری یافت نشد",
    required: "لطفاً تمام فیلدهای ضروری را درست خانه‌پری کنید.",
    invoicePlaceholder: "مثلاً INV-0006",
    salePlaceholder: "شماره فروش را وارد کنید",
    currencyPlaceholder: "شماره ارز را وارد کنید",
    currencyLabel: "افغانی",
    shop: "سیستم مدیریت فرش",
    invoice: "فاکتور",
    refresh: "تازه‌سازی",
    loading: "در حال دریافت فاکتورها...",
    saving: "در حال ذخیره...",
    success: "فاکتور با موفقیت ثبت شد.",
    loadError: "دریافت فاکتورها ناموفق بود.",
    saveError: "ثبت فاکتور ناموفق بود.",
    duplicate: "این شماره فاکتور قبلاً ثبت شده است.",
    searchEmpty: "فاکتوری مطابق جستجوی شما یافت نشد.",
  },

  ps: {
    title: "رسیدونه",
    subtitle: "د پیرودونکو رسیدونه مدیریت او چاپ کړئ",
    search: "د رسید شمېرې یا پلور شمېره ولټوئ...",
    add: "رسید جوړ کړئ",
    total: "د رسیدونو شمېر",
    revenue: "د رسیدونو ټوله اندازه",
    tax: "ټول مالیات",
    invoiceNo: "د رسید شمېره",
    sale: "د پلور شمېره",
    date: "د رسید نېټه",
    currency: "د پیسو شمېره",
    taxAmount: "د مالیې اندازه",
    totalAmount: "ټوله اندازه",
    actions: "کړنې",
    view: "کتل",
    print: "چاپ",
    addTitle: "رسید جوړ کړئ",
    details: "د رسید معلومات",
    save: "ساتل",
    cancel: "لغوه",
    close: "بندول",
    noData: "هیڅ رسید ونه موندل شو",
    required: "مهرباني وکړئ اړین معلومات په سمه توګه بشپړ کړئ.",
    invoicePlaceholder: "لکه INV-0006",
    salePlaceholder: "د پلور شمېره ولیکئ",
    currencyPlaceholder: "د پیسو شمېره ولیکئ",
    currencyLabel: "افغانۍ",
    shop: "د غالیو مدیریت سیستم",
    invoice: "رسید",
    refresh: "تازه کول",
    loading: "رسیدونه ترلاسه کېږي...",
    saving: "ساتل کېږي...",
    success: "رسید په بریالیتوب ثبت شو.",
    loadError: "د رسیدونو ترلاسه کول ناکام شول.",
    saveError: "د رسید ثبتول ناکام شول.",
    duplicate: "دا د رسید شمېره مخکې ثبت شوې ده.",
    searchEmpty: "ستاسو د لټون لپاره رسید ونه موندل شو.",
  },
};

const getEmptyForm = () => ({
  sale_id: "",
  invoice_number: "",
  invoice_date: new Date().toISOString().slice(0, 16),
  currency_id: "1",
  tax_amount: "0",
  total_amount: "",
});

export default function Invoice() {
  const { i18n } = useTranslation();

  const language = i18n.language || "en";
  const t = translations[language] || translations.en;
  const isRTL = ["fa", "ps"].includes(language);

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);

  const [form, setForm] = useState(getEmptyForm);

  const [notice, setNotice] = useState({
    type: "",
    message: "",
  });

  const money = (value) =>
    Number(value || 0).toLocaleString(
      language === "en"
        ? "en-US"
        : language === "ps"
          ? "ps-AF"
          : "fa-IR"
    );

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString(
      language === "en"
        ? "en-US"
        : language === "ps"
          ? "ps-AF"
          : "fa-IR"
    );
  };

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getInvoices();

      if (!Array.isArray(data)) {
        throw new Error("Invalid invoices response");
      }

      setInvoices(data);
      setNotice({ type: "", message: "" });
    } catch (error) {
      console.error("Fetch invoices error:", error);

      setNotice({
        type: "error",
        message:
          error.response?.data?.message || t.loadError,
      });
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return invoices;

    return invoices.filter((item) =>
      [
        item.invoice_number,
        item.sale_id,
        item.id,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      )
    );
  }, [invoices, search]);

  const totalAmount = useMemo(
    () =>
      invoices.reduce(
        (sum, item) => sum + Number(item.total_amount || 0),
        0
      ),
    [invoices]
  );

  const totalTax = useMemo(
    () =>
      invoices.reduce(
        (sum, item) => sum + Number(item.tax_amount || 0),
        0
      ),
    [invoices]
  );

  const openAdd = () => {
    const nextId =
      Math.max(0, ...invoices.map((item) => Number(item.id) || 0)) + 1;

    setForm({
      ...getEmptyForm(),
      invoice_number: `INV-${String(nextId).padStart(4, "0")}`,
    });

    setNotice({ type: "", message: "" });
    setModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setNotice({ type: "", message: "" });

    if (
      !form.sale_id ||
      !form.invoice_number.trim() ||
      !form.invoice_date ||
      !form.currency_id ||
      form.total_amount === "" ||
      Number(form.sale_id) <= 0 ||
      Number(form.currency_id) <= 0 ||
      Number(form.tax_amount) < 0 ||
      Number(form.total_amount) < 0 ||
      !Number.isFinite(Number(form.tax_amount)) ||
      !Number.isFinite(Number(form.total_amount))
    ) {
      setNotice({
        type: "error",
        message: t.required,
      });
      return;
    }

    const duplicate = invoices.some(
      (item) =>
        String(item.invoice_number).toLowerCase() ===
        form.invoice_number.trim().toLowerCase()
    );

    if (duplicate) {
      setNotice({
        type: "error",
        message: t.duplicate,
      });
      return;
    }

    const payload = {
      sale_id: Number(form.sale_id),
      invoice_number: form.invoice_number.trim(),
      invoice_date: form.invoice_date,
      currency_id: Number(form.currency_id),
      tax_amount: Number(form.tax_amount || 0),
      total_amount: Number(form.total_amount),
    };

    try {
      setSubmitting(true);

      await createInvoice(payload);

      await fetchInvoices();

      setModal(false);
      setForm(getEmptyForm());

      setNotice({
        type: "success",
        message: t.success,
      });
    } catch (error) {
      console.error("Create invoice error:", error);

      setNotice({
        type: "error",
        message:
          error.response?.data?.message || t.saveError,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const printInvoice = (item) => {
    const printWindow = window.open(
      "",
      "_blank",
      "width=800,height=700"
    );

    if (!printWindow) return;

    const safeInvoiceNumber = String(item.invoice_number || "");
    const safeSaleId = String(item.sale_id || "");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>${safeInvoiceNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #222;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .info {
            margin-top: 30px;
            line-height: 2.2;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 30px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background: #f3f4f6;
          }
          .total {
            text-align: right;
            margin-top: 30px;
            font-size: 20px;
            font-weight: bold;
          }
          @media print {
            body { padding: 15px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${t.shop}</h1>
          <h2>${t.invoice}</h2>
        </div>

        <div class="info">
          <p><strong>${t.invoiceNo}:</strong> ${safeInvoiceNumber}</p>
          <p><strong>${t.sale}:</strong> #${safeSaleId}</p>
          <p><strong>${t.date}:</strong> ${formatDate(item.invoice_date)}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>${t.taxAmount}</th>
              <th>${t.totalAmount}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${money(item.tax_amount)}</td>
              <td>${money(item.total_amount)}</td>
            </tr>
          </tbody>
        </table>

        <div class="total">
          ${t.totalAmount}: ${money(item.total_amount)} ${t.currencyLabel}
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900/40";

  const cardClass =
    "rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
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

        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchInvoices}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            {t.refresh}
          </button>

          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            {t.add}
          </button>
        </div>
      </div>

      {/* Notification */}
      {notice.message && (
        <div
          className={`flex items-center gap-3 rounded-xl border p-4 text-sm ${
            notice.type === "error"
              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
              : "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
          }`}
        >
          {notice.type === "error" ? (
            <AlertCircle size={19} />
          ) : (
            <CheckCircle2 size={19} />
          )}

          <span>{notice.message}</span>

          <button
            onClick={() => setNotice({ type: "", message: "" })}
            className="ms-auto rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.total}
            </p>
            <FileText className="text-blue-500" />
          </div>
          <p className="mt-3 text-2xl font-bold">
            {money(invoices.length)}
          </p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.revenue}
            </p>
            <DollarSign className="text-green-500" />
          </div>
          <p className="mt-3 text-2xl font-bold">
            {money(totalAmount)}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {t.currencyLabel}
          </p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.tax}
            </p>
            <CalendarDays className="text-orange-500" />
          </div>
          <p className="mt-3 text-2xl font-bold">
            {money(totalTax)}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {t.currencyLabel}
          </p>
        </div>
      </div>

      {/* Invoice Table */}
      <div className={cardClass}>
        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
              isRTL ? "right-3" : "left-3"
            }`}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            className={`${inputClass} ${
              isRTL ? "pr-10" : "pl-10"
            }`}
          />
        </div>

        {/* Desktop Table */}
        <div className="mt-5 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[850px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                {[
                  t.invoiceNo,
                  t.sale,
                  t.date,
                  t.currency,
                  t.taxAmount,
                  t.totalAmount,
                  t.actions,
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-3 py-3 text-start font-semibold"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <Loader2
                      size={27}
                      className="mx-auto animate-spin text-blue-600"
                    />
                    <p className="mt-3 text-gray-500">
                      {t.loading}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-3 py-4 font-semibold">
                      {item.invoice_number}
                    </td>

                    <td className="px-3 py-4">
                      #{item.sale_id}
                    </td>

                    <td className="px-3 py-4">
                      {formatDate(item.invoice_date)}
                    </td>

                    <td className="px-3 py-4">
                      #{item.currency_id}
                    </td>

                    <td className="px-3 py-4">
                      {money(item.tax_amount)}
                    </td>

                    <td className="px-3 py-4 font-semibold">
                      {money(item.total_amount)}
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewItem(item)}
                          className="rounded-lg p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title={t.view}
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          onClick={() => printInvoice(item)}
                          className="rounded-lg p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                          title={t.print}
                        >
                          <Printer size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="mt-4 grid gap-3 md:hidden">
          {loading ? (
            <div className="py-10 text-center">
              <Loader2
                size={27}
                className="mx-auto animate-spin text-blue-600"
              />
              <p className="mt-3 text-sm text-gray-500">
                {t.loading}
              </p>
            </div>
          ) : (
            filteredInvoices.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold">
                    {item.invoice_number}
                  </span>

                  <span className="font-semibold text-green-600">
                    {money(item.total_amount)} {t.currencyLabel}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t.sale}:{" "}
                    <span className="font-medium text-gray-800 dark:text-white">
                      #{item.sale_id}
                    </span>
                  </p>

                  <p className="text-gray-500 dark:text-gray-400">
                    {t.date}:{" "}
                    <span className="font-medium text-gray-800 dark:text-white">
                      {formatDate(item.invoice_date)}
                    </span>
                  </p>

                  <p className="text-gray-500 dark:text-gray-400">
                    {t.taxAmount}:{" "}
                    <span className="font-medium text-gray-800 dark:text-white">
                      {money(item.tax_amount)}
                    </span>
                  </p>

                  <p className="text-gray-500 dark:text-gray-400">
                    {t.currency}:{" "}
                    <span className="font-medium text-gray-800 dark:text-white">
                      #{item.currency_id}
                    </span>
                  </p>
                </div>

                <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                  <button
                    onClick={() => setViewItem(item)}
                    className="rounded-lg p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    onClick={() => printInvoice(item)}
                    className="rounded-lg p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <Printer size={17} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && filteredInvoices.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            {search ? t.searchEmpty : t.noData}
          </p>
        )}
      </div>

      {/* Create Invoice Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">
                {t.addTitle}
              </h2>

              <button
                onClick={() => setModal(false)}
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">
                    {t.sale}
                  </span>

                  <input
                    type="number"
                    min="1"
                    required
                    name="sale_id"
                    value={form.sale_id}
                    onChange={handleChange}
                    placeholder={t.salePlaceholder}
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium">
                    {t.invoiceNo}
                  </span>

                  <input
                    required
                    name="invoice_number"
                    value={form.invoice_number}
                    onChange={handleChange}
                    placeholder={t.invoicePlaceholder}
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium">
                    {t.date}
                  </span>

                  <input
                    type="datetime-local"
                    required
                    name="invoice_date"
                    value={form.invoice_date}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium">
                    {t.currency}
                  </span>

                  <input
                    type="number"
                    min="1"
                    required
                    name="currency_id"
                    value={form.currency_id}
                    onChange={handleChange}
                    placeholder={t.currencyPlaceholder}
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium">
                    {t.taxAmount}
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="tax_amount"
                    value={form.tax_amount}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium">
                    {t.totalAmount}
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    name="total_amount"
                    value={form.total_amount}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  {t.cancel}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Plus size={17} />
                  )}

                  {submitting ? t.saving : t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Invoice Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm">
          <div className="my-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  {t.details}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {viewItem.invoice_number}
                </p>
              </div>

              <button
                onClick={() => setViewItem(null)}
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {[
                [t.invoiceNo, viewItem.invoice_number],
                [t.sale, `#${viewItem.sale_id}`],
                [t.date, formatDate(viewItem.invoice_date)],
                [t.currency, `#${viewItem.currency_id}`],
                [
                  t.taxAmount,
                  `${money(viewItem.tax_amount)} ${t.currencyLabel}`,
                ],
                [
                  t.totalAmount,
                  `${money(viewItem.total_amount)} ${t.currencyLabel}`,
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-3 border-b border-gray-100 pb-2 dark:border-gray-800"
                >
                  <span className="text-gray-500 dark:text-gray-400">
                    {label}
                  </span>

                  <span className="font-semibold text-end">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => printInvoice(viewItem)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Printer size={17} />
                {t.print}
              </button>

              <button
                onClick={() => setViewItem(null)}
                className="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
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
