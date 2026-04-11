/**
 * Tests for the HTML parsing / extraction helpers in /api/audit/route.ts.
 * Functions are mirrored here (same pattern as auditScoring.test.ts) because
 * they are not exported from the route file.
 */
export {}

// ─── Helpers (mirrored from route.ts) ────────────────────────────────────────

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

function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  return m ? m[1].trim() : null
}

function extractH1s(html: string): string[] {
  const re = /<h1[^>]*>([\s\S]*?)<\/h1>/gi
  const results: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    results.push(m[1].replace(/<[^>]+>/g, '').trim())
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
  const charsetMeta = metas.find((t) => /charset\s*=/i.test(t))
  if (charsetMeta) {
    const m = charsetMeta.match(/charset\s*=\s*["']?([^"'>\s]+)/i)
    if (m) return m[1]
  }
  const httpEquiv = metas.find((t) => /content-type/i.test(t))
  if (httpEquiv) {
    const c = getAttr(httpEquiv, 'content')
    const m = c?.match(/charset\s*=\s*([^\s;]+)/i)
    if (m) return m[1]
  }
  return null
}

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

// ─── getAttr ──────────────────────────────────────────────────────────────────

describe('getAttr', () => {
  test('extracts double-quoted attribute', () => {
    expect(getAttr('<meta name="description" content="Hello">', 'content')).toBe('Hello')
  })

  test('extracts single-quoted attribute', () => {
    expect(getAttr("<meta name='keywords' content='a,b,c'>", 'content')).toBe('a,b,c')
  })

  test('returns null when attribute is absent', () => {
    expect(getAttr('<meta name="viewport">', 'content')).toBeNull()
  })

  test('is case-insensitive for attribute names', () => {
    expect(getAttr('<meta NAME="description" CONTENT="Test">', 'content')).toBe('Test')
  })
})

// ─── extractMetaTags ─────────────────────────────────────────────────────────

describe('extractMetaTags', () => {
  test('returns empty array when no meta tags', () => {
    expect(extractMetaTags('<html><body>Hi</body></html>')).toEqual([])
  })

  test('returns all meta tags', () => {
    const html = `<meta charset="UTF-8"><meta name="description" content="Test">`
    expect(extractMetaTags(html)).toHaveLength(2)
  })

  test('handles meta tags with self-closing slash', () => {
    const html = `<meta charset="UTF-8" />`
    expect(extractMetaTags(html)).toHaveLength(1)
  })
})

// ─── getMetaContent ───────────────────────────────────────────────────────────

describe('getMetaContent', () => {
  const metas = [
    `<meta name="description" content="Page description">`,
    `<meta property="og:title" content="OG Title">`,
    `<meta name="keywords" content="a, b, c">`,
  ]

  test('finds content by name', () => {
    expect(getMetaContent(metas, 'description')).toBe('Page description')
  })

  test('finds content by property', () => {
    expect(getMetaContent(metas, 'og:title')).toBe('OG Title')
  })

  test('returns first match when multiple names provided', () => {
    expect(getMetaContent(metas, 'description', 'og:title')).toBe('Page description')
  })

  test('returns null when none match', () => {
    expect(getMetaContent(metas, 'author')).toBeNull()
  })

  test('returns null for empty metas array', () => {
    expect(getMetaContent([], 'description')).toBeNull()
  })
})

// ─── extractTitle ─────────────────────────────────────────────────────────────

describe('extractTitle', () => {
  test('extracts simple title', () => {
    expect(extractTitle('<title>My Page</title>')).toBe('My Page')
  })

  test('trims whitespace from title', () => {
    expect(extractTitle('<title>  Padded Title  </title>')).toBe('Padded Title')
  })

  test('returns null when no title tag', () => {
    expect(extractTitle('<html><body>No title</body></html>')).toBeNull()
  })

  test('is case-insensitive for tag', () => {
    expect(extractTitle('<TITLE>Uppercase Tag</TITLE>')).toBe('Uppercase Tag')
  })

  test('handles title with attributes on tag', () => {
    expect(extractTitle('<title lang="en">English Title</title>')).toBe('English Title')
  })
})

// ─── extractH1s ───────────────────────────────────────────────────────────────

describe('extractH1s', () => {
  test('returns empty array when no H1s', () => {
    expect(extractH1s('<p>No headings here</p>')).toEqual([])
  })

  test('extracts single H1 text', () => {
    expect(extractH1s('<h1>Hello World</h1>')).toEqual(['Hello World'])
  })

  test('extracts multiple H1s', () => {
    const html = '<h1>First</h1><p>text</p><h1>Second</h1>'
    expect(extractH1s(html)).toEqual(['First', 'Second'])
  })

  test('strips inner HTML tags from H1', () => {
    expect(extractH1s('<h1><span>Clean</span> Text</h1>')).toEqual(['Clean Text'])
  })

  test('handles H1 with class attribute', () => {
    expect(extractH1s('<h1 class="hero">Hero Heading</h1>')).toEqual(['Hero Heading'])
  })
})

// ─── extractImgTags ───────────────────────────────────────────────────────────

describe('extractImgTags', () => {
  test('returns empty array when no images', () => {
    expect(extractImgTags('<p>No images</p>')).toEqual([])
  })

  test('returns all img tags', () => {
    const html = '<img src="a.jpg" alt="A"><img src="b.jpg">'
    expect(extractImgTags(html)).toHaveLength(2)
  })

  test('captures img tags regardless of attribute order', () => {
    const html = '<img alt="icon" src="icon.png" loading="lazy">'
    expect(extractImgTags(html)).toHaveLength(1)
  })
})

// ─── extractScriptSrcs ────────────────────────────────────────────────────────

describe('extractScriptSrcs', () => {
  test('returns empty array when no external scripts', () => {
    expect(extractScriptSrcs('<script>alert(1)</script>')).toEqual([])
  })

  test('extracts src from script tags', () => {
    const html = '<script src="/app.js"></script>'
    expect(extractScriptSrcs(html)).toEqual(['/app.js'])
  })

  test('extracts multiple script srcs', () => {
    const html = '<script src="/a.js"></script><script src="https://cdn.example.com/b.js"></script>'
    expect(extractScriptSrcs(html)).toEqual(['/a.js', 'https://cdn.example.com/b.js'])
  })

  test('ignores inline scripts (no src attribute)', () => {
    const html = '<script>console.log("inline")</script><script src="/ext.js"></script>'
    expect(extractScriptSrcs(html)).toEqual(['/ext.js'])
  })
})

// ─── extractLinkTags ─────────────────────────────────────────────────────────

describe('extractLinkTags', () => {
  test('returns empty array when no link tags', () => {
    expect(extractLinkTags('<p>No links</p>')).toEqual([])
  })

  test('returns stylesheet link tags', () => {
    const html = '<link rel="stylesheet" href="/style.css">'
    const tags = extractLinkTags(html)
    expect(tags).toHaveLength(1)
    expect(tags[0]).toContain('stylesheet')
  })

  test('returns multiple link tags including favicon and canonical', () => {
    const html = `
      <link rel="icon" href="/favicon.ico">
      <link rel="canonical" href="https://example.com/page">
      <link rel="stylesheet" href="/style.css">
    `
    expect(extractLinkTags(html)).toHaveLength(3)
  })
})

// ─── extractAllLinks ─────────────────────────────────────────────────────────

describe('extractAllLinks', () => {
  test('returns empty array when no anchor tags', () => {
    expect(extractAllLinks('<p>No anchors</p>')).toEqual([])
  })

  test('extracts href values', () => {
    const html = '<a href="/about">About</a><a href="https://external.com">Ext</a>'
    expect(extractAllLinks(html)).toEqual(['/about', 'https://external.com'])
  })

  test('ignores anchors without href', () => {
    const html = '<a name="section">Section</a>'
    expect(extractAllLinks(html)).toEqual([])
  })

  test('handles anchors with additional attributes', () => {
    const html = '<a href="/contact" class="nav-link" target="_blank">Contact</a>'
    expect(extractAllLinks(html)).toEqual(['/contact'])
  })
})

// ─── stripHtml ────────────────────────────────────────────────────────────────

describe('stripHtml', () => {
  test('removes all HTML tags', () => {
    expect(stripHtml('<p>Hello <strong>World</strong></p>')).toBe('Hello World')
  })

  test('removes style blocks entirely', () => {
    const html = '<style>body { color: red; }</style><p>Text</p>'
    const result = stripHtml(html)
    expect(result).not.toContain('color')
    expect(result).toContain('Text')
  })

  test('removes script blocks entirely', () => {
    const html = '<script>var x = 1;</script><p>Content</p>'
    const result = stripHtml(html)
    expect(result).not.toContain('var x')
    expect(result).toContain('Content')
  })

  test('collapses multiple whitespace to single space', () => {
    expect(stripHtml('<p>  Too   many   spaces  </p>')).toBe('Too many spaces')
  })

  test('returns empty string for empty input', () => {
    expect(stripHtml('')).toBe('')
  })
})

// ─── countWords ───────────────────────────────────────────────────────────────

describe('countWords', () => {
  test('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0)
  })

  test('returns 0 for whitespace-only string', () => {
    expect(countWords('   ')).toBe(0)
  })

  test('counts single word', () => {
    expect(countWords('hello')).toBe(1)
  })

  test('counts multiple words', () => {
    expect(countWords('the quick brown fox')).toBe(4)
  })

  test('handles multiple spaces between words', () => {
    expect(countWords('one  two   three')).toBe(3)
  })
})

// ─── detectLanguage ───────────────────────────────────────────────────────────

describe('detectLanguage', () => {
  test('extracts lang attribute from html tag', () => {
    expect(detectLanguage('<html lang="en">')).toBe('en')
  })

  test('extracts lang with region code', () => {
    expect(detectLanguage('<html lang="en-GB">')).toBe('en-GB')
  })

  test('returns null when no lang attribute', () => {
    expect(detectLanguage('<html>')).toBeNull()
  })

  test('is case-insensitive', () => {
    expect(detectLanguage('<HTML LANG="fr">')).toBe('fr')
  })
})

// ─── detectCharset ────────────────────────────────────────────────────────────

describe('detectCharset', () => {
  test('detects charset from meta charset attribute', () => {
    const metas = ['<meta charset="UTF-8">']
    expect(detectCharset('', metas)).toBe('UTF-8')
  })

  test('detects charset from http-equiv content-type', () => {
    const metas = ['<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">']
    expect(detectCharset('', metas)).toBe('ISO-8859-1')
  })

  test('returns null when no charset present', () => {
    const metas = ['<meta name="viewport" content="width=device-width">']
    expect(detectCharset('', metas)).toBeNull()
  })

  test('prefers meta charset over http-equiv', () => {
    const metas = [
      '<meta charset="UTF-8">',
      '<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">',
    ]
    expect(detectCharset('', metas)).toBe('UTF-8')
  })
})

// ─── validateUrl (full version matching route.ts) ────────────────────────────

describe('validateUrl (route.ts version)', () => {
  test('accepts valid https URL', () => {
    const result = validateUrl('https://example.com')
    expect(result.valid).toBe(true)
  })

  test('accepts valid http URL', () => {
    const result = validateUrl('http://example.com')
    expect(result.valid).toBe(true)
  })

  test('rejects empty string', () => {
    const result = validateUrl('')
    expect(result.valid).toBe(false)
    expect((result as { valid: false; reason: string }).reason).toBeTruthy()
  })

  test('rejects ftp protocol', () => {
    const result = validateUrl('ftp://example.com')
    expect(result.valid).toBe(false)
  })

  test('rejects localhost', () => {
    const result = validateUrl('http://localhost:3000')
    expect(result.valid).toBe(false)
    expect((result as { valid: false; reason: string }).reason).toContain('Private')
  })

  test('rejects 127.0.0.1', () => {
    expect(validateUrl('http://127.0.0.1').valid).toBe(false)
  })

  test('rejects 192.168.x.x', () => {
    expect(validateUrl('http://192.168.0.1').valid).toBe(false)
  })

  test('rejects 10.x.x.x', () => {
    expect(validateUrl('http://10.0.0.1').valid).toBe(false)
  })

  test('rejects 172.16.x.x through 172.31.x.x', () => {
    expect(validateUrl('http://172.16.0.1').valid).toBe(false)
    expect(validateUrl('http://172.31.0.1').valid).toBe(false)
  })

  test('accepts 172.15.x.x (not in private range)', () => {
    expect(validateUrl('http://172.15.0.1').valid).toBe(true)
  })

  test('rejects plain text without protocol', () => {
    expect(validateUrl('example.com').valid).toBe(false)
  })

  test('valid result includes parsed URL object', () => {
    const result = validateUrl('https://www.example.co.uk/path?q=1')
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.url.hostname).toBe('www.example.co.uk')
    }
  })
})

// ─── HTML-based detection (inline logic from analyseHtml) ────────────────────

describe('platform detection logic', () => {
  test('detects WordPress from wp-content', () => {
    const html = '<link rel="stylesheet" href="/wp-content/themes/main.css">'
    expect(html.toLowerCase().includes('wp-content')).toBe(true)
  })

  test('detects Wix from wix.com domain in html', () => {
    const html = '<script src="https://static.wix.com/services/wixapps.js"></script>'
    expect(html.toLowerCase().includes('wix.com')).toBe(true)
  })

  test('detects Shopify from shopify reference', () => {
    const html = '<link href="//cdn.shopify.com/s/files/1/shop.css" rel="stylesheet">'
    expect(html.toLowerCase().includes('shopify')).toBe(true)
  })

  test('detects Squarespace', () => {
    const html = '<script src="https://static.squarespace.com/universal/scripts.js"></script>'
    expect(html.toLowerCase().includes('squarespace')).toBe(true)
  })
})

describe('content detection logic (regex patterns)', () => {
  const phoneRe = /((\+44|0044|0)[\s-]?[0-9]{4}[\s-]?[0-9]{6}|(\+44|0044|0)\s?[0-9]{10})/

  test('detects UK phone number (07xxx format)', () => {
    expect(phoneRe.test('Call us on 07700 900123')).toBe(true)
  })

  test('detects UK phone number (+44 format)', () => {
    expect(phoneRe.test('Call +44 7700 900123')).toBe(true)
  })

  test('does not match random numbers', () => {
    expect(phoneRe.test('Invoice number 123456789')).toBe(false)
  })

  const emailRe = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/

  test('detects email address', () => {
    expect(emailRe.test('Contact hello@example.co.uk for info')).toBe(true)
  })

  test('does not match text without @', () => {
    expect(emailRe.test('No email here')).toBe(false)
  })

  const addressRe = /\b(street|road|avenue|lane|drive|close|way|place|square|gardens|crescent)\b/i

  test('detects UK address keywords', () => {
    expect(addressRe.test('123 High Street, Edinburgh')).toBe(true)
    expect(addressRe.test('15 Oak Road, Glasgow')).toBe(true)
  })

  const postcodeRe = /\b[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}\b/

  test('detects UK postcode', () => {
    expect(postcodeRe.test('Visit us at DG4 6JD')).toBe(true)
    expect(postcodeRe.test('EH1 2AB is our address')).toBe(true)
  })
})

describe('mixed content detection', () => {
  test('detects http src on https page', () => {
    const isHttps = true
    const html = '<img src="http://insecure.com/image.jpg">'
    const mixedContent = isHttps && /(?:src|href)\s*=\s*["']http:\/\//i.test(html)
    expect(mixedContent).toBe(true)
  })

  test('no mixed content on http page', () => {
    const isHttps = false
    const html = '<img src="http://example.com/image.jpg">'
    const mixedContent = isHttps && /(?:src|href)\s*=\s*["']http:\/\//i.test(html)
    expect(mixedContent).toBe(false)
  })

  test('no mixed content when all resources use https', () => {
    const isHttps = true
    const html = '<img src="https://cdn.example.com/image.jpg">'
    const mixedContent = isHttps && /(?:src|href)\s*=\s*["']http:\/\//i.test(html)
    expect(mixedContent).toBe(false)
  })
})

describe('structured data detection', () => {
  test('detects application/ld+json script', () => {
    const html = '<script type="application/ld+json">{"@type":"Organization"}</script>'
    expect(/<script[^>]+type\s*=\s*["']application\/ld\+json["'][^>]*>/i.test(html)).toBe(true)
  })

  test('does not match regular script tags', () => {
    const html = '<script src="/app.js"></script>'
    expect(/<script[^>]+type\s*=\s*["']application\/ld\+json["'][^>]*>/i.test(html)).toBe(false)
  })
})

describe('analytics detection', () => {
  const analyticsRe = /UA-[0-9]+-[0-9]+|G-[A-Z0-9]+|gtag\s*\(/i

  test('detects Google Analytics UA code', () => {
    expect(analyticsRe.test("ga('create', 'UA-12345-1', 'auto')")).toBe(true)
  })

  test('detects GA4 G- code', () => {
    expect(analyticsRe.test("gtag('config', 'G-ABCDE12345')")).toBe(true)
  })

  test('detects gtag function call', () => {
    expect(analyticsRe.test('gtag("js", new Date())')).toBe(true)
  })

  test('does not match unrelated strings', () => {
    expect(analyticsRe.test('No analytics here')).toBe(false)
  })
})

describe('batch audit rate limit (checkRateLimit logic)', () => {
  // Mirror the rate limit logic inline
  function makeRateLimiter(max: number, windowMs: number) {
    const map = new Map<string, { count: number; resetAt: number }>()
    return function checkRateLimit(ip: string, now = Date.now()): boolean {
      const entry = map.get(ip)
      if (!entry || now > entry.resetAt) {
        map.set(ip, { count: 1, resetAt: now + windowMs })
        return true
      }
      if (entry.count >= max) return false
      entry.count++
      return true
    }
  }

  test('first request is allowed', () => {
    const check = makeRateLimiter(10, 60_000)
    expect(check('1.2.3.4')).toBe(true)
  })

  test('requests up to the limit are allowed', () => {
    const check = makeRateLimiter(3, 60_000)
    const now = Date.now()
    expect(check('1.2.3.4', now)).toBe(true)
    expect(check('1.2.3.4', now)).toBe(true)
    expect(check('1.2.3.4', now)).toBe(true)
  })

  test('request over the limit is rejected', () => {
    const check = makeRateLimiter(3, 60_000)
    const now = Date.now()
    check('1.2.3.4', now)
    check('1.2.3.4', now)
    check('1.2.3.4', now)
    expect(check('1.2.3.4', now)).toBe(false)
  })

  test('window reset allows requests again', () => {
    const check = makeRateLimiter(2, 60_000)
    const now = Date.now()
    check('1.2.3.4', now)
    check('1.2.3.4', now)
    expect(check('1.2.3.4', now)).toBe(false)
    // After window expires
    expect(check('1.2.3.4', now + 61_000)).toBe(true)
  })

  test('different IPs have independent limits', () => {
    const check = makeRateLimiter(1, 60_000)
    const now = Date.now()
    expect(check('1.1.1.1', now)).toBe(true)
    expect(check('2.2.2.2', now)).toBe(true)
    expect(check('1.1.1.1', now)).toBe(false)
    expect(check('2.2.2.2', now)).toBe(false)
  })
})
