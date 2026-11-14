
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  Plus,
  Eye,
  X,
  ClipboardList,
  MapPin,
  Package,
  Hash,
  DollarSign,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import {
  getSaleReturnDetails,
  createSaleReturnDetail,
} from "../services/sales/saleReturnDetailService";

import { getSaleReturns } from "../services/sales/saleReturnService";
import { getSaleDetails } from "../services/sales/saleDetailService";
import { getLocations } from "../services/locations/locationService";

const translations = {
  en: {
    title: "Return Details",
    subtitle: "Manage returned carpet details",
    add: "Add Return Detail",
    search: "Search return details...",
    return: "Return",
    salesDetail: "Sold Carpet",
    location: "Return Location",
    quantity: "Quantity",
    refundPrice: "Refund Price",
    totalRefund: "Total Refund",
    actions: "Actions",
    save: "Save Detail",
    cancel: "Cancel",
    details: "Detail Information",
    close: "Close",
    loading: "Loading...",
    noData: "No return details found",
    noReturns: "No returns available",
    noSalesDetails: "No sold carpets available",
    noLocations: "No locations available",
    selectReturn: "Select a return",
    selectSalesDetail: "Select a sold carpet",
    selectLocation: "Select a location",
    enterQuantity: "Enter quantity",
    enterRefundPrice: "Enter refund price",
    required: "Please fill in all required fields",
    invalidQuantity: "Quantity must be greater than zero",
    invalidPrice: "Refund price cannot be negative",
    success: "Return detail created successfully",
    error: "Something went wrong",
    refresh: "Refresh",
    totalRecords: "Total Records",
    view: "View",
    sale: "Sale",
    chooseReturnFirst: "Choose a return to filter sold carpets",
  },

  fa: {
    title: "جزئیات برگشت فروش",
    subtitle: "مدیریت جزئیات قالین‌های برگشتی",
    add: "افزودن جزئیات برگشت",
    search: "جستجوی جزئیات...",
    return: "برگشت فروش",
    salesDetail: "قالین فروخته‌شده",
    location: "موقعیت برگشت",
    quantity: "تعداد",
    refundPrice: "قیمت برگشت",
    totalRefund: "مجموع مبلغ برگشت",
    actions: "عملیات",
    save: "ثبت جزئیات",
    cancel: "لغو",
    details: "معلومات جزئیات",
    close: "بستن",
    loading: "در حال بارگذاری...",
    noData: "هیچ جزئیات برگشتی پیدا نشد",
    noReturns: "هیچ برگشت فروشی موجود نیست",
    noSalesDetails: "قالین فروخته‌شده موجود نیست",
    noLocations: "هیچ موقعیتی موجود نیست",
    selectReturn: "برگشت فروش را انتخاب کنید",
    selectSalesDetail: "قالین فروخته‌شده را انتخاب کنید",
    selectLocation: "موقعیت را انتخاب کنید",
    enterQuantity: "تعداد را وارد کنید",
    enterRefundPrice: "قیمت برگشت را وارد کنید",
    required: "لطفاً تمام فیلدهای ضروری را تکمیل کنید",
    invalidQuantity: "تعداد باید بیشتر از صفر باشد",
    invalidPrice: "قیمت برگشت نمی‌تواند منفی باشد",
    success: "جزئیات برگشت با موفقیت ثبت شد",
    error: "مشکلی به وجود آمد",
    refresh: "تازه‌سازی",
    totalRecords: "مجموع ریکاردها",
    view: "مشاهده",
    sale: "فروش",
    chooseReturnFirst: "برای محدود کردن قالین‌ها، ابتدا برگشت فروش را انتخاب کنید",
  },

  ps: {
    title: "د بېرته ستنولو جزئیات",
    subtitle: "د بېرته ستنو شوو قالینو مدیریت",
    add: "د جزئیاتو زیاتول",
    search: "د جزئیاتو لټون...",
    return: "بېرته ستنول",
    salesDetail: "پلورل شوې قالین",
    location: "د بېرته ستنولو ځای",
    quantity: "اندازه",
    refundPrice: "د بېرته ستنولو بیه",
    totalRefund: "ټول مبلغ",
    actions: "کړنې",
    save: "ثبتول",
    cancel: "لغوه",
    details: "د جزئیاتو معلومات",
    close: "بندول",
    loading: "بارول کېږي...",
    noData: "د بېرته ستنولو جزئیات ونه موندل شول",
    noReturns: "د بېرته ستنولو ریکارډ نشته",
    noSalesDetails: "پلورل شوې قالین نشته",
    noLocations: "ځایونه نشته",
    selectReturn: "بېرته ستنول انتخاب کړئ",
    selectSalesDetail: "پلورل شوې قالین انتخاب کړئ",
    selectLocation: "ځای انتخاب کړئ",
    enterQuantity: "اندازه ولیکئ",
    enterRefundPrice: "بیه ولیکئ",
    required: "ټول اړین معلومات ډک کړئ",
    invalidQuantity: "اندازه باید له صفر څخه زیاته وي",
    invalidPrice: "بیه منفي کېدای نشي",
    success: "جزئیات په بریالیتوب ثبت شول",
    error: "یوه ستونزه رامنځته شوه",
    refresh: "تازه کول",
    totalRecords: "ټول ریکارډونه",
    view: "کتل",
    sale: "پلور",
    chooseReturnFirst: "د قالینو د محدودولو لپاره لومړی بېرته ستنول انتخاب کړئ",
  },
};

const getArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.rows)) return response.rows;
  return [];
};

const getReturnId = (item) => item?.id ?? item?.return_id ?? "";

const getLocationName = (location) =>
  location?.location_name ??
  location?.name ??
  location?.location ??
  location?.type ??
  `Location #${location?.id}`;

const getCarpetName = (detail) =>
  detail?.carpet_code ??
  detail?.carpet_name ??
  detail?.code ??
  detail?.name ??
  (detail?.carpet_id
    ? `Carpet #${detail.carpet_id}`
    : `Sale Detail #${detail?.id}`);

const getSalePrice = (detail) =>
  detail?.unit_price ??
  detail?.selling_price ??
  detail?.sale_price ??
  detail?.price ??
  "";

const getRelatedSaleId = (detail) =>
  detail?.sale_id ??
  detail?.saleId ??
  detail?.sale?.id ??
  detail?.sales?.id ??
  null;

const getReturnSaleId = (returnItem) =>
  returnItem?.sale_id ??
  returnItem?.saleId ??
  returnItem?.sale?.id ??
  null;

export default function ReturnDetail() {
  const { i18n } = useTranslation();

  const language = i18n.language?.split("-")[0] || "en";
  const t = (key) =>
    translations[language]?.[key] ?? translations.en[key] ?? key;

  const isRTL = ["fa", "ps"].includes(language);

  const [details, setDetails] = useState([]);
  const [returns, setReturns] = useState([]);
  const [salesDetails, setSalesDetails] = useState([]);
  const [locations, setLocations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const [formData, setFormData] = useState({
    return_id: "",
    sales_detail_id: "",
    location_id: "",
    quantity: "",
    refund_price: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [
        detailsResponse,
        returnsResponse,
        salesResponse,
        locationsResponse,
      ] = await Promise.all([
        getSaleReturnDetails(),
        getSaleReturns(),
        getSaleDetails(),
        getLocations(),
      ]);

      setDetails(getArray(detailsResponse));
      setReturns(getArray(returnsResponse));
      setSalesDetails(getArray(salesResponse));
      setLocations(getArray(locationsResponse));
    } catch (err) {
      console.error("Return detail loading error:", err);
      setError(err.response?.data?.message || t("error"));
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const selectedReturn = useMemo(
    () =>
      returns.find(
        (item) => String(getReturnId(item)) === String(formData.return_id)
      ),
    [returns, formData.return_id]
  );

  const availableSalesDetails = useMemo(() => {
    if (!selectedReturn) return salesDetails;

    const returnSaleId = getReturnSaleId(selectedReturn);

    if (returnSaleId === null || returnSaleId === undefined) {
      return salesDetails;
    }

    const matchingDetails = salesDetails.filter(
      (item) =>
        String(getRelatedSaleId(item)) === String(returnSaleId)
    );

    return matchingDetails.length > 0 ? matchingDetails : salesDetails;
  }, [salesDetails, selectedReturn]);

  const selectedSalesDetail = useMemo(
    () =>
      availableSalesDetails.find(
        (item) => String(item.id) === String(formData.sales_detail_id)
      ),
    [availableSalesDetails, formData.sales_detail_id]
  );

  const filteredDetails = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return details;

    return details.filter((item) => {
      const returnItem = returns.find(
        (r) => String(getReturnId(r)) === String(item.return_id)
      );

      const salesItem = salesDetails.find(
        (s) => String(s.id) === String(item.sales_detail_id)
      );

      const locationItem = locations.find(
        (l) => String(l.id) === String(item.location_id)
      );

      return [
        item.id,
        item.return_id,
        item.sales_detail_id,
        item.location_id,
        getCarpetName(salesItem || {}),
        getLocationName(locationItem || {}),
        returnItem?.reason,
      ]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(value));
    });
  }, [details, search, returns, salesDetails, locations]);

  const totalRefund = useMemo(
    () =>
      details.reduce(
        (sum, item) =>
          sum +
          Number(item.quantity || 0) * Number(item.refund_price || 0),
        0
      ),
    [details]
  );

  const formatNumber = (number) =>
    new Intl.NumberFormat(
      language === "fa" ? "fa-IR" : language === "ps" ? "ps-AF" : "en-US"
    ).format(Number(number || 0));

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-700";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300";

  const cardClass =
    "rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900";

  const resetForm = () => {
    setFormData({
      return_id: "",
      sales_detail_id: "",
      location_id: "",
      quantity: "",
      refund_price: "",
    });
    setError("");
    setSuccess("");
  };

  const handleReturnChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      return_id: value,
      sales_detail_id: "",
      refund_price: "",
    }));
  };

  const handleSalesDetailChange = (value) => {
    const selected = availableSalesDetails.find(
      (item) => String(item.id) === String(value)
    );

    setFormData((prev) => ({
      ...prev,
      sales_detail_id: value,
      refund_price: selected ? getSalePrice(selected) : "",
    }));
  };

  const getReturn = (id) =>
    returns.find((item) => String(getReturnId(item)) === String(id));

  const getSalesDetail = (id) =>
    salesDetails.find((item) => String(item.id) === String(id));

  const getLocation = (id) =>
    locations.find((item) => String(item.id) === String(id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.return_id ||
      !formData.sales_detail_id ||
      !formData.location_id ||
      formData.quantity === "" ||
      formData.refund_price === ""
    ) {
      setError(t("required"));
      return;
    }

    const quantity = Number(formData.quantity);
    const refundPrice = Number(formData.refund_price);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      setError(t("invalidQuantity"));
      return;
    }

    if (!Number.isFinite(refundPrice) || refundPrice < 0) {
      setError(t("invalidPrice"));
      return;
    }

    const payload = {
      return_id: Number(formData.return_id),
      sales_detail_id: Number(formData.sales_detail_id),
      location_id: Number(formData.location_id),
      quantity,
      refund_price: refundPrice,
    };

    try {
      setSaving(true);

      await createSaleReturnDetail(payload);

      setSuccess(t("success"));
      resetForm();
      setShowAddModal(false);

      await fetchData();
    } catch (err) {
      console.error("Create return detail error:", err);
      setError(err.response?.data?.message || t("error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            {t("refresh")}
          </button>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <Plus size={18} />
            {t("add")}
          </button>
        </div>
      </div>

      {error && !showAddModal && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
          {success}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("totalRecords")}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(details.length)}
              </h2>
            </div>
            <div className="rounded-lg bg-gray-100 p-3 text-gray-600 dark:bg-slate-800 dark:text-gray-300">
              <ClipboardList size={23} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("totalRefund")}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(totalRefund)}
              </h2>
            </div>
            <div className="rounded-lg bg-gray-100 p-3 text-gray-600 dark:bg-slate-800 dark:text-gray-300">
              <DollarSign size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className={cardClass}>
        <div className="relative">
          <Search
            size={18}
            className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
              isRTL ? "right-3" : "left-3"
            }`}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            className={`${inputClass} ${isRTL ? "pr-10" : "pl-10"}`}
          />
        </div>
      </div>

      {/* Table */}
      <div className={`${cardClass} overflow-hidden`}>
        {loading ? (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
            {t("loading")}
          </div>
        ) : filteredDetails.length === 0 ? (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
            {t("noData")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 dark:border-slate-700 dark:text-gray-400">
                  <th className="px-4 py-4 text-start">ID</th>
                  <th className="px-4 py-4 text-start">{t("return")}</th>
                  <th className="px-4 py-4 text-start">{t("salesDetail")}</th>
                  <th className="px-4 py-4 text-start">{t("location")}</th>
                  <th className="px-4 py-4 text-start">{t("quantity")}</th>
                  <th className="px-4 py-4 text-start">{t("refundPrice")}</th>
                  <th className="px-4 py-4 text-start">{t("totalRefund")}</th>
                  <th className="px-4 py-4 text-center">{t("actions")}</th>
                </tr>
              </thead>

              <tbody>
                {filteredDetails.map((item) => {
                  const returnItem = getReturn(item.return_id);
                  const salesItem = getSalesDetail(item.sales_detail_id);
                  const locationItem = getLocation(item.location_id);

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                    >
                      <td className="px-4 py-4 font-medium text-gray-700 dark:text-gray-200">
                        #{item.id}
                      </td>

                      <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                        #{item.return_id}
                        {returnItem?.sale_id && (
                          <p className="mt-1 text-xs text-gray-400">
                            {t("sale")} #{returnItem.sale_id}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                        {getCarpetName(salesItem || {})}
                      </td>

                      <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                        {getLocationName(locationItem || { id: item.location_id })}
                      </td>

                      <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                        {formatNumber(item.quantity)}
                      </td>

                      <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                        {formatNumber(item.refund_price)}
                      </td>

                      <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white">
                        {formatNumber(
                          Number(item.quantity) * Number(item.refund_price)
                        )}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedDetail(item)}
                          title={t("view")}
                          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-6 w-full max-w-2xl rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("add")}
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                  {error}
                </div>
              )}

              {/* Return */}
              <div>
                <label className={labelClass}>
                  {t("return")} *
                </label>

                <select
                  value={formData.return_id}
                  onChange={(e) => handleReturnChange(e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">{t("selectReturn")}</option>

                  {returns.map((item) => (
                    <option key={getReturnId(item)} value={getReturnId(item)}>
                      #{getReturnId(item)} — {t("sale")} #{getReturnSaleId(item) ?? "—"}
                      {item.return_date
                        ? ` — ${String(item.return_date).slice(0, 10)}`
                        : ""}
                    </option>
                  ))}
                </select>

                {returns.length === 0 && (
                  <p className="mt-1 text-xs text-amber-600">
                    {t("noReturns")}
                  </p>
                )}
              </div>

              {/* Sold Carpet */}
              <div>
                <label className={labelClass}>
                  {t("salesDetail")} *
                </label>

                <select
                  value={formData.sales_detail_id}
                  onChange={(e) => handleSalesDetailChange(e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">{t("selectSalesDetail")}</option>

                  {availableSalesDetails.map((item) => (
                    <option key={item.id} value={item.id}>
                      #{item.id} — {getCarpetName(item)}
                      {getSalePrice(item) !== ""
                        ? ` — ${getSalePrice(item)}`
                        : ""}
                    </option>
                  ))}
                </select>

                {availableSalesDetails.length === 0 && (
                  <p className="mt-1 text-xs text-amber-600">
                    {t("noSalesDetails")}
                  </p>
                )}

                {!formData.return_id && availableSalesDetails.length > 0 && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {t("chooseReturnFirst")}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className={labelClass}>
                  {t("location")} *
                </label>

                <select
                  value={formData.location_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location_id: e.target.value,
                    }))
                  }
                  className={inputClass}
                  required
                >
                  <option value="">{t("selectLocation")}</option>

                  {locations.map((item) => (
                    <option key={item.id} value={item.id}>
                      {getLocationName(item)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    {t("quantity")} *
                  </label>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }))
                    }
                    placeholder={t("enterQuantity")}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    {t("refundPrice")} *
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.refund_price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        refund_price: e.target.value,
                      }))
                    }
                    placeholder={t("enterRefundPrice")}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {formData.quantity !== "" && formData.refund_price !== "" && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("totalRefund")}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                    {formatNumber(
                      Number(formData.quantity) * Number(formData.refund_price)
                    )}
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-slate-600 dark:text-gray-200 dark:hover:bg-slate-800"
                >
                  {t("cancel")}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  {saving ? t("loading") : t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-6 w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("details")}
              </h2>

              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 p-5">
              {[
                {
                  label: "ID",
                  value: `#${selectedDetail.id}`,
                  icon: Hash,
                },
                {
                  label: t("return"),
                  value: `#${selectedDetail.return_id}`,
                  icon: ClipboardList,
                },
                {
                  label: t("salesDetail"),
                  value: getCarpetName(
                    getSalesDetail(selectedDetail.sales_detail_id) || {}
                  ),
                  icon: Package,
                },
                {
                  label: t("location"),
                  value: getLocationName(
                    getLocation(selectedDetail.location_id) || {
                      id: selectedDetail.location_id,
                    }
                  ),
                  icon: MapPin,
                },
                {
                  label: t("quantity"),
                  value: formatNumber(selectedDetail.quantity),
                  icon: Package,
                },
                {
                  label: t("refundPrice"),
                  value: formatNumber(selectedDetail.refund_price),
                  icon: DollarSign,
                },
                {
                  label: t("totalRefund"),
                  value: formatNumber(
                    Number(selectedDetail.quantity) *
                      Number(selectedDetail.refund_price)
                  ),
                  icon: DollarSign,
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 rounded-lg bg-gray-50 p-4 dark:bg-slate-800"
                  >
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                      <Icon size={18} />
                      <span className="text-sm">{item.label}</span>
                    </div>

                    <span className="text-end text-sm font-semibold text-gray-900 dark:text-white">
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 p-5 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                className="w-full rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
