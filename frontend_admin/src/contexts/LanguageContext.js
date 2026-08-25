import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import en from "../locales/en";
import km from "../locales/km";

const LanguageContext = createContext();

const translations = {
  en,
  km,
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("admin_language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("admin_language", language);

    document.documentElement.lang =
      language === "km" ? "km" : "en";
  }, [language]);

  const changeLanguage = (lang) => {
    if (lang === "en" || lang === "km") {
      setLanguage(lang);
    }
  };

  const t = (key) => {
    const keys = key.split(".");

    let result = translations[language];

    for (const item of keys) {
      if (result?.[item] === undefined) {
        return key;
      }

      result = result[item];
    }

    return result;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
};

export default LanguageContext;