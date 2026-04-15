/**
 * run-pipeline.ts
 * Master orchestrator for the Nith Digital 6-stage website pipeline.
 *
 * Chains all automatable stages back-to-back. Pauses at three human gates:
 *   Gate 1 — Brief Q&A (Stage 1)
 *   Gate 2 — Design approval (Stage 2)
 *   Gate 3 — Staging review + client approval (Stage 5)
 *
 * Saves progress to pipeline-state.json so any interruption can be resumed.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json src/scripts/run-pipeline.ts \
 *     --client-slug my-client [--client-name "Full Name"] \
 *     [--existing-url https://old-site.co.uk] [--stage 3]
 *
 * Resume from a specific stage:
 *   ... --stage 4
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

function bail(msg: string): never {
  console.error(msg)
  process.exit(1)
}

const clientSlug   = getArg('--client-slug') ?? bail('Usage: run-pipeline.ts --client-slug <slug> [--client-name "Name"] [--existing-url URL] [--stage N]')
const clientName   = getArg('--client-name')
const existingUrl  = getArg('--existing-url')
const startStageRaw = parseInt(getArg('--stage') || '1', 10)

// ─── Backward compatibility: map old stage numbers to new ─────────────────────

function migrateStage(n: number): number {
  // Old 12-stage pipeline → new 6-stage pipeline
  if (n <= 3) return 1      // old stages 1-3 → new stage 1 (Discovery)
  if (n <= 5) return 2      // old stages 4-5 → new stage 2 (Design)
  if (n <= 7) return 3      // old stages 6-7 → new stage 3 (Content & Provision)
  if (n <= 9) return 4      // old stages 8-9 → new stage 4 (Build)
  if (n === 95 || n === 97 || n === 10 || n === 11) return 5  // old stages 9.5-11 → new stage 5 (QA + Launch)
  if (n === 12) return 6    // old stage 12 → new stage 6 (Refine)
  return n  // already a new stage number (1-6)
}

const startStage = startStageRaw > 6 ? migrateStage(startStageRaw) : startStageRaw

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
    const state = JSON.parse(fs.readFileSync(stateFile, 'utf-8')) as PipelineState
    // Migrate old stage numbers in completed_stages
    const hasOldStages = state.completed_stages.some(n => n > 6)
    if (hasOldStages) {
      state.completed_stages = [...new Set(state.completed_stages.map(migrateStage))]
    }
    return state
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
  const bar = '='.repeat(44)
  console.log(`\n+${bar}+`)
  console.log(`|  ${title.padEnd(43)}|`)
  console.log(`+${bar}+\n`)
}

function tick(msg: string) { console.log(`  + ${msg}`) }
function info(msg: string) { console.log(`  > ${msg}`) }
function warn(msg: string) { console.log(`  ! ${msg}`) }

// ─── Stage 1: Discovery ──────────────────────────────────────────────────────

async function stage1_discovery(s: PipelineState) {
  if (s.completed_stages.includes(1)) { info('Stage 1 already complete -- skipping'); return }
  header('STAGE 1 -- Discovery (Research + Brief + Design Research)')

  // 1A: Research
  const url = s.existing_url || existingUrl
  if (url) {
    info(`Scraping existing site: ${url}`)
    const ok = tsNode('src/scripts/scrape-existing-site.ts', ['--url', url, '--client-slug', clientSlug])
    if (!ok) { warn('Scrape failed -- continuing without site data') }
    else tick('Site analysis saved')
  } else {
    info('No existing URL -- Claude will run market research')
  }

  // 1B: Brief gathering (human gate)
  console.log('\n  Claude will now ask brief questions about the client.')
  console.log('  Answer each question in the Claude session.\n')

  const briefPath = path.join(designsDir, 'brief.json')
  while (true) {
    const answer = await ask('  Has the brief been completed? (yes / skip): ')
    if (answer === 'skip') break
    if (answer === 'yes' || answer === 'y') {
      if (!fs.existsSync(briefPath)) {
        warn('brief.json not found yet -- check Claude has written it to designs/' + clientSlug + '/brief.json')
        continue
      }
      break
    }
  }
  tick('Brief confirmed')

  // 1C: Design research (Claude runs this)
  console.log('\n  Claude reads the archive, searches design trends, and plans 3 themes.')
  console.log('  Claude must write: designs/' + clientSlug + '/scraped/design-research.json\n')

  const researchPath = path.join(designsDir, 'scraped', 'design-research.json')
  while (true) {
    const answer = await ask('  Has Claude completed design research? (yes): ')
    if (answer !== 'yes' && answer !== 'y') continue
    if (!fs.existsSync(researchPath)) {
      warn('design-research.json not found -- Claude must write it first')
      continue
    }
    break
  }
  tick('Design research confirmed')

  done(s, 1)
  tick('Stage 1 complete')
}

// ─── Stage 2: Design ──────────────────────────────────────────────────────────

async function stage2_design(s: PipelineState) {
  if (s.completed_stages.includes(2)) { info('Stage 2 already complete -- skipping'); return }
  header('STAGE 2 -- Design (Copy + HTML Mockups + Approval)')

  // 2A: Copy generation + 2B: HTML mockups
  console.log('  Claude writes copy.json first, then generates 3 HTML mockups.')
  console.log('  A comparison viewer (design-compare.html) is also generated.\n')

  while (true) {
    const answer = await ask('  Has Claude written copy.json + 3 HTML mockups + design-compare.html? (yes): ')
    if (answer !== 'yes' && answer !== 'y') continue

    const copyPath = path.join(designsDir, 'copy.json')
    if (!fs.existsSync(copyPath)) {
      warn('copy.json not found -- Claude must write it before the HTML mockups')
      continue
    }

    const files = [1, 2, 3].map(n => path.join(designsDir, `design-${n}.html`))
    const missing = files.filter(f => !fs.existsSync(f))
    if (missing.length > 0) {
      warn(`Missing: ${missing.map(f => path.basename(f)).join(', ')}`)
      continue
    }
    break
  }
  tick('Copy + 3 HTML mockups confirmed')

  // 2C: Design approval (human gate)
  console.log(`\n  Open: C:\\nithdigital\\designs\\${clientSlug}\\design-compare.html`)
  console.log('  Compare the 3 designs and choose one.\n')

  let chosen = ''
  while (!['1', '2', '3'].includes(chosen)) {
    chosen = await ask('  Which design do you approve? (1 / 2 / 3): ')
    if (!['1', '2', '3'].includes(chosen)) warn('Enter 1, 2, or 3')
  }

  done(s, 2)
  tick(`Stage 2 complete -- Design ${chosen} approved`)
}

// ─── Stage 3: Content & Provision ──────────────────────────────────────────────

async function stage3_contentProvision(s: PipelineState) {
  if (s.completed_stages.includes(3)) { info('Stage 3 already complete -- skipping'); return }
  header('STAGE 3 -- Content & Provision (Theme + GitHub + Vercel)')

  // 3A: Provision GitHub + Vercel
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

  info(`Creating GitHub repo and Vercel project for "${name}"...`)
  const ok = tsNode('src/scripts/provision-project.ts', ['--client', name, '--project', 'Website'])
  if (!ok) { warn('Provision failed -- check GITHUB_TOKEN and VERCEL_TOKEN in .env.local'); return }

  const provisionPath = path.join(designsDir, 'provision.json')
  if (fs.existsSync(provisionPath)) {
    const p = JSON.parse(fs.readFileSync(provisionPath, 'utf-8'))
    s.staging_url    = p.staging_url   || null
    s.vercel_project = p.vercel_project || null
    s.client_name    = name
    tick(`GitHub repo: ${p.github_full_name}`)
    tick(`Vercel staging: ${p.staging_url}`)
  }

  // 3B: Theme.json confirmation
  const themePath = path.join(designsDir, 'theme.json')
  if (!fs.existsSync(themePath)) {
    info('Tell Claude: "Write theme.json from the approved design"')
    while (true) {
      const answer = await ask('  Has theme.json been written? (yes): ')
      if (answer === 'yes' || answer === 'y') {
        if (fs.existsSync(themePath)) break
        warn('theme.json not found yet')
      }
    }
  }
  tick('theme.json confirmed')

  done(s, 3)
  tick('Stage 3 complete')
}

// ─── Stage 4: Build ──────────────────────────────────────────────────────────

async function stage4_build(s: PipelineState) {
  if (s.completed_stages.includes(4)) { info('Stage 4 already complete -- skipping'); return }
  header('STAGE 4 -- Build (Scaffold + QA + Push + Deploy)')

  const scaffoldDir = path.join(designsDir, 'scaffold')

  console.log('  Claude writes all Next.js files to designs/' + clientSlug + '/scaffold/')
  console.log('  Then runs pre-push QA.\n')

  while (true) {
    const answer = await ask('  Has Claude generated all scaffold files? (yes): ')
    if (answer !== 'yes' && answer !== 'y') continue

    if (!fs.existsSync(scaffoldDir)) {
      warn('scaffold/ directory not found -- Claude must write the files first')
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

  // Pre-push QA
  info('Running pre-push QA...')
  const qaOk = tsNode('src/scripts/qa-checklist.ts', ['--client-slug', clientSlug, '--pre-push'])
  if (!qaOk) {
    warn('Pre-push QA failed -- fix issues before pushing')
    warn('Re-run with --stage 4 after fixes')
    process.exit(1)
  }
  tick('Pre-push QA passed')

  // Push
  info('Pushing scaffold to GitHub...')
  const pushOk = tsNode('src/scripts/push-scaffold.ts', ['--client-slug', clientSlug])
  if (!pushOk) { warn('Push failed -- check GitHub token and try again with --stage 4'); return }

  // Validate push result
  const resultPath = path.join(designsDir, 'scaffold-result.json')
  if (fs.existsSync(resultPath)) {
    try {
      const result = JSON.parse(fs.readFileSync(resultPath, 'utf-8')) as {
        failed: number; failed_files: string[]; pushed: number; total: number
      }
      if (result.failed > 0) {
        warn(`${result.failed}/${result.total} files failed to push: ${result.failed_files.join(', ')}`)
        warn('Fix the issue and retry with --stage 4. Stage NOT marked complete.')
        return
      }
      tick(`All ${result.pushed} files pushed to GitHub`)
    } catch { /* if result file unreadable, proceed */ }
  }

  // Monitor deployment
  info('Polling Vercel... (up to 5 minutes)\n')
  const deployOk = run(['node', 'src/scripts/check-deploy.js', '--client-slug', clientSlug])
  if (!deployOk) { warn('Deployment failed or timed out -- check Vercel dashboard'); return }

  // Re-read staging URL
  const provisionPath = path.join(designsDir, 'provision.json')
  if (fs.existsSync(provisionPath)) {
    const p = JSON.parse(fs.readFileSync(provisionPath, 'utf-8'))
    s.staging_url = p.latest_deploy_url || p.staging_url || s.staging_url
  }

  tick(`Site live at: ${s.staging_url}`)
  done(s, 4)
  tick('Stage 4 complete -- Vercel deployment ready')
}

// ─── Stage 5: QA + Launch ─────────────────────────────────────────────────────

async function stage5_qaLaunch(s: PipelineState) {
  if (s.completed_stages.includes(5)) { info('Stage 5 already complete -- skipping'); return }
  header('STAGE 5 -- QA + Launch (Review + QA + Archive + GSC + Domain)')

  // 5A: Internal review
  console.log(`  Open: ${s.staging_url || 'staging URL'}`)
  console.log('  Quick checklist before showing the client:\n')
  console.log('    [] Hero renders correctly (desktop + mobile)')
  console.log('    [] All pages load without errors')
  console.log('    [] Contact form submits -- check you receive the email')
  console.log('    [] Nav links work')
  console.log('    [] Fonts loaded, animations fire on scroll\n')

  let answer = await ask('  Does the staging site look good? (yes / fix): ')
  if (answer === 'fix' || answer === 'no' || answer === 'n') {
    info('Fix mode -- use Stage 6 refinements. Come back with --stage 5 when ready.')
    process.exit(0)
  }
  tick('Internal review passed')

  // 5B: Client approval
  console.log('\n  Send this to the client:\n')
  console.log('  ----------------------------------------------------------')
  console.log(`  Hi [Name], your new website is ready to preview:`)
  console.log(`  ${s.staging_url || '[staging URL]'}`)
  console.log()
  console.log('  Please review and reply with any feedback by [date + 5 days].')
  console.log('  Once you\'re happy, reply "Approved for launch" and we\'ll')
  console.log('  get it live. Any changes after that are billed at GBP 35/hour.')
  console.log('  ----------------------------------------------------------\n')

  answer = await ask('  Has the client approved for launch? (yes / feedback): ')
  if (answer !== 'yes' && answer !== 'y') {
    info('Apply client feedback via Stage 6, then return with --stage 5')
    process.exit(0)
  }
  tick('Client approved for launch')

  // 5C: Full QA
  const stagingUrl = s.staging_url || await ask('  Staging URL: ')
  info('Running full QA checklist...\n')

  const qaOk = tsNode('src/scripts/qa-checklist.ts', ['--client-slug', clientSlug, '--staging-url', stagingUrl])
  if (!qaOk) {
    warn('QA failed -- fix issues and re-run with --stage 5')
    process.exit(1)
  }
  tick('All QA checks passed')

  // 5D: Archive + GSC
  info('Updating design archive...')
  tsNode('src/scripts/update-archive.ts', ['--client-slug', clientSlug])
  tick('Design archived')

  info('Submitting to Google Search Console...')
  tsNode('src/scripts/submit-gsc.ts', ['--client-slug', clientSlug])
  tick('GSC submission complete')

  done(s, 5)
  tick('Stage 5 complete')
}

// ─── Stage 6: Refine ──────────────────────────────────────────────────────────

async function stage6_refine(s: PipelineState) {
  header('STAGE 6 -- Refine (Post-Launch Changes)')

  console.log('  Tell Claude what to change in the Claude session.')
  console.log('  Claude will:')
  console.log('    1. Fetch current repo files')
  console.log('    2. Edit locally in scaffold/')
  console.log('    3. Push to GitHub')
  console.log('    4. Vercel auto-redeploys\n')
  console.log('  Each change is logged in CHANGELOG.md with hours.')
  console.log('  Rate: GBP 35/hour\n')

  info('Refinement loop active -- run individual commands as needed.')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const s = loadState()
  fs.mkdirSync(designsDir, { recursive: true })

  const bar = '='.repeat(44)
  console.log(`\n+${bar}+`)
  console.log(`|  Nith Digital Pipeline (6-stage)          |`)
  console.log(`|  Client slug : ${clientSlug.padEnd(27)}|`)
  console.log(`|  Starting at : Stage ${String(startStage).padEnd(21)}|`)
  if (s.completed_stages.length > 0) {
    console.log(`|  Completed   : ${s.completed_stages.join(', ').padEnd(27)}|`)
  }
  console.log(`+${bar}+`)

  if (startStage <= 1) await stage1_discovery(s)
  if (startStage <= 2) await stage2_design(s)
  if (startStage <= 3) await stage3_contentProvision(s)
  if (startStage <= 4) await stage4_build(s)
  if (startStage <= 5) await stage5_qaLaunch(s)
  if (startStage <= 6) await stage6_refine(s)

  rl.close()

  header('PIPELINE COMPLETE')
  tick(`Completed stages: ${s.completed_stages.join(', ')}`)
  tick(`Staging URL: ${s.staging_url || 'see provision.json'}`)
  console.log()
  console.log('  Next step: plug in a live domain.')
  console.log()
  console.log('  Option A -- Nith Digital subdomain (instant):')
  console.log(`    npx ts-node --project tsconfig.json src/scripts/launch-domain.ts \\`)
  console.log(`      --client-slug ${clientSlug} --option subdomain`)
  console.log()
  console.log('  Option B -- Custom domain bought by client:')
  console.log(`    npx ts-node --project tsconfig.json src/scripts/launch-domain.ts \\`)
  console.log(`      --client-slug ${clientSlug} --option custom --domain example.com`)
  console.log()
}

main().catch(err => { console.error(err); rl.close(); process.exit(1) })
