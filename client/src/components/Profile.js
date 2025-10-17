import React, { useState, useEffect } from 'react';
import { Save, User, Heart, Shield, Leaf } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    health_conditions: [],
    allergies: [],
    dietary_preferences: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        health_conditions: user.health_conditions || [],
        allergies: user.allergies || [],
        dietary_preferences: user.dietary_preferences || []
      });
    }
  }, [user]);

  const healthConditions = [
    'diabetes', 'hypertension', 'heart_disease', 'high_cholesterol', 
    'obesity', 'metabolic_syndrome', 'cancer_risk', 'migraines'
  ];

  const allergies = [
    'nuts', 'dairy', 'eggs', 'soy', 'wheat', 'fish', 'shellfish', 
    'sesame', 'sulfites', 'msg'
  ];

  const dietaryPreferences = [
    'vegan', 'vegetarian', 'keto', 'paleo', 'gluten_free', 
    'dairy_free', 'low_sodium', 'low_sugar'
  ];

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await updateProfile(formData);
    
    if (result.success) {
      setMessage('Profile updated successfully!');
    } else {
      setMessage('Error updating profile. Please try again.');
    }
    
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your health conditions, allergies, and dietary preferences for personalized recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-primary-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">{user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Health Settings */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Health Conditions */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Heart className="w-5 h-5 text-danger-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Health Conditions</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Select any health conditions you have. This helps us provide better warnings and recommendations.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {healthConditions.map((condition) => (
                  <label key={condition} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.health_conditions.includes(condition)}
                      onChange={() => handleArrayChange('health_conditions', condition)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {condition.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-5 h-5 text-warning-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Allergies</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Select any food allergies you have. We'll warn you about these ingredients.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {allergies.map((allergy) => (
                  <label key={allergy} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allergies.includes(allergy)}
                      onChange={() => handleArrayChange('allergies', allergy)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {allergy.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dietary Preferences */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Leaf className="w-5 h-5 text-success-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Dietary Preferences</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Select your dietary preferences to get personalized recommendations.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dietaryPreferences.map((preference) => (
                  <label key={preference} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.dietary_preferences.includes(preference)}
                      onChange={() => handleArrayChange('dietary_preferences', preference)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {preference.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('successfully') 
                  ? 'bg-success-50 text-success-700 border border-success-200'
                  : 'bg-danger-50 text-danger-700 border border-danger-200'
              }`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;