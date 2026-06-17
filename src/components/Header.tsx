import { Search, Construction, Bell, User, Menu, X, Languages, Sun, Moon, LogOut, CheckCircle2, Lock } from 'lucide-react';
import { useState } from 'react';
import { ActiveTab } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cartCount: number;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: { name: string; email: string } | null;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,

  cartCount,
  lang,
  setLang,
  theme,
  toggleTheme,
  user,
  onLogout,
  onOpenLogin
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const t = translations[lang];

  const mainNavItems: { label: string; value: ActiveTab }[] = [
    { label: t.tabMaterials, value: 'Materials' },
    { label: t.tabEngineers, value: 'Engineers' },
    { label: t.tabProjects, value: 'Projects' },
    { label: t.tabCalculators, value: 'Tools' }
  ];

  const handleProfileClick = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  return (
    <header className="bg-card-bg border-b border-brand-outline h-20 sticky top-0 z-50 transition-colors duration-300 font-sans">
      <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-[1440px] mx-auto h-full">
        {/* Brand logo container */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('Materials')}
            className="font-black text-2xl tracking-tight text-brand-dark flex items-center gap-2 hover:opacity-90 transition-all focus:outline-none cursor-pointer"
          >
            <span className="text-primary-brand font-serif font-extrabold text-3xl">{t.brandName}</span>
            <span className="text-[10px] text-brand-accent font-sans font-extrabold self-end pb-1.5 uppercase tracking-wider">{t.brandSub}</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-5">
            {mainNavItems.map((item) => {
              const isActive = activeTab === item.value || (item.value === 'Tools' && activeTab === 'Calculators');
              return (
                <button
                  key={item.value}
                  onClick={() => {
                    if (item.value === 'Tools') {
                      setActiveTab('Calculators');
                    } else {
                      setActiveTab(item.value);
                    }
                  }}
                  className={`relative font-bold py-1 text-xs md:text-sm transition-all duration-200 focus:outline-none cursor-pointer ${isActive
                    ? 'text-primary-brand font-bold border-b-2 border-primary-brand'
                    : 'text-brand-accent hover:text-primary-brand'
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Controls section */}
        <div className="flex items-center gap-2 md:gap-3.5">
          {/* Quick Search */}
          <div className="hidden xl:flex items-center bg-card-accent-bg border border-brand-outline px-4 py-1.5 gap-2 input-etched rounded-full focus-within:border-primary-brand focus-within:bg-card-bg transition-all">
            <Search className="text-brand-accent w-3.5 h-3.5" />
            <input
              type="text"
              className="bg-transparent border-none focus:ring-0 text-xs font-semibold outline-none w-36 text-brand-dark"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Languages Toggle CTA */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="p-2 bg-card-accent-bg hover:bg-brand-outline/20 border border-brand-outline text-brand-dark rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
            title={lang === 'ar' ? 'Switch to English' : 'تحويل لللغة العربية'}
          >
            <Languages className="w-4 h-4 text-primary-brand" />
            <span className="hidden sm:inline text-[11px] font-sans">{t.langToggle}</span>
          </button>

          {/* Theme Dynamic Selector */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-card-accent-bg hover:bg-brand-outline/20 border border-brand-outline text-brand-dark rounded-full transition-colors cursor-pointer"
            title={theme === 'light' ? t.themeDark : t.themeLight}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-primary-brand" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Quick Quote Service CTA */}
          <button
            onClick={() => alert(t.quoteDescAlert)}
            className="bg-primary-brand text-white hover:bg-opacity-90 font-bold px-4 py-2 text-xs tracking-wider active:scale-95 transition-all cursor-pointer rounded-full"
          >
            {t.quoteCTA}
          </button>

          {/* Utilities and Profile Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Quick calculations entry shortcut */}
            <button
              onClick={() => setActiveTab('Calculators')}
              title={t.tabCalculators}
              className={`p-2 hover:bg-brand-outline/10 transition-colors cursor-pointer rounded-full relative ${activeTab === 'Calculators' ? 'text-primary-brand bg-primary-brand-container' : 'text-brand-dark'
                }`}
            >
              <Construction className="w-4.5 h-4.5" />
            </button>

            {/* Notification indicators */}
            <button
              title={lang === 'ar' ? 'التنبيهات الإنشائية' : 'Site Notifications'}
              className="p-2 hover:bg-brand-outline/10 transition-colors cursor-pointer rounded-full relative text-brand-dark"
              onClick={() => alert(t.noAlerts)}
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-600 rounded-full"></span>
            </button>

            {/* User Profile Login State dropdown toggle */}
            <div className="relative">
              <button
                onClick={handleProfileClick}
                type="button"
                className={`p-2 hover:bg-brand-outline/15 rounded-full transition-all cursor-pointer relative flex items-center gap-1 border ${user ? 'border-primary-brand text-primary-brand' : 'border-brand-outline text-brand-accent'
                  }`}
              >
                <User className="w-4.5 h-4.5" />
                {user && (
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full absolute top-1 right-1" />
                )}
              </button>

              {/* Profile drop modal container */}
              {profileDropdownOpen && (
                <div
                  className={`absolute mt-3 w-64 bg-card-bg border border-brand-outline p-4 rounded-2xl shadow-xl z-50 text-start ${lang === 'ar' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
                    }`}
                >
                  {user ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-brand-accent uppercase font-bold tracking-wider">{t.welcomeBack}</p>
                        <h4 className="font-extrabold text-sm text-brand-dark flex items-center gap-1.5 mt-0.5">
                          {user.name}
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                        </h4>
                        <p className="text-[10px] font-semibold text-brand-accent truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="border-t border-brand-outline pt-2.5 flex flex-col gap-1.5">
                        <span className="text-[9px] text-[#8e8e7c] leading-snug">{t.verifiedContractor}</span>
                        <button
                          onClick={() => {
                            setActiveTab('Admin');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full mt-1.5 py-2 bg-amber-500/10 hover:bg-amber-500/15 text-amber-600 dark:text-amber-500 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-500" />
                          <span>{lang === 'ar' ? 'بوابة الإشراف والتحكم' : 'Admin Portal'}</span>
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          onLogout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full py-2 bg-red-500/10 hover:bg-red-500/15 text-red-600 text-[11px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t.logOut}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-brand-accent leading-relaxed">
                        {t.loginDesc}
                      </p>
                      <button
                        onClick={() => {
                          onOpenLogin();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full py-2 bg-primary-brand text-white text-xs font-bold rounded-xl transition-all hover:bg-opacity-95 cursor-pointer"
                      >
                        {t.logIn}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu and collapse slider */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-brand-outline/10 transition-colors md:hidden text-brand-dark cursor-pointer rounded-full"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile view sub container dynamic */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card-bg border-b border-brand-outline px-4 py-4 space-y-3 shadow-lg absolute left-0 right-0 top-20 z-40 transition-all">
          <div className="flex items-center bg-card-accent-bg border border-brand-outline px-4 py-2 gap-2 input-etched rounded-full mb-3">
            <Search className="text-brand-accent w-4 h-4" />
            <input
              type="text"
              className="bg-transparent border-none focus:ring-0 text-sm font-semibold outline-none w-full text-brand-dark"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            {mainNavItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  if (item.value === 'Tools') {
                    setActiveTab('Calculators');
                  } else {
                    setActiveTab(item.value);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-2 text-start rounded-xl font-bold text-xs transition-colors ${activeTab === item.value || (item.value === 'Tools' && activeTab === 'Calculators')
                  ? 'bg-primary-brand-container text-primary-brand font-extrabold border-l-4 border-primary-brand'
                  : 'text-brand-dark hover:bg-brand-outline/10'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
