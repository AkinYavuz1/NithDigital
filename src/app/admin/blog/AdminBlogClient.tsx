'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface BlogPost {
  id: string
  slug: string
  title: string
  category: string
  published: boolean
  published_at: string | null
  created_at: string
  read_time_minutes: number
}

const CATEGORY_LABELS: Record<string, string> = {
  'starting-a-business': 'Starting a Business',
  'tax-and-finance': 'Tax & Finance',
  'marketing': 'Marketing',
  'websites-and-digital': 'Websites & Digital',
  'tools-and-resources': 'Tools & Resources',
  'local-business': 'Local Business',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminBlogClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  const togglePublished = async (id: string, published: boolean) => {
    const update: { published: boolean; published_at?: string | null } = { published: !published }
    if (!published) update.published_at = new Date().toISOString()
    await supabase.from('blog_posts').update(update).eq('id', id)
    setPosts(p => p.map(post => post.id === id ? { ...post, published: !published, published_at: update.published_at || post.published_at } : post))
  }

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    setDeleting(id)
    await supabase.from('blog_posts').delete().eq('id', id)
    setPosts(p => p.filter(post => post.id !== id))
    setDeleting(null)
  }

  const published = posts.filter(p => p.published).length
  const drafts = posts.filter(p => !p.published).length

  return (
    <div style={{ padding: '32px 40px', flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400 }}>Blog Posts</h1>
          <p style={{ fontSize: 14, color: '#5A6A7A', marginTop: 4 }}>{published} published · {drafts} drafts</p>
        </div>
        <Link href="/admin/blog/new" style={{ padding: '10px 20px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p style={{ color: '#5A6A7A', fontSize: 14, padding: '40px 0', textAlign: 'center' }}>No blog posts yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.08)' }}>
                {['Title', 'Category', 'Status', 'Published', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ fontWeight: 600, color: '#1B2A4A', marginBottom: 2 }}>{post.title}</div>
                    <div style={{ fontSize: 11, color: '#5A6A7A' }}>/blog/{post.slug}</div>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ fontSize: 11, padding: '3px 8px', background: 'rgba(212,168,75,0.15)', color: '#8B6D2B', borderRadius: 4 }}>
                      {CATEGORY_LABELS[post.category] || post.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: post.published ? 'rgba(39,174,96,0.1)' : 'rgba(27,42,74,0.06)', color: post.published ? '#27ae60' : '#5A6A7A' }}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 12px', color: '#5A6A7A', fontSize: 12 }}>
                    {post.published_at ? formatDate(post.published_at) : '—'}
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link href={`/admin/blog/${post.id}/edit`} style={{ padding: '4px 10px', background: 'rgba(27,42,74,0.06)', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: '#1B2A4A' }}>
                        Edit
                      </Link>
                      <button onClick={() => togglePublished(post.id, post.published)} style={{ padding: '4px 10px', background: post.published ? 'rgba(212,168,75,0.12)' : 'rgba(39,174,96,0.1)', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: post.published ? '#8B6D2B' : '#27ae60', fontWeight: 600 }}>
                        {post.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <Link href={`/blog/${post.slug}`} target="_blank" style={{ padding: '4px 10px', background: 'transparent', border: '1px solid rgba(27,42,74,0.12)', borderRadius: 6, fontSize: 11, color: '#5A6A7A' }}>
                        View
                      </Link>
                      <button onClick={() => deletePost(post.id)} disabled={deleting === post.id} style={{ padding: '4px 10px', background: 'rgba(192,57,43,0.08)', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: '#c0392b' }}>
                        {deleting === post.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
