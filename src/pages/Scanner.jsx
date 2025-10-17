import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Upload, Scan, AlertCircle, CheckCircle } from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import { useProduct } from '../contexts/ProductContext'
import { IngredientAnalyzer } from '../services/ingredientAnalyzer'

const Scanner = () => {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [error, setError] = useState(null)
  const [manualInput, setManualInput] = useState('')
  const [productName, setProductName] = useState('')
  const [showManualInput, setShowManualInput] = useState(false)
  
  const { user } = useUser()
  const { addScannedProduct } = useProduct()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  // Mock OCR function - in a real app, this would use a service like Google Vision API
  const mockOCR = (imageData) => {
    // Simulate OCR processing delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock ingredient list - in reality, this would be extracted from the image
        const mockIngredients = [
          'enriched wheat flour',
          'sugar',
          'palm oil',
          'high fructose corn syrup',
          'salt',
          'baking soda',
          'natural flavors',
          'soy lecithin'
        ]
        
        resolve({
          ingredients: mockIngredients,
          nutritionFacts: {
            calories: 150,
            totalFat: '8g',
            saturatedFat: '3g',
            sodium: '230mg',
            totalCarbs: '20g',
            sugars: '12g',
            protein: '2g'
          }
        })
      }, 2000)
    })
  }

  const handleImageUpload = async (file) => {
    if (!file) return

    setIsScanning(true)
    setError(null)

    try {
      // Create image data URL for display
      const imageUrl = URL.createObjectURL(file)
      
      // Mock OCR processing
      const ocrResult = await mockOCR(imageUrl)
      
      // Analyze ingredients
      const analysis = IngredientAnalyzer.analyzeIngredients(ocrResult.ingredients, user)
      
      const product = {
        id: `product-${Date.now()}`,
        name: productName || 'Scanned Product',
        ingredients: ocrResult.ingredients,
        nutritionFacts: ocrResult.nutritionFacts,
        analysis,
        imageUrl,
        category: 'snacks' // This would be determined by AI in a real app
      }

      const savedProduct = addScannedProduct(product)
      setScanResult(savedProduct)
      
    } catch (err) {
      setError('Failed to scan the image. Please try again.')
      console.error('Scanning error:', err)
    } finally {
      setIsScanning(false)
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (!manualInput.trim()) return

    const ingredients = manualInput
      .split(',')
      .map(ing => ing.trim())
      .filter(ing => ing.length > 0)

    if (ingredients.length === 0) {
      setError('Please enter at least one ingredient')
      return
    }

    const analysis = IngredientAnalyzer.analyzeIngredients(ingredients, user)
    
    const product = {
      id: `product-${Date.now()}`,
      name: productName || 'Manual Entry',
      ingredients,
      analysis,
      category: 'unknown'
    }

    const savedProduct = addScannedProduct(product)
    setScanResult(savedProduct)
    setManualInput('')
    setProductName('')
    setShowManualInput(false)
  }

  const viewProductDetails = () => {
    if (scanResult) {
      navigate(`/product/${scanResult.id}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Scan Food Label</h1>
        <p className="text-gray-600">
          Upload a photo of the ingredients list or enter ingredients manually
        </p>
      </div>

      {/* Scanning Options */}
      {!scanResult && (
        <div className="space-y-6">
          {/* Camera/Upload Section */}
          <div className="card text-center">
            <div className="space-y-4">
              <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <Camera className="h-10 w-10 text-primary-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Scan Ingredients</h3>
                <p className="text-gray-600 mb-4">
                  Take a photo or upload an image of the ingredients list
                </p>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Product name (optional)"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="input"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isScanning}
                    className="btn-primary w-full"
                  >
                    {isScanning ? (
                      <>
                        <Scan className="h-5 w-5 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 mr-2" />
                        Upload Image
                      </>
                    )}
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Manual Input Option */}
          <div className="text-center">
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Or enter ingredients manually
            </button>
          </div>

          {showManualInput && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Entry</h3>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="input"
                />
                <textarea
                  placeholder="Enter ingredients separated by commas (e.g., wheat flour, sugar, salt, palm oil)"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  rows={4}
                  className="input resize-none"
                  required
                />
                <button type="submit" className="btn-primary w-full">
                  Analyze Ingredients
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-danger-600 flex-shrink-0" />
          <p className="text-danger-700">{error}</p>
        </div>
      )}

      {/* Scan Result */}
      {scanResult && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="h-6 w-6 text-success-600" />
            <h3 className="text-xl font-semibold text-gray-900">Scan Complete!</h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{scanResult.name}</h4>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                scanResult.analysis.score >= 80 
                  ? 'bg-success-50 text-success-700'
                  : scanResult.analysis.score >= 60
                  ? 'bg-warning-50 text-warning-700'
                  : 'bg-danger-50 text-danger-700'
              }`}>
                Health Score: {scanResult.analysis.score}/100
              </div>
            </div>

            {scanResult.analysis.dangerous.length > 0 && (
              <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                <h5 className="font-medium text-danger-900 mb-2">⚠️ Ingredients to Avoid:</h5>
                <ul className="text-sm text-danger-700 space-y-1">
                  {scanResult.analysis.dangerous.map((item, index) => (
                    <li key={index}>• {item.ingredient} - {item.reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {scanResult.analysis.warnings.length > 0 && (
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                <h5 className="font-medium text-warning-900 mb-2">⚠️ Caution:</h5>
                <ul className="text-sm text-warning-700 space-y-1">
                  {scanResult.analysis.warnings.map((item, index) => (
                    <li key={index}>• {item.ingredient} - {item.reason}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex space-x-3">
              <button onClick={viewProductDetails} className="btn-primary flex-1">
                View Detailed Analysis
              </button>
              <button 
                onClick={() => {
                  setScanResult(null)
                  setError(null)
                  setProductName('')
                }}
                className="btn-secondary"
              >
                Scan Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Scanner