import { useState } from 'react'
import { useProfileStore, type HealthCondition, type DietPreference } from '../store/profile'

const CONDITIONS: { key: HealthCondition; label: string }[] = [
  { key: 'diabetes', label: 'Diabetes' },
  { key: 'hypertension', label: 'Hypertension' },
  { key: 'celiac', label: 'Celiac (Gluten Free)' },
  { key: 'pcos', label: 'PCOS' },
  { key: 'pregnancy', label: 'Pregnancy' },
  { key: 'kidney_disease', label: 'Kidney disease' },
]

const PREFS: { key: DietPreference; label: string }[] = [
  { key: 'vegan', label: 'Vegan' },
  { key: 'vegetarian', label: 'Vegetarian' },
  { key: 'keto', label: 'Keto' },
  { key: 'paleo', label: 'Paleo' },
  { key: 'low_sodium', label: 'Low sodium' },
  { key: 'low_sugar', label: 'Low sugar' },
  { key: 'gluten_free', label: 'Gluten free' },
]

export default function Profile() {
  const [customAllergy, setCustomAllergy] = useState('')
  const [customRestricted, setCustomRestricted] = useState('')

  const {
    name,
    allergies,
    healthConditions,
    dietPreferences,
    restrictedIngredients,
    setName,
    toggleAllergy,
    toggleCondition,
    togglePreference,
    addRestricted,
    removeRestricted,
    reset,
  } = useProfileStore()

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Your Profile</h1>
        <p className="text-gray-600">Set your health, allergies, and dietary choices.</p>
      </header>

      <section className="card space-y-3">
        <label className="block text-sm font-medium">Display name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Alex"
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
        />
      </section>

      <section className="card space-y-3">
        <div className="text-sm font-medium">Health conditions</div>
        <div className="grid grid-cols-2 gap-2">
          {CONDITIONS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={healthConditions.includes(key)}
                onChange={() => toggleCondition(key)}
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      <section className="card space-y-3">
        <div className="text-sm font-medium">Diet preferences</div>
        <div className="grid grid-cols-2 gap-2">
          {PREFS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={dietPreferences.includes(key)}
                onChange={() => togglePreference(key)}
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      <section className="card space-y-3">
        <div className="text-sm font-medium">Allergies</div>
        <div className="flex gap-2">
          <input
            value={customAllergy}
            onChange={(e) => setCustomAllergy(e.target.value)}
            placeholder="e.g. peanuts"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
          />
          <button
            className="btn"
            onClick={() => {
              const val = customAllergy.trim().toLowerCase()
              if (!val) return
              toggleAllergy(val)
              setCustomAllergy('')
            }}
          >
            Add
          </button>
        </div>
        {allergies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allergies.map((a) => (
              <button
                key={a}
                className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
                onClick={() => toggleAllergy(a)}
                title="Click to remove"
              >
                {a}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="card space-y-3">
        <div className="text-sm font-medium">Restricted ingredients</div>
        <div className="flex gap-2">
          <input
            value={customRestricted}
            onChange={(e) => setCustomRestricted(e.target.value)}
            placeholder="e.g. aspartame"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
          />
          <button
            className="btn"
            onClick={() => {
              const val = customRestricted.trim().toLowerCase()
              if (!val) return
              addRestricted(val)
              setCustomRestricted('')
            }}
          >
            Add
          </button>
        </div>
        {restrictedIngredients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {restrictedIngredients.map((r) => (
              <button
                key={r}
                className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
                onClick={() => removeRestricted(r)}
                title="Click to remove"
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="flex gap-2">
        <button className="btn" onClick={() => window.alert('Saved!')}>Save</button>
        <button
          className="px-4 py-2 rounded-md border"
          onClick={() => {
            if (confirm('Reset profile?')) reset()
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}
