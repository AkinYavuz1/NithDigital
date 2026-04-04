import type { Metadata } from 'next'
import DemoDashboard from './DemoDashboard'

export const metadata: Metadata = {
  title: 'Try the Business OS — Free Interactive Demo | Nith Digital',
  description:
    'Explore the full Business OS with sample data. Invoicing, expenses, CRM, tax calculator, mileage tracking. No account needed.',
  alternates: { canonical: 'https://nithdigital.uk/os/demo' },
  openGraph: {
    title: 'Try the Business OS — Free Interactive Demo | Nith Digital',
    description: 'Invoicing, expenses, CRM, tax calculator, mileage tracking. No account needed.',
    url: 'https://nithdigital.uk/os/demo',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Try the Business OS — Free Interactive Demo | Nith Digital',
    description: 'Invoicing, expenses, CRM, tax calculator, mileage tracking. No account needed.',
  },
}

export default function DemoDashboardPage() {
  return <DemoDashboard />
}
