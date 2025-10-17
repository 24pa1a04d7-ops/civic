export const HEALTH_CONDITIONS = {
  DIABETES: {
    id: 'diabetes',
    name: 'Diabetes',
    description: 'Requires monitoring of sugar and carbohydrate intake',
    restrictedIngredients: [
      'high fructose corn syrup',
      'corn syrup',
      'sugar',
      'sucrose',
      'glucose',
      'fructose',
      'dextrose',
      'maltose',
      'honey',
      'maple syrup',
      'agave nectar'
    ],
    warningIngredients: [
      'white flour',
      'enriched flour',
      'refined grains',
      'white rice',
      'potato starch'
    ]
  },
  HYPERTENSION: {
    id: 'hypertension',
    name: 'High Blood Pressure',
    description: 'Requires low sodium intake',
    restrictedIngredients: [
      'sodium chloride',
      'salt',
      'monosodium glutamate',
      'msg',
      'sodium benzoate',
      'sodium nitrate',
      'sodium nitrite',
      'sodium phosphate'
    ],
    warningIngredients: [
      'soy sauce',
      'worcestershire sauce',
      'bouillon',
      'broth'
    ]
  },
  CELIAC: {
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
      'gluten',
      'wheat flour',
      'wheat starch',
      'malt',
      'malt extract',
      'brewers yeast'
    ],
    warningIngredients: [
      'oats',
      'modified food starch',
      'natural flavoring',
      'caramel color'
    ]
  },
  LACTOSE_INTOLERANT: {
    id: 'lactose_intolerant',
    name: 'Lactose Intolerance',
    description: 'Cannot digest lactose in dairy products',
    restrictedIngredients: [
      'milk',
      'lactose',
      'whey',
      'casein',
      'butter',
      'cream',
      'cheese',
      'yogurt',
      'milk powder',
      'skim milk powder',
      'buttermilk'
    ],
    warningIngredients: [
      'natural flavoring',
      'caramel',
      'chocolate'
    ]
  }
}

export const DIETARY_PREFERENCES = {
  VEGETARIAN: {
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
      'meat extract',
      'chicken broth',
      'beef broth'
    ]
  },
  VEGAN: {
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
      'eggs',
      'honey',
      'gelatin',
      'whey',
      'casein',
      'lard',
      'tallow'
    ]
  },
  KETO: {
    id: 'keto',
    name: 'Ketogenic',
    description: 'Very low carbohydrate, high fat diet',
    restrictedIngredients: [
      'sugar',
      'wheat flour',
      'rice',
      'corn',
      'potato',
      'oats',
      'quinoa',
      'bread',
      'pasta',
      'high fructose corn syrup'
    ],
    warningIngredients: [
      'maltodextrin',
      'dextrose',
      'modified corn starch'
    ]
  },
  PALEO: {
    id: 'paleo',
    name: 'Paleo',
    description: 'Whole foods, no processed foods',
    restrictedIngredients: [
      'wheat',
      'rice',
      'corn',
      'oats',
      'beans',
      'lentils',
      'peanuts',
      'soy',
      'dairy',
      'refined sugar',
      'artificial sweeteners',
      'preservatives'
    ]
  }
}