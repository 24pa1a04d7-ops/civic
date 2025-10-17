// Sample products for testing and demonstration
export const SAMPLE_PRODUCTS = [
  {
    id: 'sample-1',
    name: 'Chocolate Chip Cookies',
    ingredients: [
      'enriched wheat flour',
      'sugar',
      'palm oil',
      'chocolate chips',
      'high fructose corn syrup',
      'salt',
      'baking soda',
      'natural vanilla flavor',
      'soy lecithin'
    ],
    nutritionFacts: {
      calories: 160,
      totalFat: '8g',
      saturatedFat: '3g',
      sodium: '95mg',
      totalCarbs: '22g',
      sugars: '11g',
      protein: '2g'
    },
    category: 'snacks'
  },
  {
    id: 'sample-2',
    name: 'Whole Grain Bread',
    ingredients: [
      'whole wheat flour',
      'water',
      'yeast',
      'honey',
      'salt',
      'olive oil',
      'wheat gluten',
      'vinegar'
    ],
    nutritionFacts: {
      calories: 80,
      totalFat: '1g',
      saturatedFat: '0g',
      sodium: '150mg',
      totalCarbs: '15g',
      sugars: '2g',
      protein: '4g',
      fiber: '3g'
    },
    category: 'bakery'
  },
  {
    id: 'sample-3',
    name: 'Instant Noodles',
    ingredients: [
      'enriched wheat flour',
      'palm oil',
      'salt',
      'monosodium glutamate',
      'sodium phosphate',
      'artificial chicken flavor',
      'yellow 6',
      'red 40',
      'preservatives'
    ],
    nutritionFacts: {
      calories: 380,
      totalFat: '14g',
      saturatedFat: '7g',
      sodium: '1820mg',
      totalCarbs: '56g',
      sugars: '2g',
      protein: '8g'
    },
    category: 'processed'
  },
  {
    id: 'sample-4',
    name: 'Organic Almond Milk',
    ingredients: [
      'organic almondmilk',
      'sea salt',
      'locust bean gum',
      'sunflower lecithin',
      'natural flavors'
    ],
    nutritionFacts: {
      calories: 30,
      totalFat: '2.5g',
      saturatedFat: '0g',
      sodium: '150mg',
      totalCarbs: '1g',
      sugars: '0g',
      protein: '1g',
      calcium: '450mg'
    },
    category: 'dairy alternatives'
  }
]

// Function to get a random sample product
export const getRandomSampleProduct = () => {
  const randomIndex = Math.floor(Math.random() * SAMPLE_PRODUCTS.length)
  return SAMPLE_PRODUCTS[randomIndex]
}