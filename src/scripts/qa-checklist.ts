/**
 * qa-checklist.ts
 * Runs automated quality gates on a client's scaffold and staging site.
 * Reports pass/fail for SEO, performance, copy, and file completeness.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json src/scripts/qa-checklist.ts \
 *     --client-slug <slug> [--staging-url <url>]
 */

import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'
import { spawnSync } from 'child_process'

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

// ─── Args ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const getArg = (flag: string): string | undefined => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : undefined
}

const clientSlug = getArg('--client-slug')
const stagingUrl = getArg('--staging-url')

if (!clientSlug) {
  console.error('Usage: qa-checklist.ts --client-slug <slug> [--staging-url <url>]')
  process.exit(1)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface CheckResult {
  name: string
  passed: boolean
  detail?: string
}

function check(name: string, passed: boolean, detail?: string): CheckResult {
  const icon = passed ? '✓' : '✗'
  const line = `  ${icon} ${name}${detail ? ': ' + detail : ''}`
  console.log(line)
  return { name, passed, detail }
}

function fetchUrl(url: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    protocol.get(url, { headers: { 'User-Agent': 'NithDigitalQA/1.0' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location).then(resolve).catch(reject)
        return
      }
      let body = ''
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => resolve({ status: res.statusCode || 0, body }))
    }).on('error', reject)
  })
}

// ─── Checks ───────────────────────────────────────────────────────────────────

const designsDir = path.join(process.cwd(), 'designs', clientSlug!)
const scaffoldDir = path.join(designsDir, 'scaffold')
const copyPath = path.join(designsDir, 'copy.json')

interface Copy {
  meta?: { title?: string; description?: string }
  pages?: {
    home?: { hero_headline?: string; hero_cta?: string }
    [key: string]: unknown
  }
}

function checkFileSystem(results: CheckResult[]) {
  console.log('\n── File Completeness ──────────────────────────────────────')

  const requiredFiles = [
    'package.json',
    'next.config.ts',
    'tsconfig.json',
    'postcss.config.mjs',
    '.eslintrc.json',
    'src/app/globals.css',
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/app/about/page.tsx',
    'src/app/services/page.tsx',
    'src/app/contact/page.tsx',
    'src/app/sitemap.ts',
    'src/app/robots.ts',
    'src/app/not-found.tsx',
    'src/app/error.tsx',
    'src/components/Navbar.tsx',
    'src/components/Footer.tsx',
    'src/components/CookieBanner.tsx',
    'src/app/privacy/page.tsx',
    'src/lib/env.ts',
    'src/__tests__/site.test.ts',
    '.lighthouserc.json',
    'CHANGELOG.md',
  ]

  for (const file of requiredFiles) {
    const exists = fs.existsSync(path.join(scaffoldDir, ...file.split('/')))
    results.push(check(file, exists, exists ? '' : 'MISSING'))
  }
}

function checkCopy(results: CheckResult[]) {
  console.log('\n── Copy Quality ───────────────────────────────────────────')

  if (!fs.existsSync(copyPath)) {
    results.push(check('copy.json exists', false, 'MISSING'))
    return
  }

  results.push(check('copy.json exists', true))

  let copy: Copy
  try {
    copy = JSON.parse(fs.readFileSync(copyPath, 'utf-8')) as Copy
  } catch {
    results.push(check('copy.json is valid JSON', false, 'parse error'))
    return
  }

  // Validate top-level structure
  const hasStructure = !!(copy.meta && copy.pages && (copy as unknown as Record<string, unknown>).schema)
  results.push(check('copy.json has required top-level keys (meta, pages, schema)', hasStructure,
    hasStructure ? '' : 'missing meta, pages, or schema — re-generate copy.json'))
  if (!hasStructure) return

  // Meta title length
  const title = copy.meta?.title || ''
  results.push(check('meta.title ≤ 60 chars', title.length > 0 && title.length <= 60, `"${title}" (${title.length} chars)`))

  // Meta description length
  const desc = copy.meta?.description || ''
  results.push(check('meta.description 150–160 chars', desc.length >= 150 && desc.length <= 160, `${desc.length} chars`))

  // No Lorem ipsum
  const allCopy = JSON.stringify(copy)
  results.push(check('No Lorem ipsum', !allCopy.toLowerCase().includes('lorem ipsum')))

  // British English spot-check (look for US spellings)
  const usSpellings = ['optimize', 'organize', 'recognize', 'analyze', 'color:', 'center:', 'behavior']
  const usFound = usSpellings.filter(w => allCopy.toLowerCase().includes(w))
  results.push(check('British English (no US spellings)', usFound.length === 0, usFound.length > 0 ? usFound.join(', ') : ''))

  // Hero CTA not "Click here"
  const heroCta = copy.pages?.home?.hero_cta || ''
  results.push(check('Hero CTA not generic', !heroCta.toLowerCase().includes('click here') && heroCta.length > 0, `"${heroCta}"`))

  // Unique meta descriptions per page (not identical)
  const pageMetas: string[] = []
  for (const page of Object.values(copy.pages || {})) {
    if (page && typeof page === 'object' && 'headline' in page) {
      // Descriptions are set at page level via generateMetadata — check titles are unique at minimum
    }
  }
  // Check NAP fields present if schema exists
  const schema = (copy as unknown as Record<string, unknown>).schema as Record<string, unknown> | undefined
  results.push(check('Schema: telephone field present', !!(schema?.telephone)))
  results.push(check('Schema: address.postal_code present', !!(schema && (schema as Record<string, unknown>)['address'] && ((schema as Record<string, unknown>)['address'] as Record<string, unknown>)['postal_code'])))
  results.push(check('Schema: opening_hours present', !!(schema?.opening_hours)))
}

function checkScaffoldCode(results: CheckResult[]) {
  console.log('\n── Code Quality ───────────────────────────────────────────')

  if (!fs.existsSync(scaffoldDir)) {
    results.push(check('scaffold/ exists', false))
    return
  }
  results.push(check('scaffold/ exists', true))

  // Check for <img> tags (should use next/image)
  let imgTagCount = 0
  let nextImageCount = 0
  let importCssCount = 0
  let generateMetadataCount = 0
  let priorityPropFound = false
  let jsonLdFound = false
  let unsplashConfigFound = false

  function walkFiles(dir: string) {
    for (const entry of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, entry)
      if (fs.statSync(fullPath).isDirectory()) {
        walkFiles(fullPath)
        continue
      }
      if (!fullPath.match(/\.(tsx?|css|js|mjs|json)$/)) continue
      const content = fs.readFileSync(fullPath, 'utf-8')

      // <img tags (not in comments, not next/image)
      const imgMatches = content.match(/<img\s/g)
      if (imgMatches) imgTagCount += imgMatches.length

      if (content.includes('from \'next/image\'') || content.includes('from "next/image"')) nextImageCount++
      if (content.match(/@import\s+['"]https:\/\/fonts\.googleapis/)) importCssCount++
      if (content.includes('generateMetadata')) generateMetadataCount++
      if (content.includes('priority') && content.includes('next/image')) priorityPropFound = true
      if (content.includes('application/ld+json') || content.includes('JsonLd') || content.includes('json-ld')) jsonLdFound = true
      if (content.includes('unsplash.com') && content.includes('remotePatterns')) unsplashConfigFound = true
    }
  }

  walkFiles(scaffoldDir)

  results.push(check('No raw <img> tags (use next/image)', imgTagCount === 0, imgTagCount > 0 ? `${imgTagCount} found` : ''))
  results.push(check('next/image imported', nextImageCount > 0, nextImageCount === 0 ? 'not found' : ''))
  results.push(check('Fonts via next/font (not @import CDN)', importCssCount === 0, importCssCount > 0 ? `${importCssCount} @import found` : ''))
  results.push(check('generateMetadata exported from pages', generateMetadataCount >= 3, `found in ${generateMetadataCount} files`))
  results.push(check('priority prop on hero image', priorityPropFound))
  results.push(check('JSON-LD schema present', jsonLdFound))
  results.push(check('Unsplash in remotePatterns (next.config.ts)', unsplashConfigFound))

  // WebP image format config
  let webpConfigFound = false
  const nextConfigPath = path.join(scaffoldDir, 'next.config.ts')
  if (fs.existsSync(nextConfigPath)) {
    const cfg = fs.readFileSync(nextConfigPath, 'utf-8')
    webpConfigFound = cfg.includes('image/webp') || cfg.includes('formats')
  }
  results.push(check('WebP image format in next.config.ts', webpConfigFound))

  // Error page templates
  const hasNotFound = fs.existsSync(path.join(scaffoldDir, 'src', 'app', 'not-found.tsx'))
  const hasErrorPage = fs.existsSync(path.join(scaffoldDir, 'src', 'app', 'error.tsx'))
  results.push(check('not-found.tsx exists', hasNotFound))
  results.push(check('error.tsx exists', hasErrorPage))
}

function checkUnitTests(results: CheckResult[]) {
  console.log('\n── Unit Tests ─────────────────────────────────────────────')

  const testFile = path.join(scaffoldDir, 'src', '__tests__', 'site.test.ts')
  if (!fs.existsSync(testFile)) {
    results.push(check('site.test.ts exists', false, 'MISSING'))
    return
  }
  results.push(check('site.test.ts exists', true))

  // Check no unresolved placeholders remain in the test file
  const testContent = fs.readFileSync(testFile, 'utf-8')
  const hasPlaceholders = /\[CLIENT_NAME\]|\[location_lowercase\]|\[domain_or_staging_url\]|\[copy\.json/.test(testContent)
  results.push(check('No placeholder values in site.test.ts', !hasPlaceholders,
    hasPlaceholders ? 'placeholders not substituted' : ''))

  // Run jest against the scaffold test file
  const jestResult = spawnSync('npx', ['jest', testFile, '--no-coverage', '--passWithNoTests'], {
    cwd: process.cwd(),
    encoding: 'utf-8',
    timeout: 30_000,
  })

  const passed = jestResult.status === 0
  const detail = passed ? '' : (jestResult.stdout || jestResult.stderr || '').split('\n')
    .filter(l => l.includes('✕') || l.includes('FAIL') || l.includes('expect('))
    .slice(0, 3).join(' | ')
  results.push(check('Unit tests pass (jest)', passed, detail))
}

function checkEslint(results: CheckResult[]) {
  console.log('\n── ESLint (a11y) ──────────────────────────────────────────')

  const eslintConfig = path.join(scaffoldDir, '.eslintrc.json')
  if (!fs.existsSync(eslintConfig)) {
    results.push(check('.eslintrc.json exists', false, 'MISSING — skipping lint'))
    return
  }
  results.push(check('.eslintrc.json exists', true))

  // Check jsx-a11y is in devDependencies
  const pkgPath = path.join(scaffoldDir, 'package.json')
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as { devDependencies?: Record<string, string> }
    const hasPlugin = !!(pkg.devDependencies?.['eslint-plugin-jsx-a11y'])
    results.push(check('eslint-plugin-jsx-a11y in devDependencies', hasPlugin,
      hasPlugin ? '' : 'add to devDependencies'))
  }
}

async function checkStagingUrl(url: string, results: CheckResult[]) {
  console.log(`\n── Staging URL: ${url} ───────────────────────`)

  try {
    const home = await fetchUrl(url)
    results.push(check('Homepage returns 200', home.status === 200, `HTTP ${home.status}`))

    // Check sitemap
    try {
      const sitemap = await fetchUrl(url + '/sitemap.xml')
      const hasSitemapXml = sitemap.status === 200 && sitemap.body.includes('<urlset')
      results.push(check('sitemap.xml exists and valid', hasSitemapXml, `HTTP ${sitemap.status}`))
    } catch {
      results.push(check('sitemap.xml', false, 'fetch failed'))
    }

    // Check robots.txt
    try {
      const robots = await fetchUrl(url + '/robots.txt')
      const robotsOk = robots.status === 200 && !robots.body.includes('Disallow: /')
      results.push(check('robots.txt exists and not blocking all', robotsOk, `HTTP ${robots.status}`))
    } catch {
      results.push(check('robots.txt', false, 'fetch failed'))
    }

    // Check OG meta tags in homepage
    const hasOgTitle = home.body.includes('og:title')
    const hasOgDesc = home.body.includes('og:description')
    const hasOgImage = home.body.includes('og:image')
    const hasJsonLd = home.body.includes('application/ld+json')
    results.push(check('OG meta: og:title present', hasOgTitle))
    results.push(check('OG meta: og:description present', hasOgDesc))
    results.push(check('OG meta: og:image present', hasOgImage))
    results.push(check('JSON-LD schema in rendered HTML', hasJsonLd))

    // FAQPage schema check — only required if copy.json has ≥3 FAQ items
    if (fs.existsSync(copyPath)) {
      try {
        const c = JSON.parse(fs.readFileSync(copyPath, 'utf-8')) as Copy
        const faqItems = (c as unknown as Record<string, unknown>)['pages'] &&
          ((c as unknown as Record<string, unknown>)['pages'] as Record<string, unknown>)['faq'] &&
          ((((c as unknown as Record<string, unknown>)['pages'] as Record<string, unknown>)['faq'] as Record<string, unknown>)['items'] as unknown[])
        if (Array.isArray(faqItems) && faqItems.length >= 3) {
          const hasFaqSchema = home.body.includes('FAQPage')
          results.push(check('FAQPage JSON-LD present (≥3 FAQ items found in copy.json)', hasFaqSchema,
            hasFaqSchema ? '' : 'add FAQPage schema to page.tsx'))
        }
      } catch { /* skip if copy.json unreadable */ }
    }

  } catch (err) {
    results.push(check('Homepage reachable', false, String(err)))
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n════════════════════════════════════════`)
  console.log(`  QA Checklist: ${clientSlug}`)
  console.log(`════════════════════════════════════════`)

  const results: CheckResult[] = []

  checkFileSystem(results)
  checkCopy(results)
  checkScaffoldCode(results)
  checkUnitTests(results)
  checkEslint(results)

  if (stagingUrl) {
    await checkStagingUrl(stagingUrl, results)
  } else {
    // Try to load from provision.json
    const provisionPath = path.join(designsDir, 'provision.json')
    if (fs.existsSync(provisionPath)) {
      const provision = JSON.parse(fs.readFileSync(provisionPath, 'utf-8')) as { staging_url: string }
      if (provision.staging_url) {
        await checkStagingUrl(provision.staging_url, results)
      }
    }
  }

  // Summary
  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => !r.passed).length
  const total = results.length

  console.log('\n════════════════════════════════════════')
  console.log(`  Results: ${passed}/${total} passed`)
  if (failed > 0) {
    console.log(`  FAILED (${failed}):`)
    results.filter(r => !r.passed).forEach(r => {
      console.log(`    ✗ ${r.name}${r.detail ? ' — ' + r.detail : ''}`)
    })
  } else {
    console.log('  All checks passed! ✓')
  }
  console.log('════════════════════════════════════════\n')

  // Save report
  const reportPath = path.join(designsDir, 'qa-report.json')
  fs.writeFileSync(reportPath, JSON.stringify({
    client_slug: clientSlug,
    checked_at: new Date().toISOString(),
    staging_url: stagingUrl || null,
    passed,
    failed,
    total,
    results,
  }, null, 2))
  console.log(`Report saved to: ${reportPath}`)

  if (failed > 0) process.exit(1)
}

main().catch(err => { console.error(err); process.exit(1) })
