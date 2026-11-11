import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  X,
  RefreshCw,
  ClipboardList,
  Eye,
  CalendarDays,
  Package,
  MapPin,
  Hash,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowDownLeft,
} from "lucide-react";

import {
  getSaleReturnDetails,
  createSaleReturnDetail,
} from "../services/sales/saleReturnDetailService";

import { useTranslation } from "react-i18next";

const ReturnDetail = () => {
  const { t, i18n } = useTranslation();

  const isRTL = ["fa", "ps"].includes(i18n.language);

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const [notice, setNotice] = useState({
    type: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    return_id: "",
    sales_detail_id: "",
    location_id: "",
    quantity: "",
    refund_price: "",
  });

  const translations = {
    en: {
      title: "Return Details",
      subtitle: "Manage and track returned carpet details",
      add: "Add Return Detail",
      search: "Search return details...",
      total: "Total Return Details",
      quantity: "Total Returned Quantity",
      refund: "Total Refund Amount",
      returnId: "Return ID",
      salesDetailId: "Sales Detail ID",
      locationId: "Location ID",
      date: "Created Date",
      quantityLabel: "Quantity",
      refundPrice: "Refund Price",
      totalRefund: "Total Refund",
      actions: "Actions",
      view: "View",
      noData: "No return details found",
      noSearch: "No matching return details",
      addTitle: "Add Return Detail",
      addSubtitle: "Enter the returned carpet information",
      save: "Save Return Detail",
      cancel: "Cancel",
      close: "Close",
      required: "Please fill in all required fields",
      invalidQuantity: "Quantity must be a positive whole number",
      invalidPrice: "Refund price cannot be negative",
      success: "Return detail saved successfully",
      loadError: "Failed to load return details",
      saveError: "Failed to save return detail",
      loading: "Loading...",
      saving: "Saving...",
      refresh: "Refresh",
      details: "Return Detail Information",
      enterReturnId: "Enter return ID",
      enterSalesDetailId: "Enter sales detail ID",
      enterLocationId: "Enter location ID",
      enterQuantity: "Enter quantity",
      enterRefundPrice: "Enter refund price",
      currency: "AFN",
      closeModal: "Close",
      searchResults: "Search results",
    },
    fa: {
      title: "جزئیات برگشت",
      subtitle: "مدیریت و پیگیری جزئیات فرش‌های برگشتی",
      add: "افزودن جزئیات برگشت",
      search: "جستجوی جزئیات برگشت...",
      total: "مجموع جزئیات برگشت",
      quantity: "مجموع تعداد برگشتی",
      refund: "مجموع مبلغ بازپرداخت",
      returnId: "شماره برگشت",
      salesDetailId: "شماره جزئیات فروش",
      locationId: "شماره موقعیت",
      date: "تاریخ ثبت",
      quantityLabel: "تعداد",
      refundPrice: "قیمت بازپرداخت",
      totalRefund: "مجموع بازپرداخت",
      actions: "عملیات",
      view: "مشاهده",
      noData: "هیچ جزئیات برگشتی یافت نشد",
      noSearch: "نتیجه‌ای برای جستجوی شما یافت نشد",
      addTitle: "افزودن جزئیات برگشت",
      addSubtitle: "اطلاعات فرش برگشتی را وارد کنید",
      save: "ثبت جزئیات برگشت",
      cancel: "لغو",
      close: "بستن",
      required: "لطفاً تمام فیلدهای ضروری را تکمیل کنید",
      invalidQuantity: "تعداد باید یک عدد صحیح مثبت باشد",
      invalidPrice: "قیمت بازپرداخت نمی‌تواند منفی باشد",
      success: "جزئیات برگشت با موفقیت ثبت شد",
      loadError: "دریافت اطلاعات برگشت ناموفق بود",
      saveError: "ثبت جزئیات برگشت ناموفق بود",
      loading: "در حال بارگذاری...",
      saving: "در حال ثبت...",
      refresh: "تازه‌سازی",
      details: "اطلاعات جزئیات برگشت",
      enterReturnId: "شماره برگشت را وارد کنید",
      enterSalesDetailId: "شماره جزئیات فروش را وارد کنید",
      enterLocationId: "شماره موقعیت را وارد کنید",
      enterQuantity: "تعداد را وارد کنید",
      enterRefundPrice: "قیمت بازپرداخت را وارد کنید",
      currency: "افغانی",
      closeModal: "بستن",
      searchResults: "نتایج جستجو",
    },
    ps: {
      title: "د بېرته ستنېدو جزئیات",
      subtitle: "د بېرته ستنو شوو غالیو جزئیات اداره او تعقیب کړئ",
      add: "د بېرته ستنېدو جزئیات زیاتول",
      search: "د بېرته ستنېدو جزئیات ولټوئ...",
      total: "د بېرته ستنېدو ټول جزئیات",
      quantity: "د بېرته ستنو شوو ټول شمېر",
      refund: "د بېرته ورکړې ټول مبلغ",
      returnId: "د بېرته ستنېدو شمېره",
      salesDetailId: "د خرڅلاو د جزئیاتو شمېره",
      locationId: "د ځای شمېره",
      date: "د ثبت نېټه",
      quantityLabel: "شمېر",
      refundPrice: "د بېرته ورکړې بیه",
      totalRefund: "ټوله بېرته ورکړه",
      actions: "عملیات",
      view: "لیدل",
      noData: "د بېرته ستنېدو جزئیات ونه موندل شول",
      noSearch: "ستاسو د لټون لپاره پایله ونه موندل شوه",
      addTitle: "د بېرته ستنېدو جزئیات زیاتول",
      addSubtitle: "د بېرته ستنې شوې غالۍ معلومات ولیکئ",
      save: "د بېرته ستنېدو جزئیات ثبتول",
      cancel: "لغوه کول",
      close: "بندول",
      required: "مهرباني وکړئ ټول اړین ځایونه ډک کړئ",
      invalidQuantity: "شمېر باید مثبت بشپړ عدد وي",
      invalidPrice: "د بېرته ورکړې بیه منفي کېدای نشي",
      success: "د بېرته ستنېدو جزئیات په بریالیتوب ثبت شول",
      loadError: "د معلوماتو ترلاسه کول ناکام شول",
      saveError: "د جزئیاتو ثبتول ناکام شول",
      loading: "بارېږي...",
      saving: "ثبتېږي...",
      refresh: "تازه کول",
      details: "د بېرته ستنېدو معلومات",
      enterReturnId: "د بېرته ستنېدو شمېره ولیکئ",
      enterSalesDetailId: "د خرڅلاو د جزئیاتو شمېره ولیکئ",
      enterLocationId: "د ځای شمېره ولیکئ",
      enterQuantity: "شمېر ولیکئ",
      enterRefundPrice: "د بېرته ورکړې بیه ولیکئ",
      currency: "افغانۍ",
      closeModal: "بندول",
      searchResults: "د لټون پایلې",
    },
  };

  const tr = (key) =>
    translations[i18n.language]?.[key] ||
    translations.en[key] ||
    key;

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getSaleReturnDetails();

      if (!Array.isArray(data)) {
        throw new Error("Invalid response from server");
      }

      setDetails(data);
      setNotice({ type: "", message: "" });
    } catch (error) {
      console.error("Return details error:", error);

      setNotice({
        type: "error",
        message:
          error.response?.data?.message || tr("loadError"),
      });
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const filteredDetails = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return details;

    return details.filter((item) =>
      [
        item.id,
        item.return_id,
        item.sales_detail_id,
        item.location_id,
        item.quantity,
        item.refund_price,
      ].some((field) =>
        String(field ?? "").toLowerCase().includes(value)
      )
    );
  }, [details, search]);

  const totalQuantity = useMemo(
    () =>
      details.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      ),
    [details]
  );

  const totalRefund = useMemo(
    () =>
      details.reduce(
        (sum, item) =>
          sum +
          Number(item.quantity || 0) *
            Number(item.refund_price || 0),
        0
      ),
    [details]
  );

  const resetForm = () => {
    setFormData({
      return_id: "",
      sales_detail_id: "",
      location_id: "",
      quantity: "",
      refund_price: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setNotice({ type: "", message: "" });

    const {
      return_id,
      sales_detail_id,
      location_id,
      quantity,
      refund_price,
    } = formData;

    if (
      !return_id ||
      !sales_detail_id ||
      !location_id ||
      !quantity ||
      refund_price === ""
    ) {
      setNotice({
        type: "error",
        message: tr("required"),
      });
      return;
    }

    if (
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) <= 0
    ) {
      setNotice({
        type: "error",
        message: tr("invalidQuantity"),
      });
      return;
    }

    if (
      !Number.isFinite(Number(refund_price)) ||
      Number(refund_price) < 0
    ) {
      setNotice({
        type: "error",
        message: tr("invalidPrice"),
      });
      return;
    }

    const payload = {
      return_id: Number(return_id),
      sales_detail_id: Number(sales_detail_id),
      location_id: Number(location_id),
      quantity: Number(quantity),
      refund_price: Number(refund_price),
    };

    try {
      setSubmitting(true);

      await createSaleReturnDetail(payload);

      await fetchDetails();

      resetForm();
      setShowForm(false);

      setNotice({
        type: "success",
        message: tr("success"),
      });
    } catch (error) {
      console.error("Create return detail error:", error);

      setNotice({
        type: "error",
        message:
          error.response?.data?.message || tr("saveError"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatNumber = (number) =>
    Number(number || 0).toLocaleString(
      i18n.language === "en" ? "en-US" : "fa-IR"
    );

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString(
      i18n.language === "en"
        ? "en-US"
        : i18n.language === "ps"
          ? "ps-AF"
          : "fa-IR"
    );
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-900/40";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen space-y-6 bg-gray-50 p-4 text-gray-800 dark:bg-gray-950 dark:text-gray-100 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {tr("title")}
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {tr("subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchDetails}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            {tr("refresh")}
          </button>

          <button
            onClick={() => {
              resetForm();
              setNotice({ type: "", message: "" });
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            {tr("add")}
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tr("total")}
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {formatNumber(details.length)}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <ClipboardList size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tr("quantity")}
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {formatNumber(totalQuantity)}
              </h2>
            </div>

            <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <Package size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tr("refund")}
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {formatNumber(totalRefund)}{" "}
                <span className="text-sm font-normal text-gray-500">
                  {tr("currency")}
                </span>
              </h2>
            </div>

            <div className="rounded-xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
              <ArrowDownLeft size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="relative">
          <Search
            size={19}
            className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
              isRTL ? "right-4" : "left-4"
            }`}
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tr("search")}
            className={`${inputClass} ${
              isRTL ? "pr-11" : "pl-11"
            }`}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-sm">
            <thead className="bg-gray-50 text-gray-600 dark:bg-gray-800/70 dark:text-gray-300">
              <tr>
                <th className="px-5 py-4 text-start">#</th>
                <th className="px-5 py-4 text-start">
                  {tr("returnId")}
                </th>
                <th className="px-5 py-4 text-start">
                  {tr("salesDetailId")}
                </th>
                <th className="px-5 py-4 text-start">
                  {tr("locationId")}
                </th>
                <th className="px-5 py-4 text-start">
                  {tr("quantityLabel")}
                </th>
                <th className="px-5 py-4 text-start">
                  {tr("refundPrice")}
                </th>
                <th className="px-5 py-4 text-start">
                  {tr("totalRefund")}
                </th>
                <th className="px-5 py-4 text-center">
                  {tr("actions")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-14 text-center">
                    <Loader2
                      className="mx-auto animate-spin text-blue-600"
                      size={28}
                    />
                    <p className="mt-3 text-gray-500">
                      {tr("loading")}
                    </p>
                  </td>
                </tr>
              ) : filteredDetails.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-14 text-center text-gray-500 dark:text-gray-400"
                  >
                    <ClipboardList
                      size={36}
                      className="mx-auto mb-3 opacity-40"
                    />

                    {search ? tr("noSearch") : tr("noData")}
                  </td>
                </tr>
              ) : (
                filteredDetails.map((item, index) => {
                  const lineRefund =
                    Number(item.quantity || 0) *
                    Number(item.refund_price || 0);

                  return (
                    <tr
                      key={item.id}
                      className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-5 py-4 text-gray-500">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4 font-medium">
                        #{item.return_id}
                      </td>

                      <td className="px-5 py-4">
                        #{item.sales_detail_id}
                      </td>

                      <td className="px-5 py-4">
                        #{item.location_id}
                      </td>

                      <td className="px-5 py-4">
                        {formatNumber(item.quantity)}
                      </td>

                      <td className="px-5 py-4">
                        {formatNumber(item.refund_price)}
                      </td>

                      <td className="px-5 py-4 font-semibold text-orange-600 dark:text-orange-400">
                        {formatNumber(lineRefund)}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => setSelectedDetail(item)}
                          title={tr("view")}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:hover:bg-blue-900/50"
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-bold">
                  {tr("addTitle")}
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {tr("addSubtitle")}
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    {tr("returnId")}
                  </label>

                  <input
                    type="number"
                    min="1"
                    name="return_id"
                    value={formData.return_id}
                    onChange={handleChange}
                    placeholder={tr("enterReturnId")}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    {tr("salesDetailId")}
                  </label>

                  <input
                    type="number"
                    min="1"
                    name="sales_detail_id"
                    value={formData.sales_detail_id}
                    onChange={handleChange}
                    placeholder={tr("enterSalesDetailId")}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    {tr("locationId")}
                  </label>

                  <input
                    type="number"
                    min="1"
                    name="location_id"
                    value={formData.location_id}
                    onChange={handleChange}
                    placeholder={tr("enterLocationId")}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    {tr("quantityLabel")}
                  </label>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder={tr("enterQuantity")}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    {tr("refundPrice")}
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="refund_price"
                    value={formData.refund_price}
                    onChange={handleChange}
                    placeholder={tr("enterRefundPrice")}
                    className={inputClass}
                  />
                </div>
              </div>

              {formData.quantity && formData.refund_price !== "" && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/50 dark:bg-orange-950/30">
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    {tr("totalRefund")}
                  </p>

                  <p className="mt-1 text-xl font-bold text-orange-700 dark:text-orange-300">
                    {formatNumber(
                      Number(formData.quantity || 0) *
                        Number(formData.refund_price || 0)
                    )}{" "}
                    {tr("currency")}
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {tr("cancel")}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Plus size={17} />
                  )}

                  {submitting ? tr("saving") : tr("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-bold">
                  {tr("details")}
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  #{selectedDetail.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedDetail(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              {[
                {
                  label: tr("returnId"),
                  value: `#${selectedDetail.return_id}`,
                  icon: ArrowDownLeft,
                },
                {
                  label: tr("salesDetailId"),
                  value: `#${selectedDetail.sales_detail_id}`,
                  icon: Hash,
                },
                {
                  label: tr("locationId"),
                  value: `#${selectedDetail.location_id}`,
                  icon: MapPin,
                },
                {
                  label: tr("quantityLabel"),
                  value: formatNumber(selectedDetail.quantity),
                  icon: Package,
                },
                {
                  label: tr("refundPrice"),
                  value: `${formatNumber(selectedDetail.refund_price)} ${tr("currency")}`,
                  icon: DollarSign,
                },
                {
                  label: tr("totalRefund"),
                  value: `${formatNumber(
                    Number(selectedDetail.quantity || 0) *
                      Number(selectedDetail.refund_price || 0)
                  )} ${tr("currency")}`,
                  icon: DollarSign,
                },
                {
                  label: tr("date"),
                  value: formatDate(
                    selectedDetail.created_at ||
                      selectedDetail.return_date
                  ),
                  icon: CalendarDays,
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/70"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                        <Icon size={18} />
                      </div>

                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {item.label}
                      </span>
                    </div>

                    <span className="text-sm font-semibold">
                      {item.value || "—"}
                    </span>
                  </div>
                );
              })}

              <button
                onClick={() => setSelectedDetail(null)}
                className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {tr("closeModal")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnDetail;