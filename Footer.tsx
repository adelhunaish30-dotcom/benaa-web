import { ShieldCheck, Anchor, Truck, Lock } from 'lucide-react';

interface FooterProps {
  lang: 'ar' | 'en';
  setActiveTab?: (tab: any) => void;
}

export default function Footer({ lang, setActiveTab }: FooterProps) {
  const isAr = lang === 'ar';
  
  const alerts = isAr ? {
    search: 'تصفح الكتالوج بالبحث الفوري متاح حالياً من القائمة العلوية.',
    aggregates: 'مخزون ركام البناء غني بمنتجات السيليكا المغسولة والمفصولة.',
    steel: 'حديد التسليح من مصانع ArcelorMittal وتاتا متوفر بجميع المقاسات.',
    partners: 'فريق مبيعات كبار الموردين متاح عبر الرقم الهاتفي المعتمد.',
    survey: 'تحت التجهيز للاستقصاء عن تفاصيل المواصفة الفنية.',
    terms: 'شروط استخدام والخدمات المباشرة لمنصة بناء الصناعية للحلول المتكاملة.',
    privacy: 'بوابة السياسة والتحكم الأمني مغلقة للاستخدام الداخلي.'
  } : {
    search: 'Exploring the catalog with instant search is active via top navigation.',
    aggregates: 'Aggregates stock is rich with natural silica and sorted limestone granules.',
    steel: 'Rebars from ArcelorMittal & Tata are stocked in all standard diameters.',
    partners: 'Enterprise Sales reps can be contacted via the legal direct helpline.',
    survey: 'This customized inspection wizard is in active preparation.',
    terms: 'Benaa industrial legal terms and usage limits guidelines map.',
    privacy: 'Privacy audit panels are restricted to administrator clearances only.'
  };

  return (
    <footer className="bg-[#1e1e1b] text-white border-t border-brand-outline/10 font-sans transition-colors duration-300" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="w-full py-12 px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-[1320px] mx-auto">
        
        {/* Bio column */}
        <div className="col-span-1 text-start">
          <span className="font-extrabold text-2xl text-white mb-4 block font-serif">
            {isAr ? 'بناء - Benaa' : 'Benaa Industrial'}
          </span>
          <p className="text-stone-300 text-xs leading-relaxed max-w-xs font-semibold">
            {isAr 
              ? 'متجر ومنصة التوريدات الهندسية والصناعية الأفضل لمواد الخرسانة وحديد التسليح والمعدات الثقيلة. بنيت خصيصاً للمهندسين والمقاولين المقيمين جودة فائقة.'
              : 'The ultimate marketplace for structural concrete, steel reinforcement, and heavy machinery, purpose-built for engineers and licensed builders.'}
          </p>
        </div>

        {/* Catalog column */}
        <div className="flex flex-col gap-2.5 text-start">
          <h4 className="text-[#e2e2d5] font-bold text-xs tracking-wider mb-2 font-serif">
            {isAr ? 'أقسام ومواد المتجر' : 'Store Catalog'}
          </h4>
          <a href="#" onClick={(e) => { e.preventDefault(); alert(alerts.search); }} className="text-stone-300 hover:text-white transition-colors duration-300 text-xs">
            {isAr ? 'كتالوج توريد الأسمنت والخرسانة' : 'Portland Cement & Concrete'}
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); alert(alerts.aggregates); }} className="text-stone-300 hover:text-white transition-colors duration-300 text-xs">
            {isAr ? 'موردين معتمدين لأكياس البحص والركام' : 'Coarse Aggregates & Gravel'}
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); alert(alerts.steel); }} className="text-stone-300 hover:text-white transition-colors duration-300 text-xs">
            {isAr ? 'حديد التسليح الهيكلي TMT' : 'Deformed Rebars (TMT) Fe500D'}
          </a>
        </div>

        {/* Support column */}
        <div className="flex flex-col gap-2.5 text-start">
          <h4 className="text-[#e2e2d5] font-bold text-xs tracking-wider mb-2 font-serif">
            {isAr ? 'الدعم الفني والخدمات المتقدمة' : 'Helplines & Warranties'}
          </h4>
          <a href="#" onClick={(e) => { e.preventDefault(); alert(alerts.partners); }} className="text-stone-300 hover:text-white transition-colors duration-300 text-xs">
            {isAr ? 'شراكات المقاولين المعتمدين' : 'Enterprise Contractor Deals'}
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); alert(alerts.survey); }} className="text-stone-300 hover:text-white transition-colors duration-300 text-xs">
            {isAr ? 'خدمة الاستقصاء والطلب المخصص' : 'Custom Estimation Request'}
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); alert(alerts.terms); }} className="text-stone-300 hover:text-white transition-colors duration-300 text-xs">
            {isAr ? 'شروط الاستخدام والخصوصية' : 'Terms of Service & Privacy'}
          </a>
        </div>

        {/* Compliance column */}
        <div className="col-span-1 text-start">
          <h4 className="text-[#e2e2d5] font-bold text-xs tracking-wider mb-3 font-serif">
            {isAr ? 'الامتثال الصناعي والسلامة' : 'Industrial Standards'}
          </h4>
          <p className="text-stone-300 text-xs leading-relaxed mb-4">
            {isAr
              ? 'جميع المواد المدرجة في منصة بناء مطابقة تماماً للمواصفات الدولية لمعهد الخرسانة الأمريكي (ACI) والجمعية الأمريكية للاختبارات والمواد (ASTM).'
              : 'All materials listed in Benaa fully satisfy ACI (American Concrete Institute) and ASTM international testing standards.'}
          </p>
          <div className="flex gap-3 text-[#e2e2d5]">
            <ShieldCheck className="w-5 h-5 hover:scale-110 cursor-pointer text-stone-300" title={isAr ? 'حماية المشتري المعتمدة' : 'Verified Buyer Security'} />
            <Anchor className="w-5 h-5 hover:scale-110 cursor-pointer text-stone-300" title={isAr ? 'مطابق لمعيار الجودة الدقيقة' : 'ISO Compliant Audit'} />
            <Truck className="w-5 h-5 hover:scale-110 cursor-pointer text-stone-300" title={isAr ? 'أسطول شحن ثقيل منظم' : 'Heavy Logistics Fleet'} />
          </div>
        </div>

      </div>

      <div className="max-w-[1320px] mx-auto px-6 py-5 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold">
        <span className="text-stone-400 text-start">
          {isAr
            ? `© ${new Date().getFullYear()} بناء إن دستريال للتوريدات اللوجستية المحدودة (Benaa Industrial). جميع الحقوق محفوظة لجهة الترخيص.`
            : `© ${new Date().getFullYear()} Benaa Industrial Logs & Enterprise Ltd. All rights reserved.`}
        </span>
        <div className="flex flex-wrap gap-4 md:gap-6 text-stone-400 items-center justify-center sm:justify-start">
          <span>{isAr ? 'توثيق ISO 9001:2015 المعتمد' : 'ISO 9001:2015 Registered'}</span>
          <a href="#" onClick={(e) => { e.preventDefault(); alert(alerts.privacy); }} className="hover:text-white transition-colors">
            {isAr ? 'سياسة الخصوصية والأمان' : 'Security Shield & Audits'}
          </a>
          {setActiveTab && (
            <button
              onClick={() => setActiveTab('Admin')}
              className="text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>{isAr ? 'بوابة الإشراف والتحكم 🔐' : 'Admin Portal 🔐'}</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
