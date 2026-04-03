import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import HelpArticleClient from './HelpArticleClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('help_articles').select('title, content').eq('slug', slug).single()
  return {
    title: data ? `${data.title} — Help Centre` : 'Help Article — Nith Digital',
    description: data?.content?.slice(0, 160).replace(/[#*`]/g, '') || '',
  }
}

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

export default async function HelpArticlePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  const { data: article } = await supabase
    .from('help_articles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!article) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 640, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#1B2A4A' }}>Article not found</h1>
          <Link href="/help" style={{ color: '#D4A84B', fontSize: 14 }}>← Back to Help Centre</Link>
        </div>
        <Footer />
      </>
    )
  }

  const { data: related } = await supabase
    .from('help_articles')
    .select('id, slug, title, content')
    .eq('category', article.category)
    .eq('published', true)
    .neq('id', article.id)
    .limit(3)

  return (
    <>
      <Navbar />
      <HelpArticleClient
        article={article}
        related={related || []}
        categoryLabel={CATEGORY_LABELS[article.category] || article.category}
      />
      <Footer />
    </>
  )
}
