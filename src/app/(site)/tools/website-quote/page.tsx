import type { Metadata } from 'next'
import WebsiteQuoteClient from './WebsiteQuoteClient'

export const metadata: Metadata = {
  title: 'How Much Does a Website Cost? Free Instant Quote Calculator | Nith Digital',
  description:
    'Get an instant estimate for your business website. Answer 6 questions and receive a ballpark price range. No signup, no obligation.',
  keywords: 'how much does a website cost UK, website cost calculator, website quote, website price UK',
  alternates: { canonical: 'https://nithdigital.uk/tools/website-quote' },
  openGraph: {
    title: 'How Much Does a Website Cost? Free Instant Quote Calculator',
    description: 'Get an instant estimate for your business website. No signup, no obligation.',
    url: 'https://nithdigital.uk/tools/website-quote',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How Much Does a Website Cost? Free Instant Quote',
    description: 'Get an instant estimate for your business website. No signup.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Website Cost Calculator UK',
  description: 'Get an instant estimate for your business website. Answer 6 questions and receive a ballpark price range.',
  url: 'https://nithdigital.uk/tools/website-quote',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
  provider: { '@type': 'Organization', name: 'Nith Digital', url: 'https://nithdigital.uk' },
}

export default function WebsiteQuotePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WebsiteQuoteClient />
    </>
  )
}
