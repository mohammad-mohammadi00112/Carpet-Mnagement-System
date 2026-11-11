import { useTranslation } from "react-i18next";

import MainHeader from "../header/MainHeader";
import Sidebar from "../main/Sidebar";
import MainContent from "../main/Maincontent";

const Home = () => {
  const { i18n } = useTranslation();

  const language = i18n.language?.split("-")[0] || "en";
  const rtl = ["fa", "ps"].includes(language);

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className="flex flex-col  w-full h-screen min-h-screen  overflow-hidden  bg-slate-50 dark:bg-slate-950  transition-colors duration-300 ">
      <MainHeader />

      <div
        dir={rtl ? "rtl" : "ltr"}
        className=" flex flex-1  min-h-0 min-w-0  overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
};

export default Home;