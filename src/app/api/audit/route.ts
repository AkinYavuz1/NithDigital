import { NextRequest, NextResponse } from 'next/server'


// ---------------------------------------------------------------------------
// Rate limiting (in-memory, resets on cold start)
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 60_000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT_MAX) return false
  entry.count++
  return true
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface AuditResult {
  url: string
  fetchedAt: string
  loadTimeMs: number
  title: string | null
  metaDescription: string | null
  favicon: boolean
  language: string | null
  charset: string | null
  seo: {
    hasTitle: boolean
    titleLength: number
    hasMetaDescription: boolean
    metaDescriptionLength: number
    hasCanonical: boolean
    hasRobotsTxt: boolean
    hasSitemap: boolean
    h1Count: number
    h1Text: string[]
    hasStructuredData: boolean
    hasOpenGraph: boolean
    hasTwitterCard: boolean
    metaKeywords: string | null
    imgWithoutAlt: number
    totalImages: number
  }
  security: {
    isHttps: boolean
    hasHSTS: boolean
    hasCSP: boolean
    mixedContent: boolean
  }
  performance: {
    htmlSizeKb: number
    totalScripts: number
    totalStylesheets: number
    inlineStyleCount: number
    hasMinifiedAssets: boolean
    usesModernImageFormats: boolean
    hasLazyLoading: boolean
    hasViewport: boolean
    hasFontPreload: boolean
    totalExternalRequests: number
    usesGzip: boolean
  }
  mobile: {
    hasViewportMeta: boolean
    viewportContent: string | null
    usesResponsiveImages: boolean
    hasTouchIcons: boolean
    textTooSmall: boolean
  }
  content: {
    wordCount: number
    hasContactForm: boolean
    hasPhoneNumber: boolean
    hasEmail: boolean
    hasAddress: boolean
    hasSocialLinks: boolean
    hasCookieNotice: boolean
    hasPrivacyPolicy: boolean
    totalLinks: number
    brokenInternalLinks: number
    externalLinks: number
  }
  technology: {
    platform: string | null
    framework: string | null
    analytics: string[]
    fonts: string[]
    cdn: string | null
    cms: string | null
  }
  scores: {
    seo: number
    security: number
    performance: number
    mobile: number
    content: number
    overall: number
  }
}

// ---------------------------------------------------------------------------
// URL validation
// ---------------------------------------------------------------------------
const PRIVATE_IP_RE =
  /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.|::1|0\.0\.0\.0)/i

function validateUrl(raw: string): { valid: true; url: URL } | { valid: false; reason: string } {
  if (!raw || typeof raw !== 'string') return { valid: false, reason: 'URL is required.' }
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return { valid: false, reason: 'Invalid URL format.' }
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { valid: false, reason: 'URL must begin with http:// or https://.' }
  }
  if (PRIVATE_IP_RE.test(url.hostname)) {
    return { valid: false, reason: 'Private / localhost URLs are not permitted.' }
  }
  return { valid: true, url }
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------
async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; NithAuditBot/1.0; +https://nithdigital.com)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    })
  } finally {
    clearTimeout(timer)
  }
}

async function tryFetchExists(url: string): Promise<boolean> {
  try {
    const r = await fetchWithTimeout(url, 8_000)
    return r.ok
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Regex / string parsing helpers
// ---------------------------------------------------------------------------

function getAttr(tag: string, attr: string): string | null {
  const re = new RegExp(`${attr}\\s*=\\s*["']([^"']*)["']`, 'i')
  const m = tag.match(re)
  return m ? m[1] : null
}

function extractMetaTags(html: string): string[] {
  const re = /<meta[^>]+>/gi
  return html.match(re) ?? []
}

function getMetaContent(metas: string[], ...names: string[]): string | null {
  for (const name of names) {
    const re = new RegExp(`(?:name|property)\\s*=\\s*["']${name}["']`, 'i')
    const tag = metas.find((t) => re.test(t))
    if (tag) return getAttr(tag, 'content')
  }
  return null
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  return m ? decodeHtmlEntities(m[1].trim()) : null
}

function extractH1s(html: string): string[] {
  const re = /<h1[^>]*>([\s\S]*?)<\/h1>/gi
  const results: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    results.push(decodeHtmlEntities(m[1].replace(/<[^>]+>/g, '').trim()))
  }
  return results
}

function extractImgTags(html: string): string[] {
  const re = /<img[^>]+>/gi
  return html.match(re) ?? []
}

function extractScriptSrcs(html: string): string[] {
  const re = /<script[^>]+src\s*=\s*["']([^"']+)["'][^>]*>/gi
  const srcs: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) srcs.push(m[1])
  return srcs
}

function extractLinkTags(html: string): string[] {
  const re = /<link[^>]+>/gi
  return html.match(re) ?? []
}

function extractAllLinks(html: string): string[] {
  const re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>/gi
  const hrefs: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) hrefs.push(m[1])
  return hrefs
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function countWords(text: string): number {
  if (!text.trim()) return 0
  return text.trim().split(/\s+/).length
}

function detectLanguage(html: string): string | null {
  const m = html.match(/<html[^>]+lang\s*=\s*["']([^"']+)["']/i)
  return m ? m[1] : null
}

function detectCharset(html: string, metas: string[]): string | null {
  // <meta charset="...">
  const charsetMeta = metas.find((t) => /charset\s*=/i.test(t))
  if (charsetMeta) {
    const m = charsetMeta.match(/charset\s*=\s*["']?([^"'>\s]+)/i)
    if (m) return m[1]
  }
  // <meta http-equiv="Content-Type" content="text/html; charset=...">
  const httpEquiv = metas.find((t) => /content-type/i.test(t))
  if (httpEquiv) {
    const c = getAttr(httpEquiv, 'content')
    const m = c?.match(/charset\s*=\s*([^\s;]+)/i)
    if (m) return m[1]
  }
  return null
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

function calcSeoScore(seo: AuditResult['seo']): number {
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
  // images alt: proportional
  if (seo.totalImages === 0) {
    score += 10
  } else {
    const withAlt = seo.totalImages - seo.imgWithoutAlt
    score += Math.round((withAlt / seo.totalImages) * 10)
  }
  if (seo.hasTwitterCard) score += 5
  return Math.min(100, score)
}

function calcSecurityScore(security: AuditResult['security']): number {
  let score = 0
  if (security.isHttps) score += 40
  if (security.hasHSTS) score += 20
  if (security.hasCSP) score += 20
  if (!security.mixedContent) score += 20
  return Math.min(100, score)
}

function calcPerformanceScore(perf: AuditResult['performance']): number {
  let score = 0
  if (perf.htmlSizeKb < 100) score += 15
  if (perf.hasViewport) score += 15
  if (perf.hasLazyLoading) score += 15
  if (perf.hasFontPreload) score += 10
  if (perf.usesModernImageFormats) score += 10
  if (perf.hasMinifiedAssets) score += 10
  if (perf.usesGzip) score += 10
  if (perf.totalExternalRequests < 10) score += 15
  return Math.min(100, score)
}

function calcMobileScore(mobile: AuditResult['mobile']): number {
  let score = 0
  if (mobile.hasViewportMeta) score += 30
  if (mobile.viewportContent && /width\s*=\s*device-width/i.test(mobile.viewportContent))
    score += 20
  if (mobile.usesResponsiveImages) score += 20
  if (mobile.hasTouchIcons) score += 10
  if (!mobile.textTooSmall) score += 20
  return Math.min(100, score)
}

function calcContentScore(content: AuditResult['content']): number {
  let score = 0
  if (content.wordCount > 300) score += 15
  if (content.hasContactForm) score += 15
  if (content.hasPhoneNumber) score += 10
  if (content.hasEmail) score += 10
  if (content.hasAddress) score += 10
  if (content.hasSocialLinks) score += 10
  if (content.hasPrivacyPolicy) score += 10
  if (content.hasCookieNotice) score += 5
  if (content.brokenInternalLinks === 0) score += 10
  if (content.totalLinks > 5) score += 5
  return Math.min(100, score)
}

// ---------------------------------------------------------------------------
// Main analysis
// ---------------------------------------------------------------------------

function analyseHtml(
  html: string,
  responseHeaders: Headers,
  baseUrl: URL,
  htmlSizeBytes: number,
  hasRobotsTxt: boolean,
  hasSitemap: boolean,
): Omit<AuditResult, 'url' | 'fetchedAt' | 'loadTimeMs' | 'scores'> {
  const metas = extractMetaTags(html)
  const title = extractTitle(html)
  const metaDesc = getMetaContent(metas, 'description')
  const language = detectLanguage(html)
  const charset = detectCharset(html, metas)

  // Favicon
  const linkTags = extractLinkTags(html)
  const favicon =
    linkTags.some((t) => /rel\s*=\s*["'][^"']*icon[^"']*["']/i.test(t)) ||
    html.includes('/favicon.ico')

  // ----- SEO -----
  const h1s = extractH1s(html)
  const imgTags = extractImgTags(html)
  const imgWithoutAlt = imgTags.filter(
    (t) => !/alt\s*=\s*["'][^"']*["']/i.test(t) && !/alt\s*=\s*[""]["']/i.test(t),
  ).length
  // Canonical
  const hasCanonical = linkTags.some((t) => /rel\s*=\s*["']canonical["']/i.test(t))
  // Structured data
  const hasStructuredData =
    /<script[^>]+type\s*=\s*["']application\/ld\+json["'][^>]*>/i.test(html)
  // Open Graph
  const hasOpenGraph = metas.some((t) => /property\s*=\s*["']og:/i.test(t))
  // Twitter card
  const hasTwitterCard = metas.some((t) => /name\s*=\s*["']twitter:card["']/i.test(t))
  // Meta keywords
  const metaKeywords = getMetaContent(metas, 'keywords')

  // ----- Security -----
  const isHttps = baseUrl.protocol === 'https:'
  const hasHSTS = !!responseHeaders.get('strict-transport-security')
  const hasCSP =
    !!responseHeaders.get('content-security-policy') ||
    metas.some(
      (t) =>
        /http-equiv\s*=\s*["']content-security-policy["']/i.test(t),
    )
  // Mixed content: look for http:// in src/href attributes within a https page
  const mixedContent = isHttps && /(?:src|href)\s*=\s*["']http:\/\//i.test(html)

  // ----- Performance -----
  const htmlSizeKb = htmlSizeBytes / 1024
  const scriptSrcs = extractScriptSrcs(html)
  const inlineScripts = (html.match(/<script(?![^>]+src\s*=)[^>]*>/gi) ?? []).length
  const stylesheetLinks = linkTags.filter((t) => /rel\s*=\s*["']stylesheet["']/i.test(t))
  const inlineStyleCount = (html.match(/<style[^>]*>/gi) ?? []).length
  // Minified: heuristic - any .min.js or .min.css reference
  const hasMinifiedAssets = /\.min\.(js|css)/i.test(html)
  // Modern image formats
  const usesModernImageFormats = /\.(webp|avif)/i.test(html)
  // Lazy loading
  const hasLazyLoading = /loading\s*=\s*["']lazy["']/i.test(html)
  // Viewport
  const hasViewport = metas.some((t) => /name\s*=\s*["']viewport["']/i.test(t))
  // Font preload
  const hasFontPreload = linkTags.some(
    (t) => /rel\s*=\s*["']preload["']/i.test(t) && /as\s*=\s*["']font["']/i.test(t),
  )
  // External requests: count unique external script srcs + external stylesheet hrefs
  const externalScriptCount = scriptSrcs.filter(
    (s) => s.startsWith('http') && !s.includes(baseUrl.hostname),
  ).length
  const externalStyleCount = stylesheetLinks.filter((t) => {
    const href = getAttr(t, 'href')
    return href && href.startsWith('http') && !href.includes(baseUrl.hostname)
  }).length
  const totalExternalRequests = externalScriptCount + externalStyleCount
  // Gzip — CDNs (Vercel, Cloudflare) decompress before forwarding so content-encoding
  // is often absent even when compression is active. Treat HTTPS sites as compressed.
  const encoding = responseHeaders.get('content-encoding') ?? ''
  const usesGzip = /gzip|br|deflate/i.test(encoding) || baseUrl.protocol === 'https:'

  // ----- Mobile -----
  const viewportTag = metas.find((t) => /name\s*=\s*["']viewport["']/i.test(t))
  const viewportContent = viewportTag ? getAttr(viewportTag, 'content') : null
  const usesResponsiveImages =
    /srcset\s*=/i.test(html) || /<picture[^>]*>/i.test(html)
  const hasTouchIcons = linkTags.some((t) => /rel\s*=\s*["'][^"']*(apple-touch-icon|touch-icon)[^"']*["']/i.test(t))
  // Tiny fonts heuristic: font-size less than 10px in inline styles
  const textTooSmall = /font-size\s*:\s*[1-9]px/i.test(html)

  // ----- Content -----
  const plainText = stripHtml(html)
  const wordCount = countWords(plainText)

  const hasContactForm =
    /<form[^>]*>/i.test(html) &&
    /(?:contact|enquiry|enquire|message|send|submit)/i.test(html)

  const phoneRe = /((\+44|0044|0)[\s-]?[0-9]{4}[\s-]?[0-9]{6}|(\+44|0044|0)\s?[0-9]{10})/
  const hasPhoneNumber = phoneRe.test(plainText)

  const emailRe = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  const hasEmail = emailRe.test(plainText)

  // Address heuristic: street types, UK postcodes, or location/address structured data
  const hasAddress =
    /\b(street|road|avenue|lane|drive|close|way|place|square|gardens|crescent)\b/i.test(plainText) ||
    /\b[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}\b/.test(plainText) ||
    /\b[A-Z]{1,2}[0-9]{1,2}\b/.test(plainText) ||
    /addressLocality|addressRegion|postalCode|itemprop="address"/i.test(html)

  const socialDomains = [
    'facebook.com',
    'instagram.com',
    'twitter.com',
    'x.com',
    'linkedin.com',
    'tiktok.com',
  ]
  const allLinks = extractAllLinks(html)
  const hasSocialLinks = allLinks.some((href) =>
    socialDomains.some((d) => href.includes(d)),
  )

  const hasCookieNotice =
    /cookie/i.test(plainText) &&
    /(notice|policy|consent|banner|accept)/i.test(plainText)

  const hasPrivacyPolicy = /privacy\s*policy/i.test(plainText) || /privacy/i.test(
    allLinks.join(' '),
  )

  const totalLinks = allLinks.length
  // Internal links: relative or same hostname
  const internalLinks = allLinks.filter(
    (h) => !h.startsWith('http') || h.includes(baseUrl.hostname),
  )
  // We cannot actually fetch each internal link here; set brokenInternalLinks to 0
  // (a deeper audit would need separate requests per link)
  const brokenInternalLinks = 0
  const externalLinks = allLinks.filter(
    (h) => h.startsWith('http') && !h.includes(baseUrl.hostname),
  ).length

  // ----- Technology -----
  const htmlLower = html.toLowerCase()

  let platform: string | null = null
  let framework: string | null = null
  let cms: string | null = null

  if (htmlLower.includes('wp-content') || htmlLower.includes('wp-includes')) {
    platform = 'WordPress'
    cms = 'WordPress'
    // Try to extract WP version from generator meta
    const generatorTag = metas.find((t) => /name\s*=\s*["']generator["']/i.test(t))
    if (generatorTag) {
      const gen = getAttr(generatorTag, 'content')
      if (gen && /wordpress/i.test(gen)) cms = gen
    }
  } else if (htmlLower.includes('wix.com')) {
    platform = 'Wix'
    cms = 'Wix'
  } else if (htmlLower.includes('squarespace')) {
    platform = 'Squarespace'
    cms = 'Squarespace'
  } else if (htmlLower.includes('shopify')) {
    platform = 'Shopify'
    cms = 'Shopify'
  } else if (htmlLower.includes('webflow')) {
    platform = 'Webflow'
    cms = 'Webflow'
  }

  if (htmlLower.includes('_next/') || html.includes('__react') || html.includes('ReactDOM')) {
    framework = 'React / Next.js'
  } else if (/vue/i.test(html) && /<div[^>]+id\s*=\s*["']app["']/i.test(html)) {
    framework = 'Vue.js'
  } else if (/ng-version/i.test(html)) {
    framework = 'Angular'
  }

  const analytics: string[] = []
  if (/UA-[0-9]+-[0-9]+|G-[A-Z0-9]+|gtag\s*\(/i.test(html)) analytics.push('Google Analytics')
  if (/googletagmanager\.com/i.test(html)) analytics.push('Google Tag Manager')
  if (/fbq\s*\(/i.test(html)) analytics.push('Facebook Pixel')

  const fonts: string[] = []
  if (/fonts\.googleapis\.com/i.test(html)) fonts.push('Google Fonts')
  if (/use\.typekit\.net|typekit\.com/i.test(html)) fonts.push('Adobe Fonts')
  if (/fonts\.bunny\.net/i.test(html)) fonts.push('Bunny Fonts')

  const cdn: string | null =
    responseHeaders.get('cf-ray') ||
    html.includes('__cf_bm') ||
    html.includes('cloudflare')
      ? 'Cloudflare'
      : htmlLower.includes('fastly')
        ? 'Fastly'
        : htmlLower.includes('akamai')
          ? 'Akamai'
          : null

  return {
    title,
    metaDescription: metaDesc,
    favicon,
    language,
    charset,
    seo: {
      hasTitle: !!title,
      titleLength: title ? title.length : 0,
      hasMetaDescription: !!metaDesc,
      metaDescriptionLength: metaDesc ? metaDesc.length : 0,
      hasCanonical,
      hasRobotsTxt,
      hasSitemap,
      h1Count: h1s.length,
      h1Text: h1s,
      hasStructuredData,
      hasOpenGraph,
      hasTwitterCard,
      metaKeywords,
      imgWithoutAlt,
      totalImages: imgTags.length,
    },
    security: {
      isHttps,
      hasHSTS,
      hasCSP,
      mixedContent,
    },
    performance: {
      htmlSizeKb: Math.round(htmlSizeKb * 100) / 100,
      totalScripts: scriptSrcs.length + inlineScripts,
      totalStylesheets: stylesheetLinks.length,
      inlineStyleCount,
      hasMinifiedAssets,
      usesModernImageFormats,
      hasLazyLoading,
      hasViewport,
      hasFontPreload,
      totalExternalRequests,
      usesGzip,
    },
    mobile: {
      hasViewportMeta: !!viewportTag,
      viewportContent,
      usesResponsiveImages,
      hasTouchIcons,
      textTooSmall,
    },
    content: {
      wordCount,
      hasContactForm,
      hasPhoneNumber,
      hasEmail,
      hasAddress,
      hasSocialLinks,
      hasCookieNotice,
      hasPrivacyPolicy,
      totalLinks,
      brokenInternalLinks,
      externalLinks,
    },
    technology: {
      platform,
      framework,
      analytics,
      fonts,
      cdn,
      cms,
    },
  }
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Maximum 10 requests per minute.' },
      { status: 429 },
    )
  }

  // Parse body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const rawUrl = (body as Record<string, unknown>)?.url
  if (typeof rawUrl !== 'string') {
    return NextResponse.json({ error: 'Missing required field: url.' }, { status: 400 })
  }

  // Validate
  const validation = validateUrl(rawUrl.trim())
  if (!validation.valid) {
    return NextResponse.json({ error: validation.reason }, { status: 400 })
  }
  const { url: parsedUrl } = validation

  // Normalise — strip trailing slash for aux fetches
  const origin = parsedUrl.origin

  // Fetch HTML
  const fetchedAt = new Date().toISOString()
  const t0 = Date.now()
  let response: Response
  try {
    response = await fetchWithTimeout(parsedUrl.toString(), 15_000)
  } catch (err: unknown) {
    const msg =
      err instanceof Error && err.name === 'AbortError'
        ? 'Request timed out after 15 seconds. The target site may be slow or unreachable.'
        : `Failed to fetch the URL. The target site may be blocking automated requests. (${err instanceof Error ? err.message : String(err)})`
    return NextResponse.json({ error: msg }, { status: 500 })
  }
  const loadTimeMs = Date.now() - t0

  if (!response.ok && response.status !== 200) {
    // Allow 200 only; some sites return 4xx even for bots
    return NextResponse.json(
      {
        error: `Target site returned HTTP ${response.status}. The page may require authentication or may be blocking automated requests.`,
      },
      { status: 500 },
    )
  }

  // Read HTML
  let html: string
  try {
    html = await response.text()
  } catch {
    return NextResponse.json({ error: 'Failed to read response body.' }, { status: 500 })
  }

  const htmlSizeBytes = new TextEncoder().encode(html).length

  // Parallel: robots.txt + sitemap.xml
  const [hasRobotsTxt, hasSitemap] = await Promise.all([
    tryFetchExists(`${origin}/robots.txt`),
    tryFetchExists(`${origin}/sitemap.xml`).then(
      (exists) =>
        exists ||
        tryFetchExists(`${origin}/sitemap_index.xml`),
    ),
  ])

  // Analyse
  const analysis = analyseHtml(
    html,
    response.headers,
    parsedUrl,
    htmlSizeBytes,
    hasRobotsTxt,
    hasSitemap,
  )

  // Scores
  const seoScore = calcSeoScore(analysis.seo)
  const securityScore = calcSecurityScore(analysis.security)
  const performanceScore = calcPerformanceScore(analysis.performance)
  const mobileScore = calcMobileScore(analysis.mobile)
  const contentScore = calcContentScore(analysis.content)
  const overallScore = Math.round(
    seoScore * 0.3 +
      performanceScore * 0.2 +
      mobileScore * 0.2 +
      securityScore * 0.15 +
      contentScore * 0.15,
  )

  const result: AuditResult = {
    url: parsedUrl.toString(),
    fetchedAt,
    loadTimeMs,
    ...analysis,
    scores: {
      seo: seoScore,
      security: securityScore,
      performance: performanceScore,
      mobile: mobileScore,
      content: contentScore,
      overall: overallScore,
    },
  }

  return NextResponse.json(result)
}
