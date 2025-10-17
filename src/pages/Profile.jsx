import React, { useState } from 'react'
import { User, Plus, X, Save, AlertTriangle, Heart, Shield } from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import { HEALTH_CONDITIONS, DIETARY_PREFERENCES } from '../data/healthConditions'

const Profile = () => {
  const {
    user,
    updateUser,
    addHealthCondition,
    removeHealthCondition,
    addDietaryPreference,
    removeDietaryPreference,
    addAllergy,
    removeAllergy
  } = useUser()

  const [newAllergy, setNewAllergy] = useState('')
  const [showSaveMessage, setShowSaveMessage] = useState(false)

  const handleNameChange = (e) => {
    updateUser({ name: e.target.value })
  }

  const handleAddAllergy = (e) => {
    e.preventDefault()
    if (newAllergy.trim() && !user.allergies.includes(newAllergy.trim())) {
      addAllergy(newAllergy.trim())
      setNewAllergy('')
      showSaveNotification()
    }
  }

  const handleRemoveAllergy = (allergy) => {
    removeAllergy(allergy)
    showSaveNotification()
  }

  const handleHealthConditionToggle = (conditionId) => {
    if (user.healthConditions.includes(conditionId)) {
      removeHealthCondition(conditionId)
    } else {
      addHealthCondition(conditionId)
    }
    showSaveNotification()
  }

  const handleDietaryPreferenceToggle = (preferenceId) => {
    if (user.dietaryPreferences.includes(preferenceId)) {
      removeDietaryPreference(preferenceId)
    } else {
      addDietaryPreference(preferenceId)
    }
    showSaveNotification()
  }

  const showSaveNotification = () => {
    setShowSaveMessage(true)
    setTimeout(() => setShowSaveMessage(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-10 w-10 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Health Profile</h1>
        <p className="text-gray-600">
          Customize your dietary preferences and health conditions for personalized recommendations
        </p>
      </div>

      {/* Save Notification */}
      {showSaveMessage && (
        <div className="fixed top-4 right-4 bg-success-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
          <Save className="h-4 w-4" />
          <span>Profile updated!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={user.name}
                onChange={handleNameChange}
                className="input"
                placeholder="Enter your name"
              />
            </div>
          </div>
        </div>

        {/* Allergies */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-danger-600" />
            Allergies
          </h2>
          
          <form onSubmit={handleAddAllergy} className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add an allergy (e.g., peanuts, shellfish)"
                className="input flex-1"
              />
              <button type="submit" className="btn-primary">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {user.allergies.length === 0 ? (
              <p className="text-gray-500 text-sm">No allergies added yet</p>
            ) : (
              user.allergies.map((allergy) => (
                <div key={allergy} className="flex items-center justify-between bg-danger-50 px-3 py-2 rounded-lg">
                  <span className="text-danger-900 font-medium">{allergy}</span>
                  <button
                    onClick={() => handleRemoveAllergy(allergy)}
                    className="text-danger-600 hover:text-danger-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Health Conditions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary-600" />
          Health Conditions
        </h2>
        <p className="text-gray-600 mb-6">
          Select any health conditions you have. This helps us identify ingredients you should avoid.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(HEALTH_CONDITIONS).map((condition) => (
            <div
              key={condition.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                user.healthConditions.includes(condition.id)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleHealthConditionToggle(condition.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{condition.name}</h3>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  user.healthConditions.includes(condition.id)
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}>
                  {user.healthConditions.includes(condition.id) && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">{condition.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dietary Preferences */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Heart className="h-5 w-5 mr-2 text-success-600" />
          Dietary Preferences
        </h2>
        <p className="text-gray-600 mb-6">
          Choose your dietary preferences to get recommendations that align with your lifestyle.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(DIETARY_PREFERENCES).map((preference) => (
            <div
              key={preference.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                user.dietaryPreferences.includes(preference.id)
                  ? 'border-success-500 bg-success-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleDietaryPreferenceToggle(preference.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{preference.name}</h3>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  user.dietaryPreferences.includes(preference.id)
                    ? 'border-success-500 bg-success-500'
                    : 'border-gray-300'
                }`}>
                  {user.dietaryPreferences.includes(preference.id) && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">{preference.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Summary */}
      <div className="card bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {user.healthConditions.length}
            </div>
            <div className="text-sm text-gray-600">Health Conditions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success-600 mb-1">
              {user.dietaryPreferences.length}
            </div>
            <div className="text-sm text-gray-600">Dietary Preferences</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-danger-600 mb-1">
              {user.allergies.length}
            </div>
            <div className="text-sm text-gray-600">Allergies</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile