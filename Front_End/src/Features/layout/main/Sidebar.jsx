import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  FiLayout,
  FiGrid,
  FiPackage,
  FiLayers,
  FiMapPin,
  FiArchive,
  FiTruck,
  FiShoppingCart,
  FiRotateCcw,
  FiFileText,
  FiUsers,
  FiUser,
  FiDollarSign,
  FiCreditCard,
  FiGlobe,
  FiTrendingUp,
  FiShield,
  FiKey,
  FiClipboard,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiMenu,
  FiX,
} from "react-icons/fi";

// Translations
const translations = {
  en: {
    dashboard: "Dashboard",
    carpets: "Carpet Management",
    carpetList: "Carpets",
    categories: "Categories",
    locations: "Locations",
    inventory: "Inventory",
    movements: "Stock Movements",
    sales: "Sales",
    saleDetails: "Sale Details",
    returns: "Sale Returns",
    returnDetails: "Return Details",
    invoices: "Invoices",
    purchases: "Purchases",
    purchaseDetails: "Purchase Details",
    suppliers: "Suppliers",
    purchasePayments: "Purchase Payments",
    contacts: "Contacts",
    customers: "Customers",
    employees: "Employees",
    finance: "Finance",
    expenses: "Expenses",
    expenseCategories: "Expense Categories",
    payments: "Payments",
    currencies: "Currencies",
    exchangeRates: "Exchange Rates",
    administration: "Administration",
    users: "Users",
    roles: "Roles",
    permissions: "Permissions",
    rolePermissions: "Role Permissions",
    auditLogs: "Audit Logs",
    settings: "Shop Settings",
    logout: "Logout",
    menu: "Main Menu",
  },

  fa: {
    dashboard: "داشبورد",
    carpets: "مدیریت قالین‌ها",
    carpetList: "قالین‌ها",
    categories: "دسته‌بندی‌ها",
    locations: "موقعیت‌ها",
    inventory: "موجودی اجناس",
    movements: "انتقالات موجودی",
    sales: "فروشات",
    saleDetails: "جزئیات فروش",
    returns: "مرجوعی فروش",
    returnDetails: "جزئیات مرجوعی",
    invoices: "فاکتورها",
    purchases: "خریداری‌ها",
    purchaseDetails: "جزئیات خریداری",
    suppliers: "عرضه‌کنندگان",
    purchasePayments: "پرداخت‌های خریداری",
    contacts: "مخاطبین",
    customers: "مشتریان",
    employees: "کارمندان",
    finance: "امور مالی",
    expenses: "مصارف",
    expenseCategories: "دسته‌بندی مصارف",
    payments: "پرداخت‌ها",
    currencies: "ارزها",
    exchangeRates: "نرخ تبادله ارز",
    administration: "مدیریت سیستم",
    users: "کاربران",
    roles: "نقش‌ها",
    permissions: "دسترسی‌ها",
    rolePermissions: "دسترسی نقش‌ها",
    auditLogs: "گزارش فعالیت‌ها",
    settings: "تنظیمات فروشگاه",
    logout: "خروج از حساب",
    menu: "منوی اصلی",
  },

  ps: {
    dashboard: "ډشبورډ",
    carpets: "د غالیو مدیریت",
    carpetList: "غالۍ",
    categories: "کټګورۍ",
    locations: "ځایونه",
    inventory: "موجودي",
    movements: "د موجودۍ انتقالات",
    sales: "پلور",
    saleDetails: "د پلور جزئیات",
    returns: "د پلور بېرته ستنول",
    returnDetails: "د بېرته ستنولو جزئیات",
    invoices: "رسیدونه",
    purchases: "پېرودنې",
    purchaseDetails: "د پېرودنې جزئیات",
    suppliers: "عرضه کوونکي",
    purchasePayments: "د پېرودنې تادیات",
    contacts: "اړیکې",
    customers: "پېرودونکي",
    employees: "کارکوونکي",
    finance: "مالي چارې",
    expenses: "لګښتونه",
    expenseCategories: "د لګښتونو کټګورۍ",
    payments: "تادیات",
    currencies: "اسعار",
    exchangeRates: "د اسعارو تبادلې نرخ",
    administration: "د سیستم مدیریت",
    users: "کاروونکي",
    roles: "رولونه",
    permissions: "اجازې",
    rolePermissions: "د رول اجازې",
    auditLogs: "د فعالیتونو راپور",
    settings: "د هټۍ تنظیمات",
    logout: "وتل",
    menu: "اصلي مېنو",
  },
};
// Sidebar Menu Structure
const menuGroups = [
  {
    id: "carpets",
    icon: FiGrid,
    items: [
      { key: "carpetList", path: "/carpets", icon: FiPackage },
      { key: "categories", path: "/carpets/categories", icon: FiLayers },
      { key: "locations", path: "/carpets/locations", icon: FiMapPin },
      { key: "inventory", path: "/inventory", icon: FiArchive },
      { key: "movements", path: "/inventory/movements", icon: FiTruck },
    ],
  },
  {
    id: "sales",
    icon: FiShoppingCart,
    items: [
      { key: "sales", path: "/sales", icon: FiShoppingCart },
      { key: "saleDetails", path: "/sales/details", icon: FiFileText },
      { key: "returns", path: "/sales/returns", icon: FiRotateCcw },
      { key: "returnDetails", path: "/sales/returns/details", icon: FiFileText },
      { key: "invoices", path: "/sales/invoices", icon: FiFileText },
    ],
  },
  {
    id: "purchases",
    icon: FiPackage,
    items: [
      { key: "purchases", path: "/purchases", icon: FiShoppingCart },
      { key: "purchaseDetails", path: "/purchases/details", icon: FiFileText },
      { key: "suppliers", path: "/purchases/suppliers", icon: FiTruck },
      { key: "purchasePayments", path: "/purchases/payments", icon: FiCreditCard },
    ],
  },
  {
    id: "contacts",
    icon: FiUsers,
    items: [
      { key: "customers", path: "/customers", icon: FiUser },
      { key: "employees", path: "/employees", icon: FiUsers },
    ],
  },
  {
    id: "finance",
    icon: FiDollarSign,
    items: [
      { key: "expenses", path: "/finance/expenses", icon: FiDollarSign },
      { key: "expenseCategories", path: "/finance/expense-categories", icon: FiLayers },
      { key: "payments", path: "/finance/payments", icon: FiCreditCard },
      { key: "currencies", path: "/finance/currencies", icon: FiGlobe },
      { key: "exchangeRates", path: "/finance/exchange-rates", icon: FiTrendingUp },
    ],
  },
  {
    id: "administration",
    icon: FiShield,
    items: [
      { key: "users", path: "/admin/users", icon: FiUsers },
      { key: "roles", path: "/admin/roles", icon: FiShield },
      { key: "permissions", path: "/admin/permissions", icon: FiKey },
      { key: "rolePermissions", path: "/admin/role-permissions", icon: FiClipboard },
      { key: "auditLogs", path: "/admin/audit-logs", icon: FiFileText },
    ],
  },
];
const Sidebar = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate()
  const [openGroups, setOpenGroups] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const language = i18n.language?.split("-")[0] || "en";
  const rtl = language !== "en";
  const text = translations[language] || translations.en;

  // Automatically open active menu
  useEffect(() => {
    const activeGroup = menuGroups.find((group) =>
      group.items.some((item) => item.path === location.pathname)
    );

    if (activeGroup) {
      setOpenGroups((prev) => ({
        ...prev,
        [activeGroup.id]: true,
      }));
    }
  }, [location.pathname]);

  // Close mobile sidebar after navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleGroup = (id) => {
    setOpenGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Main navigation style
  const navClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] transition-all duration-200 ${isActive
      ? "bg-teal-100 text-teal-900 font-semibold dark:bg-teal-900/40 dark:text-teal-200"
      : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
    };`

  // Dashboard and settings style
  const specialNavClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${isActive
      ? "bg-teal-100 text-teal-900 dark:bg-teal-900/40 dark:text-teal-200"
      : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
    };`
  return (
    <>
      {/* Mobile Toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label="Toggle sidebar"
        className={`md:hidden fixed top-4 z-[60] p-2 rounded-lg bg-slate-800 text-white shadow-md ${rtl ? "right-4" : "left-4"
          }`}
      >
        {mobileOpen ? <FiX size={19} /> : <FiMenu size={19} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        dir={rtl ? "rtl" : "ltr"}
        className={`fixed md:sticky top-0 z-50 md:z-auto h-dvh md:h-full min-h-0 w-56 max-w-[85vw] shrink-0 flex flex-col overflow-hidden border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-transform duration-300 ${rtl ? "right-0" : "left-0"
          } ${mobileOpen
            ? "translate-x-0"
            : rtl
              ? "translate-x-full md:translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
      >
        {/* Navigation */}
        <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 space-y-1">

          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            end
            className={specialNavClass}
          >
            <FiLayout size={17} />
            <span>{text.dashboard}</span>
          </NavLink>

          {/* Section Label */}
          <div className="pt-4 pb-2 px-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {text.menu}
            </p>
          </div>

          {/* Menu Groups */}
          {menuGroups.map((group) => {
            const GroupIcon = group.icon;
            const isOpen = !!openGroups[group.id];

            const isActive = group.items.some(
              (item) => item.path === location.pathname
            );

            return (
              <div key={group.id}>
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={isOpen}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${isActive
                    ? "text-slate-900 dark:text-white bg-slate-200/70 dark:bg-slate-800"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <GroupIcon size={17} className="shrink-0" />
                    <span className="truncate">{text[group.id]}</span>
                  </span>

                  <FiChevronDown
                    size={14}
                    className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {/* Submenu */}
                {isOpen && (
                  <div className="mt-1 space-y-0.5 px-2">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;

                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          end
                          className={navClass}
                        >
                          <ItemIcon size={15} className="shrink-0" />
                          <span className="truncate">{text[item.key]}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Fixed Bottom Actions */}
        <div className="shrink-0 p-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1">
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <FiSettings size={17} />
            <span>{text.settings}</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-100/70 dark:hover:bg-red-950/30 transition-all duration-200"
          >
            <FiLogOut size={17} />
            <span>{text.logout}</span>
          </button>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;