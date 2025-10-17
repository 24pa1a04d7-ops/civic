import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Scanner from './pages/Scanner'
import Profile from './pages/Profile'
import History from './pages/History'
import ProductDetails from './pages/ProductDetails'
import { UserProvider } from './contexts/UserContext'
import { ProductProvider } from './contexts/ProductContext'

function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/scanner" element={<Scanner />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/history" element={<History />} />
                <Route path="/product/:id" element={<ProductDetails />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ProductProvider>
    </UserProvider>
  )
}

export default App