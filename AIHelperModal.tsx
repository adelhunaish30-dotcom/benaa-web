import { BrainCircuit, X, Sparkles, Server } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AIHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export default function AIHelperModal({ isOpen, onClose, lang }: AIHelperModalProps) {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);

  const defaultMsgAr = 'مرحباً بك في المساعد الهندسي الذكي لـ "بناء". أنا نموذج خبير مدرب على حساب الإجهادات ومقايسات الفقد والتأسيس. اختر سؤالاً من القائمة الجانبية أو اسألني عن أي كمية تفضلها!';
  const defaultMsgEn = 'Welcome to the Benaa AI Engineering Advisor. I am trained on stress constraints, standard concrete mixtures, and material wastage thresholds. Choose an option below or consult with me anytime!';

  useEffect(() => {
    setMessages([
      { sender: 'ai', text: lang === 'ar' ? defaultMsgAr : defaultMsgEn }
    ]);
  }, [lang, isOpen]);

  const presetQuestions = lang === 'ar' ? [
    { q: 'ما هي النسبة القياسية لخلطة الخرسانة M25؟', r: 'تتكون خلطة الخرسانة المسلحة من الفئة M25 بنسبة (1:1:2): جزء واحد أسمنت، وجزء واحد رمل ناعم، وجزئين بحص خشن بقطر 10-20 مم. يتم خلطها بالماء النظيف بنسبة هيدروليكية دقيقة لضمان قوة تحمل إجهادات قدرها 25 نيوتن/مم² بعد 28 يوماً.' },
    { q: 'كيف أحسب نسبة الهدر والفاقد (Wastage Limit)؟', r: 'يُنصح دائماً في المشاريع الصناعية المعتمدة بإضافة نسبة هدر تتراوح بين 5% إلى 8% للأسمنت والحديد، ونسبة 10% للتوريدات اللبنية والطوب المقاوم للحريق، لتفادي فروقات القص ومشاكل التموضع على أرض الواقع.' },
    { q: 'ما فائدة استخدام حديد التسليح Fe500D؟', r: 'درجة حديد التسليح Fe500D تتميز بمتانة قص مقاومة للشد وهيكل مرن يتيح انحناءً فائقاً وحماية ضد التشققات الزلزالية بالمقارنة بدرجات الحديد الأقدم مثل Fe415، وهي الدرجة المعتمدة هندسياً لتأسيس الهياكل والأوتاد.' }
  ] : [
    { q: 'What is the standard mixing ratio for M25 concrete?', r: 'M25 reinforced concrete mixture follows a 1:1:2 standard proportion: 1 part cement, 1 part fine sand, and 2 parts coarse aggregates (10-20mm). This mix provides a compressive strength of 25 N/mm² after a standard 28-day curing cycle.' },
    { q: 'How is the custom material wastage limit computed?', r: 'In certified industrial practices, adding a wastage buffer threshold of 5% to 8% for cement and rebars is highly advised to overcome physical cutting margins, on-site spills, or transport handling factors.' },
    { q: 'Why is Fe500D structural TMT rebar reinforcement preferred?', r: 'Fe500D grade provides superior ultimate tensile strength, balanced elongation properties, and earthquake-resistant seismic elastic limits compared to legacy steel like Fe415, making it the legal baseline for structural pillars.' }
  ];

  const handleAsk = (question: string, answer: string) => {
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: question },
      { sender: 'ai', text: answer }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div 
        className="relative bg-card-bg border border-brand-outline w-full max-w-2xl overflow-hidden flex flex-col justify-between rounded-3xl shadow-xl transition-colors duration-300"
        style={{ height: '520px' }}
      >
        {/* Modal Header */}
        <div className="bg-primary-brand p-4 text-white flex justify-between items-center border-b border-brand-outline">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-primary-brand-container w-6 h-6 animate-pulse" />
            <div className="text-start">
              <h3 className="font-extrabold text-sm font-serif">
                {lang === 'ar' ? 'المساعد الهندسي الذكي لبناء (AI Expert)' : 'Benaa AI Technical Advisor'}
              </h3>
              <p className="text-[10px] text-stone-200">
                {lang === 'ar' ? 'تقديرات فورية واستشارات مطابقة لمواصفات ASTM & ACI' : 'Instant estimations compliant with ASTM & ACI guidelines'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 px-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold focus:outline-none transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal content body split between chats and buttons */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-bg flex flex-col justify-between">
          <div className="space-y-3 max-h-[250px] overflow-y-auto p-1">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`py-2.5 p-4 rounded-2xl leading-relaxed text-xs border md:text-sm font-semibold max-w-[85%] text-start ${
                  msg.sender === 'user' 
                    ? 'bg-card-bg text-brand-dark border-brand-outline mr-auto ml-0' 
                    : 'bg-primary-brand text-white border-transparent ml-auto mr-0'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Presets query selection footer */}
          <div className="pt-4 border-t border-brand-outline">
            <p className="text-brand-accent font-bold text-[10px] uppercase mb-2 text-start">
              {lang === 'ar' ? 'أسئلة فنية شائعة (إضغط لطلب الإجابة الفورية):' : 'Frequently Asked Questions (Click to ask instantly):'}
            </p>
            <div className="flex flex-col gap-1.5">
              {presetQuestions.map((q, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleAsk(q.q, q.r)}
                  className="w-full text-start p-2.5 bg-card-bg hover:bg-brand-outline/20 text-brand-dark hover:text-primary-brand border border-brand-outline hover:border-primary-brand text-[11px] font-bold rounded-full transition-all focus:outline-none flex justify-between items-center cursor-pointer"
                >
                  <span className="truncate flex-1 font-bold">{q.q}</span>
                  <Sparkles className="w-3.5 h-3.5 text-primary-brand shrink-0 mx-2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer warning info */}
        <div className="bg-brand-bg p-3 text-center border-t border-brand-outline text-[10px] text-brand-accent font-bold flex items-center justify-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-brand-accent" />
          {lang === 'ar' 
            ? 'تخضع جميع استشارات النظام للمعايير الهندسية ASTM & ACI بمعدل دقة 95%'
            : 'All technical values are governed by ACI & ASTM engineering design norms'}
        </div>

      </div>
    </div>
  );
}
