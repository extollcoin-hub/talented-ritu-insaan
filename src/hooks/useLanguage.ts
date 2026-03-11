import { useState, useCallback, useEffect } from 'react';

type Language = 'en' | 'hi';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  }, []);

  return { language, toggleLanguage };
}

export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'red'>('dark');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'red' : 'dark');
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('red-theme');
    } else {
      root.classList.add('red-theme');
      root.classList.remove('dark-theme');
    }
  }, [theme]);

  return { theme, toggleTheme };
}
