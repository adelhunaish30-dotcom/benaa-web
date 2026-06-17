export interface MaterialItem {
  id: string;
  name: string;
  arabicName?: string;
  category: 'Cement' | 'Steel' | 'Bricks' | 'Aggregates' | 'Plumbing' | 'Safety';
  supplier: string;
  rating: number;
  price: number;
  unit: string;
  image: string;
  verified?: boolean;
  topRated?: boolean;
}

export interface CartItem {
  material: MaterialItem;
  quantity: number;
}

export type ActiveTab = 'Materials' | 'Engineers' | 'Projects' | 'Tools' | 'Calculators' | 'Blueprints' | 'Safety' | 'Support' | 'Admin';

export type CalculatorMaterial = 'CONCRETE' | 'STEEL' | 'BRICKS';

export interface ConcreteGrade {
  code: string;
  ratio: string;
  description: string;
  cementRatio: number; // proportion values
  sandRatio: number;
  aggregateRatio: number;
}

export interface CalculationResult {
  volume: number;
  cementBags: number;
  fineAggregateCuFt: number;
  coarseAggregateCuFt: number;
  totalWeightMetricTons: number;
  calculatedId: string;
}



// تعديل الرابط الأساسي في الـ React ليشمل بورت الـ Apache الجديد حَقّك
export const API_BASE_URL = 'http://localhost:8013/my-pro/benaa-api';
