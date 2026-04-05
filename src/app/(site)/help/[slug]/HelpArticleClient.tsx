'use client'

import { useState } from 'react'
import Link from 'next/link'
import { marked } from 'marked'
import { ThumbsUp, ThumbsDown, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface Article {
  id: string
  slug: string
  title: string
  content: string
  category: string
  helpful_yes: number
  helpful_no: number
}

interface RelatedArticle {
  id: string
  slug: string
  title: string
  content: string
}

interface Props {
  article: Article
  related: RelatedArticle[]
  categoryLabel: string
}

export default function HelpArticleClient({ article, related, categoryLabel }: Props) {
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null)
  const html = marked(article.content) as string

  async function submitFeedback(type: 'yes' | 'no') {
    if (feedback) return
    setFeedback(type)
    const supabase = createClient()
    await supabase.from('help_articles').update({
      helpful_yes: type === 'yes' ? article.helpful_yes + 1 : article.helpful_yes,
      helpful_no: type === 'no' ? article.helpful_no + 1 : article.helpful_no,
    }).eq('id', article.id)
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#5A6A7A', marginBottom: 28, flexWrap: 'wrap' }}>
        <Link href="/help" style={{ color: '#D4A84B', textDecoration: 'none' }}>Help Centre</Link>
        <ChevronRight size={12} />
        <Link href={`/help/category/${article.category}`} style={{ color: '#D4A84B', textDecoration: 'none' }}>{categoryLabel}</Link>
        <ChevronRight size={12} />
        <span>{article.title}</span>
      </div>

      {/* Article */}
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: '#1B2A4A', fontWeight: 400, marginBottom: 28, lineHeight: 1.3 }}>
        {article.title}
      </h1>

      <div
        className="help-prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Was this helpful? */}
      <div style={{
        marginTop: 56, padding: '24px 28px', borderRadius: 10,
        background: '#F5F0E6', border: '1px solid rgba(27,42,74,0.08)',
        textAlign: 'center',
      }}>
        {feedback ? (
          <p style={{ fontSize: 14, color: '#1B2A4A', fontWeight: 500 }}>Thanks for your feedback!</p>
        ) : (
          <>
            <p style={{ fontSize: 14, color: '#1B2A4A', fontWeight: 500, marginBottom: 14 }}>Was this article helpful?</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => submitFeedback('yes')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px',
                  background: '#1B2A4A', color: '#F5F0E6', borderRadius: 100,
                  border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                }}
              >
                <ThumbsUp size={14} /> Yes, helpful
              </button>
              <button
                onClick={() => submitFeedback('no')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px',
                  background: '#fff', color: '#5A6A7A', borderRadius: 100,
                  border: '1px solid rgba(27,42,74,0.15)', cursor: 'pointer', fontSize: 13,
                }}
              >
                <ThumbsDown size={14} /> Not really
              </button>
            </div>
          </>
        )}
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#1B2A4A', fontWeight: 400, marginBottom: 16 }}>
            Related articles
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {related.map(r => (
              <Link key={r.id} href={`/help/${r.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '14px 18px', background: '#fff', borderRadius: 8,
                  border: '1px solid rgba(27,42,74,0.08)', display: 'flex', alignItems: 'flex-start', gap: 12,
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#1B2A4A', marginBottom: 3 }}>{r.title}</div>
                    <div style={{ fontSize: 12, color: '#5A6A7A' }}>{r.content.replace(/[#*`]/g, '').slice(0, 100)}...</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: '#D4A84B', flexShrink: 0 }}>Read →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{ marginTop: 48, background: '#1B2A4A', borderRadius: 12, padding: '32px', textAlign: 'center', color: '#F5F0E6' }}>
        <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Still need help?</p>
        <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.65)', marginBottom: 20 }}>Book a free call and we&apos;ll walk you through it.</p>
        <Link href="/book" style={{ display: 'inline-block', padding: '10px 28px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          Book a free call →
        </Link>
      </div>

      <style>{`
        .help-prose h2 { font-family: var(--font-display); font-size: 20px; color: #1B2A4A; font-weight: 400; margin: 32px 0 12px; }
        .help-prose h3 { font-size: 16px; font-weight: 600; color: #1B2A4A; margin: 24px 0 10px; }
        .help-prose p { font-size: 15px; line-height: 1.8; color: #1B2A4A; margin-bottom: 16px; }
        .help-prose ul, .help-prose ol { padding-left: 24px; margin-bottom: 16px; }
        .help-prose li { font-size: 15px; line-height: 1.8; color: #1B2A4A; margin-bottom: 6px; }
        .help-prose a { color: #D4A84B; }
        .help-prose code { background: #F5F0E6; padding: 2px 6px; border-radius: 4px; font-size: 13px; font-family: monospace; }
        .help-prose blockquote { border-left: 3px solid #D4A84B; padding: 12px 16px; background: rgba(212,168,75,0.08); border-radius: 0 6px 6px 0; margin: 20px 0; }
        .help-prose strong { font-weight: 700; }
      `}</style>
    </div>
  )
}
