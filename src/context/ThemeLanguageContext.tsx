import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';
export type LanguageCode = 'fr' | 'en';

interface ThemeLanguageContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  toggleLang: () => void;
  t: (fr: string, en: string) => string;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextValue>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
  lang: 'fr',
  setLang: () => {},
  toggleLang: () => {},
  t: (fr) => fr
});

const THEME_STORAGE_KEY = 'tomy_creator_theme_mode_v1';
const LANG_STORAGE_KEY = 'tomy_creator_lang_code_v1';

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore
    }
    return 'dark';
  });

  const [lang, setLangState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'fr' || saved === 'en') return saved;
    } catch {
      // ignore
    }
    return 'fr';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const setTheme = (newTheme: ThemeMode) => setThemeState(newTheme);
  const toggleTheme = () =>
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const setLang = (newLang: LanguageCode) => setLangState(newLang);
  const toggleLang = () =>
    setLangState((prev) => (prev === 'fr' ? 'en' : 'fr'));

  const t = (fr: string, en: string) => (lang === 'en' ? en : fr);

  return (
    <ThemeLanguageContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        lang,
        setLang,
        toggleLang,
        t
      }}
    >
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => useContext(ThemeLanguageContext);
