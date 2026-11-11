
import DarkLight from "./DarkLight";
import Languages from "./Languages";
import { useAuth } from "../../context/Authcontext";
import { FiBell, FiUser } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const MainHeader = () => {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language !== "en";
  const { user } = useAuth();
  // Temporary user information
  <div className="hidden sm:block">
    <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
      {user?.username || "User"}
    </h2>

    <p className="text-xs text-gray-500 dark:text-gray-400">
      {user?.role_name || "User"}
    </p>
  </div>

  return (
    <header
      dir={isRTL ? "rtl" : "ltr"}
      className="flex h-16 w-full items-center justify-between
      border-b border-gray-200 bg-white px-4 sm:px-6
      dark:border-[#334155] dark:bg-[#0F172A]
      transition-colors duration-300"
    >
      {/* Left Side */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center
          rounded-xl bg-[#14B8A6]/10 text-[#14B8A6]">
          <FiUser size={20} />
        </div>

        <div className="hidden sm:block">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
            {user?.name || "User"}
          </h2>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.role || "Role"}
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
          {t("welcome")}
        </span>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center
          rounded-xl text-gray-600 hover:bg-gray-100
          dark:text-gray-300 dark:hover:bg-[#1E293B]
          transition-all"
          aria-label="Notifications"
        >
          <FiBell size={20} />
        </button>

        <Languages />
        <DarkLight />
      </div>
    </header>
  );
};

export default MainHeader;