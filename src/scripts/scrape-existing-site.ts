/**
 * scrape-existing-site.ts
 * Scrapes a client's existing website: extracts headings, copy, contact details,
 * image URLs, and dominant CSS colours. Saves results to designs/[client-slug]/scraped/
 *
 * Usage:
 *   npx ts-node --project tsconfig.json src/scripts/scrape-existing-site.ts \
 *     --url https://example.com --client-slug example-client
 */

import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '')
    }
  }
}

// ─── Args ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const getArg = (flag: string): string | undefined => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : undefined
}

const siteUrl = getArg('--url')
const clientSlug = getArg('--client-slug')

if (!siteUrl || !clientSlug) {
  console.error('Usage: scrape-existing-site.ts --url <url> --client-slug <slug>')
  process.exit(1)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fetchUrl(url: string, redirectDepth = 0): Promise<string> {
  return new Promise((resolve, reject) => {
    if (redirectDepth > 5) { reject(new Error('Too many redirects')); return }
    const protocol = url.startsWith('https') ? https : http
    const req = protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NithDigitalBot/1.0)' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location, redirectDepth + 1).then(resolve).catch(reject)
        return
      }
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')) })
  })
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(dest)
    protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close()
        downloadFile(res.headers.location, dest).then(resolve).catch(reject)
        return
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
    }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err) })
  })
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function extractMeta(html: string, attr: string, name: string): string {
  const re = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i')
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${name}["']`, 'i')
  return (html.match(re) || html.match(re2) || [])[1] || ''
}

function extractAll(html: string, tag: string): string[] {
  const re = new RegExp(`<${tag}[^>]*>([^<]+)<\/${tag}>`, 'gi')
  const results: string[] = []
  let m
  while ((m = re.exec(html)) !== null) {
    const text = m[1].trim()
    if (text.length > 2) results.push(text)
  }
  return results
}

function extractImages(html: string, baseUrl: string): string[] {
  const re = /(?:src|data-src)=["']([^"']+\.(jpg|jpeg|png|webp|gif|svg))["']/gi
  const seen = new Set<string>()
  const imgs: string[] = []
  let m
  while ((m = re.exec(html)) !== null) {
    let url = m[1]
    if (url.startsWith('//')) url = 'https:' + url
    else if (url.startsWith('/')) url = new URL(url, baseUrl).href
    else if (!url.startsWith('http')) url = new URL(url, baseUrl).href
    if (!seen.has(url) && !url.includes('data:') && !url.includes('placeholder')) {
      seen.add(url)
      imgs.push(url)
    }
  }
  return imgs
}

function extractColors(html: string): string[] {
  const colorRe = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g
  const seen = new Set<string>()
  let m
  while ((m = colorRe.exec(html)) !== null) {
    const hex = m[0].toLowerCase()
    // Skip near-whites and near-blacks and greys
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const isGrey = Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && Math.abs(r - b) < 20
    const isTooLight = r > 230 && g > 230 && b > 230
    const isTooD = r < 25 && g < 25 && b < 25
    if (!isGrey && !isTooLight && !isTooD) seen.add(hex)
  }
  return Array.from(seen).slice(0, 8)
}

function extractFonts(html: string): string[] {
  const fontRe = /font-family\s*:\s*([^;}"]+)/gi
  const seen = new Set<string>()
  let m
  while ((m = fontRe.exec(html)) !== null) {
    const fonts = m[1].split(',').map(f => f.trim().replace(/['"]/g, ''))
    for (const f of fonts) {
      if (f && !['serif', 'sans-serif', 'monospace', 'inherit', 'initial', 'unset', 'cursive'].includes(f.toLowerCase())) {
        seen.add(f)
      }
    }
  }
  return Array.from(seen).slice(0, 4)
}

function extractContact(html: string): { phone: string; email: string; address: string } {
  const phoneRe = /(?:tel:|phone:|call us)[:\s]*([+\d\s()\-]{7,20})/gi
  const emailRe = /([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g
  const phone = (html.match(phoneRe) || [])[0]?.replace(/tel:|phone:|call us/gi, '').trim() || ''
  const emailMatch = html.match(emailRe)
  const email = emailMatch ? emailMatch.find(e => !e.includes('example') && !e.includes('test')) || '' : ''

  // Simple address extraction: look for postcode patterns
  const postcodeRe = /[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}/g
  const postcodes = html.match(postcodeRe) || []
  const address = postcodes[0] || ''

  return { phone, email, address }
}

function extractNavLinks(html: string): string[] {
  const navRe = /<(?:nav|header)[^>]*>([\s\S]*?)<\/(?:nav|header)>/gi
  const linkRe = /<a[^>]*>([^<]+)<\/a>/gi
  const links: string[] = []
  let navMatch
  while ((navMatch = navRe.exec(html)) !== null) {
    let m
    while ((m = linkRe.exec(navMatch[1])) !== null) {
      const text = m[1].trim()
      if (text.length > 1 && text.length < 30) links.push(text)
    }
  }
  return [...new Set(links)].slice(0, 8)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const baseDir = path.join(process.cwd(), 'designs', clientSlug!)
  const scrapedDir = path.join(baseDir, 'scraped')
  const imagesDir = path.join(scrapedDir, 'images')

  fs.mkdirSync(imagesDir, { recursive: true })

  console.log(`\nScraping ${siteUrl}...`)

  let html = ''
  try {
    html = await fetchUrl(siteUrl!)
  } catch (err) {
    console.error('Failed to fetch site:', err)
    process.exit(1)
  }

  // Extract data
  const title = (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1]?.trim() || ''
  const metaDesc = extractMeta(html, 'name', 'description')
  const h1s = extractAll(html, 'h1')
  const h2s = extractAll(html, 'h2').slice(0, 10)
  const h3s = extractAll(html, 'h3').slice(0, 10)
  const paras = extractAll(html, 'p').filter(p => p.length > 30).slice(0, 8)
  const navLinks = extractNavLinks(html)
  const contact = extractContact(html)
  const imageUrls = extractImages(html, siteUrl!).slice(0, 10)
  const colors = extractColors(html)
  const fonts = extractFonts(html)

  // Business name: try title, then h1
  const businessName = title.replace(/\s*[-|]\s*.+$/, '').trim() || h1s[0] || ''

  // Services: h2s and h3s that look like service names
  const serviceKeywords = ['service', 'offer', 'specialise', 'provide', 'solution', 'repair', 'install', 'design', 'build']
  const services = [...h2s, ...h3s].filter(h =>
    serviceKeywords.some(k => html.toLowerCase().includes(k)) || h.length < 40
  ).slice(0, 10)

  console.log(`  Title: ${title}`)
  console.log(`  Business: ${businessName}`)
  console.log(`  Nav links: ${navLinks.join(', ')}`)
  console.log(`  Images found: ${imageUrls.length}`)
  console.log(`  Colors found: ${colors.join(', ')}`)

  // Download up to 6 images
  const downloadedImages: string[] = []
  let downloaded = 0
  for (const imgUrl of imageUrls) {
    if (downloaded >= 6) break
    try {
      const ext = imgUrl.split('?')[0].split('.').pop() || 'jpg'
      const filename = `image-${downloaded + 1}.${ext}`
      const dest = path.join(imagesDir, filename)
      await downloadFile(imgUrl, dest)
      downloadedImages.push(filename)
      downloaded++
      console.log(`  Downloaded: ${filename}`)
    } catch {
      // Skip images that fail to download
    }
  }

  // Copy samples
  const copySamples: Record<string, string> = {}
  if (h1s[0]) copySamples.hero_headline = h1s[0]
  if (metaDesc) copySamples.meta_description = metaDesc
  if (paras[0]) copySamples.intro_paragraph = paras[0]

  const analysis = {
    url: siteUrl,
    scraped_at: new Date().toISOString(),
    pages_found: navLinks,
    business_name: businessName,
    page_title: title,
    meta_description: metaDesc,
    headings: { h1s, h2s: h2s.slice(0, 6), h3s: h3s.slice(0, 6) },
    services_mentioned: services,
    phone: contact.phone,
    email: contact.email,
    address: contact.address,
    existing_colors: colors,
    existing_fonts: fonts,
    image_urls: imageUrls,
    downloaded_images: downloadedImages,
    copy_samples: copySamples,
  }

  const outputPath = path.join(scrapedDir, 'site-analysis.json')
  fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2))
  console.log(`\nSite analysis saved to: ${outputPath}`)
  console.log('\nSummary:')
  console.log(`  Business: ${businessName}`)
  console.log(`  Phone: ${contact.phone || 'not found'}`)
  console.log(`  Email: ${contact.email || 'not found'}`)
  console.log(`  Colors: ${colors.slice(0, 4).join(', ')}`)
  console.log(`  Fonts: ${fonts.join(', ')}`)
  console.log(`  Images downloaded: ${downloadedImages.length}`)
}

main().catch(err => { console.error(err); process.exit(1) })
