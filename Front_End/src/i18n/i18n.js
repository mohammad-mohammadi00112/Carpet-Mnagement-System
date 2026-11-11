import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import fa from "./locales/fa.json";
import ps from "./locales/ps.json";

const savedLanguage = localStorage.getItem("language") || "en";

const setLanguageDirection = (language) => {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "en" ? "ltr" : "rtl";
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fa: { translation: fa },
    ps: { translation: ps },
  },
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

setLanguageDirection(savedLanguage);

i18n.on("languageChanged", (language) => {
  localStorage.setItem("language", language);
  setLanguageDirection(language);
});

export default i18n;