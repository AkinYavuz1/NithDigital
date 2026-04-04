'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import HelpArticleClient from './HelpArticleClient'

const CATEGORY_LABELS: Record<string, string> = {
  'getting-started': 'Getting Started',
  'launchpad': 'Launchpad',
  'invoicing': 'Invoicing',
  'expenses': 'Expenses',
  'clients': 'Clients',
  'tax': 'Tax',
  'mileage': 'Mileage',
  'quotes': 'Quotes',
  'reports': 'Reports',
  'account': 'Account',
  'billing': 'Billing',
  'booking': 'Booking',
  'troubleshooting': 'Troubleshooting',
}

export default function HelpArticleContent({ slug }: { slug: string }) {
  const [article, setArticle] = useState<Parameters<typeof HelpArticleClient>[0]['article'] | null>(null)
  const [related, setRelated] = useState<Parameters<typeof HelpArticleClient>[0]['related']>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('help_articles')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(async ({ data: art }) => {
        if (!art) { setNotFound(true); setLoading(false); return }
        const { data: rel } = await supabase
          .from('help_articles')
          .select('id, slug, title, content')
          .eq('category', art.category)
          .eq('published', true)
          .neq('id', art.id)
          .limit(3)
        setArticle(art)
        setRelated(rel || [])
        setLoading(false)
      })
  }, [slug])

  if (loading) return (
    <div style={{ maxWidth: 780, margin: '80px auto', padding: '0 24px', textAlign: 'center', color: '#5A6A7A', fontSize: 14 }}>
      Loading...
    </div>
  )

  if (notFound) return (
    <div style={{ maxWidth: 640, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#1B2A4A' }}>Article not found</h1>
      <Link href="/help" style={{ color: '#D4A84B', fontSize: 14 }}>← Back to Help Centre</Link>
    </div>
  )

  if (!article) return null

  return (
    <HelpArticleClient
      article={article}
      related={related}
      categoryLabel={CATEGORY_LABELS[article.category] || article.category}
    />
  )
}
