import { HEALTH_CONDITIONS, DIETARY_PREFERENCES } from '../data/healthConditions'

export class IngredientAnalyzer {
  static analyzeIngredients(ingredients, userProfile) {
    const analysis = {
      safe: [],
      warnings: [],
      dangerous: [],
      score: 100,
      recommendations: []
    }

    if (!ingredients || !Array.isArray(ingredients)) {
      return analysis
    }

    const normalizedIngredients = ingredients.map(ing => ing.toLowerCase().trim())
    
    // Check health conditions
    userProfile.healthConditions.forEach(conditionId => {
      const condition = HEALTH_CONDITIONS[conditionId.toUpperCase()]
      if (condition) {
        this.checkConditionRestrictions(normalizedIngredients, condition, analysis)
      }
    })

    // Check dietary preferences
    userProfile.dietaryPreferences.forEach(preferenceId => {
      const preference = DIETARY_PREFERENCES[preferenceId.toUpperCase()]
      if (preference) {
        this.checkDietaryRestrictions(normalizedIngredients, preference, analysis)
      }
    })

    // Check allergies
    userProfile.allergies.forEach(allergy => {
      this.checkAllergy(normalizedIngredients, allergy, analysis)
    })

    // Calculate final score
    analysis.score = this.calculateScore(analysis)
    
    // Generate recommendations
    analysis.recommendations = this.generateRecommendations(analysis, userProfile)

    // Categorize safe ingredients
    analysis.safe = normalizedIngredients.filter(ingredient => 
      !analysis.warnings.some(w => w.ingredient === ingredient) &&
      !analysis.dangerous.some(d => d.ingredient === ingredient)
    )

    return analysis
  }

  static checkConditionRestrictions(ingredients, condition, analysis) {
    ingredients.forEach(ingredient => {
      // Check restricted ingredients
      condition.restrictedIngredients.forEach(restricted => {
        if (ingredient.includes(restricted.toLowerCase())) {
          analysis.dangerous.push({
            ingredient,
            reason: `Restricted for ${condition.name}`,
            severity: 'high',
            condition: condition.id
          })
        }
      })

      // Check warning ingredients
      if (condition.warningIngredients) {
        condition.warningIngredients.forEach(warning => {
          if (ingredient.includes(warning.toLowerCase())) {
            analysis.warnings.push({
              ingredient,
              reason: `May be problematic for ${condition.name}`,
              severity: 'medium',
              condition: condition.id
            })
          }
        })
      }
    })
  }

  static checkDietaryRestrictions(ingredients, preference, analysis) {
    ingredients.forEach(ingredient => {
      preference.restrictedIngredients.forEach(restricted => {
        if (ingredient.includes(restricted.toLowerCase())) {
          analysis.dangerous.push({
            ingredient,
            reason: `Not suitable for ${preference.name} diet`,
            severity: 'high',
            preference: preference.id
          })
        }
      })

      if (preference.warningIngredients) {
        preference.warningIngredients.forEach(warning => {
          if (ingredient.includes(warning.toLowerCase())) {
            analysis.warnings.push({
              ingredient,
              reason: `May not be suitable for ${preference.name} diet`,
              severity: 'medium',
              preference: preference.id
            })
          }
        })
      }
    })
  }

  static checkAllergy(ingredients, allergy, analysis) {
    const allergyLower = allergy.toLowerCase()
    ingredients.forEach(ingredient => {
      if (ingredient.includes(allergyLower)) {
        analysis.dangerous.push({
          ingredient,
          reason: `Contains ${allergy} - ALLERGEN`,
          severity: 'critical',
          allergy: allergy
        })
      }
    })
  }

  static calculateScore(analysis) {
    let score = 100
    
    // Deduct points for dangerous ingredients
    score -= analysis.dangerous.length * 20
    
    // Deduct points for warnings
    score -= analysis.warnings.length * 10
    
    // Ensure score doesn't go below 0
    return Math.max(0, score)
  }

  static generateRecommendations(analysis, userProfile) {
    const recommendations = []

    if (analysis.dangerous.length > 0) {
      recommendations.push({
        type: 'avoid',
        message: 'This product contains ingredients that are not suitable for your health conditions or dietary preferences. Consider finding an alternative.',
        priority: 'high'
      })
    }

    if (analysis.warnings.length > 0) {
      recommendations.push({
        type: 'caution',
        message: 'This product contains ingredients that may require moderation based on your profile.',
        priority: 'medium'
      })
    }

    if (analysis.score >= 80) {
      recommendations.push({
        type: 'good',
        message: 'This product appears to be suitable for your dietary needs.',
        priority: 'low'
      })
    }

    return recommendations
  }

  static suggestAlternatives(product, userProfile) {
    // This would typically connect to a product database
    // For now, we'll provide generic suggestions based on the product type
    const suggestions = []

    if (product.category) {
      switch (product.category.toLowerCase()) {
        case 'snacks':
          suggestions.push({
            name: 'Fresh fruits',
            reason: 'Natural, unprocessed alternative',
            healthScore: 95
          })
          suggestions.push({
            name: 'Nuts and seeds',
            reason: 'High in healthy fats and protein',
            healthScore: 90
          })
          break
        case 'beverages':
          suggestions.push({
            name: 'Water with lemon',
            reason: 'Hydrating and natural',
            healthScore: 100
          })
          suggestions.push({
            name: 'Herbal tea',
            reason: 'Caffeine-free and antioxidant-rich',
            healthScore: 95
          })
          break
        case 'dairy':
          if (userProfile.dietaryPreferences.includes('vegan')) {
            suggestions.push({
              name: 'Plant-based milk alternatives',
              reason: 'Almond, oat, or soy milk',
              healthScore: 85
            })
          }
          break
        default:
          suggestions.push({
            name: 'Whole food alternatives',
            reason: 'Look for minimally processed options',
            healthScore: 90
          })
      }
    }

    return suggestions
  }
}