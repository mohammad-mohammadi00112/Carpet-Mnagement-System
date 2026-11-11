
import { useTranslation } from "react-i18next";
import { FiGlobe } from "react-icons/fi";

const Languages = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage || i18n.language;

  const handleLanguageChange = async (e) => {
    const language = e.target.value;

    await i18n.changeLanguage(language);

    const direction = language === "en" ? "ltr" : "rtl";

    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  };

  return (
  <div
    className="  flex items-center gap-2 px-3 py-2 rounded-xl  border border-slate-200 dark:border-slate-700  bg-white dark:bg-slate-800 shadow-sm  hover:border-blue-400 dark:hover:border-blue-500  transition-all duration-200 ">
    <FiGlobe className="text-blue-600 dark:text-blue-400 text-lg shrink-0" />
    <select
      value={currentLanguage}
      onChange={handleLanguageChange}
      aria-label="Select language"
      className="bg-transparent text-sm font-semibold  text-slate-700 dark:text-slate-100  outline-none border-none cursor-pointer  min-w-[90px]  focus:ring-0 ">
      <option className="bg-white text-slate-800" value="en">  English</option>
      <option className="bg-white text-slate-800" value="fa">  دری</option>
      <option className="bg-white text-slate-800" value="ps">  پښتو</option>
    </select>
  </div>
);
};

export default Languages;