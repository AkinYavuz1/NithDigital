import type { Metadata } from 'next'
import LBTTCalculatorClient from './LBTTCalculatorClient'

export const metadata: Metadata = {
  title: 'LBTT Calculator 2026 — Scottish Stamp Duty Calculator | Nith Digital',
  description:
    'Calculate Land and Buildings Transaction Tax (LBTT) for Scottish property purchases. First-time buyer relief, additional dwelling supplement. Free, instant.',
  alternates: { canonical: 'https://nithdigital.uk/tools/lbtt-calculator' },
  openGraph: {
    title: 'LBTT Calculator 2026 — Scottish Stamp Duty Calculator',
    description: 'Calculate LBTT for Scottish property purchases. First-time buyer relief, ADS. Free, instant.',
    url: 'https://nithdigital.uk/tools/lbtt-calculator',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LBTT Calculator 2026 — Scottish Stamp Duty Calculator',
    description: 'Calculate LBTT for Scottish property purchases. Free, instant.',
  },
}

export default function LBTTCalculatorPage() {
  return <LBTTCalculatorClient />
}
