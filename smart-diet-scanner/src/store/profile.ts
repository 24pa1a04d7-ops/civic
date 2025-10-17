import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { produce } from 'immer'

export type HealthCondition =
  | 'diabetes'
  | 'hypertension'
  | 'celiac'
  | 'pcos'
  | 'pregnancy'
  | 'kidney_disease'

export type DietPreference =
  | 'vegan'
  | 'vegetarian'
  | 'keto'
  | 'paleo'
  | 'low_sodium'
  | 'low_sugar'
  | 'gluten_free'

export interface ProfileState {
  name: string
  allergies: string[]
  healthConditions: HealthCondition[]
  dietPreferences: DietPreference[]
  restrictedIngredients: string[]

  setName: (name: string) => void
  toggleAllergy: (allergen: string) => void
  toggleCondition: (condition: HealthCondition) => void
  togglePreference: (pref: DietPreference) => void
  addRestricted: (ingredient: string) => void
  removeRestricted: (ingredient: string) => void
  reset: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: '',
      allergies: [],
      healthConditions: [],
      dietPreferences: [],
      restrictedIngredients: [],

      setName: (name) => set({ name }),
      toggleAllergy: (allergen) =>
        set(
          produce<ProfileState>((state) => {
            const exists = state.allergies.includes(allergen)
            state.allergies = exists
              ? state.allergies.filter((a) => a !== allergen)
              : [...state.allergies, allergen]
          }),
        ),
      toggleCondition: (condition) =>
        set(
          produce<ProfileState>((state) => {
            const exists = state.healthConditions.includes(condition)
            state.healthConditions = exists
              ? state.healthConditions.filter((c) => c !== condition)
              : [...state.healthConditions, condition]
          }),
        ),
      togglePreference: (pref) =>
        set(
          produce<ProfileState>((state) => {
            const exists = state.dietPreferences.includes(pref)
            state.dietPreferences = exists
              ? state.dietPreferences.filter((p) => p !== pref)
              : [...state.dietPreferences, pref]
          }),
        ),
      addRestricted: (ingredient) =>
        set(
          produce<ProfileState>((state) => {
            const key = ingredient.trim().toLowerCase()
            if (!key) return
            if (!state.restrictedIngredients.includes(key)) {
              state.restrictedIngredients.push(key)
            }
          }),
        ),
      removeRestricted: (ingredient) =>
        set(
          produce<ProfileState>((state) => {
            const key = ingredient.trim().toLowerCase()
            state.restrictedIngredients = state.restrictedIngredients.filter((i) => i !== key)
          }),
        ),
      reset: () => set({
        name: '',
        allergies: [],
        healthConditions: [],
        dietPreferences: [],
        restrictedIngredients: [],
      }),
    }),
    { name: 'smart-diet-profile' },
  ),
)
