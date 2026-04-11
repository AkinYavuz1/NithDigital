import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const VERCEL_TOKEN = process.env.VERCEL_TOKEN
const GITHUB_ORG = process.env.GITHUB_ORG || 'AkinYavuz1'

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)
}

async function createGithubRepo(repoName: string): Promise<{ url: string; full_name: string } | null> {
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
    console.error('GitHub create repo error:', err)
    return null
  }
  const data = await res.json()
  return { url: data.html_url, full_name: data.full_name }
}

async function createVercelProject(
  repoName: string,
  repoFullName: string
): Promise<{ id: string; url: string } | null> {
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
    console.error('Vercel create project error:', err)
    return null
  }
  const data = await res.json()
  return {
    id: data.id,
    url: `https://${repoName}.vercel.app`,
  }
}

export async function POST(req: NextRequest) {
  const { project_name, client_name } = await req.json()

  if (!project_name || !client_name) {
    return NextResponse.json({ error: 'project_name and client_name required' }, { status: 400 })
  }

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 })
  }

  const repoName = `nith-${slugify(client_name)}-${slugify(project_name)}`.slice(0, 50)

  // Create GitHub repo
  const github = await createGithubRepo(repoName)
  if (!github) {
    return NextResponse.json({ error: 'Failed to create GitHub repository' }, { status: 500 })
  }

  // Create Vercel project (linked to GitHub repo)
  let vercel = null
  if (VERCEL_TOKEN) {
    vercel = await createVercelProject(repoName, github.full_name)
  }

  return NextResponse.json({
    repo_name: repoName,
    github_url: github.url,
    github_full_name: github.full_name,
    vercel_project: vercel?.id || null,
    staging_url: vercel?.url || null,
  })
}
