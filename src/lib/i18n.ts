import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLang from "../locales/en/translation.json";
import frLang from "../locales/fr/translation.json";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: enLang,
        },
        fr: {
            translation: frLang,
        },
    },
    lng: "fr",
    fallbackLng: "en",

    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
