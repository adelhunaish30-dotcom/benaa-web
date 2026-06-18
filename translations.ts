export interface AppTranslations {
  brandName: string;
  brandSub: string;
  contractorPortal: string;
  verifiedContractor: string;
  aiHelperBtn: string;
  searchPlaceholder: string;
  allMaterials: string;
  demandEstimateTitle: string;
  demandEstimateDesc: string;
  calcLoadTitle: string;
  calculateBtn: string;
  quoteCTA: string;
  quoteDescAlert: string;
  langToggle: string;
  themeLight: string;
  themeDark: string;
  logIn: string;
  logOut: string;
  loginTitle: string;
  loginDesc: string;
  fullName: string;
  emailAddress: string;
  submitLogin: string;
  welcomeBack: string;
  guestUser: string;
  noAlerts: string;
  profileDetails: string;
  
  // Tabs
  tabMaterials: string;
  tabCalculators: string;
  tabEngineers: string;
  tabProjects: string;
  tabBlueprints: string;
  tabSafety: string;
  tabSupport: string;

  // Categories
  catAll: string;
  catCement: string;
  catSteel: string;
  catBricks: string;
  catAggregates: string;
  catPlumbing: string;

  // Marketplace
  certifiedSupplyBadge: string;
  certifiedSupplyTitle: string;
  certifiedSupplyDesc: string;
  sortByRating: string;
  sortByPrice: string;
  sortByName: string;
  filterBtn: string;
  noMaterialsFound: string;
  showAllBtn: string;
  verifiedSupplierBadge: string;
  topRatedBadge: string;
  cartUnitBag: string;
  cartUnitTon: string;
  cartUnitPiece: string;
  cartUnitLength: string;
  cartAdded: string;
  cartAdd: string;
  bulkOfferBadge: string;
  bulkOfferTitle: string;
  bulkOfferDesc: string;
  bulkOfferCTA: string;
  bulkOfferAlert: string;
  fleetTitle: string;
  fleetDesc: string;

  // Cart
  cartProposedList: string;
  cartMaterialsCount: string;
  cartEmpty: string;
  cartEmptyDesc: string;
  cartClearAll: string;
  cartRemove: string;
  cartSubtotal: string;
  cartShipping: string;
  cartEstimatedTotal: string;
  cartConfirmCTA: string;
  cartExportPDF: string;
  cartConfirmAlert: string;

  // Calculator
  calcPrecisionBadge: string;
  calcMainTitle: string;
  calcMainDesc: string;
  calcCertTitle: string;
  calcCertDesc: string;
  calcStep1: string;
  calcStep2: string;
  calcMaterialConcrete: string;
  calcMaterialSteel: string;
  calcMaterialBricks: string;
  calcLengthLabel: string;
  calcWidthLabel: string;
  calcDepthLabel: string;
  calcGradeLabel: string;
  calcWastageLabel: string;
  calc3dTitle: string;
  calc3dDesc: string;
  calcLiveResults: string;
  calcCertId: string;
  calcVolumeLabel: string;
  calcVolumeUnit: string;
  calcCementLabel: string;
  calcCementDesc: string;
  calcCementUnit: string;
  calcSandLabel: string;
  calcSandDesc: string;
  calcSandUnit: string;
  calcGravelLabel: string;
  calcGravelDesc: string;
  calcGravelUnit: string;
  calcTotalWeightLabel: string;
  calcTotalWeightUnit: string;
  calcEquationNote: string;
  calcGeneratePDFBtn: string;
  calcAddAllBtn: string;
  calcExpertTips: string;
  calcNextTip: string;

  // Engineers
  engPortalTitle: string;
  engPortalDesc: string;
  engConsultantBadge: string;
  engActiveBadge: string;
  engAdelTitle: string;
  engAdelSub: string;
  engAdelCTA: string;
  engAmmarTitle: string;
  engAmmarSub: string;
  engAmmarCTA: string;

  // Projects
  projActiveTitle: string;
  projActiveDesc: string;
  projActiveInfo: string;
  projAddBtn: string;

  // Blueprints
  bluePortalTitle: string;
  bluePortalDesc: string;
  blueDragDrop: string;
  blueMaxLimit: string;
  blueUploadBtn: string;

  // Safety
  safeOshaTitle: string;
  safeOshaDesc: string;
  safeCheck1: string;
  safeCheck2: string;
  safeCheck3: string;

  // Support
  suppPortalTitle: string;
  suppPortalDesc: string;
  suppPhoneTitle: string;
  suppEmailTitle: string;
  suppSubtopicTitle: string;
  suppTopicPlaceholder: string;
  suppDescPlaceholder: string;
  suppSendBtn: string;

  // PDF Translation Elements
  pdfTitle: string;
  pdfSub: string;
  pdfISO: string;
  pdfNo: string;
  pdfDate: string;
  pdfContractor: string;
  pdfColMaterial: string;
  pdfColSupplier: string;
  pdfColQty: string;
  pdfColTotal: string;
  pdfDisclaimerTitle: string;
  pdfDisclaimerDesc: string;
  pdfFooter: string;
  pdfPrintBtn: string;
}

export const translations: Record<'ar' | 'en', AppTranslations> = {
  ar: {
    brandName: "بناء",
    brandSub: "Benaa",
    contractorPortal: "بوابة المقاولين",
    verifiedContractor: "عضو معتمد لـ بناء",
    aiHelperBtn: "المساعد الذكي لبناء",
    searchPlaceholder: "البحث متاح...",
    allMaterials: "كافة المستلزمات",
    demandEstimateTitle: "تقدير حمولة الأساس",
    demandEstimateDesc: "السمك المقترح: {thickness}م، حديد تسليح: {steel} كجم/م³",
    calcLoadTitle: "حاسبة الأحمال السريعة",
    calculateBtn: "تقدير حمولة الأساس",
    quoteCTA: "طلب تسعيرة متكاملة",
    quoteDescAlert: "مرحباً بك! جاري تحضير عرض الأسعار الفوري، يمكنك إضافة المواد المحددة أولاً ثم طلب التسعيرة.",
    langToggle: "English",
    themeLight: "الوضع النهاري",
    themeDark: "الوضع الليلي",
    logIn: "تسجيل الدخول",
    logOut: "تسجيل الخروج",
    loginTitle: "بوابة تسجيل الدخول",
    loginDesc: "سجل الدخول باستخدام الاسم والبريد الإلكتروني للوصول لكامل الفواتير وتخصيصات المقايسات الإنشائية المعتمدة.",
    fullName: "الاسم الكامل",
    emailAddress: "البريد الإلكتروني",
    submitLogin: "الدخول الآمن والاعتماد",
    welcomeBack: "مرحباً بك مجدداً،",
    guestUser: "زائر (غير مسجل)",
    noAlerts: "لا توجد تنبيهات جديدة حالياً. نظام التتبع في الخدمة!",
    profileDetails: "تسجيل الدخول الحالي: {email}\nرتبة المقاول: مقاول معتمد من بناء (Verified Contractor)",

    tabMaterials: "المركبات والمواد",
    tabCalculators: "أدوات الحساب",
    tabEngineers: "المهندسون",
    tabProjects: "المشاريع",
    tabBlueprints: "المخططات الهندسية",
    tabSafety: "الأمان والسلامة المهنية",
    tabSupport: "الدعم الفني المباشر",

    catAll: "كافة المواد",
    catCement: "أسمنت",
    catSteel: "حديد",
    catBricks: "طوب",
    catAggregates: "ركام وبحص",
    catPlumbing: "سباكة",

    certifiedSupplyBadge: "توريد احترافي معتمد",
    certifiedSupplyTitle: "مواد البناء والتأسيس المعتمدة",
    certifiedSupplyDesc: "مأخوذة من موردين صناعيين موثوقين وخاضعة لمواصفات ASTM الدولية والهندسية.",
    sortByRating: "ترتيب: التقييم الأرفع",
    sortByPrice: "ترتيب: السعر الأنسب",
    sortByName: "ترتيب: الاسم أبجدياً",
    filterBtn: "تصفية",
    noMaterialsFound: "لا توجد مواد تطابق خيارات التصفية الحالية.",
    showAllBtn: "عرض كافة المستلزمات",
    verifiedSupplierBadge: "مورد معتمد ✓",
    topRatedBadge: "ممتاز ★ TOP",
    cartUnitBag: "كيس (50 كجم)",
    cartUnitTon: "طن متري",
    cartUnitPiece: "حبة",
    cartUnitLength: "6 أمتار طول",
    cartAdded: "مضاف",
    cartAdd: "إضافة",
    bulkOfferBadge: "عروض خاصة فائقة",
    bulkOfferTitle: "خصومات وعروض التوريد الضخمة (Bulk Orders)",
    bulkOfferDesc: "للطلبيات التي تتجاوز 50 طناً مترياً أو 10 آلاف وحدة طوب، تواصل معنا فوراً لتفعيل اللوجستية وتخفيض التكاليف بمعدل 22%.",
    bulkOfferCTA: "طلب تسعيرة مخفضة",
    bulkOfferAlert: "مرحباً! تم تفعيل خط الاتصال بقسم الشركات الكبرى. سيتواصل معك مستشار لوجستي خلال دقائق.",
    fleetTitle: "أسطول النقل واللوجستية",
    fleetDesc: "تتبع مباشر عبر الـ GPS لكافة المركبات وشاحنات نقل الأسمنت المبردة، لضمان وصول شحنتك طازجة وبشكل آمن تماماً.",

    cartProposedList: "قائمة التوريد المقترحة",
    cartMaterialsCount: "{count} مواد",
    cartEmpty: "سلتك خالية حالياً",
    cartEmptyDesc: "أضف بعض مواد البناء للبدء بحساب التكلفة",
    cartClearAll: "تفريغ القائمة بالكامل",
    cartRemove: "حذف",
    cartSubtotal: "المجموع الفرعي للاحتياج",
    cartShipping: "الشحن الثقيل والتوزيع اللوجستي",
    cartEstimatedTotal: "إجمالي التكلفة التقديرية",
    cartConfirmCTA: "تأكيد التوريد وحجز الشاحنات",
    cartExportPDF: "تصدير الفاتورة والشهادة (PDF)",
    cartConfirmAlert: "تم تأكيد قائمة المواد التوريدية الإنشائية بنجاح!\nالمجموع: ${total}\nتم حجز المواد وجاري إعداد تفاصيل التحميل اللوجستية وتوزيع حمولة الوزن.",

    calcPrecisionBadge: "دقة هندسية موثقة",
    calcMainTitle: "حاسبة الكميات الإنشائية بالذكاء الاصطناعي",
    calcMainDesc: "أداة فريدة لتقدير أحجام وموازين البناء بدقة كاملة. احسب كميات الأسمنت والرمل والبحص استناداً لدرجات الخرسانة وسماكتها هندسياً.",
    calcCertTitle: "شهادة هندسية معتمدة",
    calcCertDesc: "مطابق لمعيار ISO 9001:2015 COMPLIANT",
    calcStep1: "01. حدد نوع المادة الهيكلية (SELECT STRUCTURAL MATERIAL)",
    calcStep2: "02. المعايير الهندسية والأحجام (GEOMETRIC PARAMETERS)",
    calcMaterialConcrete: "خرسانة مسلحة",
    calcMaterialSteel: "حديد التسليح",
    calcMaterialBricks: "الطوب والأقواس",
    calcLengthLabel: "الطول الإجمالي (متر)",
    calcWidthLabel: "العرض Lateral (متر)",
    calcDepthLabel: "السمك / العمق (متر)",
    calcGradeLabel: "فئة رتبة الخرسانة المقترحة",
    calcWastageLabel: "نسبة الفاقد والهدر الإضافية (Wastage Limit)",
    calc3dTitle: "المعاينة الهيكلية ثلاثية الأبعاد (Live Structural Preview)",
    calc3dDesc: "حجم المقايسة الإنشائية: {vol} متر مكعب (m³)",
    calcLiveResults: "النتائج المباشرة للمقايسة",
    calcCertId: "الرقم المعرف المعتمد: #{id}",
    calcVolumeLabel: "حجم الصب الإجمالي المقدر",
    calcVolumeUnit: "متر مكعب (m³)",
    calcCementLabel: "أكياس الأسمنت OPC 53",
    calcCementDesc: "أسمنت بورتلاندي ممتاز (وزن 50 كجم)",
    calcCementUnit: "كيس",
    calcSandLabel: "الرمل الناعم الممتاز",
    calcSandDesc: "رمل مطابق لمعيار Zone II Standard",
    calcSandUnit: "قدم³",
    calcGravelLabel: "الركام والبحص الخشن",
    calcGravelDesc: "حجر مكسر ومغسول (مقاس 20 مم)",
    calcGravelUnit: "قدم³",
    calcTotalWeightLabel: "الوزن المقدر للمواد الإنشائية",
    calcTotalWeightUnit: "طن متري",
    calcEquationNote: "تتضمن هذه التقديرات الفنية الموثقة معامل هدر حجم الأسمنت الخرساني الجاف لـ 1.54 مع هدر {wastage}%. مطابق للمقاييس الهندسية العالمية.",
    calcGeneratePDFBtn: "تصدير تقرير الكميات والمواصفات (Generate PDF)",
    calcAddAllBtn: "إضافة كافة مستلزمات الحساب فوراً للسلة",
    calcExpertTips: "نصائح وملاحظات مهندسي بناء الاستشارية",
    calcNextTip: "النصيحة التالية ⚡",

    engPortalTitle: "بوابة مهندسي بناء الاستشارية",
    engPortalDesc: "تواصل مع أفضل الاستشاريين والمكاتب الهندسية المعتمدة لحساب المخططات وتقديم تقارير السلامة الإنشائية ومطابقة المواد المطلوبة.",
    engConsultantBadge: "استشاري أول",
    engActiveBadge: "نشط الآن",
    engAdelTitle: "د.م. عادل حنيش",
    engAdelSub: "دكتوراه في الهندسة وتماسك هياكل المنشآت الخرسانية المقاومة",
    engAdelCTA: "طلب استشارة فنية 💬",
    engAmmarTitle: "المهندس عمار السامعي",
    engAmmarSub: "استشاري فحص التشققات وتحديد رتب الأسمنت المكسور بالموجات",
    engAmmarCTA: "اتصال مباشر فوري 📞",

    projActiveTitle: "المشروعات النشطة والمطابقة",
    projActiveDesc: "هنا يمكنك إدارة مشاريعك الإنشائية النشطة، وحساب متطلباتها من الأسمنت والحديد والطوب تلقائياً بالربط مع حاسبة بناء الذكية.",
    projActiveInfo: "مشروع في طور البناء: فيلا سكنية - أمانة العاصمة. تحتاج إلى حزمة خرسانة مسلحة بإجمالي حجم صب 42.50 متر مكعب. تم حجز المواد بنجاح في السلة اللوجستية.",
    projAddBtn: "إضافة مشروع جديد كلياً",

    bluePortalTitle: "بوابة المخططات الهندسية (Blueprints Portal)",
    bluePortalDesc: "بصفتك مقاولاً معتمداً، يمكنك رفع ملفات المخططات الإنشائية وتفويض حاسبتنا الذكية لقراءة الأحجام وتحديد كمية الأسمنت والحديد المناسبة كحد أقصى للميزانية.",
    blueDragDrop: "اسحب ملف المخطط الهندسي وألصقه هنا (AutoCAD / PDF)",
    blueMaxLimit: "الحد الأقصى للملف: 50 ميجابايت بمواصفات DWG",
    blueUploadBtn: "تحديد ورفع المخطط الحالي",

    safeOshaTitle: "السلامة المهنية والأمان في الموقع (OSHA Compliant)",
    safeOshaDesc: "تلتزم منصة بناء بأعلى معايير السلامة المهنية ومطابقة لوائح الأمان الإنشائية. استعرض قائمة المستندات والمعدات الإلزامية في الموقع:",
    safeCheck1: "خوذات الرأس مع تهوية متقدمة ومطابقة لمواصفات ANSI Z89.1 للوقاية من الارتطامات.",
    safeCheck2: "نظام التبريد المائي وشحن ركام الأسمنت المبرّد لتفادي جفاف الخلطات المبكر.",
    safeCheck3: "أحذية الأمان الفولاذية ونظارات الوقاية من تطاير المكونات الخشنة أثناء التحميل.",

    suppPortalTitle: "مركز الدعم والمساعدة الفورية لبناء",
    suppPortalDesc: "هل تحتاج إلى استشارة عاجلة بخصوص نسب خلط الخرسانة أو توافر حديد التسليح ونقل البحص؟ فريق مهندسي بناء في خدمتك طوال الـ 24 ساعة.",
    suppPhoneTitle: "الرقم الموحد المركزي للتوريد",
    suppEmailTitle: "البريد الإلكتروني للتحقق والامتثال",
    suppSubtopicTitle: "أرسل استفسارك وسنعاود الاتصال بك خلال 10 دقائق:",
    suppTopicPlaceholder: "عنوان الموضوع الإنشائي (مثال: إجهاد خرسانة M25)",
    suppDescPlaceholder: "اشرح معايير الطلب أو حمولة البناء المطلوبة...",
    suppSendBtn: "إرسال استفسار الدعم ⚡",

    pdfTitle: "بناء - عرض وعقد توريد مواد إنشائية",
    pdfSub: "عقد تقدير التوريد الصناعي ومقايسة الشحن الجوي/البري",
    pdfISO: "معتمد ISO 9001:2015",
    pdfNo: "رقم شهادة التوريد المعتمدة:",
    pdfDate: "التاريخ الصادر:",
    pdfContractor: "جهة الطلب:",
    pdfColMaterial: "المادة الإنشائية",
    pdfColSupplier: "المورد Verified",
    pdfColQty: "الكمية المطلوبة",
    pdfColTotal: "المجموع الإجمالي",
    pdfDisclaimerTitle: "تنويه الأمان والجودة:",
    pdfDisclaimerDesc: "جميع المواد المسردة أعلاه تطابق مواصفات الجودة والأنظمة الهندسية المحلية والدولية ASTM وACI وتحتوي على ضمان كامل ومستندات شهادة التصنيع.",
    pdfFooter: "© 2026 شركة بناء الصناعية للتوريدات المحدودة والحلول الهندسية وإدارة المشروعات. جميع الحقوق محفوظة.",
    pdfPrintBtn: "طباعة وتنزيل PDF المباشر"
  },
  en: {
    brandName: "Benaa",
    brandSub: "بناء",
    contractorPortal: "Contractor Portal",
    verifiedContractor: "Certified Benaa Member",
    aiHelperBtn: "Benaa AI Support",
    searchPlaceholder: "Search catalog...",
    allMaterials: "All Materials",
    demandEstimateTitle: "Foundation Load Estimation",
    demandEstimateDesc: "Suggested Thickness: {thickness}m, Rebar reinforcement: {steel} kg/m³",
    calcLoadTitle: "Quick Load Estimator",
    calculateBtn: "Estimate Foundation Load",
    quoteCTA: "Request Completed Quote",
    quoteDescAlert: "Welcome! We are preparing your instant quotation. Please add materials to the list first.",
    langToggle: "العربية",
    themeLight: "Light Theme",
    themeDark: "Dark Mode",
    logIn: "Sign In",
    logOut: "Logout",
    loginTitle: "Login Gate",
    loginDesc: "Log in with your Name and Email to view complete itemized quotes and receive ISO-compliant PDF certificates.",
    fullName: "Full Name",
    emailAddress: "Email Address",
    submitLogin: "Secure Sign In",
    welcomeBack: "Welcome back,",
    guestUser: "Guest (Not Registered)",
    noAlerts: "No new notifications. Tracking system is active!",
    profileDetails: "Logged in as: {email}\nContractor Status: Verified Benaa Contractor",

    tabMaterials: "Vehicles & Materials",
    tabCalculators: "Calculators",
    tabEngineers: "Consulting Engineers",
    tabProjects: "Active Projects",
    tabBlueprints: "Construction Blueprints",
    tabSafety: "Occupational Safety",
    tabSupport: "Live Support Helpline",

    catAll: "All Materials",
    catCement: "Cement",
    catSteel: "Steel",
    catBricks: "Bricks",
    catAggregates: "Aggregates",
    catPlumbing: "Plumbing",

    certifiedSupplyBadge: "Certified Industrial Supply",
    certifiedSupplyTitle: "Certified Building & Foundation Materials",
    certifiedSupplyDesc: "Sourced directly from verified manufacturers and compliant with international ASTM standards.",
    sortByRating: "Sort: Highest Rating",
    sortByPrice: "Sort: Best Price",
    sortByName: "Sort: A-Z Alphabetical",
    filterBtn: "Filter",
    noMaterialsFound: "No materials match the current filters.",
    showAllBtn: "Show All Material catalog",
    verifiedSupplierBadge: "Verified Supplier ✓",
    topRatedBadge: "Top Standard ★",
    cartUnitBag: "Bag (50kg)",
    cartUnitTon: "Metric Ton",
    cartUnitPiece: "Piece",
    cartUnitLength: "6m Length",
    cartAdded: "Added",
    cartAdd: "Add to Supply List",
    bulkOfferBadge: "Super Bulk Deals",
    bulkOfferTitle: "Discounts & Enterprise Scaling (Bulk Orders)",
    bulkOfferDesc: "For orders exceeding 50 metric tons or 10,000 bricks, contact our commercial wing directly to unlock discounts up to 22%.",
    bulkOfferCTA: "Request Bulk Negotiation",
    bulkOfferAlert: "Success! Your inquiry is routed to our Enterprise logistics team. A consultant will reach out shortly.",
    fleetTitle: "Logistics & Transport Fleet",
    fleetDesc: "Live GPS tracking for bulk transit vehicles and climate-controlled cement trucks to ensure fresh delivery.",

    cartProposedList: "Proposed Supply List",
    cartMaterialsCount: "{count} items",
    cartEmpty: "Your list is currently empty",
    cartEmptyDesc: "Add some building materials to begin estimation",
    cartClearAll: "Empty Entire List",
    cartRemove: "Remove",
    cartSubtotal: "Subtotal Demand Cost",
    cartShipping: "Heavy Logistics Shipping",
    cartEstimatedTotal: "Total Estimated Cost",
    cartConfirmCTA: "Confirm Supply & Book Transit",
    cartExportPDF: "Export Invoice & PDF Certificate",
    cartConfirmAlert: "Supply list confirmed successfully!\nTotal: ${total}\nMaterials are reserved. Preparing delivery and cargo weight optimization schedules.",

    calcPrecisionBadge: "Verified Structural Mathematics",
    calcMainTitle: "AI Structural Quantity Calculator",
    calcMainDesc: "A precise structural computing system. Estimate volume and calculated weight for Cement, Sand, and Aggregates automatically based on concrete grade standard ratios.",
    calcCertTitle: "Certified Engineering Suite",
    calcCertDesc: "Fully compliant with international ISO 9001:2015",
    calcStep1: "01. Select Structural Material Grade",
    calcStep2: "02. Geometric Slab Parameters",
    calcMaterialConcrete: "Reinforced Concrete",
    calcMaterialSteel: "Reinforcement Steel Bars",
    calcMaterialBricks: "Clay Bricks",
    calcLengthLabel: "Total Length (m)",
    calcWidthLabel: "Total Lateral Width (m)",
    calcDepthLabel: "Slab Thickness / Depth (m)",
    calcGradeLabel: "Target Concrete Structural Grade",
    calcWastageLabel: "Excess Margin / Wastage Limit",
    calc3dTitle: "Live Geometric 3D Slab Projection",
    calc3dDesc: "Calculated Sructural Volume: {vol} cubic meters (m³)",
    calcLiveResults: "Live Slab Estimations",
    calcCertId: "ISO Audit Identification: #{id}",
    calcVolumeLabel: "Total Calculated Concrete Pour Volume",
    calcVolumeUnit: "cubic meters (m³)",
    calcCementLabel: "Portland Cement Bags (OPC 53)",
    calcCementDesc: "Premium commercial grade (50kg per bag)",
    calcCementUnit: "Bags",
    calcSandLabel: "Fine Aggregates (Zone II Sand)",
    calcSandDesc: "Washed and grain-size sorted",
    calcSandUnit: "Cu.Ft",
    calcGravelLabel: "Coarse Aggregates (20mm Gravel)",
    calcGravelDesc: "Natural crushed structural limestone",
    calcGravelUnit: "Cu.Ft",
    calcTotalWeightLabel: "Estimated Structural Cargo Weight",
    calcTotalWeightUnit: "Metric Tons",
    calcEquationNote: "Calculations based on IS 456 standard dry-concrete expansion multiplier of 1.54 with {wastage}% custom wastage padding factored.",
    calcGeneratePDFBtn: "Generate Structural PDF Report",
    calcAddAllBtn: "Add All Calculated Items to List List",
    calcExpertTips: "Benaa Engineering Consultant Tips",
    calcNextTip: "Next Engineering Insight ⚡",

    engPortalTitle: "Benaa Consulting Engineers Portal",
    engPortalDesc: "Connect with certified structural consultancies and architectural experts to review drawings and produce legal safety certificates.",
    engConsultantBadge: "Senior Advisor",
    engActiveBadge: "Active Now",
    engAdelTitle: "Dr. Adel Hunaish",
    engAdelSub: "Ph.D. in Structural Safety & Earthworks Engineering",
    engAdelCTA: "Request Technical Consultation 💬",
    engAmmarTitle: "Eng. Ammar Al-Samei",
    engAmmarSub: "Ultrasonic Concrete Strength Diagnostics Consultant",
    engAmmarCTA: "Call Helpline Directly 📞",

    projActiveTitle: "Project Tracker & Compliance Dashboard",
    projActiveDesc: "Review ongoing contracts, load capacities, and match actual bulk material orders securely against calculations.",
    projActiveInfo: "Active Site: Residential Villa Zone. Required concrete volume output: 42.50 cubic meters. Logistics batching synchronized successfully.",
    projAddBtn: "Enroll New Project Location",

    bluePortalTitle: "Calculations via AutoCAD Blueprints",
    bluePortalDesc: "As an expert builder, drag structural drafts directly to compile material budgets instantly.",
    blueDragDrop: "Drag and drop AutoCAD drawing layout here (DWG/PDF)",
    blueMaxLimit: "Maximum file size: 50MB (DWG compliant)",
    blueUploadBtn: "Upload AutoCAD Layout Design",

    safeOshaTitle: "Occupational Safety Standard (OSHA Compliant)",
    safeOshaDesc: "Benaa strictly adheres to site-level guidelines, ANSI benchmarks, and physical asset controls. Essential items on-site:",
    safeCheck1: "Advanced dome safety helmet with impact shields compliant with ANSI Z89.1.",
    safeCheck2: "Pre-cooled aggregate batching to prevent thermo-cracking during hydration.",
    safeCheck3: "Steel-toed safety boots, gloves, and projectile protection safety eyewear.",

    suppPortalTitle: "Emergency Technical Support Helpdesk",
    suppPortalDesc: "Need immediate help clarifying concrete standard ratings or logistic payload deliveries? Our support line is active 24/7.",
    suppPhoneTitle: "Dedicated Commercial Helpline",
    suppEmailTitle: "Corporate Audit & Legal Compliance",
    suppSubtopicTitle: "Submit a question. Schedulers reply within 10 minutes:",
    suppTopicPlaceholder: "e.g., Concrete M25 structural breakdown",
    suppDescPlaceholder: "Explain requirements, slab size, load constraints...",
    suppSendBtn: "Transmit Support Inquiry ⚡",

    pdfTitle: "Benaa Industrial - Verified Estimation Contract",
    pdfSub: "Industrial Supply Estimations & Bulk Transit Manifest",
    pdfISO: "ISO 9001:2015 Approved",
    pdfNo: "Approved Certificate Reference:",
    pdfDate: "Date Authorized:",
    pdfContractor: "Requesting Entity:",
    pdfColMaterial: "Structural Material Description",
    pdfColSupplier: "Manufacturer / Verified Supplier",
    pdfColQty: "Calculated Quantity Required",
    pdfColTotal: "Allocated Material Cost",
    pdfDisclaimerTitle: "Industrial Standard Quality Guarantee:",
    pdfDisclaimerDesc: "All products listed in this manifest conform rigorously to ACI, local safety codes, and ASTM laboratory criteria with standard warranty coverages.",
    pdfFooter: "© 2026 Benaa Industrial Logistics Ltd. All rights reserved under local builder regulations.",
    pdfPrintBtn: "Confirm & Directly Print PDF"
  }
};
