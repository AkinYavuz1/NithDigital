import type { Metadata } from 'next'
import { DemoDataProvider } from '@/lib/demo-context'
import DemoSidebar from './DemoSidebar'
import DemoTopBar from './DemoTopBar'
import DemoBanner from './DemoBanner'

export const metadata: Metadata = {
  title: 'Business OS Demo — Nith Digital',
  description: 'Try the Nith Digital Business OS — free interactive demo. Invoicing, expenses, CRM, tax calculator for Scottish sole traders. No account required.',
  robots: 'index, follow',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Nith Digital Business OS',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'All-in-one business management tool for Scottish sole traders. Invoicing, expenses, mileage tracking, tax estimator, CRM, and more.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP', description: 'Free tier available' },
  url: 'https://nithdigital.uk/os/demo',
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoDataProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F0E6' }}>
        <DemoSidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <DemoTopBar />
          <DemoBanner />
          {children}
        </div>
      </div>
    </DemoDataProvider>
  )
}
