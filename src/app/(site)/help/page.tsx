import type { Metadata } from 'next'
import HelpIndexClient from './HelpIndexClient'

export const metadata: Metadata = {
  title: 'Help Centre — Nith Digital Business OS',
  description:
    'Find answers to common questions about the Business OS. Invoicing, expenses, tax calculator, CRM, and more.',
  alternates: { canonical: 'https://nithdigital.uk/help' },
  openGraph: {
    title: 'Help Centre — Nith Digital Business OS',
    description: 'Find answers to common questions about the Business OS. Invoicing, expenses, tax calculator, CRM, and more.',
    url: 'https://nithdigital.uk/help',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Help Centre — Nith Digital Business OS',
    description: 'Find answers about the Business OS: invoicing, expenses, tax, CRM, and more.',
  },
}

export default function HelpPage() {
  return <HelpIndexClient />
}
