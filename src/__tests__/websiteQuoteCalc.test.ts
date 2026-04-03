// Website quote pricing logic extracted from WebsiteQuoteClient.tsx

const BASE_PRICE: Record<string, [number, number]> = {
  simple:        [400,  600],
  standard:      [600,  1000],
  comprehensive: [1000, 2000],
  large:         [2000, 4000],
}

const FEATURE_PRICE: Record<string, [number, number]> = {
  gallery:      [100, 200],
  booking:      [250, 500],
  ecommerce:    [800, 1500],
  blog:         [150, 300],
  social_feeds: [50,  100],
  newsletter:   [75,  150],
  multilang:    [300, 600],
  portal:       [500, 1000],
  livechat:     [50,  100],
  reviews:      [100, 200],
}

const EXTRA_PRICE: Record<string, [number, number]> = {
  logo:        [150, 300],
  copywriting: [200, 400],
  photography: [200, 500],
  seo:         [200, 400],
  google_ads:  [150, 300],
  social_setup:[100, 200],
  domain_email:[30,  50],
}

const TIMELINE_MULT: Record<string, number> = {
  flexible: 1.0,
  no_rush:  1.0,
  soon:     1.1,
  urgent:   1.25,
}

function calcPrice(pages: string, features: string[], extras: string[], timeline: string): [number, number] {
  const base = BASE_PRICE[pages] || [600, 1000]
  let low = base[0], high = base[1]
  features.forEach(f => {
    const p = FEATURE_PRICE[f]
    if (p) { low += p[0]; high += p[1] }
  })
  extras.forEach(e => {
    const p = EXTRA_PRICE[e]
    if (p) { low += p[0]; high += p[1] }
  })
  const mult = TIMELINE_MULT[timeline] || 1.0
  return [Math.round(low * mult), Math.round(high * mult)]
}

describe('Website quote calculator', () => {
  test('simple site, no features, flexible timeline', () => {
    const [low, high] = calcPrice('simple', [], [], 'flexible')
    expect(low).toBe(400)
    expect(high).toBe(600)
  })

  test('standard site baseline', () => {
    const [low, high] = calcPrice('standard', [], [], 'flexible')
    expect(low).toBe(600)
    expect(high).toBe(1000)
  })

  test('adds feature price', () => {
    const [low, high] = calcPrice('simple', ['gallery'], [], 'flexible')
    expect(low).toBe(400 + 100)
    expect(high).toBe(600 + 200)
  })

  test('adds multiple features', () => {
    const [low, high] = calcPrice('standard', ['gallery', 'booking'], [], 'flexible')
    expect(low).toBe(600 + 100 + 250)
    expect(high).toBe(1000 + 200 + 500)
  })

  test('adds extras', () => {
    const [low, high] = calcPrice('simple', [], ['logo'], 'flexible')
    expect(low).toBe(400 + 150)
    expect(high).toBe(600 + 300)
  })

  test('urgent timeline multiplier of 1.25', () => {
    const [low, high] = calcPrice('standard', [], [], 'urgent')
    expect(low).toBe(Math.round(600 * 1.25))
    expect(high).toBe(Math.round(1000 * 1.25))
  })

  test('soon timeline multiplier of 1.1', () => {
    const [low, high] = calcPrice('standard', [], [], 'soon')
    expect(low).toBe(Math.round(600 * 1.1))
    expect(high).toBe(Math.round(1000 * 1.1))
  })

  test('ecommerce on standard with urgent', () => {
    const [low, high] = calcPrice('standard', ['ecommerce'], [], 'urgent')
    expect(low).toBe(Math.round((600 + 800) * 1.25))
    expect(high).toBe(Math.round((1000 + 1500) * 1.25))
  })

  test('unknown pages type falls back to standard base', () => {
    const [low, high] = calcPrice('unknown_type', [], [], 'flexible')
    expect(low).toBe(600)
    expect(high).toBe(1000)
  })

  test('unknown feature is ignored', () => {
    const [low, high] = calcPrice('simple', ['nonexistent_feature'], [], 'flexible')
    expect(low).toBe(400)
    expect(high).toBe(600)
  })

  test('low is always <= high', () => {
    const [low, high] = calcPrice('large', ['ecommerce', 'booking', 'multilang'], ['logo', 'seo'], 'urgent')
    expect(low).toBeLessThanOrEqual(high)
  })
})
