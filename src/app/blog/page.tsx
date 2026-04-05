
import type { Metadata } from 'next'
import BlogListClient from './BlogListClient'

export const metadata: Metadata = {
  title: 'Blog — Business Guides for D&G Sole Traders | Nith Digital',
  description:
    'Practical guides for starting and growing a business in Dumfries & Galloway. Tax, marketing, websites, SEO, and more.',
  alternates: { canonical: 'https://nithdigital.uk/blog' },
  openGraph: {
    title: 'Blog — Business Guides for D&G Sole Traders | Nith Digital',
    description: 'Practical guides for starting and growing a business in Dumfries & Galloway.',
    url: 'https://nithdigital.uk/blog',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Business Guides for D&G Sole Traders | Nith Digital',
    description: 'Practical guides for starting and growing a business in Dumfries & Galloway.',
  },
}

export default function BlogPage() {
  return <BlogListClient />
}
