import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import common_en from "./translations/en/common.json";
import common_ru from "./translations/ru/common.json";

const resources = {
  en: {
    common: common_en,
  },
  ru: {
    common: common_ru,
  },
};

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    debug: true,
    lng: localStorage.getItem("i18nextLng") || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });
