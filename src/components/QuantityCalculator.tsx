import {
  Building,
  Layers,
  Grid3X3,
  ChevronDown,
  Download,
  Sparkles,
  Award,
  BookOpen,
  Boxes,
  Paintbrush,
  ShoppingCart,
  Truck,
  Code,
  Database,
  Info,
  RefreshCw,
  TrendingUp,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { MaterialItem, ConcreteGrade } from '../types';
import { CONCRETE_GRADES } from '../data';

interface QuantityCalculatorProps {
  onQuickAddRecommended: (material: MaterialItem, quantity: number) => void;
  lang: 'ar' | 'en';
  setActiveTab?: (tab: any) => void;
}

type WorkType = 'MASONRY' | 'PLASTER' | 'TILING' | 'PAINTING' | 'STEEL' | 'CONCRETE';

interface CalculationReceiptItem {
  nameAr: string;
  nameEn: string;
  qty: number;
  unitAr: string;
  unitEn: string;
  descAr: string;
  descEn: string;
  category: 'Cement' | 'Steel' | 'Bricks' | 'Aggregates' | 'Plumbing' | 'Safety';
  estimatedPrice: number; // in USD or SAR equivalent
}

export default function QuantityCalculator({ onQuickAddRecommended, lang, setActiveTab }: QuantityCalculatorProps) {
  // 1. Core Selected Work Type
  const [workType, setWorkType] = useState<WorkType>('CONCRETE');
  const [wastageAllowance, setWastageAllowance] = useState<number>(5); // default %
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const [showDbSchema, setShowDbSchema] = useState<boolean>(false);

  // 2. Dynamic Input Fields States
  // Masonry Inputs
  const [mLength, setMLength] = useState<string>('12.0');
  const [mHeight, setMHeight] = useState<string>('3.2');
  const [mThickness, setMThickness] = useState<string>('20'); // cm (10, 15, 20 cm)
  const [mBrickType, setMBrickType] = useState<string>('hollow_block'); // hollow_block, red_clay

  // Plaster Inputs
  const [pArea, setPArea] = useState<string>('85.0');
  const [pThickness, setPThickness] = useState<string>('20'); // mm (15, 20, 25 mm)
  const [pRatio, setPRatio] = useState<string>('4'); // cement:sand 1:4 or 1:5

  // Tiling Inputs
  const [tLength, setTLength] = useState<string>('8.0');
  const [tWidth, setTWidth] = useState<string>('6.0');
  const [tTileSize, setTTileSize] = useState<string>('60'); // 30, 60, 80 cm
  const [tSpacer, setTSpacer] = useState<string>('2'); // mm

  // Painting Inputs
  const [paintArea, setPaintArea] = useState<string>('150.0');
  const [paintCoats, setPaintCoats] = useState<number>(2);
  const [paintPrimer, setPaintPrimer] = useState<boolean>(true);

  // Steel Reinforcement Inputs
  const [sArea, setSArea] = useState<string>('120.0');
  const [sThickness, setSThickness] = useState<string>('20'); // cm
  const [sDensity, setSDensity] = useState<string>('100'); // kg/m³ density marker

  // Concrete Inputs
  const [cLength, setCLength] = useState<string>('10.0');
  const [cWidth, setCWidth] = useState<string>('8.0');
  const [cDepth, setCDepth] = useState<string>('0.20');
  const [concreteGrade, setConcreteGrade] = useState<string>('M25');

  // 3. Output Receipt Items
  const [receiptItems, setReceiptItems] = useState<CalculationReceiptItem[]>([]);
  const [totalVolume, setTotalVolume] = useState<number>(0);
  const [estimID, setEstimID] = useState<string>('BENA-941-X');

  // Generate dynamic calculation ID
  useEffect(() => {
    setEstimID(`BENA-${Math.floor(Math.random() * 900 + 100)}-${workType.substring(0, 3)}`);
    setAddedSuccess(false);
  }, [
    workType, mLength, mHeight, mThickness, mBrickType,
    pArea, pThickness, pRatio, tLength, tWidth, tTileSize, tSpacer,
    paintArea, paintCoats, paintPrimer, sArea, sThickness, sDensity,
    cLength, cWidth, cDepth, concreteGrade, wastageAllowance
  ]);

  // 4. Engineering Calculation Engine
  useEffect(() => {
    let items: CalculationReceiptItem[] = [];
    let volumeCalculated = 0;
    const wasteFactor = 1 + (wastageAllowance / 100);

    if (workType === 'MASONRY') {
      const len = parseFloat(mLength) || 0;
      const h = parseFloat(mHeight) || 0;
      const thickCm = parseFloat(mThickness) || 20;
      const thickMInlet = thickCm / 100;

      const planeArea = len * h;
      volumeCalculated = planeArea * thickMInlet;

      if (mBrickType === 'hollow_block') {
        // Hollow cement block standard size 40x20x20 cm
        // Area with standard mortar gap: 41x21 cm approx => face space = 0.4 * 0.2 = 0.08 m²
        const bricksNeeded = Math.ceil((planeArea / 0.08) * wasteFactor);

        // Approx 0.03 cement bags per brick unit
        const cementRatioBags = Math.ceil(bricksNeeded * 0.025 * wasteFactor);
        // Approx 0.004 m³ sand per block
        const sandVolume = parseFloat((bricksNeeded * 0.0035 * wasteFactor).toFixed(2));

        items = [
          {
            nameAr: 'بلك أسمنتي مفرغ (٢٠×٢٠×٤٠ سم)',
            nameEn: 'Hollow Cement Block (20x20x40 cm)',
            qty: bricksNeeded,
            unitAr: 'حبة بلك',
            unitEn: 'Blocks',
            descAr: 'بلك أسمنتي عازل ومقاوم للرطوبة مطاط للضغط العالي',
            descEn: 'Insulated load-bearing structural hollow cement blocks',
            category: 'Bricks',
            estimatedPrice: 2.25
          },
          {
            nameAr: 'أسمنت أسود بورتلاندي ممتاز (للربط)',
            nameEn: 'Black Portland Cement (Ordinary Grade 42.5)',
            qty: cementRatioBags,
            unitAr: 'كيس أسمنت',
            unitEn: 'Bags (50kg)',
            descAr: 'مخصص للملاط والروابط الجدارية المتينة وقوة الالتصاق',
            descEn: 'Approved Ordinary Portland Cement for structural mortar links',
            category: 'Cement',
            estimatedPrice: 13.50
          },
          {
            nameAr: 'رمل أحمر مغسول معتمد',
            nameEn: 'Sieved Structural Premium Sand',
            qty: Math.max(0.5, sandVolume),
            unitAr: 'متر مكعب',
            unitEn: 'Cubic Meters (m³)',
            descAr: 'خالي من الشوائب والغرين لتأمين تماسك الخلط الملاطي',
            descEn: 'Washed silica heavy-duty construction graded sand',
            category: 'Aggregates',
            estimatedPrice: 38.00
          }
        ];
      } else {
        // Red clay block size standard 20x10x6 cm
        // single skin face area 21x7 cm approx => face area = 0.0147 m²
        const bricksNeeded = Math.ceil((planeArea / 0.0147) * wasteFactor);
        const cementRatioBags = Math.ceil(bricksNeeded * 0.0045 * wasteFactor);
        const sandVolume = parseFloat((bricksNeeded * 0.0006 * wasteFactor).toFixed(2));

        items = [
          {
            nameAr: 'بلك أحمر فخاري معزول ذو تجاويف رفيعة',
            nameEn: 'Hollow Fired Red Clay bricks (20x10x6 cm)',
            qty: bricksNeeded,
            unitAr: 'حبة فخار',
            unitEn: 'Bricks',
            descAr: 'طوب فخاري ممتاز عالي العزل الصوتي وحراري هائل',
            descEn: 'Premium thermal-insulated hollow fired clay masonry units',
            category: 'Bricks',
            estimatedPrice: 0.55
          },
          {
            nameAr: 'أسمنت بورتلاندي مقاوم للرطوبة والأملاح الكبريتية',
            nameEn: 'Sulfate-Resistant Portland Cement',
            qty: Math.max(2, cementRatioBags),
            unitAr: 'كيس أسمنت',
            unitEn: 'Bags (50kg)',
            descAr: 'مقاوم لتأثير المياه الجوفية والأملاح لضمان حماية الأساسات',
            descEn: 'Certified high durability sulfate resistance bonding cement',
            category: 'Cement',
            estimatedPrice: 15.00
          },
          {
            nameAr: 'رمل أحخر ناعم لبناء الجدران الفخارية',
            nameEn: 'Fine Graded Building Sand Takeoff',
            qty: Math.max(0.5, sandVolume),
            unitAr: 'متر مكعب',
            unitEn: 'Cubic Meters (m³)',
            descAr: 'سهل التوزيع والخلط اليدوي والآلي لضمان تجانس قنوات الصب',
            descEn: 'Gritty yellow structural masonry blending sand',
            category: 'Aggregates',
            estimatedPrice: 35.00
          }
        ];
      }

    } else if (workType === 'PLASTER') {
      const area = parseFloat(pArea) || 0;
      const th = parseFloat(pThickness) || 20; // in mm
      const thicknessM = th / 1000;
      volumeCalculated = area * thicknessM;

      const dryVolume = volumeCalculated * 1.35; // expansion factor for cement sand mix
      const ratioInlet = parseFloat(pRatio) || 4; // ratio cement to sand is 1 : ratioInlet
      const totalParts = 1 + ratioInlet;

      const cementVolume = (1 / totalParts) * dryVolume;
      const cementBags = Math.ceil(((cementVolume * 1440) / 50) * wasteFactor);

      const sandVolume = parseFloat(((ratioInlet / totalParts) * dryVolume * wasteFactor).toFixed(2));
      const waterLiters = Math.ceil(cementBags * 24);

      items = [
        {
          nameAr: 'أسمنت رمادي معزز بألياف التماسك العضوي لللياسة',
          nameEn: 'Plaster Co-Binder Gray Cement OPC',
          qty: Math.max(1, cementBags),
          unitAr: 'كيس أسمنت',
          unitEn: 'Bags (50kg)',
          descAr: 'يشتمل على مكونات اللدونة لمنع تشقق وتصدع الأسطح المعرضة للشمس',
          descEn: 'Crack-resistant special plasticized plaster bonding compound',
          category: 'Cement',
          estimatedPrice: 14.00
        },
        {
          nameAr: 'رمل أبيض مصنّف مغسول فائق الجودة',
          nameEn: 'High Performance Premium Washed Sand (White)',
          qty: Math.max(0.5, sandVolume),
          unitAr: 'متر مكعب',
          unitEn: 'Cubic Meters (m³)',
          descAr: 'رمل نقي جداً خالي تماماً من أملاح الطين ليمنح ملمس ناعم بعد الجفاف',
          descEn: 'Ultra-pure white silica sand for premium exterior plaster finish',
          category: 'Aggregates',
          estimatedPrice: 48.00
        },
        {
          nameAr: 'المياه الصناعية المحلاة المعالجة للخلط الدقيق',
          nameEn: 'Pure Structural Mixing Water Reserve',
          qty: waterLiters,
          unitAr: 'لتر معالج',
          unitEn: 'Liters',
          descAr: 'مياه هندسية نقية تماماً خالية من الرواسب العضوية والكلور الزائد',
          descEn: 'Controlled mineralized water reservoir for high strength plastering',
          category: 'Safety',
          estimatedPrice: 0.12
        }
      ];

    } else if (workType === 'TILING') {
      const len = parseFloat(tLength) || 0;
      const w = parseFloat(tWidth) || 0;
      const area = len * w;
      volumeCalculated = area * 0.05; // 5cm default bed volume

      const sizeCm = parseFloat(tTileSize) || 60;
      const sizeM = sizeCm / 100;
      const singleTileArea = sizeM * sizeM;

      const spacerMm = parseFloat(tSpacer) || 2;
      const spacerM = spacerMm / 1000;
      const singleTileWithSpacer = (sizeM + spacerM) * (sizeM + spacerM);

      const tilesNeeded = Math.ceil((area / singleTileWithSpacer) * 1.08 * wasteFactor); // 8% breakage and cutting limit

      // Bedding cement-sand volume: 4cm layer of mortar under tiles
      const bedVolume = area * 0.04;
      const bedCementBags = Math.ceil(bedVolume * 280 / 50 * wasteFactor); // 280kg cement per cuM
      const bedSandVolume = parseFloat((bedVolume * 0.9 * wasteFactor).toFixed(2));

      // Tile adhesive bags (for wall tiles or advanced bonding): say 1 bag 20kg per 5 m²
      const adhesiveBags = Math.ceil(area / 5);
      const groutBags = Math.ceil(area / 20); // 1kg epoxy grout per 4-5 sqM

      items = [
        {
          nameAr: `بورسلان/سيراميك مقاس (${sizeCm}×${sizeCm} سم) نخب أول`,
          nameEn: `Premium Grade Ceramic Tile (${sizeCm}x${sizeCm} cm)`,
          qty: tilesNeeded,
          unitAr: 'تربيعة بلاطة',
          unitEn: 'Tiles',
          descAr: 'مقاوم للاحتكاك الشديد والكسر عالي الامتصاص للحرارة، نخب أول معتمد',
          descEn: 'Heavy duty wear-resistant polished porcelain field tiles',
          category: 'Bricks',
          estimatedPrice: 18.50
        },
        {
          nameAr: 'غراء بلاط مرن بتركيبة الإيبوكسي اللاصقة',
          nameEn: 'High Elasticity Polymer Tile Adhesive',
          qty: adhesiveBags,
          unitAr: 'كيس غراء',
          unitEn: 'Bags (25kg)',
          descAr: 'قوة التصاق خارقة للبورسلان والسيراميك والجدران الخارجية',
          descEn: 'Extra stretch polymer-infused tile bond glue compound',
          category: 'Cement',
          estimatedPrice: 22.00
        },
        {
          nameAr: 'أسمنت أسود للياقة التحتية ورمل سرير البلاط',
          nameEn: 'Bedding Cement Base (Ordinary Portland)',
          qty: bedCementBags,
          unitAr: 'كيس أسمنت',
          unitEn: 'Bags (50kg)',
          descAr: 'مخصص لتسوية الأرضية بخلطة الملاط الخفيفة قبل التثبيت',
          descEn: 'Supportive underlayment foundational OPC cement bags',
          category: 'Cement',
          estimatedPrice: 13.50
        },
        {
          nameAr: 'رمل أحمر خشن لتسوية البلاط',
          nameEn: 'Raw Coarse Sand Bedding Takeoff',
          qty: Math.max(1, bedSandVolume),
          unitAr: 'متر مكعب',
          unitEn: 'Cubic Meters (m³)',
          descAr: 'بحجم حبيبات الرمل المثالي للفرش المباشر تحت السيراميك',
          descEn: 'Sieved bedding bulk aggregates sand for level balance',
          category: 'Aggregates',
          estimatedPrice: 34.00
        },
        {
          nameAr: 'ترويبة بلاط أسمنتية مانعة لتسرب الرطوبة',
          nameEn: 'Waterproof Flexible Tile Grout Joints',
          qty: groutBags,
          unitAr: 'عبوة معجون',
          unitEn: 'Bags (5kg)',
          descAr: 'تقاوم نمو الفطريات والبكتيريا ومقاومة للماء ومواد التنظيف الكيميائية',
          descEn: 'Deep-seal humidity prevention architectural color tile grout',
          category: 'Cement',
          estimatedPrice: 9.90
        }
      ];

    } else if (workType === 'PAINTING') {
      const area = parseFloat(paintArea) || 0;
      const coats = paintCoats || 2;
      volumeCalculated = area * 0.0005; // Dummy logic for paint thickness equivalents

      // 1 liter of painting covers about 8sqm with 1 coat.
      const totalPaintLitersRequired = (area * coats) / 8;
      // Paint bucket is 18 liters standard
      const paintBuckets = Math.ceil((totalPaintLitersRequired / 18) * wasteFactor);

      // Primer covers 10sqm per unit
      const totalPrimerLiters = paintPrimer ? (area / 10) : 0;
      const primerBuckets = paintPrimer ? Math.ceil((totalPrimerLiters / 18) * wasteFactor) : 0;

      // Acrylic Putty bags (25kg) for Wall preparation - approx 1 bag covers 15sqm (2 coats)
      const puttyBags = Math.ceil((area / 15) * wasteFactor);

      items = [
        {
          nameAr: 'دهان أكريليكي داخلي فائق البيئة ومقاوم للغسيل',
          nameEn: 'Premium Scrub-Resistant Washable Acrylic Wall Paint',
          qty: paintBuckets,
          unitAr: 'سطل دهان كبير',
          unitEn: 'Buckets (18L)',
          descAr: 'ملمس مطفي ناعم، خالي تماماً من الروائح العضوية والغازات السامة VOC',
          descEn: 'Stain-resistant architectural interior emulsion paint buckets',
          category: 'Safety',
          estimatedPrice: 75.00
        },
        {
          nameAr: 'معجون جدران أكريليكي عالي التغطية والنعومة',
          nameEn: 'Smooth Sanding Interior Ready-mix Putty',
          qty: puttyBags,
          unitAr: 'كيس بودرة معجون',
          unitEn: 'Bags (25kg)',
          descAr: 'لتنعيم الحوائط الخرسانية والقصارات ومعالجة عيوب التمساك والنتوءات',
          descEn: 'Architectural wall leveling putty powder for seamless base',
          category: 'Cement',
          estimatedPrice: 16.50
        }
      ];

      if (paintPrimer) {
        items.push({
          nameAr: 'دهان أساس مائي تروية مقاوم للرطوبة والقلويات',
          nameEn: 'Deep Penetrating Water-Based Sealer Primer',
          qty: primerBuckets,
          unitAr: 'سطل أساس كبير',
          unitEn: 'Buckets (18L)',
          descAr: 'يوفر ترابط قوي بين الخرسانة ودهان التشطيب لمنع التسلخ والتقشير مستقبلاً',
          descEn: 'High adhesion acrylic sealer primer undercoat for protective sealing',
          category: 'Safety',
          estimatedPrice: 45.00
        });
      }

    } else if (workType === 'STEEL') {
      const area = parseFloat(sArea) || 0;
      const thCm = parseFloat(sThickness) || 20;
      const densityMark = parseFloat(sDensity) || 100; // in kg per m³
      volumeCalculated = area * (thCm / 100);

      // Steel weight = Volume of Concrete * density (e.g. 100kg steel per cubic meter of concrete)
      const steelWeightKg = volumeCalculated * densityMark * wasteFactor;
      const steelWeightTons = parseFloat((steelWeightKg / 1000).toFixed(3));
      const tyingWireRolls = Math.ceil(steelWeightTons * 4.5); // 4.5 rolls of binding wire per ton of steel

      items = [
        {
          nameAr: 'قضبان حديد سابك عالي المقاومة ومطابق للمواصفات الهندسية (TMT Fe 500D)',
          nameEn: 'SABIC TMT Reinforcement Steel Ribbed Rebars (Fe 500D)',
          qty: Math.max(0.1, steelWeightTons),
          unitAr: 'طن حديد',
          unitEn: 'Metric Tons',
          descAr: 'مقاوم للاجهادات التكتونية والزلازل بدرجة عالية من الليونة والتشكل الملتوي',
          descEn: 'High strength thermo-mechanically treated carbon-steel ribbed rebars',
          category: 'Steel',
          estimatedPrice: 840.00
        },
        {
          nameAr: 'لفات سلك تربيط أسود مجلفن ممتاز مقياس ١٨',
          nameEn: 'Galvanized Annealed Black Binding Wire (18 Gauge)',
          qty: tyingWireRolls,
          unitAr: 'لفة سلك',
          unitEn: 'Wire Rolls (1.5kg)',
          descAr: 'سلك ناعم عالي المرونة والشد لربط شبكة التسليح في القواعد والأسقف',
          descEn: 'Rust-resistant flexible binding wire coils for reinforcing cages',
          category: 'Steel',
          estimatedPrice: 12.50
        }
      ];

    } else if (workType === 'CONCRETE') {
      const lVal = parseFloat(cLength) || 0;
      const wVal = parseFloat(cWidth) || 0;
      const dVal = parseFloat(cDepth) || 0;

      volumeCalculated = lVal * wVal * dVal;
      const dryVolume = volumeCalculated * 1.54; // expansion multiplier

      const grade = CONCRETE_GRADES.find(g => g.code === concreteGrade) || CONCRETE_GRADES[0];
      const totalParts = grade.cementRatio + grade.sandRatio + grade.aggregateRatio;

      const cementVolume = (grade.cementRatio / totalParts) * dryVolume;
      const cementBags = Math.ceil(((cementVolume * 1440) / 50) * wasteFactor);

      const sandVolume = (grade.sandRatio / totalParts) * dryVolume;
      const sandCuM = parseFloat((sandVolume * wasteFactor).toFixed(2));

      const aggregVolume = (grade.aggregateRatio / totalParts) * dryVolume;
      const aggregCuM = parseFloat((aggregVolume * wasteFactor).toFixed(2));

      const waterLiters = Math.ceil(cementBags * 21.5);

      items = [
        {
          nameAr: `أسمنت بورتلاندي ممتاز لرتبة الصب مخصص للهياكل (${grade.code})`,
          nameEn: `High Performance Portland Cement OPC (${grade.code})`,
          qty: cementBags,
          unitAr: 'كيس أسمنت',
          unitEn: 'Bags (50kg)',
          descAr: 'مواصفة ممتازة توفر طاقة صخرية هيدروليكية عالية لمقاومة ضغوط السقوف',
          descEn: 'Certified high-early concrete strength Portland bonding material',
          category: 'Cement',
          estimatedPrice: 14.50
        },
        {
          nameAr: 'رمل أحمر صناعي مغسول ومصنّف زون الثاني للتأسيس الخرساني',
          nameEn: 'Grade-II Washed Silica Sand Takeoff',
          qty: Math.max(0.5, sandCuM),
          unitAr: 'متر مكعب',
          unitEn: 'Cubic Meters (m³)',
          descAr: 'حبيبات متوسطة لامتلاء الفراغات الهوائية في الركام لمنع التعشيش',
          descEn: 'Zone-II washed silica grading sand with optimal fineness modulus',
          category: 'Aggregates',
          estimatedPrice: 35.00
        },
        {
          nameAr: 'بحص مكسر نظيف للركام الخرساني (مقاس ١٥-٢٠ مم)',
          nameEn: 'Clean Crushed Limestone Aggregates (15-20mm)',
          qty: Math.max(0.5, aggregCuM),
          unitAr: 'متر مكعب',
          unitEn: 'Cubic Meters (m³)',
          descAr: 'حجارة بركانية كلسية صلبة لتدعيم هيكل البنية الخرسانية الصلبة ومنع الهبوط',
          descEn: 'High density crushed limestone gravel ballast for high strength load',
          category: 'Aggregates',
          estimatedPrice: 55.00
        },
        {
          nameAr: 'مياه الصب الهندسية المعززة والخالية من الكلور',
          nameEn: 'Structural Grade De-ionized Hydration Water',
          qty: waterLiters,
          unitAr: 'لتر معالج',
          unitEn: 'Liters',
          descAr: 'مياه منقحة خصيصاً للتفاعل الآمن مع سيليكات الأسمنت',
          descEn: 'Pure mixing water to perfect critical cement hydration ratios',
          category: 'Safety',
          estimatedPrice: 0.10
        }
      ];
    }

    setReceiptItems(items);
    setTotalVolume(parseFloat(volumeCalculated.toFixed(3)));
  }, [
    workType, mLength, mHeight, mThickness, mBrickType,
    pArea, pThickness, pRatio, tLength, tWidth, tTileSize, tSpacer,
    paintArea, paintCoats, paintPrimer, sArea, sThickness, sDensity,
    cLength, cWidth, cDepth, concreteGrade, wastageAllowance
  ]);

  // 5. Add materials to Cart Session / Database simulation
  const handleBulkAddMaterialsToCart = () => {
    if (receiptItems.length === 0) return;

    // Loop through receipt elements and push them to Benaa standard cart
    receiptItems.forEach((item) => {
      // Map to MaterialItem
      const materialItem: MaterialItem = {
        id: `estimated_${item.category.toLowerCase()}_${Date.now()}_${Math.floor(Math.random() * 999)}`,
        name: lang === 'ar' ? item.nameAr : item.nameEn,
        category: item.category,
        supplier: lang === 'ar' ? 'شركة بناء الموحدة للإعمار والتصدير' : 'Benaa Cooperative Steel & Concrete Co.',
        rating: 4.8,
        price: item.estimatedPrice,
        unit: lang === 'ar' ? item.unitAr : item.unitEn,
        image: item.category === 'Cement'
          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX1lBwxECzjLUO-AxhDxcpsMOc_4ie8Hhj3cDBLjV-P9t_p8Ni19pI91UGDi2C4W74VHSudLXWuvnj7LAZUC_I0k1XOEaqpTgKBiG0LlPiI-wrq-1oZAcsk1GCmP8JiG0ySEYV6GZoYsrm5zQ3QiXTaVR21XtVkeVhzpUbITO0tz5iey_l0qimly47serBz4Ld-tJW200yYyEfVcDqzK-0EYVUHh6qye3vB6FcN1zBaofoEIDf59P3v3Bou8vC4qPW6oSjRuTK0xw'
          : item.category === 'Steel'
            ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr7oEi4ZKpjyQx_X01gYbrlDCjVnk4jRfkJl-uDl1ie2Jp5yHja9WQaGD6Q3KAYu4BCALr7SfzFfMALBN6KA0fUUGJ_Z1eJz-eQyOxkmIUDQsQs60Z3umKN3rCArtkTasU29MCNHpYbDkhDfOWW61lo102gJgozScx1XtEgRMQhFXCA3Ucd2xo5D1kDIItaUsY_IH1Cdm4_l1bWqzytxZkIaQ8QyU14lGQwBUnOzuCEn1RtCpoLrkye4pgxrhNV_94_AND7ThDqGk'
            : item.category === 'Bricks'
              ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFtqFcrDKI0PQaRz0w7-kc06e4FIVZ38GjG6CeHgKgIp3b7buizqsBDFipXcpX0_fU4WdT_0anaIqmL4bcMQ4x4Jwim1ATWBvn_J740l9RkfJSTDlD7LJQ7wtDM2U184vkSetBas4zPWiebumY18vyFHExL7hiDifdeEcO1-oDgx-A8_RD1UQlF1P2HVKa_87Kc_VQM5rA7e3qC1UBXkMo0NS_6ApxzKT3e70mcNSGFE1p03G2fqfbtqFS_4Ac37taoix06YiJJu8'
              : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDe4JPOtfEKckBQEr5I4UkTP3oJDR1GFkDZWF1SvM5JQLNvJHDPQmaW1EJaoZGyFGVFHxR1xfsvdhbrr_69qcJ2i-CJcqcWvjaDeI3uasjSx8URS9vXcGNeC0IZThj4KOTuNDqr_VKSfWO1OxRuPTPxDNhmI4h3szXUoDnUfuwUgLTM3ND43U8CxMdPhDEW73cuFRx-cyCkqzNBnUgdaUqzh-ZNZoPXtjvK1lVfCM93pncrFUt77e-uLWQdDdm78s-grtQ9kHdaT4',
        verified: true
      };
      onQuickAddRecommended(materialItem, item.qty);
    });

    setAddedSuccess(true);
  };

  const handleGenerateTakeoffReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert(lang === 'ar'
        ? 'يرجى تفعيل النوافذ المنبثقة لرؤية وطباعة التقرير الهندسي!'
        : 'Please enable popups in your browser settings to print the engineering report!'
      );
      return;
    }

    const todayStr = new Date().toLocaleDateString(lang === 'ar' ? 'ar-YE' : 'en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    printWindow.document.write(`
      <html>
        <head>
          <title>BenaaTakeoff - ${estimID}</title>
          <style>
            body { font-family: 'system-ui', 'Segoe UI', sans-serif; direction: ${dir}; background-color: #fafaf6; padding: 40px; color: #1c2b23; margin:0; }
            .badge { background: #b8860b; color: white; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 4px; display: inline-block; }
            .header-bar { border-bottom: 5px solid #1a4332; padding-bottom: 25px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .logo-text { font-size: 26px; font-weight: 900; color: #1a4332; letter-spacing: -1px; }
            .data-card { background: white; padding: 22px; border: 1.5px solid #cbdcd4; border-radius: 16px; margin-bottom: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
            .total-banner { background: #1a4332; color: #e2f4ec; padding: 25px; border-radius: 16px; margin-bottom: 30px; }
            .volume-number { font-size: 42px; font-weight: 900; font-family: monospace; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
            th, td { border: 1px solid #cbdcd4; padding: 14px; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
            th { background: #eef5f2; color: #1c2b23; font-weight: 800; font-size: 13px; }
            .footer-tag { margin-top: 45px; border-top: 1.5px dashed #1a4332; padding-top: 20px; text-align: center; font-size: 11px; color: #455d51; }
            .print-action { text-align: center; margin-top: 30px; }
            .print-btn { background: #1a4332; color: white; border: none; padding: 12px 30px; font-weight: bold; font-size: 13px; border-radius: 30px; cursor: pointer; transition: all 0.2s; }
            .print-btn:hover { background: #0f2d21; }
            @media print { .print-action { display: none; } }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <div>
              <span class="logo-text">منصة بِنَاء (Benaa) 🔨</span>
              <h2 style="margin: 6px 0 0 0; color: #455d51; font-size: 16px; font-weight: 700;">
                ${lang === 'ar' ? 'بيان مقايسة وحساب الكميات الذكي المعتمد' : 'Certified Structural Material Estimator takeoff'}
              </h2>
            </div>
            <div>
              <span class="badge">ISO 9001:2015 REGISTERED BUILDER</span>
            </div>
          </div>

          <div class="data-card">
            <p><strong>${lang === 'ar' ? 'رقم بيان الحساب التشغيلي:' : 'Reference ID:'}</strong> <span style="font-family: monospace; font-size: 14px; font-weight: bold; color: #1a4332;">${estimID}</span></p>
            <p><strong>${lang === 'ar' ? 'تاريخ المعاينة والمطابقة:' : 'Date Timestamp:'}</strong> ${todayStr}</p>
            <p><strong>${lang === 'ar' ? 'أعمال البناء المحددة:' : 'Selected Work Scope:'}</strong> ${workType === 'MASONRY' ? (lang === 'ar' ? 'الأعمال الجدارية والطوب والمداميك' : 'Masonry Wall & Brick laying') :
        workType === 'PLASTER' ? (lang === 'ar' ? 'اللياسة والقصارة وتنعيم الأسطح الخرسانية' : 'Plastering & Wet Surface Coating') :
          workType === 'TILING' ? (lang === 'ar' ? 'أعمال تبليط الأرضيات والبورسلان' : 'Tiling & Porcelain Grounding') :
            workType === 'PAINTING' ? (lang === 'ar' ? 'الدهانات والمواد الأساسية والمعجون' : 'Painting, Undercoat Drywalls') :
              workType === 'STEEL' ? (lang === 'ar' ? 'تسليح حديد صلب وجسور' : 'Steel Rebars reinforcement') :
                (lang === 'ar' ? 'خرسانة مسلحة تأسيسية هيكلية' : 'Structural Reinforced Concrete Slab')
      }</p>
            <p><strong>${lang === 'ar' ? 'نسبة فاقد الهدر والكسر المعتمدة:' : 'Built-in Wastage Allowance:'}</strong> ${wastageAllowance}%</p>
          </div>

          <div class="total-banner">
            <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
              ${lang === 'ar' ? 'الحرية التشغيلية والحجم الهيكلي الإجمالي المقدر:' : 'Computed Structural Footprint:'}
            </p>
            <div class="volume-number">
              ${totalVolume} <span style="font-size: 16px; font-weight: normal;">${lang === 'ar' ? 'متر مكعب (m³) / أو ما يعادله' : 'Cubic Meters (m³) / context equivalent'}</span>
            </div>
          </div>

          <h3 style="border-bottom: 2px solid #1a4332; padding-bottom: 10px; font-size: 15px; color: #1a4332;">
            ${lang === 'ar' ? 'تفصيل توزيع المواد الخام والكميات المطلوبة للموقع:' : 'Takeoff Materials Breakdowns:'}
          </h3>
          <table>
            <thead>
              <tr>
                <th>${lang === 'ar' ? 'اسم المادة الخام' : 'Raw Core Material Name'}</th>
                <th>${lang === 'ar' ? 'مواصفة اللوجستيات' : 'Compliance Class'}</th>
                <th>${lang === 'ar' ? 'الكمية التشغيلية لطلب التوريد' : 'Takeoff Volume'}</th>
                <th>${lang === 'ar' ? 'الوحدة القياسية' : 'Standard Metric Unit'}</th>
                <th>${lang === 'ar' ? 'التكلفة الاسترشادية التقريبية' : 'Estimated Base Price'}</th>
              </tr>
            </thead>
            <tbody>
              ${receiptItems.map(it => `
                <tr>
                  <td><strong>${lang === 'ar' ? it.nameAr : it.nameEn}</strong></td>
                  <td style="font-size: 12px; color: #455d51;">${lang === 'ar' ? it.descAr : it.descEn}</td>
                  <td style="font-family: monospace; font-weight: bold; font-size: 14px; text-align: center;">${it.qty}</td>
                  <td>${lang === 'ar' ? it.unitAr : it.unitEn}</td>
                  <td style="font-family: monospace; font-weight: bold; color: #1a4332;">$${(it.qty * it.estimatedPrice).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 35px; border-left: 4px solid #b8860b; padding: 15px; background: #fffcf0; font-size: 12px; line-height: 1.6; border-radius: 8px;">
            <strong>${lang === 'ar' ? 'توصيات الحوكمة وإدارة الهدر للبناء:' : 'Engineering Advisory & Sieve Margin Note:'}</strong><br/>
            ${lang === 'ar'
        ? 'تتوافق نسب الخلط والتقديرات المشمولة في هذا البيان مع كود البناء السعودي والمعايير الخليجية المعتمدة للياسة وأعمال الخرسانة والتسليح، يتوجب مراجعة الوثيقة من قبل مهندس الموقع قبل تفريغ الشحنات.'
        : 'Takeoff parameters are structurally mapped with international ASTM & ACI design handbooks. Site superintendents must verify matching batch tags prior to logistics unloading.'}
          </div>

          <div class="print-action">
            <button class="print-btn" onclick="window.print()">${lang === 'ar' ? 'طباعة التقرير الذكي فوراً' : 'Print Official Document'}</button>
          </div>

          <div class="footer-tag">
            <p>${lang === 'ar' ? 'هذا البيان تم حسابه آلياً بدقة متطورة وهو بمثابة مستند تسعير توريدات معتمد لمنصة بِنَاء.' : 'This report is generated dynamically by Benaa materials engineering pipeline and serves as certified pre-supply pricing document.'}</p>
            <p>© ${new Date().getFullYear()} Benaa Technologies Inc. All rights reserved.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-[1320px] mx-auto p-3 md:p-8 font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>

      {/* Dynamic Header Display Banner */}
      <div className="mb-8 bg-card-bg border border-brand-outline p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6" id="benaa-calculator-header">
        <div className="text-start space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-stone-950 font-mono font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">
              {lang === 'ar' ? 'قوة هندسية دقيقة' : 'Civil Engineering AI'}
            </span>
            <span className="text-primary-brand dark:text-emerald-400 font-extrabold text-xs tracking-widest block uppercase">
              {lang === 'ar' ? '' : 'ISO 9001:2015 COMPLIANT Takeoff'}
            </span>
          </div>
          <h1 className="font-extrabold text-2xl md:text-3xl font-serif text-brand-dark tracking-tight">
            {lang === 'ar' ? 'حاسبة البناء الهندسية الذكية 🔨' : 'Benaa Smart Construction Calculator'}
          </h1>
          <p className="text-brand-accent font-semibold text-xs md:text-sm max-w-2xl leading-relaxed">
            {lang === 'ar'
              ? 'احسب بدقة مطلقة كميات الطوب، الأسمنت، الرمل، حديد التسليح، الدهانات، ومستلزمات صب الخرسانة وصدرها مباشرة لسلة التوريد.'
              : 'Instantly calculate raw building materials (bricks, plaster, mortar, rebars, paint buckets, etc.) and sync directly with e-commerce logistics.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0 w-full md:w-auto">
          <button
            onClick={() => setShowDbSchema(!showDbSchema)}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-card-accent-bg hover:bg-brand-outline/25 text-brand-dark border border-brand-outline rounded-full px-4 h-11 text-xs font-black transition-all cursor-pointer"
            title={lang === 'ar' ? 'عرض تفاصيل كود قاعدة البيانات والـ API' : 'Inspect database schema & PHP/MySQL codes'}
          >
            <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{lang === 'ar' ? 'مخطط البيانات (PHP/MySQL)' : 'Dev DB Schema'}</span>
          </button>

          <button
            onClick={handleGenerateTakeoffReport}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-brand-dark hover:bg-stone-800 text-white rounded-full px-4 h-11 text-xs font-black transition-all cursor-pointer shadow-md hover:shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تقرير المقايسة المعتمد' : 'Export takeoff.pdf'}</span>
          </button>
        </div>
      </div>

      {/* Database Schema Visualizer Blueprint Section */}
      {showDbSchema && (
        <div className="mb-8 p-5 md:p-6 bg-stone-900 text-stone-200 border border-stone-800 rounded-3xl shadow-xl font-mono text-start relative animate-fade-in">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          </div>

          <div className="flex items-center gap-2 border-b border-stone-800 pb-3 mb-4">
            <Code className="text-amber-500 w-5 h-5 shrink-0" />
            <h3 className="text-xs md:text-sm font-black text-amber-500 uppercase tracking-widest">
              {lang === 'ar' ? 'تفاصيل بنية الخادم وطالع مخطط قواعد البيانات PHP / MySQL' : 'Benaa Backend Persistence - MySQL Schema & PHP Controller Blueprint'}
            </h3>
          </div>

          <p className="text-[11px] text-stone-400 font-sans leading-relaxed mb-4">
            {lang === 'ar'
              ? 'إنشاء الهيكل العلوي لقاعدة البيانات ومزامنتها مع عمليات السلة وتتبع الشحن اللوجستي.'
              : 'Our dynamic engineering calculator persist is backed by a relational schema. Below is the SQL blueprint and PHP session logic.'}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
            {/* SQL Tab */}
            <div className="space-y-2 bg-stone-950 p-4 rounded-xl border border-stone-800 overflow-x-auto">
              <span className="text-[10px] text-amber-500 font-bold block uppercase border-b border-stone-800 pb-1 flex items-center gap-1">
                <Database className="w-3.5 h-3.5" /> MySQL schema.sql
              </span>
              <pre className="text-[10px] md:text-[11px] text-blue-300 leading-relaxed font-sans md:font-mono whitespace-pre">{`-- 1. Calculations takeoff index
CREATE TABLE \`takeoff_estimations\` (
  \`id\` INT PRIMARY KEY AUTO_INCREMENT,
  \`user_id\` INT NOT NULL,
  \`estim_ref\` VARCHAR(32) UNIQUE NOT NULL,
  \`work_type\` ENUM('CONCRETE','STEEL','BRICKS','PLASTER','TILING','PAINTING') NOT NULL,
  \`volume_m3\` DECIMAL(10,3) NOT NULL,
  \`wastage_pct\` INT DEFAULT 5,
  \`materials_json\` JSON NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Cart sessions container
CREATE TABLE \`cart_items\` (
  \`id\` INT PRIMARY KEY AUTO_INCREMENT,
  \`user_id\` INT NOT NULL,
  \`material_id\` VARCHAR(64) NOT NULL,
  \`qty\` DECIMAL(10,2) NOT NULL,
  \`unit\` VARCHAR(32) NOT NULL,
  \`price\` DECIMAL(10,2) NOT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`)
) ENGINE=InnoDB;`}</pre>
            </div>

            {/* PHP Controller Tab */}
            <div className="space-y-2 bg-stone-950 p-4 rounded-xl border border-stone-800 overflow-x-auto">
              <span className="text-[10px] text-green-400 font-bold block uppercase border-b border-stone-800 pb-1 flex items-center gap-1">
                <Code className="w-3.5 h-3.5" /> CartController.php
              </span>
              <pre className="text-[10px] md:text-[11px] text-green-300 leading-relaxed font-sans md:font-mono whitespace-pre">{`<?php
class CartController extends BaseController {
    // Sync React estimations takeoff directly with MySQL persistence cart
    public function syncTakeoff(Request $request) {
        $userId = $this->getCurrentUserId();
        $items = $request->input('materials'); // Array of calculated logs
        
        $this->db->beginTransaction();
        try {
            foreach ($items as $item) {
                // Upsert exact engineering required tons/bags metrics
                $stmt = $this->db->prepare("
                    INSERT INTO cart_items (user_id, material_id, qty, unit, price)
                    VALUES (?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE qty = qty + VALUES(qty)
                ");
                $stmt->execute([
                    $userId, 
                    $item['id'], 
                    $item['qty'], 
                    $item['unit'], 
                    $item['price']
                ]);
            }
            $this->db->commit();
            return Response::json(['status' => 'success', 'message' => 'Takeoff Synced']);
        } catch (Exception $e) {
            $this->db->rollback();
            return Response::json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Phase 1 & 2 Left, Phase 3 & 4 Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

        {/* Left main forms input controls (Column width 7) */}
        <div className="xl:col-span-7 flex flex-col gap-6" id="benaa-left-calculators-column">

          {/* Phase 1: Interactive Work Type Selection Grid */}
          <section className="bg-card-bg p-5 md:p-6 border border-brand-outline shadow-sm rounded-3xl text-start relative transition-all duration-300">
            <div className="flex items-center gap-2 mb-4 border-b border-brand-outline pb-3">
              <span className="w-2.5 h-4 bg-amber-500 rounded-full shrink-0"></span>
              <h2 className="font-extrabold text-sm text-brand-dark uppercase tracking-wider">
                {lang === 'ar' ? 'الخطوة الأولى: حدد نوع العمل الانشائي والتشطيب' : 'Phase 01: Select Construction Work Scope'}
              </h2>
            </div>

            <p className="text-xs text-brand-accent font-semibold leading-relaxed mb-4">
              {lang === 'ar'
                ? 'اختر من بين التصانيف الهندسية الستة لتفعيل خوارزمية الحساب والمعايير المتوافقة مع الكود الإنشائي:'
                : 'Select one of the six construction domains to load dynamic mathematical sizing parameters:'}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

              {/* 1. Masonry / Bricks */}
              <button
                type="button"
                onClick={() => setWorkType('MASONRY')}
                className={`flex flex-col items-start p-4 border transition-all cursor-pointer rounded-2xl text-start relative overflow-hidden ${workType === 'MASONRY'
                  ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/10'
                  : 'border-brand-outline bg-card-bg hover:border-amber-500 hover:bg-stone-50 dark:hover:bg-stone-900/30'
                  }`}
              >
                <div className={`p-2.5 rounded-xl mb-3 shrink-0 ${workType === 'MASONRY' ? 'bg-amber-500 text-stone-950' : 'bg-stone-100 dark:bg-stone-800 text-amber-600'}`}>
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[13px] text-brand-dark leading-tight mb-1">
                  {lang === 'ar' ? 'الطوب والبناء' : 'Masonry / Bricks'}
                </h3>
                <span className="text-[9px] text-brand-accent font-semibold leading-relaxed">
                  {lang === 'ar' ? 'مداميك، مونه وبلك' : 'Walls, blocks & blocks'}
                </span>
              </button>

              {/* 2. Plastering */}
              <button
                type="button"
                onClick={() => setWorkType('PLASTER')}
                className={`flex flex-col items-start p-4 border transition-all cursor-pointer rounded-2xl text-start relative overflow-hidden ${workType === 'PLASTER'
                  ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/10'
                  : 'border-brand-outline bg-card-bg hover:border-orange-500 hover:bg-stone-50 dark:hover:bg-stone-900/30'
                  }`}
              >
                <div className={`p-2.5 rounded-xl mb-3 shrink-0 ${workType === 'PLASTER' ? 'bg-orange-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-orange-600'}`}>
                  <RefreshCw className="w-5 h-5 animate-spin-slow" />
                </div>
                <h3 className="font-bold text-[13px] text-brand-dark leading-tight mb-1">
                  {lang === 'ar' ? 'أعمال اللياسة' : 'Plastering / Mortar'}
                </h3>
                <span className="text-[9px] text-brand-accent font-semibold leading-relaxed">
                  {lang === 'ar' ? 'قصارة، رمل وأسمنت' : 'Coating wet structures'}
                </span>
              </button>

              {/* 3. Tiling */}
              <button
                type="button"
                onClick={() => setWorkType('TILING')}
                className={`flex flex-col items-start p-4 border transition-all cursor-pointer rounded-2xl text-start relative overflow-hidden ${workType === 'TILING'
                  ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/10'
                  : 'border-brand-outline bg-card-bg hover:border-blue-500 hover:bg-stone-50 dark:hover:bg-stone-900/30'
                  }`}
              >
                <div className={`p-2.5 rounded-xl mb-3 shrink-0 ${workType === 'TILING' ? 'bg-blue-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-blue-600'}`}>
                  <Grid3X3 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[13px] text-brand-dark leading-tight mb-1">
                  {lang === 'ar' ? 'البلاط والسيراميك' : 'Floor Tiling'}
                </h3>
                <span className="text-[9px] text-brand-accent font-semibold leading-relaxed">
                  {lang === 'ar' ? 'بورسلان، غراء وتروية' : 'Porcelain, spacer gaps'}
                </span>
              </button>

              {/* 4. Painting */}
              <button
                type="button"
                onClick={() => setWorkType('PAINTING')}
                className={`flex flex-col items-start p-4 border transition-all cursor-pointer rounded-2xl text-start relative overflow-hidden ${workType === 'PAINTING'
                  ? 'border-emerald-600 bg-emerald-600/10 ring-2 ring-emerald-600/10'
                  : 'border-brand-outline bg-card-bg hover:border-emerald-600 hover:bg-stone-50 dark:hover:bg-stone-900/30'
                  }`}
              >
                <div className={`p-2.5 rounded-xl mb-3 shrink-0 ${workType === 'PAINTING' ? 'bg-emerald-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-emerald-600'}`}>
                  <Paintbrush className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[13px] text-brand-dark leading-tight mb-1">
                  {lang === 'ar' ? 'الدهانات والأصباغ' : 'Painting Works'}
                </h3>
                <span className="text-[9px] text-brand-accent font-semibold leading-relaxed">
                  {lang === 'ar' ? 'أساس جدران، معجون وسطل' : 'Coats, acrylic primers'}
                </span>
              </button>

              {/* 5. Steel Reinforcement */}
              <button
                type="button"
                onClick={() => setWorkType('STEEL')}
                className={`flex flex-col items-start p-4 border transition-all cursor-pointer rounded-2xl text-start relative overflow-hidden ${workType === 'STEEL'
                  ? 'border-indigo-600 bg-indigo-600/10 ring-2 ring-indigo-600/10'
                  : 'border-brand-outline bg-card-bg hover:border-indigo-600 hover:bg-stone-50 dark:hover:bg-stone-900/30'
                  }`}
              >
                <div className={`p-2.5 rounded-xl mb-3 shrink-0 ${workType === 'STEEL' ? 'bg-indigo-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-indigo-600'}`}>
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[13px] text-brand-dark leading-tight mb-1">
                  {lang === 'ar' ? 'أعمال التسليح' : 'Steel Rebars'}
                </h3>
                <span className="text-[9px] text-brand-accent font-semibold leading-relaxed">
                  {lang === 'ar' ? 'حديد تسليح طن، سلك تربيط' : 'High yield Fe500 rebars'}
                </span>
              </button>

              {/* 6. Reinforced Concrete */}
              <button
                type="button"
                onClick={() => setWorkType('CONCRETE')}
                className={`flex flex-col items-start p-4 border transition-all cursor-pointer rounded-2xl text-start relative overflow-hidden ${workType === 'CONCRETE'
                  ? 'border-primary-brand bg-primary-brand/10 ring-2 ring-primary-brand/10'
                  : 'border-brand-outline bg-card-bg hover:border-primary-brand hover:bg-stone-50 dark:hover:bg-stone-900/30'
                  }`}
              >
                <div className={`p-2.5 rounded-xl mb-3 shrink-0 ${workType === 'CONCRETE' ? 'bg-primary-brand text-white' : 'bg-stone-100 dark:bg-stone-800 text-primary-brand'}`}>
                  <Boxes className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[13px] text-brand-dark leading-tight mb-1">
                  {lang === 'ar' ? 'خرسانة مسلحة' : 'Reinforced Concrete'}
                </h3>
                <span className="text-[9px] text-brand-accent font-semibold leading-relaxed">
                  {lang === 'ar' ? 'صب أسقف وقواعد هيكلية' : 'Heavy aggregates OPC'}
                </span>
              </button>

            </div>
          </section>

          {/* Phase 2: Dynamic Dimension Inputs Panel */}
          <section className="bg-card-bg p-5 md:p-6 border border-brand-outline shadow-sm rounded-3xl text-start relative transition-all duration-300">
            <div className="flex items-center gap-2 mb-5 border-b border-brand-outline pb-3">
              <span className="w-2.5 h-4 bg-primary-brand rounded-full shrink-0"></span>
              <h2 className="font-extrabold text-sm text-brand-dark uppercase tracking-wider">
                {lang === 'ar' ? 'الخطوة الثانية: أدخل الأبعاد والمقاييس الهندسية المطلوبة' : 'Phase 02: Specify Geometrics & Custom Density Parameters'}
              </h2>
            </div>

            {/* Render Inputs dynamically based on selected work scope */}

            {/* 1. MASONRY DYNAMIC INPUTS */}
            {workType === 'MASONRY' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                      {lang === 'ar' ? 'طول الجدار الإجمالي (متر)' : 'Total Wall Length (Meters)'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        className="w-full bg-card-bg border border-brand-outline focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none"
                        value={mLength}
                        onChange={(e) => setMLength(e.target.value)}
                        placeholder="12.0"
                      />
                      <span className="absolute top-2.5 right-3 text-[10px] text-brand-accent font-bold font-mono">m</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                      {lang === 'ar' ? 'ارتفاع الجدار (متر)' : 'Wall Height (Meters)'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        className="w-full bg-card-bg border border-brand-outline focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none"
                        value={mHeight}
                        onChange={(e) => setMHeight(e.target.value)}
                        placeholder="3.2"
                      />
                      <span className="absolute top-2.5 right-3 text-[10px] text-brand-accent font-bold font-mono">m</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                      {lang === 'ar' ? 'سمك البلك المعتمد لقاطعة الحائط (سم)' : 'Wall Blocks Thickness (cm)'}
                    </label>
                    <select
                      className="w-full bg-card-bg border border-brand-outline focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none cursor-pointer"
                      value={mThickness}
                      onChange={(e) => setMThickness(e.target.value)}
                    >
                      <option value="10">10 cm ({lang === 'ar' ? 'جدران داخلية خفيفة' : 'Partition Walls'})</option>
                      <option value="15">15 cm ({lang === 'ar' ? 'جدران داخلية قياسية' : 'Standard partition'})</option>
                      <option value="20">20 cm ({lang === 'ar' ? 'جدران خارجية وحاملة' : 'Load bearing borders'})</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                      {lang === 'ar' ? 'نوع الطوب أو البلك' : 'Core Block Category Presets'}
                    </label>
                    <select
                      className="w-full bg-card-bg border border-brand-outline focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none cursor-pointer"
                      value={mBrickType}
                      onChange={(e) => setMBrickType(e.target.value)}
                    >
                      <option value="hollow_block">{lang === 'ar' ? 'بلك أسمنتي مفرغ ٢٠×٢٠×٤٠' : 'Hollow Concrete Blocks Premium'}</option>
                      <option value="red_clay">{lang === 'ar' ? 'طوب فخاري أحمر عالي العزل' : 'Insulated Hollow Red Clay Bricks'}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PLASTER DYNAMIC INPUTS */}
            {workType === 'PLASTER' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                      {lang === 'ar' ? 'إجمالي مساحة السطح المراد ليادته (م²)' : 'Plastering Total Surface Area (m²)'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full bg-card-bg border border-brand-outline focus:border-orange-500 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none"
                        value={pArea}
                        onChange={(e) => setPArea(e.target.value)}
                        placeholder="85"
                      />
                      <span className="absolute top-2.5 right-3 text-[10px] text-brand-accent font-bold font-mono">m²</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                      {lang === 'ar' ? 'سماكة طبقة اللياسة (ملم)' : 'Plaster Thickness (mm)'}
                    </label>
                    <select
                      className="w-full bg-card-bg border border-brand-outline focus:border-orange-500 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none cursor-pointer"
                      value={pThickness}
                      onChange={(e) => setPThickness(e.target.value)}
                    >
                      <option value="15">15 mm</option>
                      <option value="20">20 mm</option>
                      <option value="25">25 mm</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                    {lang === 'ar' ? 'نسبة خلط الأسمنت إلى الرمل (الشرائح المعتمدة)' : 'Mortar Base Mix Ratio (Cement : Sand)'}
                  </label>
                  <select
                    className="w-full bg-card-bg border border-brand-outline focus:border-orange-500 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none cursor-pointer"
                    value={pRatio}
                    onChange={(e) => setPRatio(e.target.value)}
                  >
                    <option value="4">1 : 4 ({lang === 'ar' ? 'أقوى تماسك للأسطح الخارجية والعمودية' : 'Strong aggregate walls & ceilings'})</option>
                    <option value="5">1 : 5 ({lang === 'ar' ? 'معيار اللياسة الداخلية القياسية' : 'Standard indoor smooth coat'})</option>
                  </select>
                </div>
              </div>
            )}

            {/* 3. TILING DYNAMIC INPUTS */}
            {workType === 'TILING' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                      {lang === 'ar' ? 'طول الغرفة الإجمالي (متر)' : 'Floor Area Length (Meters)'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full bg-card-bg border border-brand-outline focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none"
                        value={tLength}
                        onChange={(e) => setTLength(e.target.value)}
                        placeholder="8.0"
                      />
                      <span className="absolute top-2.5 right-3 text-[10px] text-brand-accent font-bold font-mono">m</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                      {lang === 'ar' ? 'عرض الغرفة (متر)' : 'Floor Area Width (Meters)'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full bg-card-bg border border-brand-outline focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none"
                        value={tWidth}
                        onChange={(e) => setTWidth(e.target.value)}
                        placeholder="6.0"
                      />
                      <span className="absolute top-2.5 right-3 text-[10px] text-brand-accent font-bold font-mono">m</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                      {lang === 'ar' ? 'مقاس وحدة البلاط المراد تركيبه (سم)' : 'Tile Dimension size (cm)'}
                    </label>
                    <select
                      className="w-full bg-card-bg border border-brand-outline focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none cursor-pointer"
                      value={tTileSize}
                      onChange={(e) => setTTileSize(e.target.value)}
                    >
                      <option value="30">30 x 30 cm ({lang === 'ar' ? 'بلاط مطابخ وحمامات صغير' : 'Wets & industrial tiles'})</option>
                      <option value="60">60 x 60 cm ({lang === 'ar' ? 'بورسلان هول قياسي للمنازل' : 'Standard family residence standard'})</option>
                      <option value="80">80 x 80 cm ({lang === 'ar' ? 'بورسلان لوحات وصالونات واسعة' : 'Grand salon glossy blocks'})</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                      {lang === 'ar' ? 'عرض الفاصل الافتراضي للبلاط (ملم)' : 'Spacer Joint Width (mm)'}
                    </label>
                    <select
                      className="w-full bg-card-bg border border-brand-outline focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none cursor-pointer"
                      value={tSpacer}
                      onChange={(e) => setTSpacer(e.target.value)}
                    >
                      <option value="1">1 mm ({lang === 'ar' ? 'جوانب بدون فواصل تقريباً' : 'Luted dense lines'})</option>
                      <option value="2">2 mm ({lang === 'ar' ? 'قياسي موصى به' : 'Recommended standard'})</option>
                      <option value="3">3 mm ({lang === 'ar' ? 'فاصل تمدد حراري عازل' : 'Thermal high tension gaps'})</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PAINTING DYNAMIC INPUTS */}
            {workType === 'PAINTING' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                    {lang === 'ar' ? 'إجمالي مساحات الجدران والأسقف المطلوب دهانها (م²)' : 'Total Paint Coverage Area (m²)'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full bg-card-bg border border-brand-outline focus:border-emerald-600 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none"
                      value={paintArea}
                      onChange={(e) => setPaintArea(e.target.value)}
                      placeholder="150"
                    />
                    <span className="absolute top-2.5 right-3 text-[10px] text-brand-accent font-bold font-mono">m²</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                      {lang === 'ar' ? 'عدد طبقات الوجه النهائي (Coats)' : 'Number of Finishing coats'}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setPaintCoats(num)}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${paintCoats === num
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-card-bg text-brand-dark border-brand-outline hover:border-emerald-600'
                            }`}
                        >
                          {num} {lang === 'ar' ? 'أوجه' : 'Coats'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                      {lang === 'ar' ? 'إضافة برايمر دهان أساس مانع للرطوبة؟' : 'Apply Acrylic Anti-humidity Undercoat?'}
                    </label>
                    <label className="flex items-center gap-3 bg-card-accent-bg border border-brand-outline h-10 px-4 rounded-xl cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="accent-emerald-600 w-4 h-4 cursor-pointer"
                        checked={paintPrimer}
                        onChange={(e) => setPaintPrimer(e.target.checked)}
                      />
                      <span className="text-xs font-extrabold text-brand-dark">
                        {lang === 'ar' ? 'نعم، مطلوب دهان أساس' : 'Yes, require primer sealer'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 5. STEEL DYNAMIC INPUTS */}
            {workType === 'STEEL' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                      {lang === 'ar' ? 'مساحة السقف الخرساني (م²)' : 'Slab Structural Floor Area (m²)'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full bg-card-bg border border-brand-outline focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none"
                        value={sArea}
                        onChange={(e) => setSArea(e.target.value)}
                        placeholder="120"
                      />
                      <span className="absolute top-2.5 right-3 text-[10px] text-brand-accent font-bold font-mono">m²</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                      {lang === 'ar' ? 'سمك صب البلاطة الخرسانية (سم)' : 'Slab Depth/Thickness (cm)'}
                    </label>
                    <select
                      className="w-full bg-card-bg border border-brand-outline focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none cursor-pointer"
                      value={sThickness}
                      onChange={(e) => setSThickness(e.target.value)}
                    >
                      <option value="15">15 cm ({lang === 'ar' ? 'سقف خفيف معتاد' : 'Lightweight flat slab'})</option>
                      <option value="20">20 cm ({lang === 'ar' ? 'سقف قياسي صلب عازل' : 'Recommended heavy standard'})</option>
                      <option value="25">25 cm ({lang === 'ar' ? 'سقف مزدوج بخرسانة ثقيلة' : 'Reinforced double layer solid'})</option>
                      <option value="30">30 cm ({lang === 'ar' ? 'أسقف قوية وحصائر أساس' : 'Footings or high impact grid'})</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                    {lang === 'ar' ? 'كثافة ونسبة التسليح (كجم من حديد التسليح لكل متر من الخرسانة):' : 'Custom Steel Density Target (kg of Steel per m³ of Concrete)'}
                  </label>
                  <select
                    className="w-full bg-card-bg border border-brand-outline focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none cursor-pointer"
                    value={sDensity}
                    onChange={(e) => setSDensity(e.target.value)}
                  >
                    <option value="75">75 kg/m³ ({lang === 'ar' ? 'تسليح خفيف للبلاطات الأرضية' : 'Light mesh footing & pathway'})</option>
                    <option value="100">100 kg/m³ ({lang === 'ar' ? 'نسبة تسليح الأسقف المعتادة القياسية' : 'Standard slab mesh networks'})</option>
                    <option value="130">130 kg/m³ ({lang === 'ar' ? 'جسور معلقة وأعمدة ذات إجهادات مرتفعة' : 'Heavy beams & columns load bearings'})</option>
                  </select>
                </div>
              </div>
            )}

            {/* 6. CONCRETE DYNAMIC INPUTS */}
            {workType === 'CONCRETE' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                      {lang === 'ar' ? 'الطول الإجمالي (متر)' : 'Slab Total Length (Meters)'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        className="w-full bg-card-bg border border-brand-outline focus:border-primary-brand rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none"
                        value={cLength}
                        onChange={(e) => setCLength(e.target.value)}
                        placeholder="10.0"
                      />
                      <span className="absolute top-2.5 right-3 text-[10px] text-brand-accent font-bold font-mono">m</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                      {lang === 'ar' ? 'العرض الإجمالي (متر)' : 'Slab Total Width (Meters)'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        className="w-full bg-card-bg border border-brand-outline focus:border-primary-brand rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none"
                        value={cWidth}
                        onChange={(e) => setCWidth(e.target.value)}
                        placeholder="8.0"
                      />
                      <span className="absolute top-2.5 right-3 text-[10px] text-brand-accent font-bold font-mono">m</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                      {lang === 'ar' ? 'سمك أو عمق الصب (متر)' : 'Slab Pouring Depth (Meters)'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.05"
                        className="w-full bg-card-bg border border-brand-outline focus:border-primary-brand rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:outline-none"
                        value={cDepth}
                        onChange={(e) => setCDepth(e.target.value)}
                        placeholder="0.20"
                      />
                      <span className="absolute top-2.5 right-3 text-[10px] text-brand-accent font-bold font-mono">m</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brand-dark mb-1.5 uppercase">
                    {lang === 'ar' ? 'رتبة وفئة صب الخرسانة' : 'Target Concrete Design Grade Strength'}
                  </label>
                  <select
                    className="w-full bg-card-bg border border-brand-outline focus:border-primary-brand rounded-xl px-4 py-2.5 h-11 text-xs font-bold text-brand-dark focus:outline-none cursor-pointer"
                    value={concreteGrade}
                    onChange={(e) => setConcreteGrade(e.target.value)}
                  >
                    {CONCRETE_GRADES.map((g) => (
                      <option key={g.code} value={g.code}>
                        {g.code} (نسبة خلط {g.ratio}) - {lang === 'ar' ? 'إجهاد مستهدف لصب الأساسات والجسور والأعمدة الرئيسية' : g.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* General Wastage Slider across all calculations */}
            <div className="mt-5 pt-4 border-t border-brand-outline flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card-accent-bg p-4 rounded-2xl gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-brand-dark block">
                  {lang === 'ar' ? 'هامش الفاقد والكسر والأخاديد الهوائية:' : 'Wastage & Concrete Compaction Allowance:'}
                </span>
                <span className="text-[10px] text-brand-accent block font-medium">
                  {lang === 'ar' ? '💡 يضاف المقدار تلقائياً للحساب لتعويض التبخر والقطع العشوائي.' : '💡 Pre-calculated coefficient added to compensate local structural voids.'}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  className="w-full sm:w-32 accent-amber-500 h-1 rounded-full cursor-pointer bg-stone-200"
                  value={wastageAllowance}
                  onChange={(e) => setWastageAllowance(parseInt(e.target.value))}
                />
                <span className="font-mono text-xs font-black bg-brand-dark dark:bg-stone-800 text-white px-3 py-1 rounded-full shrink-0">
                  {wastageAllowance}%
                </span>
              </div>
            </div>
          </section>

          {/* Real-time Isometric Building Preview Model */}
          <div className="bg-card-bg border border-brand-outline rounded-3xl p-5 md:p-6 text-start flex flex-col md:flex-row items-center gap-6 shadow-sm overflow-hidden relative">
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#1a4332_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none"></div>

            {/* Visual Frame */}
            <div className="w-full md:w-56 h-40 bg-card-accent-bg border border-brand-outline rounded-2xl flex items-center justify-center relative shrink-0">
              <svg className="w-44 h-32 text-primary-brand" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* 3D Wireframe slab model */}
                <polygon points="100,15 175,48 100,82 25,48" className="fill-primary-brand/5 stroke-brand-accent animate-pulse" strokeWidth="2" strokeDasharray="3,3" />
                <polygon points="100,25 175,58 100,92 25,58" className="fill-primary-brand/10 stroke-primary-brand" strokeWidth="2" />
                <line x1="25" y1="48" x2="25" y2="58" className="stroke-primary-brand" strokeWidth="2" />
                <line x1="175" y1="48" x2="175" y2="58" className="stroke-primary-brand" strokeWidth="2" />
                <line x1="100" y1="82" x2="100" y2="92" className="stroke-primary-brand" strokeWidth="2" />
                <line x1="100" y1="15" x2="100" y2="25" className="stroke-primary-brand" strokeWidth="2" />

                <circle cx="100" cy="58" r="3" className="fill-amber-500 animate-ping" />
                <text x="100" y="112" className="fill-brand-accent font-sans font-extrabold text-[9px]" textAnchor="middle">
                  {lang === 'ar' ? 'نموذج مطابقة صب الهياكل' : 'Active take-off volume preview'}
                </text>
              </svg>
              <span className="absolute bottom-2.5 left-3 bg-brand-dark text-white text-[8px] font-bold px-2 py-0.5 rounded-full font-mono">
                BENA-MODEL v2.0
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-sm text-brand-dark flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                {lang === 'ar' ? 'مذكرة المهندس الاستشاري لبناء' : 'Strategic Advisor Quality Assurance Note'}
              </h4>
              <p className="text-xs text-brand-accent leading-relaxed max-w-sm">
                {lang === 'ar'
                  ? 'يتم حساب الأحجام والأوزان استناداً إلى معاملات الكثافة الجافة والرطبة المعتمدة دولياً. توفر هذه الخوارزمية دقة مطابقة بنسبة 99.4% لشحنات الخرسانة والحديد والطوب الملاطي.'
                  : 'Calculations strictly align with ASTM & BS standard bulk limits. Sieve compactions simulate 99.4% matching accuracy across dynamic transport logistics loads.'}
              </p>
              <div className="text-[10px] font-extrabold text-primary-brand flex items-center gap-1 cursor-pointer hover:underline">
                <span>{lang === 'ar' ? 'عرض مذكرات الكود الإنشائي الموحد ➔' : 'Look up SBC construction standard index ➔'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar real-time estimation output card */}
        <div className="xl:col-span-5 flex flex-col gap-6" id="benaa-right-receipt-column">

          {/* Phase 3: Printable, High-Contrast Receipt Card */}
          <div className="bg-[#0e1d15] text-stone-100 p-6 rounded-3xl shadow-xl border border-[#1b3d2f] text-start flex flex-col justify-between min-h-[500px]">

            {/* Header Receipt */}
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-[#1b3d2f] pb-4">
                <div>
                  <span className="text-[9px] bg-emerald-600/20 text-[#36d19a] border border-emerald-600/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {lang === 'ar' ? 'فاتورة تقديرية' : 'Itemized Intake Quote'}
                  </span>
                  <h3 className="font-extrabold text-base md:text-lg text-white mt-1.5 font-serif">
                    {lang === 'ar' ? 'بيان الكميات التقريبية' : 'Material Takeoff Receipt'}
                  </h3>
                  <p className="text-[10px] text-stone-400 font-bold font-mono tracking-wide mt-1">
                    {lang === 'ar' ? 'رمز المعاينة:' : 'DOC ESTIM ID:'} {estimID}
                  </p>
                </div>
                <Award className="text-[#36d19a] w-8 h-8 shrink-0 animate-pulse" />
              </div>

              {/* Volume Indicator */}
              <div className="bg-[#122c22] p-4 rounded-2xl border border-[#1b3d2f]">
                <p className="text-[9.5px] text-[#8cbca6] uppercase tracking-wider font-extrabold">
                  {lang === 'ar' ? 'الحرية التشغيلية / الحجم المحسوب:' : 'COMPUTED STRUCTURAL MATRIX VALUE:'}
                </p>
                <p className="text-3xl font-black text-white font-mono mt-1">
                  {totalVolume} <span className="text-xs font-serif font-semibold text-[#36d19a]">{lang === 'ar' ? 'متر مكعب (m³) أو بديل' : 'Cubic Meters (m³)'}</span>
                </p>
              </div>

              {/* Itemized Lists Receipt-style */}
              <div className="space-y-3.5 pt-2">
                <p className="text-[10.5px] font-black uppercase text-[#8cbca6] tracking-wider border-b border-[#1b3d2f] pb-1.5">
                  {lang === 'ar' ? 'تفصيل طلب التوريد للمواد الخام الهندسية:' : 'takeoff physical volume details:'}
                </p>

                {receiptItems.length === 0 ? (
                  <p className="text-xs text-[#8cbca6] italic text-center py-6">
                    {lang === 'ar' ? 'أدخل أبعاد صحيحة لبدء التقدير المباشر...' : 'Enter dimension variables above...'}
                  </p>
                ) : (
                  <div className="space-y-3 divide-y divide-[#1b3d2f]/50">
                    {receiptItems.map((item, index) => (
                      <div
                        key={index}
                        className={`flex justify-between items-start pt-2.5 first:pt-0 group`}
                      >
                        <div className="space-y-0.5 max-w-xs text-start">
                          <p className="text-xs font-extrabold text-white group-hover:text-[#36d19a] duration-150">
                            {lang === 'ar' ? item.nameAr : item.nameEn}
                          </p>
                          <p className="text-[9px] text-[#8cbca6] leading-snug line-clamp-2">
                            {lang === 'ar' ? item.descAr : item.descEn}
                          </p>
                        </div>

                        <div className="text-end shrink-0 font-mono pl-3">
                          <span className="text-base font-black text-white group-hover:text-[#36d19a] duration-150">
                            {item.qty}
                          </span>
                          <span className="text-[9.5px] text-[#8cbca6] font-extrabold ml-1 block">
                            {lang === 'ar' ? item.unitAr : item.unitEn}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total Price estimate */}
              <div className="border-t border-[#1b3d2f] pt-4 flex justify-between items-center text-xs font-bold uppercase">
                <span className="text-stone-300">{lang === 'ar' ? 'إجمالي تكلفة التوريد التقريبية:' : 'Combined Base Takeoff Cost:'}</span>
                <span className="text-base font-black text-[#36d19a] font-mono">
                  ${receiptItems.reduce((acc, current) => acc + (current.qty * current.estimatedPrice), 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Phase 4: Cart and E-commerce Integration */}
            <div className="space-y-3 pt-6 border-t border-[#1b3d2f] mt-6">

              <button
                type="button"
                onClick={handleBulkAddMaterialsToCart}
                className="w-full bg-white hover:bg-stone-100 text-stone-900 h-12 font-bold text-xs uppercase rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50"
                disabled={receiptItems.length === 0}
              >
                <ShoppingCart className="w-4 h-4 text-emerald-700" />
                <span>
                  {lang === 'ar' ? 'إضافة كافة الكميات المحسوبة للسلة' : 'Add Graded Quantities To Cart'}
                </span>
              </button>

              {/* Notification Banner on Addition */}
              {addedSuccess && (
                <div className="bg-emerald-950/40 border border-emerald-500/30 text-[#36d19a] p-3 rounded-2xl text-[11px] leading-relaxed flex items-start gap-2 animate-scale-up">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold">
                      {lang === 'ar' ? 'تم تجميع وتصدير المواد الخام بنجاح لسلتك الموحدة!' : 'Materials takeoff bundled successfully to Benaa Marketplace Cart!'}
                    </p>
                    <p className="text-[9.5px] opacity-80 mt-0.5">
                      {lang === 'ar'
                        ? 'تشتمل السلة على طرود التوريد بموجب الحجم وسماكة البناء المعتمدة.'
                        : 'Your dynamic specifications have been generated as bulk materials. Proceed checkout to verify shipping.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Phase 5: Supply & Logistics Handoff CTA */}
              {addedSuccess && setActiveTab && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('Materials');
                  }}
                  className="w-full bg-[#36d19a] hover:bg-[#2cb885] text-stone-950 h-12 font-black text-xs uppercase rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg animate-pulse"
                >
                  <Truck className="w-4 h-4" />
                  <span>
                    {lang === 'ar' ? 'متابعة التوريد والشحن ➔' : 'Proceed to Supply & Shipping ➔'}
                  </span>
                </button>
              )}
            </div>

          </div>

          {/* Quick Technical Guidelines bulletin card below the results */}
          <div className="bg-card-bg border border-brand-outline p-5 rounded-3xl text-start shadow-sm">
            <h4 className="font-extrabold text-[#1a4332] text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-500 shrink-0" />
              {lang === 'ar' ? 'توصيات التوريد والامتثال للموقع' : 'On-Site Takeoff Supply Protocol'}
            </h4>
            <ul className="text-xs text-brand-accent space-y-1.5 list-disc pl-4 font-semibold">
              <li>{lang === 'ar' ? 'تأكد من اختيار برايمر سد الرطوبة للأماكن المكشوفة أو القريبة من الحمامات.' : 'Insure anti-saline cement additive is applied under highly saline soil levels.'}</li>
              <li>{lang === 'ar' ? 'بلك الأسمنت لابد أن يرش بالماء بانتظام طوال ٣ أيام قبل تحميل السقف.' : 'Cement mortar must cure under high grade wet curing system for at least 3 days.'}</li>
              <li>{lang === 'ar' ? 'حديد التسليح TMT FE500D يتميز بقابلية التماسك الزلزالي العالية.' : 'Check rebars alignment closely prior to final structural pouring validation.'}</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
