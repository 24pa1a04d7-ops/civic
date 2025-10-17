import React from 'react'
import { Link } from 'react-router-dom'
import { Scan, Shield, Heart, TrendingUp, Camera, UserCheck } from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import { useProduct } from '../contexts/ProductContext'

const Home = () => {
  const { user } = useUser()
  const { scannedProducts } = useProduct()

  const features = [
    {
      icon: Camera,
      title: 'Smart Scanning',
      description: 'Scan food labels instantly with your camera'
    },
    {
      icon: Shield,
      title: 'Health Protection',
      description: 'Identify harmful ingredients based on your health conditions'
    },
    {
      icon: Heart,
      title: 'Personalized Analysis',
      description: 'Get recommendations tailored to your dietary needs'
    },
    {
      icon: TrendingUp,
      title: 'Health Insights',
      description: 'Track your nutrition and make informed choices'
    }
  ]

  const quickStats = [
    {
      label: 'Products Scanned',
      value: scannedProducts.length,
      icon: Scan
    },
    {
      label: 'Health Conditions',
      value: user.healthConditions.length,
      icon: UserCheck
    },
    {
      label: 'Dietary Preferences',
      value: user.dietaryPreferences.length,
      icon: Heart
    }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Make <span className="text-primary-600">Smart</span> Food Choices
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Scan food labels, analyze ingredients, and get personalized recommendations 
          based on your health conditions and dietary preferences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/scanner" className="btn-primary text-lg px-8 py-3">
            <Scan className="h-5 w-5 mr-2" />
            Start Scanning
          </Link>
          <Link to="/profile" className="btn-secondary text-lg px-8 py-3">
            <UserCheck className="h-5 w-5 mr-2" />
            Setup Profile
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card text-center">
            <div className="bg-primary-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
            <div className="text-gray-600">{label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center">
              <div className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {scannedProducts.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Scans</h2>
            <Link to="/history" className="text-primary-600 hover:text-primary-700 font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {scannedProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Scanned {new Date(product.scannedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.analysis?.score >= 80 
                    ? 'bg-success-50 text-success-700'
                    : product.analysis?.score >= 60
                    ? 'bg-warning-50 text-warning-700'
                    : 'bg-danger-50 text-danger-700'
                }`}>
                  Score: {product.analysis?.score || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-primary-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
        <p className="text-xl mb-6 text-primary-100">
          Set up your health profile and start making informed food choices today.
        </p>
        <Link to="/profile" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
          Complete Your Profile
        </Link>
      </div>
    </div>
  )
}

export default Home