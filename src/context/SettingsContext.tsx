import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ThemeColor = "green" | "blue" | "purple";
type VoiceLanguage = "en-US" | "ar-SA" | "lg-UG";

interface Settings {
  arabicFontSize: number;
  translationFontSize: number;
  themeColor: ThemeColor;
  voiceLanguage: VoiceLanguage;
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  setThemeColor: (color: ThemeColor) => void;
  setVoiceLanguage: (lang: VoiceLanguage) => void;
}

const SettingsContext = createContext<Settings | undefined>(undefined);

const getInitialState = <T,>(key: string, defaultValue: T): T => {
  if (typeof window !== 'undefined') {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      try {
        return JSON.parse(storedValue);
      } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        return defaultValue;
      }
    }
  }
  return defaultValue;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [arabicFontSize, setArabicFontSize] = useState<number>(() => getInitialState("arabicFontSize", 32));
  const [translationFontSize, setTranslationFontSize] = useState<number>(() => getInitialState("translationFontSize", 16));
  const [themeColor, setThemeColor] = useState<ThemeColor>(() => getInitialState("themeColor", "green"));
  const [voiceLanguage, setVoiceLanguage] = useState<VoiceLanguage>(() => getInitialState("voiceLanguage", "en-US"));

  useEffect(() => {
    localStorage.setItem("arabicFontSize", JSON.stringify(arabicFontSize));
  }, [arabicFontSize]);

  useEffect(() => {
    localStorage.setItem("translationFontSize", JSON.stringify(translationFontSize));
  }, [translationFontSize]);

  useEffect(() => {
    localStorage.setItem("themeColor", JSON.stringify(themeColor));
    document.documentElement.setAttribute("data-theme-color", themeColor);
  }, [themeColor]);
  
  useEffect(() => {
    localStorage.setItem("voiceLanguage", JSON.stringify(voiceLanguage));
  }, [voiceLanguage]);

  // Set initial theme on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme-color", getInitialState("themeColor", "green"));
  }, []);

  return (
    <SettingsContext.Provider value={{
      arabicFontSize,
      translationFontSize,
      themeColor,
      voiceLanguage,
      setArabicFontSize,
      setTranslationFontSize,
      setThemeColor,
      setVoiceLanguage
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): Settings => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};