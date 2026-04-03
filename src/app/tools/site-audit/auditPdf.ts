interface AuditResult {
  url: string
  fetchedAt: string
  loadTimeMs: number
  title: string | null
  metaDescription: string | null
  scores: {
    seo: number
    security: number
    performance: number
    mobile: number
    content: number
    overall: number
  }
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
}

const NAVY = [27, 42, 74] as const
const GOLD = [212, 168, 75] as const
const CREAM = [245, 240, 230] as const
const LIGHT_GRAY = [90, 106, 122] as const
const RED = [220, 38, 38] as const
const AMBER = [217, 119, 6] as const
const GREEN = [22, 163, 74] as const

function scoreColor(score: number): readonly [number, number, number] {
  if (score >= 70) return GREEN
  if (score >= 40) return AMBER
  return RED
}


function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]
  }
}

function generateSummaryText(result: AuditResult): string {
  const overall = result.scores.overall
  const categories = [
    { name: 'SEO', score: result.scores.seo },
    { name: 'Performance', score: result.scores.performance },
    { name: 'Security', score: result.scores.security },
    { name: 'Mobile', score: result.scores.mobile },
    { name: 'Content', score: result.scores.content },
  ]
  const sorted = [...categories].sort((a, b) => a.score - b.score)
  const topIssues = sorted.filter(c => c.score < 70).slice(0, 3).map(c => c.name)

  let intro = `This site scored ${overall}/100 overall.`

  if (overall >= 80) {
    intro += ' The site is performing well across most areas.'
  } else if (overall >= 60) {
    intro += ' There are some improvements that could significantly boost visibility and user experience.'
  } else {
    intro += ' There are several critical issues that should be addressed to improve search rankings and user trust.'
  }

  if (!result.security.isHttps) {
    intro += ' The site is not using HTTPS, which is a critical security issue that browsers actively warn users about.'
  }

  if (topIssues.length > 0) {
    intro += ` The main areas for improvement are: ${topIssues.join(', ')}.`
  }

  return intro
}

interface FailedCheck {
  category: string
  name: string
  description: string
  priority: number
}

function getFailedChecks(result: AuditResult): FailedCheck[] {
  const checks: FailedCheck[] = []

  // Security (priority 1 — highest)
  if (!result.security.isHttps) checks.push({ category: 'Security', name: 'HTTPS not enabled', description: 'Site is served over HTTP. Browsers warn users, and Google penalises non-HTTPS sites.', priority: 1 })
  if (result.security.mixedContent) checks.push({ category: 'Security', name: 'Mixed HTTP/HTTPS content', description: 'Some resources load over insecure HTTP on an HTTPS page, triggering browser warnings.', priority: 1 })
  if (!result.security.hasHSTS) checks.push({ category: 'Security', name: 'No HSTS header', description: 'Missing Strict-Transport-Security header. Browsers are not forced to always use HTTPS.', priority: 2 })
  if (!result.security.hasCSP) checks.push({ category: 'Security', name: 'No Content Security Policy', description: 'Missing CSP header leaves the site vulnerable to cross-site scripting (XSS) attacks.', priority: 2 })

  // SEO (priority 2)
  if (!result.seo.hasTitle) checks.push({ category: 'SEO', name: 'No title tag', description: 'Missing title tag — the most important on-page SEO element, shown as the blue link in search results.', priority: 2 })
  if (!result.seo.hasMetaDescription) checks.push({ category: 'SEO', name: 'No meta description', description: 'Missing meta description — reduces click-through from search results.', priority: 2 })
  if (result.seo.h1Count === 0) checks.push({ category: 'SEO', name: 'No H1 heading', description: 'No H1 heading found. Search engines use this to understand the primary topic of the page.', priority: 2 })
  if (!result.seo.hasSitemap) checks.push({ category: 'SEO', name: 'No XML sitemap', description: 'A sitemap helps search engines discover and index all pages on the site.', priority: 3 })
  if (!result.seo.hasStructuredData) checks.push({ category: 'SEO', name: 'No structured data', description: 'Structured data (Schema.org) can enable rich results in Google, improving visibility.', priority: 3 })
  if (!result.seo.hasOpenGraph) checks.push({ category: 'SEO', name: 'No Open Graph tags', description: 'Without Open Graph tags, social media shares will show plain links with no image or description.', priority: 3 })
  if (result.seo.imgWithoutAlt > 0) checks.push({ category: 'SEO', name: `${result.seo.imgWithoutAlt} images missing alt text`, description: 'Missing alt attributes harm both SEO and accessibility — screen readers cannot describe the images.', priority: 3 })

  // Mobile (priority 3)
  if (!result.mobile.hasViewportMeta) checks.push({ category: 'Mobile', name: 'No viewport meta tag', description: 'Without a viewport tag, mobile devices render a scaled-down desktop view — unusable on phones.', priority: 2 })
  if (result.mobile.textTooSmall) checks.push({ category: 'Mobile', name: 'Text too small on mobile', description: 'Font sizes below 12px are hard to read on mobile and flagged as a usability issue by Google.', priority: 3 })
  if (!result.mobile.usesResponsiveImages) checks.push({ category: 'Mobile', name: 'No responsive images', description: 'No srcset attributes found — the browser downloads full-size images on mobile devices.', priority: 3 })

  // Performance (priority 4)
  if (!result.performance.hasViewport) checks.push({ category: 'Performance', name: 'No viewport tag', description: 'Missing viewport meta tag — critical for correct rendering on mobile devices.', priority: 2 })
  if (!result.performance.usesGzip) checks.push({ category: 'Performance', name: 'No Gzip/Brotli compression', description: 'Server responses are not compressed — files are up to 70% larger than necessary.', priority: 3 })
  if (!result.performance.hasLazyLoading) checks.push({ category: 'Performance', name: 'No lazy loading', description: 'All images load immediately on page open, even those below the fold.', priority: 3 })
  if (!result.performance.usesModernImageFormats) checks.push({ category: 'Performance', name: 'No modern image formats', description: 'Using JPEG/PNG instead of WebP/AVIF — images are 25–35% larger than necessary.', priority: 4 })
  if (result.performance.totalScripts > 10) checks.push({ category: 'Performance', name: `High script count (${result.performance.totalScripts})`, description: 'Too many scripts slow page rendering and increase load time significantly.', priority: 4 })

  // Content (priority 5)
  if (!result.content.hasPrivacyPolicy) checks.push({ category: 'Content', name: 'No privacy policy', description: 'A privacy policy is legally required under UK GDPR if the site collects any personal data.', priority: 2 })
  if (!result.content.hasContactForm) checks.push({ category: 'Content', name: 'No contact form', description: 'No contact form detected — visitors have limited ways to get in touch.', priority: 4 })
  if (result.content.wordCount < 300) checks.push({ category: 'Content', name: `Low word count (${result.content.wordCount} words)`, description: 'Pages with fewer than 300 words rank poorly — search engines need content to understand the page.', priority: 4 })
  if (!result.content.hasCookieNotice) checks.push({ category: 'Content', name: 'No cookie notice', description: 'UK GDPR requires a cookie consent banner if the site uses analytics or tracking scripts.', priority: 4 })

  return checks.sort((a, b) => a.priority - b.priority)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function drawHeader(doc: any, W: number): void {
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, W, 36, 'F')

  doc.setFillColor(...GOLD)
  doc.roundedRect(12, 8, 20, 20, 2, 2, 'F')
  doc.setTextColor(27, 42, 74)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('N', 22, 22, { align: 'center' })

  doc.setTextColor(...GOLD)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Nith Digital', 36, 17)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...CREAM)
  doc.text('Web Design & Digital Solutions', 36, 24)

  doc.setTextColor(...CREAM)
  doc.setFontSize(8)
  doc.text(['nithdigital.uk', 'hello@nithdigital.uk', 'Sanquhar, DG4'], W - 12, 12, { align: 'right' })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function drawScoreCircle(doc: any, x: number, y: number, score: number, radius: number): void {
  const col = scoreColor(score)
  // Background circle
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(2)
  doc.circle(x, y, radius, 'S')
  // Colored arc approximation — draw a filled circle with the score color
  doc.setFillColor(...col)
  doc.circle(x, y, radius - 1.5, 'F')
  // White inner
  doc.setFillColor(255, 255, 255)
  doc.circle(x, y, radius - 5, 'F')
  // Score text
  doc.setTextColor(...col)
  doc.setFontSize(score >= 100 ? 14 : 16)
  doc.setFont('helvetica', 'bold')
  doc.text(String(score), x, y + 2, { align: 'center' })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sectionHeading(doc: any, label: string, score: number, y: number): void {
  const col = scoreColor(score)
  doc.setFillColor(...NAVY)
  doc.rect(14, y, 3, 7, 'F')
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...NAVY)
  doc.text(label, 20, y + 6)
  // Score badge
  doc.setFillColor(...col)
  doc.roundedRect(160, y, 32, 8, 3, 3, 'F')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text(`Score: ${score}/100`, 176, y + 5.5, { align: 'center' })
}

export async function generateAuditPDF(result: AuditResult): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const QRCode = await import('qrcode')
  const doc = new jsPDF({ format: 'a4', unit: 'mm' })
  const W = 210

  const domain = extractDomain(result.url)
  const dateAudited = new Date(result.fetchedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  // ══════════════════════════════════════════════════════════
  // PAGE 1 — Executive Summary
  // ══════════════════════════════════════════════════════════

  drawHeader(doc, W)
  let y = 46

  // Report title
  doc.setTextColor(...NAVY)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('Website Audit Report', 14, y)
  y += 9

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...LIGHT_GRAY)
  doc.text(result.url, 14, y)
  y += 6

  doc.setFontSize(9)
  doc.setTextColor(...LIGHT_GRAY)
  doc.text(`Audited: ${dateAudited}`, 14, y)
  y += 10

  // Gold separator
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.5)
  doc.line(14, y, W - 14, y)
  y += 14

  // Overall score — large circle centre-left
  const circleX = 38
  const circleY = y + 18
  const circleR = 18
  drawScoreCircle(doc, circleX, circleY, result.scores.overall, circleR)

  // Overall label beside circle
  doc.setTextColor(...NAVY)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...LIGHT_GRAY)
  doc.text('Overall Score', 62, circleY - 7)
  const overallCol = scoreColor(result.scores.overall)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...overallCol)
  doc.text(`${result.scores.overall}`, 62, circleY + 4)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...LIGHT_GRAY)
  doc.text('out of 100', 62, circleY + 11)

  y = circleY + circleR + 10

  // 5 category score boxes
  const cats = [
    { label: 'SEO', score: result.scores.seo },
    { label: 'Performance', score: result.scores.performance },
    { label: 'Security', score: result.scores.security },
    { label: 'Mobile', score: result.scores.mobile },
    { label: 'Content', score: result.scores.content },
  ]
  const boxW = 34
  const boxH = 22
  const boxGap = 2
  const startX = 14
  cats.forEach((cat, i) => {
    const bx = startX + i * (boxW + boxGap)
    const by = y
    const col = scoreColor(cat.score)
    doc.setFillColor(col[0], col[1], col[2], 0.08)
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(bx, by, boxW, boxH, 2, 2, 'FD')
    doc.setDrawColor(...col)
    doc.setLineWidth(0.8)
    doc.roundedRect(bx, by, boxW, boxH, 2, 2, 'S')
    // Score
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...col)
    doc.text(String(cat.score), bx + boxW / 2, by + 10, { align: 'center' })
    // Label
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...LIGHT_GRAY)
    doc.text(cat.label, bx + boxW / 2, by + 17, { align: 'center' })
  })

  y += boxH + 14

  // Executive summary paragraph
  doc.setFillColor(...GOLD)
  doc.rect(14, y, 3, 6, 'F')
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...NAVY)
  doc.text('Executive Summary', 20, y + 5)
  y += 13

  const summaryText = generateSummaryText(result)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...LIGHT_GRAY)
  const summaryLines = doc.splitTextToSize(summaryText, W - 28)
  doc.text(summaryLines, 14, y)
  y += summaryLines.length * 5.5 + 10

  // Quick stats row
  doc.setFillColor(245, 240, 230)
  doc.roundedRect(14, y, W - 28, 24, 3, 3, 'F')

  const stats = [
    { label: 'Load Time', value: result.loadTimeMs < 1000 ? `${result.loadTimeMs}ms` : `${(result.loadTimeMs / 1000).toFixed(1)}s` },
    { label: 'Page Size', value: `${result.performance.htmlSizeKb.toFixed(0)} KB` },
    { label: 'Scripts', value: String(result.performance.totalScripts) },
    { label: 'Images', value: String(result.seo.totalImages) },
    { label: 'HTTPS', value: result.security.isHttps ? 'Yes' : 'No' },
    { label: 'Platform', value: result.technology.platform || result.technology.cms || 'Unknown' },
  ]
  const statColW = (W - 28) / stats.length
  stats.forEach((s, i) => {
    const sx = 14 + i * statColW + statColW / 2
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...NAVY)
    const valColor: [number, number, number] = s.label === 'HTTPS' && s.value === 'No' ? [RED[0], RED[1], RED[2]] : [NAVY[0], NAVY[1], NAVY[2]]
    doc.setTextColor(...valColor)
    doc.text(s.value, sx, y + 11, { align: 'center' })
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...LIGHT_GRAY)
    doc.text(s.label, sx, y + 18, { align: 'center' })
  })
  y += 32

  // Technology detected
  const techItems = [
    result.technology.platform,
    result.technology.framework,
    result.technology.cms,
    result.technology.cdn,
    ...(result.technology.analytics || []),
  ].filter(Boolean) as string[]

  if (techItems.length > 0) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...LIGHT_GRAY)
    doc.text(`Technology detected: ${techItems.join(', ')}`, 14, y)
    y += 8
  }

  // Fonts detected
  if (result.technology.fonts && result.technology.fonts.length > 0) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...LIGHT_GRAY)
    doc.text(`Fonts: ${result.technology.fonts.join(', ')}`, 14, y)
    y += 8
  }

  y += 6

  // Prepared by footer block on page 1
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.5)
  doc.line(14, y, W - 14, y)
  y += 8
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...LIGHT_GRAY)
  doc.text('Prepared by Nith Digital  ·  nithdigital.uk  ·  hello@nithdigital.uk', W / 2, y, { align: 'center' })

  // ══════════════════════════════════════════════════════════
  // PAGE 2 — Detailed Findings
  // ══════════════════════════════════════════════════════════

  doc.addPage()
  drawHeader(doc, W)
  y = 46

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...NAVY)
  doc.text('Detailed Findings', 14, y)
  y += 12

  // ── Helper to draw a check item ──────────────────────────
  function drawCheck(pass: boolean, name: string, detail: string) {
    if (y > 260) { doc.addPage(); drawHeader(doc, W); y = 46 }
    const icon = pass ? '✓' : '✗'
    const iconCol: readonly [number, number, number] = pass ? GREEN : RED
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...iconCol)
    doc.text(icon, 16, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...NAVY)
    doc.text(name, 22, y)
    if (detail) {
      doc.setFontSize(8)
      doc.setTextColor(...LIGHT_GRAY)
      const detailLines = doc.splitTextToSize(detail, W - 60)
      doc.text(detailLines, 22, y + 4)
      y += detailLines.length * 4 + 7
    } else {
      y += 7
    }
  }

  // ── SEO ─────────────────────────────────────────────────
  sectionHeading(doc, 'SEO', result.scores.seo, y)
  y += 14

  drawCheck(result.seo.hasTitle, 'Title tag', result.seo.hasTitle ? `${result.seo.titleLength} characters` : 'No title tag found — critical SEO issue')
  drawCheck(result.seo.hasMetaDescription, 'Meta description', result.seo.hasMetaDescription ? `${result.seo.metaDescriptionLength} characters` : 'No meta description — reduces click-through from search results')
  drawCheck(result.seo.h1Count === 1, `H1 heading (${result.seo.h1Count} found)`, result.seo.h1Count === 0 ? 'No H1 heading found' : result.seo.h1Count === 1 ? (result.seo.h1Text[0] ? `"${result.seo.h1Text[0].slice(0, 60)}"` : 'H1 present') : 'Multiple H1 headings — should have exactly one')
  drawCheck(result.seo.hasCanonical, 'Canonical URL', result.seo.hasCanonical ? 'Canonical tag present' : 'No canonical tag — could cause duplicate content issues')
  drawCheck(result.seo.hasRobotsTxt, 'robots.txt', result.seo.hasRobotsTxt ? 'robots.txt detected' : 'No robots.txt found')
  drawCheck(result.seo.hasSitemap, 'XML Sitemap', result.seo.hasSitemap ? 'Sitemap detected' : 'No XML sitemap — search engines may miss pages')
  drawCheck(result.seo.hasStructuredData, 'Structured data (JSON-LD)', result.seo.hasStructuredData ? 'Structured data markup found' : 'No structured data — missing rich result opportunities')
  drawCheck(result.seo.hasOpenGraph, 'Open Graph tags', result.seo.hasOpenGraph ? 'Open Graph tags present' : 'No Open Graph tags — poor social media sharing')
  drawCheck(result.seo.hasTwitterCard, 'Twitter / X card tags', result.seo.hasTwitterCard ? 'Twitter card tags present' : 'No Twitter card tags found')
  drawCheck(result.seo.imgWithoutAlt === 0, `Image alt text (${result.seo.totalImages - result.seo.imgWithoutAlt}/${result.seo.totalImages} have alt)`, result.seo.imgWithoutAlt === 0 ? 'All images have alt attributes' : `${result.seo.imgWithoutAlt} image${result.seo.imgWithoutAlt > 1 ? 's' : ''} missing alt text`)

  y += 4

  // ── Performance ─────────────────────────────────────────
  if (y > 240) { doc.addPage(); drawHeader(doc, W); y = 46 }
  sectionHeading(doc, 'Performance', result.scores.performance, y)
  y += 14

  drawCheck(result.performance.htmlSizeKb < 100, `HTML page size (${result.performance.htmlSizeKb.toFixed(1)} KB)`, result.performance.htmlSizeKb < 100 ? 'Good page size' : result.performance.htmlSizeKb < 200 ? 'Slightly large — consider reducing' : 'Large HTML — slows page load')
  drawCheck(result.performance.hasViewport, 'Viewport meta tag', result.performance.hasViewport ? 'Viewport tag present' : 'Missing viewport meta tag')
  drawCheck(result.performance.hasLazyLoading, 'Lazy loading images', result.performance.hasLazyLoading ? 'Lazy loading detected' : 'No lazy loading — all images load on page open')
  drawCheck(result.performance.hasFontPreload, 'Font preloading', result.performance.hasFontPreload ? 'Font preload hints found' : 'No font preload — fonts may cause layout shift')
  drawCheck(result.performance.usesModernImageFormats, 'Modern image formats (WebP / AVIF)', result.performance.usesModernImageFormats ? 'WebP or AVIF images detected' : 'No modern image formats — using JPEG/PNG')
  drawCheck(result.performance.hasMinifiedAssets, 'Minified CSS / JS assets', result.performance.hasMinifiedAssets ? 'Minified assets detected' : 'Assets may not be minified')
  drawCheck(result.performance.usesGzip, 'Gzip / Brotli compression', result.performance.usesGzip ? 'Compression detected' : 'No compression — files served uncompressed')
  drawCheck(result.performance.totalScripts <= 5, `Script tags (${result.performance.totalScripts} found)`, result.performance.totalScripts <= 5 ? 'Low script count — good' : result.performance.totalScripts <= 10 ? 'Moderate scripts — consider reducing' : 'High script count will slow your page')

  y += 4

  // ── Security ─────────────────────────────────────────────
  if (y > 240) { doc.addPage(); drawHeader(doc, W); y = 46 }
  sectionHeading(doc, 'Security', result.scores.security, y)
  y += 14

  drawCheck(result.security.isHttps, 'HTTPS encryption', result.security.isHttps ? 'Site is served over HTTPS' : 'NOT using HTTPS — browsers warn visitors, Google penalises this')
  drawCheck(result.security.hasHSTS, 'HSTS header', result.security.hasHSTS ? 'Strict-Transport-Security header present' : 'No HSTS header — browsers not forced to always use HTTPS')
  drawCheck(result.security.hasCSP, 'Content Security Policy', result.security.hasCSP ? 'CSP header detected' : 'No CSP header — vulnerable to cross-site scripting attacks')
  drawCheck(!result.security.mixedContent, 'No mixed content', result.security.mixedContent ? 'Mixed HTTP/HTTPS content detected — triggers browser warnings' : 'No mixed content issues found')

  y += 4

  // ── Mobile ───────────────────────────────────────────────
  if (y > 240) { doc.addPage(); drawHeader(doc, W); y = 46 }
  sectionHeading(doc, 'Mobile', result.scores.mobile, y)
  y += 14

  drawCheck(result.mobile.hasViewportMeta, 'Mobile viewport tag', result.mobile.hasViewportMeta ? `Viewport: ${result.mobile.viewportContent || 'present'}` : 'No viewport meta tag — mobile layout will be broken')
  drawCheck((result.mobile.viewportContent?.includes('width=device-width') ?? false), 'Responsive viewport settings', (result.mobile.viewportContent?.includes('width=device-width') ?? false) ? 'width=device-width is set correctly' : 'Viewport may not use device width')
  drawCheck(result.mobile.usesResponsiveImages, 'Responsive images (srcset)', result.mobile.usesResponsiveImages ? 'srcset attributes detected' : 'No srcset — single image size for all devices')
  drawCheck(result.mobile.hasTouchIcons, 'Apple touch icons', result.mobile.hasTouchIcons ? 'Apple touch icon links found' : 'No Apple touch icons detected')
  drawCheck(!result.mobile.textTooSmall, 'No tiny font sizes', result.mobile.textTooSmall ? 'Small font sizes detected — hard to read on mobile' : 'Font sizes appear appropriate for mobile')

  y += 4

  // ── Content ──────────────────────────────────────────────
  if (y > 240) { doc.addPage(); drawHeader(doc, W); y = 46 }
  sectionHeading(doc, 'Content', result.scores.content, y)
  y += 14

  drawCheck(result.content.wordCount >= 300, `Word count (${result.content.wordCount.toLocaleString()} words)`, result.content.wordCount >= 300 ? 'Good amount of content' : result.content.wordCount >= 100 ? 'Thin content — add more' : 'Very little content — ranks poorly')
  drawCheck(result.content.hasContactForm, 'Contact form', result.content.hasContactForm ? 'Contact form detected' : 'No contact form — visitors have limited ways to get in touch')
  drawCheck(result.content.hasPhoneNumber, 'Phone number', result.content.hasPhoneNumber ? 'Phone number found' : 'No phone number detected on this page')
  drawCheck(result.content.hasEmail, 'Email address', result.content.hasEmail ? 'Email address found' : 'No email address found')
  drawCheck(result.content.hasAddress, 'Business address', result.content.hasAddress ? 'Address information found' : 'No address — important for local SEO')
  drawCheck(result.content.hasSocialLinks, 'Social media links', result.content.hasSocialLinks ? 'Social media links found' : 'No social media links detected')
  drawCheck(result.content.hasPrivacyPolicy, 'Privacy Policy', result.content.hasPrivacyPolicy ? 'Privacy policy link detected' : 'No privacy policy — legally required under UK GDPR')
  drawCheck(result.content.hasCookieNotice, 'Cookie notice / consent', result.content.hasCookieNotice ? 'Cookie notice detected' : 'No cookie notice found')

  // ══════════════════════════════════════════════════════════
  // PAGE 3 — Recommendations
  // ══════════════════════════════════════════════════════════

  doc.addPage()
  drawHeader(doc, W)
  y = 46

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...NAVY)
  doc.text('Recommendations', 14, y)
  y += 12

  // Top recommendations
  doc.setFillColor(...GOLD)
  doc.rect(14, y, 3, 6, 'F')
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...NAVY)
  doc.text('Top Issues to Fix', 20, y + 5)
  y += 13

  const failedChecks = getFailedChecks(result)
  const topFive = failedChecks.slice(0, 5)

  if (topFive.length === 0) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(22, 163, 74)
    doc.text('No critical issues found — great work!', 14, y)
    y += 8
  } else {
    topFive.forEach((check, i) => {
      if (y > 255) { doc.addPage(); drawHeader(doc, W); y = 46 }
      // Number circle
      doc.setFillColor(...NAVY)
      doc.circle(18, y + 2, 4, 'F')
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text(String(i + 1), 18, y + 4.5, { align: 'center' })
      // Category badge
      const badgeColArr: [number, number, number] = check.category === 'Security' ? [RED[0], RED[1], RED[2]] : check.category === 'SEO' ? [NAVY[0], NAVY[1], NAVY[2]] : [AMBER[0], AMBER[1], AMBER[2]]
      doc.setFillColor(...badgeColArr)
      doc.roundedRect(24, y - 2, 26, 8, 2, 2, 'F')
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text(check.category, 37, y + 3.5, { align: 'center' })
      // Issue name
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...NAVY)
      doc.text(check.name, 54, y + 3)
      y += 8
      // Description
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...LIGHT_GRAY)
      const descLines = doc.splitTextToSize(check.description, W - 30)
      doc.text(descLines, 24, y)
      y += descLines.length * 4.5 + 8
    })
  }

  y += 4

  // What Nith Digital Can Do
  if (y > 200) { doc.addPage(); drawHeader(doc, W); y = 46 }

  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.5)
  doc.line(14, y, W - 14, y)
  y += 10

  doc.setFillColor(...GOLD)
  doc.rect(14, y, 3, 6, 'F')
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...NAVY)
  doc.text('What Nith Digital Can Do For You', 20, y + 5)
  y += 13

  const services: string[] = []
  if (!result.security.isHttps) services.push("Migrate your site to a secure HTTPS setup — free SSL certificate included with all hosting packages")
  if (result.scores.seo < 60) services.push("Full SEO optimisation including structured data, meta tags, sitemap and Google Business Profile setup")
  if (result.scores.mobile < 60) services.push("Mobile-first responsive redesign — looks and works great on all devices")
  if (!result.content.hasContactForm) services.push("Contact form with email notifications so you never miss an enquiry")
  const platform = (result.technology.platform || result.technology.cms || '').toLowerCase()
  if (platform.includes('wix') || platform.includes('squarespace') || platform.includes('weebly')) {
    services.push(`Migration away from ${result.technology.platform || result.technology.cms} to a modern, faster and more flexible platform`)
  }
  if (result.scores.performance < 60) services.push("Performance optimisation — faster load times, image compression and caching")
  services.push("Monthly hosting and support from £30/month — everything handled, no technical knowledge needed")

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  services.forEach(svc => {
    if (y > 255) { doc.addPage(); drawHeader(doc, W); y = 46 }
    doc.setFillColor(...GOLD)
    doc.circle(17, y - 1.5, 1.2, 'F')
    doc.setTextColor(...NAVY)
    const lines = doc.splitTextToSize(svc, W - 40)
    doc.text(lines, 21, y)
    y += lines.length * 5.5 + 2
  })

  y += 10

  // Book a Free Consultation
  if (y > 210) { doc.addPage(); drawHeader(doc, W); y = 46 }

  doc.setFillColor(27, 42, 74, 0.04)
  doc.setFillColor(245, 240, 230)
  doc.roundedRect(14, y, W - 28, 52, 4, 4, 'F')

  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...NAVY)
  doc.text('Book a Free Consultation', 22, y + 12)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...LIGHT_GRAY)
  const callLines = doc.splitTextToSize(
    "Get a free 30-minute call with Akin to discuss your audit results and how we can improve your site. No sales pitch — just honest advice.",
    W - 80
  )
  doc.text(callLines, 22, y + 20)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...NAVY)
  doc.text('nithdigital.uk/book', 22, y + 20 + callLines.length * 5.5 + 6)

  // QR code
  try {
    const bookQR = await QRCode.toDataURL('https://nithdigital.uk/book', { width: 80, margin: 1 })
    doc.addImage(bookQR, 'PNG', W - 50, y + 6, 30, 30)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...LIGHT_GRAY)
    doc.text('Scan to book', W - 35, y + 40, { align: 'center' })
  } catch { /* skip QR if fails */ }

  y += 62

  // ── Footers on all pages ─────────────────────────────────
  const pageCount = doc.getNumberOfPages()
  for (let pg = 1; pg <= pageCount; pg++) {
    doc.setPage(pg)
    const footerY = 287

    doc.setFillColor(...NAVY)
    doc.rect(0, footerY - 8, W, 20, 'F')

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...CREAM)
    doc.text(`Website audit for ${domain}  ·  nithdigital.uk/book`, 14, footerY)
    doc.setTextColor(...LIGHT_GRAY)
    doc.text(`Page ${pg} of ${pageCount}  ·  Nith Digital  ·  hello@nithdigital.uk`, 14, footerY + 5)

    // Score summary on page 1 footer
    if (pg === 1) {
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      const footerScoreCol = scoreColor(result.scores.overall)
      doc.setTextColor(footerScoreCol[0], footerScoreCol[1], footerScoreCol[2])
      doc.text(`Overall: ${result.scores.overall}/100`, W - 14, footerY, { align: 'right' })
    }
  }

  doc.save(`Nith-Digital-Audit-${domain.replace(/[^a-z0-9]/gi, '-')}.pdf`)
}
