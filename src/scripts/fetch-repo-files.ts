/**
 * fetch-repo-files.ts
 * Fetches all .ts/.tsx/.css/.json files from the client's GitHub repo
 * and writes them to designs/[client-slug]/scaffold/ for local editing.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json src/scripts/fetch-repo-files.ts \
 *     --client-slug <slug>
 *   OR
 *   npx ts-node --project tsconfig.json src/scripts/fetch-repo-files.ts \
 *     --repo AkinYavuz1/nith-client-website
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
const repoArg = getArg('--repo')

if (!clientSlug && !repoArg) {
  console.error('Usage: fetch-repo-files.ts --client-slug <slug> OR --repo owner/repo')
  process.exit(1)
}

if (!GITHUB_TOKEN) {
  console.error('GITHUB_TOKEN not found in .env.local')
  process.exit(1)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface TreeItem {
  type: string
  path: string
  sha: string
}

interface FileData {
  content: string
}

async function getRepoTree(repoFullName: string): Promise<TreeItem[]> {
  const res = await fetch(
    `https://api.github.com/repos/${repoFullName}/git/trees/HEAD?recursive=1`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    }
  )
  if (!res.ok) {
    console.error(`Failed to get repo tree: ${res.status} ${await res.text()}`)
    return []
  }
  const data = await res.json() as { tree: TreeItem[] }
  return data.tree || []
}

async function getFileContent(repoFullName: string, filePath: string): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${repoFullName}/contents/${filePath}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    }
  )
  if (!res.ok) return null
  const data = await res.json() as FileData
  if (!data.content) return null
  return Buffer.from(data.content, 'base64').toString('utf-8')
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Determine repo full name
  let repoFullName = repoArg
  let slug = clientSlug

  if (!repoFullName && clientSlug) {
    const provisionPath = path.join(process.cwd(), 'designs', clientSlug, 'provision.json')
    if (!fs.existsSync(provisionPath)) {
      console.error(`provision.json not found at ${provisionPath}`)
      console.error('Either run provision-project.ts first, or use --repo owner/repo directly.')
      process.exit(1)
    }
    const provision = JSON.parse(fs.readFileSync(provisionPath, 'utf-8')) as {
      github_full_name: string
    }
    repoFullName = provision.github_full_name
  }

  if (!slug) {
    slug = repoFullName!.split('/').pop()!.replace(/^nith-/, '')
  }

  console.log(`\nFetching files from ${repoFullName}...`)

  const tree = await getRepoTree(repoFullName!)
  const codeExts = ['.tsx', '.ts', '.css', '.js', '.json', '.mjs', '.mts']
  const codeFiles = tree.filter(f =>
    f.type === 'blob' &&
    codeExts.some(ext => f.path.endsWith(ext)) &&
    !f.path.includes('node_modules') &&
    !f.path.includes('.next')
  )

  console.log(`  Found ${codeFiles.length} code files`)

  const scaffoldDir = path.join(process.cwd(), 'designs', slug!, 'scaffold')
  fs.mkdirSync(scaffoldDir, { recursive: true })

  let fetched = 0
  let failed = 0

  for (const file of codeFiles) {
    const content = await getFileContent(repoFullName!, file.path)
    if (content !== null) {
      const localPath = path.join(scaffoldDir, ...file.path.split('/'))
      fs.mkdirSync(path.dirname(localPath), { recursive: true })
      fs.writeFileSync(localPath, content)
      fetched++
      console.log(`  ✓ ${file.path}`)
    } else {
      failed++
      console.warn(`  ✗ ${file.path}`)
    }
    await sleep(100)
  }

  console.log(`\n${fetched}/${codeFiles.length} files fetched to scaffold/`)
  if (failed > 0) console.warn(`  ${failed} failed`)
  console.log(`Location: ${scaffoldDir}`)
}

main().catch(err => { console.error(err); process.exit(1) })
