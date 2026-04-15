/**
 * run-pipeline.ts
 * Master orchestrator for the full Nith Digital website pipeline.
 *
 * Chains all automatable stages back-to-back. Pauses at three human gates:
 *   Gate 1 — Brief Q&A (Stage 2)
 *   Gate 2 — Design approval (Stage 5)
 *   Gate 3 — Staging review + client approval (Stage 9.5–9.7)
 *
 * Saves progress to pipeline-state.json so any interruption can be resumed.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json src/scripts/run-pipeline.ts \
 *     --client-slug my-client [--client-name "Full Name"] \
 *     [--existing-url https://old-site.co.uk] [--stage 7]
 *
 * Resume from a specific stage:
 *   ... --stage 8
 */

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { spawnSync } from 'child_process'

// ─── Load .env.local ──────────────────────────────────────────────────────────

const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}

// ─── Args ─────────────────────────────────────────────────────────────────────

const rawArgs = process.argv.slice(2)
const getArg = (flag: string) => { const i = rawArgs.indexOf(flag); return i !== -1 ? rawArgs[i + 1] : undefined }

const clientSlug   = getArg('--client-slug')
const clientName   = getArg('--client-name')
const existingUrl  = getArg('--existing-url')
const startStage   = parseInt(getArg('--stage') || '1', 10)

if (!clientSlug) {
  console.error('Usage: run-pipeline.ts --client-slug <slug> [--client-name "Name"] [--existing-url URL] [--stage N]')
  process.exit(1)
}

// ─── State management ─────────────────────────────────────────────────────────

interface PipelineState {
  client_slug: string
  completed_stages: number[]
  started_at: string
  last_updated: string
  client_name: string | null
  existing_url: string | null
  staging_url: string | null
  vercel_project: string | null
  live_url: string | null
}

const designsDir  = path.join(process.cwd(), 'designs', clientSlug)
const stateFile   = path.join(designsDir, 'pipeline-state.json')

function loadState(): PipelineState {
  if (fs.existsSync(stateFile)) {
    return JSON.parse(fs.readFileSync(stateFile, 'utf-8'))
  }
  return {
    client_slug:       clientSlug,
    completed_stages:  [],
    started_at:        new Date().toISOString(),
    last_updated:      new Date().toISOString(),
    client_name:       clientName || null,
    existing_url:      existingUrl || null,
    staging_url:       null,
    vercel_project:    null,
    live_url:          null,
  }
}

function saveState(s: PipelineState) {
  s.last_updated = new Date().toISOString()
  fs.mkdirSync(designsDir, { recursive: true })
  const tmp = stateFile + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(s, null, 2))
  fs.renameSync(tmp, stateFile)
}

function done(s: PipelineState, stage: number) {
  if (!s.completed_stages.includes(stage)) s.completed_stages.push(stage)
  saveState(s)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
function ask(q: string): Promise<string> {
  return new Promise(resolve => rl.question(q, a => resolve(a.trim())))
}

function run(args: string[]): boolean {
  const [cmd, ...rest] = args
  const result = spawnSync(cmd, rest, { stdio: 'inherit', shell: true })
  return (result.status ?? 1) === 0
}

function tsNode(script: string, extraArgs: string[] = []): boolean {
  return run(['npx', 'ts-node', '--project', 'tsconfig.json', script, ...extraArgs])
}

function header(title: string) {
  const bar = '═'.repeat(44)
  console.log(`\n╔${bar}╗`)
  console.log(`║  ${title.padEnd(43)}║`)
  console.log(`╚${bar}╝\n`)
}

function tick(msg: string) { console.log(`  ✓ ${msg}`) }
function info(msg: string) { console.log(`  → ${msg}`) }
function warn(msg: string) { console.log(`  ⚠ ${msg}`) }

// ─── Individual stage runners ─────────────────────────────────────────────────

async function stage1_research(s: PipelineState) {
  if (s.completed_stages.includes(1)) { info('Stage 1 already complete — skipping'); return }
  header('STAGE 1 — Research')

  const url = s.existing_url || existingUrl
  if (url) {
    info(`Scraping existing site: ${url}`)
    const ok = tsNode('src/scripts/scrape-existing-site.ts', ['--url', url, '--client-slug', clientSlug])
    if (!ok) { warn('Scrape failed — continuing without site data'); return }
    tick('Site analysis saved')
  } else {
    info('No existing URL — Claude will run market research in Stage 3')
  }

  done(s, 1)
  tick('Stage 1 complete')
}

async function stage2_brief(s: PipelineState) {
  if (s.completed_stages.includes(2)) { info('Stage 2 already complete — skipping'); return }
  header('STAGE 2 — GATE 1: Brief Gathering')

  console.log('  Claude will now ask brief questions about the client.')
  console.log('  Answer each question in the Claude session, then come back here.\n')
  console.log('  Once brief.json exists, press Enter to continue.\n')

  // Wait for brief.json
  const briefPath = path.join(designsDir, 'brief.json')
  while (true) {
    const answer = await ask('  Has the brief been completed? (yes / skip): ')
    if (answer === 'skip') break
    if (answer === 'yes' || answer === 'y') {
      if (!fs.existsSync(briefPath)) {
        warn('brief.json not found yet — check Claude has written it to designs/' + clientSlug + '/brief.json')
        continue
      }
      break
    }
  }

  done(s, 2)
  tick('Stage 2 complete — brief.json confirmed')
}

async function stage3_designResearch(s: PipelineState) {
  if (s.completed_stages.includes(3)) { info('Stage 3 already complete — skipping'); return }
  header('STAGE 3 — Design Research (Claude)')

  console.log('  Claude reads the archive, searches design trends, and plans 3 themes.')
  console.log('  This runs in the Claude session.\n')
  console.log('  Claude must write: designs/' + clientSlug + '/scraped/design-research.json\n')

  const researchPath = path.join(designsDir, 'scraped', 'design-research.json')
  while (true) {
    const answer = await ask('  Has Claude completed design research? (yes): ')
    if (answer !== 'yes' && answer !== 'y') continue

    if (!fs.existsSync(researchPath)) {
      warn('design-research.json not found — Claude must write it to designs/' + clientSlug + '/scraped/design-research.json first')
      continue
    }
    break
  }

  done(s, 3)
  tick('Stage 3 complete — design-research.json confirmed')
}

async function stage4_htmlMockups(s: PipelineState) {
  if (s.completed_stages.includes(4)) { info('Stage 4 already complete — skipping'); return }
  header('STAGE 4 — HTML Mockups (Claude)')

  console.log('  Claude writes design-1.html, design-2.html, design-3.html.\n')

  while (true) {
    const answer = await ask('  Has Claude written all 3 HTML mockups? (yes): ')
    if (answer !== 'yes' && answer !== 'y') continue

    const files = [1, 2, 3].map(n => path.join(designsDir, `design-${n}.html`))
    const missing = files.filter(f => !fs.existsSync(f))
    if (missing.length > 0) {
      warn(`Missing: ${missing.map(f => path.basename(f)).join(', ')} — please write them first`)
      continue
    }
    break
  }

  done(s, 4)
  tick('Stage 4 complete — 3 HTML mockups confirmed')
}

async function stage5_pdfsAndApproval(s: PipelineState) {
  if (s.completed_stages.includes(5)) { info('Stage 5 already complete — skipping'); return }
  header('STAGE 5 — GATE 2: Design Approval')

  info('Rendering PDFs…')
  const ok = run(['node', 'src/scripts/generate-design-pdf.js', clientSlug])
  if (!ok) warn('PDF rendering had issues — open the HTML files directly in a browser')

  console.log(`\n  PDFs saved to: C:\\nithdigital\\designs\\${clientSlug}\\`)
  console.log('  Open them (or the .html files at 1440px) and choose a design.\n')

  let chosen = ''
  while (!['1', '2', '3'].includes(chosen)) {
    chosen = await ask('  Which design do you approve? (1 / 2 / 3): ')
    if (!['1', '2', '3'].includes(chosen)) warn('Enter 1, 2, or 3')
  }

  // Record approved design in state
  const themePath = path.join(designsDir, 'theme.json')
  if (!fs.existsSync(themePath)) {
    info(`Tell Claude: "Approved design ${chosen} — please write copy.json and theme.json"`)
    await ask('  Press Enter when copy.json and theme.json are written: ')
  }

  done(s, 5)
  tick(`Stage 5 complete — Design ${chosen} approved`)
}

async function stage6_copyAndTheme(s: PipelineState) {
  if (s.completed_stages.includes(6)) { info('Stage 6 already complete — skipping'); return }
  header('STAGE 6 — Copy + Theme (Claude)')

  const copyPath  = path.join(designsDir, 'copy.json')
  const themePath = path.join(designsDir, 'theme.json')

  while (true) {
    if (fs.existsSync(copyPath) && fs.existsSync(themePath)) break
    warn('copy.json and/or theme.json not found yet')
    info('Tell Claude: "Write copy.json and theme.json for ' + clientSlug + '"')
    await ask('  Press Enter when both files exist: ')
  }

  tick('copy.json and theme.json confirmed')
  done(s, 6)
  tick('Stage 6 complete')
}

async function stage7_provision(s: PipelineState) {
  if (s.completed_stages.includes(7)) { info('Stage 7 already complete — skipping'); return }
  header('STAGE 7 — Provision GitHub + Vercel')

  // Try to get client name
  let name = s.client_name || clientName
  if (!name) {
    const briefPath = path.join(designsDir, 'brief.json')
    if (fs.existsSync(briefPath)) {
      try {
        const brief = JSON.parse(fs.readFileSync(briefPath, 'utf-8'))
        name = brief.client_name || null
      } catch { /* ignore */ }
    }
  }
  if (!name) name = await ask('  Client name for repo (e.g. "Apex Electrical"): ')

  info(`Creating GitHub repo and Vercel project for "${name}"…`)
  const ok = tsNode('src/scripts/provision-project.ts', ['--client', name, '--project', 'Website'])
  if (!ok) { warn('Provision failed — check GITHUB_TOKEN and VERCEL_TOKEN in .env.local'); return }

  const provisionPath = path.join(designsDir, 'provision.json')
  if (fs.existsSync(provisionPath)) {
    const p = JSON.parse(fs.readFileSync(provisionPath, 'utf-8'))
    s.staging_url    = p.staging_url   || null
    s.vercel_project = p.vercel_project || null
    s.client_name    = name
    tick(`GitHub repo: ${p.github_full_name}`)
    tick(`Vercel staging: ${p.staging_url}`)
  }

  done(s, 7)
  tick('Stage 7 complete')
}

async function stage8_scaffoldAndPush(s: PipelineState) {
  if (s.completed_stages.includes(8)) { info('Stage 8 already complete — skipping'); return }
  header('STAGE 8 — Generate Scaffold + Push to GitHub')

  const scaffoldDir = path.join(designsDir, 'scaffold')

  console.log('  Claude writes all Next.js files to designs/' + clientSlug + '/scaffold/')
  console.log('  A scaffold-review subagent checks quality gates.\n')

  while (true) {
    const answer = await ask('  Has Claude generated and reviewed all scaffold files? (yes): ')
    if (answer !== 'yes' && answer !== 'y') continue

    if (!fs.existsSync(scaffoldDir)) {
      warn('scaffold/ directory not found — Claude must write the files first')
      continue
    }

    const required = [
      'package.json', 'next.config.ts', 'src/app/layout.tsx',
      'src/app/page.tsx', 'src/app/sitemap.ts', 'src/app/robots.ts',
      'src/components/Navbar.tsx', 'src/components/Footer.tsx',
    ]
    const missing = required.filter(f => !fs.existsSync(path.join(scaffoldDir, ...f.split('/'))))
    if (missing.length > 0) {
      warn(`Missing scaffold files: ${missing.join(', ')}`)
      continue
    }
    break
  }

  info('Pushing scaffold to GitHub…')
  const ok = tsNode('src/scripts/push-scaffold.ts', ['--client-slug', clientSlug])
  if (!ok) { warn('Push failed — check GitHub token and try again with --stage 8'); return }

  // Validate push result — block stage completion if any files failed
  const resultPath = path.join(designsDir, 'scaffold-result.json')
  if (fs.existsSync(resultPath)) {
    try {
      const result = JSON.parse(fs.readFileSync(resultPath, 'utf-8')) as {
        failed: number; failed_files: string[]; pushed: number; total: number
      }
      if (result.failed > 0) {
        warn(`${result.failed}/${result.total} files failed to push: ${result.failed_files.join(', ')}`)
        warn('Fix the issue and retry with --stage 8. Stage NOT marked complete.')
        return
      }
      tick(`All ${result.pushed} files pushed to GitHub`)
    } catch { /* if result file unreadable, proceed */ }
  }

  done(s, 8)
  tick('Stage 8 complete — Vercel is now building')
}

async function stage9_deployment(s: PipelineState) {
  if (s.completed_stages.includes(9)) { info('Stage 9 already complete — skipping'); return }
  header('STAGE 9 — Monitor Vercel Deployment')

  info('Polling Vercel… (up to 5 minutes)\n')
  const ok = run(['node', 'src/scripts/check-deploy.js', '--client-slug', clientSlug])
  if (!ok) { warn('Deployment failed or timed out — check Vercel dashboard'); return }

  // Re-read staging URL (check-deploy.js updates provision.json)
  const provisionPath = path.join(designsDir, 'provision.json')
  if (fs.existsSync(provisionPath)) {
    const p = JSON.parse(fs.readFileSync(provisionPath, 'utf-8'))
    s.staging_url = p.latest_deploy_url || p.staging_url || s.staging_url
  }

  tick(`Site live at: ${s.staging_url}`)
  done(s, 9)
}

async function stage95_akinReview(s: PipelineState) {
  if (s.completed_stages.includes(95)) { info('Stage 9.5 already complete — skipping'); return }
  header('STAGE 9.5 — GATE 3a: Your Internal Review')

  console.log(`  Open: ${s.staging_url || 'staging URL'}`)
  console.log('  Quick checklist before showing the client:\n')
  console.log('    □ Hero renders correctly (desktop + mobile)')
  console.log('    □ All pages load without errors')
  console.log('    □ Contact form submits — check you receive the email')
  console.log('    □ Nav links all work')
  console.log('    □ Fonts loaded correctly\n')
  console.log('  If anything needs fixing: tell Claude what to change,')
  console.log('  then run with --stage 12 to push the fix.\n')

  const answer = await ask('  Does the staging site look good? (yes / fix): ')
  if (answer === 'fix' || answer === 'no' || answer === 'n') {
    info('Fix mode — use Stage 12 refinements. Come back with --stage 95 when ready.')
    process.exit(0)
  }

  done(s, 95)
  tick('Stage 9.5 complete — internal review passed')
}

async function stage97_clientApproval(s: PipelineState) {
  if (s.completed_stages.includes(97)) { info('Stage 9.7 already complete — skipping'); return }
  header('STAGE 9.7 — GATE 3b: Client Staging Approval')

  console.log('  Send this to the client:\n')
  console.log('  ─────────────────────────────────────────────────────────')
  console.log(`  Hi [Name], your new website is ready to preview:`)
  console.log(`  ${s.staging_url || '[staging URL]'}`)
  console.log()
  console.log('  Please review and reply with any feedback by [date + 5 days].')
  console.log('  Once you\'re happy, reply "Approved for launch" and we\'ll')
  console.log('  get it live. Any changes after that are billed at £35/hour.')
  console.log('  ─────────────────────────────────────────────────────────\n')

  const answer = await ask('  Has the client approved for launch? (yes / feedback): ')
  if (answer !== 'yes' && answer !== 'y') {
    info('Apply client feedback via Stage 12, then return with --stage 97')
    process.exit(0)
  }

  done(s, 97)
  tick('Stage 9.7 complete — client approved for launch')
}

async function stage10_qa(s: PipelineState) {
  if (s.completed_stages.includes(10)) { info('Stage 10 already complete — skipping'); return }
  header('STAGE 10 — Automated QA')

  const stagingUrl = s.staging_url || await ask('  Staging URL: ')
  info('Running QA checklist…\n')

  const ok = tsNode('src/scripts/qa-checklist.ts', ['--client-slug', clientSlug, '--staging-url', stagingUrl])

  if (!ok) {
    warn('QA failed — tell Claude which checks failed and fix them')
    warn('Re-run with --stage 10 after fixes are pushed')
    process.exit(1)
  }

  done(s, 10)
  tick('Stage 10 complete — all QA checks passed')
}

async function stage11_archive(s: PipelineState) {
  if (s.completed_stages.includes(11)) { info('Stage 11 already complete — skipping'); return }
  header('STAGE 11 — Update Design Archive')

  const ok = tsNode('src/scripts/update-archive.ts', ['--client-slug', clientSlug])
  if (!ok) { warn('Archive update failed — run manually later'); return }

  done(s, 11)
  tick('Stage 11 complete — design archived for future reference')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const s = loadState()
  fs.mkdirSync(designsDir, { recursive: true })

  const bar = '═'.repeat(44)
  console.log(`\n╔${bar}╗`)
  console.log(`║  Nith Digital Pipeline                     ║`)
  console.log(`║  Client slug : ${clientSlug.padEnd(27)}║`)
  console.log(`║  Starting at : Stage ${String(startStage).padEnd(21)}║`)
  if (s.completed_stages.length > 0) {
    console.log(`║  Completed   : ${s.completed_stages.join(', ').padEnd(27)}║`)
  }
  console.log(`╚${bar}╝`)

  if (startStage <= 1)  await stage1_research(s)
  if (startStage <= 2)  await stage2_brief(s)
  if (startStage <= 3)  await stage3_designResearch(s)
  if (startStage <= 4)  await stage4_htmlMockups(s)
  if (startStage <= 5)  await stage5_pdfsAndApproval(s)
  if (startStage <= 6)  await stage6_copyAndTheme(s)
  if (startStage <= 7)  await stage7_provision(s)
  if (startStage <= 8)  await stage8_scaffoldAndPush(s)
  if (startStage <= 9)  await stage9_deployment(s)
  if (startStage <= 95) await stage95_akinReview(s)
  if (startStage <= 97) await stage97_clientApproval(s)
  if (startStage <= 10) await stage10_qa(s)
  if (startStage <= 11) await stage11_archive(s)

  rl.close()

  header('PIPELINE COMPLETE')
  tick(`Completed stages: ${s.completed_stages.join(', ')}`)
  tick(`Staging URL: ${s.staging_url || 'see provision.json'}`)
  console.log()
  console.log('  Next step: plug in a live domain.')
  console.log()
  console.log('  Option A — Nith Digital subdomain (instant):')
  console.log(`    npx ts-node --project tsconfig.json src/scripts/launch-domain.ts \\`)
  console.log(`      --client-slug ${clientSlug} --option subdomain`)
  console.log()
  console.log('  Option B — Custom domain bought by client:')
  console.log(`    npx ts-node --project tsconfig.json src/scripts/launch-domain.ts \\`)
  console.log(`      --client-slug ${clientSlug} --option custom --domain example.com`)
  console.log()
}

main().catch(err => { console.error(err); rl.close(); process.exit(1) })
