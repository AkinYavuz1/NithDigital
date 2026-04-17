'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { ChevronRight } from 'lucide-react'

interface Article {
  id: string; slug: string; title: string; content: string; sort_order: number
}

const CATEGORY_INFO: Record<string, { label: string; desc: string }> = {
  'getting-started': { label: 'Getting Started', desc: 'Everything you need to set up your account and start using Business OS.' },
  'launchpad': { label: 'Launchpad', desc: 'How the checklist works and how to make the most of your free Launchpad.' },
  'invoicing': { label: 'Invoicing', desc: 'Creating, sending, and managing your invoices.' },
  'expenses': { label: 'Expenses', desc: 'Logging expenses, understanding allowable deductions, and categorisation.' },
  'clients': { label: 'Clients', desc: 'Managing your client list and invoice history.' },
  'tax': { label: 'Tax', desc: 'Using the tax estimator and understanding National Insurance.' },
  'mileage': { label: 'Mileage', desc: 'Tracking business journeys and HMRC mileage rates.' },
  'quotes': { label: 'Quotes', desc: 'Creating quotes and converting them to invoices.' },
  'reports': { label: 'Reports', desc: 'Generating financial reports and summaries.' },
  'account': { label: 'Account', desc: 'Managing your profile and subscription settings.' },
  'billing': { label: 'Billing', desc: 'Payments, the Startup Bundle, and your subscription.' },
  'booking': { label: 'Booking', desc: 'Booking and managing consultations.' },
  'troubleshooting': { label: 'Troubleshooting', desc: 'Solutions to common issues.' },
}

export default function HelpCategoryContent() {
  const params = useParams()
  const category = params.category as string
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const info = CATEGORY_INFO[category]

  useEffect(() => {
    if (!category) return
    const supabase = createClient()
    supabase
      .from('help_articles')
      .select('id, slug, title, content, sort_order')
      .eq('category', category)
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => { setArticles(data || []); setLoading(false) })
  }, [category])

  return (
    <>
      <section style={{ background: '#1A1A1A', padding: '48px 24px 36px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(250,248,245,0.5)', marginBottom: 14, flexWrap: 'wrap' }}>
            <Link href="/help" style={{ color: '#E85D3A', textDecoration: 'none' }}>Help Centre</Link>
            <ChevronRight size={12} />
            <span style={{ color: '#FAF8F5' }}>{info?.label || category}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: '#FAF8F5', fontWeight: 400, marginBottom: 8 }}>
            {info?.label || category}
          </h1>
          {info?.desc && <p style={{ fontSize: 15, color: 'rgba(250,248,245,0.7)' }}>{info.desc}</p>}
        </div>
      </section>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 80px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#7A7A7A', fontSize: 14 }}>Loading...</div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p style={{ color: '#7A7A7A', fontSize: 14 }}>No articles in this category yet.</p>
            <Link href="/help" style={{ color: '#E85D3A', fontSize: 13 }}>← Back to Help Centre</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {articles.map(a => (
              <Link key={a.id} href={`/help/${a.slug}`} style={{ textDecoration: 'none' }}>
                <div className="help-cat-row" style={{ padding: '18px 20px', background: '#fff', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>{a.title}</div>
                    <div style={{ fontSize: 13, color: '#7A7A7A', lineHeight: 1.6 }}>{a.content.replace(/[#*`_]/g, '').trim().slice(0, 100)}...</div>
                  </div>
                  <span style={{ fontSize: 13, color: '#E85D3A', fontWeight: 500, flexShrink: 0, marginTop: 2 }}>Read →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Link href="/help" style={{ fontSize: 13, color: '#7A7A7A' }}>← Back to all categories</Link>
        </div>
      </div>
      <style>{`.help-cat-row:hover { border-color: rgba(232,93,58,0.4); }`}</style>
    </>
  )
}
