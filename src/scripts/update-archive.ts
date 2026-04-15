/**
 * update-archive.ts
 * Appends a new entry to designs/archive.json after a project completes.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json src/scripts/update-archive.ts \
 *     --client-slug <slug>
 */

import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

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

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

const args = process.argv.slice(2)
const getArg = (flag: string): string | undefined => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : undefined
}

const clientSlug = getArg('--client-slug')
if (!clientSlug) {
  console.error('Usage: update-archive.ts --client-slug <slug>')
  process.exit(1)
}

const designsDir = path.join(process.cwd(), 'designs', clientSlug)
const archivePath = path.join(process.cwd(), 'designs', 'archive.json')

// ─── GitHub push helper (for CHANGELOG) ──────────────────────────────────────

function pushFileToGithub(repoFullName: string, filePath: string, content: string, message: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!GITHUB_TOKEN) { resolve(false); return }

    const encoded = Buffer.from(content).toString('base64')

    // First get existing SHA
    const getReq = https.request({
      hostname: 'api.github.com',
      path: `/repos/${repoFullName}/contents/${filePath}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'NithDigital/1.0',
      },
    }, (res) => {
      let raw = ''
      res.on('data', (c) => { raw += c })
      res.on('end', () => {
        let sha: string | undefined
        try { sha = (JSON.parse(raw) as { sha: string }).sha } catch { sha = undefined }

        const bodyObj: Record<string, string> = { message, content: encoded }
        if (sha) bodyObj.sha = sha
        const bodyStr = JSON.stringify(bodyObj)

        const putReq = https.request({
          hostname: 'api.github.com',
          path: `/repos/${repoFullName}/contents/${filePath}`,
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(bodyStr),
            'User-Agent': 'NithDigital/1.0',
          },
        }, (putRes) => {
          let putRaw = ''
          putRes.on('data', (c) => { putRaw += c })
          putRes.on('end', () => resolve(putRes.statusCode === 200 || putRes.statusCode === 201))
        })
        putReq.on('error', () => resolve(false))
        putReq.write(bodyStr)
        putReq.end()
      })
    })
    getReq.on('error', () => resolve(false))
    getReq.end()
  })
}

// ─── Read required files ───────────────────────────────────────────────────────

function readJson<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T
  } catch {
    return null
  }
}

interface Brief {
  client_name?: string
  industry?: string
  website_type?: string
  existing_site_url?: string
}

interface ThemeConfig {
  id: string
  name: string
  colors: { primary: string; accent: string }
  fonts: { heading: string; body: string }
  hero_layout: string
  border_radius: string
}

interface Provision {
  github_full_name: string
  staging_url: string | null
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const brief = readJson<Brief>(path.join(designsDir, 'brief.json'))
  const theme = readJson<ThemeConfig>(path.join(designsDir, 'theme.json'))
  const provision = readJson<Provision>(path.join(designsDir, 'provision.json'))

  if (!brief) {
    console.error('brief.json not found — run the full workflow first')
    process.exit(1)
  }

  // Load all theme proposals from design HTML files (for archive metadata)
  const htmlFiles = fs.existsSync(designsDir)
    ? fs.readdirSync(designsDir).filter(f => f.match(/^design-\d+\.html$/))
    : []

  const heroLayouts = htmlFiles.map((_, i) => {
    const html = fs.readFileSync(path.join(designsDir, htmlFiles[i]), 'utf-8')
    const m = html.match(/Layout:\s*(centered|split|fullwidth)/i)
    return m ? m[1].toLowerCase() : 'unknown'
  })

  // Read themes from design HTML label bars
  const themesProposed = htmlFiles.map((htmlFile, i) => {
    const html = fs.readFileSync(path.join(designsDir, htmlFile), 'utf-8')
    const nameM = html.match(/Design\s+\d+\s+of\s+3\s*\|\s*([^|]+)\s*\|/)
    const primaryM = html.match(/Primary:\s*(#[0-9a-fA-F]{6})/)
    const accentM = html.match(/Accent:\s*(#[0-9a-fA-F]{6})/)
    const fontsM = html.match(/Fonts:\s*([^/|<]+)\/([^|<\n]+)/)
    const layoutM = html.match(/Layout:\s*(centered|split|fullwidth)/i)
    return {
      id: `theme-${i + 1}`,
      name: nameM ? nameM[1].trim() : `Design ${i + 1}`,
      primary_color: primaryM ? primaryM[1] : '',
      accent_color: accentM ? accentM[1] : '',
      heading_font: fontsM ? fontsM[1].trim() : '',
      body_font: fontsM ? fontsM[2].trim() : '',
      hero_layout: layoutM ? layoutM[1].toLowerCase() : 'unknown',
      border_radius: theme?.border_radius || 'soft',
    }
  })

  // Determine approved theme index from theme.json
  const approvedThemeName = theme?.name || ''
  const approvedThemeIndex = themesProposed.findIndex(t => t.name === approvedThemeName)

  const entry = {
    client_slug: clientSlug,
    client_name: brief.client_name || clientSlug,
    industry: brief.industry || '',
    website_type: brief.website_type || 'brochure',
    date: new Date().toISOString().slice(0, 10),
    existing_site_url: brief.existing_site_url || null,
    hero_layouts_used: heroLayouts,
    approved_hero_layout: theme?.hero_layout || '',
    themes_proposed: themesProposed,
    approved_theme_index: approvedThemeIndex >= 0 ? approvedThemeIndex : 0,
    approved_theme_name: approvedThemeName,
    github_full_name: provision?.github_full_name || null,
    staging_url: provision?.staging_url || null,
    live_url: null,
    notes: '',
  }

  // Read existing archive
  let archive: typeof entry[] = []
  if (fs.existsSync(archivePath)) {
    try {
      archive = JSON.parse(fs.readFileSync(archivePath, 'utf-8'))
    } catch {
      archive = []
    }
  }

  // Remove any existing entry for this client slug (update in place)
  archive = archive.filter(a => a.client_slug !== clientSlug)
  archive.push(entry)

  // Write atomically: temp file then rename to prevent corruption
  const tmpPath = archivePath + '.tmp'
  fs.writeFileSync(tmpPath, JSON.stringify(archive, null, 2))
  fs.renameSync(tmpPath, archivePath)
  console.log(`\n✓ Archive updated: ${archivePath}`)
  console.log(`  ${archive.length} total entries`)
  console.log(`\nNew entry:`)
  console.log(JSON.stringify(entry, null, 2))

  // Push CHANGELOG.md to GitHub if it exists locally (created by push-scaffold.ts)
  const changelogPath = path.join(designsDir, 'scaffold', 'CHANGELOG.md')
  if (provision?.github_full_name && fs.existsSync(changelogPath)) {
    const changelogContent = fs.readFileSync(changelogPath, 'utf-8')
    console.log('\n  Pushing CHANGELOG.md to GitHub...')
    const ok = await pushFileToGithub(
      provision.github_full_name,
      'CHANGELOG.md',
      changelogContent,
      'docs: add initial CHANGELOG — Nith Digital build complete'
    )
    console.log(ok ? '  ✓ CHANGELOG.md pushed to GitHub' : '  ⚠ CHANGELOG.md push failed (push manually if needed)')
  }
}

main().catch(err => { console.error(err); process.exit(1) })
