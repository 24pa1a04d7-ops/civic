import { 
  FoodProduct, 
  AnalysisResult, 
  User, 
  Ingredient, 
  FlaggedIngredient, 
  HealthImpact,
  Recommendation,
  NutritionalAnalysis 
} from '../types';
import { HEALTH_CONDITIONS } from '../constants/healthConditions';
import { COMMON_ALLERGIES } from '../constants/allergies';
import { DIETARY_PREFERENCES } from '../constants/dietaryPreferences';

export class IngredientAnalyzer {
  private harmfulIngredients = new Map<string, {
    category: string;
    harmLevel: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }>([
    // Artificial colors
    ['red dye 40', { category: 'artificial_color', harmLevel: 'medium', description: 'May cause hyperactivity in children' }],
    ['yellow dye 5', { category: 'artificial_color', harmLevel: 'medium', description: 'May cause allergic reactions' }],
    ['blue dye 1', { category: 'artificial_color', harmLevel: 'low', description: 'Artificial coloring agent' }],
    
    // Preservatives
    ['sodium benzoate', { category: 'preservative', harmLevel: 'medium', description: 'May form benzene when combined with vitamin C' }],
    ['potassium sorbate', { category: 'preservative', harmLevel: 'low', description: 'Generally safe preservative' }],
    ['bha', { category: 'preservative', harmLevel: 'high', description: 'Possible carcinogen' }],
    ['bht', { category: 'preservative', harmLevel: 'high', description: 'Possible carcinogen' }],
    
    // Artificial sweeteners
    ['aspartame', { category: 'sweetener', harmLevel: 'medium', description: 'May cause headaches in sensitive individuals' }],
    ['sucralose', { category: 'sweetener', harmLevel: 'low', description: 'Artificial sweetener' }],
    ['acesulfame potassium', { category: 'sweetener', harmLevel: 'medium', description: 'Artificial sweetener with limited safety data' }],
    
    // Trans fats
    ['partially hydrogenated oil', { category: 'fat', harmLevel: 'critical', description: 'Contains trans fats, increases heart disease risk' }],
    ['hydrogenated oil', { category: 'fat', harmLevel: 'high', description: 'May contain trans fats' }],
    
    // High sodium ingredients
    ['monosodium glutamate', { category: 'flavor_enhancer', harmLevel: 'medium', description: 'May cause sensitivity reactions' }],
    
    // Nitrates/Nitrites
    ['sodium nitrate', { category: 'preservative', harmLevel: 'high', description: 'May form nitrosamines, potential carcinogens' }],
    ['sodium nitrite', { category: 'preservative', harmLevel: 'high', description: 'May form nitrosamines, potential carcinogens' }],
  ]);

  analyzeProduct(product: FoodProduct, user: User): AnalysisResult {
    const flaggedIngredients = this.analyzeFlaggedIngredients(product.ingredients, user);
    const overallSafety = this.calculateOverallSafety(flaggedIngredients);
    const nutritionalAnalysis = this.analyzeNutrition(product.nutritionalInfo, user);
    const recommendations = this.generateRecommendations(flaggedIngredients, nutritionalAnalysis, user);
    const alternatives = this.suggestAlternatives(product, flaggedIngredients);

    return {
      productId: product.id,
      overallSafety,
      flaggedIngredients,
      nutritionalAnalysis,
      recommendations,
      alternatives
    };
  }

  private analyzeFlaggedIngredients(ingredients: Ingredient[], user: User): FlaggedIngredient[] {
    const flagged: FlaggedIngredient[] = [];

    for (const ingredient of ingredients) {
      const flags = this.checkIngredient(ingredient, user);
      if (flags.length > 0) {
        flagged.push(...flags);
      }
    }

    return flagged;
  }

  private checkIngredient(ingredient: Ingredient, user: User): FlaggedIngredient[] {
    const flags: FlaggedIngredient[] = [];
    const ingredientName = ingredient.name.toLowerCase();

    // Check against user's health conditions
    for (const condition of user.healthConditions) {
      const healthCondition = HEALTH_CONDITIONS.find(hc => hc.id === condition.id);
      if (healthCondition) {
        for (const restricted of healthCondition.restrictedIngredients) {
          if (ingredientName.includes(restricted.toLowerCase())) {
            flags.push({
              ingredient,
              reason: `Restricted for ${healthCondition.name}`,
              severity: healthCondition.severity,
              affectedConditions: [healthCondition.name],
              suggestions: [`Avoid due to ${healthCondition.name}`]
            });
          }
        }
      }
    }

    // Check against user's allergies
    for (const allergy of user.allergies) {
      const allergyData = COMMON_ALLERGIES.find(a => a.id === allergy.id);
      if (allergyData) {
        for (const allergen of allergyData.allergens) {
          if (ingredientName.includes(allergen.toLowerCase())) {
            flags.push({
              ingredient,
              reason: `Contains ${allergyData.name} allergen`,
              severity: this.mapAllergySeverity(allergyData.severity),
              affectedConditions: [allergyData.name],
              suggestions: [`Strictly avoid due to ${allergyData.name} allergy`]
            });
          }
        }
      }
    }

    // Check against dietary preferences
    for (const preference of user.dietaryPreferences) {
      const dietaryPref = DIETARY_PREFERENCES.find(dp => dp.id === preference.id);
      if (dietaryPref) {
        for (const restricted of dietaryPref.restrictedIngredients) {
          if (ingredientName.includes(restricted.toLowerCase())) {
            flags.push({
              ingredient,
              reason: `Not compatible with ${dietaryPref.name} diet`,
              severity: 'medium',
              affectedConditions: [dietaryPref.name],
              suggestions: [`Consider ${dietaryPref.name}-friendly alternatives`]
            });
          }
        }
      }
    }

    // Check against generally harmful ingredients
    const harmfulInfo = this.harmfulIngredients.get(ingredientName);
    if (harmfulInfo) {
      flags.push({
        ingredient,
        reason: harmfulInfo.description,
        severity: harmfulInfo.harmLevel,
        affectedConditions: ['General Health'],
        suggestions: ['Consider products without this ingredient']
      });
    }

    return flags;
  }

  private mapAllergySeverity(allergySeverity: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (allergySeverity) {
      case 'mild': return 'low';
      case 'moderate': return 'medium';
      case 'severe': return 'high';
      case 'anaphylactic': return 'critical';
      default: return 'medium';
    }
  }

  private calculateOverallSafety(flaggedIngredients: FlaggedIngredient[]): 'safe' | 'caution' | 'warning' | 'danger' {
    if (flaggedIngredients.length === 0) return 'safe';

    const hasCritical = flaggedIngredients.some(f => f.severity === 'critical');
    const hasHigh = flaggedIngredients.some(f => f.severity === 'high');
    const hasMedium = flaggedIngredients.some(f => f.severity === 'medium');

    if (hasCritical) return 'danger';
    if (hasHigh) return 'warning';
    if (hasMedium) return 'caution';
    return 'safe';
  }

  private analyzeNutrition(nutritionalInfo: any, user: User): NutritionalAnalysis {
    const concerns: string[] = [];
    const strengths: string[] = [];
    let score = 100;

    // Check calories
    if (nutritionalInfo.calories > 300) {
      concerns.push('High calorie content');
      score -= 10;
    } else if (nutritionalInfo.calories < 100) {
      strengths.push('Low calorie option');
    }

    // Check sugar
    if (nutritionalInfo.sugar > 15) {
      concerns.push('High sugar content');
      score -= 15;
    } else if (nutritionalInfo.sugar < 5) {
      strengths.push('Low sugar content');
    }

    // Check sodium
    if (nutritionalInfo.sodium > 600) {
      concerns.push('High sodium content');
      score -= 15;
    } else if (nutritionalInfo.sodium < 140) {
      strengths.push('Low sodium content');
    }

    // Check fiber
    if (nutritionalInfo.fiber >= 3) {
      strengths.push('Good source of fiber');
    } else if (nutritionalInfo.fiber < 1) {
      concerns.push('Low fiber content');
      score -= 5;
    }

    // Check protein
    if (nutritionalInfo.protein >= 10) {
      strengths.push('Good protein source');
    }

    // Check for user-specific conditions
    for (const condition of user.healthConditions) {
      if (condition.id === 'diabetes' && nutritionalInfo.sugar > 10) {
        concerns.push('High sugar - not suitable for diabetes management');
        score -= 20;
      }
      if (condition.id === 'hypertension' && nutritionalInfo.sodium > 400) {
        concerns.push('High sodium - not suitable for blood pressure management');
        score -= 20;
      }
    }

    return {
      score: Math.max(0, score),
      strengths,
      concerns,
      dailyValuePercentages: this.calculateDailyValues(nutritionalInfo)
    };
  }

  private calculateDailyValues(nutritionalInfo: any): { [key: string]: number } {
    // Based on 2000 calorie diet
    return {
      calories: (nutritionalInfo.calories / 2000) * 100,
      protein: (nutritionalInfo.protein / 50) * 100,
      carbohydrates: (nutritionalInfo.carbohydrates / 300) * 100,
      fat: (nutritionalInfo.fat / 65) * 100,
      fiber: (nutritionalInfo.fiber / 25) * 100,
      sugar: (nutritionalInfo.sugar / 50) * 100,
      sodium: (nutritionalInfo.sodium / 2300) * 100,
    };
  }

  private generateRecommendations(
    flaggedIngredients: FlaggedIngredient[], 
    nutritionalAnalysis: NutritionalAnalysis, 
    user: User
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Critical ingredient recommendations
    const criticalIngredients = flaggedIngredients.filter(f => f.severity === 'critical');
    if (criticalIngredients.length > 0) {
      recommendations.push({
        type: 'avoid',
        title: 'Avoid This Product',
        description: `Contains critical ingredients that may be dangerous for your health conditions: ${criticalIngredients.map(f => f.ingredient.name).join(', ')}`,
        priority: 'high'
      });
    }

    // High severity recommendations
    const highSeverityIngredients = flaggedIngredients.filter(f => f.severity === 'high');
    if (highSeverityIngredients.length > 0) {
      recommendations.push({
        type: 'limit',
        title: 'Use With Caution',
        description: `Contains ingredients that should be limited: ${highSeverityIngredients.map(f => f.ingredient.name).join(', ')}`,
        priority: 'high'
      });
    }

    // Nutritional recommendations
    if (nutritionalAnalysis.concerns.length > 0) {
      recommendations.push({
        type: 'general',
        title: 'Nutritional Concerns',
        description: `Consider the following: ${nutritionalAnalysis.concerns.join(', ')}`,
        priority: 'medium'
      });
    }

    // Positive recommendations
    if (nutritionalAnalysis.strengths.length > 0) {
      recommendations.push({
        type: 'general',
        title: 'Nutritional Benefits',
        description: `This product offers: ${nutritionalAnalysis.strengths.join(', ')}`,
        priority: 'low'
      });
    }

    return recommendations;
  }

  private suggestAlternatives(product: FoodProduct, flaggedIngredients: FlaggedIngredient[]) {
    // This would typically connect to a product database
    // For now, return mock alternatives
    return [
      {
        id: 'alt1',
        name: `Organic ${product.name}`,
        brand: 'Natural Choice',
        reason: 'No artificial additives',
        healthScore: 85,
        availability: 'Available at most grocery stores'
      },
      {
        id: 'alt2',
        name: `Low Sodium ${product.name}`,
        brand: 'Healthy Options',
        reason: 'Reduced sodium content',
        healthScore: 78,
        availability: 'Available online and select stores'
      }
    ];
  }
}