import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getRepoFiles, getFileSha, pushFileToGithub } from '@/lib/github'

function getAnthropic() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) }

export async function POST(req: NextRequest) {
  const anthropic = getAnthropic()
  const { github_full_name, instruction } = await req.json()

  if (!github_full_name || !instruction) {
    return NextResponse.json({ error: 'github_full_name and instruction required' }, { status: 400 })
  }

  // Fetch current scaffold files from GitHub
  let files: Record<string, string> = {}
  try {
    files = await getRepoFiles(github_full_name)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch files from GitHub' }, { status: 500 })
  }

  if (Object.keys(files).length === 0) {
    return NextResponse.json({ error: 'No files found in repository' }, { status: 404 })
  }

  // Format files for Claude
  const formattedFiles = Object.entries(files)
    .map(([path, content]) => `=== ${path} ===\n${content}`)
    .join('\n\n')

  const prompt = `You are modifying a Next.js website scaffold. Below are the current file contents.

The developer's instruction is: "${instruction}"

Return ONLY a JSON object where keys are file paths and values are complete new file contents.
Only include files that need to change. If a file doesn't need to change, omit it entirely.
Return pure JSON only — no markdown, no explanation, no code fences.

Current files:
${formattedFiles.slice(0, 20000)}`

  let changes: Record<string, string> = {}

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/m, '').trim()

    try {
      changes = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: 'Claude returned malformed JSON', raw: cleaned.slice(0, 300) }, { status: 500 })
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Claude API error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  // Push changed files to GitHub
  const results: { path: string; success: boolean }[] = []

  for (const [path, content] of Object.entries(changes)) {
    const sha = await getFileSha(github_full_name, path)
    const ok = await pushFileToGithub(github_full_name, path, content, `refine: ${instruction.slice(0, 60)}`, sha)
    results.push({ path, success: ok })
    await new Promise(r => setTimeout(r, 150))
  }

  return NextResponse.json({
    files_changed: results.filter(r => r.success).map(r => r.path),
    failed: results.filter(r => !r.success).map(r => r.path),
  })
}
