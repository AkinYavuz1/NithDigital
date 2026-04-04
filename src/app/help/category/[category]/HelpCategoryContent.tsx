'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { ChevronRight } from 'lucide-react'

interface Article {
  id: string
  slug: string
  title: string
  content: string
  sort_order: number
}

interface CategoryInfo {
  label: string
  desc: string
}

export default function HelpCategoryContent({ category, categoryInfo }: { category: string; categoryInfo?: CategoryInfo }) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('help_articles')
      .select('id, slug, title, content, sort_order')
      .eq('category', category)
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setArticles(data || [])
        setLoading(false)
      })
  }, [category])

  return (
    <>
      <section style={{ background: '#1B2A4A', padding: '48px 24px 36px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(245,240,230,0.5)', marginBottom: 14, flexWrap: 'wrap' }}>
            <Link href="/help" style={{ color: '#D4A84B', textDecoration: 'none' }}>Help Centre</Link>
            <ChevronRight size={12} />
            <span style={{ color: '#F5F0E6' }}>{categoryInfo?.label || category}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
            {categoryInfo?.label || category}
          </h1>
          {categoryInfo?.desc && <p style={{ fontSize: 15, color: 'rgba(245,240,230,0.7)' }}>{categoryInfo.desc}</p>}
        </div>
      </section>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 80px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#5A6A7A', fontSize: 14 }}>Loading...</div>
        ) : !articles || articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p style={{ color: '#5A6A7A', fontSize: 14 }}>No articles in this category yet.</p>
            <Link href="/help" style={{ color: '#D4A84B', fontSize: 13 }}>← Back to Help Centre</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {articles.map(a => (
              <Link key={a.id} href={`/help/${a.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '18px 20px', background: '#fff', borderRadius: 8,
                  border: '1px solid rgba(27,42,74,0.08)', display: 'flex', alignItems: 'flex-start', gap: 14,
                }}
                className="help-cat-row"
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1B2A4A', marginBottom: 4 }}>{a.title}</div>
                    <div style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.6 }}>
                      {a.content.replace(/[#*`_]/g, '').trim().slice(0, 100)}...
                    </div>
                  </div>
                  <span style={{ fontSize: 13, color: '#D4A84B', fontWeight: 500, flexShrink: 0, marginTop: 2 }}>Read →</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Link href="/help" style={{ fontSize: 13, color: '#5A6A7A' }}>← Back to all categories</Link>
        </div>
      </div>

      <style>{`.help-cat-row:hover { border-color: rgba(212,168,75,0.4); }`}</style>
    </>
  )
}
