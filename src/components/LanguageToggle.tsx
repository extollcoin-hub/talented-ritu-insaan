import { Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function LanguageToggle() {
  const { language, toggleLanguage } = useApp();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
    >
      <Globe size={16} />
      <span className="font-medium text-sm">
        {language === 'en' ? 'हिंदी' : 'English'}
      </span>
    </button>
  );
}
