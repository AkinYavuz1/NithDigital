import type { Metadata } from 'next'
import { Libre_Baskerville, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-libre-baskerville',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Nith Digital — Websites, Data & Apps for Dumfries & Galloway',
  description:
    'Nith Digital builds affordable websites, Power BI dashboards, and custom web apps for small businesses in Dumfries & Galloway. Based in Sanquhar.',
  keywords:
    'buy website Dumfries and Galloway, web design Dumfries, web developer Galloway, affordable website D&G, Power BI consultant Scotland, website Sanquhar',
  openGraph: {
    title: 'Nith Digital — Buy a Website in Dumfries & Galloway',
    description:
      'Affordable websites, dashboards, and web apps for small businesses in Dumfries & Galloway. From £500.',
    url: 'https://nithdigital.uk',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${libreBaskerville.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Nith Digital',
              description:
                'Affordable websites, Power BI dashboards, and custom web apps for small businesses in Dumfries & Galloway.',
              url: 'https://nithdigital.uk',
              email: 'hello@nithdigital.uk',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Sanquhar',
                addressRegion: 'Dumfries and Galloway',
                postalCode: 'DG4',
                addressCountry: 'GB',
              },
              areaServed: [
                { '@type': 'Place', name: 'Dumfries and Galloway' },
                { '@type': 'Place', name: 'Dumfries' },
                { '@type': 'Place', name: 'Sanquhar' },
                { '@type': 'Place', name: 'Thornhill' },
                { '@type': 'Place', name: 'Castle Douglas' },
                { '@type': 'Place', name: 'Stranraer' },
                { '@type': 'Place', name: 'Newton Stewart' },
                { '@type': 'Place', name: 'Kirkcudbright' },
              ],
              priceRange: '£500 - £5000',
              knowsAbout: [
                'Web Design',
                'Web Development',
                'Power BI',
                'Data Analytics',
                'Custom Web Applications',
              ],
              sameAs: [],
            }),
          }}
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
