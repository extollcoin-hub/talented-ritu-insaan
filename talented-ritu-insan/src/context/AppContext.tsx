import { createContext, useContext, type ReactNode } from 'react';
import { useLanguage, useTheme } from '../hooks/useLanguage';
import { translations, type TranslationKey } from '../lib/translations';

interface AppContextType {
  language: 'en' | 'hi';
  toggleLanguage: () => void;
  theme: 'dark' | 'red';
  toggleTheme: () => void;
  t: TranslationKey;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const t = translations[language];

  return (
    <AppContext.Provider value={{ language, toggleLanguage, theme, toggleTheme, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
