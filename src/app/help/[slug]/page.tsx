import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

import HelpArticleWrapper from './HelpArticleWrapper'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const title = 'Help Article — Nith Digital'
  const description = 'Business OS help centre — guides and support articles.'
  const url = `https://nithdigital.uk/help/${slug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Nith Digital', locale: 'en_GB', type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function HelpArticlePage({ params }: Props) {
  const { slug } = await params
  return (
    <>
      <Navbar />
      <HelpArticleWrapper slug={slug} />
      <Footer />
    </>
  )
}
