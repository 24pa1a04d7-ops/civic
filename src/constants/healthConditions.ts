import { HealthCondition } from '../types';

export const HEALTH_CONDITIONS: HealthCondition[] = [
  {
    id: 'diabetes',
    name: 'Diabetes',
    description: 'Requires monitoring of sugar and carbohydrate intake',
    restrictedIngredients: [
      'high fructose corn syrup',
      'corn syrup',
      'dextrose',
      'maltose',
      'sucrose',
      'glucose syrup',
      'cane sugar',
      'brown sugar',
      'honey',
      'agave nectar',
      'maple syrup'
    ],
    severity: 'high'
  },
  {
    id: 'hypertension',
    name: 'High Blood Pressure',
    description: 'Requires low sodium intake',
    restrictedIngredients: [
      'sodium chloride',
      'salt',
      'monosodium glutamate',
      'sodium nitrate',
      'sodium nitrite',
      'sodium benzoate',
      'sodium phosphate',
      'disodium phosphate'
    ],
    severity: 'high'
  },
  {
    id: 'heart_disease',
    name: 'Heart Disease',
    description: 'Requires low saturated fat and trans fat intake',
    restrictedIngredients: [
      'trans fat',
      'partially hydrogenated oil',
      'hydrogenated oil',
      'palm oil',
      'coconut oil',
      'lard',
      'beef tallow',
      'shortening'
    ],
    severity: 'critical'
  },
  {
    id: 'celiac',
    name: 'Celiac Disease',
    description: 'Requires strict gluten-free diet',
    restrictedIngredients: [
      'wheat',
      'barley',
      'rye',
      'spelt',
      'kamut',
      'triticale',
      'wheat flour',
      'wheat starch',
      'gluten',
      'malt',
      'brewers yeast'
    ],
    severity: 'critical'
  },
  {
    id: 'kidney_disease',
    name: 'Kidney Disease',
    description: 'Requires monitoring of protein, phosphorus, and potassium',
    restrictedIngredients: [
      'potassium chloride',
      'phosphoric acid',
      'sodium phosphate',
      'potassium phosphate',
      'calcium phosphate'
    ],
    severity: 'high'
  },
  {
    id: 'ibs',
    name: 'Irritable Bowel Syndrome',
    description: 'May require avoiding certain FODMAPs and artificial additives',
    restrictedIngredients: [
      'sorbitol',
      'mannitol',
      'xylitol',
      'inulin',
      'chicory root',
      'artificial sweeteners',
      'high fructose corn syrup'
    ],
    severity: 'medium'
  }
];