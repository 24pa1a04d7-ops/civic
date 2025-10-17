import { Allergy } from '../types';

export const COMMON_ALLERGIES: Allergy[] = [
  {
    id: 'peanuts',
    name: 'Peanuts',
    allergens: [
      'peanuts',
      'peanut oil',
      'peanut flour',
      'peanut butter',
      'groundnuts',
      'arachis oil'
    ],
    severity: 'anaphylactic'
  },
  {
    id: 'tree_nuts',
    name: 'Tree Nuts',
    allergens: [
      'almonds',
      'walnuts',
      'cashews',
      'pistachios',
      'pecans',
      'hazelnuts',
      'brazil nuts',
      'macadamia nuts',
      'pine nuts',
      'chestnuts'
    ],
    severity: 'anaphylactic'
  },
  {
    id: 'milk',
    name: 'Milk/Dairy',
    allergens: [
      'milk',
      'lactose',
      'casein',
      'whey',
      'butter',
      'cheese',
      'cream',
      'yogurt',
      'milk powder',
      'milk solids',
      'lactalbumin',
      'lactoglobulin'
    ],
    severity: 'severe'
  },
  {
    id: 'eggs',
    name: 'Eggs',
    allergens: [
      'eggs',
      'egg whites',
      'egg yolks',
      'albumin',
      'lecithin',
      'lysozyme',
      'mayonnaise',
      'meringue'
    ],
    severity: 'severe'
  },
  {
    id: 'soy',
    name: 'Soy',
    allergens: [
      'soy',
      'soybean',
      'soy sauce',
      'tofu',
      'tempeh',
      'miso',
      'soy lecithin',
      'soy protein',
      'soy flour',
      'edamame'
    ],
    severity: 'moderate'
  },
  {
    id: 'wheat',
    name: 'Wheat',
    allergens: [
      'wheat',
      'wheat flour',
      'wheat starch',
      'wheat bran',
      'wheat germ',
      'bulgur',
      'semolina',
      'durum',
      'spelt',
      'kamut'
    ],
    severity: 'severe'
  },
  {
    id: 'fish',
    name: 'Fish',
    allergens: [
      'fish',
      'salmon',
      'tuna',
      'cod',
      'halibut',
      'sardines',
      'anchovies',
      'fish sauce',
      'fish oil',
      'worcestershire sauce'
    ],
    severity: 'anaphylactic'
  },
  {
    id: 'shellfish',
    name: 'Shellfish',
    allergens: [
      'shrimp',
      'crab',
      'lobster',
      'crayfish',
      'prawns',
      'scallops',
      'mussels',
      'clams',
      'oysters',
      'shellfish extract'
    ],
    severity: 'anaphylactic'
  },
  {
    id: 'sesame',
    name: 'Sesame',
    allergens: [
      'sesame',
      'sesame seeds',
      'sesame oil',
      'tahini',
      'hummus',
      'halva',
      'sesamum indicum'
    ],
    severity: 'severe'
  }
];