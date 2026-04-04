import { renderEmailTemplate, EmailTemplate } from '@/lib/email-templates'

// ─── baseLayout / shared structure ───────────────────────────────────────────

describe('renderEmailTemplate — shared structure', () => {
  test('returns subject, html, and text for every template', () => {
    const templates: EmailTemplate[] = [
      'launchpad_welcome',
      'launchpad_incomplete_reminder',
      'launchpad_completed',
      'bundle_reminder',
      'booking_confirmation',
      'booking_reminder',
      'testimonial_request',
      'os_welcome',
      'os_trial_ending',
    ]
    for (const t of templates) {
      const result = renderEmailTemplate(t, {})
      expect(result).toHaveProperty('subject')
      expect(result).toHaveProperty('html')
      expect(result).toHaveProperty('text')
      expect(typeof result.subject).toBe('string')
      expect(typeof result.html).toBe('string')
      expect(typeof result.text).toBe('string')
    }
  })

  test('html contains Nith Digital branding in header', () => {
    const { html } = renderEmailTemplate('launchpad_welcome', {})
    expect(html).toContain('Nith Digital')
  })

  test('html contains footer email link', () => {
    const { html } = renderEmailTemplate('launchpad_welcome', {})
    expect(html).toContain('hello@nithdigital.uk')
  })

  test('html contains unsubscribe link', () => {
    const { html } = renderEmailTemplate('launchpad_welcome', {})
    expect(html).toContain('unsubscribe')
  })

  test('text version strips HTML tags', () => {
    const { text } = renderEmailTemplate('launchpad_welcome', { name: 'Alice' })
    expect(text).not.toMatch(/<[^>]+>/)
  })

  test('text version includes title and footer', () => {
    const { text } = renderEmailTemplate('launchpad_welcome', {})
    expect(text).toContain('Nith Digital')
    expect(text).toContain('hello@nithdigital.uk')
  })

  test('falls back to "there" when name is omitted', () => {
    const { html } = renderEmailTemplate('launchpad_welcome', {})
    expect(html).toContain('Hi there,')
  })

  test('uses provided name when given', () => {
    const { html } = renderEmailTemplate('launchpad_welcome', { name: 'Bob' })
    expect(html).toContain('Hi Bob,')
  })
})

// ─── launchpad_welcome ────────────────────────────────────────────────────────

describe('launchpad_welcome', () => {
  test('subject is correct', () => {
    const { subject } = renderEmailTemplate('launchpad_welcome', {})
    expect(subject).toBe('Welcome to the Nith Digital Launchpad')
  })

  test('html contains checklist link', () => {
    const { html } = renderEmailTemplate('launchpad_welcome', {})
    expect(html).toContain('/launchpad/checklist')
  })

  test('html mentions Startup Bundle', () => {
    const { html } = renderEmailTemplate('launchpad_welcome', {})
    expect(html).toContain('Startup Bundle')
  })
})

// ─── launchpad_incomplete_reminder ───────────────────────────────────────────

describe('launchpad_incomplete_reminder', () => {
  test('subject uses remaining step count', () => {
    const { subject } = renderEmailTemplate('launchpad_incomplete_reminder', {
      steps_completed: 3,
      total_steps: 10,
    })
    expect(subject).toContain('7 step')
  })

  test('subject shows correct count when 1 remaining', () => {
    const { subject } = renderEmailTemplate('launchpad_incomplete_reminder', {
      steps_completed: 9,
      total_steps: 10,
    })
    expect(subject).toContain('1 step')
  })

  test('html shows correct completed/total', () => {
    const { html } = renderEmailTemplate('launchpad_incomplete_reminder', {
      steps_completed: 4,
      total_steps: 10,
    })
    expect(html).toContain('4 of 10 steps complete')
  })

  test('progress bar width is correct percentage', () => {
    const { html } = renderEmailTemplate('launchpad_incomplete_reminder', {
      steps_completed: 5,
      total_steps: 10,
    })
    expect(html).toContain('width:50%')
  })

  test('defaults to 0 completed when not provided', () => {
    const { html } = renderEmailTemplate('launchpad_incomplete_reminder', {})
    expect(html).toContain('0 of 10 steps complete')
  })
})

// ─── launchpad_completed ──────────────────────────────────────────────────────

describe('launchpad_completed', () => {
  test('subject congratulates user', () => {
    const { subject } = renderEmailTemplate('launchpad_completed', {})
    expect(subject.toLowerCase()).toContain('congratulations')
  })

  test('html shows provided promo code', () => {
    const { html } = renderEmailTemplate('launchpad_completed', { promo_code: 'MYCODE123' })
    expect(html).toContain('MYCODE123')
  })

  test('html falls back to LAUNCH2026 when no promo_code', () => {
    const { html } = renderEmailTemplate('launchpad_completed', {})
    expect(html).toContain('LAUNCH2026')
  })

  test('html contains bundle redemption link', () => {
    const { html } = renderEmailTemplate('launchpad_completed', {})
    expect(html).toContain('/launchpad/bundle')
  })

  test('html lists startup bundle items', () => {
    const { html } = renderEmailTemplate('launchpad_completed', {})
    expect(html).toContain('Free website build')
    expect(html).toContain('Business OS')
  })
})

// ─── bundle_reminder ──────────────────────────────────────────────────────────

describe('bundle_reminder', () => {
  test('subject is correct', () => {
    const { subject } = renderEmailTemplate('bundle_reminder', {})
    expect(subject).toBe('Your Startup Bundle code is waiting')
  })

  test('html shows promo code', () => {
    const { html } = renderEmailTemplate('bundle_reminder', { promo_code: 'TEST99' })
    expect(html).toContain('TEST99')
  })

  test('falls back to LAUNCH2026 when no promo_code', () => {
    const { html } = renderEmailTemplate('bundle_reminder', {})
    expect(html).toContain('LAUNCH2026')
  })

  test('html contains redeem button', () => {
    const { html } = renderEmailTemplate('bundle_reminder', {})
    expect(html).toContain('/launchpad/bundle')
  })
})

// ─── booking_confirmation ─────────────────────────────────────────────────────

describe('booking_confirmation', () => {
  test('subject contains date and time', () => {
    const { subject } = renderEmailTemplate('booking_confirmation', {
      date: '10 April 2026',
      time: '2:00 PM',
    })
    expect(subject).toContain('10 April 2026')
    expect(subject).toContain('2:00 PM')
  })

  test('html shows service, date, and time in table', () => {
    const { html } = renderEmailTemplate('booking_confirmation', {
      service: 'SEO Audit',
      date: '10 April 2026',
      time: '2:00 PM',
    })
    expect(html).toContain('SEO Audit')
    expect(html).toContain('10 April 2026')
    expect(html).toContain('2:00 PM')
  })

  test('html shows 30 minutes duration', () => {
    const { html } = renderEmailTemplate('booking_confirmation', {})
    expect(html).toContain('30 minutes')
  })

  test('service defaults to Consultation when omitted', () => {
    const { html } = renderEmailTemplate('booking_confirmation', {})
    expect(html).toContain('Consultation')
  })
})

// ─── booking_reminder ─────────────────────────────────────────────────────────

describe('booking_reminder', () => {
  test('subject mentions tomorrow', () => {
    const { subject } = renderEmailTemplate('booking_reminder', {})
    expect(subject.toLowerCase()).toContain('tomorrow')
  })

  test('html contains date and time', () => {
    const { html } = renderEmailTemplate('booking_reminder', {
      date: '11 April 2026',
      time: '3:00 PM',
    })
    expect(html).toContain('11 April 2026')
    expect(html).toContain('3:00 PM')
  })

  test('html contains reschedule contact', () => {
    const { html } = renderEmailTemplate('booking_reminder', {})
    expect(html).toContain('hello@nithdigital.uk')
  })
})

// ─── testimonial_request ──────────────────────────────────────────────────────

describe('testimonial_request', () => {
  test('subject is correct', () => {
    const { subject } = renderEmailTemplate('testimonial_request', {})
    expect(subject).toBe('How was your experience with Nith Digital?')
  })

  test('html uses provided submission_link', () => {
    const { html } = renderEmailTemplate('testimonial_request', {
      submission_link: 'https://example.com/review',
    })
    expect(html).toContain('https://example.com/review')
  })

  test('html falls back to default testimonial link when none provided', () => {
    const { html } = renderEmailTemplate('testimonial_request', {})
    expect(html).toContain('/testimonials/submit')
  })

  test('html mentions Dumfries & Galloway', () => {
    const { html } = renderEmailTemplate('testimonial_request', {})
    // &amp; is HTML-encoded &
    expect(html).toMatch(/Dumfries\s*(&amp;|&amp;)\s*Galloway/i)
  })
})

// ─── os_welcome ───────────────────────────────────────────────────────────────

describe('os_welcome', () => {
  test('subject is correct', () => {
    const { subject } = renderEmailTemplate('os_welcome', {})
    expect(subject).toBe('Welcome to the Nith Digital Business OS')
  })

  test('html contains link to /os', () => {
    const { html } = renderEmailTemplate('os_welcome', {})
    expect(html).toContain('/os')
  })

  test('html contains quick start steps', () => {
    const { html } = renderEmailTemplate('os_welcome', {})
    expect(html).toContain('Add your first client')
    expect(html).toContain('Send your first invoice')
  })
})

// ─── os_trial_ending ──────────────────────────────────────────────────────────

describe('os_trial_ending', () => {
  test('subject mentions 3 days', () => {
    const { subject } = renderEmailTemplate('os_trial_ending', {})
    expect(subject).toContain('3 days')
  })

  test('html shows invoices_count', () => {
    const { html } = renderEmailTemplate('os_trial_ending', { invoices_count: 7 })
    expect(html).toContain('<strong>7</strong>')
  })

  test('html shows expenses_count', () => {
    const { html } = renderEmailTemplate('os_trial_ending', { expenses_count: 12 })
    expect(html).toContain('<strong>12</strong>')
  })

  test('defaults to 0 for both counts when not provided', () => {
    const { html } = renderEmailTemplate('os_trial_ending', {})
    expect(html).toContain('<strong>0</strong>')
  })

  test('html shows subscription price', () => {
    const { html } = renderEmailTemplate('os_trial_ending', {})
    expect(html).toContain('£4.99/month')
  })

  test('html contains link to /os/settings', () => {
    const { html } = renderEmailTemplate('os_trial_ending', {})
    expect(html).toContain('/os/settings')
  })
})
