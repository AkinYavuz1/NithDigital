/**
 * check-deploy.js
 * Polls Vercel until the latest deployment is READY or ERROR.
 *
 * Usage:
 *   node src/scripts/check-deploy.js --client-slug <slug>
 *   OR
 *   node src/scripts/check-deploy.js --project-id <vercel_project_id>
 */

const fs = require('fs')
const path = require('path')

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

const VERCEL_TOKEN = process.env.VERCEL_TOKEN

const args = process.argv.slice(2)
const getArg = (flag) => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : undefined
}

const clientSlug = getArg('--client-slug')
const projectIdArg = getArg('--project-id')
const pingLive = args.includes('--ping-live')

if (!clientSlug && !projectIdArg) {
  console.error('Usage: check-deploy.js --client-slug <slug> OR --project-id <id> [--ping-live]')
  process.exit(1)
}

if (!VERCEL_TOKEN) {
  console.error('VERCEL_TOKEN not found in .env.local')
  process.exit(1)
}

async function getProjectId() {
  if (projectIdArg) return projectIdArg
  const provisionPath = path.join(process.cwd(), 'designs', clientSlug, 'provision.json')
  if (!fs.existsSync(provisionPath)) {
    console.error(`provision.json not found at ${provisionPath}`)
    process.exit(1)
  }
  const provision = JSON.parse(fs.readFileSync(provisionPath, 'utf-8'))
  return provision.vercel_project
}

async function getLatestDeployment(projectId) {
  const res = await fetch(
    `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1`,
    { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.deployments?.[0] || null
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function pingLiveUrl() {
  if (!clientSlug) { console.error('--ping-live requires --client-slug'); process.exit(1) }
  const provisionPath = path.join(process.cwd(), 'designs', clientSlug, 'provision.json')
  if (!fs.existsSync(provisionPath)) {
    console.error('provision.json not found'); process.exit(1)
  }
  const provision = JSON.parse(fs.readFileSync(provisionPath, 'utf-8'))
  const liveUrl = provision.live_url || provision.staging_url
  if (!liveUrl) { console.error('No live_url or staging_url in provision.json'); process.exit(1) }

  console.log(`\nChecking uptime: ${liveUrl}`)
  try {
    const res = await fetch(liveUrl, {
      headers: { 'User-Agent': 'NithDigitalMonitor/1.0' },
      redirect: 'follow',
    })
    if (res.status === 200) {
      console.log(`  ✓ UP — HTTP ${res.status}`)
    } else {
      console.error(`  ✗ DOWN — HTTP ${res.status}`)
      process.exit(1)
    }
  } catch (err) {
    console.error(`  ✗ UNREACHABLE — ${err}`)
    process.exit(1)
  }
}

async function main() {
  // --ping-live mode: just check if the live site is up
  if (pingLive) { await pingLiveUrl(); return }

  const projectId = await getProjectId()
  if (!projectId) {
    console.error('No Vercel project ID found. Was the project provisioned?')
    process.exit(1)
  }

  console.log(`\nMonitoring deployment for project: ${projectId}`)
  console.log('Polling every 10 seconds (timeout: 5 minutes)...\n')

  const maxAttempts = 30
  let attempts = 0
  let consecutiveQueued = 0
  let lastState = ''

  while (attempts < maxAttempts) {
    attempts++
    const deployment = await getLatestDeployment(projectId)

    if (!deployment) {
      console.log(`  [${attempts}/${maxAttempts}] No deployment found yet...`)
      await sleep(10000)
      continue
    }

    const state = deployment.state || deployment.readyState
    const url = deployment.url ? `https://${deployment.url}` : 'unknown'

    // Only log when state changes (less noise)
    if (state !== lastState) {
      console.log(`  [${attempts}/${maxAttempts}] State: ${state} — ${deployment.url || ''}`)
      lastState = state
    } else {
      process.stdout.write('.')
    }

    // Track consecutive QUEUED states
    if (state === 'QUEUED') {
      consecutiveQueued++
      if (consecutiveQueued === 6) {
        console.log('\n  ⚠ Still queued after 60s — Vercel may be congested or the GitHub push')
        console.log('    hasn\'t registered yet. Check the Vercel dashboard if this persists.')
      }
    } else {
      consecutiveQueued = 0
    }

    if (state === 'READY') {
      console.log(`\n\n✓ Deployment READY!`)
      console.log(`  URL: ${url}`)

      // Update provision.json with the actual deployment URL if client-slug provided
      if (clientSlug) {
        const provisionPath = path.join(process.cwd(), 'designs', clientSlug, 'provision.json')
        if (fs.existsSync(provisionPath)) {
          const provision = JSON.parse(fs.readFileSync(provisionPath, 'utf-8'))
          provision.latest_deploy_url = url
          provision.last_deployed_at = new Date().toISOString()
          fs.writeFileSync(provisionPath, JSON.stringify(provision, null, 2))
        }
      }
      return
    }

    if (state === 'ERROR' || state === 'CANCELED') {
      console.error(`\n\n✗ Deployment ${state}`)
      if (deployment.errorMessage) console.error(`  Error: ${deployment.errorMessage}`)
      console.error('  Check Vercel dashboard for build logs.')
      process.exit(1)
    }

    await sleep(10000)
  }

  console.warn('\n\n⚠ Timeout: deployment not ready after 5 minutes.')
  console.warn('Check Vercel dashboard manually.')
  process.exit(1)
}

main().catch(err => { console.error(err); process.exit(1) })
