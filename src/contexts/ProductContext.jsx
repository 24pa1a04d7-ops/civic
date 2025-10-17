import React, { createContext, useContext, useState, useEffect } from 'react'

const ProductContext = createContext()

export const useProduct = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider')
  }
  return context
}

export const ProductProvider = ({ children }) => {
  const [scannedProducts, setScannedProducts] = useState([])
  const [currentProduct, setCurrentProduct] = useState(null)

  // Load scanned products from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('smartDietScannedProducts')
    if (savedProducts) {
      setScannedProducts(JSON.parse(savedProducts))
    }
  }, [])

  // Save scanned products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('smartDietScannedProducts', JSON.stringify(scannedProducts))
  }, [scannedProducts])

  const addScannedProduct = (product) => {
    const productWithTimestamp = {
      ...product,
      scannedAt: new Date().toISOString(),
      id: product.id || `product-${Date.now()}`
    }
    
    setScannedProducts(prev => [productWithTimestamp, ...prev])
    setCurrentProduct(productWithTimestamp)
    return productWithTimestamp
  }

  const removeScannedProduct = (productId) => {
    setScannedProducts(prev => prev.filter(p => p.id !== productId))
  }

  const clearHistory = () => {
    setScannedProducts([])
  }

  const getProductById = (id) => {
    return scannedProducts.find(p => p.id === id)
  }

  const value = {
    scannedProducts,
    currentProduct,
    setCurrentProduct,
    addScannedProduct,
    removeScannedProduct,
    clearHistory,
    getProductById
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}