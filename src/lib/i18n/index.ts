import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./en";
import { hi } from "./hi";

const saved = typeof window !== "undefined" ? localStorage.getItem("site_lang") : null;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: saved || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export function setLang(lang: "en" | "hi") {
  localStorage.setItem("site_lang", lang);
  i18n.changeLanguage(lang);
}

export default i18n;
