import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext(undefined);

const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      "useLanguageContext must be used within a LanguageProvider"
    );
  }
  return context;
};

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("ID");
  const changeLanguage = () => {
    setLanguage(language === "EN" ? "ID" : "EN");
  };

  const value = {
    language,
    setLanguage,
    changeLanguage,
  };

  useEffect(() => {
    const setLocalLanguage = async () => {
      try {
        await AsyncStorage.setItem("lang", language);
      } catch (error) {}
    };
    setLocalLanguage();
  }, [language]);
  useEffect(() => {
    const getDataLang = async () => {
      try {
        const value = await AsyncStorage.getItem("lang");
        setLanguage(value || "ID");
      } catch (error) {}
    };
    getDataLang();
  }, []);
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export { useLanguageContext, LanguageProvider };
