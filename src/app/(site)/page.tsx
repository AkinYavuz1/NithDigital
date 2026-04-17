import type { Metadata } from 'next'
import HomeClient from './HomeClient'
import './home.css'

export const metadata: Metadata = {
  title: { absolute: 'Web Design & Digital Tools for Small Businesses | Nith Digital' },
  description:
    'Affordable websites, Power BI dashboards, and custom web apps for small businesses in Dumfries & Galloway. Based in Sanquhar. From £500.',
  alternates: {
    canonical: 'https://nithdigital.uk',
  },
  openGraph: {
    title: 'Web Design & Digital Tools for Small Businesses | Nith Digital',
    description:
      'Affordable websites, Power BI dashboards, and custom web apps for small businesses in Dumfries & Galloway. From £500.',
    url: 'https://nithdigital.uk',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design & Digital Tools for Small Businesses | Nith Digital',
    description:
      'Affordable websites, Power BI dashboards, and custom web apps for small businesses in Dumfries & Galloway. From £500.',
  },
}

export default function HomePage() {
  return <HomeClient />
}
