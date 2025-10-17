import type { HealthCondition, DietPreference } from '../store/profile'

export interface IngredientFlag {
  ingredient: string
  reason: string
  severity: 'info' | 'caution' | 'avoid'
  matchedBy: 'allergy' | 'condition' | 'preference' | 'custom'
}

export interface AnalysisResult {
  tokens: string[]
  flags: IngredientFlag[]
  summary: {
    avoid: number
    caution: number
    ok: number
  }
}

const NORMALIZE_MAP: Record<string, string> = {
  'e-': 'e',
  'e ': 'e',
  'sulphite': 'sulfite',
}

const CONDITION_RULES: Record<HealthCondition | 'common', { includes: string[]; severity: 'avoid' | 'caution'; reason: string }[]> = {
  common: [
    { includes: ['aspartame', 'acesulfame k', 'acesulfame-k', 'sucralose'], severity: 'caution', reason: 'Artificial sweeteners' },
    { includes: ['monosodium glutamate', 'msg', 'e621'], severity: 'caution', reason: 'Flavor enhancer (MSG)' },
    { includes: ['sodium nitrite', 'sodium nitrate', 'e250', 'e251'], severity: 'caution', reason: 'Cured meat preservative' },
    { includes: ['trans fat', 'partially hydrogenated'], severity: 'avoid', reason: 'Trans fats' },
  ],
  diabetes: [
    { includes: ['sugar', 'corn syrup', 'high fructose corn syrup', 'dextrose', 'maltodextrin'], severity: 'caution', reason: 'Added sugars' },
  ],
  hypertension: [
    { includes: ['sodium', 'salt', 'monosodium'], severity: 'caution', reason: 'High sodium' },
  ],
  celiac: [
    { includes: ['wheat', 'barley', 'rye', 'malt', 'gluten'], severity: 'avoid', reason: 'Contains gluten' },
  ],
  pcos: [
    { includes: ['sugar', 'corn syrup', 'dextrose'], severity: 'caution', reason: 'High glycemic additives' },
  ],
  pregnancy: [
    { includes: ['saccharin'], severity: 'avoid', reason: 'Not recommended in pregnancy' },
  ],
  kidney_disease: [
    { includes: ['phosphate', 'phosphoric acid'], severity: 'caution', reason: 'Added phosphorus' },
  ],
}

const PREFERENCE_RULES: Record<DietPreference, { includes: string[]; severity: 'avoid' | 'caution'; reason: string }[]> = {
  vegan: [
    { includes: ['gelatin', 'cochineal', 'carmine', 'shellac', 'lard', 'rennet', 'casein', 'whey'], severity: 'avoid', reason: 'Animal-derived' },
  ],
  vegetarian: [
    { includes: ['gelatin', 'cochineal', 'carmine', 'rennet', 'lard'], severity: 'avoid', reason: 'Animal-derived' },
  ],
  keto: [
    { includes: ['sugar', 'maltodextrin', 'dextrose'], severity: 'avoid', reason: 'High net carbs' },
  ],
  paleo: [
    { includes: ['maltodextrin', 'artificial flavor', 'artificial color'], severity: 'avoid', reason: 'Highly processed additives' },
  ],
  low_sodium: [
    { includes: ['sodium', 'salt', 'monosodium'], severity: 'caution', reason: 'High sodium' },
  ],
  low_sugar: [
    { includes: ['sugar', 'corn syrup', 'HFCS', 'dextrose'], severity: 'avoid', reason: 'Added sugars' },
  ],
  gluten_free: [
    { includes: ['wheat', 'barley', 'rye', 'malt', 'gluten'], severity: 'avoid', reason: 'Contains gluten' },
  ],
}

function normalizeToken(token: string): string {
  let t = token.toLowerCase().trim()
  t = t.replace(/[().,;:]/g, ' ')
  t = t.replace(/\s+/g, ' ')
  for (const [from, to] of Object.entries(NORMALIZE_MAP)) {
    t = t.replaceAll(from, to)
  }
  return t
}

export function tokenizeIngredients(raw: string): string[] {
  return raw
    .split(/[\n,]/g)
    .map((s) => normalizeToken(s))
    .flatMap((s) => s.split(' '))
    .map((s) => s.trim())
    .filter(Boolean)
}

export function analyzeIngredients(rawText: string, opts: {
  allergies?: string[]
  conditions?: HealthCondition[]
  preferences?: DietPreference[]
  restricted?: string[]
} = {}): AnalysisResult {
  const tokens = tokenizeIngredients(rawText)
  const flags: IngredientFlag[] = []

  function flagIfMatch(matchList: string[], severity: 'info' | 'caution' | 'avoid', reason: string, matchedBy: IngredientFlag['matchedBy']) {
    for (const token of tokens) {
      for (const m of matchList) {
        const key = m.toLowerCase()
        if (token.includes(key)) {
          flags.push({ ingredient: token, severity, reason, matchedBy })
        }
      }
    }
  }

  // allergies and custom restricted
  for (const a of opts.allergies ?? []) {
    flagIfMatch([a], 'avoid', 'Allergen', 'allergy')
  }
  for (const r of opts.restricted ?? []) {
    flagIfMatch([r], 'avoid', 'User restricted', 'custom')
  }

  // condition rules
  for (const cond of opts.conditions ?? []) {
    const rules = [...(CONDITION_RULES[cond] ?? []), ...CONDITION_RULES.common]
    for (const rule of rules) {
      flagIfMatch(rule.includes, rule.severity, rule.reason, 'condition')
    }
  }

  // preference rules
  for (const pref of opts.preferences ?? []) {
    for (const rule of PREFERENCE_RULES[pref] ?? []) {
      flagIfMatch(rule.includes, rule.severity, rule.reason, 'preference')
    }
  }

  const summary = {
    avoid: flags.filter((f) => f.severity === 'avoid').length,
    caution: flags.filter((f) => f.severity === 'caution').length,
    ok: Math.max(tokens.length - flags.length, 0),
  }

  return { tokens, flags, summary }
}
