import { useState, useEffect } from 'react';
import { ActiveTab, CartItem, MaterialItem, API_BASE_URL } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MaterialsMarketplace from './components/MaterialsMarketplace';
import QuantityCalculator from './components/QuantityCalculator';
import Footer from './components/Footer';
import AIHelperModal from './components/AIHelperModal';
import LoginScreen from './components/LoginScreen';
import AdminPanel from './components/AdminPanel';
import { translations } from './translations';
import {
  FileText,
  Map,
  HardHat,
  ShieldCheck,
  LifeBuoy,
  Phone,
  HelpCircle,
  FileCheck2,
  Wrench,
  Clock,
  Sparkles,
  Award,
  MessageSquare,
  PhoneCall,
  Send,
  X,
  Plus,
  Trash2,
  Briefcase,
  Layers,
  MapPin,
  Activity,
  Building2,
  CheckSquare,
  Calculator
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  useEffect(() => {
    console.log("Benaa Front-End API Base URL configured to:", API_BASE_URL);

    const fetchDbProducts = () => {
      fetch(`${API_BASE_URL}/get_products.php`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Network response not ok');
        })
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((p: any) => ({
              id: p.id,
              nameAr: p.nameAr,
              nameEn: p.nameEn,
              category: p.category,
              price: parseFloat(p.price),
              stock: parseInt(p.stock),
              unitAr: p.unit_ar || p.unitAr || 'وحدة',
              unitEn: p.unit_en || p.unitEn || 'Unit',
              supplier: p.supplier,
              image: p.image || p.image_url
            }));
            localStorage.setItem('benaa_catalogue_materials', JSON.stringify(mapped));
            window.dispatchEvent(new Event('storage'));
          }
        })
        .catch(err => console.error("Error fetching db products:", err));
    };

    fetchDbProducts();
    const interval = setInterval(fetchDbProducts, 4000);
    return () => clearInterval(interval);
  }, []);

  // 1. Language preference with persistence
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    const saved = localStorage.getItem('benaa_lang');
    return (saved === 'en' || saved === 'ar') ? saved : 'ar';
  });

  // 2. Theme preference with persistence and HTML class update
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('benaa_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  // 3. Authenticated session with persistenceالتحقق من جلسة المستخدم (هل قام بتسجيل الدخول أم لا)
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(() => {
    const saved = localStorage.getItem('benaa_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  //•	activeTab: متغير يحدد الصفحة النشطة حالياً، والقيمة الافتراضية هي متجر المواد 'Materials'.
  //•	cart: مصفوفة تخزن المواد المضافة للسلة
  const [activeTab, setActiveTab] = useState<ActiveTab>('Materials');
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('benaa_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // Fallback to default mockup items if no cache exists
      }
    }
    return [
      {
        material: {
          id: 'mat_cem_1',
          name: 'Portland Cement OPC 53 Grade',
          category: 'Cement',
          supplier: 'Holcim Industrial',
          rating: 4.8,
          price: 12.50,
          unit: 'Bag (50kg)',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX1lBwxECzjLUO-AxhDxcpsMOc_4ie8Hhj3cDBLjV-P9t_p8Ni19pI91UGDi2C4W74VHSudLXWuvnj7LAZUC_I0k1XOEaqpTgKBiG0LlPiI-wrq-1oZAcsk1GCmP8JiG0ySEYV6GZoYsrm5zQ3QiXTaVR21XtVkeVhzpUbITO0tz5iey_l0qimly47serBz4Ld-tJW200yYyEfVcDqzK-0EYVUHh6qye3vB6FcN1zBaofoEIDf59P3v3Bou8vC4qPW6oSjRuTK0xw',
          verified: true
        },
        quantity: 2
      },
      {
        material: {
          id: 'mat_steel_1',
          name: 'Fe500D TMT Reinforcement Bars',
          category: 'Steel',
          supplier: 'ArcelorMittal',
          rating: 4.9,
          price: 850.00,
          unit: 'Metric Ton',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDe4JPOtfEKckBQEr5I4UkTP3oJDR1GFkDZWF1SvM5JQLNvJHDPQmaW1EJaoZGyFGVFHxR1xfsvdhbrr_69qcJ2i-CJcqcWvjaDeI3uasjSx8URS9vXcGNeC0IZThj4KOTuNDqr_VKSfWO1OxRuPTPxDNhmI4h3szXUoDnUfuwUgLTM3ND43U8CxMdPhDEW73cuFRx-cyCkqzNBnUgdaUqzh-ZNZoPXtjvK1lVfCM93pncrFUt77e-uLWQdDdm78s-grtQ9kHdaT4',
          topRated: true
        },
        quantity: 1
      }
    ];
  });

  const [aiHelperOpen, setAiHelperOpen] = useState(false);

  // Consultation Modal States
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<string>('eng-1');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [consultationType, setConsultationType] = useState('mix');
  const [consultationNotes, setConsultationNotes] = useState('');
  const [isSubmittingConsult, setIsSubmittingConsult] = useState(false);
  const [isConsultSuccess, setIsConsultSuccess] = useState(false);

  // Dynamic engineers list state pulling from the central dashboard engine
  const [engineersList, setEngineersList] = useState<any[]>(() => {
    const saved = localStorage.getItem('benaa_consultants');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { }
    }
    return [
      {
        id: 'eng-1',
        name: 'م. عادل علي السامعي',
        titleAr: 'مستشار ومهندس إنشائي معتمد - 14 سنة خبرة',
        titleEn: 'Senior Certified Structural Engineer - 14 Yrs Exp',
        email: 'adel.samei@benaa-industrial.com',
        phone: '+967 772 110 330',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'eng-2',
        name: 'م. عمار بن محمد الشيباني',
        titleAr: 'مهندس حسابات إنشائية ومسح كميات جيوكيميائية',
        titleEn: 'Civil & Quantity Surveying Specialist',
        email: 'ammar.shaibani@benaa-industrial.com',
        phone: '+967 733 440 550',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'eng-3',
        name: 'م. بلقيس صالح الحمادي',
        titleAr: 'أخصائية تصميم معماري وتدقيق سلامة المواقع',
        titleEn: 'Architectural Safety & QA Design Consultant',
        email: 'belqis.hamadi@benaa-industrial.com',
        phone: '+967 711 556 778',
        status: 'Inactive',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      }
    ];
  });

  // Keep engineers synced from localStorage
  useEffect(() => {
    const syncEngineers = () => {
      const saved = localStorage.getItem('benaa_consultants');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setEngineersList(parsed);
          }
        } catch (e) { }
      }
    };
    window.addEventListener('storage', syncEngineers);
    const interval = setInterval(syncEngineers, 1500);
    return () => {
      window.removeEventListener('storage', syncEngineers);
      clearInterval(interval);
    };
  }, []);

  const currentSelectedEngineer = engineersList.find(e => e.id === selectedConsultant) || engineersList[0] || {
    id: 'eng-1',
    name: 'م. عادل علي السامعي',
    titleAr: 'مستشار ومهندس إنشائي معتمد - 14 سنة خبرة',
    titleEn: 'Senior Certified Structural Engineer - 14 Yrs Exp',
    email: 'adel.samei@benaa-industrial.com',
    phone: '+967 772 110 330',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  };

  // Projects Management System States
  const [projectsList, setProjectsList] = useState<any[]>(() => {
    const saved = localStorage.getItem('benaa_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { }
    }
    return [
      {
        id: 'proj_default_1',
        name: lang === 'ar' ? 'فيلّا حي الياسمين السكنية' : 'Al-Yasmeen Residential Villa',
        type: 'residential',
        city: lang === 'ar' ? 'الرياض' : 'Riyadh',
        area: 320,
        concreteRequired: 42.50,
        steelRequired: 14.4,
        status: 'pouring', // planning, excavating, pouring, structure, finishing
        notes: lang === 'ar' ? 'الخرسانة الإنشائية المقاومة للأملاح والكبريتات لصب الأساسات.' : 'Sulphate-resistant concrete for foundation pouring phase.'
      }
    ];
  });

  const [isAddProjOpen, setIsAddProjOpen] = useState(false);
  const [pName, setPName] = useState('');
  const [pType, setPType] = useState('residential');
  const [pCity, setPCity] = useState('');
  const [pArea, setPArea] = useState<number>(200);
  const [pStatus, setPStatus] = useState('planning');
  const [pNotes, setPNotes] = useState('');
  const [isSubmittingProj, setIsSubmittingProj] = useState(false);

  const t = translations[lang];

  // Apply theme class bind
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('benaa_theme', theme);
  }, [theme]);

  // Persist language setting
  useEffect(() => {
    localStorage.setItem('benaa_lang', lang);
  }, [lang]);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('benaa_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist projects list
  useEffect(() => {
    localStorage.setItem('benaa_projects', JSON.stringify(projectsList));
  }, [projectsList]);

  // Scroll to top on active tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Toggle helpers
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (name: string, email: string) => {
    const user = { name, email };
    setCurrentUser(user);
    localStorage.setItem('benaa_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('benaa_user');
  };

  // Cart operations
  const handleAddToCart = (material: MaterialItem, quantity: number) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.material.id === material.id);
      if (existing) {
        return prevCart.map((item) =>
          item.material.id === material.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { material, quantity }];
    });
  };

  const handleUpdateCartQty = (materialId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.material.id === materialId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (materialId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.material.id !== materialId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleQuickAddRecommended = (material: MaterialItem, quantity: number) => {
    handleAddToCart(material, quantity);
  };

  // If user is not logged in, prompt Login Screen
  if (!currentUser) {
    return (
      <LoginScreen
        lang={lang}
        setLang={setLang}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="bg-brand-bg text-brand-dark min-h-screen flex flex-col font-sans selection:bg-primary-brand/20 selection:text-brand-dark overflow-x-hidden transition-colors duration-300">
      {/* Dynamic Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, item) => sum + (item.quantity > 0 ? 1 : 0), 0)}
        lang={lang}
        setLang={setLang}
        theme={theme}
        toggleTheme={toggleTheme}
        user={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => { }}
      />

      {/* Main Container structure layout with reactive sidebar */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto relative px-0" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAiHelper={() => setAiHelperOpen(true)}
          lang={lang}
          user={currentUser}
        />

        {/* Core dynamic body switches based on selected tab */}
        <div className="flex-1 min-h-[calc(100vh-80px)] bg-brand-bg transition-colors duration-300">
          {activeTab === 'Materials' && (
            <MaterialsMarketplace
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onRemoveFromCart={handleRemoveFromCart}
              onClearCart={handleClearCart}
              onSetCalculatedLoad={(weight) => console.log('Weight set: ', weight)}
              lang={lang}
              user={currentUser}
            />
          )}

          {activeTab === 'Calculators' && (
            <QuantityCalculator
              onQuickAddRecommended={handleQuickAddRecommended}
              lang={lang}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'Engineers' && (
            <div className="p-6 md:p-8 max-w-4xl mx-auto text-start">
              <div className="bg-card-bg border border-brand-outline shadow-sm p-8 rounded-3xl text-start">
                <div className={`flex items-center gap-3 mb-6 border-b pb-4 border-brand-outline ${lang === 'ar' ? 'flex-row' : 'flex-row'}`}>
                  <Award className="text-primary-brand w-8 h-8 shrink-0" />
                  <h2 className="text-2xl font-bold font-serif text-brand-dark">{t.engPortalTitle}</h2>
                </div>
                <p className="text-brand-accent font-semibold mb-6 text-xs md:text-sm leading-relaxed">
                  {t.engPortalDesc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {engineersList.map((eng) => (
                    <div key={eng.id} className="border border-brand-outline hover:border-primary-brand bg-card-accent-bg p-6 rounded-2xl duration-300 text-start flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`inline-block text-[10px] font-bold px-3 py-1 rounded-full ${eng.status === 'Active'
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                              : 'bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300'
                            }`}>
                            {eng.status === 'Active'
                              ? (lang === 'ar' ? 'متاح للاستشارة بقوة الميدان' : 'Active Duty')
                              : (lang === 'ar' ? 'غير نشط حالياً' : 'Offline / Intermittent')
                            }
                          </span>
                          {eng.avatar && (
                            <img referrerPolicy="no-referrer" src={eng.avatar} className="w-10 h-10 rounded-full object-cover border border-brand-outline shadow-sm shrink-0" />
                          )}
                        </div>
                        <h4 className="font-extrabold text-base mb-1 text-brand-dark">{eng.name}</h4>
                        <p className="text-xs text-brand-accent mb-4 leading-relaxed font-semibold">
                          {lang === 'ar' ? eng.titleAr : eng.titleEn}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedConsultant(eng.id);
                          setIsConsultSuccess(false);
                          setClientPhone('');
                          setClientCity('');
                          setConsultationNotes('');
                          setIsConsultModalOpen(true);
                        }}
                        disabled={eng.status !== 'Active'}
                        className={`mt-2 w-full flex items-center justify-center gap-2 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer ${eng.status === 'Active'
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800'
                            : 'bg-stone-300 dark:bg-stone-800 cursor-not-allowed opacity-50'
                          }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{lang === 'ar' ? 'طلب استشارة ومطابقة الخلطة' : 'Schedule consultations call'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Projects' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto text-start space-y-6">

              {/* Dynamic Header */}
              <div className="bg-card-bg border border-brand-outline shadow-sm p-6 md:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <FileCheck2 className="text-primary-brand w-7 h-7 shrink-0" />
                    <h2 className="text-xl md:text-2xl font-bold font-serif text-brand-dark">{t.projActiveTitle}</h2>
                  </div>
                  <p className="text-brand-accent font-semibold text-xs md:text-sm leading-relaxed">
                    {t.projActiveDesc}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setPName('');
                    setPType('residential');
                    setPCity('');
                    setPArea(220);
                    setPStatus('planning');
                    setPNotes('');
                    setIsAddProjOpen(true);
                  }}
                  className="shrink-0 flex items-center justify-center gap-2 bg-primary-brand hover:bg-opacity-95 text-white active:scale-95 px-6 py-3 font-bold text-xs uppercase rounded-full cursor-pointer shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.projAddBtn}</span>
                </button>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card-bg border border-brand-outline p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
                  <div className="w-10 h-10 bg-primary-brand/10 text-primary-brand rounded-full flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-accent font-semibold uppercase tracking-wider">
                      {lang === 'ar' ? 'المواقع المسجلة نشطة' : 'Enrolled Construction Locations'}
                    </p>
                    <p className="text-lg font-black text-brand-dark font-mono">
                      {projectsList.length} <span className="text-[11px] text-brand-accent font-sans">{lang === 'ar' ? 'مشاريع' : 'Sites'}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-card-bg border border-brand-outline p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
                  <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-accent font-semibold uppercase tracking-wider">
                      {lang === 'ar' ? 'إجمالي طلب خرسانة الصب المصنفة' : 'Accumulated Concrete Volume'}
                    </p>
                    <p className="text-lg font-black text-brand-dark font-mono text-amber-600">
                      {projectsList.reduce((sum, p) => sum + (p.concreteRequired || 0), 0).toFixed(2)} <span className="text-[11px] text-brand-accent font-sans">{lang === 'ar' ? 'متر مكعب' : 'm³'}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-card-bg border border-brand-outline p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
                  <div className="w-10 h-10 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-accent font-semibold uppercase tracking-wider">
                      {lang === 'ar' ? 'تقدير حديد التسليح الكلي' : 'Total Structural Steel'}
                    </p>
                    <p className="text-lg font-black text-brand-dark font-mono text-blue-600">
                      {projectsList.reduce((sum, p) => sum + (p.steelRequired || 0), 0).toFixed(2)} <span className="text-[11px] text-brand-accent font-sans">{lang === 'ar' ? 'طن' : 'Tons'}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Projects List Section */}
              <div className="space-y-4">
                {projectsList.length === 0 ? (
                  <div className="border bg-card-bg border-brand-outline rounded-3xl p-12 text-center">
                    <Briefcase className="w-12 h-12 text-brand-accent/50 mx-auto mb-3" />
                    <h4 className="font-extrabold text-brand-dark text-sm">
                      {lang === 'ar' ? 'قائمة المشاريع فارغة حالياً' : 'Your construction portfolio is currently empty'}
                    </h4>
                    <p className="text-xs text-brand-accent max-w-sm mx-auto mt-1 leading-relaxed font-semibold">
                      {lang === 'ar'
                        ? 'يرجى تسجيل مواقع تشييد جديدة ومطابقة كميات الصب ومستويات التشطيب وحسابها على الفور.'
                        : 'Enroll your residential or commercial site to track material pools and project lifecycle.'}
                    </p>
                    <button
                      onClick={() => {
                        setPName('');
                        setPType('residential');
                        setPCity('');
                        setPArea(220);
                        setPStatus('planning');
                        setPNotes('');
                        setIsAddProjOpen(true);
                      }}
                      className="mt-4 bg-brand-dark text-white px-5 py-2 rounded-full font-bold text-xs hover:bg-opacity-90 transition-all cursor-pointer"
                    >
                      {lang === 'ar' ? 'سجل أول مشروع تشييد الآن' : 'Enroll First Project Location'}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5">
                    {projectsList.map((proj) => {
                      const estimatedConcrete = proj.concreteRequired || (proj.area * 0.15);
                      const estimatedSteel = proj.steelRequired || (proj.area * 0.045);
                      return (
                        <div
                          key={proj.id}
                          className="bg-card-bg border border-brand-outline rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                        >
                          {/* Card Header */}
                          <div className="flex justify-between items-start gap-3">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-extrabold text-[15px] md:text-base text-brand-dark leading-snug">
                                  {proj.name}
                                </h3>
                                <span className="bg-primary-brand-container text-primary-brand text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                                  {proj.type === 'residential' ? (lang === 'ar' ? 'سكني 🏠' : 'Residential 🏠') :
                                    proj.type === 'commercial' ? (lang === 'ar' ? 'تجاري 🏢' : 'Commercial 🏢') :
                                      proj.type === 'industrial' ? (lang === 'ar' ? 'صناعي 🏭' : 'Industrial 🏭') :
                                        (lang === 'ar' ? 'بنية تحتية 🛣️' : 'Infrastructure 🛣️')}
                                </span>
                              </div>
                              <div className="flex items-center gap-3.5 text-brand-accent text-[11px] font-semibold">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {proj.city}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Layers className="w-3.5 h-3.5" />
                                  {proj.area} {lang === 'ar' ? 'متر مربع' : 'm²'}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                if (confirm(lang === 'ar' ? 'هل أنت متأكد من حذف موقع التشييد بالكامل؟' : 'Are you sure you want to remove this project?')) {
                                  setProjectsList(prev => prev.filter(p => p.id !== proj.id));
                                }
                              }}
                              className="p-2 rounded-full hover:bg-red-50 text-brand-accent hover:text-red-500 transition-all cursor-pointer"
                              title={lang === 'ar' ? 'حذف الموقع' : 'Remove Site'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Quantities Overview */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-card-accent-bg border border-brand-outline rounded-2xl p-4 text-xs font-semibold">
                            <div className="space-y-1">
                              <p className="text-brand-accent text-[10px] uppercase font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                {lang === 'ar' ? 'الخرسانة المتوقعة للصب:' : 'Estimated Pour Concrete:'}
                              </p>
                              <p className="text-[13px] font-bold text-brand-dark">
                                {estimatedConcrete.toFixed(2)} <span className="text-[10px] text-brand-accent">متر مكعب (m³)</span>
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-brand-accent text-[10px] uppercase font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                {lang === 'ar' ? 'فولاذ حديد التسليح المقدر:' : 'Estimated Structural Steel:'}
                              </p>
                              <p className="text-[13px] font-bold text-brand-dark">
                                {estimatedSteel.toFixed(2)} <span className="text-[10px] text-brand-accent">طن (Tons)</span>
                              </p>
                            </div>

                            <div className="sm:col-span-2 pt-2 border-t border-brand-outline flex flex-wrap gap-2 items-center justify-between">
                              <p className="text-[10.5px] italic text-brand-accent">
                                {lang === 'ar' ? 'ملاحظة:' : 'Note:'} {proj.notes || (lang === 'ar' ? 'لا توجد ملاحظات إضافية للمهندس.' : 'No special structural notes added.')}
                              </p>
                              <button
                                onClick={() => {
                                  // Sync with Benaa Quantity Calculator by setting activeTab to Calculators
                                  setActiveTab('Calculators');
                                }}
                                className="flex items-center gap-1 text-primary-brand hover:underline font-bold text-[10.5px] cursor-pointer"
                              >
                                <Calculator className="w-3.5 h-3.5" />
                                {lang === 'ar' ? 'تصدير كمواد إلى الحاسبة الذكية ➔' : 'Export to Smart Calculators ➔'}
                              </button>
                            </div>
                          </div>

                          {/* Interative Milestone Lifecycle Tracker */}
                          <div className="space-y-2.5 pt-2">
                            <p className="text-[10.5px] font-extrabold uppercase text-brand-dark tracking-wider flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5 text-primary-brand" />
                              {lang === 'ar' ? 'مرحلة البناء والصب النشطة (اضغط للتغيير):' : 'Active Milestone Target Lifecycle (Click to switch):'}
                            </p>

                            <div className="grid grid-cols-5 gap-1.5 md:gap-2.5">
                              {[
                                { key: 'planning', labelAr: 'تخطيط', labelEn: 'Planning' },
                                { key: 'excavating', labelAr: 'الحفر', labelEn: 'Excavate' },
                                { key: 'pouring', labelAr: 'الصب', labelEn: 'Pouring' },
                                { key: 'structure', labelAr: 'العظم', labelEn: 'Skeletal' },
                                { key: 'finishing', labelAr: 'التشطيب', labelEn: 'Finishing' }
                              ].map((step, idx) => {
                                const states = ['planning', 'excavating', 'pouring', 'structure', 'finishing'];
                                const activeIdx = states.indexOf(proj.status);
                                const isCompleted = idx < activeIdx;
                                const isActive = idx === activeIdx;

                                return (
                                  <button
                                    key={step.key}
                                    type="button"
                                    onClick={() => {
                                      setProjectsList(prev => prev.map(p => {
                                        if (p.id === proj.id) {
                                          return { ...p, status: step.key };
                                        }
                                        return p;
                                      }));
                                    }}
                                    className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${isActive
                                        ? 'bg-primary-brand text-white border-primary-brand shadow-sm ring-2 ring-primary-brand/10'
                                        : isCompleted
                                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/30 font-semibold'
                                          : 'bg-card-bg text-brand-accent border-brand-outline hover:border-brand-accent'
                                      }`}
                                  >
                                    <span className="text-[10px] md:text-[11px] font-extrabold block">
                                      {lang === 'ar' ? step.labelAr : step.labelEn}
                                    </span>
                                    <span className="text-[8px] opacity-75 font-mono leading-none mt-1">
                                      {idx + 1}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Blueprints' && (
            <div className="p-6 md:p-8 max-w-4xl mx-auto text-start">
              <div className="bg-card-bg border border-brand-outline shadow-sm p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-6 border-b pb-4 border-brand-outline">
                  <Map className="text-primary-brand w-8 h-8 shrink-0" />
                  <h2 className="text-2xl font-bold font-serif text-brand-dark">{t.bluePortalTitle}</h2>
                </div>
                <p className="text-brand-accent font-semibold mb-6 text-xs md:text-sm leading-relaxed">
                  {t.bluePortalDesc}
                </p>

                <div className="border-2 border-dashed border-brand-outline p-12 text-center rounded-3xl bg-card-accent-bg">
                  <Map className="w-12 h-12 text-brand-accent/70 mx-auto mb-3" />
                  <p className="text-brand-dark font-bold text-sm mb-1">{t.blueDragDrop}</p>
                  <p className="text-[11px] text-brand-accent mb-4">{t.blueMaxLimit}</p>
                  <button
                    onClick={() => alert(lang === 'ar' ? 'تم محاكاة قراءة المخطط بدقة! تبلغ تقديرات الحجم للمنشأ: 42.5 متر مكعب خرسانة M25' : 'CAD blueprint read accurately! Yields: 42.5 m³ M25 Reinforced Concrete')}
                    className="bg-brand-dark text-white px-6 py-2.5 text-xs font-bold uppercase transition-all rounded-full cursor-pointer hover:bg-opacity-90"
                  >
                    {t.blueUploadBtn}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Safety' && (
            <div className="p-6 md:p-8 max-w-4xl mx-auto text-start">
              <div className="bg-card-bg border border-brand-outline shadow-sm p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-6 border-b pb-4 border-brand-outline">
                  <HardHat className="text-primary-brand w-8 h-8 shrink-0" />
                  <h2 className="text-2xl font-bold font-serif text-brand-dark">{t.safeOshaTitle}</h2>
                </div>
                <p className="text-brand-accent font-semibold mb-6 text-xs md:text-sm leading-relaxed">
                  {t.safeOshaDesc}
                </p>

                <div className="space-y-3 font-semibold text-xs text-brand-dark">
                  <label className="flex items-center gap-3 justify-start p-4 border border-brand-outline bg-card-accent-bg hover:bg-brand-outline/25 rounded-2xl cursor-pointer transition-colors text-start">
                    <input type="checkbox" defaultChecked className="accent-primary-brand w-4 h-4 rounded" />
                    <span className="flex-1">{t.safeCheck1}</span>
                  </label>
                  <label className="flex items-center gap-3 justify-start p-4 border border-brand-outline bg-card-accent-bg hover:bg-brand-outline/25 rounded-2xl cursor-pointer transition-colors text-start">
                    <input type="checkbox" defaultChecked className="accent-primary-brand w-4 h-4 rounded" />
                    <span className="flex-1">{t.safeCheck2}</span>
                  </label>
                  <label className="flex items-center gap-3 justify-start p-4 border border-brand-outline bg-card-accent-bg hover:bg-brand-outline/25 rounded-2xl cursor-pointer transition-colors text-start">
                    <input type="checkbox" className="accent-primary-brand w-4 h-4 rounded" />
                    <span className="flex-1">{t.safeCheck3}</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Support' && (
            <div className="p-6 md:p-8 max-w-4xl mx-auto text-start">
              <div className="bg-card-bg border border-brand-outline shadow-sm p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-6 border-b pb-4 border-brand-outline">
                  <LifeBuoy className="text-primary-brand w-8 h-8 shrink-0" />
                  <h2 className="text-2xl font-bold font-serif text-brand-dark">{t.suppPortalTitle}</h2>
                </div>
                <p className="text-brand-accent font-semibold mb-6 text-xs md:text-sm leading-relaxed">
                  {t.suppPortalDesc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 border border-brand-outline bg-card-accent-bg rounded-2xl text-start">
                    <h4 className="font-extrabold text-sm mb-1 text-brand-dark font-serif">{t.suppPhoneTitle}</h4>
                    <p className="text-xs text-primary-brand font-extrabold font-sans">967-775-3c0-c6</p>
                  </div>
                  <div className="p-4 border border-brand-outline bg-card-accent-bg rounded-2xl text-start">
                    <h4 className="font-extrabold text-sm mb-1 text-brand-dark font-serif">{t.suppEmailTitle}</h4>
                    <p className="text-xs text-primary-brand font-extrabold font-sans">compliance@benaa-industrial.com</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-extrabold text-sm mb-3 text-brand-dark font-serif">{t.suppSubtopicTitle}</h4>
                  <form onSubmit={(e) => { e.preventDefault(); alert(lang === 'ar' ? 'تم إرسال تذكرتك بنجاح! سيتراسل معك مهندس لوجستيات بناء فوراً.' : 'Consultation inquiry transmitted safely!'); }} className="space-y-4">
                    <input
                      type="text"
                      placeholder={t.suppTopicPlaceholder}
                      className="w-full h-12 p-4 border border-brand-outline bg-card-bg focus:ring-0 focus:border-primary-brand text-xs font-semibold rounded-full focus:outline-none text-brand-dark"
                      required
                    />
                    <textarea
                      placeholder={t.suppDescPlaceholder}
                      className="w-full h-28 p-4 border border-brand-outline bg-card-bg focus:ring-0 focus:border-primary-brand text-xs font-semibold rounded-3xl focus:outline-none text-brand-dark"
                      required
                    />
                    <button type="submit" className="bg-brand-dark text-card-bg font-bold text-xs uppercase px-8 py-3.5 rounded-full hover:bg-opacity-90 transition-all cursor-pointer">
                      {t.suppSendBtn}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Admin' && (
            <AdminPanel lang={lang} theme={theme} />
          )}
        </div>
      </div>

      {/* 🌟 PREMIUM BILINGUAL CONSULTATION PORTAL MODAL 🌟 */}
      {isConsultModalOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999] overflow-y-auto animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="bg-card-bg border border-brand-outline shadow-2xl rounded-3xl w-full max-w-xl max-h-[95vh] overflow-y-auto relative animate-scale-up text-start leading-relaxed p-6 md:p-8">

            {/* Close Button */}
            <button
              onClick={() => setIsConsultModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-outline/15 text-brand-accent hover:text-brand-dark transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-brand-outline mb-6">
              <Award className="w-8 h-8 text-primary-brand shrink-0" />
              <div>
                <h3 className="text-lg font-extrabold text-brand-dark font-serif">
                  {lang === 'ar' ? 'بوابة الاستشارة الفنية والمطابقة' : 'Technical Consultation & Matching Portal'}
                </h3>
                <p className="text-[10px] text-brand-accent font-semibold tracking-wider uppercase">
                  {lang === 'ar' ? 'فحص جودة الخرسانة والمواصفات القياسية' : 'Standards, concrete mix ratios & structurally-sound estimates'}
                </p>
              </div>
            </div>

            {/* Consultant Profile Mini-Card */}
            <div className="p-4 bg-card-accent-bg border border-brand-outline rounded-2xl flex items-center gap-4 mb-6">
              {currentSelectedEngineer.avatar ? (
                <img referrerPolicy="no-referrer" src={currentSelectedEngineer.avatar} className="w-14 h-14 rounded-full object-cover border border-brand-outline shrink-0 shadow-sm" />
              ) : (
                <div className="w-14 h-14 bg-primary-brand-container rounded-full flex items-center justify-center font-bold text-xl text-primary-brand shrink-0">
                  {currentSelectedEngineer.name?.charAt(0) || 'ق'}
                </div>
              )}
              <div className="text-start">
                <span className="inline-block bg-primary-brand/10 text-primary-brand text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
                  {lang === 'ar' ? 'استشاري هندسي معتمد باليمن' : 'Authorized Site Consultant'}
                </span>
                <h4 className="font-extrabold text-[15px] text-brand-dark">
                  {currentSelectedEngineer.name}
                </h4>
                <p className="text-xs text-brand-accent font-semibold mt-0.5">
                  {lang === 'ar' ? currentSelectedEngineer.titleAr : currentSelectedEngineer.titleEn}
                </p>
              </div>
            </div>

            {isConsultSuccess ? (
              <div className="text-center py-8 px-4 space-y-4 animate-scale-up">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                  ✓
                </div>
                <div>
                  <h4 className="font-extrabold text-brand-dark text-lg">
                    {lang === 'ar' ? 'تم إرسال طلب تواصل بنجاح!' : 'Consultation Request Sent Successfully!'}
                  </h4>
                  <p className="text-xs text-brand-accent font-semibold max-w-sm mx-auto mt-2 leading-relaxed">
                    {lang === 'ar'
                      ? `تم توجيه ملفك الفني بالكامل للمستشار. سيتصل بك قريباً كأولوية قصوى على الرقم: ${clientPhone} في مدينة ${clientCity}.`
                      : `Your structural inquiry profile is routed to the engineer. A callback will initiate shortly on: ${clientPhone} within ${clientCity}.`}
                  </p>
                </div>
                <div className="border border-brand-outline bg-card-accent-bg p-3.5 rounded-2xl max-w-sm mx-auto text-start text-xs font-semibold leading-relaxed">
                  <p className="text-emerald-800 dark:text-emerald-400 font-bold mb-1">
                    {lang === 'ar' ? '💡 نصيحة سريعة من المستشار:' : '💡 Advisor Fast Hint:'}
                  </p>
                  <p className="text-[11px] text-brand-accent">
                    {lang === 'ar'
                      ? 'يرجى إبقاء هاتفك مفعل وتجهيز المخطط الفني CAD لتسهيل عملية مطابقة كميات الصب ومراجعة نسب الخلط.'
                      : 'Please keep your phone active, and have CAD structural blueprints handy to accelerate matching concrete mix and load calculations.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConsultModalOpen(false)}
                  className="bg-brand-dark text-white px-6 py-2.5 rounded-full font-bold text-xs hover:bg-opacity-95 transition-all cursor-pointer"
                >
                  {lang === 'ar' ? 'إغلاق البوابة' : 'Close Portal'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">

                {/* INTERACTIVE LAUNCHERS GRID WITH HIGH VISUAL POLISH */}
                <div className="space-y-3">
                  <h5 className="text-xs font-black uppercase text-brand-dark tracking-wider">
                    {lang === 'ar' ? 'أقراص التواصل والاتصال السريع:' : 'Quick Direct Contact Protocols:'}
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Launcher 1: WhatsApp */}
                    <button
                      type="button"
                      onClick={() => {
                        const originalPhone = currentSelectedEngineer.phone || '+967 770 000 000';
                        const phone = originalPhone.replace(/[^0-9]/g, '');
                        const nameStr = currentUser ? currentUser.name : '';
                        const msg = lang === 'ar'
                          ? `السلام عليكم ورحمة الله وبركاته صيانة المهندس ${currentSelectedEngineer.name}، أنا العميل ${nameStr}، تواصلت معك عبر منصة بناء للمواد الإنشائية وأود طلب استشارة فنية ومطابقة بخصوص الخرسانة ونسب التسليح بمشروعي.`
                          : `Hello Eng. ${currentSelectedEngineer.name}! I am ${nameStr}. I reached out through the Benaa Industrial platform and would like to request a technical consultation session regarding concrete supply specifications and structural load guidelines.`;
                        window.open(`https://wa.me/${phone || '967770000000'}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4.5 h-4.5 shrink-0" />
                      <span>{lang === 'ar' ? 'محادثة فورية (واتساب) 💬' : 'Direct WhatsApp Chat 💬'}</span>
                    </button>

                    {/* Launcher 2: Direct Call */}
                    <a
                      href={`tel:${currentSelectedEngineer.phone || '+967770000000'}`}
                      className="flex items-center justify-center gap-2.5 bg-brand-dark hover:bg-stone-800 active:scale-95 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl shadow-md transition-all text-center cursor-pointer"
                    >
                      <PhoneCall className="w-4.5 h-4.5 shrink-0" />
                      <span>{lang === 'ar' ? 'اتصال مباشر فوري 📞' : 'Call Mobile Directly 📞'}</span>
                    </a>
                  </div>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-brand-outline"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-brand-accent font-bold uppercase tracking-widest bg-card-bg px-2">
                    {lang === 'ar' ? 'أو احجز موعد تواصل مجدول بالأسفل' : 'Or book scheduled expert callback'}
                  </span>
                  <div className="flex-grow border-t border-brand-outline"></div>
                </div>

                {/* FORM FOR DETAILED SECURE CONSULTATION BOOKING */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!clientPhone.trim() || !clientCity.trim()) {
                      alert(lang === 'ar' ? 'يرجى ملء الرقم والمدينة لإتمام الحجز بنجاح' : 'Please provide both mobile number and city of project.');
                      return;
                    }
                    setIsSubmittingConsult(true);

                    // Dynamic dispatch and push request to central engine so it appears instantly in Admin Panel
                    try {
                      const reqListSaved = localStorage.getItem('benaa_consultations_requests');
                      let reqList = [];
                      if (reqListSaved) {
                        try { reqList = JSON.parse(reqListSaved); } catch (e) { }
                      } else {
                        reqList = [
                          {
                            id: 'CONS-901',
                            customerName: 'فؤاد عبد الله الجرادي',
                            customerEmail: 'fouad.jaradi@gmail.com',
                            customerPhone: '+967 773 221 100',
                            message: 'أريد كميات تسليح وقصارة معدة لبناء خزان أرضي خرساني سعة 40 متر مكعب في صنعاء، هل تنصحون بحديد تركي أم قطري؟',
                            status: 'Pending',
                            date: '2026-06-09 11:45'
                          },
                          {
                            id: 'CONS-902',
                            customerName: 'عزالدين الشميري',
                            customerEmail: 'ezz.shmeiri@outlook.com',
                            customerPhone: '+967 735 900 800',
                            message: 'طلب تدقيق مخطط إنشائي لفيلّا سكنية دورين في مدينة تعز، المساحة التقريبية 180 متر مربع.',
                            status: 'Addressed',
                            date: '2026-06-06 16:30'
                          },
                          {
                            id: 'CONS-903',
                            customerName: 'علي بن حسن البركاني',
                            customerEmail: 'ali.barkani@gmail.com',
                            customerPhone: '+967 712 887 766',
                            message: 'استشارة بخصوص اللياسة المقاومة للرطوبة في المناطق الساحلية (الحديدة - الحوك)، ماهي كميات الأسمنت المقاوم لنسب الخلط؟',
                            status: 'Pending',
                            date: '2026-06-08 08:12'
                          }
                        ];
                      }

                      const newRequest = {
                        id: `CONS-${Math.floor(Math.random() * 90000 + 10000)}`,
                        customerName: currentUser ? currentUser.name : (lang === 'ar' ? 'عميل زائر مجهول' : 'Guest Client'),
                        customerEmail: currentUser ? currentUser.email : 'guest@benaa-industrial.com',
                        customerPhone: clientPhone,
                        message: `${lang === 'ar' ? 'الجهة الاستشارية:' : 'Consultant Target:'} ${currentSelectedEngineer.name}. ${lang === 'ar' ? 'المدينة:' : 'City:'} ${clientCity}. ${lang === 'ar' ? 'الجانب الفني:' : 'Scope:'} ${consultationType === 'mix' ? (lang === 'ar' ? 'نسب خلط وصبة' : 'Mixing & ratios') :
                            consultationType === 'structure' ? (lang === 'ar' ? 'مخطط CAD وكميات' : 'CAD revision') :
                              consultationType === 'safety' ? (lang === 'ar' ? 'فحص تشققات ومطابقة' : 'Cracks survey') : (lang === 'ar' ? 'سلسلة لوجستية وتوريد' : 'Logistics supply')
                          }. ${lang === 'ar' ? 'الملاحظات:' : 'Notes:'} ${consultationNotes || 'بدون ملاحظات تذكر'}`,
                        status: 'Pending',
                        date: new Date().toISOString().slice(0, 16).replace('T', ' ')
                      };

                      // Send consultation request to PHP API
                      fetch(`${API_BASE_URL}ask_consultant.php`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newRequest)
                      }).then(response => {
                        if (!response.ok) {
                          console.error('Failed to save consultation request to database via API');
                        }
                      }).catch(err => {
                        console.error('Error saving consultation via API:', err);
                      });

                      reqList.unshift(newRequest);
                      localStorage.setItem('benaa_consultations_requests', JSON.stringify(reqList));
                      window.dispatchEvent(new Event('storage'));
                    } catch (err) {
                      console.error('Error saving consultation request:', err);
                    }

                    setTimeout(() => {
                      setIsSubmittingConsult(false);
                      setIsConsultSuccess(true);
                    }, 900);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-brand-dark mb-1.5">
                        {lang === 'ar' ? 'رقم الهاتف للتواصل المباشر' : 'Contact Phone Number'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        className="w-full bg-card-bg border border-brand-outline focus:border-primary-brand rounded-full px-5 py-2.5 text-xs font-semibold text-brand-dark focus:outline-none"
                        placeholder="e.g. +966 50 123 4567"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-brand-dark mb-1.5">
                        {lang === 'ar' ? 'المدينة وموقع المشروع الإنشائي' : 'City & Project Location'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-card-bg border border-brand-outline focus:border-primary-brand rounded-full px-5 py-2.5 text-xs font-semibold text-brand-dark focus:outline-none"
                        placeholder={lang === 'ar' ? 'مثال: الرياض، جدة، صنعاء' : 'e.g. Riyadh, Jeddah'}
                        value={clientCity}
                        onChange={(e) => setClientCity(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5">
                      {lang === 'ar' ? 'نوع وجانب المعاينة الفنية الاستشارية' : 'Consultation Scope & Specialty'}
                    </label>
                    <select
                      className="w-full bg-card-bg border border-brand-outline focus:border-primary-brand rounded-full px-5 py-2.5 text-xs font-semibold text-brand-dark focus:outline-none"
                      value={consultationType}
                      onChange={(e) => setConsultationType(e.target.value)}
                    >
                      <option value="mix">{lang === 'ar' ? 'حساب ومعاينة نسب خلط الأسمنت والخرسانة' : 'Concrete mixing & Cement ratio matching'}</option>
                      <option value="structure">{lang === 'ar' ? 'مراجعة المخطط الهندسي CAD وحساب الكميات' : 'CAD blueprint revision & Estimators validation'}</option>
                      <option value="safety">{lang === 'ar' ? 'مطابقة معايير السلامة واختبار التشققات وموجات الفحص' : 'Cracks survey, load-bearing tests & structural health'}</option>
                      <option value="other">{lang === 'ar' ? 'استشارة لوجستية وتوريد تسليح عام' : 'Logistics supply chain & reinforce steel assistance'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5">
                      {lang === 'ar' ? 'تفاصيل إضافية أو حجم الصبة المتوقع (اختياري)' : 'Additional description or estimated pour volume (Optional)'}
                    </label>
                    <textarea
                      rows={2}
                      className="w-full bg-card-bg border border-brand-outline focus:border-primary-brand rounded-2xl p-4 text-xs font-semibold text-brand-dark focus:outline-none"
                      placeholder={lang === 'ar' ? 'صف باختصار حالة المشروع، أو اكتب ملاحظاتك...' : 'Describe technical context, specifications request, etc.'}
                      value={consultationNotes}
                      onChange={(e) => setConsultationNotes(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingConsult}
                    className="w-full bg-primary-brand hover:bg-opacity-95 text-white active:scale-98 font-bold text-xs py-3 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSubmittingConsult
                        ? (lang === 'ar' ? 'جاري تعميد طلب الاستشارة الفنية...' : 'Transmitting inquiry profile...')
                        : (lang === 'ar' ? 'إرسال طلب الحجز الرسمي' : 'Submit Callback Request')}
                    </span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🌟 PREMIUM BILINGUAL PROJECT ENROLLMENT MODAL 🌟 */}
      {isAddProjOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999] overflow-y-auto animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="bg-card-bg border border-brand-outline shadow-2xl rounded-3xl w-full max-w-xl max-h-[95vh] overflow-y-auto relative animate-scale-up text-start leading-relaxed p-6 md:p-8">

            {/* Close Button */}
            <button
              onClick={() => setIsAddProjOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-outline/15 text-brand-accent hover:text-brand-dark transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-brand-outline mb-6">
              <Briefcase className="w-8 h-8 text-primary-brand shrink-0" />
              <div>
                <h3 className="text-lg font-extrabold text-brand-dark font-serif">
                  {lang === 'ar' ? 'بوابة تسجيل موقع إعمار جديد' : 'Enroll New Project Location'}
                </h3>
                <p className="text-[10px] text-brand-accent font-semibold tracking-wider uppercase">
                  {lang === 'ar' ? 'أضف تفاصيل مشروعك لحساب الخرسانة والحديد تلقائياً ومطابقتها' : 'Track milestones, auto-estimate concrete/steel and sync logistics'}
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!pName.trim() || !pCity.trim()) {
                  alert(lang === 'ar' ? 'يرجى إدخال اسم المشروع والمدينة للمطابقة.' : 'Please provide a valid project name and city location.');
                  return;
                }
                setIsSubmittingProj(true);
                setTimeout(() => {
                  const newProj = {
                    id: 'proj_' + Date.now(),
                    name: pName,
                    type: pType,
                    city: pCity,
                    area: Number(pArea) || 200,
                    concreteRequired: Number((pArea * 0.15).toFixed(2)),
                    steelRequired: Number((pArea * 0.045).toFixed(2)),
                    status: pStatus,
                    notes: pNotes
                  };
                  setProjectsList(prev => [newProj, ...prev]);
                  setIsSubmittingProj(false);
                  setIsAddProjOpen(false);
                }, 800);
              }}
              className="space-y-5"
            >
              <div className="space-y-4">
                {/* Project Name */}
                <div>
                  <label className="block text-[11px] font-bold text-brand-dark mb-1.5">
                    {lang === 'ar' ? 'اسم المشروع أو ترميز الموقع المميز' : 'Project Name / Site Designation'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-card-bg border border-brand-outline focus:border-primary-brand rounded-full px-5 py-2.5 text-xs font-semibold text-brand-dark focus:outline-none"
                    placeholder={lang === 'ar' ? 'مثال: فيلا السعد - حي النرجس' : 'e.g. Al-Saad Villa - Narjis District'}
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Project Type */}
                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5">
                      {lang === 'ar' ? 'نوع التصنيف الإنشائي للمبنى' : 'Structural Category'}
                    </label>
                    <select
                      className="w-full bg-card-bg border border-brand-outline focus:border-primary-brand rounded-full px-5 py-2.5 text-xs font-semibold text-brand-dark focus:outline-none"
                      value={pType}
                      onChange={(e) => setPType(e.target.value)}
                    >
                      <option value="residential">{lang === 'ar' ? 'فيلا سكنية 🏠' : 'Residential Villa 🏠'}</option>
                      <option value="commercial">{lang === 'ar' ? 'مبنى / عمارة تجارية 🏢' : 'Commercial Hub 🏢'}</option>
                      <option value="industrial">{lang === 'ar' ? 'مستودع / هنجر صناعي 🏭' : 'Industrial Unit 🏭'}</option>
                      <option value="infrastructure">{lang === 'ar' ? 'بنية تحتية / طريق 🛣️' : 'Infrastructure 🛣️'}</option>
                    </select>
                  </div>

                  {/* Project City */}
                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5">
                      {lang === 'ar' ? 'المدينة والمنطقة' : 'Location City'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-card-bg border border-brand-outline focus:border-primary-brand rounded-full px-5 py-2.5 text-xs font-semibold text-brand-dark focus:outline-none"
                      placeholder={lang === 'ar' ? 'مثال: الرياض، جدة، صنعاء' : 'e.g. Riyadh, Jeddah'}
                      value={pCity}
                      onChange={(e) => setPCity(e.target.value)}
                    />
                  </div>
                </div>

                {/* Built-up Area Slider & Box */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-bold text-brand-dark">
                      {lang === 'ar' ? 'إجمالي مساحات البناء والمسطحات (م²)' : 'Total Floor area (m²)'}
                    </label>
                    <span className="text-xs font-extrabold text-primary-brand font-mono">
                      {pArea} {lang === 'ar' ? 'متر مربع' : 'm²'}
                    </span>
                  </div>

                  <div className="flex gap-4 items-center">
                    <input
                      type="range"
                      min="50"
                      max="2000"
                      step="10"
                      className="flex-1 accent-primary-brand h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
                      value={pArea}
                      onChange={(e) => setPArea(Number(e.target.value))}
                    />
                    <input
                      type="number"
                      min="50"
                      max="10000"
                      className="w-20 bg-card-bg border border-brand-outline focus:border-primary-brand rounded-xl px-2 py-1.5 text-center text-xs font-bold text-brand-dark focus:outline-none font-mono"
                      value={pArea}
                      onChange={(e) => setPArea(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Live Estimator Preview Card */}
                <div className="bg-primary-brand-container border border-brand-outline text-brand-dark rounded-2xl p-4 space-y-2">
                  <p className="text-[10px] font-black uppercase text-primary-brand tracking-widest flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    {lang === 'ar' ? 'تقدير الكميات الذكي التلقائي بمجال بناء (استناداً للمساحة):' : 'Benaa Real-time Structural Estimator:'}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-0.5">
                      <p className="text-brand-accent text-[9.5px] uppercase font-semibold">{lang === 'ar' ? 'مكعب خرسانة صب:' : 'Expected Concrete Volume:'}</p>
                      <p className="font-extrabold text-brand-dark text-base font-mono">
                        {(pArea * 0.15).toFixed(1)} <span className="text-[11px] font-sans font-normal">{lang === 'ar' ? 'متر مكعب' : 'm³'}</span>
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-brand-accent text-[9.5px] uppercase font-semibold">{lang === 'ar' ? 'تسليح حديد صلب:' : 'Expected Structural Steel:'}</p>
                      <p className="font-extrabold text-brand-dark text-base font-mono">
                        {(pArea * 0.045).toFixed(1)} <span className="text-[11px] font-sans font-normal">{lang === 'ar' ? 'طن' : 'Tons'}</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-[9px] text-[#1a4332] font-semibold mt-1">
                    {lang === 'ar'
                      ? '💡 يقوم نموذج التقدير بحساب متوسط الصب الهيكلي للقواعد والأعمدة والأسقف حسب مساحة المنشأ.'
                      : '💡 Calculated using standard high-strength building density variables across foundation columns and roof structures.'}
                  </p>
                </div>

                {/* Current Project Milestone */}
                <div>
                  <label className="block text-[11px] font-bold text-brand-dark mb-1.5">
                    {lang === 'ar' ? 'مرحلة أو حالة البناء والمطالبة الحالية' : 'Current Active Lifecycle Phase'}
                  </label>
                  <select
                    className="w-full bg-card-bg border border-brand-outline focus:border-primary-brand rounded-full px-5 py-2.5 text-xs font-semibold text-brand-dark focus:outline-none"
                    value={pStatus}
                    onChange={(e) => setPStatus(e.target.value)}
                  >
                    <option value="planning">{lang === 'ar' ? 'التخطيط وتجهيز المخططات الفنية' : 'Milestone 1: Blueprint Planning'}</option>
                    <option value="excavating">{lang === 'ar' ? 'مرحلة الحفر والتسوية' : 'Milestone 2: Excavation'}</option>
                    <option value="pouring">{lang === 'ar' ? 'صب القواعد والأساسات والخرسانة' : 'Milestone 3: Concrete Foundation Pour'}</option>
                    <option value="structure">{lang === 'ar' ? 'بناء الجدران والهيكل العظمي والحديد' : 'Milestone 4: Skeletal Steel Framing'}</option>
                    <option value="finishing">{lang === 'ar' ? 'التشطيبات النهائية والصب الزخرفي' : 'Milestone 5: Exterior Finishing'}</option>
                  </select>
                </div>

                {/* Special Instructions Notes */}
                <div>
                  <label className="block text-[11px] font-bold text-brand-dark mb-1.5">
                    {lang === 'ar' ? 'ملاحظات وتوجيهات خاصة للمهندس المسئول (اختياري)' : 'Special Coordinator Instructions / Notes (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    className="w-full bg-card-bg border border-brand-outline focus:border-primary-brand rounded-2xl p-4 text-xs font-semibold text-brand-dark focus:outline-none"
                    placeholder={lang === 'ar' ? 'مثال: مطلوب خرسانة مقاومة للأملاح من جهة أمانة العاصمة...' : 'e.g. require specific cement additives or salt-resistant mixes...'}
                    value={pNotes}
                    onChange={(e) => setPNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddProjOpen(false)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs py-3 rounded-full shadow-sm transition-all text-center cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProj}
                  className="flex-1 bg-primary-brand hover:bg-opacity-95 text-white active:scale-98 font-bold text-xs py-3 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmittingProj
                      ? (lang === 'ar' ? 'جاري تعميد وتسجيل الموقع...' : 'Registering Location...')
                      : (lang === 'ar' ? 'تعميد وتسجيل الموقع الإنشائي' : 'Complete Registration')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Persistent Footer */}
      <Footer lang={lang} setActiveTab={setActiveTab} />

      {/* Brain helper modal */}
      <AIHelperModal lang={lang} isOpen={aiHelperOpen} onClose={() => setAiHelperOpen(false)} />
    </div>
  );
}
