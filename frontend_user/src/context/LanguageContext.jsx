import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import en from "../locales/en";
import km from "../locales/km";


// ==========================================
// LANGUAGE CONTEXT
// ==========================================

const LanguageContext = createContext(null);


// ==========================================
// TRANSLATIONS
// ==========================================

const translations = {
  en,
  km,
};


// ==========================================
// GET NESTED TRANSLATION
// ==========================================

const getTranslation = (source, key) => {
  const keys = key.split(".");

  let result = source;

  for (const item of keys) {
    if (
      result === null ||
      result === undefined ||
      result[item] === undefined
    ) {
      return undefined;
    }

    result = result[item];
  }

  return result;
};


// ==========================================
// BACKEND LANGUAGE API HELPERS
// ==========================================

const BACKEND_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const fetchLanguageFromBackend = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/language/`);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.language || null;
  } catch {
    return null;
  }
};

const pushLanguageToBackend = async (lang) => {
  try {
    await fetch(`${BACKEND_URL}/api/language/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: lang }),
    });
  } catch {
    // ignore network error
  }
};

export const LanguageProvider = ({
  children,
}) => {

  // ========================================
  // LANGUAGE STATE
  // ========================================

  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("language") || localStorage.getItem("admin_language");
    if (savedLanguage === "en" || savedLanguage === "km") {
      return savedLanguage;
    }
    return "km"; // default Khmer
  });

  // ========================================
  // SAVE LANGUAGE LOCALLY
  // ========================================

  useEffect(() => {
    localStorage.setItem("language", language);
    localStorage.setItem("admin_language", language);

    // HTML language
    document.documentElement.lang = language === "km" ? "km" : "en";

    // Font class
    if (language === "km") {
      document.documentElement.classList.add("lang-km");
      document.documentElement.classList.remove("lang-en");
    } else {
      document.documentElement.classList.add("lang-en");
      document.documentElement.classList.remove("lang-km");
    }
  }, [language]);

  // ========================================
  // BACKEND POLLING — sync every 2 seconds
  // ========================================

  useEffect(() => {
    const poll = async () => {
      const backendLang = await fetchLanguageFromBackend();
      if ((backendLang === "en" || backendLang === "km") && backendLang !== language) {
        setLanguage(backendLang);
        localStorage.setItem("language", backendLang);
        localStorage.setItem("admin_language", backendLang);
      }
    };

    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [language]);

  // ========================================
  // CHANGE LANGUAGE
  // ========================================

  const changeLanguage = (lang) => {
    if (lang !== "en" && lang !== "km") {
      console.warn(`Unsupported language: ${lang}`);
      return;
    }

    setLanguage(lang);
    localStorage.setItem("language", lang);
    localStorage.setItem("admin_language", lang);
    pushLanguageToBackend(lang);
  };


  // ========================================
  // TRANSLATE
  // ========================================

  const t = (key) => {

    if (!key) {
      return "";
    }


    // Current language
    const currentTranslation =
      getTranslation(
        translations[language],
        key
      );


    if (
      currentTranslation !== undefined
    ) {
      return currentTranslation;
    }


    // ======================================
    // FALLBACK TO ENGLISH
    // ======================================

    const englishTranslation =
      getTranslation(
        translations.en,
        key
      );


    if (
      englishTranslation !== undefined
    ) {

      console.warn(
        `Missing "${key}" in ${language}. Using English fallback.`
      );

      return englishTranslation;
    }


    // ======================================
    // KEY DOES NOT EXIST
    // ======================================

    console.warn(
      `Translation key not found: ${key}`
    );

    return key;
  };


  // ========================================
  // CONTEXT VALUE
  // ========================================

  const value = {
    language,
    changeLanguage,
    setLanguage,
    t,

    isKhmer:
      language === "km",

    isEnglish:
      language === "en",
  };


  // ========================================
  // PROVIDER
  // ========================================

  return (
    <LanguageContext.Provider
      value={value}
    >
      {children}
    </LanguageContext.Provider>
  );
};


// ==========================================
// LANGUAGE HOOK
// ==========================================

export const useLanguage = () => {

  const context =
    useContext(LanguageContext);


  if (!context) {

    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );

  }


  return context;
};


// ==========================================
// EXPORT
// ==========================================

export default LanguageContext;