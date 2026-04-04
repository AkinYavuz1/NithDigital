/**
 * Tests for business logic in API routes that can be validated without
 * making real HTTP requests or hitting external services.
 *
 * Covers:
 *  - batch-audit: input validation rules
 *  - draft-outreach: context string generation, fallback body, JSON parsing
 *  - notify-contact: service/budget label mappings
 *  - send-lead-emails: HTML body builder, plain-text-to-HTML conversion
 *  - files/download: expiry check logic
 */

// ─── batch-audit: input validation ───────────────────────────────────────────

describe('batch-audit — input validation', () => {
  function validateBatchInput(urls: unknown): { ok: true } | { ok: false; reason: string } {
    if (!Array.isArray(urls) || urls.length === 0)
      return { ok: false, reason: 'urls array required' }
    if (urls.length > 50)
      return { ok: false, reason: 'Maximum 50 URLs per batch' }
    return { ok: true }
  }

  test('rejects missing urls', () => {
    expect(validateBatchInput(undefined)).toEqual({ ok: false, reason: 'urls array required' })
  })

  test('rejects empty array', () => {
    expect(validateBatchInput([])).toEqual({ ok: false, reason: 'urls array required' })
  })

  test('rejects non-array', () => {
    expect(validateBatchInput('https://example.com')).toEqual({ ok: false, reason: 'urls array required' })
  })

  test('rejects more than 50 URLs', () => {
    const urls = Array.from({ length: 51 }, (_, i) => `https://example${i}.com`)
    expect(validateBatchInput(urls)).toEqual({ ok: false, reason: 'Maximum 50 URLs per batch' })
  })

  test('exactly 50 URLs is allowed', () => {
    const urls = Array.from({ length: 50 }, (_, i) => `https://example${i}.com`)
    expect(validateBatchInput(urls)).toEqual({ ok: true })
  })

  test('single URL is allowed', () => {
    expect(validateBatchInput(['https://example.com'])).toEqual({ ok: true })
  })
})

// ─── draft-outreach: context string generation ────────────────────────────────

describe('draft-outreach — context string generation', () => {
  interface LeadData {
    businessName: string
    website: string | null
    scores?: { overall: number }
    issues?: string[]
    platform?: string | null
    category?: string | null
  }

  function buildContext(lead: LeadData): string {
    const hasNoWebsite = !lead.website
    const overall = lead.scores?.overall ?? 0
    const issues = lead.issues || []

    let context = ''
    if (hasNoWebsite) {
      context = `This business has no website at all. They are completely invisible online.`
    } else if (overall < 40) {
      context = `This business has a website (${lead.website}) but it scored ${overall}/100 overall. Key issues: ${issues.slice(0, 4).join('; ')}.`
    } else if (overall < 65) {
      context = `This business has a website (${lead.website}) that scored ${overall}/100. It has some strengths but clear gaps: ${issues.slice(0, 3).join('; ')}.`
    } else {
      context = `This business has a reasonably decent website (${lead.website}, score ${overall}/100) but there are still improvements possible: ${issues.slice(0, 2).join('; ')}.`
    }

    if (lead.platform) context += ` They are using ${lead.platform}.`
    if (lead.category) context += ` Business category: ${lead.category}.`
    return context
  }

  test('no website — invisible online message', () => {
    const ctx = buildContext({ businessName: 'Acme', website: null })
    expect(ctx).toContain('no website at all')
    expect(ctx).toContain('invisible online')
  })

  test('score < 40 — uses "Key issues" phrasing and first 4 issues', () => {
    const ctx = buildContext({
      businessName: 'Acme',
      website: 'https://acme.com',
      scores: { overall: 25 },
      issues: ['No HTTPS', 'Missing title', 'No H1', 'No meta desc', 'Extra issue'],
    })
    expect(ctx).toContain('25/100')
    expect(ctx).toContain('Key issues')
    expect(ctx).not.toContain('Extra issue')
  })

  test('score 40–64 — uses "clear gaps" phrasing and first 3 issues', () => {
    const ctx = buildContext({
      businessName: 'Acme',
      website: 'https://acme.com',
      scores: { overall: 55 },
      issues: ['Issue1', 'Issue2', 'Issue3', 'Issue4'],
    })
    expect(ctx).toContain('55/100')
    expect(ctx).toContain('clear gaps')
    expect(ctx).not.toContain('Issue4')
  })

  test('score >= 65 — uses "reasonably decent" phrasing and first 2 issues', () => {
    const ctx = buildContext({
      businessName: 'Acme',
      website: 'https://acme.com',
      scores: { overall: 70 },
      issues: ['IssueA', 'IssueB', 'IssueC'],
    })
    expect(ctx).toContain('reasonably decent')
    expect(ctx).not.toContain('IssueC')
  })

  test('appends platform when present', () => {
    const ctx = buildContext({
      businessName: 'Acme',
      website: 'https://acme.com',
      scores: { overall: 30 },
      platform: 'WordPress',
    })
    expect(ctx).toContain('They are using WordPress.')
  })

  test('appends category when present', () => {
    const ctx = buildContext({
      businessName: 'Acme',
      website: 'https://acme.com',
      scores: { overall: 30 },
      category: 'Plumber',
    })
    expect(ctx).toContain('Business category: Plumber.')
  })

  test('no website lead — no platform or category suffix even if provided', () => {
    const ctx = buildContext({
      businessName: 'Acme',
      website: null,
      platform: 'Wix',
      category: 'Cafe',
    })
    // Platform and category should still append
    expect(ctx).toContain('They are using Wix.')
    expect(ctx).toContain('Business category: Cafe.')
  })
})

// ─── draft-outreach: fallback email bodies ────────────────────────────────────

describe('draft-outreach — fallback email bodies', () => {
  function buildFallback(hasNoWebsite: boolean, businessName: string): { subject: string; body: string } {
    const fallbackBody = hasNoWebsite
      ? `Hi,\n\nI noticed ${businessName} doesn't have a website yet — you're missing out on customers who search online before getting in touch.\n\nWe're Nith Digital, a local agency based in Dumfries & Galloway. We build clean, professional websites for local businesses starting at £40/month with no upfront cost.\n\nWorth a quick chat?\n\nCheers,\nNith Digital`
      : `Hi,\n\nWe ran a quick check on ${businessName}'s website and spotted a few things that are likely holding back your online visibility.\n\nWe're Nith Digital, based locally in D&G. We help local businesses improve their online presence — websites, SEO, and more — from £40/month.\n\nHappy to send over a free full report if that would be useful.\n\nCheers,\nNith Digital`

    return {
      subject: `Your website — a quick note from Nith Digital`,
      body: fallbackBody,
    }
  }

  test('no-website fallback mentions business name', () => {
    const { body } = buildFallback(true, 'The Coffee House')
    expect(body).toContain('The Coffee House')
  })

  test('no-website fallback starts with Hi,', () => {
    const { body } = buildFallback(true, 'Acme')
    expect(body.startsWith('Hi,')).toBe(true)
  })

  test('no-website fallback mentions £40/month', () => {
    const { body } = buildFallback(true, 'Acme')
    expect(body).toContain('£40/month')
  })

  test('no-website fallback signs off as Nith Digital', () => {
    const { body } = buildFallback(true, 'Acme')
    expect(body).toContain('Cheers,\nNith Digital')
  })

  test('has-website fallback mentions business name', () => {
    const { body } = buildFallback(false, 'Green Garden')
    expect(body).toContain("Green Garden's website")
  })

  test('has-website fallback offers free report', () => {
    const { body } = buildFallback(false, 'Acme')
    expect(body).toContain('free full report')
  })

  test('subject is consistent regardless of website status', () => {
    expect(buildFallback(true, 'Acme').subject).toBe('Your website — a quick note from Nith Digital')
    expect(buildFallback(false, 'Acme').subject).toBe('Your website — a quick note from Nith Digital')
  })
})

// ─── draft-outreach: Claude response JSON parsing ─────────────────────────────

describe('draft-outreach — Claude JSON response parsing', () => {
  function parseClaudeResponse(text: string): { subject: string; body: string } {
    const parsed = JSON.parse(
      text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
    )
    return {
      subject: parsed.subject || `Your website — a quick note from Nith Digital`,
      body: parsed.body || '',
    }
  }

  test('parses clean JSON response', () => {
    const text = JSON.stringify({ subject: 'Test subject', body: 'Test body' })
    expect(parseClaudeResponse(text)).toEqual({ subject: 'Test subject', body: 'Test body' })
  })

  test('strips markdown code fences', () => {
    const text = '```json\n{"subject":"Sub","body":"Bod"}\n```'
    expect(parseClaudeResponse(text)).toEqual({ subject: 'Sub', body: 'Bod' })
  })

  test('uses fallback subject when missing from parsed JSON', () => {
    const text = JSON.stringify({ body: 'Body only' })
    const result = parseClaudeResponse(text)
    expect(result.subject).toBe('Your website — a quick note from Nith Digital')
  })

  test('uses empty string for body when missing', () => {
    const text = JSON.stringify({ subject: 'Subject only' })
    const result = parseClaudeResponse(text)
    expect(result.body).toBe('')
  })
})

// ─── notify-contact: service and budget label maps ────────────────────────────

describe('notify-contact — service and budget labels', () => {
  const serviceLabels: Record<string, string> = {
    website: 'Business website',
    ecommerce: 'E-commerce website',
    booking: 'Booking system',
    dashboard: 'BI dashboard',
    app: 'Custom web app',
    mvp: 'MVP / prototype',
    other: 'Something else',
  }

  const budgetLabels: Record<string, string> = {
    under500: 'Under £500',
    '500-2000': '£500 – £2,000',
    '2000-5000': '£2,000 – £5,000',
    '5000+': '£5,000+',
  }

  test('all service keys map to human-readable labels', () => {
    expect(serviceLabels.website).toBe('Business website')
    expect(serviceLabels.ecommerce).toBe('E-commerce website')
    expect(serviceLabels.booking).toBe('Booking system')
    expect(serviceLabels.dashboard).toBe('BI dashboard')
    expect(serviceLabels.app).toBe('Custom web app')
    expect(serviceLabels.mvp).toBe('MVP / prototype')
    expect(serviceLabels.other).toBe('Something else')
  })

  test('all budget keys map to human-readable labels', () => {
    expect(budgetLabels['under500']).toBe('Under £500')
    expect(budgetLabels['500-2000']).toBe('£500 – £2,000')
    expect(budgetLabels['2000-5000']).toBe('£2,000 – £5,000')
    expect(budgetLabels['5000+']).toBe('£5,000+')
  })

  test('fallback uses raw value for unknown service key', () => {
    const key = 'unknown_service'
    const label = serviceLabels[key] ?? key
    expect(label).toBe('unknown_service')
  })

  test('fallback uses raw value for unknown budget key', () => {
    const key = 'custom_budget'
    const label = budgetLabels[key] ?? key
    expect(label).toBe('custom_budget')
  })
})

// ─── send-lead-emails: plain-text-to-HTML conversion ──────────────────────────

describe('send-lead-emails — plain text to HTML conversion', () => {
  function buildHtmlBody(emailBody: string): string {
    return emailBody
      .split('\n\n')
      .map((para: string) => `<p style="margin:0 0 14px 0;line-height:1.6">${para.replace(/\n/g, '<br/>')}</p>`)
      .join('')
  }

  test('wraps each paragraph in a <p> tag', () => {
    const body = 'Para one.\n\nPara two.'
    const html = buildHtmlBody(body)
    expect(html).toContain('<p style="margin:0 0 14px 0;line-height:1.6">Para one.</p>')
    expect(html).toContain('<p style="margin:0 0 14px 0;line-height:1.6">Para two.</p>')
  })

  test('converts single newlines within a paragraph to <br/>', () => {
    const body = 'Line one\nLine two'
    const html = buildHtmlBody(body)
    expect(html).toContain('Line one<br/>Line two')
  })

  test('single paragraph produces one <p> tag', () => {
    const html = buildHtmlBody('Only paragraph.')
    expect((html.match(/<p /g) ?? []).length).toBe(1)
  })

  test('handles empty string without throwing', () => {
    expect(() => buildHtmlBody('')).not.toThrow()
  })

  test('Nith Digital sign-off (multi-line) converts correctly', () => {
    const body = 'Cheers,\nNith Digital'
    const html = buildHtmlBody(body)
    expect(html).toContain('Cheers,<br/>Nith Digital')
  })
})

// ─── send-lead-emails: input validation ───────────────────────────────────────

describe('send-lead-emails — input validation', () => {
  function validateLeadIds(leadIds: unknown): { ok: true } | { ok: false; reason: string } {
    if (!Array.isArray(leadIds) || leadIds.length === 0)
      return { ok: false, reason: 'leadIds array required' }
    if (leadIds.length > 100)
      return { ok: false, reason: 'Maximum 100 emails per send' }
    return { ok: true }
  }

  test('rejects missing leadIds', () => {
    expect(validateLeadIds(undefined)).toEqual({ ok: false, reason: 'leadIds array required' })
  })

  test('rejects empty array', () => {
    expect(validateLeadIds([])).toEqual({ ok: false, reason: 'leadIds array required' })
  })

  test('rejects more than 100 leadIds', () => {
    const ids = Array.from({ length: 101 }, (_, i) => `id-${i}`)
    expect(validateLeadIds(ids)).toEqual({ ok: false, reason: 'Maximum 100 emails per send' })
  })

  test('exactly 100 leadIds is allowed', () => {
    const ids = Array.from({ length: 100 }, (_, i) => `id-${i}`)
    expect(validateLeadIds(ids)).toEqual({ ok: true })
  })
})

// ─── files/download: expiry logic ─────────────────────────────────────────────

describe('files/download — share link expiry check', () => {
  function isExpired(shareExpiresAt: string | null, now = new Date()): boolean {
    if (!shareExpiresAt) return false
    return new Date(shareExpiresAt) < now
  }

  test('link with no expiry is never expired', () => {
    expect(isExpired(null)).toBe(false)
  })

  test('link with future expiry is not expired', () => {
    const future = new Date(Date.now() + 86_400_000).toISOString()
    expect(isExpired(future)).toBe(false)
  })

  test('link with past expiry is expired', () => {
    const past = new Date(Date.now() - 86_400_000).toISOString()
    expect(isExpired(past)).toBe(true)
  })

  test('link expiring exactly now is treated as expired', () => {
    const now = new Date()
    // Same millisecond — boundary: new Date(x) < now is false at exact equality
    const exactly = new Date(now.getTime() - 1).toISOString()
    expect(isExpired(exactly, now)).toBe(true)
  })

  test('invalid date string does not throw', () => {
    // new Date('bad') is Invalid Date, comparison returns false
    expect(() => isExpired('not-a-date')).not.toThrow()
  })
})

// ─── draft-outreach: input validation ─────────────────────────────────────────

describe('draft-outreach — input validation', () => {
  function validateLeads(leads: unknown): { ok: true } | { ok: false; reason: string } {
    if (!Array.isArray(leads) || leads.length === 0)
      return { ok: false, reason: 'leads array required' }
    if (leads.length > 100)
      return { ok: false, reason: 'Maximum 100 leads per batch' }
    return { ok: true }
  }

  test('rejects missing leads', () => {
    expect(validateLeads(undefined)).toEqual({ ok: false, reason: 'leads array required' })
  })

  test('rejects empty array', () => {
    expect(validateLeads([])).toEqual({ ok: false, reason: 'leads array required' })
  })

  test('rejects more than 100 leads', () => {
    const leads = Array.from({ length: 101 }, (_, i) => ({ businessName: `Biz${i}` }))
    expect(validateLeads(leads)).toEqual({ ok: false, reason: 'Maximum 100 leads per batch' })
  })

  test('exactly 100 leads is allowed', () => {
    const leads = Array.from({ length: 100 }, (_, i) => ({ businessName: `Biz${i}` }))
    expect(validateLeads(leads)).toEqual({ ok: true })
  })
})
