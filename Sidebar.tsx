import { 
  Calculator, 
  Map, 
  Wrench, 
  ShieldCheck, 
  PhoneCall, 
  BrainCircuit, 
  Settings, 
  Clock
} from 'lucide-react';
import { useState } from 'react';
import { ActiveTab } from '../types';
import { translations } from '../translations';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAiHelper: () => void;
  lang: 'ar' | 'en';
  user: { name: string; email: string } | null;
}

export default function Sidebar({ activeTab, setActiveTab, onOpenAiHelper, lang, user }: SidebarProps) {
  const [loadValue, setLoadValue] = useState('4,250');
  const [calcMetrics, setCalcMetrics] = useState<{ thickness: string; steel: string } | null>(null);
  
  const t = translations[lang];

  const menuItems = [
    { id: 'Calculators' as ActiveTab, label: t.tabCalculators, labelEng: 'Calculators', icon: Calculator },
    { id: 'Blueprints' as ActiveTab, label: t.tabBlueprints, labelEng: 'Blueprints', icon: Map },
    { id: 'Materials' as ActiveTab, label: t.tabMaterials, labelEng: 'Equipment', icon: Wrench },
    { id: 'Safety' as ActiveTab, label: t.tabSafety, labelEng: 'Safety', icon: ShieldCheck },
    { id: 'Support' as ActiveTab, label: t.tabSupport, labelEng: 'Support', icon: PhoneCall },
  ];

  const handleEstimate = () => {
    const rawVal = parseFloat(loadValue.replace(/,/g, ''));
    if (isNaN(rawVal)) {
      alert(lang === 'ar' ? 'الرجاء إدخال قيمة تحميل صالحة!' : 'Please enter a valid load value!');
      return;
    }
    
    const thickness = (rawVal / 25000).toFixed(2);
    const steel = (rawVal * 0.08).toFixed(1);
    setCalcMetrics({ thickness, steel });
  };

  return (
    <aside className={`hidden lg:flex flex-col w-72 bg-card-accent-bg shrink-0 h-[calc(100vh-80px)] overflow-y-auto sticky top-20 font-sans border-brand-outline transition-colors duration-300 ${
      lang === 'ar' ? 'border-l' : 'border-r'
    }`}>
      {/* Upper header section */}
      <div className="p-5 border-b border-brand-outline">
        <div className="flex items-center gap-3 mb-4 bg-card-bg p-3 rounded-2xl border border-brand-outline hard-shadow">
          <div className="w-12 h-12 bg-primary-brand text-white flex items-center justify-center font-bold text-2xl rounded-xl">
            B
          </div>
          <div className="text-start">
            <h3 className="font-extrabold text-xs text-brand-dark tracking-wider">{t.contractorPortal}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-primary-brand-container text-primary-brand mt-1 uppercase">
              {user ? user.name.split(' ')[0] : t.guestUser}
            </span>
          </div>
        </div>

        {/* AI Engineering Tool Button */}
        <button
          onClick={onOpenAiHelper}
          className="w-full py-3 bg-primary-brand text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all rounded-full shadow-sm active:translate-x-1 cursor-pointer"
        >
          <BrainCircuit className="text-primary-brand-container w-4.5 h-4.5 animate-pulse" />
          <span>{t.aiHelperBtn}</span>
        </button>
      </div>

      {/* Main navigation parameters list */}
      <nav className="flex flex-col py-4 px-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 transition-all rounded-xl text-xs md:text-sm font-bold cursor-pointer ${
                lang === 'ar' ? 'text-right' : 'text-left'
              } ${
                isActive
                  ? 'bg-primary-brand text-white font-extrabold shadow-sm'
                  : 'text-brand-dark hover:bg-brand-outline/20 hover:text-primary-brand'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-brand-accent'}`} />
                <div className="text-start">
                  <p className="leading-tight">{item.label}</p>
                  <p className={`text-[8px] uppercase tracking-wide leading-none ${isActive ? 'text-[#e2e2d5]' : 'text-brand-accent'}`}>
                    {item.labelEng}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Mini Technical Load Calculator Widget (from Bottom of Sidebar mockup) */}
      <div className="mt-auto m-4 bg-brand-dark p-4 border border-brand-outline text-white rounded-2xl shadow-sm font-sans">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#e2e2d5] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {t.calcLoadTitle}
          </span>
          <Settings className="text-[#8e8e7c] w-3.5 h-3.5 hover:text-white cursor-pointer" />
        </div>

        <div className="font-mono text-base mb-3 bg-black/40 p-2.5 border-l-2 border-[#e2e2d5] rounded-xl flex justify-between items-center">
          <input
            type="text"
            className="bg-transparent border-none text-right focus:outline-none focus:ring-0 p-0 text-white font-bold w-18"
            value={loadValue}
            onChange={(e) => {
              setLoadValue(e.target.value);
              setCalcMetrics(null);
            }}
          />
          <span className="text-xs text-[#e2e2d5] font-semibold ml-1 font-sans">kg/m²</span>
        </div>

        {calcMetrics && (
          <div className="bg-[#e2e2d5]/10 text-stone-200 border border-[#e2e2d5]/20 p-2 rounded-xl text-[10px] font-medium leading-relaxed mb-3 text-start">
            {t.demandEstimateDesc
              .replace('{thickness}', calcMetrics.thickness)
              .replace('{steel}', calcMetrics.steel)}
          </div>
        )}

        <button
          onClick={handleEstimate}
          className="w-full bg-brand-bg text-brand-dark font-extrabold py-2.5 text-[11px] uppercase tracking-wider hover:bg-[#e2e2d5] active:scale-95 transition-transform rounded-full cursor-pointer"
        >
          {t.calculateBtn}
        </button>
      </div>
    </aside>
  );
}
