const GITHUB_TOKEN = process.env.GITHUB_TOKEN

export async function pushFileToGithub(
  repoFullName: string,
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<boolean> {
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString('base64'),
  }
  if (sha) body.sha = sha

  const res = await fetch(
    `https://api.github.com/repos/${repoFullName}/contents/${path}`,
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

export async function getFileSha(repoFullName: string, path: string): Promise<string | undefined> {
  const res = await fetch(
    `https://api.github.com/repos/${repoFullName}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    }
  )
  if (!res.ok) return undefined
  const data = await res.json()
  return data.sha
}

export async function getRepoFiles(repoFullName: string): Promise<Record<string, string>> {
  // Get the tree of all files
  const treeRes = await fetch(
    `https://api.github.com/repos/${repoFullName}/git/trees/HEAD?recursive=1`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    }
  )
  if (!treeRes.ok) return {}
  const tree = await treeRes.json()

  const files: Record<string, string> = {}
  const codeFiles = (tree.tree || []).filter((f: { type: string; path: string }) =>
    f.type === 'blob' && (f.path.endsWith('.tsx') || f.path.endsWith('.ts') || f.path.endsWith('.css'))
  )

  for (const file of codeFiles) {
    const res = await fetch(
      `https://api.github.com/repos/${repoFullName}/contents/${file.path}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
        },
      }
    )
    if (res.ok) {
      const data = await res.json()
      if (data.content) {
        files[file.path] = Buffer.from(data.content, 'base64').toString('utf-8')
      }
    }
  }

  return files
}
