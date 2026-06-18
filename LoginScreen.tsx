import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, User, ShieldCheck, HeartHandshake, Sparkles, Languages, Sun, Moon } from 'lucide-react';
import { translations } from '../translations';

interface LoginScreenProps {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onLogin: (name: string, email: string) => void;
}

export default function LoginScreen({ lang, setLang, theme, toggleTheme, onLogin }: LoginScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const t = translations[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(lang === 'ar' ? 'الرجاء إدخال الاسم بالكامل' : 'Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError(lang === 'ar' ? 'الرجاء إدخال بريد إلكتروني صالح' : 'Please enter a valid email address');
      return;
    }
    setError('');
    onLogin(name, email);
  };

  return (
    <div className={`min-h-screen bg-brand-bg flex flex-col justify-center items-center p-4 relative antialiased transition-colors duration-300 ${lang === 'ar' ? 'font-sans' : 'font-sans'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background elegant architectural layout lines */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full border border-primary-brand" />
        <div className="absolute bottom-10 right-10 w-[600px] h-[600px] rounded-full border border-brand-accent h-[1px]" />
      </div>

      {/* Floating Header Actions (Language & Theme toggle) */}
      <div className="absolute top-6 right-6 left-6 z-10 flex justify-between items-center">
        {/* Brand name */}
        <div className="flex items-center gap-1">
          <span className="text-primary-brand font-serif font-extrabold text-2xl">{lang === 'ar' ? 'بناء' : 'Benaa'}</span>
          <span className="text-[10px] text-brand-accent uppercase tracking-wider">{lang === 'ar' ? 'بوابة التأسيس' : 'Industrial'}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-card-bg border border-brand-outline text-brand-dark rounded-full text-xs font-semibold hover:border-primary-brand transition-all cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-brand-accent" />
            <span>{t.langToggle}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-card-bg border border-brand-outline text-brand-dark rounded-full hover:border-primary-brand transition-all cursor-pointer"
            title={theme === 'light' ? t.themeDark : t.themeLight}
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-primary-brand" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-card-bg border border-brand-outline p-8 rounded-[2rem] hard-shadow-brand z-10 relative"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-brand text-white flex items-center justify-center font-bold text-3xl font-serif rounded-2xl mx-auto mb-4 hard-shadow">
            B
          </div>
          <h2 className="text-2xl font-black font-serif text-brand-dark tracking-tight mb-2">
            {t.loginTitle}
          </h2>
          <p className="text-xs text-brand-accent font-semibold leading-relaxed">
            {t.loginDesc}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input */}
          <div>
            <label className="block text-[11px] font-bold text-brand-accent uppercase mb-1.5 text-start">
              {t.fullName}
            </label>
            <div className="relative flex items-center bg-card-accent-bg border border-brand-outline rounded-full p-1 focus-within:border-primary-brand transition-all">
              <span className={`p-2.5 text-brand-accent ${lang === 'ar' ? 'order-last' : 'order-first'}`}>
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder={lang === 'ar' ? 'مثال: عادل السامعي' : 'e.g. Adel Al-Samei'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full bg-transparent border-0 outline-none text-xs text-brand-dark px-2 h-10 font-semibold focus:ring-0 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-[11px] font-bold text-brand-accent uppercase mb-1.5 text-start">
              {t.emailAddress}
            </label>
            <div className="relative flex items-center bg-card-accent-bg border border-brand-outline rounded-full p-1 focus-within:border-primary-brand transition-all">
              <span className={`p-2.5 text-brand-accent ${lang === 'ar' ? 'order-last' : 'order-first'}`}>
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder={lang === 'ar' ? 'name@benaa.com' : 'name@benaa.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-xs text-brand-dark px-2 h-10 font-semibold focus:ring-0 text-left"
                required
              />
            </div>
          </div>

          {/* Connect button with luxurious styling */}
          <button
            type="submit"
            className="w-full h-12 bg-primary-brand text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t.submitLogin}</span>
          </button>
        </form>

        {/* Footer info/bypass link inside the login area */}
        <div className="text-center mt-6 pt-5 border-t border-brand-outline">
          <button
            type="button"
            onClick={() => onLogin(lang === 'ar' ? 'زائر معتمد' : 'Verified Guest', 'guest@benaa-industrial.com')}
            className="text-brand-accent hover:text-primary-brand text-[11px] font-bold transition-all cursor-pointer underline decoration-dotted"
          >
            {lang === 'ar' ? 'متابعة كزائر صناعي مؤقت (Guest)' : 'Continue as Temporary Guest'}
          </button>
        </div>
      </motion.div>

      {/* Safety and standards footer notes */}
      <div className="mt-8 text-center text-[10px] text-brand-accent font-semibold flex flex-col gap-1 z-10">
        <div className="flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-primary-brand" />
          <span>ISO 9001:2015 CERTIFIED INDUSTRIAL SYSTEM</span>
        </div>
        <div>
          {lang === 'ar' ? 'جميع الأسعار والتوريدات مطابقة لمواصفات ASTM & ACI' : 'All parameters & supply routes comply with ASTM & ACI criteria'}
        </div>
      </div>
    </div>
  );
}
