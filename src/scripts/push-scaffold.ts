/**
 * push-scaffold.ts
 * Reads all files from designs/[client-slug]/scaffold/ and pushes them to
 * the client's GitHub repo via the GitHub API.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json src/scripts/push-scaffold.ts \
 *     --client-slug <slug> [--files file1,file2]
 *
 * --files (optional): comma-separated list of relative paths to push only those files
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

// ─── Args ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const getArg = (flag: string): string | undefined => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : undefined
}

const clientSlug = getArg('--client-slug')
const filesFilter = getArg('--files')?.split(',').map(f => f.trim())

if (!clientSlug) {
  console.error('Usage: push-scaffold.ts --client-slug <slug> [--files file1,file2]')
  process.exit(1)
}

if (!GITHUB_TOKEN) {
  console.error('GITHUB_TOKEN not found in .env.local')
  process.exit(1)
}

// ─── GitHub helpers ───────────────────────────────────────────────────────────

async function getFileSha(repoFullName: string, filePath: string): Promise<string | undefined> {
  const res = await fetch(
    `https://api.github.com/repos/${repoFullName}/contents/${filePath}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    }
  )
  if (!res.ok) return undefined
  const data = await res.json() as { sha: string }
  return data.sha
}

async function pushFile(
  repoFullName: string,
  filePath: string,
  content: string,
  message: string
): Promise<boolean> {
  const sha = await getFileSha(repoFullName, filePath)
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString('base64'),
  }
  if (sha) body.sha = sha

  const res = await fetch(
    `https://api.github.com/repos/${repoFullName}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify(body),
    }
  )
  return res.ok
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ─── Collect scaffold files ───────────────────────────────────────────────────

function walkDir(dir: string, baseDir: string): string[] {
  const results: string[] = []
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      results.push(...walkDir(fullPath, baseDir))
    } else {
      results.push(path.relative(baseDir, fullPath).replace(/\\/g, '/'))
    }
  }
  return results
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const designsDir = path.join(process.cwd(), 'designs', clientSlug!)
  const scaffoldDir = path.join(designsDir, 'scaffold')
  const provisionPath = path.join(designsDir, 'provision.json')

  if (!fs.existsSync(provisionPath)) {
    console.error(`provision.json not found at ${provisionPath}`)
    console.error('Run provision-project.ts first.')
    process.exit(1)
  }

  if (!fs.existsSync(scaffoldDir)) {
    console.error(`scaffold/ directory not found at ${scaffoldDir}`)
    console.error('Write your Next.js files to the scaffold/ directory first.')
    process.exit(1)
  }

  const provision = JSON.parse(fs.readFileSync(provisionPath, 'utf-8')) as {
    github_full_name: string
    repo_name: string
  }
  const { github_full_name } = provision

  console.log(`\nPushing scaffold to ${github_full_name}...`)

  // Collect all files
  let allFiles = walkDir(scaffoldDir, scaffoldDir)

  // Apply filter if provided
  if (filesFilter && filesFilter.length > 0) {
    allFiles = allFiles.filter(f => filesFilter.includes(f))
    console.log(`  Filtering to ${filesFilter.length} specific file(s)`)
  }

  if (allFiles.length === 0) {
    console.error('No files found in scaffold/ directory')
    process.exit(1)
  }

  console.log(`  Files to push: ${allFiles.length}`)

  let pushed = 0
  let failed = 0
  const failedFiles: string[] = []

  for (const relPath of allFiles) {
    const fullPath = path.join(scaffoldDir, relPath)
    const content = fs.readFileSync(fullPath, 'utf-8')
    const ok = await pushFile(
      github_full_name,
      relPath,
      content,
      `chore: add ${relPath} — Nith Digital scaffold`
    )

    if (ok) {
      pushed++
      console.log(`  ✓ ${relPath}`)
    } else {
      failed++
      failedFiles.push(relPath)
      console.warn(`  ✗ ${relPath} (failed)`)
    }

    // 150ms delay between pushes to respect GitHub rate limits
    await sleep(150)
  }

  // Save result
  const resultPath = path.join(designsDir, 'scaffold-result.json')
  fs.writeFileSync(resultPath, JSON.stringify({
    github_full_name,
    pushed_at: new Date().toISOString(),
    total: allFiles.length,
    pushed,
    failed,
    failed_files: failedFiles,
    files: allFiles,
  }, null, 2))

  console.log(`\n${pushed}/${allFiles.length} files pushed to GitHub`)
  if (failed > 0) {
    console.warn(`Failed: ${failedFiles.join(', ')}`)
  }
  console.log(`Result saved to: ${resultPath}`)
  console.log(`\nVercel will auto-deploy from the GitHub push.`)
  console.log(`Run check-deploy.js to monitor deployment status.`)
}

main().catch(err => { console.error(err); process.exit(1) })
