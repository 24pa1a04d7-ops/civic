import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, CheckCircle, Info, Lightbulb, TrendingUp } from 'lucide-react'
import { useProduct } from '../contexts/ProductContext'
import { useUser } from '../contexts/UserContext'
import { IngredientAnalyzer } from '../services/ingredientAnalyzer'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProductById } = useProduct()
  const { user } = useUser()
  
  const product = getProductById(id)

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/history')} className="btn-primary">
          View History
        </button>
      </div>
    )
  }

  const alternatives = IngredientAnalyzer.suggestAlternatives(product, user)

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success-600 bg-success-50'
    if (score >= 60) return 'text-warning-600 bg-warning-50'
    return 'text-danger-600 bg-danger-50'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600">
            Scanned on {new Date(product.scannedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Health Score */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Health Score</h2>
          <div className={`px-4 py-2 rounded-full font-bold text-2xl ${getScoreColor(product.analysis.score)}`}>
            {product.analysis.score}/100
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Health Score</span>
            <span>{getScoreLabel(product.analysis.score)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                product.analysis.score >= 80 ? 'bg-success-500' :
                product.analysis.score >= 60 ? 'bg-warning-500' : 'bg-danger-500'
              }`}
              style={{ width: `${product.analysis.score}%` }}
            ></div>
          </div>
        </div>

        {product.analysis.recommendations.length > 0 && (
          <div className="space-y-2">
            {product.analysis.recommendations.map((rec, index) => (
              <div key={index} className={`p-3 rounded-lg flex items-start space-x-3 ${
                rec.type === 'avoid' ? 'bg-danger-50 text-danger-700' :
                rec.type === 'caution' ? 'bg-warning-50 text-warning-700' :
                'bg-success-50 text-success-700'
              }`}>
                <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{rec.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ingredient Analysis */}
        <div className="space-y-6">
          {/* Dangerous Ingredients */}
          {product.analysis.dangerous.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-danger-600" />
                Ingredients to Avoid
              </h3>
              <div className="space-y-3">
                {product.analysis.dangerous.map((item, index) => (
                  <div key={index} className="bg-danger-50 border border-danger-200 rounded-lg p-3">
                    <div className="font-medium text-danger-900 capitalize">{item.ingredient}</div>
                    <div className="text-sm text-danger-700 mt-1">{item.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning Ingredients */}
          {product.analysis.warnings.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-warning-600" />
                Caution Required
              </h3>
              <div className="space-y-3">
                {product.analysis.warnings.map((item, index) => (
                  <div key={index} className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                    <div className="font-medium text-warning-900 capitalize">{item.ingredient}</div>
                    <div className="text-sm text-warning-700 mt-1">{item.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safe Ingredients */}
          {product.analysis.safe.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-success-600" />
                Safe Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.analysis.safe.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-success-50 text-success-700 rounded-full text-sm capitalize"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="space-y-6">
          {/* All Ingredients */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Ingredients</h3>
            <div className="text-sm text-gray-600 leading-relaxed">
              {product.ingredients.join(', ')}
            </div>
          </div>

          {/* Nutrition Facts */}
          {product.nutritionFacts && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Nutrition Facts
              </h3>
              <div className="space-y-2 text-sm">
                {Object.entries(product.nutritionFacts).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                    </span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Healthier Alternatives */}
          {alternatives.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-primary-600" />
                Healthier Alternatives
              </h3>
              <div className="space-y-3">
                {alternatives.map((alt, index) => (
                  <div key={index} className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-primary-900">{alt.name}</div>
                      <div className="text-sm font-medium text-primary-700">
                        Score: {alt.healthScore}/100
                      </div>
                    </div>
                    <div className="text-sm text-primary-700">{alt.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Image */}
      {product.imageUrl && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scanned Image</h3>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full max-w-md mx-auto rounded-lg shadow-sm"
          />
        </div>
      )}
    </div>
  )
}

export default ProductDetails