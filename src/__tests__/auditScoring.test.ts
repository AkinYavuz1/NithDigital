/**
 * Tests for the site audit scoring logic.
 * We extract the scoring functions by re-implementing them here from the spec,
 * then test edge cases and the weighted overall formula.
 */
export {}

// ─── Scoring functions (mirrored from /api/audit/route.ts) ───────────────────

interface SeoData {
  hasTitle: boolean; titleLength: number; hasMetaDescription: boolean
  metaDescriptionLength: number; hasCanonical: boolean; hasRobotsTxt: boolean
  hasSitemap: boolean; h1Count: number; hasStructuredData: boolean
  hasOpenGraph: boolean; hasTwitterCard: boolean; imgWithoutAlt: number
  totalImages: number
}

interface SecurityData {
  isHttps: boolean; hasHSTS: boolean; hasCSP: boolean; mixedContent: boolean
}

interface PerformanceData {
  htmlSizeKb: number; hasViewport: boolean; hasLazyLoading: boolean
  hasFontPreload: boolean; usesModernImageFormats: boolean; hasMinifiedAssets: boolean
  usesGzip: boolean; totalExternalRequests: number
}

interface MobileData {
  hasViewportMeta: boolean; viewportContent: string | null
  usesResponsiveImages: boolean; hasTouchIcons: boolean; textTooSmall: boolean
}

interface ContentData {
  wordCount: number; hasContactForm: boolean; hasPhoneNumber: boolean
  hasEmail: boolean; hasAddress: boolean; hasSocialLinks: boolean
  hasCookieNotice: boolean; hasPrivacyPolicy: boolean
  totalLinks: number; brokenInternalLinks: number
}

function calcSeoScore(seo: SeoData): number {
  let score = 0
  if (seo.hasTitle) {
    score += 15
    score += seo.titleLength >= 50 && seo.titleLength <= 60 ? 5 : 2
  }
  if (seo.hasMetaDescription) {
    score += 15
    if (seo.metaDescriptionLength >= 150 && seo.metaDescriptionLength <= 160) score += 5
  }
  if (seo.h1Count === 1) score += 10
  if (seo.hasCanonical) score += 5
  if (seo.hasStructuredData) score += 10
  if (seo.hasOpenGraph) score += 5
  if (seo.hasSitemap) score += 10
  if (seo.hasRobotsTxt) score += 5
  if (seo.totalImages === 0) {
    score += 10
  } else {
    const withAlt = seo.totalImages - seo.imgWithoutAlt
    score += Math.round((withAlt / seo.totalImages) * 10)
  }
  if (seo.hasTwitterCard) score += 5
  return Math.min(100, score)
}

function calcSecurityScore(s: SecurityData): number {
  let score = 0
  if (s.isHttps) score += 40
  if (s.hasHSTS) score += 20
  if (s.hasCSP) score += 20
  if (!s.mixedContent) score += 20
  return Math.min(100, score)
}

function calcPerformanceScore(p: PerformanceData): number {
  let score = 0
  if (p.htmlSizeKb < 100) score += 15
  if (p.hasViewport) score += 15
  if (p.hasLazyLoading) score += 15
  if (p.hasFontPreload) score += 10
  if (p.usesModernImageFormats) score += 10
  if (p.hasMinifiedAssets) score += 10
  if (p.usesGzip) score += 10
  if (p.totalExternalRequests < 10) score += 15
  return Math.min(100, score)
}

function calcMobileScore(m: MobileData): number {
  let score = 0
  if (m.hasViewportMeta) score += 30
  if (m.viewportContent && /width\s*=\s*device-width/i.test(m.viewportContent)) score += 20
  if (m.usesResponsiveImages) score += 20
  if (m.hasTouchIcons) score += 10
  if (!m.textTooSmall) score += 20
  return Math.min(100, score)
}

function calcContentScore(c: ContentData): number {
  let score = 0
  if (c.wordCount > 300) score += 15
  if (c.hasContactForm) score += 15
  if (c.hasPhoneNumber) score += 10
  if (c.hasEmail) score += 10
  if (c.hasAddress) score += 10
  if (c.hasSocialLinks) score += 10
  if (c.hasPrivacyPolicy) score += 10
  if (c.hasCookieNotice) score += 5
  if (c.brokenInternalLinks === 0) score += 10
  if (c.totalLinks > 5) score += 5
  return Math.min(100, score)
}

function calcOverall(seo: number, perf: number, mobile: number, security: number, content: number): number {
  return Math.round(seo * 0.30 + perf * 0.20 + mobile * 0.20 + security * 0.15 + content * 0.15)
}

// ─── SEO scoring ─────────────────────────────────────────────────────────────

const perfectSeo: SeoData = {
  hasTitle: true, titleLength: 55, hasMetaDescription: true, metaDescriptionLength: 155,
  hasCanonical: true, hasRobotsTxt: true, hasSitemap: true, h1Count: 1,
  hasStructuredData: true, hasOpenGraph: true, hasTwitterCard: true,
  imgWithoutAlt: 0, totalImages: 5,
}

const emptySeo: SeoData = {
  hasTitle: false, titleLength: 0, hasMetaDescription: false, metaDescriptionLength: 0,
  hasCanonical: false, hasRobotsTxt: false, hasSitemap: false, h1Count: 0,
  hasStructuredData: false, hasOpenGraph: false, hasTwitterCard: false,
  imgWithoutAlt: 0, totalImages: 0,
}

describe('SEO scoring', () => {
  test('perfect SEO = 100', () => {
    expect(calcSeoScore(perfectSeo)).toBe(100)
  })

  test('zero SEO = 10 (no images = +10)', () => {
    expect(calcSeoScore(emptySeo)).toBe(10)
  })

  test('title exists but wrong length gives partial +2 not +5', () => {
    const s = { ...emptySeo, hasTitle: true, titleLength: 30 }
    // +15 (has title) + 2 (wrong length) + 10 (no images) = 27
    expect(calcSeoScore(s)).toBe(27)
  })

  test('title with ideal length (50-60) gives full +5', () => {
    const s = { ...emptySeo, hasTitle: true, titleLength: 55 }
    // +15 + 5 + 10 = 30
    expect(calcSeoScore(s)).toBe(30)
  })

  test('meta description with ideal length (150-160) gives +20 total', () => {
    const s = { ...emptySeo, hasMetaDescription: true, metaDescriptionLength: 155 }
    expect(calcSeoScore(s)).toBeGreaterThanOrEqual(25)
  })

  test('partial image alt — 3 out of 5 missing gives proportional score', () => {
    const s = { ...emptySeo, totalImages: 5, imgWithoutAlt: 3 }
    // withAlt = 2, proportion = 2/5 = 0.4, score = round(0.4*10) = 4
    expect(calcSeoScore(s)).toBe(4)
  })

  test('all images missing alt gives 0 for image score', () => {
    const s = { ...emptySeo, totalImages: 3, imgWithoutAlt: 3 }
    expect(calcSeoScore(s)).toBe(0)
  })

  test('multiple H1s (h1Count=3) does not add +10', () => {
    const s = { ...perfectSeo, h1Count: 3 }
    // loses 10 from perfect 100
    expect(calcSeoScore(s)).toBe(90)
  })

  test('score never exceeds 100', () => {
    expect(calcSeoScore(perfectSeo)).toBeLessThanOrEqual(100)
  })
})

// ─── Security scoring ─────────────────────────────────────────────────────────

describe('Security scoring', () => {
  test('perfect security = 100', () => {
    expect(calcSecurityScore({ isHttps: true, hasHSTS: true, hasCSP: true, mixedContent: false })).toBe(100)
  })

  test('zero security = 0 (HTTP + no headers + mixed content)', () => {
    expect(calcSecurityScore({ isHttps: false, hasHSTS: false, hasCSP: false, mixedContent: true })).toBe(0)
  })

  test('HTTPS only = 40', () => {
    expect(calcSecurityScore({ isHttps: true, hasHSTS: false, hasCSP: false, mixedContent: true })).toBe(40)
  })

  test('HTTPS + no mixed content = 60', () => {
    expect(calcSecurityScore({ isHttps: true, hasHSTS: false, hasCSP: false, mixedContent: false })).toBe(60)
  })

  test('mixed content is penalised (true = bad)', () => {
    const withMixed = calcSecurityScore({ isHttps: true, hasHSTS: true, hasCSP: true, mixedContent: true })
    const noMixed = calcSecurityScore({ isHttps: true, hasHSTS: true, hasCSP: true, mixedContent: false })
    expect(noMixed - withMixed).toBe(20)
  })
})

// ─── Performance scoring ──────────────────────────────────────────────────────

const perfectPerf: PerformanceData = {
  htmlSizeKb: 50, hasViewport: true, hasLazyLoading: true, hasFontPreload: true,
  usesModernImageFormats: true, hasMinifiedAssets: true, usesGzip: true, totalExternalRequests: 5,
}

const emptyPerf: PerformanceData = {
  htmlSizeKb: 200, hasViewport: false, hasLazyLoading: false, hasFontPreload: false,
  usesModernImageFormats: false, hasMinifiedAssets: false, usesGzip: false, totalExternalRequests: 15,
}

describe('Performance scoring', () => {
  test('perfect performance = 100', () => {
    expect(calcPerformanceScore(perfectPerf)).toBe(100)
  })

  test('zero performance = 0', () => {
    expect(calcPerformanceScore(emptyPerf)).toBe(0)
  })

  test('HTML exactly 100KB is NOT under 100 (boundary)', () => {
    const p = { ...emptyPerf, htmlSizeKb: 100 }
    expect(calcPerformanceScore(p)).toBe(0)
  })

  test('HTML 99KB qualifies for +15', () => {
    const p = { ...emptyPerf, htmlSizeKb: 99 }
    expect(calcPerformanceScore(p)).toBe(15)
  })

  test('10 external requests does NOT qualify (must be < 10)', () => {
    const p = { ...emptyPerf, totalExternalRequests: 10 }
    expect(calcPerformanceScore(p)).toBe(0)
  })

  test('9 external requests qualifies for +15', () => {
    const p = { ...emptyPerf, totalExternalRequests: 9 }
    expect(calcPerformanceScore(p)).toBe(15)
  })
})

// ─── Mobile scoring ───────────────────────────────────────────────────────────

describe('Mobile scoring', () => {
  test('perfect mobile = 100', () => {
    expect(calcMobileScore({
      hasViewportMeta: true, viewportContent: 'width=device-width, initial-scale=1',
      usesResponsiveImages: true, hasTouchIcons: true, textTooSmall: false,
    })).toBe(100)
  })

  test('zero mobile = 0', () => {
    expect(calcMobileScore({ hasViewportMeta: false, viewportContent: null, usesResponsiveImages: false, hasTouchIcons: false, textTooSmall: true })).toBe(0)
  })

  test('viewport meta without device-width gives only +30', () => {
    expect(calcMobileScore({ hasViewportMeta: true, viewportContent: 'width=1024', usesResponsiveImages: false, hasTouchIcons: false, textTooSmall: true })).toBe(30)
  })

  test('viewport content null does not crash', () => {
    expect(() => calcMobileScore({ hasViewportMeta: true, viewportContent: null, usesResponsiveImages: false, hasTouchIcons: false, textTooSmall: false })).not.toThrow()
  })

  test('textTooSmall=true is penalised (does not add +20)', () => {
    const withSmall = calcMobileScore({ hasViewportMeta: false, viewportContent: null, usesResponsiveImages: false, hasTouchIcons: false, textTooSmall: true })
    const noSmall = calcMobileScore({ hasViewportMeta: false, viewportContent: null, usesResponsiveImages: false, hasTouchIcons: false, textTooSmall: false })
    expect(noSmall - withSmall).toBe(20)
  })
})

// ─── Content scoring ──────────────────────────────────────────────────────────

const perfectContent: ContentData = {
  wordCount: 500, hasContactForm: true, hasPhoneNumber: true, hasEmail: true,
  hasAddress: true, hasSocialLinks: true, hasCookieNotice: true, hasPrivacyPolicy: true,
  totalLinks: 20, brokenInternalLinks: 0,
}

const emptyContent: ContentData = {
  wordCount: 0, hasContactForm: false, hasPhoneNumber: false, hasEmail: false,
  hasAddress: false, hasSocialLinks: false, hasCookieNotice: false, hasPrivacyPolicy: false,
  totalLinks: 0, brokenInternalLinks: 0,
}

describe('Content scoring', () => {
  test('perfect content = 100', () => {
    expect(calcContentScore(perfectContent)).toBe(100)
  })

  test('empty content with no links = 10 (broken links = 0 = +10)', () => {
    expect(calcContentScore(emptyContent)).toBe(10)
  })

  test('word count exactly 300 does NOT qualify (must be > 300)', () => {
    expect(calcContentScore({ ...emptyContent, wordCount: 300 })).toBe(10)
  })

  test('word count 301 qualifies for +15', () => {
    expect(calcContentScore({ ...emptyContent, wordCount: 301 })).toBe(25)
  })

  test('broken internal links removes the +10', () => {
    const withBroken = calcContentScore({ ...emptyContent, brokenInternalLinks: 1 })
    expect(withBroken).toBe(0)
  })

  test('5 links does NOT qualify (must be > 5)', () => {
    expect(calcContentScore({ ...emptyContent, totalLinks: 5 })).toBe(10)
  })

  test('6 links qualifies for +5', () => {
    expect(calcContentScore({ ...emptyContent, totalLinks: 6 })).toBe(15)
  })
})

// ─── Overall weighted average ─────────────────────────────────────────────────

describe('Overall score calculation', () => {
  test('all 100 = 100', () => {
    expect(calcOverall(100, 100, 100, 100, 100)).toBe(100)
  })

  test('all 0 = 0', () => {
    expect(calcOverall(0, 0, 0, 0, 0)).toBe(0)
  })

  test('weights sum to 1.0 (SEO 30 + Perf 20 + Mobile 20 + Sec 15 + Content 15)', () => {
    // If only SEO=100, rest 0: result = 30
    expect(calcOverall(100, 0, 0, 0, 0)).toBe(30)
    // If only Perf=100, rest 0: result = 20
    expect(calcOverall(0, 100, 0, 0, 0)).toBe(20)
    // If only Mobile=100, rest 0: result = 20
    expect(calcOverall(0, 0, 100, 0, 0)).toBe(20)
    // If only Security=100, rest 0: result = 15
    expect(calcOverall(0, 0, 0, 100, 0)).toBe(15)
    // If only Content=100, rest 0: result = 15
    expect(calcOverall(0, 0, 0, 0, 100)).toBe(15)
  })

  test('typical mid-range site (55 avg) = correct weighted result', () => {
    // SEO=60, Perf=50, Mobile=70, Security=40, Content=55
    // 60*0.3 + 50*0.2 + 70*0.2 + 40*0.15 + 55*0.15
    // = 18 + 10 + 14 + 6 + 8.25 = 56.25 → 56
    expect(calcOverall(60, 50, 70, 40, 55)).toBe(56)
  })

  test('result is rounded (not truncated)', () => {
    // SEO=51, rest 0: 51*0.3 = 15.3 → rounds to 15
    expect(calcOverall(51, 0, 0, 0, 0)).toBe(15)
  })
})

// ─── URL validation logic ─────────────────────────────────────────────────────

const PRIVATE_IP_RE = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.|::1|0\.0\.0\.0)/i

function validateUrl(raw: string): { valid: boolean; reason?: string } {
  if (!raw) return { valid: false, reason: 'URL is required.' }
  let url: URL
  try { url = new URL(raw) } catch { return { valid: false, reason: 'Invalid URL format.' } }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return { valid: false, reason: 'Must be http/https.' }
  if (PRIVATE_IP_RE.test(url.hostname)) return { valid: false, reason: 'Private URL.' }
  return { valid: true }
}

describe('URL validation', () => {
  test('valid https URL passes', () => {
    expect(validateUrl('https://example.com').valid).toBe(true)
  })

  test('valid http URL passes', () => {
    expect(validateUrl('http://example.com').valid).toBe(true)
  })

  test('localhost is rejected', () => {
    expect(validateUrl('http://localhost:3000').valid).toBe(false)
  })

  test('127.0.0.1 is rejected', () => {
    expect(validateUrl('http://127.0.0.1').valid).toBe(false)
  })

  test('192.168.x.x is rejected', () => {
    expect(validateUrl('http://192.168.1.1').valid).toBe(false)
  })

  test('10.x.x.x is rejected', () => {
    expect(validateUrl('http://10.0.0.1').valid).toBe(false)
  })

  test('ftp:// is rejected', () => {
    expect(validateUrl('ftp://example.com').valid).toBe(false)
  })

  test('empty string is rejected', () => {
    expect(validateUrl('').valid).toBe(false)
  })

  test('plain text without protocol is rejected', () => {
    expect(validateUrl('example.com').valid).toBe(false)
  })

  test('URL with path and query passes', () => {
    expect(validateUrl('https://www.example.co.uk/page?q=test').valid).toBe(true)
  })
})
