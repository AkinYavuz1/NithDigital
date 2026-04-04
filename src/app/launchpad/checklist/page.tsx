import type { Metadata } from 'next'
import ChecklistClient from './ChecklistClient'

export const metadata: Metadata = {
  title: 'Business Startup Checklist — Step-by-Step Guide for Scottish Sole Traders',
  description:
    'Interactive 10-step checklist for new sole traders in Scotland. Insurance, HMRC registration, bank accounts, ICO, tax, marketing. Save your progress.',
  alternates: { canonical: 'https://nithdigital.uk/launchpad/checklist' },
  openGraph: {
    title: 'Business Startup Checklist — Step-by-Step Guide for Scottish Sole Traders',
    description: 'Interactive 10-step checklist for new sole traders in Scotland. Save your progress.',
    url: 'https://nithdigital.uk/launchpad/checklist',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Startup Checklist — Step-by-Step Guide for Scottish Sole Traders',
    description: 'Interactive 10-step checklist for new sole traders in Scotland.',
  },
}

export default function ChecklistPage() {
  return <ChecklistClient />
}
