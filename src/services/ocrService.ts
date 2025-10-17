import { FoodProduct, Ingredient, NutritionalInfo, IngredientCategory } from '../types';

export class OCRService {
  private ingredientKeywords = new Map<string, IngredientCategory>([
    // Preservatives
    ['sodium benzoate', 'preservative'],
    ['potassium sorbate', 'preservative'],
    ['citric acid', 'preservative'],
    ['ascorbic acid', 'antioxidant'],
    ['bha', 'preservative'],
    ['bht', 'preservative'],
    ['sodium nitrate', 'preservative'],
    ['sodium nitrite', 'preservative'],
    
    // Artificial colors
    ['red dye', 'artificial_color'],
    ['yellow dye', 'artificial_color'],
    ['blue dye', 'artificial_color'],
    ['caramel color', 'artificial_color'],
    ['annatto', 'natural'],
    
    // Sweeteners
    ['sugar', 'sweetener'],
    ['high fructose corn syrup', 'sweetener'],
    ['aspartame', 'sweetener'],
    ['sucralose', 'sweetener'],
    ['stevia', 'sweetener'],
    ['honey', 'sweetener'],
    ['maple syrup', 'sweetener'],
    
    // Fats
    ['palm oil', 'fat'],
    ['coconut oil', 'fat'],
    ['olive oil', 'fat'],
    ['sunflower oil', 'fat'],
    ['partially hydrogenated', 'fat'],
    ['hydrogenated oil', 'fat'],
    
    // Proteins
    ['whey protein', 'protein'],
    ['soy protein', 'protein'],
    ['milk protein', 'protein'],
    ['egg white', 'protein'],
    
    // Emulsifiers/Stabilizers
    ['lecithin', 'emulsifier'],
    ['mono and diglycerides', 'emulsifier'],
    ['carrageenan', 'stabilizer'],
    ['xanthan gum', 'stabilizer'],
    ['guar gum', 'stabilizer'],
    
    // Vitamins/Minerals
    ['vitamin c', 'vitamin'],
    ['vitamin d', 'vitamin'],
    ['vitamin e', 'vitamin'],
    ['iron', 'mineral'],
    ['calcium', 'mineral'],
    ['potassium', 'mineral'],
  ]);

  async extractTextFromImage(imageUri: string): Promise<string> {
    // This would integrate with react-native-text-recognition or similar OCR library
    // For now, return mock extracted text
    return `
      INGREDIENTS: Enriched wheat flour (wheat flour, niacin, reduced iron, thiamine mononitrate, riboflavin, folic acid), sugar, palm oil, high fructose corn syrup, cocoa powder, salt, baking soda, artificial flavor, soy lecithin, red dye 40.

      NUTRITION FACTS
      Serving Size: 2 cookies (28g)
      Servings Per Container: About 15
      
      Amount Per Serving:
      Calories: 140
      Total Fat: 6g
      Saturated Fat: 3g
      Trans Fat: 0g
      Cholesterol: 0mg
      Sodium: 90mg
      Total Carbohydrate: 22g
      Dietary Fiber: 1g
      Total Sugars: 12g
      Added Sugars: 11g
      Protein: 2g
      
      Vitamin D: 0mcg
      Calcium: 10mg
      Iron: 1mg
      Potassium: 60mg
    `;
  }

  parseExtractedText(extractedText: string): Partial<FoodProduct> {
    const ingredients = this.parseIngredients(extractedText);
    const nutritionalInfo = this.parseNutritionalInfo(extractedText);
    const productName = this.extractProductName(extractedText);

    return {
      name: productName || 'Unknown Product',
      ingredients,
      nutritionalInfo,
      scannedAt: new Date()
    };
  }

  private parseIngredients(text: string): Ingredient[] {
    const ingredientsMatch = text.match(/INGREDIENTS?:?\s*([^.]+(?:\.[^.]*)*)/i);
    if (!ingredientsMatch) return [];

    const ingredientsText = ingredientsMatch[1];
    const ingredientNames = ingredientsText
      .split(/[,;]/)
      .map(ingredient => ingredient.trim().toLowerCase())
      .filter(ingredient => ingredient.length > 0);

    return ingredientNames.map(name => ({
      name: this.capitalizeWords(name),
      isAllergen: this.isAllergen(name),
      category: this.categorizeIngredient(name),
      healthImpact: this.assessHealthImpact(name)
    }));
  }

  private parseNutritionalInfo(text: string): NutritionalInfo {
    const servingSizeMatch = text.match(/serving size:?\s*([^\n]+)/i);
    const caloriesMatch = text.match(/calories:?\s*(\d+)/i);
    const fatMatch = text.match(/total fat:?\s*(\d+(?:\.\d+)?)g/i);
    const carbsMatch = text.match(/total carbohydrate:?\s*(\d+(?:\.\d+)?)g/i);
    const proteinMatch = text.match(/protein:?\s*(\d+(?:\.\d+)?)g/i);
    const fiberMatch = text.match(/dietary fiber:?\s*(\d+(?:\.\d+)?)g/i);
    const sugarMatch = text.match(/total sugars:?\s*(\d+(?:\.\d+)?)g/i);
    const sodiumMatch = text.match(/sodium:?\s*(\d+(?:\.\d+)?)mg/i);

    return {
      calories: caloriesMatch ? parseInt(caloriesMatch[1]) : 0,
      protein: proteinMatch ? parseFloat(proteinMatch[1]) : 0,
      carbohydrates: carbsMatch ? parseFloat(carbsMatch[1]) : 0,
      fat: fatMatch ? parseFloat(fatMatch[1]) : 0,
      fiber: fiberMatch ? parseFloat(fiberMatch[1]) : 0,
      sugar: sugarMatch ? parseFloat(sugarMatch[1]) : 0,
      sodium: sodiumMatch ? parseFloat(sodiumMatch[1]) : 0,
      servingSize: servingSizeMatch ? servingSizeMatch[1].trim() : 'Unknown'
    };
  }

  private extractProductName(text: string): string | null {
    // Try to extract product name from common patterns
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Usually the product name is in the first few lines
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i];
      if (line.length > 3 && line.length < 50 && !line.includes('INGREDIENTS') && !line.includes('NUTRITION')) {
        return this.capitalizeWords(line);
      }
    }
    
    return null;
  }

  private categorizeIngredient(ingredient: string): IngredientCategory {
    const lowerIngredient = ingredient.toLowerCase();
    
    for (const [keyword, category] of this.ingredientKeywords.entries()) {
      if (lowerIngredient.includes(keyword)) {
        return category;
      }
    }

    // Default categorization based on common patterns
    if (lowerIngredient.includes('oil') || lowerIngredient.includes('fat')) {
      return 'fat';
    }
    if (lowerIngredient.includes('flour') || lowerIngredient.includes('starch')) {
      return 'carbohydrate';
    }
    if (lowerIngredient.includes('protein') || lowerIngredient.includes('milk') || lowerIngredient.includes('egg')) {
      return 'protein';
    }
    if (lowerIngredient.includes('vitamin') || lowerIngredient.includes('acid') && lowerIngredient.includes('folic')) {
      return 'vitamin';
    }
    if (lowerIngredient.includes('iron') || lowerIngredient.includes('calcium') || lowerIngredient.includes('sodium')) {
      return 'mineral';
    }

    return 'other';
  }

  private isAllergen(ingredient: string): boolean {
    const commonAllergens = [
      'milk', 'egg', 'peanut', 'tree nut', 'soy', 'wheat', 'fish', 'shellfish', 'sesame'
    ];
    
    const lowerIngredient = ingredient.toLowerCase();
    return commonAllergens.some(allergen => lowerIngredient.includes(allergen));
  }

  private assessHealthImpact(ingredient: string): any {
    const lowerIngredient = ingredient.toLowerCase();
    
    // Critical ingredients
    if (lowerIngredient.includes('trans fat') || lowerIngredient.includes('partially hydrogenated')) {
      return {
        level: 'danger',
        reasons: ['Contains trans fats'],
        affectedConditions: ['Heart Disease', 'General Health']
      };
    }

    // High concern ingredients
    if (lowerIngredient.includes('high fructose corn syrup') || 
        lowerIngredient.includes('sodium nitrate') ||
        lowerIngredient.includes('bha') || 
        lowerIngredient.includes('bht')) {
      return {
        level: 'warning',
        reasons: ['Potentially harmful additive'],
        affectedConditions: ['General Health']
      };
    }

    // Medium concern ingredients
    if (lowerIngredient.includes('artificial') || 
        lowerIngredient.includes('dye') ||
        lowerIngredient.includes('msg') ||
        lowerIngredient.includes('aspartame')) {
      return {
        level: 'caution',
        reasons: ['Artificial additive'],
        affectedConditions: ['Sensitive Individuals']
      };
    }

    return {
      level: 'safe',
      reasons: [],
      affectedConditions: []
    };
  }

  private capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }
}