import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLang from "../locales/en/translation.json";
import frLang from "../locales/fr/translation.json";

// Function to detect if user is from Mauritius
const detectMauritiusUser = async (): Promise<boolean> => {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return false;

    // Check localStorage first for cached result
    const cachedResult = localStorage.getItem("isMauritiusUser");
    if (cachedResult !== null) {
      return JSON.parse(cachedResult);
    }

    // Use a free IP geolocation service
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) return false;

    const data = await response.json();
    const isMauritius = data.country_code === "MU";

    // Cache the result for 24 hours
    localStorage.setItem("isMauritiusUser", JSON.stringify(isMauritius));
    localStorage.setItem("ipDetectionTimestamp", Date.now().toString());

    return isMauritius;
  } catch (error) {
    console.warn("Failed to detect user location:", error);
    return false;
  }
};

// Function to get the appropriate language
const getInitialLanguage = async (): Promise<string> => {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return "en";

    // Check if we have a cached result that's less than 24 hours old
    const timestamp = localStorage.getItem("ipDetectionTimestamp");
    if (timestamp) {
      const age = Date.now() - parseInt(timestamp);
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (age < twentyFourHours) {
        const isMauritius = localStorage.getItem("isMauritiusUser") === "true";
        return isMauritius ? "en" : "en"; // Default to English for MU market
      }
    }

    // Detect user location
    const isMauritius = await detectMauritiusUser();
    return isMauritius ? "en" : "en"; // Default to English for MU market
  } catch (error) {
    console.warn("Failed to get initial language:", error);
    return "en"; // Default to English
  }
};

// Initialize i18n with dynamic language detection
const initializeI18n = async () => {
  const initialLanguage = await getInitialLanguage();

  i18n.use(initReactI18next).init({
    resources: {
      en: {
        translation: enLang,
      },
      fr: {
        translation: frLang,
      },
    },
    lng: initialLanguage,
    fallbackLng: "fr",

    interpolation: {
      escapeValue: false,
    },
  });
};

// Initialize immediately for SSR compatibility
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enLang,
    },
    fr: {
      translation: frLang,
    },
  },
  lng: "en", // Default to English for MU market
  fallbackLng: "fr",

  interpolation: {
    escapeValue: false,
  },
});

// Update language after detection (client-side only)
if (typeof window !== "undefined") {
  initializeI18n().catch(console.error);
}

export default i18n;
