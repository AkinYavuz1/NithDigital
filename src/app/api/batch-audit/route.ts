import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const maxDuration = 120

// Reuse the audit logic inline — lightweight version for batch processing
async function auditUrl(url: string): Promise<{
  url: string
  scores: { seo: number; security: number; performance: number; mobile: number; content: number; overall: number }
  issues: string[]
  platform: string | null
  hasContactForm: boolean
  hasPhone: boolean
  isHttps: boolean
  title: string | null
  error?: string
}> {
  const defaultScores = { seo: 0, security: 0, performance: 0, mobile: 0, content: 0, overall: 0 }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 12000)

    let res: Response
    try {
      res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NithAuditBot/1.0; +https://nithdigital.uk)',
          'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
        },
      })
    } finally {
      clearTimeout(timer)
    }

    if (!res.ok) {
      return { url, scores: defaultScores, issues: [`Site returned HTTP ${res.status}`], platform: null, hasContactForm: false, hasPhone: false, isHttps: false, title: null, error: `HTTP ${res.status}` }
    }

    const html = await res.text()
    const isHttps = url.startsWith('https://')

    // Title
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || null

    // Meta description
    const metas = html.match(/<meta[^>]+>/gi) || []
    const hasMetaDesc = metas.some(t => /name\s*=\s*["']description["']/i.test(t) && /content\s*=\s*["'][^"']{10,}/i.test(t))

    // H1
    const h1Count = (html.match(/<h1[^>]*>/gi) || []).length

    // Images without alt
    const imgs = html.match(/<img[^>]+>/gi) || []
    const imgsWithoutAlt = imgs.filter(t => !/alt\s*=\s*["'][^"']+["']/i.test(t)).length

    // Canonical
    const hasCanonical = /<link[^>]+rel\s*=\s*["']canonical["']/i.test(html)

    // Open Graph
    const hasOG = metas.some(t => /property\s*=\s*["']og:/i.test(t))

    // SEO score
    let seo = 0
    if (title) seo += 20
    if (hasMetaDesc) seo += 20
    if (h1Count === 1) seo += 15
    if (hasCanonical) seo += 10
    if (hasOG) seo += 10
    if (imgs.length === 0 || imgsWithoutAlt === 0) seo += 15
    else seo += Math.round(((imgs.length - imgsWithoutAlt) / imgs.length) * 15)
    seo = Math.min(100, seo + 10) // base points

    // Security score
    let security = 0
    if (isHttps) security += 40
    if (res.headers.get('strict-transport-security')) security += 20
    if (res.headers.get('content-security-policy')) security += 20
    if (!(!isHttps || /src\s*=\s*["']http:\/\//i.test(html))) security += 20

    // Performance score
    const htmlKb = new TextEncoder().encode(html).length / 1024
    let performance = 0
    if (htmlKb < 100) performance += 20
    const hasViewport = metas.some(t => /name\s*=\s*["']viewport["']/i.test(t))
    if (hasViewport) performance += 20
    if (/loading\s*=\s*["']lazy["']/i.test(html)) performance += 20
    if (/\.min\.(js|css)/i.test(html)) performance += 20
    if (/\.(webp|avif)/i.test(html)) performance += 20

    // Mobile score
    let mobile = 0
    if (hasViewport) mobile += 40
    if (/width\s*=\s*device-width/i.test(html)) mobile += 30
    if (/srcset\s*=/i.test(html)) mobile += 30

    // Content score
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
    const wordCount = text.trim().split(/\s+/).length
    const hasContactForm = /<form[^>]*>/i.test(html) && /(?:contact|enquiry|message|submit)/i.test(html)
    const hasPhone = /(\+44|0)[\d\s]{9,12}/.test(text)
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)
    let content = 0
    if (wordCount > 200) content += 25
    if (hasContactForm) content += 25
    if (hasPhone) content += 25
    if (hasEmail) content += 25

    const overall = Math.round(seo * 0.3 + performance * 0.2 + mobile * 0.2 + security * 0.15 + content * 0.15)

    // Platform detection
    let platform: string | null = null
    const htmlL = html.toLowerCase()
    if (htmlL.includes('wp-content') || htmlL.includes('wp-includes')) platform = 'WordPress'
    else if (htmlL.includes('wix.com')) platform = 'Wix'
    else if (htmlL.includes('squarespace')) platform = 'Squarespace'
    else if (htmlL.includes('shopify')) platform = 'Shopify'
    else if (htmlL.includes('webflow')) platform = 'Webflow'

    // Issues list
    const issues: string[] = []
    if (!isHttps) issues.push('No HTTPS — site not secure')
    if (!title) issues.push('Missing page title')
    if (!hasMetaDesc) issues.push('Missing meta description')
    if (h1Count === 0) issues.push('No H1 heading')
    if (h1Count > 1) issues.push(`${h1Count} H1 tags (should be 1)`)
    if (imgsWithoutAlt > 0) issues.push(`${imgsWithoutAlt} image${imgsWithoutAlt > 1 ? 's' : ''} missing alt text`)
    if (!hasContactForm) issues.push('No contact form found')
    if (!hasPhone) issues.push('No phone number visible')
    if (!hasViewport) issues.push('Missing mobile viewport tag')
    if (!hasOG) issues.push('No Open Graph tags (poor social sharing)')

    return {
      url,
      scores: { seo, security, performance, mobile, content, overall },
      issues,
      platform,
      hasContactForm,
      hasPhone,
      isHttps,
      title,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    const isTimeout = msg.includes('abort') || msg.includes('timeout')
    return {
      url,
      scores: defaultScores,
      issues: [isTimeout ? 'Site timed out' : `Could not reach site: ${msg}`],
      platform: null,
      hasContactForm: false,
      hasPhone: false,
      isHttps: url.startsWith('https://'),
      title: null,
      error: isTimeout ? 'timeout' : 'unreachable',
    }
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  const secret = process.env.EMAIL_PROCESSOR_SECRET || 'nith-email-secret'
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const urls: string[] = body.urls || []

  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: 'urls array required' }, { status: 400 })
  }

  if (urls.length > 50) {
    return NextResponse.json({ error: 'Maximum 50 URLs per batch' }, { status: 400 })
  }

  // Audit in batches of 5 concurrently
  const results = []
  for (let i = 0; i < urls.length; i += 5) {
    const batch = urls.slice(i, i + 5)
    const batchResults = await Promise.all(batch.map(url => auditUrl(url)))
    results.push(...batchResults)
  }

  return NextResponse.json({ results, total: results.length })
}
