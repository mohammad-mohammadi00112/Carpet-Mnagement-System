
import { useTranslation } from "react-i18next";
import { FiGlobe, FiChevronDown } from "react-icons/fi";

const Languages = () => {
  const { i18n } = useTranslation();

  const currentLanguage =
    i18n.resolvedLanguage || i18n.language || "en";

  const handleLanguageChange = async (e) => {
    const language = e.target.value;

    await i18n.changeLanguage(language);

    const direction = language === "en" ? "ltr" : "rtl";

    document.documentElement.dir = direction;
    document.documentElement.lang = language;

    localStorage.setItem("language", language);
  };

  return (
    <div
      className="
        relative flex items-center gap-2
        px-3 py-2.5
        rounded-xl
        border border-slate-200 dark:border-slate-700
        bg-white dark:bg-slate-800
        shadow-sm
        hover:border-teal-500 dark:hover:border-teal-500
        hover:shadow-md
        transition-all duration-200
      "
    >
      <FiGlobe
        size={19}
        className="text-teal-600 dark:text-teal-400 shrink-0"
      />

      <select
        value={currentLanguage}
        onChange={handleLanguageChange}
        aria-label="Select language"
        className="
          appearance-none
          bg-transparent
          text-sm font-semibold
          text-slate-700 dark:text-slate-100
          outline-none border-none
          cursor-pointer
          min-w-[85px]
          pr-5
          focus:ring-0
        "
      >
        <option
          value="en"
          className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white"
        >
          English
        </option>

        <option
          value="fa"
          className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white"
        >
          دری
        </option>

        <option
          value="ps"
          className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white"
        >
          پښتو
        </option>
      </select>

      <FiChevronDown
        size={15}
        className="
          absolute right-3
          text-slate-400 dark:text-slate-400
          pointer-events-none
        "
      />
    </div>
  );
};

export default Languages;
