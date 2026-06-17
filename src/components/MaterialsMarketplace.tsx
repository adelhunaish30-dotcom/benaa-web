import {
  Filter,
  ArrowUpDown,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  ShoppingBasket,
  Trash2,
  FileDown,
  CheckCircle2,
  TrendingUp,
  Truck,
  Info,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  Clock,
  Check,
  Loader2,
  AlertCircle,
  X,
  MessageSquare,
  Building2,
  Lock,
  CreditCard,
  Coins,
  Wallet
} from 'lucide-react';
import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MaterialItem, CartItem, API_BASE_URL } from '../types';
import { INITIAL_MATERIALS } from '../data';
import { translations } from '../translations';

interface MaterialsMarketplaceProps {
  cart: CartItem[];
  onAddToCart: (material: MaterialItem, quantity: number) => void;
  onUpdateCartQty: (materialId: string, quantity: number) => void;
  onRemoveFromCart: (materialId: string) => void;
  onClearCart: () => void;
  onSetCalculatedLoad: (weight: number) => void;
  lang: 'ar' | 'en';
  user: { name: string; email: string } | null;
}

export default function MaterialsMarketplace({
  cart,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onClearCart,
  onSetCalculatedLoad,
  lang,
  user
}: MaterialsMarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Materials');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('rating');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addingStates, setAddingStates] = useState<Record<string, boolean>>({});

  // Dynamic products list state synchronized with Admin Panel
  const [materialsList, setMaterialsList] = useState<MaterialItem[]>(() => {
    const saved = localStorage.getItem('benaa_catalogue_materials');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((p: any) => ({
            id: p.id,
            name: lang === 'ar' ? p.nameAr : p.nameEn,
            arabicName: p.nameAr,
            category: p.category,
            supplier: p.supplier,
            rating: p.rating || 4.7,
            price: p.price,
            unit: lang === 'ar' ? p.unitAr : p.unitEn,
            image: p.image,
            verified: true
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_MATERIALS.map(m => ({
      ...m,
      arabicName: m.id === 'mat_cem_1' ? 'أسمنت بورتلاندي عادي مقاوم' :
        m.id === 'mat_steel_1' ? 'حديد تسليح ممتاز مقاوم 16مم' :
          m.id === 'mat_brick_1' ? 'طوب أحمر فخاري فائق القوة' :
            m.id === 'mat_cem_2' ? 'أسمنت الترا تيك عالي الصلابة' :
              m.id === 'mat_steel_2' ? 'حزمة أسياخ حديد تسليح سابك' :
                m.id === 'mat_brick_2' ? 'بلك أسمنتي مفرغ للأسوار' :
                  m.id === 'mat_safe_1' ? 'خوذة أمان مطورة لمهندسي المواقع' :
                    m.id === 'mat_agg_1' ? 'رمل مغسول ناعم للصبة' :
                      m.id === 'mat_plumbing_1' ? 'أنابيب حرارية عالية الضغط' : m.name
    }));
  });

  // Track storage and language changes to update listing dynamically
  useEffect(() => {
    const syncMaterialsList = () => {
      const saved = localStorage.getItem('benaa_catalogue_materials');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const mapped = parsed.map((p: any) => ({
              id: p.id,
              name: lang === 'ar' ? p.nameAr : p.nameEn,
              arabicName: p.nameAr,
              category: p.category,
              supplier: p.supplier,
              rating: p.rating || 4.7,
              price: p.price,
              unit: lang === 'ar' ? p.unitAr : p.unitEn,
              image: p.image,
              verified: true
            }));
            setMaterialsList(mapped);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        // Automatically initialize if empty
        const defaultProds = [
          {
            id: 'prod-1',
            nameAr: 'أسمنت مقاوم للملوحة - الوطنية للأسمنت',
            nameEn: 'Sulfate Resistant Cement - Al-Wataniah Cement',
            category: 'Cement',
            price: 14.50,
            stock: 450,
            unitAr: 'كيس (50 كجم)',
            unitEn: 'Bag (50kg)',
            supplier: 'Yemeni National Cement Co.',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX1lBwxECzjLUO-AxhDxcpsMOc_4ie8Hhj3cDBLjV-P9t_p8Ni19pI91UGDi2C4W74VHSudLXWuvnj7LAZUC_I0k1XOEaqpTgKBiG0LlPiI-wrq-1oZAcsk1GCmP8JiG0ySEYV6GZoYsrm5zQ3QiXTaVR21XtVkeVhzpUbITO0tz5iey_l0qimly47serBz4Ld-tJW200yYyEfVcDqzK-0EYVUHh6qye3vB6FcN1zBaofoEIDf59P3v3Bou8vC4qPW6oSjRuTK0xw'
          },
          {
            id: 'prod-2',
            nameAr: 'حديد تسليح سابك ممتاز بقطر 16مم',
            nameEn: 'SABIC Steel Rebars Grade 60 (16mm)',
            category: 'Steel',
            price: 840.00,
            stock: 120,
            unitAr: 'طن متري',
            unitEn: 'Metric Ton',
            supplier: 'SABIC Steel Logistics',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDe4JPOtfEKckBQEr5I4UkTP3oJDR1GFkDZWF1SvM5JQLNvJHDPQmaW1EJaoZGyFGVFHxR1xfsvdhbrr_69qcJ2i-CJcqcWvjaDeI3uasjSx8URS9vXcGNeC0IZThj4KOTuNDqr_VKSfWO1OxRuPTPxDNhmI4h3szXUoDnUfuwUgLTM3ND43U8CxMdPhDEW73cuFRx-cyCkqzNBnUgdaUqzh-ZNZoPXtjvK1lVfCM93pncrFUt77e-uLWQdDdm78s-grtQ9kHdaT4'
          },
          {
            id: 'prod-3',
            nameAr: 'بلك أسمنتي مفرغ مقاس 20×20×40 مفرغ دبل',
            nameEn: 'Premium Hollow Cement Blocks 20x20x40',
            category: 'Bricks',
            price: 1.80,
            stock: 4200,
            unitAr: 'حبة بلك',
            unitEn: 'Block Piece',
            supplier: 'Al-Ansi Automated Block Factory',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFtqFcrDKI0PQaRz0w7-kc06e4FIVZ38GjG6CeHgKgIp3b7buizqsBDFipXcpX0_fU4WdT_0anaIqmL4bcMQ4x4Jwim1ATWBvn_J740l9RkfJSTDlD7LJQ7wtDM2U184vkSetBas4zPWiebumY18vyFHExL7hiDifdeEcO1-oDgx-A8_RD1UQlF1P2HVKa_87Kc_VQM5rA7e3qC1UBXkMo0NS_6ApxzKT3e70mcNSGFE1p03G2fqfbtqFS_4Ac37taoix06YiJJu8'
          },
          {
            id: 'prod-4',
            nameAr: 'رمل أحمر نظيف مغسول ومصنف هندسياً',
            nameEn: 'Grade-II Washed Heavy Silica Sand',
            category: 'Aggregates',
            price: 35.00,
            stock: 280,
            unitAr: 'متر مكعب',
            unitEn: 'Cubic Meter (m³)',
            supplier: 'Sana\'a Valley Aggregates Co.',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDe4JPOtfEKckBQEr5I4UkTP3oJDR1GFkDZWF1SvM5JQLNvJHDPQmaW1EJaoZGyFGVFHxR1xfsvdhbrr_69qcJ2i-CJcqcWvjaDeI3uasjSx8URS9vXcGNeC0IZThj4KOTuNDqr_VKSfWO1OxRuPTPxDNhmI4h3szXUoDnUfuwUgLTM3ND43U8CxMdPhDEW73cuFRx-cyCkqzNBnUgdaUqzh-ZNZoPXtjvK1lVfCM93pncrFUt77e-uLWQdDdm78s-grtQ9kHdaT4'
          }
        ];
        localStorage.setItem('benaa_catalogue_materials', JSON.stringify(defaultProds));
      }
    };

    // First run initial sync check
    syncMaterialsList();

    window.addEventListener('storage', syncMaterialsList);
    const interval = setInterval(syncMaterialsList, 1500);
    return () => {
      window.removeEventListener('storage', syncMaterialsList);
      clearInterval(interval);
    };
  }, [lang]);

  // Specialized Bulk Pricing / Low Price RFQ states
  const [isBulkQuoteOpen, setIsBulkQuoteOpen] = useState(false);
  const [bulkName, setBulkName] = useState(user?.name || '');
  const [bulkPhone, setBulkPhone] = useState('');
  const [bulkCity, setBulkCity] = useState('');
  const [bulkMaterialClass, setBulkMaterialClass] = useState('Steel');
  const [bulkEstQuantity, setBulkEstQuantity] = useState('50');
  const [bulkNotes, setBulkNotes] = useState('');
  const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);
  const [isBulkSuccess, setIsBulkSuccess] = useState(false);
  const [generatedBulkId, setGeneratedBulkId] = useState('');

  const handleBulkQuoteSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!bulkName.trim() || !bulkPhone.trim() || !bulkCity.trim()) {
      alert(lang === 'ar' ? 'يرجى ملء الاسم الكامل والبريد ورقم الجوال والمدينة للمتابعة.' : 'Please enter your Full Name, Phone, and City to proceed.');
      return;
    }
    setIsSubmittingBulk(true);
    // Simulate high-fidelity RFQ transmission to Benaa's central CRM optimization system
    setTimeout(() => {
      setIsSubmittingBulk(false);
      setGeneratedBulkId(`BENA-RFQ-${Math.floor(Math.random() * 90000 + 10000)}`);
      setIsBulkSuccess(true);
    }, 1800);
  };

  // Checkout Interactive Wizard States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1 = Customer Fields, 2 = Site Location & Time, 3 = Review Dispatch, 4 = Confirmed Success!
  const [checkoutName, setCheckoutName] = useState(user?.name || '');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState(user?.email || '');
  const [checkoutCR, setCheckoutCR] = useState('');
  const [selectedHubKey, setSelectedHubKey] = useState('riyadh'); // riyadh, jeddah, jubail, yasmin, dammam, baghdad
  const [manualAddress, setManualAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    return tom.toISOString().split('T')[0];
  });
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<'morning' | 'afternoon' | 'night'>('morning');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [finalOrderId, setFinalOrderId] = useState('');
  const [showSMSAlert, setShowSMSAlert] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'kuraimi' | 'bank'>('cod');
  const [paymentRefNumber, setPaymentRefNumber] = useState('');
  const [paymentBankName, setPaymentBankName] = useState('');

  // Sync user info if login status changes
  useEffect(() => {
    if (user) {
      setCheckoutName(prev => prev || user.name);
      setCheckoutEmail(prev => prev || user.email);
    }
  }, [user]);

  // Localized custom translations for Checkout wizard steps
  const checkoutT = {
    ar: {
      checkoutTitle: 'بناء - بوابة الدفت والتعميد الآمن للتوريد',
      checkoutSub: 'قم بإدخال معلومات التوريد وجدولة تفريغ الشاحنات لنهو العملية باحترافية كاملة',
      step1: 'البيانات الأساسية',
      step2: 'موقع وتاريخ التسليم',
      step3: 'مراجعة وتعميد الطلب',
      step4: 'نجاح التوريد وحجز الشاحنة',
      fullName: 'الاسم الكامل للعميل / المفوض بالتوقيع',
      fullNamePlaceholder: 'مثال: شركة أديل للمقاولات والمقاييس',
      phone: 'رقم الجوال الفعّال (لتواصل سائقي الشاحنات والـ SMS المباشر)',
      phonePlaceholder: 'مثال: +966 50 123 4567',
      email: 'البريد الإلكتروني للسلامة والتقارير الإدارية',
      emailPlaceholder: 'example@domain.com',
      crNo: 'رقم السجل التجاري للمنشأة (إن وُجد - لتضمينه بالفاتورة والشهادة)',
      crNoPlaceholder: 'مثال: 1010344820',
      mapSelect: 'حدد موقع المشروع من شبكة محاور ومنصات "بناء" اللوجستية المباشرة لتأكيد التغطية:',
      manualAddress: 'العنوان التفصيلي ومسلك تيسير حركة الشاحنة بالموقع',
      manualAddressPlaceholder: 'مثال: حي الياسمين، تقاطع طريق الملك سلمان - جوار منشأة الرفع برج أ',
      deliveryDate: 'التاريخ المطلوب لوصول أسطول التوريد',
      timeSlot: 'الفترة الزمنية المفضلة لتنزيل وتفريغ الحمولات الثقيلة بموقع الصب',
      timeMorning: 'فترة الصباح (06:00 ص - 12:00 م)',
      timeAfternoon: 'بعد الظهر (12:00 م - 05:00 م)',
      timeNight: 'فترة المساء الصامتة (05:00 م - 10:00 م)',
      specialInstructions: 'توجيهات فنية ومواصفات مناورة خاصة لسائقي الشاحنات الثقيلة',
      specialInstructionsPlaceholder: 'مثال: مدخل الكورنر ضيق، يرجى التنزيل جوار الرافعة الشمالية لتجنب الازدحام',
      orderSummary: 'ملخص كميات المواد والمقاييس المجدولة للتوريد',
      priceDetails: 'تفصيل القيم المالية وتوريد رسوم القيمة المضافة السيادية:',
      vatTax: 'ضريبة القيمة المضافة المحسوبة (15% VAT Simulation)',
      finalTotal: 'القيمة المالية الإجمالية النهائية المؤكدة المترتبة',
      confirmDispatchBtn: 'إسراء وحظر الموردين وتعميد التوريد فوراً',
      cancelBtn: 'التراجع والإلغاء',
      nextBtn: 'الذهاب للخطوة التالية',
      prevBtn: 'الرجوع للخلف',
      processingOrder: 'جاري تخصيص كميات الموردين، تهيئة أوزان المحاور، وجدولة مسالك شاحنات الشحن اللوجستي الثقيل...',
      orderSuccessTitle: 'تم تعميد طلب التوريد بنجاح وجاري تحميل الشاحنات!',
      orderSuccessNo: 'الرقم اللوجستي المرجعي للطلب للتعقب والمطابقة:',
      orderSuccessDesc: 'تهانينا! طلبيتك جارية الآن ومؤمّنة تماماً عبر بروتوكولات شحنات شركة (بناء) اللوجستية المعتمدة. تم التخطيط الفوري لحجز الموارد وتحميل الشاحنات لتأتي في التاريخ المحدد وبحسب فترة الصب المطلوبة.',
      whatsappTrack: 'تتبع السائق المباشر وجروب الـ WhatsApp اللوجستي للفوركس',
      downReceipt: 'تنزيل وحفظ مستند الفاتورة وشهادة الضمان اللوجستية (PDF)',
      smsSentAlert: 'تم إرسال رسالة نصية SMS إلى هاتفك المسجل برقم الطلب وتفاصيل مسار السائق الفوري!',
      emptyCartErr: 'سلة التوريد فارغة حالياً. لا يوجد مواد للتعميد.',
      backToCatalog: 'العودة لكتالوج المورّدين'
    },
    en: {
      checkoutTitle: 'Benaa - Secure Checkout & Supply Authorization',
      checkoutSub: 'Enter active contractor credentials & logistics scheduling to process structural delivery.',
      step1: 'Customer & Contact Details',
      step2: 'Location Hub & Delivery Slot',
      step3: 'Final Review & Authorize',
      step4: 'Authorized Dispatch Success',
      fullName: 'Full Client / Corporate Signatory Name',
      fullNamePlaceholder: 'e.g., Adel Contracting & Structural Matrix Ltd.',
      phone: 'Active Mobile Number (For driver coordination & SMS dispatch)',
      phonePlaceholder: 'e.g., +966 50 123 4567',
      email: 'Corporate Email for Official Logging',
      emailPlaceholder: 'example@domain.com',
      crNo: 'Commercial Registration Number (Optional - for Certificate print)',
      crNoPlaceholder: 'e.g., 1010344820',
      mapSelect: 'Select Project Logistics Hub from active network nodes to pinpoint dispatcher costs:',
      manualAddress: 'Detailed delivery address / concrete site layout hints',
      manualAddressPlaceholder: 'e.g., Al-Yasmin district, intersection of King Salman road - Block 12',
      deliveryDate: 'Requested Logistics Arrival Date',
      timeSlot: 'Preferred heavy transport unloading and site dropoff window',
      timeMorning: 'Morning slot (06:00 AM - 12:00 PM)',
      timeAfternoon: 'Afternoon slot (12:00 PM - 05:00 PM)',
      timeNight: 'Silent Night slot (05:00 PM - 10:00 PM)',
      specialInstructions: 'Technical alerts & maneuver warnings for heavy vehicle drivers',
      specialInstructionsPlaceholder: 'e.g. narrow driveway, drop near North tower-crane, check overhead lines',
      orderSummary: 'Order Materials & Volume Computation Table',
      priceDetails: 'Contract Pricing & Value Added Tax (VAT) Calculation:',
      vatTax: 'Estimated Value Added Tax (15% VAT Simulation)',
      finalTotal: 'Certified Grand Total Cost (Inclusive of VAT & Cargo Shipping)',
      confirmDispatchBtn: 'Approve Contractor Cargo & Dispatch Fleet Now',
      cancelBtn: 'Close & Cancel',
      nextBtn: 'Proceed to Next Step',
      prevBtn: 'Back',
      processingOrder: 'Allocating vendor inventories, calculating axle load constraints, and preparing GPS tracking dispatch routing...',
      orderSuccessTitle: 'Cargo Dispatch Authorized & Fleet Scheduled Successfully!',
      orderSuccessNo: 'Logistics Assignment Ref ID:',
      orderSuccessDesc: 'Perfect! Your procurement queue is officially verified and registered within Benaa\'s automated supply chain chain. Shovels and cranes are loaded according to your configured deadline. Full telemetry is online.',
      whatsappTrack: 'Track Cargo Crew Live via WhatsApp Group Channel',
      downReceipt: 'Download Official Invoice & Quality Certificate (PDF)',
      smsSentAlert: 'A real-time SMS tracking ticket has been sent to your registered terminal!',
      emptyCartErr: 'Your catalog supply cart is empty. Please add items before checking out.',
      backToCatalog: 'Back to Materials Catalog'
    }
  }[lang];

  // Simulated live construction locations
  const LOGISTICS_HUBS = [
    { key: 'riyadh', nameAr: 'المنطقة الصناعية الثانية (جنوب الرياض)', nameEn: 'Riyadh Industrial II (Central Heavy Hub)', dist: '14 كم', delivery: 'خلال 3 ساعات', activeTrucks: '12 شاحنة نشطة', color: '#1a4332' },
    { key: 'yasmin', nameAr: 'شمال الرياض (حي الياسمين والملقا)', nameEn: 'Al-Yasmin & Malqa (Residential Expansion)', dist: '22 كم', delivery: 'خلال 4 ساعات', activeTrucks: '7 شاحنات نشطة', color: '#36d19a' },
    { key: 'jeddah', nameAr: 'منطقة لوجستيات ميناء جدة الإسلامي المطور', nameEn: 'Jeddah Sea Port Hub (Western Coast Node)', dist: '28 كم', delivery: 'صباح اليوم التالي', activeTrucks: '9 شاحنات نشطة', color: '#172a21' },
    { key: 'jubail', nameAr: 'مدينة الجبيل الصناعية (مجمع الهيئة الملكية للتوريد)', nameEn: 'Jubail Industrial City (Heavy Aggregates Node)', dist: '11 كم', delivery: 'خلال ساعتين', activeTrucks: '18 شاحنة نشطة', color: '#283d32' },
    { key: 'dammam', nameAr: 'المنطقة الحرة وميناء الملك عبدالعزيز بالدمام', nameEn: 'King Abdulaziz Port Free-Zone (Gulf Node)', dist: '35 كم', delivery: 'صباح يوم العمل التالي', activeTrucks: '14 شاحنة نشطة', color: '#455d51' },
    { key: 'baghdad', nameAr: 'مشروع تعمير بلدية بغداد ومصفى الدورة', nameEn: 'Baghdad Urban Development (National Hub)', dist: '8 كم', delivery: 'خلال ساعات', activeTrucks: '5 شاحنات نشطة', color: '#0d1814' }
  ];

  const t = translations[lang];

  const categoriesList = [
    { key: 'All Materials', label: t.catAll },
    { key: 'Cement', label: t.catCement },
    { key: 'Steel', label: t.catSteel },
    { key: 'Bricks', label: t.catBricks },
    { key: 'Aggregates', label: t.catAggregates },
    { key: 'Plumbing', label: t.catPlumbing }
  ];

  // Handle local quantity counter
  const handleLocalQtyChange = (materialId: string, delta: number, isBrick = false) => {
    const minStep = isBrick ? 500 : 1;
    const current = quantities[materialId] ?? (isBrick ? 1000 : 1);
    const updated = Math.max(minStep, current + delta * minStep);
    setQuantities({ ...quantities, [materialId]: updated });
  };

  const handleTriggerAdd = (material: MaterialItem) => {
    const qty = quantities[material.id] ?? (material.category === 'Bricks' ? 1000 : 1);
    onAddToCart(material, qty);

    // Animate visual state feedback
    setAddingStates({ ...addingStates, [material.id]: true });
    setTimeout(() => {
      setAddingStates((prev) => ({ ...prev, [material.id]: false }));
    }, 1800);
  };

  // Filter and Sort implementation
  const filteredMaterials = (materialsList || []).filter((item) => {
    const matchesCategory = selectedCategory === 'All Materials' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price') return a.price - b.price;
    return b.rating - a.rating; // Default rating sort
  });

  // Calculations for cart values
  const subtotal = cart.reduce((acc, item) => acc + item.material.price * item.quantity, 0);
  const isCartEmpty = cart.length === 0;
  // Heavy materials shipping logic: $145.00 for normal orders, scaled with volume
  const shippingCost = isCartEmpty ? 0 : 145.00 + (subtotal > 2000 ? 250.00 : 0);
  const estimatedTotal = subtotal + shippingCost;

  // Handle export PDF quote trigger
  const handleExportPDF = () => {
    if (isCartEmpty) {
      alert(lang === 'ar' ? 'الرجاء إضافة مواد أولاً إلى قائمة التوريد (Inventory List) لتصدير الفاتورة.' : 'Please add materials to the supply list first before generating a quote.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert(lang === 'ar' ? 'يرجى السماح بالنوافذ المنبثقة لرؤية الفاتورة المستندة بالكامل!' : 'Please allow popup windows to export this invoice!');
      return;
    }

    const todayStr = new Date().toLocaleDateString(lang === 'ar' ? 'ar-YE' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const uuidStr = 'BENA-' + Math.floor(Math.random() * 900000 + 100000);

    const checklistHtml = cart.map(item => `
      <tr style="border-bottom: 2px solid #e0e3e5;">
        <td style="padding: 12px; font-weight: bold; color: #2d2d2a; text-align: ${lang === 'ar' ? 'right' : 'left'};">${item.material.name}</td>
        <td style="padding: 12px; color: #8e8e7c; text-transform: uppercase; text-align: ${lang === 'ar' ? 'right' : 'left'};">${item.material.supplier}</td>
        <td style="padding: 12px; font-weight: bold; text-align: ${lang === 'ar' ? 'right' : 'left'};">${item.quantity} ${item.material.unit === 'Bag (50kg)' ? t.cartUnitBag :
        item.material.unit === 'Metric Ton' ? t.cartUnitTon :
          item.material.unit === 'Piece' ? t.cartUnitPiece :
            item.material.unit === '6-Meter Length' ? t.cartUnitLength : item.material.unit
      }</td>
        <td style="padding: 12px; font-family: monospace; font-weight: bold; text-align: ${lang === 'ar' ? 'left' : 'right'};">$${(item.material.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>${t.brandName} - ${uuidStr}</title>
          <style>
            body { font-family: 'Georgia', 'Inter', sans-serif; direction: ${lang === 'ar' ? 'rtl' : 'ltr'}; background-color: #f5f5f0; padding: 40px; color: #2d2d2a; }
            .header-bar { border-bottom: 4px solid #5a5a40; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 28px; font-weight: 900; color: #5a5a40; }
            .badge { background: #e2e2d5; color: #5a5a40; padding: 6px 14px; font-weight: bold; font-size: 11px; text-transform: uppercase; border-radius: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 30px 0; background: #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-radius: 12px; overflow: hidden; }
            th { background: #5a5a40; color: white; padding: 12px; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
            .total-table { width: 50%; margin-${lang === 'ar' ? 'right' : 'left'}: auto; margin-${lang === 'ar' ? 'left' : 'right'}: 0; }
            .footer-info { margin-top: 60px; font-size: 11px; color: #8e8e7c; border-top: 2px dashed #d9d9c2; pt: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <div>
              <span class="logo">${t.brandName} - Benaa Industrial</span>
              <p style="margin: 5px 0 0 0; color: #8e8e7c; font-weight: bold;">${t.pdfSub}</p>
            </div>
            <div>
              <span class="badge">${t.pdfISO}</span>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border: 1px solid #d9d9c2; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); margin-bottom: 20px; text-align: ${lang === 'ar' ? 'right' : 'left'};">
            <p><strong>${t.pdfNo}</strong> ${uuidStr}</p>
            <p><strong>${t.pdfDate}</strong> ${todayStr}</p>
            <p><strong>${t.pdfContractor}</strong> compliance@benaa-industrial.com (Verified Contractor)</p>
          </div>

          <table>
            <thead>
              <tr>
                <th style="padding: 12px;">${t.pdfColMaterial}</th>
                <th style="padding: 12px;">${t.pdfColSupplier}</th>
                <th style="padding: 12px;">${t.pdfColQty}</th>
                <th style="padding: 12px; text-align: ${lang === 'ar' ? 'left' : 'right'};">${t.pdfColTotal}</th>
              </tr>
            </thead>
            <tbody>
              ${checklistHtml}
            </tbody>
          </table>

          <table class="total-table">
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding:10px; font-weight: bold;">${t.cartSubtotal}:</td>
              <td style="padding:10px; text-align: ${lang === 'ar' ? 'left' : 'right'}; font-weight: bold;">$${subtotal.toFixed(2)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding:10px; font-weight: bold;">${t.cartShipping}:</td>
              <td style="padding:10px; text-align: ${lang === 'ar' ? 'left' : 'right'}; font-weight: bold;">$${shippingCost.toFixed(2)}</td>
            </tr>
            <tr style="background: #e2e2d5; color: #5a5a40; font-weight: 900; font-size: 18px;">
              <td style="padding:12px;">${t.cartEstimatedTotal} (USD):</td>
              <td style="padding:12px; text-align: ${lang === 'ar' ? 'left' : 'right'};">$${estimatedTotal.toFixed(2)}</td>
            </tr>
          </table>

          <div style="margin-top: 40px; padding: 15px; background: #ffffff; border-${lang === 'ar' ? 'right' : 'left'}: 6px solid #5a5a40; border-radius: 4px; text-align: ${lang === 'ar' ? 'right' : 'left'};">
            <p style="margin: 0; font-weight: bold; font-size: 13px;">${t.pdfDisclaimerTitle}</p>
            <p style="margin: 5px 0 0 0; font-size: 11px; color: #8e8e7c;">${t.pdfDisclaimerDesc}</p>
          </div>

          <div class="footer-info">
            <p>${t.pdfFooter}</p>
            <button id="invoice-print-btn" style="margin-top: 15px; background: #5a5a40; color: white; border: none; padding: 12px 24px; font-weight: bold; border-radius: 20px; cursor: pointer;">${t.pdfPrintBtn}</button>
          </div>
          <script>
            document.getElementById('invoice-print-btn').addEventListener('click', function() {
              window.focus();
              window.print();
            });
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const [checkoutCartCopy, setCheckoutCartCopy] = useState<CartItem[]>([]);

  const handleConfirmPurchase = () => {
    if (isCartEmpty) {
      alert(checkoutT.emptyCartErr);
      return;
    }
    // Snapshot the cart contents for invoicing post-clearance
    setCheckoutCartCopy([...cart]);
    setPaymentMethod('cod');
    setPaymentRefNumber('');
    setPaymentBankName('');
    setCheckoutStep(1);
    setIsCheckoutOpen(true);
  };

  const handleNextStep = () => {
    if (checkoutStep === 1) {
      if (!checkoutName.trim() || !checkoutPhone.trim() || !checkoutEmail.trim()) {
        alert(lang === 'ar' ? 'يرجى ملء الاسم الكامل والبريد ورقم الجوال للمتابعة.' : 'Please enter your Name, Phone and Email to continue.');
        return;
      }
      setCheckoutStep(2);
    } else if (checkoutStep === 2) {
      if (paymentMethod === 'kuraimi' && !paymentRefNumber.trim()) {
        alert(lang === 'ar' ? 'يرجى إدخال رقم حوالة كريمي إكسبرس الفعّال المكون من 9 أرقام لتتبع المعاملة المصرفية.' : 'Please enter the 9-digit Kuraimi Express remittance reference code to proceed.');
        return;
      }
      if (paymentMethod === 'bank' && (!paymentBankName.trim() || !paymentRefNumber.trim())) {
        alert(lang === 'ar' ? 'يرجى إدخال اسم البنك ورقم مرجع الحوالة البنكية لإكمال التسجيل المصرفي.' : 'Please fill in both the Sender Bank Name and Transfer Reference ID to match your deposit.');
        return;
      }
      setCheckoutStep(3);
    }
  };

  const handleFinalCheckoutDispatch = () => {
    setIsDispatching(true);
    // Simulate real enterprise database transmission and fleet dispatching algorithms
    setTimeout(() => {
      const isSaudi = checkoutPhone.includes('+966') || checkoutPhone.startsWith('05') || checkoutPhone.startsWith('5');
      const orderRef = `BENA-${Math.floor(Math.random() * 90000 + 10000)}-${isSaudi ? 'KSA' : 'IQ'}`;
      setFinalOrderId(orderRef);
      setIsDispatching(false);
      setCheckoutStep(4);

      // Save order to central localStorage under 'benaa_orders' for the Admin Panel!
      try {
        const existingOrdersStr = localStorage.getItem('benaa_orders');
        let orderList = [];
        if (existingOrdersStr) {
          orderList = JSON.parse(existingOrdersStr);
        } else {
          orderList = [
            {
              id: 'ORD-10492',
              customerName: 'المهندس عبد الإله عياش',
              customerPhone: '+967 771 234 567',
              products: 'حديد تسليح 12 مم (4 طن)، أسمنت مقاوم (150 كيس)',
              totalAmount: 5120.00,
              paymentMethod: 'كريمي إكسبرس (Kuraimi Express)',
              status: 'New',
              createdAt: '2026-06-08 10:14'
            },
            {
              id: 'ORD-10491',
              customerName: 'شركة السعيد العقارية',
              customerPhone: '+967 733 998 811',
              products: 'بلك أسمنتي ممتاز (3000 حبة)، رمل مغسول (45 متر)',
              totalAmount: 3410.00,
              paymentMethod: 'تحويل مصرفي (CAC Bank)',
              status: 'Under Review',
              createdAt: '2026-06-07 14:32'
            },
            {
              id: 'ORD-10490',
              customerName: 'أكرم محمد الحبيشي',
              customerPhone: '+967 775 554 433',
              products: 'أسمنت الوطنية (50 كيس)',
              totalAmount: 725.00,
              paymentMethod: 'تطبيق بنك الكريمي (Kuraimi App)',
              status: 'Supplied',
              createdAt: '2026-06-05 09:20'
            },
            {
              id: 'ORD-10489',
              customerName: 'صادق يحيى الحيمي',
              customerPhone: '+967 712 345 611',
              products: 'حديد سابك مقاوم (1 طن)',
              totalAmount: 840.00,
              paymentMethod: 'تحويل يدوي (Yemen Kuwait Bank)',
              status: 'Completed',
              createdAt: '2026-06-04 11:15'
            }
          ];
        }

        // Formulate products description from checkoutCartCopy
        const productsDescription = checkoutCartCopy.map(item => `${item.material.name} (${item.quantity} ${item.material.unitAr || item.material.unit})`).join('، ');

        // Calculate dynamic total
        const subtotal = checkoutCartCopy.reduce((acc, item) => acc + item.material.price * item.quantity, 0);
        const deliveryFee = 145.00 + (subtotal > 2000 ? 250.00 : 0);
        const taxFee = subtotal * 0.15;
        const totalWithFees = subtotal + deliveryFee + taxFee;

        const newOrderObj = {
          id: orderRef,
          customerName: checkoutName || 'المهندس عادل الهنيش',
          customerPhone: checkoutPhone || '+966 50 123 4567',
          products: productsDescription || (lang === 'ar' ? 'طاقة توريد لوجستي متكاملة' : 'Integrated Logistics Supplies Load'),
          totalAmount: parseFloat(totalWithFees.toFixed(2)),
          paymentMethod: paymentMethod === 'kuraimi' ? 'كريمي إكسبرس (Kuraimi Express)' : paymentMethod === 'bank' ? 'تحويل مصرفي (Bank Transfer)' : 'الدفع عند الاستلام (COD)',
          status: 'New',
          createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
        };

        // Send order to PHP API
        fetch(`${API_BASE_URL}/create_order.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newOrderObj)
        }).then(response => {
          if (!response.ok) {
            console.error('Failed to save order to database via API');
          }
        }).catch(err => {
          console.error('Error saving order via API:', err);
        });

        orderList.unshift(newOrderObj); // prepend to layout list
        localStorage.setItem('benaa_orders', JSON.stringify(orderList));

        // Dispatch custom storage event to update Admin Panel if mounted
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.error('Error saving order to localStorage', err);
      }

      // Clear parent shopping list
      onClearCart();

      // Show SMS Toast
      setShowSMSAlert(true);
      setTimeout(() => {
        setShowSMSAlert(false);
      }, 7000);
    }, 2400);
  };

  const handleExportStep4PDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert(lang === 'ar' ? 'يرجى السماح بالنوافذ المنبثقة لرؤية شهادة التوريد بالكامل!' : 'Please allow popups to export the supply certificate!');
      return;
    }

    const todayStr = new Date().toLocaleDateString(lang === 'ar' ? 'ar-YE' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const chosenHub = LOGISTICS_HUBS.find(h => h.key === selectedHubKey) || LOGISTICS_HUBS[0];

    const sub = checkoutCartCopy.reduce((acc, item) => acc + item.material.price * item.quantity, 0);
    const ship = 145.00 + (sub > 2000 ? 250.00 : 0);
    const vat = sub * 0.15;
    const finalTot = sub + ship + vat;

    const itemsHtml = checkoutCartCopy.map(item => `
      <tr style="border-bottom: 2px solid #e0e3e5;">
        <td style="padding: 12px; font-weight: bold; color: #2d2d2a; text-align: ${lang === 'ar' ? 'right' : 'left'};">${item.material.name}</td>
        <td style="padding: 12px; color: #8e8e7c; text-align: ${lang === 'ar' ? 'right' : 'left'};">${item.material.supplier}</td>
        <td style="padding: 12px; font-weight: bold; text-align: ${lang === 'ar' ? 'right' : 'left'};">${item.quantity}</td>
        <td style="padding: 12px; font-family: monospace; font-weight: bold; text-align: ${lang === 'ar' ? 'left' : 'right'};">$${(item.material.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>${checkoutT.checkoutTitle} - ${finalOrderId}</title>
          <style>
            body { font-family: 'Inter', sans-serif; direction: ${lang === 'ar' ? 'rtl' : 'ltr'}; background-color: #f4f6f4; padding: 40px; color: #0d1814; }
            .receipt-card { max-width: 800px; margin: 0 auto; background: white; border: 1px solid #cbdcd4; border-radius: 24px; padding: 35px; box-shadow: 0 10px 25px rgba(0,0,0,0.03); }
            .header-bar { border-bottom: 4px solid #1a4332; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 26px; font-weight: 900; color: #1a4332; font-family: serif; }
            .badge { background: #dcf2e8; color: #1a4332; padding: 6px 14px; font-weight: bold; font-size: 11px; text-transform: uppercase; border-radius: 20px; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; font-size: 13px; line-height: 1.6; }
            .meta-label { font-weight: bold; color: #455d51; }
            table { width: 100%; border-collapse: collapse; margin: 25px 0; border-radius: 12px; overflow: hidden; }
            th { background: #1a4332; color: white; padding: 12px; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
            .total-table { width: 50%; margin-${lang === 'ar' ? 'right' : 'left'}: auto; margin-${lang === 'ar' ? 'left' : 'right'}: 0; font-size: 13px; }
            .truck-specs { background: #ecf5f0; padding: 15px; border-radius: 12px; border: 1px solid #cbdcd4; margin-top: 25px; font-size: 12px; }
            .footer { margin-top: 40px; border-top: 2px dashed #cbdcd4; padding-top: 15px; text-align: center; font-size: 11px; color: #455d51; }
          </style>
        </head>
        <body>
          <div class="receipt-card">
            <div class="header-bar">
              <div>
                <span class="logo">بناء - BENAA INDUSTRIAL</span>
                <p style="margin: 5px 0 0 0; color: #455d51; font-weight: 600; font-size: 12px;">مستند تخويل وتعقيب التوريد اللوجستي الفوري</p>
              </div>
              <span class="badge">ISO 9001:2015 CERTIFIED</span>
            </div>

            <div class="meta-grid">
              <div>
                <p><span class="meta-label">${lang === 'ar' ? 'الرقم اللوجستي للطلب:' : 'Cargo Booking #:'}</span> ${finalOrderId}</p>
                <p><span class="meta-label">${lang === 'ar' ? 'تاريخ المعاملة:' : 'Transaction Date:'}</span> ${todayStr}</p>
                <p><span class="meta-label">${lang === 'ar' ? 'اسم المقاول / العميل:' : 'Contractor / Client Name:'}</span> ${checkoutName}</p>
                <p><span class="meta-label">${lang === 'ar' ? 'هاتف التنسيق الفني:' : 'Coordination Phone:'}</span> ${checkoutPhone}</p>
              </div>
              <div>
                <p><span class="meta-label">${lang === 'ar' ? 'منصة التوزيع المعتمدة:' : 'Distribution Hub Assigned:'}</span> ${lang === 'ar' ? chosenHub.nameAr : chosenHub.nameEn}</p>
                <p><span class="meta-label">${lang === 'ar' ? 'تاريخ التوصيل والصب:' : 'Scheduled Delivery Date:'}</span> ${deliveryDate}</p>
                <p><span class="meta-label">${lang === 'ar' ? 'عنوان موقع التشييد:' : 'Site Construction coordinates:'}</span> ${manualAddress || chosenHub.nameAr}</p>
                <p><span class="meta-label">${lang === 'ar' ? 'وسيلة التسوية المعتمدة:' : 'Approved Payment Protocol:'}</span> 
                  <strong style="color: #1a4332;">${paymentMethod === 'kuraimi' ? (lang === 'ar' ? `كريمي إكسبرس (كود الحوالة: #${paymentRefNumber})` : `Kuraimi Express (#${paymentRefNumber})`) :
        paymentMethod === 'bank' ? (lang === 'ar' ? `تحويل بنكي مباشر (بنك: ${paymentBankName} | مرجع: #${paymentRefNumber})` : `Direct Bank Wire (${paymentBankName} - #${paymentRefNumber})`) :
          (lang === 'ar' ? 'الدفع نقداً أو بطاقة مدى عند الاستلام' : 'On-Site Cash / Card on Delivery (COD)')
      }</strong>
                </p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="padding: 12px;">${t.pdfColMaterial}</th>
                  <th style="padding: 12px;">${t.pdfColSupplier}</th>
                  <th style="padding: 12px;">${t.pdfColQty}</th>
                  <th style="padding: 12px; text-align: ${lang === 'ar' ? 'left' : 'right'};">${t.pdfColTotal}</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <table class="total-table">
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px; font-weight: bold;">${t.cartSubtotal}:</td>
                <td style="padding: 8px; text-align: ${lang === 'ar' ? 'left' : 'right'}; font-family: monospace;">$${sub.toFixed(2)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px; font-weight: bold;">${lang === 'ar' ? 'الشحن اللوجستي الثقيل' : 'Heavy Fleet Shipping'}:</td>
                <td style="padding: 8px; text-align: ${lang === 'ar' ? 'left' : 'right'}; font-family: monospace;">$${ship.toFixed(2)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px; font-weight: bold;">${checkoutT.vatTax}:</td>
                <td style="padding: 8px; text-align: ${lang === 'ar' ? 'left' : 'right'}; font-family: monospace;">$${vat.toFixed(2)}</td>
              </tr>
              <tr style="background: #1a4332; color: white; font-weight: 900; font-size: 15px;">
                <td style="padding: 10px;">${lang === 'ar' ? 'إجمالي التعميد المعتمد' : 'Grand Total Authorized'}</td>
                <td style="padding: 10px; text-align: ${lang === 'ar' ? 'left' : 'right'}; font-family: monospace;">$${finalTot.toFixed(2)}</td>
              </tr>
            </table>

            <div class="truck-specs">
              <p style="margin: 0 0 5px 0; font-weight: 900; color: #1a4332;">⚠️ ${lang === 'ar' ? 'ملاحظات سلامة أسطول الشحن الثقيل:' : 'Heavy Duty Transport Specifications & Guidelines:'}</p>
              <p style="margin: 5px 0 0 0; line-height: 1.4;">
                ${deliveryInstructions ? `${lang === 'ar' ? 'تعليمات العميل الخاصة:' : 'Client Explicit instructions:'} "${deliveryInstructions}". <br/>` : ''}
                ${lang === 'ar'
        ? 'تم تعيين شاحنات نقل قلاب / خلاطات خرسانة تتوافق مع نظام الأوزان المحورية المعتمد من هيئة النقل العامة. سيقوم السائق بالاتصال قبل الوصول بنصف ساعة لتسهيل التنزيل ومناورات الحركة.'
        : 'Fitted axle load safety configurations mapped. Operators will ping 30 minutes to checkout arrival coordinates on ground.'}
              </p>
            </div>

            <div class="footer">
              <p>منصة بناء للمواد الإنشائية والمقاييس - Benaa Industrial Marketplace for Verified Supplies</p>
              <p>هذا المستند يعتبر سندا إداريا ورسميا لحجز الموارد ومسار الشواحن. شكراً لثقتكم بنا.</p>
              <button id="checkout-print-btn" style="margin-top: 15px; background: #1a4332; color: white; border: none; padding: 10px 24px; font-weight: bold; border-radius: 20px; cursor: pointer; font-size: 12px;">${t.pdfPrintBtn}</button>
            </div>
          </div>
          <script>
            document.getElementById('checkout-print-btn').addEventListener('click', function() {
              window.focus();
              window.print();
            });
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
      <div className={`flex-1 flex flex-col xl:flex-row min-h-[calc(100vh-80px)] font-sans ${lang === 'ar' ? 'xl:flex-row' : 'xl:flex-row-reverse'}`}>
        {/* Prime catalog left section column */}
        <section className="flex-1 p-5 md:p-8 bg-brand-bg">
          {/* Category horizontal scroll selection container with organic rounded-full layout */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-8 overflow-x-auto pb-2 scrollbar-thin">
            {categoriesList.map((item) => {
              const isSelected = selectedCategory === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setSelectedCategory(item.key)}
                  className={`px-5 py-2.5 font-bold text-xs md:text-sm transition-all focus:outline-none cursor-pointer border rounded-full ${isSelected
                      ? 'bg-primary-brand text-white border-primary-brand shadow-sm scale-102'
                      : 'bg-card-bg text-brand-dark border-brand-outline hover:border-primary-brand'
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Title, Search & sorting controls header */}
          <div className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 text-start`}>
            <div>
              <span className="text-primary-brand font-serif font-bold text-xs uppercase tracking-widest block mb-1">{t.certifiedSupplyBadge}</span>
              <h1 className="font-extrabold text-3xl font-serif text-brand-dark tracking-tight">{t.certifiedSupplyTitle}</h1>
              <p className="text-brand-accent font-semibold text-xs md:text-sm mt-1">
                {t.certifiedSupplyDesc}
              </p>
            </div>

            <div className="flex gap-2 w-full md:w-auto self-end">
              <div className="relative">
                <select
                  className={`appearance-none bg-card-bg border border-brand-outline font-bold text-xs py-2.5 text-brand-dark focus:outline-none focus:border-primary-brand cursor-pointer rounded-full ${lang === 'ar' ? 'pl-8 pr-4' : 'pl-4 pr-8'}`}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="rating">{t.sortByRating}</option>
                  <option value="price">{t.sortByPrice}</option>
                  <option value="name">{t.sortByName}</option>
                </select>
                <ArrowUpDown className={`absolute top-3.5 w-3.5 h-3.5 text-brand-accent pointer-events-none ${lang === 'ar' ? 'left-2.5' : 'right-2.5'}`} />
              </div>

              <button
                className="flex items-center gap-1.5 px-4 py-2.5 border border-brand-outline font-bold text-xs bg-card-bg text-brand-dark hover:border-primary-brand cursor-pointer rounded-full"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Materials');
                  alert(lang === 'ar' ? 'تمت إعادة تعيين الفلاتر!' : 'Filters reset!');
                }}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{t.filterBtn}</span>
              </button>
            </div>
          </div>

          {/* Grid listing the calculated materials */}
          {filteredMaterials.length === 0 ? (
            <div className="bg-card-bg border border-dashed border-brand-outline py-16 text-center rounded-3xl">
              <Info className="w-12 h-12 text-brand-accent/55 mx-auto mb-3" />
              <p className="text-brand-accent font-bold text-base">{t.noMaterialsFound}</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All Materials'); }}
                className="mt-4 bg-primary-brand text-white px-5 py-2 font-bold text-xs rounded-full"
              >
                {t.showAllBtn}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => {
                const localQty = quantities[material.id] ?? (material.category === 'Bricks' ? 1000 : 1);
                const isBrick = material.category === 'Bricks';
                const isAdded = addingStates[material.id];

                return (
                  <div
                    key={material.id}
                    className="group bg-card-bg border border-brand-outline hover:border-primary-brand transition-all shadow-sm rounded-3xl overflow-hidden flex flex-col"
                    id={`material-card-${material.id}`}
                  >
                    {/* Photo container with grayscale hover effect as requested by css */}
                    <div className="aspect-[16/10] bg-card-accent-bg relative overflow-hidden">
                      <img
                        alt={material.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        referrerPolicy="no-referrer"
                        src={material.image}
                      />

                      {/* Position absolute badges */}
                      {material.verified && (
                        <div className={`absolute top-3 bg-primary-brand-container text-primary-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm ${lang === 'ar' ? 'right-3' : 'left-3'}`}>
                          {t.verifiedSupplierBadge}
                        </div>
                      )}
                      {material.topRated && (
                        <div className={`absolute top-3 bg-primary-brand text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm ${lang === 'ar' ? 'right-3' : 'left-3'}`}>
                          {t.topRatedBadge}
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className="font-bold text-brand-dark leading-snug text-sm md:text-base text-start hover:text-primary-brand transition-colors font-serif">
                            {material.name}
                          </h3>
                          <div className="flex items-center gap-1 text-primary-brand shrink-0">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-xs font-extrabold">{material.rating}</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-brand-accent font-bold tracking-tight uppercase mb-3 text-start">
                          {lang === 'ar' ? `المصنع: ${material.supplier}` : `Producer: ${material.supplier}`}
                        </p>

                        <div className="flex items-baseline gap-1 mb-5 text-start">
                          <span className="text-2xl font-bold font-serif text-brand-dark">${material.price.toFixed(2)}</span>
                          <span className="text-xs text-brand-accent font-medium">/ {
                            material.unit === 'Bag (50kg)' ? t.cartUnitBag :
                              material.unit === 'Metric Ton' ? t.cartUnitTon :
                                material.unit === 'Piece' ? t.cartUnitPiece :
                                  material.unit === '6-Meter Length' ? t.cartUnitLength : material.unit
                          }</span>
                        </div>
                      </div>

                      <div>
                        {/* Flex control for numerical selector and shopping add button */}
                        <div className="flex items-center gap-2">
                          {/* Selector counters */}
                          <div className="flex flex-1 border border-brand-outline overflow-hidden h-11 bg-card-accent-bg rounded-full p-0.5">
                            <button
                              type="button"
                              className="px-3 hover:bg-card-bg transition-colors text-brand-dark font-bold flex items-center justify-center focus:outline-none rounded-full"
                              onClick={() => handleLocalQtyChange(material.id, -1, isBrick)}
                            >
                              <Minus className="w-3" />
                            </button>
                            <input
                              type="text"
                              className="w-full text-center font-bold border-none focus:ring-0 text-xs bg-transparent pointer-events-none text-brand-dark font-sans"
                              value={localQty}
                              readOnly
                            />
                            <button
                              type="button"
                              className="px-3 hover:bg-card-bg transition-colors text-brand-dark font-bold flex items-center justify-center focus:outline-none rounded-full"
                              onClick={() => handleLocalQtyChange(material.id, 1, isBrick)}
                            >
                              <Plus className="w-3" />
                            </button>
                          </div>

                          {/* Direct Add CTA button */}
                          <button
                            type="button"
                            onClick={() => handleTriggerAdd(material)}
                            className={`px-5 h-11 text-xs font-bold transition-all flex items-center gap-1.5 focus:outline-none uppercase rounded-full cursor-pointer ${isAdded
                                ? 'bg-brand-dark text-white'
                                : 'bg-primary-brand text-white hover:bg-opacity-95'
                              }`}
                          >
                            {isAdded ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary-brand-container animate-bounce" />
                                <span>{t.cartAdded}</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>{t.cartAdd}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bento Styled Extra Info banner section */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
            <div className="lg:col-span-2 bg-primary-brand-container text-brand-dark p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-3xl border border-brand-outline">
              <div className="text-start">
                <span className="text-primary-brand font-bold text-xs uppercase tracking-widest block mb-1">{t.bulkOfferBadge}</span>
                <h2 className="text-xl font-serif text-brand-dark leading-snug">{t.bulkOfferTitle}</h2>
                <p className="text-brand-accent text-xs font-semibold mt-1 max-w-xl">
                  {t.bulkOfferDesc}
                </p>
              </div>
              <button
                id="bulk-quotation-trigger-btn"
                onClick={() => {
                  setBulkName(user?.name || '');
                  setBulkPhone('');
                  setBulkCity('');
                  setBulkMaterialClass('Cement');
                  setBulkEstQuantity('100');
                  setBulkNotes('');
                  setIsBulkSuccess(false);
                  setGeneratedBulkId('');
                  setIsBulkQuoteOpen(true);
                }}
                className="bg-primary-brand text-white font-bold px-6 py-3 text-xs tracking-wider hover:bg-opacity-90 transition-all rounded-full cursor-pointer shrink-0"
              >
                {t.bulkOfferCTA}
              </button>
            </div>

            <div className="bg-card-bg border border-brand-outline p-6 flex flex-col justify-center rounded-3xl">
              <div className="flex items-center gap-2 text-primary-brand font-extrabold text-sm mb-2 text-start">
                <Truck className="w-5 h-5 shrink-0" />
                <span>{t.fleetTitle}</span>
              </div>
              <p className="text-xs text-brand-accent leading-relaxed font-semibold text-start">
                {t.fleetDesc}
              </p>
            </div>
          </div>
        </section>

        {/* Cart side panel with nice order breakdown list elements */}
        <aside className={`w-full xl:w-96 bg-card-bg border-t xl:border-t-0 p-6 flex flex-col justify-between shrink-0 font-sans ${lang === 'ar' ? 'xl:border-r border-brand-outline' : 'xl:border-l border-brand-outline'}`}>
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-outline">
              <h2 className="font-extrabold text-base flex items-center gap-2 text-brand-dark font-serif">
                <ShoppingBasket className="w-5 h-5 text-primary-brand" />
                {t.cartProposedList}
              </h2>
              <span className="bg-primary-brand-container text-primary-brand px-3 py-1 rounded-full font-bold text-xs">
                {t.cartMaterialsCount.replace('{count}', cart.length.toString())}
              </span>
            </div>

            {/* Cart items listing elements */}
            {isCartEmpty ? (
              <div className="py-12 text-center text-brand-accent">
                <ShoppingCart className="w-10 h-10 text-brand-outline mx-auto mb-2" />
                <p className="font-bold text-xs uppercase tracking-wider">{t.cartEmpty}</p>
                <p className="text-[11px] text-brand-accent mt-1">{t.cartEmptyDesc}</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.material.id} className="group pb-4 border-b border-brand-outline flex justify-between items-start gap-4 text-start">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-xs text-brand-dark leading-tight block text-start font-serif">{item.material.name}</span>
                        <span className="font-mono font-bold text-xs text-brand-dark">${(item.material.price * item.quantity).toFixed(2)}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-brand-accent font-semibold tracking-tight">
                        <span>{lang === 'ar' ? 'الكمية: ' : 'Qty: '}{item.quantity} {
                          item.material.unit === 'Bag (50kg)' ? t.cartUnitBag :
                            item.material.unit === 'Metric Ton' ? t.cartUnitTon :
                              item.material.unit === 'Piece' ? t.cartUnitPiece :
                                item.material.unit === '6-Meter Length' ? t.cartUnitLength : item.material.unit
                        }</span>
                        <button
                          onClick={() => onRemoveFromCart(item.material.id)}
                          className="text-red-500 hover:text-red-700 flex items-center gap-0.5 font-bold text-[10px] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {t.cartRemove}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={onClearCart}
                  className="w-full py-2.5 bg-brand-bg hover:bg-brand-outline/40 text-brand-dark font-bold text-xs transition-colors rounded-full cursor-pointer border border-brand-outline"
                >
                  {t.cartClearAll}
                </button>
              </div>
            )}
          </div>

          {/* Pricing calculations details footer panels */}
          <div className="mt-8 pt-6 border-t border-brand-outline">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-semibold text-brand-accent">{t.cartSubtotal}</span>
              <span className="text-sm font-bold text-brand-dark font-mono">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center mb-5">
              <span className="text-xs font-semibold text-brand-accent">{t.cartShipping}</span>
              <span className="text-sm font-bold text-brand-dark font-mono">
                {isCartEmpty ? '$0.00' : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between items-center mb-8 pb-4 border-b border-dashed border-brand-outline">
              <span className="text-sm font-bold text-brand-dark font-serif">{t.cartEstimatedTotal}</span>
              <span className="text-2xl font-bold text-primary-brand font-mono">${estimatedTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleConfirmPurchase}
              disabled={isCartEmpty}
              className={`w-full py-3.5 text-white font-bold text-xs uppercase tracking-widest transition-all focus:outline-none rounded-full cursor-pointer ${isCartEmpty
                  ? 'bg-brand-outline text-brand-accent cursor-not-allowed shadow-none'
                  : 'bg-primary-brand hover:bg-opacity-95'
                }`}
            >
              {t.cartConfirmCTA}
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isCartEmpty}
              className={`w-full py-3 mt-3 text-brand-dark font-bold text-xs uppercase border transition-all flex items-center justify-center gap-1.5 rounded-full cursor-pointer ${isCartEmpty
                  ? 'bg-card-accent-bg text-brand-accent border-brand-outline cursor-not-allowed'
                  : 'bg-card-bg border-brand-outline hover:border-primary-brand text-primary-brand'
                }`}
            >
              <FileDown className="w-4 h-4" />
              {t.cartExportPDF}
            </button>
          </div>
        </aside>
      </div>

      {/* Interactive Checkout Wizard Overlay */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div key="checkout-modal" className="fixed inset-0 bg-brand-dark/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-card-bg border border-brand-outline rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col text-start relative shadow-2xl"
            >
              {/* Modal sticky top header */}
              <div className="sticky top-0 bg-card-bg/95 backdrop-blur-md px-6 py-5 border-b border-brand-outline flex justify-between items-center z-10">
                <div>
                  <h3 className="font-extrabold text-lg text-brand-dark font-serif flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary-brand" />
                    {checkoutT.checkoutTitle}
                  </h3>
                  <p className="text-[11px] text-brand-accent font-semibold mt-1">
                    {checkoutT.checkoutSub}
                  </p>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-1.5 hover:bg-brand-bg rounded-full text-brand-accent hover:text-brand-dark transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Steps Progress Header Indicator */}
              <div className="px-6 py-4 bg-card-accent-bg border-b border-brand-outline flex justify-between items-center text-xs font-bold text-brand-accent">
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${checkoutStep >= 1 ? 'bg-primary-brand text-white' : 'bg-brand-outline text-brand-accent'}`}>1</span>
                  <span className={checkoutStep === 1 ? 'text-primary-brand underline font-black text-center' : ''}>{checkoutT.step1}</span>
                </div>
                <div className="h-0.5 bg-brand-outline flex-1 mx-4"></div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${checkoutStep >= 2 ? 'bg-primary-brand text-white' : 'bg-brand-outline text-brand-accent'}`}>2</span>
                  <span className={checkoutStep === 2 ? 'text-primary-brand underline font-black text-center' : ''}>{checkoutT.step2}</span>
                </div>
                <div className="h-0.5 bg-brand-outline flex-1 mx-4"></div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${checkoutStep >= 3 ? 'bg-primary-brand text-white' : 'bg-brand-outline text-brand-accent'}`}>3</span>
                  <span className={checkoutStep === 3 ? 'text-primary-brand underline font-black text-center' : ''}>{checkoutT.step3}</span>
                </div>
                <div className="h-0.5 bg-brand-outline flex-1 mx-4"></div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${checkoutStep >= 4 ? 'bg-[#36d19a] text-white' : 'bg-brand-outline text-brand-accent'}`}>4</span>
                  <span className={checkoutStep === 4 ? 'text-[#36d19a] font-black text-center' : ''}>{checkoutT.step4}</span>
                </div>
              </div>

              {/* Steps Content Body Wrapper */}
              <div className="p-6 flex-1 overflow-y-auto">
                {checkoutStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">{checkoutT.fullName} <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          className="w-full bg-brand-bg border border-brand-outline rounded-full px-5 py-3 text-xs md:text-sm font-semibold text-brand-dark focus:border-primary-brand focus:outline-none"
                          placeholder={checkoutT.fullNamePlaceholder}
                          value={checkoutName}
                          onChange={(e) => setCheckoutName(e.target.value)}
                        />
                        <Briefcase className="absolute right-4 top-3.5 w-4 h-4 text-brand-accent" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">{checkoutT.phone} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            className="w-full bg-brand-bg border border-brand-outline rounded-full px-5 py-3 text-xs md:text-sm font-semibold text-brand-dark focus:border-primary-brand focus:outline-none focus:ring-0"
                            placeholder={checkoutT.phonePlaceholder}
                            value={checkoutPhone}
                            onChange={(e) => setCheckoutPhone(e.target.value)}
                          />
                          <Phone className="absolute right-4 top-3.5 w-4 h-4 text-brand-accent" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">{checkoutT.email} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            className="w-full bg-brand-bg border border-brand-outline rounded-full px-5 py-3 text-xs md:text-sm font-semibold text-brand-dark focus:border-primary-brand focus:outline-none"
                            placeholder={checkoutT.emailPlaceholder}
                            value={checkoutEmail}
                            onChange={(e) => setCheckoutEmail(e.target.value)}
                          />
                          <Mail className="absolute right-4 top-3.5 w-4 h-4 text-brand-accent pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">{checkoutT.crNo}</label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full bg-brand-bg border border-brand-outline rounded-full px-5 py-3 text-xs md:text-sm font-semibold text-brand-dark focus:border-primary-brand focus:outline-none"
                          placeholder={checkoutT.crNoPlaceholder}
                          value={checkoutCR}
                          onChange={(e) => setCheckoutCR(e.target.value)}
                        />
                        <Building2 className="absolute right-4 top-3.5 w-4 h-4 text-brand-accent" />
                      </div>
                    </div>
                  </div>
                )}

                {checkoutStep === 2 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">{checkoutT.mapSelect}</label>

                      {/* Stylized custom Grid Map simulation element */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {LOGISTICS_HUBS.map((hub) => {
                          const isSelected = selectedHubKey === hub.key;
                          return (
                            <button
                              key={hub.key}
                              type="button"
                              onClick={() => {
                                setSelectedHubKey(hub.key);
                                // Prepopulate address field with nice text template
                                setManualAddress(lang === 'ar' ? `محور ${hub.nameAr} - جوار ساحة الصب الرئيسية` : `${hub.nameEn} Node, next to structural crane yard`);
                              }}
                              className={`p-3.5 rounded-2xl border text-start transition-all relative ${isSelected
                                  ? 'bg-primary-brand-container border-primary-brand ring-2 ring-primary-brand/20 text-brand-dark'
                                  : 'bg-card-bg border-brand-outline hover:border-brand-accent text-brand-dark'
                                }`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-extrabold text-xs md:text-sm">
                                  {lang === 'ar' ? hub.nameAr : hub.nameEn}
                                </span>
                                {isSelected && <Check className="w-4 h-4 text-primary-brand shrink-0" />}
                              </div>
                              <div className="flex gap-2 text-[10px] text-brand-accent font-semibold tracking-tight mt-1.5">
                                <span className="bg-brand-bg dark:bg-[#18201a] px-2 py-0.5 rounded-full">{lang === 'ar' ? 'المسافة:' : 'Dist:'} {hub.dist}</span>
                                <span className="text-primary-brand font-bold">{hub.activeTrucks}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">{checkoutT.manualAddress}</label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full bg-brand-bg border border-brand-outline rounded-full px-5 py-3 text-xs md:text-sm font-semibold text-brand-dark focus:border-primary-brand focus:outline-none"
                          placeholder={checkoutT.manualAddressPlaceholder}
                          value={manualAddress}
                          onChange={(e) => setManualAddress(e.target.value)}
                        />
                        <MapPin className="absolute right-4 top-3.5 w-4 h-4 text-brand-accent pointer-events-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">{checkoutT.deliveryDate}</label>
                        <div className="relative">
                          <input
                            type="date"
                            className="w-full bg-brand-bg border border-brand-outline rounded-full px-5 py-3 text-xs font-semibold text-brand-dark focus:border-primary-brand focus:outline-none appearance-none"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                          />
                          <Calendar className="absolute right-4 top-3.5 w-4 h-4 text-brand-accent pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">{checkoutT.timeSlot}</label>
                        <div className="relative">
                          <select
                            className="w-full bg-brand-bg border border-brand-outline rounded-full px-5 py-3 text-xs font-bold text-brand-dark focus:border-primary-brand focus:outline-none appearance-none"
                            value={deliveryTimeSlot}
                            onChange={(e) => setDeliveryTimeSlot(e.target.value as any)}
                          >
                            <option value="morning">{checkoutT.timeMorning}</option>
                            <option value="afternoon">{checkoutT.timeAfternoon}</option>
                            <option value="night">{checkoutT.timeNight}</option>
                          </select>
                          <Clock className="absolute right-4 top-3.5 w-4 h-4 text-brand-accent pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">{checkoutT.specialInstructions}</label>
                      <textarea
                        rows={2}
                        className="w-full bg-brand-bg border border-brand-outline rounded-2xl px-5 py-3 text-xs font-semibold text-brand-dark focus:border-primary-brand focus:outline-none"
                        placeholder={checkoutT.specialInstructionsPlaceholder}
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                      />
                    </div>

                    {/* HIGH-FIDELITY BILINGUAL PAYMENT WORKSPACE */}
                    <div className="pt-4 border-t border-brand-outline space-y-4">
                      <div>
                        <h4 className="text-xs font-black uppercase text-brand-dark tracking-widest flex items-center gap-2 mb-1">
                          <CreditCard className="w-4 h-4 text-primary-brand" />
                          {lang === 'ar' ? 'بوابة التمويل ووسيلة الدفع الإلكتروني المعتمدة' : 'Verified Funding Protocol & Payment Channel'}
                        </h4>
                        <p className="text-[10px] text-brand-accent font-semibold">
                          {lang === 'ar'
                            ? 'اختر طريقة التسوية لتعميد الطلبية وحجز مسار الشاحنات الآمن'
                            : 'Select your settlement option for instant supply booking and fleet guarantee'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Option 1: Credit / Kuraimi Express */}
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMethod('kuraimi');
                            setPaymentRefNumber('');
                          }}
                          className={`p-4 rounded-2xl border text-start flex flex-col justify-between transition-all relative ${paymentMethod === 'kuraimi'
                              ? 'bg-[#1a4332]/5 border-primary-brand ring-2 ring-primary-brand/10'
                              : 'bg-card-bg border-brand-outline hover:border-brand-accent'
                            }`}
                        >
                          <div className="flex justify-between items-center w-full mb-2">
                            <Coins className="w-5 h-5 text-amber-500" />
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded">
                              {lang === 'ar' ? 'فوري وآمن' : 'Instant'}
                            </span>
                          </div>
                          <div>
                            <p className="font-extrabold text-xs text-brand-dark">
                              {lang === 'ar' ? 'كريمي إكسبرس' : 'Kuraimi Express'}
                            </p>
                            <p className="text-[9px] text-brand-accent font-semibold mt-1">
                              {lang === 'ar' ? 'حوالة عبر جوال أو شبكة الكريمي' : 'Direct Kuraimi instant transfer'}
                            </p>
                          </div>
                          {paymentMethod === 'kuraimi' && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-[#1a4332] rounded-full" />
                          )}
                        </button>

                        {/* Option 2: Bank Transfer */}
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMethod('bank');
                            setPaymentRefNumber('');
                            setPaymentBankName('');
                          }}
                          className={`p-4 rounded-2xl border text-start flex flex-col justify-between transition-all relative ${paymentMethod === 'bank'
                              ? 'bg-[#1a4332]/5 border-primary-brand ring-2 ring-primary-brand/10'
                              : 'bg-card-bg border-brand-outline hover:border-brand-accent'
                            }`}
                        >
                          <div className="flex justify-between items-center w-full mb-2">
                            <Wallet className="w-5 h-5 text-[#1a4332]" />
                            <span className="text-[9px] bg-emerald-100 text-[#1a4332] font-extrabold px-1.5 py-0.5 rounded">
                              {lang === 'ar' ? 'للمنشآت' : 'Corporate'}
                            </span>
                          </div>
                          <div>
                            <p className="font-extrabold text-xs text-brand-dark">
                              {lang === 'ar' ? 'حوالة بنكية مباشرة' : 'Bank Transfer'}
                            </p>
                            <p className="text-[9px] text-brand-accent font-semibold mt-1">
                              {lang === 'ar' ? 'الراجحي، الأهلي، أو حساباتنا المباشرة' : 'Direct wire to verified accounts'}
                            </p>
                          </div>
                          {paymentMethod === 'bank' && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-[#1a4332] rounded-full" />
                          )}
                        </button>

                        {/* Option 3: COD */}
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMethod('cod');
                            setPaymentRefNumber('');
                          }}
                          className={`p-4 rounded-2xl border text-start flex flex-col justify-between transition-all relative ${paymentMethod === 'cod'
                              ? 'bg-[#1a4332]/5 border-primary-brand ring-2 ring-primary-brand/10'
                              : 'bg-card-bg border-brand-outline hover:border-brand-accent'
                            }`}
                        >
                          <div className="flex justify-between items-center w-full mb-2">
                            <Truck className="w-5 h-5 text-stone-500" />
                            <span className="text-[9px] bg-stone-100 text-stone-700 font-extrabold px-1.5 py-0.5 rounded">
                              {lang === 'ar' ? 'شائع بموقع صب' : 'On delivery'}
                            </span>
                          </div>
                          <div>
                            <p className="font-extrabold text-xs text-brand-dark">
                              {lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                            </p>
                            <p className="text-[9px] text-brand-accent font-semibold mt-1">
                              {lang === 'ar' ? 'نقداً أو عبر قارئ بطاقة مدى/فيزا' : 'Cash or card reader at site'}
                            </p>
                          </div>
                          {paymentMethod === 'cod' && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-[#1a4332] rounded-full" />
                          )}
                        </button>
                      </div>

                      {/* DYNAMIC DEPENDENT PAYMENT SPECIFIC FORMS WITH HIGH FIDELITY INPUTS */}
                      <AnimatePresence mode="wait">
                        {paymentMethod === 'kuraimi' && (
                          <motion.div
                            key="kuraimi-form"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60 text-xs space-y-3"
                          >
                            <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-1.5 text-brand-dark">
                              <p className="font-bold text-amber-900 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                {lang === 'ar' ? 'بيانات استقبال الحوالة عبر الكريمي:' : 'Kuraimi Remittance Direct Details:'}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] leading-relaxed">
                                <p>{lang === 'ar' ? '• اسم المستلم المعتمد:' : '• Beneficiary:'} <strong className="text-[#1a4332]">منصة بناء للمواد الإنشائية المحدودة</strong></p>
                                <p>{lang === 'ar' ? '• رقم هاتف المفوض:' : '• Phone / Mobile:'} <strong className="text-brand-dark">+966 50 123 4567</strong></p>
                                <p>{lang === 'ar' ? '• رقم حساب كريمي مباشر:' : '• Kuraimi Direct Account:'} <strong className="text-[#1a4332] font-mono">301292839</strong></p>
                                <p>{lang === 'ar' ? '• رقم الحساب المميز:' : '• VIP Account ID:'} <strong className="text-brand-dark font-mono">YE32KURI301292839</strong></p>
                              </div>
                              <p className="text-[10px] text-amber-700 font-semibold mt-1">
                                {lang === 'ar'
                                  ? '⚠️ يرجى سداد قيمة الفاتورة عبر كريمي إكسبرس أو إرسال التحويل المباشر للحساب أعلاه وكتابة رمز الحوالة بالأسفل للتحقق ومطابقة الطلب فورا.'
                                  : '⚠️ Please initiate the payment via Kuraimi app/counter and secure the 9-digit transaction reference.'}
                              </p>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-amber-900 mb-1.5">
                                {lang === 'ar' ? 'أدخل رقم حوالة كريمي إكسبرس المكون من 9 أرقام' : 'Enter 9-Digit Kuraimi Express Reference Code'} <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                className="w-full bg-white border border-amber-300 rounded-full px-5 py-2.5 text-xs font-bold text-brand-dark focus:border-amber-500 focus:outline-none font-mono"
                                placeholder="e.g. 981729384"
                                value={paymentRefNumber}
                                onChange={(e) => setPaymentRefNumber(e.target.value.replace(/\D/g, ''))}
                              />
                            </div>
                          </motion.div>
                        )}

                        {paymentMethod === 'bank' && (
                          <motion.div
                            key="bank-form"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-200/60 text-xs space-y-3"
                          >
                            <div className="p-3 bg-white border border-emerald-200 rounded-xl space-y-1.5 text-brand-dark">
                              <p className="font-bold text-[#1a4332] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                {lang === 'ar' ? 'تفاصيل الحسابات المصرفية الرسمية المعتمدة:' : 'Official Certified Escrow Bank Accounts:'}
                              </p>
                              <div className="space-y-1.5 text-[11px] leading-relaxed">
                                <div className="p-1.5 bg-emerald-50/50 rounded-lg">
                                  <p>🏦 <strong className="text-brand-dark">{lang === 'ar' ? 'مصرف الراجحي (KSA):' : 'Al Rajhi Bank (KSA):'}</strong></p>
                                  <p>{lang === 'ar' ? 'الآيبان:' : 'IBAN:'} <strong className="font-mono text-xs text-[#1a4332]">SA82 8000 0002 9183 9102 9384</strong></p>
                                </div>
                                <div className="p-1.5 bg-emerald-50/50 rounded-lg">
                                  <p>🏦 <strong className="text-brand-dark">{lang === 'ar' ? 'البنك الأهلي السعودي (SNB):' : 'Saudi National Bank (SNB):'}</strong></p>
                                  <p>{lang === 'ar' ? 'الآيبان:' : 'IBAN:'} <strong className="font-mono text-xs text-[#1a4332]">SA43 4000 0001 8293 8471 9283</strong></p>
                                </div>
                              </div>
                              <p className="text-[10px] text-[#1a4332] font-semibold mt-1">
                                {lang === 'ar'
                                  ? '⚠️ يرجى تحويل قيمة الفاتورة وإدخال اسم البنك ورقم العملية بالأسفل لسلامة التعميد.'
                                  : '⚠️ Perform direct wire transfer and enter original sender bank + authorization number.'}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold text-emerald-900 mb-1.5">
                                  {lang === 'ar' ? 'اسم البنك المحوّل منه' : 'Sender Bank Name'} <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  className="w-full bg-white border border-emerald-300 rounded-full px-5 py-2.5 text-xs font-semibold text-brand-dark focus:border-[#1a4332] focus:outline-none"
                                  placeholder={lang === 'ar' ? 'مثال: مصرف الراجحي' : 'e.g. Al Rajhi Bank'}
                                  value={paymentBankName}
                                  onChange={(e) => setPaymentBankName(e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-emerald-900 mb-1.5">
                                  {lang === 'ar' ? 'رقم التحويل / مرجع العملية المصرفية' : 'Bank Transaction Reference ID'} <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  className="w-full bg-white border border-emerald-300 rounded-full px-5 py-2.5 text-xs font-semibold text-brand-dark focus:border-[#1a4332] focus:outline-none font-mono"
                                  placeholder="e.g. TX-918273938"
                                  value={paymentRefNumber}
                                  onChange={(e) => setPaymentRefNumber(e.target.value)}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {paymentMethod === 'cod' && (
                          <motion.div
                            key="cod-info"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1"
                          >
                            <p className="font-bold text-stone-900">
                              🚚 {lang === 'ar' ? 'بروتوكول الدفع الميداني (عند تفريغ الشاحنات):' : 'On-Site Cash / Terminal POS Payment Protocol:'}
                            </p>
                            <p className="leading-relaxed">
                              {lang === 'ar'
                                ? 'سيقوم سائق بناء بإحضار جهاز الدفع الإلكتروني اللاسلكي (مدى / فيزا) إلى المشروع. يمكنك الدفع بالكامل عند معاينة جودة المواد الإنشائية وتفريغ الحمولة بكل أمان.'
                                : 'Our certified logistic driver will present a credit/mada payment terminal upon raw material unloading. Fully check high-standards before card clearance.'}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {checkoutStep === 3 && (
                  <div className="space-y-6">
                    {/* Items table review of cached items */}
                    <div>
                      <h4 className="text-xs font-black uppercase text-brand-accent tracking-widest mb-3">{checkoutT.orderSummary}</h4>
                      <div className="bg-card-accent-bg border border-brand-outline rounded-2xl p-4 space-y-3 max-h-[160px] overflow-y-auto">
                        {checkoutCartCopy.map((item) => (
                          <div key={item.material.id} className="flex justify-between items-center text-xs pb-2 border-b border-brand-outline last:border-0 last:pb-0 text-brand-dark">
                            <div className="text-start">
                              <p className="font-extrabold">{item.material.name}</p>
                              <p className="text-[10px] text-brand-accent font-semibold">{item.material.supplier}</p>
                            </div>
                            <div className="text-left font-mono shrink-0">
                              <span>{item.quantity} × </span>
                              <span className="font-black">${item.material.price.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Highly polished billing breakdown widget style */}
                    <div className="bg-brand-bg rounded-2xl p-5 border border-brand-outline text-xs space-y-3">
                      <h4 className="font-black text-primary-brand uppercase tracking-wider mb-2">{checkoutT.priceDetails}</h4>

                      <div className="flex justify-between items-center text-brand-accent">
                        <span className="font-semibold">{t.cartSubtotal}</span>
                        <span className="font-mono font-bold text-brand-dark">${checkoutCartCopy.reduce((acc, item) => acc + item.material.price * item.quantity, 0).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center text-brand-accent">
                        <span className="font-semibold">{t.cartShipping}</span>
                        <span className="font-mono font-bold text-brand-dark">${(145.00 + (checkoutCartCopy.reduce((acc, item) => acc + item.material.price * item.quantity, 0) > 2000 ? 250.00 : 0)).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center text-brand-accent">
                        <span className="font-semibold">{checkoutT.vatTax}</span>
                        <span className="font-mono font-bold text-brand-dark">${(checkoutCartCopy.reduce((acc, item) => acc + item.material.price * item.quantity, 0) * 0.15).toFixed(2)}</span>
                      </div>

                      <div className="h-px bg-brand-outline my-1"></div>

                      <div className="flex justify-between items-center text-sm font-extrabold text-brand-dark">
                        <span>{checkoutT.finalTotal}</span>
                        <span className="font-mono text-lg text-primary-brand font-black">
                          ${(
                            checkoutCartCopy.reduce((acc, item) => acc + item.material.price * item.quantity, 0) +
                            (145.00 + (checkoutCartCopy.reduce((acc, item) => acc + item.material.price * item.quantity, 0) > 2000 ? 250.00 : 0)) +
                            (checkoutCartCopy.reduce((acc, item) => acc + item.material.price * item.quantity, 0) * 0.15)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Logistics Fleet Destination Review Indicator Badge */}
                    <div className="p-3.5 bg-primary-brand-container border border-primary-brand/20 rounded-xl flex gap-3 items-start text-xs text-[#1a4332]">
                      <Truck className="w-5 h-5 text-primary-brand shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">
                          {lang === 'ar' ? 'مسار أسطول الشحن المفتوح:' : 'Active Fleet Dispatch Pathway:'}
                        </p>
                        <p className="text-[11px] leading-relaxed font-semibold text-brand-accent mt-1">
                          {lang === 'ar'
                            ? `توصيل شواحن بناء الثقيلة إلى (${manualAddress || 'على المحور المحدد'}) بتعليمات الصب: "${deliveryInstructions || 'مناورة عادية'}" في ${deliveryDate}.`
                            : `Dispatch route scheduled to (${manualAddress || 'assigned node'}) with notes: "${deliveryInstructions || 'standard drop'}" on ${deliveryDate}.`}
                        </p>
                      </div>
                    </div>

                    {/* Selected Payment Method summary badge */}
                    <div className={`p-3.5 border rounded-xl flex gap-3 items-start text-xs ${paymentMethod === 'kuraimi'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : paymentMethod === 'bank'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-stone-55 border-stone-200 text-stone-900'
                      }`}>
                      <CreditCard className={`w-5 h-5 shrink-0 mt-0.5 ${paymentMethod === 'kuraimi' ? 'text-amber-500' : paymentMethod === 'bank' ? 'text-[#1a4332]' : 'text-stone-500'
                        }`} />
                      <div>
                        <p className="font-bold text-[11px] uppercase tracking-wider">
                          {lang === 'ar' ? 'طريقة الدفع المعتمدة للطلب:' : 'Selected Payment Method Status:'}
                        </p>
                        <p className="text-[11px] leading-relaxed font-semibold mt-1">
                          {paymentMethod === 'kuraimi' && (
                            lang === 'ar'
                              ? `كريمي إكسبرس (التحقق معلق) - كود الحوالة المرجعي: #${paymentRefNumber}`
                              : `Kuraimi Express Remittance (Verification Pending) - Refer ID: #${paymentRefNumber}`
                          )}
                          {paymentMethod === 'bank' && (
                            lang === 'ar'
                              ? `تحويل بنكي مباشر - البنك المحول منه: ${paymentBankName} | رقم مرجع العملية: #${paymentRefNumber}`
                              : `Direct Bank Wire - Sender Bank: ${paymentBankName} | Transaction #: #${paymentRefNumber}`
                          )}
                          {paymentMethod === 'cod' && (
                            lang === 'ar'
                              ? 'الدفع نقداً أو مدى/فيزا عند الاستلام والمطابقة بالموقع (COD)'
                              : 'On-Site Cash or Terminal Card payment upon delivery (COD)'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {checkoutStep === 4 && (
                  <div className="text-center py-6 space-y-5">
                    {/* Celebration Big Animated Tick Circle */}
                    <div className="w-16 h-16 bg-[#dcf2e8] text-[#36d19a] rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg border border-[#cbdcd4]">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-black text-2xl text-brand-dark font-serif">{checkoutT.orderSuccessTitle}</h3>
                      <p className="text-xs text-brand-accent max-w-md mx-auto leading-relaxed font-semibold">
                        {checkoutT.orderSuccessDesc}
                      </p>
                    </div>

                    {/* Order metadata info panel */}
                    <div className="bg-brand-bg rounded-2xl p-5 border border-brand-outline text-xs max-w-sm mx-auto text-start space-y-2">
                      <p className="font-bold text-brand-accent uppercase tracking-wider text-[10px]">{checkoutT.orderSuccessNo}</p>
                      <p className="font-mono text-lg font-black text-[#1a4332] dark:text-primary-brand tracking-wider leading-none">{finalOrderId}</p>
                      <div className="pt-2 border-t border-brand-outline text-[11px] font-semibold text-brand-accent space-y-1">
                        <p>{lang === 'ar' ? 'الاسم:' : 'Recipient:'} <span className="font-bold text-brand-dark">{checkoutName}</span></p>
                        <p>{lang === 'ar' ? 'العنوان:' : 'Site:'} <span className="font-semibold text-brand-dark">{manualAddress}</span></p>
                        <p>{lang === 'ar' ? 'التسليم المجدول:' : 'Delivery Window:'} <span className="font-bold text-brand-dark">{deliveryDate} ({deliveryTimeSlot})</span></p>
                        <p>{lang === 'ar' ? 'طريقة السداد الموثقة:' : 'Certified Settlement Method:'} <span className="font-bold text-primary-brand">
                          {paymentMethod === 'kuraimi' ? (lang === 'ar' ? `كريمي إكسبرس (حوالة مرجعية: #${paymentRefNumber})` : `Kuraimi Express Remit (#${paymentRefNumber})`) :
                            paymentMethod === 'bank' ? (lang === 'ar' ? `حوالة مصرفية (${paymentBankName} - كود: #${paymentRefNumber})` : `Direct Bank Wire (${paymentBankName} - #${paymentRefNumber})`) :
                              (lang === 'ar' ? 'الدفع الميداني عند الاستلام' : 'On-Site Cash/Card on Delivery (COD)')}
                        </span></p>
                      </div>
                    </div>

                    {/* Real-time Truck preparation progress bar tracker */}
                    <div className="max-w-md mx-auto bg-card-accent-bg border border-brand-outline p-4 rounded-xl space-y-3.5">
                      <p className="text-[10px] uppercase font-bold text-brand-accent text-start tracking-wider">{lang === 'ar' ? 'حالة التتبع ومسار الأسطول المباشر:' : 'TELEMETRY STATUS & DISPATCH LIVE FEED:'}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-primary-brand flex items-center gap-1">● {lang === 'ar' ? 'تم حجز طاقة المورد والشاحنة' : 'Truck loaded & scheduled'}</span>
                          <span className="text-brand-accent">74% {lang === 'ar' ? 'تحميل كامل' : 'Load density'}</span>
                        </div>
                        <div className="w-full bg-brand-bg h-2 rounded-full overflow-hidden border border-brand-outline">
                          <div className="bg-[#36d19a] h-full rounded-full animate-pulse" style={{ width: '74%' }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Dispatch success interactive actions buttons */}
                    <div className="flex flex-col gap-2 max-w-sm mx-auto pt-4 font-sans">
                      <button
                        onClick={handleExportStep4PDF}
                        className="w-full bg-[#1a4332] hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all border-none"
                      >
                        <FileDown className="w-4 h-4" />
                        {checkoutT.downReceipt}
                      </button>

                      <button
                        onClick={() => {
                          alert(lang === 'ar' ? 'تم إنشاء رابط محادثة مشفرة مع أسطول الدعم اللوجستي ورقم التتبع.' : 'Opening WhatsApp encrypted support channel...');
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all border-none"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {checkoutT.whatsappTrack}
                      </button>

                      <button
                        onClick={() => setIsCheckoutOpen(false)}
                        className="w-full bg-brand-bg hover:bg-brand-outline/30 text-brand-dark font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-full cursor-pointer transition-all border border-brand-outline"
                      >
                        {checkoutT.backToCatalog}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky bottom CTA actions on checkout dialog */}
              {checkoutStep < 4 && (
                <div className="sticky bottom-0 bg-card-bg border-t border-brand-outline p-5 flex justify-between items-center z-10 font-sans">
                  {checkoutStep === 1 ? (
                    <button
                      onClick={() => setIsCheckoutOpen(false)}
                      className="px-5 py-3 rounded-full border border-brand-outline text-brand-dark font-bold text-xs uppercase cursor-pointer bg-transparent"
                    >
                      {checkoutT.cancelBtn}
                    </button>
                  ) : (
                    <button
                      onClick={() => setCheckoutStep(prev => prev - 1)}
                      className="px-5 py-3 rounded-full border border-brand-outline text-brand-dark font-bold text-xs uppercase cursor-pointer bg-transparent"
                    >
                      {checkoutT.prevBtn}
                    </button>
                  )}

                  {checkoutStep < 3 ? (
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-primary-brand text-white font-bold text-xs uppercase rounded-full cursor-pointer hover:bg-opacity-95 border-none"
                    >
                      {checkoutT.nextBtn}
                    </button>
                  ) : (
                    <button
                      onClick={handleFinalCheckoutDispatch}
                      disabled={isDispatching}
                      className="px-6 py-3 bg-[#1a4332] text-white font-bold text-xs uppercase rounded-full cursor-pointer hover:bg-opacity-95 flex items-center gap-1.5 border-none disabled:bg-brand-accent disabled:cursor-not-allowed"
                    >
                      {isDispatching ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>{checkoutT.processingOrder}</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>{checkoutT.confirmDispatchBtn}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating high fidelity simulated SMS Text message alert overlay popup */}
      <AnimatePresence>
        {showSMSAlert && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed bottom-6 ${lang === 'ar' ? 'right-6' : 'left-6'} z-50 bg-[#0d1814] text-white border border-[#1b3d2f] p-4 rounded-2xl w-full max-w-sm shadow-2xl flex gap-3 text-start items-start font-sans`}
          >
            <div className="w-10 h-10 bg-[#122c22] border border-[#1b3d2f] rounded-full flex items-center justify-center shrink-0 text-[#36d19a]">
              <Phone className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center text-[10px] text-brand-accent font-bold tracking-widest uppercase">
                <span>SMS ALERT: BENAA_LOGISTICS</span>
                <span>{lang === 'ar' ? 'الآن' : 'JUST NOW'}</span>
              </div>
              <p className="text-xs font-semibold leading-relaxed text-stone-200">
                {lang === 'ar'
                  ? `عزيزنا العميل في ${checkoutName}، تم بنجاح تعميد طلب التوريد اللوجستي رقم ${finalOrderId} لأسطول النقل. تتبع مباشر للسائق عبر الرابط المرسل.`
                  : `Dear ${checkoutName}, your supply request ${finalOrderId} is officially scheduled. Check driver dispatch location live here.`}
              </p>
              <p className="text-[10px] text-[#36d19a] font-bold">benaa.com/track/{finalOrderId}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowSMSAlert(false)}
              className="text-stone-400 hover:text-white shrink-0 bg-transparent border-none cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Bulk Quotation RFQ Modal Overlay */}
      <AnimatePresence>
        {isBulkQuoteOpen && (
          <div key="bulk-rfq-modal" className="fixed inset-0 bg-brand-dark/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-card-bg border border-brand-outline rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col text-start relative shadow-2xl"
            >
              {/* Modal header */}
              <div className="sticky top-0 bg-card-bg/95 backdrop-blur-md px-6 py-5 border-b border-brand-outline flex justify-between items-center z-10">
                <div>
                  <h3 className="font-extrabold text-lg text-brand-dark font-serif flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-brand" />
                    {lang === 'ar' ? 'بناء - طلب تسعيرة مخصصة ومخفضة' : 'Benaa - Request Bulk Discount Price'}
                  </h3>
                  <p className="text-[11px] text-brand-accent font-semibold mt-1">
                    {lang === 'ar'
                      ? 'أدخل بياناتك وكميات التوريد المطلوبة للحصول على أفضل سعر إنشائي مباشر من الإدارة العليا'
                      : 'Provide company particulars and target volumes to activate premium discounted rates.'}
                  </p>
                </div>
                <button
                  onClick={() => setIsBulkQuoteOpen(false)}
                  className="p-1.5 hover:bg-brand-bg rounded-full text-brand-accent hover:text-brand-dark transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal body container */}
              <div className="p-6 overflow-y-auto flex-1">
                {!isBulkSuccess ? (
                  <form onSubmit={handleBulkQuoteSubmit} className="space-y-4">
                    {/* Name input */}
                    <div>
                      <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                        {lang === 'ar' ? 'اسم المنشأة أو العميل' : 'Company or Client Name'} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          className="w-full bg-brand-bg border border-brand-outline rounded-full px-5 py-3 text-xs md:text-sm font-semibold text-brand-dark focus:border-primary-brand focus:outline-none"
                          placeholder={lang === 'ar' ? 'مثال: شركة أديل الإنشائية المحدودة' : 'e.g., Adel Construction Ltd.'}
                          value={bulkName}
                          onChange={(e) => setBulkName(e.target.value)}
                        />
                        <Briefcase className="absolute right-4 top-3.5 w-4 h-4 text-brand-accent" />
                      </div>
                    </div>

                    {/* Phone input */}
                    <div>
                      <label className="block text-xs font-bold text-[#1a4332] dark:text-primary-brand uppercase tracking-wider mb-2">
                        {lang === 'ar' ? 'رقم جوال التنسيق وعروض الأسعار' : 'Active Mobile Contact'} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          className="w-full bg-brand-bg border border-brand-outline rounded-full px-5 py-3 text-xs md:text-sm font-semibold text-brand-dark focus:border-primary-brand focus:outline-none"
                          placeholder={lang === 'ar' ? 'مثال: 0501234567' : 'e.g., +966501234567'}
                          value={bulkPhone}
                          onChange={(e) => setBulkPhone(e.target.value)}
                        />
                        <Phone className="absolute right-4 top-3.5 w-4 h-4 text-brand-accent" />
                      </div>
                    </div>

                    {/* City/Delivery Hub input */}
                    <div>
                      <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                        {lang === 'ar' ? 'مدينة وموقع المشروع الرئيسي بالتفصيل' : 'Construction Site City'} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          className="w-full bg-brand-bg border border-brand-outline rounded-full px-5 py-3 text-xs md:text-sm font-semibold text-brand-dark focus:border-primary-brand focus:outline-none"
                          placeholder={lang === 'ar' ? 'مثال: الرياض، حي الياسمين' : 'e.g., Riyadh, Yasmin district'}
                          value={bulkCity}
                          onChange={(e) => setBulkCity(e.target.value)}
                        />
                        <MapPin className="absolute right-4 top-3.5 w-4 h-4 text-brand-accent" />
                      </div>
                    </div>

                    {/* Two columns: Material category & Expected volume */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                          {lang === 'ar' ? 'نوع المركبة الإنشائية المطلوبة' : 'Material Class Interest'}
                        </label>
                        <div className="relative">
                          <select
                            className="w-full bg-brand-bg border border-brand-outline rounded-full px-5 py-2.5 text-xs font-bold text-brand-dark focus:border-primary-brand focus:outline-none appearance-none"
                            value={bulkMaterialClass}
                            onChange={(e) => setBulkMaterialClass(e.target.value)}
                          >
                            <option value="Cement">{lang === 'ar' ? 'أسمنت وتأسيس صلب' : 'Cement & Hardener Bags'}</option>
                            <option value="Steel">{lang === 'ar' ? 'حديد تسليح سابك / الراجحي' : 'SABIC Reinforced Steel'}</option>
                            <option value="Bricks">{lang === 'ar' ? 'طوب أحمر هولدي / عازل' : 'Clay & Red Bricks'}</option>
                            <option value="Aggregates">{lang === 'ar' ? 'ركام صلب وبحص خرساني' : 'Subbase & Aggregate cargo'}</option>
                          </select>
                          <Briefcase className="absolute right-4 top-3.5 w-4 h-4 text-brand-accent pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                          {lang === 'ar' ? 'الكمية التقديرية (طن / وحدة)' : 'Estimated Bulk Quantity'}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full bg-brand-bg border border-brand-outline rounded-full px-5 py-2.5 text-xs font-semibold text-brand-dark focus:border-primary-brand focus:outline-none"
                            placeholder="e.g., 150 Tons / 30,000 Units"
                            value={bulkEstQuantity}
                            onChange={(e) => setBulkEstQuantity(e.target.value)}
                          />
                          <Clock className="absolute right-4 top-3.5 w-4 h-4 text-brand-accent pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Notes/Instructions */}
                    <div>
                      <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                        {lang === 'ar' ? 'أي تفاصيل أو طلب مواصفة فنية للأوزان' : 'Special requirements & notes (Optional)'}
                      </label>
                      <textarea
                        rows={2}
                        className="w-full bg-brand-bg border border-brand-outline rounded-2xl px-5 py-3 text-xs font-semibold text-brand-dark focus:border-primary-brand focus:outline-none"
                        placeholder={lang === 'ar' ? 'أدخل أي مواصفات خاصة بكسر الخرسانة أو مقاومة الكبريتات...' : 'Detail specifications list...'}
                        value={bulkNotes}
                        onChange={(e) => setBulkNotes(e.target.value)}
                      />
                    </div>

                    {/* Action triggers */}
                    <div className="pt-4 border-t border-brand-outline flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setIsBulkQuoteOpen(false)}
                        className="px-5 py-3 rounded-full border border-brand-outline text-brand-dark font-bold text-xs uppercase cursor-pointer bg-transparent"
                      >
                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmittingBulk}
                        className="px-6 py-3 bg-[#1a4332] text-white font-bold text-xs uppercase rounded-full cursor-pointer hover:bg-opacity-95 flex items-center gap-2 border-none disabled:bg-brand-accent"
                      >
                        {isSubmittingBulk ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>{lang === 'ar' ? 'جاري إعداد التسعيرة المثلى...' : 'Synthesizing matrix quotation...'}</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 text-white" />
                            <span>{lang === 'ar' ? 'إرسال طلب السعر المخصّص' : 'Send RFQ price inquiry'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-5">
                    {/* Clean Animated success check badge */}
                    <div className="w-16 h-16 bg-[#dcf2e8] text-[#36d19a] rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg border border-[#cbdcd4]">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-black text-2xl text-brand-dark font-serif">
                        {lang === 'ar' ? 'تم استلام طلب التسعيرة بنجاح!' : 'Bulk pricing inquiry queued!'}
                      </h3>
                      <p className="text-xs text-[#1a4332] font-black max-w-md mx-auto leading-relaxed bg-[#ecf5f0] p-4 rounded-2xl border border-[#cbdcd4]">
                        {lang === 'ar'
                          ? 'سيتم التواصل معك لتقديم أفضل وأقل الأسعار الإنشائية المباشرة من فريق المقاييس والعمليات التابع لـ بناء بمجرد موافقة إدارة التوريد.'
                          : 'Our pricing dispatch and estimating crew will contact you momentarily with our best tailor-made discounted price offer.'}
                      </p>
                    </div>

                    {/* Summary receipt info */}
                    <div className="bg-brand-bg rounded-2xl p-5 border border-brand-outline text-xs max-w-sm mx-auto text-start space-y-2">
                      <p className="font-bold text-brand-accent uppercase tracking-wider text-[10px]">
                        {lang === 'ar' ? 'رقم طلب التسعيرة المخفضة (RFQ):' : 'BULK QUOTATION REFERENCE #:'}
                      </p>
                      <p className="font-mono text-lg font-black text-[#1a4332] tracking-wider leading-none">
                        {generatedBulkId}
                      </p>
                      <div className="pt-2 border-t border-brand-outline text-[11px] font-semibold text-brand-accent space-y-1">
                        <p>{lang === 'ar' ? 'اسم العميل / المنشأة:' : 'Client Name:'} <span className="font-bold text-brand-dark">{bulkName}</span></p>
                        <p>{lang === 'ar' ? 'جوال التنسيق المسجل:' : 'Phone Contact:'} <span className="font-bold text-brand-dark">{bulkPhone}</span></p>
                        <p>{lang === 'ar' ? 'المدينة وموقع الصب:' : 'Project City:'} <span className="font-bold text-brand-dark">{bulkCity}</span></p>
                        <p>{lang === 'ar' ? 'مركبة المواد المطلوبة:' : 'Material Spec:'} <span className="font-bold text-brand-dark">{bulkMaterialClass}</span></p>
                      </div>
                    </div>

                    <div className="pt-4 max-w-sm mx-auto">
                      <button
                        onClick={() => setIsBulkQuoteOpen(false)}
                        className="w-full bg-[#1a4332] hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-full cursor-pointer transition-all border-none"
                      >
                        {lang === 'ar' ? 'العودة لكتالوج المورّدين' : 'Back to Materials Catalog'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
