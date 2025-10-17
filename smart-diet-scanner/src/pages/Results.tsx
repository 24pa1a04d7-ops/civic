import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { analyzeIngredients } from '../lib/ingredients'
import { useProfileStore } from '../store/profile'
import { suggestAlternatives } from '../data/alternatives'

export default function Results() {
  const { search } = useLocation()
  const text = useMemo(() => new URLSearchParams(search).get('text') ?? '', [search])
  const profile = useProfileStore()

  const result = useMemo(() =>
    analyzeIngredients(text, {
      allergies: profile.allergies,
      conditions: profile.healthConditions,
      preferences: profile.dietPreferences,
      restricted: profile.restrictedIngredients,
    }), [text, profile.allergies, profile.healthConditions, profile.dietPreferences, profile.restrictedIngredients])

  const alternatives = useMemo(() =>
    suggestAlternatives(result.flags.map(f => ({ ingredient: f.ingredient, reason: f.reason }))),
    [result.flags]
  )

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Analysis</h1>
        <p className="text-gray-600">Personalized ingredient insights based on your profile.</p>
      </header>

      <section className="card">
        <div className="flex items-center gap-4 text-sm">
          <span className="rounded-md bg-red-50 px-3 py-1 text-red-700">Avoid: {result.summary.avoid}</span>
          <span className="rounded-md bg-yellow-50 px-3 py-1 text-yellow-800">Caution: {result.summary.caution}</span>
          <span className="rounded-md bg-green-50 px-3 py-1 text-green-700">Other: {result.summary.ok}</span>
        </div>
      </section>

      {result.flags.length > 0 ? (
        <section className="card space-y-2">
          <div className="text-sm font-medium">Flagged items</div>
          <ul className="divide-y">
            {result.flags.map((f, idx) => (
              <li key={idx} className="py-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium capitalize">{f.ingredient}</div>
                    <div className="text-sm text-gray-600">{f.reason}</div>
                  </div>
                  <span
                    className={
                      f.severity === 'avoid'
                        ? 'rounded-md bg-red-50 px-2 py-1 text-xs text-red-700'
                        : 'rounded-md bg-yellow-50 px-2 py-1 text-xs text-yellow-800'
                    }
                  >
                    {f.severity}
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">Matched by: {f.matchedBy}</div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="card">
          <div className="text-gray-600">No concerns detected in recognized text.</div>
        </section>
      )}

      {text && (
        <section className="card">
          <div className="text-sm font-medium mb-2">Recognized text</div>
          <pre className="whitespace-pre-wrap text-sm text-gray-700">{text}</pre>
        </section>
      )}

      {alternatives.length > 0 && (
        <section className="card space-y-2">
          <div className="text-sm font-medium">Healthier alternatives</div>
          <ul className="list-disc pl-5 text-sm">
            {alternatives.map((a, idx) => (
              <li key={idx} className="mb-1">
                <span className="font-medium">{a.name}</span>
                {a.brand ? <span className="text-gray-600"> · {a.brand}</span> : null}
                <div className="text-gray-600">{a.whyBetter}</div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
