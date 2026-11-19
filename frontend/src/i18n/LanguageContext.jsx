import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, AVAILABLE_LANGUAGES } from "./translations";
import { supabase } from "../supabaseClient";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem("eduspark_lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("eduspark_lang", currentLanguage);
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const changeLanguage = async (newLang) => {
    if (!translations[newLang]) return;
    setCurrentLanguage(newLang);
    localStorage.setItem("eduspark_lang", newLang);
    document.documentElement.lang = newLang;

    // Asynchronously synchronize with authenticated Supabase student_profile if logged in
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        await supabase
          .from("student_profiles")
          .update({ preferred_language: newLang })
          .eq("id", session.user.id);
      }
    } catch {
      // Offline or network error: localStorage retains preference locally
    }
  };

  const t = (key, fallback = "") => {
    const langDict = translations[currentLanguage] || translations.en;
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    const defaultDict = translations.en;
    if (defaultDict && defaultDict[key] !== undefined) {
      return defaultDict[key];
    }
    return fallback || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: AVAILABLE_LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
