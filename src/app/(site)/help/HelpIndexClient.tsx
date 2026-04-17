'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Rocket, CheckCircle2, FileText, Receipt, Users, Calculator,
  Car, ClipboardList, BarChart3, Settings, CreditCard, Calendar,
  AlertCircle, Search, HelpCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface Article {
  id: string
  slug: string
  title: string
  content: string
  category: string
}

const CATEGORIES = [
  { id: 'getting-started', label: 'Getting Started', icon: Rocket, desc: 'Set up your account and get going' },
  { id: 'launchpad', label: 'Launchpad', icon: CheckCircle2, desc: 'Checklist questions and progress' },
  { id: 'invoicing', label: 'Invoicing', icon: FileText, desc: 'Creating, sending, and PDF invoices' },
  { id: 'expenses', label: 'Expenses', icon: Receipt, desc: 'Logging, categories, allowable expenses' },
  { id: 'clients', label: 'Clients', icon: Users, desc: 'CRM and managing contacts' },
  { id: 'tax', label: 'Tax', icon: Calculator, desc: 'Estimator and self-assessment' },
  { id: 'mileage', label: 'Mileage', icon: Car, desc: 'Tracking journeys and HMRC rates' },
  { id: 'quotes', label: 'Quotes', icon: ClipboardList, desc: 'Creating and converting quotes' },
  { id: 'reports', label: 'Reports', icon: BarChart3, desc: 'Generating and exporting reports' },
  { id: 'account', label: 'Account', icon: Settings, desc: 'Profile and subscription settings' },
  { id: 'billing', label: 'Billing', icon: CreditCard, desc: 'Payments and bundle' },
  { id: 'booking', label: 'Booking', icon: Calendar, desc: 'Booking consultations' },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertCircle, desc: 'Common issues' },
]

export default function HelpIndexClient() {
  const [articles, setArticles] = useState<Article[]>([])
  const [search, setSearch] = useState('')
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const supabase = createClient()
    supabase.from('help_articles').select('id, slug, title, content, category').eq('published', true).then(({ data }) => {
      if (data) {
        setArticles(data)
        const c: Record<string, number> = {}
        data.forEach((a: Article) => { c[a.category] = (c[a.category] || 0) + 1 })
        setCounts(c)
      }
    })
  }, [])

  const searchResults = search.length >= 2
    ? articles.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.content.toLowerCase().includes(search.toLowerCase())
      )
    : []

  return (
    <>
      {/* Hero */}
      <section style={{ background: '#1A1A1A', padding: '64px 24px 48px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#FAF8F5', fontWeight: 400, marginBottom: 12 }}>
            Help Centre
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.7)', marginBottom: 28 }}>
            Find answers to common questions about the Business OS
          </p>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto' }}>
            <Search size={16} color="rgba(250,248,245,0.4)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for help..."
              style={{
                width: '100%', padding: '13px 16px 13px 40px', borderRadius: 8, border: 'none',
                fontSize: 15, color: '#1A1A1A', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px' }}>

        {/* Search Results */}
        {search.length >= 2 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A', marginBottom: 16 }}>
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
            </h2>
            {searchResults.length === 0 ? (
              <p style={{ color: '#7A7A7A', fontSize: 14 }}>No articles found. Try a different search term.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {searchResults.map(a => (
                  <Link key={a.id} href={`/help/${a.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#fff', borderRadius: 8, padding: '14px 18px', border: '1px solid rgba(0,0,0,0.08)', transition: 'border-color 0.2s' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>{a.title}</div>
                      <div style={{ fontSize: 12, color: '#7A7A7A' }}>{a.content.replace(/#+\s*/g, '').slice(0, 120)}...</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Grid */}
        {search.length < 2 && (
          <>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#1A1A1A', marginBottom: 24, fontWeight: 400 }}>Browse by category</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 56 }} className="help-grid">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon
                return (
                  <Link key={cat.id} href={`/help/category/${cat.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#fff', borderRadius: 10, padding: '20px 22px',
                      border: '1px solid rgba(0,0,0,0.08)', transition: 'box-shadow 0.2s, transform 0.2s',
                      display: 'flex', alignItems: 'flex-start', gap: 14,
                    }}
                    className="help-cat-card"
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} color="#1A1A1A" />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 3 }}>{cat.label}</div>
                        <div style={{ fontSize: 12, color: '#7A7A7A', marginBottom: 4 }}>{cat.desc}</div>
                        <div style={{ fontSize: 11, color: '#E85D3A', fontWeight: 500 }}>{counts[cat.id] || 0} articles</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Popular articles */}
            {articles.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#1A1A1A', marginBottom: 20, fontWeight: 400 }}>Popular articles</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {articles.slice(0, 5).map(a => (
                    <Link key={a.id} href={`/help/${a.slug}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        background: '#fff', borderRadius: 8, padding: '14px 18px',
                        border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 12,
                        transition: 'border-color 0.2s',
                      }}
                      className="help-article-row"
                      >
                        <HelpCircle size={14} color="#E85D3A" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: 14, color: '#1A1A1A', fontWeight: 500 }}>{a.title}</span>
                        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#E85D3A', fontWeight: 500, flexShrink: 0 }}>Read →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{ marginTop: 56, background: '#1A1A1A', borderRadius: 12, padding: '40px 32px', textAlign: 'center', color: '#FAF8F5' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 10 }}>Can&apos;t find what you need?</h3>
              <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.65)', marginBottom: 20 }}>Book a free call and we&apos;ll walk you through it.</p>
              <Link href="/book" style={{ display: 'inline-block', padding: '11px 28px', background: '#E85D3A', color: '#1A1A1A', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                Book a free call →
              </Link>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) { .help-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 580px) { .help-grid { grid-template-columns: 1fr !important; } }
        .help-cat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); transform: translateY(-1px); }
        .help-article-row:hover { border-color: rgba(232,93,58,0.4); }
      `}</style>
    </>
  )
}
