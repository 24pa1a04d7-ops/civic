import { DietaryPreference } from '../types';

export const DIETARY_PREFERENCES: DietaryPreference[] = [
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    description: 'No meat, poultry, or fish',
    restrictedIngredients: [
      'beef',
      'pork',
      'chicken',
      'turkey',
      'fish',
      'seafood',
      'gelatin',
      'lard',
      'tallow',
      'chicken fat',
      'beef fat',
      'fish oil',
      'anchovy',
      'worcestershire sauce',
      'rennet'
    ]
  },
  {
    id: 'vegan',
    name: 'Vegan',
    description: 'No animal products',
    restrictedIngredients: [
      'beef',
      'pork',
      'chicken',
      'turkey',
      'fish',
      'seafood',
      'milk',
      'cheese',
      'butter',
      'cream',
      'yogurt',
      'eggs',
      'honey',
      'gelatin',
      'lard',
      'tallow',
      'whey',
      'casein',
      'lactose',
      'albumin',
      'lecithin',
      'carmine',
      'shellac',
      'beeswax'
    ]
  },
  {
    id: 'halal',
    name: 'Halal',
    description: 'Following Islamic dietary laws',
    restrictedIngredients: [
      'pork',
      'bacon',
      'ham',
      'lard',
      'alcohol',
      'wine',
      'beer',
      'rum',
      'vanilla extract',
      'gelatin',
      'rennet'
    ]
  },
  {
    id: 'kosher',
    name: 'Kosher',
    description: 'Following Jewish dietary laws',
    restrictedIngredients: [
      'pork',
      'shellfish',
      'mixing meat and dairy',
      'non-kosher gelatin',
      'non-kosher wine'
    ]
  },
  {
    id: 'keto',
    name: 'Ketogenic',
    description: 'Very low carb, high fat diet',
    restrictedIngredients: [
      'sugar',
      'high fructose corn syrup',
      'wheat flour',
      'rice',
      'corn',
      'potatoes',
      'bread',
      'pasta',
      'oats',
      'quinoa',
      'honey',
      'maple syrup',
      'agave',
      'fruit juice'
    ]
  },
  {
    id: 'paleo',
    name: 'Paleo',
    description: 'Based on presumed ancient human diet',
    restrictedIngredients: [
      'grains',
      'legumes',
      'dairy',
      'refined sugar',
      'processed foods',
      'wheat',
      'rice',
      'corn',
      'beans',
      'lentils',
      'peanuts',
      'soy',
      'milk',
      'cheese'
    ]
  },
  {
    id: 'low_sodium',
    name: 'Low Sodium',
    description: 'Reduced sodium intake',
    restrictedIngredients: [
      'salt',
      'sodium chloride',
      'monosodium glutamate',
      'sodium nitrate',
      'sodium nitrite',
      'sodium benzoate',
      'sodium phosphate',
      'soy sauce',
      'pickles',
      'canned soup'
    ]
  },
  {
    id: 'organic_only',
    name: 'Organic Only',
    description: 'Only organic ingredients',
    restrictedIngredients: [
      'artificial colors',
      'artificial flavors',
      'artificial preservatives',
      'pesticide residues',
      'synthetic additives',
      'GMO ingredients'
    ]
  }
];