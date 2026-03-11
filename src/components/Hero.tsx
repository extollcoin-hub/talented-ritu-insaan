import { Award, Users, BookOpen, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Hero() {
  const { t, language } = useApp();

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/50 rounded-full px-4 py-2 mb-6">
            <Award className="w-5 h-5 text-red-500" />
            <span className="text-red-400 text-sm font-medium">
              {language === 'en' ? '🏆 AWARD WINNING INSTITUTE' : '🏆 अवॉर्ड विनिंग इंस्टीट्यूट'}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Talented Ritu Insan
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            {t.hero.title}
          </p>

          <p className="text-lg text-gray-400 mb-8">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-4 py-3">
              <Users className="w-5 h-5 text-red-500" />
              <span className="text-white font-semibold">{t.hero.stats.students}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-4 py-3">
              <Calendar className="w-5 h-5 text-red-500" />
              <span className="text-white font-semibold">{t.hero.stats.years}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-4 py-3">
              <BookOpen className="w-5 h-5 text-red-500" />
              <span className="text-white font-semibold">{t.hero.stats.courses}</span>
            </div>
          </div>

          <a
            href="/courses"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 animate-pulse-glow"
          >
            {t.hero.cta}
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
