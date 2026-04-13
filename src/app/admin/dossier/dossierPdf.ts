// Dossier PDF generator — 8-page branded document
// Follows proposalPdf.ts pattern: jsPDF with manual layout, QR codes, branded colors

interface DossierData {
  id: string
  business_name: string
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  sector: string
  url: string | null
  location: string | null
  audit_snapshot: {
    url: string
    scores: { seo: number; security: number; performance: number; mobile: number; content: number; overall: number }
    technology?: { platform?: string; framework?: string; cms?: string }
    checks?: { category: string; label: string; status: 'pass' | 'warn' | 'fail'; detail?: string }[]
    grade?: string
  } | null
  visibility_score: number | null
  visibility_answers: Record<string, boolean> | null
  local_seo_score: number | null
  local_seo_answers: Record<string, string> | null
  social_profiles: { facebook?: string | null; instagram?: string | null; twitter?: string | null; linkedin?: string | null } | null
  google_review_count: number | null
  google_rating: number | null
  review_response_rate: number | null
  competitor_urls: string[]
  competitor_audits: { url: string; scores: { seo: number; security: number; performance: number; mobile: number; content: number; overall: number } }[] | null
  recommended_services: string[]
  service_descriptions: Record<string, { name: string; description: string; priority: number; priceLow: number; priceHigh: number; monthlyCost?: number }> | null
  roi_projection: { monthlySearchVolume: number; conversionRate: number; avgTicketValue: number; estimatedMonthlyLeads: number; estimatedMonthlyRevenue: number; annualRevenueGain: number; paybackMonths: number } | null
  custom_stats: { stat: string; source: string }[] | null
  estimated_price_low: number | null
  estimated_price_high: number | null
  monthly_cost: number | null
  personal_note: string | null
  public_token: string
  created_at: string
}

const NAVY = [27, 42, 74] as const
const GOLD = [212, 168, 75] as const
const CREAM = [245, 240, 230] as const
const GRAY = [90, 106, 122] as const
const RED = [220, 38, 38] as const
const GREEN = [22, 163, 74] as const
const ORANGE = [217, 119, 6] as const

function scoreColor(score: number): readonly [number, number, number] {
  if (score >= 70) return GREEN
  if (score >= 40) return ORANGE
  return RED
}

function fmt(n: number) { return '£' + n.toLocaleString('en-GB') }

function gradeFor(score: number) {
  if (score >= 90) return 'A'
  if (score >= 75) return 'B'
  if (score >= 60) return 'C'
  if (score >= 45) return 'D'
  return 'F'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = any

function drawHeader(doc: Doc, W: number) {
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, W, 28, 'F')
  doc.setFillColor(...GOLD)
  doc.roundedRect(10, 5, 18, 18, 2, 2, 'F')
  doc.setTextColor(27, 42, 74)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('N', 19, 17, { align: 'center' })
  doc.setTextColor(...GOLD)
  doc.setFontSize(13)
  doc.text('Nith Digital', 32, 14)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...CREAM)
  doc.text('Digital Health Report', 32, 20)
  doc.setTextColor(...CREAM)
  doc.setFontSize(7)
  doc.text('nithdigital.uk', W - 10, 16, { align: 'right' })
}

function drawSectionTitle(doc: Doc, title: string, y: number): number {
  doc.setFillColor(...GOLD)
  doc.rect(14, y, 3, 6, 'F')
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...NAVY)
  doc.text(title, 20, y + 5)
  return y + 14
}

function drawScoreBar(doc: Doc, label: string, score: number, x: number, y: number, width: number) {
  const barH = 6
  doc.setFillColor(240, 240, 240)
  doc.roundedRect(x, y, width, barH, 1, 1, 'F')
  const fillW = (score / 100) * width
  const color = scoreColor(score)
  doc.setFillColor(...color)
  doc.roundedRect(x, y, Math.max(fillW, 2), barH, 1, 1, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...NAVY)
  doc.text(label, x, y - 2)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...color)
  doc.text(`${score}`, x + width + 3, y + 4.5)
}

export async function generateDossierPDF(dossier: DossierData) {
  const { jsPDF } = await import('jspdf')
  const QRCode = await import('qrcode')
  const doc = new jsPDF({ format: 'a4', unit: 'mm' })
  const W = 210
  const H = 297
  const M = 14 // margin
  const CW = W - M * 2 // content width
  let y = 0

  // ═════════════════════════════════════════════════════════════════════════
  // PAGE 1: COVER
  // ═════════════════════════════════════════════════════════════════════════

  doc.setFillColor(...NAVY)
  doc.rect(0, 0, W, H, 'F')

  // Gold logo
  doc.setFillColor(...GOLD)
  doc.roundedRect(W / 2 - 15, 50, 30, 30, 4, 4, 'F')
  doc.setTextColor(27, 42, 74)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('N', W / 2, 70, { align: 'center' })

  // Report title
  doc.setTextColor(...GOLD)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('DIGITAL HEALTH REPORT', W / 2, 96, { align: 'center' })

  // Business name
  doc.setTextColor(...CREAM)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  const nameLines = doc.splitTextToSize(dossier.business_name, 160)
  doc.text(nameLines, W / 2, 115, { align: 'center' })
  y = 115 + nameLines.length * 12

  // Sector + location
  if (dossier.location) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAY)
    doc.text(`${dossier.sector} — ${dossier.location}`, W / 2, y + 8, { align: 'center' })
    y += 16
  } else {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAY)
    doc.text(dossier.sector, W / 2, y + 8, { align: 'center' })
    y += 16
  }

  // Gold separator
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.5)
  doc.line(W / 2 - 30, y + 10, W / 2 + 30, y + 10)

  // Prepared by
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAY)
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  doc.text('Prepared by Akin Yavuz — Nith Digital', W / 2, y + 24, { align: 'center' })
  doc.text(today, W / 2, y + 32, { align: 'center' })

  // Confidential
  doc.setFontSize(8)
  doc.setTextColor(90, 106, 122)
  if (dossier.contact_name) {
    doc.text(`Confidential — prepared for ${dossier.contact_name}`, W / 2, H - 20, { align: 'center' })
  }

  const refNum = `ND-${dossier.id.slice(-6).toUpperCase()}`
  doc.text(`Ref: ${refNum}`, W / 2, H - 14, { align: 'center' })

  // ═════════════════════════════════════════════════════════════════════════
  // PAGE 2: WEBSITE ASSESSMENT
  // ═════════════════════════════════════════════════════════════════════════

  doc.addPage()
  drawHeader(doc, W)
  y = 36

  y = drawSectionTitle(doc, 'Website Assessment', y)

  if (!dossier.audit_snapshot) {
    // No website
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...RED)
    doc.text('No Website Found', W / 2, y + 10, { align: 'center' })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAY)
    const noWebLines = doc.splitTextToSize('80% of customers Google a business before visiting. Without a website, you are invisible to the majority of potential clients searching for your services online.', CW - 20)
    doc.text(noWebLines, M + 10, y + 20)
    y += 20 + noWebLines.length * 5
  } else {
    const scores = dossier.audit_snapshot.scores

    // Overall score big
    doc.setFontSize(48)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...scoreColor(scores.overall))
    doc.text(`${scores.overall}`, W / 2 - 20, y + 20, { align: 'center' })

    doc.setFontSize(14)
    doc.text(`/ 100`, W / 2 + 10, y + 20)

    doc.setFontSize(20)
    doc.text(`Grade ${gradeFor(scores.overall)}`, W / 2, y + 32, { align: 'center' })

    y += 42

    // Score bars
    const categories = [
      { label: 'SEO', score: scores.seo },
      { label: 'Security', score: scores.security },
      { label: 'Performance', score: scores.performance },
      { label: 'Mobile', score: scores.mobile },
      { label: 'Content', score: scores.content },
    ]

    for (const cat of categories) {
      drawScoreBar(doc, cat.label, cat.score, M + 20, y, 120)
      y += 14
    }

    // Technology detected
    if (dossier.audit_snapshot.technology?.platform) {
      y += 4
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...GRAY)
      doc.text(`Platform detected: ${dossier.audit_snapshot.technology.platform}`, M, y)
      y += 8
    }

    // Failed checks
    const failedChecks = (dossier.audit_snapshot.checks || []).filter(c => c.status === 'fail')
    if (failedChecks.length > 0) {
      y += 4
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...NAVY)
      doc.text('Key Issues Found:', M, y)
      y += 7

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      for (const check of failedChecks.slice(0, 10)) {
        if (y > 260) break
        doc.setFillColor(...RED)
        doc.circle(M + 3, y - 1, 1.2, 'F')
        doc.setTextColor(...NAVY)
        doc.text(check.label, M + 8, y)
        y += 6
      }
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // PAGE 3: GOOGLE VISIBILITY & LOCAL SEO
  // ═════════════════════════════════════════════════════════════════════════

  doc.addPage()
  drawHeader(doc, W)
  y = 36

  y = drawSectionTitle(doc, 'Google Visibility & Local SEO', y)

  // Visibility score
  const visScore = dossier.visibility_score ?? 0
  const visTier = visScore >= 80 ? 'Highly Visible' : visScore >= 50 ? 'Moderately Visible' : visScore >= 25 ? 'Low Visibility' : 'Virtually Invisible'

  doc.setFontSize(32)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...scoreColor(visScore))
  doc.text(`${visScore}%`, M + 40, y + 10, { align: 'center' })
  doc.setFontSize(10)
  doc.text(visTier, M + 40, y + 18, { align: 'center' })

  // Local SEO score
  const seoScore = dossier.local_seo_score ?? 0
  const seoBand = seoScore >= 80 ? 'Excellent' : seoScore >= 60 ? 'Good' : seoScore >= 40 ? 'Needs Work' : 'Critical'

  doc.setFontSize(32)
  doc.setTextColor(...scoreColor(seoScore))
  doc.text(`${seoScore}%`, W - M - 40, y + 10, { align: 'center' })
  doc.setFontSize(10)
  doc.text(seoBand, W - M - 40, y + 18, { align: 'center' })

  doc.setFontSize(8)
  doc.setTextColor(...GRAY)
  doc.text('Google Visibility', M + 40, y + 24, { align: 'center' })
  doc.text('Local SEO', W - M - 40, y + 24, { align: 'center' })

  y += 36

  // Missing visibility items
  if (dossier.visibility_answers) {
    const ITEMS = [
      { id: 'has-website', label: 'Has a website' },
      { id: 'first-page', label: 'First page of Google' },
      { id: 'has-gbp', label: 'Google Business Profile' },
      { id: 'gbp-accurate', label: 'Accurate GBP info' },
      { id: 'reviews-5', label: '5+ Google reviews' },
      { id: 'reviews-10', label: '10+ Google reviews' },
      { id: 'rating-4', label: '4+ star rating' },
      { id: 'gbp-post', label: 'Recent GBP update' },
      { id: 'maps-search', label: 'Appears in Maps' },
      { id: 'local-keywords', label: 'Local keywords on site' },
      { id: 'gbp-photos', label: 'GBP photos' },
      { id: 'fresh-website', label: 'Recently updated site' },
    ]
    const missing = ITEMS.filter(item => !dossier.visibility_answers![item.id])
    if (missing.length > 0) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...NAVY)
      doc.text('Missing from your visibility profile:', M, y)
      y += 7

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      for (const item of missing.slice(0, 8)) {
        doc.setFillColor(...RED)
        doc.circle(M + 3, y - 1, 1.2, 'F')
        doc.setTextColor(...NAVY)
        doc.text(item.label, M + 8, y)
        y += 6
      }
    }
  }

  // Social & Reviews section on same page
  y += 8
  y = drawSectionTitle(doc, 'Social Media & Reviews', y)

  const socials = dossier.social_profiles || {}
  const platforms = [
    { key: 'facebook', label: 'Facebook' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'twitter', label: 'Twitter/X' },
    { key: 'linkedin', label: 'LinkedIn' },
  ]

  for (const p of platforms) {
    const hasIt = !!(socials as Record<string, string | null>)[p.key]
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...NAVY)
    doc.text(p.label, M + 4, y)
    doc.setFont('helvetica', 'bold')
    const pColor = hasIt ? GREEN : RED
    doc.setTextColor(pColor[0], pColor[1], pColor[2])
    doc.text(hasIt ? 'Active' : 'Not found', M + 50, y)
    y += 6
  }

  y += 4
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...NAVY)
  doc.text(`Google Reviews: ${dossier.google_review_count ?? 0}`, M + 4, y)
  if (dossier.google_rating) {
    doc.text(`Average Rating: ${dossier.google_rating}★`, M + 80, y)
  }
  y += 6
  if (dossier.review_response_rate != null) {
    doc.text(`Owner Response Rate: ${dossier.review_response_rate}%`, M + 4, y)
    y += 6
  }

  if (!dossier.google_review_count || dossier.google_review_count < 5) {
    y += 2
    doc.setFillColor(255, 240, 240)
    doc.roundedRect(M, y - 4, CW, 10, 2, 2, 'F')
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...RED)
    doc.text('Fewer than 5 Google reviews — this is a critically low trust signal for potential customers', M + 4, y + 2)
  }

  // ═════════════════════════════════════════════════════════════════════════
  // PAGE 4: COST OF INACTION
  // ═════════════════════════════════════════════════════════════════════════

  doc.addPage()
  drawHeader(doc, W)
  y = 36

  y = drawSectionTitle(doc, 'What This Is Costing You', y)

  if (dossier.roi_projection) {
    const roi = dossier.roi_projection

    // Big missed revenue figure
    doc.setFillColor(255, 240, 240)
    doc.roundedRect(M, y, CW, 30, 4, 4, 'F')
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...RED)
    doc.text(`${fmt(roi.annualRevenueGain)}`, W / 2, y + 14, { align: 'center' })
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAY)
    doc.text('estimated lost revenue over 12 months', W / 2, y + 22, { align: 'center' })
    y += 38

    // Breakdown
    const items = [
      [`~${roi.monthlySearchVolume.toLocaleString()} local searches/month`, 'for your service type in your area'],
      [`${(roi.conversionRate * 100).toFixed(1)}% convert to enquiries`, 'industry average conversion rate'],
      [`~${roi.estimatedMonthlyLeads} missed leads/month`, 'potential customers you are not reaching'],
      [`${fmt(roi.avgTicketValue)} average job/order value`, 'typical transaction value for your sector'],
      [`${fmt(roi.estimatedMonthlyRevenue)} missed revenue/month`, 'potential additional monthly income'],
    ]

    doc.setFontSize(9)
    for (const [main, sub] of items) {
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...NAVY)
      doc.setFillColor(...GOLD)
      doc.circle(M + 3, y - 1, 1.2, 'F')
      doc.text(main, M + 8, y)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...GRAY)
      doc.text(sub, M + 8, y + 5)
      y += 14
    }
  }

  // Industry stats
  if (dossier.custom_stats && dossier.custom_stats.length > 0) {
    y += 6
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...NAVY)
    doc.text('Industry Facts', M, y)
    y += 7

    doc.setFontSize(9)
    for (const stat of dossier.custom_stats.slice(0, 5)) {
      if (y > 260) break
      doc.setFillColor(...GOLD)
      doc.circle(M + 3, y - 1, 1.2, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...NAVY)
      const lines = doc.splitTextToSize(`${stat.stat} — ${stat.source}`, CW - 12)
      doc.text(lines, M + 8, y)
      y += lines.length * 5 + 3
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // PAGE 5: COMPETITOR COMPARISON (conditional)
  // ═════════════════════════════════════════════════════════════════════════

  if (dossier.competitor_audits && dossier.competitor_audits.length > 0) {
    doc.addPage()
    drawHeader(doc, W)
    y = 36

    y = drawSectionTitle(doc, 'Competitor Comparison', y)

    // Table header
    const cols = ['Category', 'Your Site']
    const colWidths = [35, 28]
    for (const comp of dossier.competitor_audits) {
      try { cols.push(new URL(comp.url).hostname.replace('www.', '').slice(0, 20)) } catch { cols.push(comp.url.slice(0, 20)) }
      colWidths.push(28)
    }

    const tableX = M + 5
    doc.setFillColor(...CREAM)
    doc.rect(tableX - 2, y - 4, colWidths.reduce((a, b) => a + b, 0) + 10, 8, 'F')

    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...NAVY)
    let cx = tableX
    for (let i = 0; i < cols.length; i++) {
      doc.text(cols[i], cx, y)
      cx += colWidths[i]
    }
    y += 8

    const cats: Array<{ label: string; key: 'overall' | 'seo' | 'performance' | 'mobile' | 'security' | 'content' }> = [
      { label: 'Overall', key: 'overall' },
      { label: 'SEO', key: 'seo' },
      { label: 'Performance', key: 'performance' },
      { label: 'Mobile', key: 'mobile' },
      { label: 'Security', key: 'security' },
      { label: 'Content', key: 'content' },
    ]

    for (const cat of cats) {
      doc.setDrawColor(240, 240, 240)
      doc.line(tableX - 2, y - 3, tableX + colWidths.reduce((a, b) => a + b, 0) + 8, y - 3)

      cx = tableX
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...NAVY)
      doc.text(cat.label, cx, y)
      cx += colWidths[0]

      // Your score
      const yourScore = dossier.audit_snapshot?.scores[cat.key] ?? 0
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...scoreColor(yourScore))
      doc.text(`${yourScore}`, cx, y)
      cx += colWidths[1]

      // Competitor scores
      for (let i = 0; i < dossier.competitor_audits.length; i++) {
        const compScore = dossier.competitor_audits[i].scores[cat.key]
        doc.setTextColor(...scoreColor(compScore))
        doc.text(`${compScore}`, cx, y)
        cx += colWidths[i + 2]
      }
      y += 8
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // PAGE 6: RECOMMENDED SOLUTION
  // ═════════════════════════════════════════════════════════════════════════

  doc.addPage()
  drawHeader(doc, W)
  y = 36

  y = drawSectionTitle(doc, 'What We Would Build', y)

  if (dossier.service_descriptions) {
    const services = Object.values(dossier.service_descriptions).sort((a, b) => a.priority - b.priority)

    doc.setFontSize(9)
    for (const svc of services) {
      if (y > 250) { doc.addPage(); drawHeader(doc, W); y = 36 }

      // Priority tag
      const pLabel = svc.priority === 1 ? 'MUST-HAVE' : svc.priority === 2 ? 'SHOULD-HAVE' : 'NICE-TO-HAVE'
      const pColor: readonly [number, number, number] = svc.priority === 1 ? GOLD : GRAY

      // Left gold bar for must-haves
      if (svc.priority === 1) {
        doc.setFillColor(...GOLD)
        doc.rect(M, y - 2, 2, 14, 'F')
      }

      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...NAVY)
      doc.text(svc.name, M + 6, y)

      // Priority tag right
      doc.setFontSize(7)
      doc.setTextColor(...pColor)
      doc.text(pLabel, W - M, y, { align: 'right' })

      // Price
      doc.setFontSize(8)
      doc.setTextColor(...NAVY)
      const priceStr = svc.priceLow > 0 ? `${fmt(svc.priceLow)}–${fmt(svc.priceHigh)}${svc.monthlyCost ? ` + ${fmt(svc.monthlyCost)}/mo` : ''}` : 'Included'
      doc.text(priceStr, W - M, y + 5, { align: 'right' })

      // Description
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...GRAY)
      const descLines = doc.splitTextToSize(svc.description, CW - 50)
      doc.text(descLines, M + 6, y + 5)
      y += Math.max(descLines.length * 4.5 + 8, 16)
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // PAGE 7: INVESTMENT & RETURNS
  // ═════════════════════════════════════════════════════════════════════════

  doc.addPage()
  drawHeader(doc, W)
  y = 36

  y = drawSectionTitle(doc, 'Investment & Returns', y)

  // Pricing box
  doc.setFillColor(...CREAM)
  doc.roundedRect(M, y, CW / 2 - 4, 50, 4, 4, 'F')

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...NAVY)
  doc.text('Your Investment', M + 8, y + 10)

  if (dossier.estimated_price_low && dossier.estimated_price_high) {
    doc.setFontSize(18)
    doc.setTextColor(...GOLD)
    doc.text(`${fmt(dossier.estimated_price_low)} – ${fmt(dossier.estimated_price_high)}`, M + 8, y + 24)
    doc.setFontSize(8)
    doc.setTextColor(...GRAY)
    doc.text('one-off build cost', M + 8, y + 30)
  }

  if (dossier.monthly_cost) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...NAVY)
    doc.text(`${fmt(dossier.monthly_cost)}/month`, M + 8, y + 40)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAY)
    doc.text('hosting & support', M + 50, y + 40)
  }

  // ROI box
  const rx = W / 2 + 4
  doc.setFillColor(240, 255, 240)
  doc.roundedRect(rx, y, CW / 2 - 4, 50, 4, 4, 'F')

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...NAVY)
  doc.text('Expected Returns', rx + 8, y + 10)

  if (dossier.roi_projection) {
    const roi = dossier.roi_projection
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')

    doc.setTextColor(...GREEN)
    doc.setFont('helvetica', 'bold')
    doc.text(`~${roi.estimatedMonthlyLeads} new leads/month`, rx + 8, y + 22)

    doc.setTextColor(...GREEN)
    doc.text(`${fmt(roi.estimatedMonthlyRevenue)} revenue/month`, rx + 8, y + 30)

    doc.setFontSize(10)
    doc.text(`Payback: ~${roi.paybackMonths} month${roi.paybackMonths !== 1 ? 's' : ''}`, rx + 8, y + 40)
  }

  y += 58

  // Agency pricing anchor
  doc.setFillColor(...CREAM)
  doc.roundedRect(M, y, CW, 12, 2, 2, 'F')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...GRAY)
  doc.text('Agencies in Dumfries & Galloway typically charge £2,000–£10,000 for a comparable website build.', M + 6, y + 7)

  // ═════════════════════════════════════════════════════════════════════════
  // PAGE 8: ABOUT + CTA
  // ═════════════════════════════════════════════════════════════════════════

  doc.addPage()
  drawHeader(doc, W)
  y = 36

  y = drawSectionTitle(doc, 'Why Nith Digital', y)

  const reasons = [
    ['Local to D&G', 'Based in Sanquhar — we understand the local market and your customers'],
    ['Transparent Pricing', 'No hidden fees, no surprises. You know what you\'re paying before we start'],
    ['Direct Access', 'You talk to the developer, not a call centre. Fast responses, real answers'],
    ['No Lock-In', 'No long-term contracts. You own your website and your data'],
  ]

  doc.setFontSize(10)
  for (const [title, desc] of reasons) {
    doc.setFillColor(...GOLD)
    doc.circle(M + 3, y - 1, 1.5, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...NAVY)
    doc.text(title, M + 8, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAY)
    doc.setFontSize(9)
    doc.text(desc, M + 8, y + 5.5)
    doc.setFontSize(10)
    y += 14
  }

  // Personal note
  if (dossier.personal_note) {
    y += 8
    doc.setDrawColor(...GOLD)
    doc.setLineWidth(0.3)
    doc.line(M, y, W - M, y)
    y += 8

    doc.setFillColor(...GOLD)
    doc.rect(M, y, 3, 6, 'F')
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...NAVY)
    doc.text('A note for you', M + 6, y + 5)
    y += 12

    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(...GRAY)
    const noteLines = doc.splitTextToSize(`"${dossier.personal_note}"`, CW - 12)
    doc.text(noteLines, M + 6, y)
    y += noteLines.length * 5.5 + 8
  }

  // CTA section
  y += 10
  doc.setFillColor(...GOLD)
  doc.roundedRect(M, y, CW, 40, 6, 6, 'F')

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(27, 42, 74)
  doc.text('Ready to get started?', W / 2, y + 14, { align: 'center' })

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Book a free 15-minute consultation', W / 2, y + 22, { align: 'center' })

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('nithdigital.uk/book', W / 2, y + 32, { align: 'center' })

  y += 48

  // QR code
  try {
    const qr = await QRCode.toDataURL('https://nithdigital.uk/book', { width: 80, margin: 1 })
    doc.addImage(qr, 'PNG', W / 2 - 14, y, 28, 28)
    y += 32
  } catch { /* skip */ }

  // Contact details
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAY)
  doc.text('hello@nithdigital.uk  ·  nithdigital.uk  ·  Sanquhar, Dumfries & Galloway', W / 2, y + 4, { align: 'center' })

  // ═════════════════════════════════════════════════════════════════════════
  // FOOTER ON ALL PAGES
  // ═════════════════════════════════════════════════════════════════════════

  const pageCount = doc.getNumberOfPages()
  for (let pg = 2; pg <= pageCount; pg++) {
    doc.setPage(pg)
    doc.setFillColor(...NAVY)
    doc.rect(0, H - 10, W, 10, 'F')
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAY)
    doc.text(`Nith Digital · Digital Health Report · ${dossier.business_name}`, M, H - 4)
    doc.text(`Page ${pg} of ${pageCount}`, W - M, H - 4, { align: 'right' })
  }

  doc.save(`Nith-Digital-Dossier-${dossier.business_name.replace(/[^a-z0-9]/gi, '-')}.pdf`)
}
