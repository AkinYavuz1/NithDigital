/**
 * provision-project.ts
 * Creates a private GitHub repo under AkinYavuz1 and a linked Vercel project.
 * Replicates /api/provision-website/route.ts for local CLI use.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json src/scripts/provision-project.ts \
 *     --client "Client Name" --project "Project Name"
 */

import * as fs from 'fs'
import * as path from 'path'

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
const VERCEL_TOKEN = process.env.VERCEL_TOKEN

// ─── Args ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const getArg = (flag: string): string | undefined => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : undefined
}

const clientName = getArg('--client')
const projectName = getArg('--project')

if (!clientName || !projectName) {
  console.error('Usage: provision-project.ts --client "Client Name" --project "Project Name"')
  process.exit(1)
}

if (!GITHUB_TOKEN) {
  console.error('GITHUB_TOKEN not found in .env.local')
  process.exit(1)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)
}

// ─── GitHub ───────────────────────────────────────────────────────────────────

async function createGithubRepo(repoName: string): Promise<{ url: string; full_name: string } | null> {
  console.log(`Creating GitHub repo: ${repoName}...`)
  const res = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    },
    body: JSON.stringify({
      name: repoName,
      private: true,
      auto_init: true,
      description: `Website project — created by Nith Digital`,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    // Check if repo already exists
    if (err.includes('already exists') || res.status === 422) {
      console.log(`  Repo already exists — fetching details...`)
      const getRes = await fetch(`https://api.github.com/repos/AkinYavuz1/${repoName}`, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
        },
      })
      if (getRes.ok) {
        const data = await getRes.json() as { html_url: string; full_name: string }
        return { url: data.html_url, full_name: data.full_name }
      }
    }
    console.error('GitHub create repo error:', err)
    return null
  }

  const data = await res.json() as { html_url: string; full_name: string }
  console.log(`  ✓ Repo created: ${data.html_url}`)
  return { url: data.html_url, full_name: data.full_name }
}

// ─── Vercel ───────────────────────────────────────────────────────────────────

async function createVercelProject(
  repoName: string,
  repoFullName: string
): Promise<{ id: string; url: string } | null> {
  if (!VERCEL_TOKEN) {
    console.warn('  VERCEL_TOKEN not set — skipping Vercel project creation')
    return null
  }

  console.log(`Creating Vercel project: ${repoName}...`)
  const res = await fetch('https://api.vercel.com/v10/projects', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: repoName,
      framework: 'nextjs',
      gitRepository: {
        type: 'github',
        repo: repoFullName,
      },
      buildCommand: 'npm run build',
      outputDirectory: '.next',
      installCommand: 'npm install',
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    // Check if project already exists
    if (err.includes('already exists') || res.status === 409) {
      console.log(`  Vercel project already exists`)
      // Try to get the project ID
      const listRes = await fetch(`https://api.vercel.com/v9/projects/${repoName}`, {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      })
      if (listRes.ok) {
        const d = await listRes.json() as { id: string }
        return { id: d.id, url: `https://${repoName}.vercel.app` }
      }
    }
    console.error('Vercel create project error:', err)
    return null
  }

  const data = await res.json() as { id: string }
  const url = `https://${repoName}.vercel.app`
  console.log(`  ✓ Vercel project created: ${url}`)
  return { id: data.id, url }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const clientSlug = slugify(clientName!)
  const projectSlug = slugify(projectName!)
  const repoName = `nith-${clientSlug}-${projectSlug}`.slice(0, 50)

  console.log(`\nProvisioning project...`)
  console.log(`  Client: ${clientName}`)
  console.log(`  Project: ${projectName}`)
  console.log(`  Repo name: ${repoName}`)

  const github = await createGithubRepo(repoName)
  if (!github) {
    console.error('Failed to create GitHub repository')
    process.exit(1)
  }

  const vercel = await createVercelProject(repoName, github.full_name)

  const result = {
    repo_name: repoName,
    github_url: github.url,
    github_full_name: github.full_name,
    vercel_project: vercel?.id || null,
    staging_url: vercel?.url || null,
    provisioned_at: new Date().toISOString(),
  }

  // Save to designs/[client-slug]/provision.json
  const designsDir = path.join(process.cwd(), 'designs', clientSlug)
  fs.mkdirSync(designsDir, { recursive: true })
  const outputPath = path.join(designsDir, 'provision.json')
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2))

  console.log(`\n✓ Provision complete`)
  console.log(`  GitHub: ${github.url}`)
  console.log(`  Staging: ${vercel?.url || 'N/A (Vercel token not set)'}`)
  console.log(`  Saved to: ${outputPath}`)
  console.log(`\n${JSON.stringify(result, null, 2)}`)
}

main().catch(err => { console.error(err); process.exit(1) })
