import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { History as HistoryIcon, Search, Trash2, Eye, Calendar, Filter } from 'lucide-react'
import { useProduct } from '../contexts/ProductContext'

const History = () => {
  const { scannedProducts, removeScannedProduct, clearHistory } = useProduct()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterScore, setFilterScore] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  // Filter and sort products
  const filteredProducts = scannedProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesScore = filterScore === 'all' || 
        (filterScore === 'good' && product.analysis?.score >= 80) ||
        (filterScore === 'fair' && product.analysis?.score >= 60 && product.analysis?.score < 80) ||
        (filterScore === 'poor' && product.analysis?.score < 60)
      
      return matchesSearch && matchesScore
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.scannedAt) - new Date(a.scannedAt)
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      } else if (sortBy === 'score') {
        return (b.analysis?.score || 0) - (a.analysis?.score || 0)
      }
      return 0
    })

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-success-50 text-success-700 border-success-200'
    if (score >= 60) return 'bg-warning-50 text-warning-700 border-warning-200'
    return 'bg-danger-50 text-danger-700 border-danger-200'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Good'
    if (score >= 60) return 'Fair'
    return 'Poor'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <HistoryIcon className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Scan History</h1>
        <p className="text-gray-600">
          Review your previously scanned products and their health analyses
        </p>
      </div>

      {scannedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <HistoryIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Products Scanned Yet</h2>
          <p className="text-gray-600 mb-6">Start scanning food labels to see your history here.</p>
          <Link to="/scanner" className="btn-primary">
            Start Scanning
          </Link>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="card">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 lg:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex space-x-4">
                <select
                  value={filterScore}
                  onChange={(e) => setFilterScore(e.target.value)}
                  className="input"
                >
                  <option value="all">All Scores</option>
                  <option value="good">Good (80+)</option>
                  <option value="fair">Fair (60-79)</option>
                  <option value="poor">Poor (&lt;60)</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="score">Sort by Score</option>
                </select>
              </div>

              {/* Clear History */}
              {scannedProducts.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all scan history?')) {
                      clearHistory()
                    }
                  }}
                  className="btn-danger flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {scannedProducts.length} products
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No products match your current filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="card hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  {product.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(product.scannedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Health Score */}
                    {product.analysis && (
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(product.analysis.score)}`}>
                        Score: {product.analysis.score}/100 ({getScoreLabel(product.analysis.score)})
                      </div>
                    )}

                    {/* Issues Summary */}
                    {product.analysis && (
                      <div className="flex space-x-4 text-sm">
                        {product.analysis.dangerous.length > 0 && (
                          <span className="text-danger-600">
                            {product.analysis.dangerous.length} to avoid
                          </span>
                        )}
                        {product.analysis.warnings.length > 0 && (
                          <span className="text-warning-600">
                            {product.analysis.warnings.length} warnings
                          </span>
                        )}
                        {product.analysis.safe.length > 0 && (
                          <span className="text-success-600">
                            {product.analysis.safe.length} safe
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="btn-primary flex-1 text-center flex items-center justify-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to remove this product?')) {
                            removeScannedProduct(product.id)
                          }
                        }}
                        className="btn-secondary p-2"
                        title="Remove product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default History