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
// LANGUAGE PROVIDER
// ==========================================

export const LanguageProvider = ({
  children,
}) => {

  // ========================================
  // LANGUAGE STATE
  // ========================================

  const [language, setLanguage] =
    useState(() => {

      const savedLanguage =
        localStorage.getItem("language");

      if (
        savedLanguage === "en" ||
        savedLanguage === "km"
      ) {
        return savedLanguage;
      }

      return "en";
    });


  // ========================================
  // SAVE LANGUAGE
  // ========================================

  useEffect(() => {

    localStorage.setItem(
      "language",
      language
    );


    // HTML language
    document.documentElement.lang =
      language === "km"
        ? "km"
        : "en";


    // Optional class for Khmer font
    if (language === "km") {

      document.documentElement.classList.add(
        "lang-km"
      );

      document.documentElement.classList.remove(
        "lang-en"
      );

    } else {

      document.documentElement.classList.add(
        "lang-en"
      );

      document.documentElement.classList.remove(
        "lang-km"
      );

    }

  }, [language]);


  // ========================================
  // CHANGE LANGUAGE
  // ========================================

  const changeLanguage = (lang) => {

    if (
      lang !== "en" &&
      lang !== "km"
    ) {
      console.warn(
        `Unsupported language: ${lang}`
      );

      return;
    }

    setLanguage(lang);
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