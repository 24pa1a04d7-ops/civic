export interface ProductAlt {
  name: string
  brand?: string
  whyBetter: string
  tags: string[]
  link?: string
}

export const ALT_BY_TAG: Record<string, ProductAlt[]> = {
  sweetener: [
    { name: 'Stevia drops', brand: 'SweetLeaf', whyBetter: 'Zero-calorie natural sweetener', tags: ['keto', 'diabetes'], link: 'https://example.com/stevia' },
    { name: 'Monk fruit sweetener', brand: 'Lakanto', whyBetter: 'Low glycemic impact', tags: ['keto', 'pcos', 'diabetes'] },
  ],
  glutenfree: [
    { name: 'Almond flour crackers', brand: 'Simple Mills', whyBetter: 'Gluten-free, lower carb', tags: ['gluten_free', 'keto'] },
    { name: 'Rice cakes (unsalted)', whyBetter: 'Gluten-free, low sodium option', tags: ['gluten_free', 'low_sodium'] },
  ],
  low_sodium: [
    { name: 'No-salt added tomato sauce', whyBetter: 'Reduced sodium content', tags: ['low_sodium'] },
  ],
}

export function suggestAlternatives(flags: { ingredient: string; reason: string }[]): ProductAlt[] {
  const suggestions: ProductAlt[] = []
  for (const f of flags) {
    const key = f.reason.toLowerCase()
    if (key.includes('gluten')) suggestions.push(...(ALT_BY_TAG.glutenfree ?? []))
    if (key.includes('sodium')) suggestions.push(...(ALT_BY_TAG.low_sodium ?? []))
    if (key.includes('sweetener') || key.includes('sugar')) suggestions.push(...(ALT_BY_TAG.sweetener ?? []))
  }
  // dedupe by name
  const seen = new Set<string>()
  return suggestions.filter((s) => (seen.has(s.name) ? false : (seen.add(s.name), true)))
}
