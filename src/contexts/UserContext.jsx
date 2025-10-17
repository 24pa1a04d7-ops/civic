import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'user-1',
    name: 'User',
    healthConditions: [],
    dietaryPreferences: [],
    allergies: [],
    customRestrictions: []
  })

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('smartDietUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('smartDietUser', JSON.stringify(user))
  }, [user])

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }))
  }

  const addHealthCondition = (condition) => {
    setUser(prev => ({
      ...prev,
      healthConditions: [...prev.healthConditions, condition]
    }))
  }

  const removeHealthCondition = (conditionId) => {
    setUser(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.filter(c => c !== conditionId)
    }))
  }

  const addDietaryPreference = (preference) => {
    setUser(prev => ({
      ...prev,
      dietaryPreferences: [...prev.dietaryPreferences, preference]
    }))
  }

  const removeDietaryPreference = (preferenceId) => {
    setUser(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.filter(p => p !== preferenceId)
    }))
  }

  const addAllergy = (allergy) => {
    setUser(prev => ({
      ...prev,
      allergies: [...prev.allergies, allergy]
    }))
  }

  const removeAllergy = (allergy) => {
    setUser(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }))
  }

  const value = {
    user,
    updateUser,
    addHealthCondition,
    removeHealthCondition,
    addDietaryPreference,
    removeDietaryPreference,
    addAllergy,
    removeAllergy
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}