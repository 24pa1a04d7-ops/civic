export interface User {
  id: string;
  name: string;
  email?: string;
  healthConditions: HealthCondition[];
  allergies: Allergy[];
  dietaryPreferences: DietaryPreference[];
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthCondition {
  id: string;
  name: string;
  description: string;
  restrictedIngredients: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface Allergy {
  id: string;
  name: string;
  allergens: string[];
  severity: 'mild' | 'moderate' | 'severe' | 'anaphylactic';
}

export interface DietaryPreference {
  id: string;
  name: string;
  description: string;
  restrictedIngredients: string[];
  allowedIngredients?: string[];
}

export interface FoodProduct {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  ingredients: Ingredient[];
  nutritionalInfo: NutritionalInfo;
  scannedAt: Date;
  imageUri?: string;
}

export interface Ingredient {
  name: string;
  percentage?: number;
  isAllergen: boolean;
  category: IngredientCategory;
  healthImpact: HealthImpact;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
  servingsPerContainer?: number;
}

export interface HealthImpact {
  level: 'safe' | 'caution' | 'warning' | 'danger';
  reasons: string[];
  affectedConditions: string[];
}

export interface AnalysisResult {
  productId: string;
  overallSafety: 'safe' | 'caution' | 'warning' | 'danger';
  flaggedIngredients: FlaggedIngredient[];
  nutritionalAnalysis: NutritionalAnalysis;
  recommendations: Recommendation[];
  alternatives: Alternative[];
}

export interface FlaggedIngredient {
  ingredient: Ingredient;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedConditions: string[];
  suggestions: string[];
}

export interface NutritionalAnalysis {
  score: number; // 0-100
  strengths: string[];
  concerns: string[];
  dailyValuePercentages: { [key: string]: number };
}

export interface Recommendation {
  type: 'avoid' | 'limit' | 'substitute' | 'general';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Alternative {
  id: string;
  name: string;
  brand: string;
  reason: string;
  healthScore: number;
  availability?: string;
}

export interface ScanSession {
  id: string;
  userId: string;
  product: FoodProduct;
  analysis: AnalysisResult;
  timestamp: Date;
}

export type IngredientCategory = 
  | 'preservative'
  | 'artificial_color'
  | 'artificial_flavor'
  | 'sweetener'
  | 'emulsifier'
  | 'stabilizer'
  | 'antioxidant'
  | 'natural'
  | 'protein'
  | 'carbohydrate'
  | 'fat'
  | 'vitamin'
  | 'mineral'
  | 'other';

export interface AppState {
  user: User | null;
  scanHistory: ScanSession[];
  isLoading: boolean;
  error: string | null;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Scanner: undefined;
  Results: { analysisResult: AnalysisResult };
  Profile: undefined;
  History: undefined;
  Settings: undefined;
  HealthConditions: undefined;
  Allergies: undefined;
  DietaryPreferences: undefined;
  ProductDetails: { productId: string };
  Alternatives: { alternatives: Alternative[] };
};