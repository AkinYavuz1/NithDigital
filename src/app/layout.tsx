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
  title: {
    default: 'Nith Digital — Web Design & Business Tools in Dumfries & Galloway',
    template: '%s | Nith Digital',
  },
  description:
    'Affordable websites, Power BI dashboards, and custom web apps for small businesses in Dumfries & Galloway. Based in Sanquhar, serving all of D&G. From £500.',
  keywords:
    'web design dumfries and galloway, website dumfries, web developer galloway, affordable website D&G, Power BI consultant Scotland, website Sanquhar',
  metadataBase: new URL('https://nithdigital.uk'),
  alternates: {
    canonical: 'https://nithdigital.uk',
  },
  openGraph: {
    title: 'Nith Digital — Web Design & Business Tools in Dumfries & Galloway',
    description:
      'Affordable websites, Power BI dashboards, and custom web apps for small businesses in Dumfries & Galloway. From £500.',
    url: 'https://nithdigital.uk',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nith Digital — Web Design & Business Tools in Dumfries & Galloway',
    description:
      'Affordable websites, Power BI dashboards, and custom web apps for small businesses in Dumfries & Galloway. From £500.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className={`${libreBaskerville.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Nith Digital Blog"
          href="/blog/rss.xml"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'Nith Digital',
              description:
                'Web design, Power BI dashboards, and custom web apps for small businesses in Dumfries & Galloway.',
              url: 'https://nithdigital.uk',
              email: 'hello@nithdigital.uk',
              telephone: '+447949116770',
              founder: {
                '@type': 'Person',
                name: 'Nith Digital Team',
                jobTitle: 'Founder & Senior BI Developer',
              },
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Sanquhar',
                addressRegion: 'Dumfries and Galloway',
                postalCode: 'DG4',
                addressCountry: 'GB',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 55.3698,
                longitude: -3.926,
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
                { '@type': 'Place', name: 'Moffat' },
                { '@type': 'Place', name: 'Annan' },
                { '@type': 'Place', name: 'Lockerbie' },
                { '@type': 'Place', name: 'Langholm' },
                { '@type': 'Place', name: 'Dalbeattie' },
                { '@type': 'Place', name: 'Gatehouse of Fleet' },
                { '@type': 'Place', name: 'Wigtown' },
              ],
              priceRange: '£500 - £5000',
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '17:00',
              },
              knowsAbout: [
                'Web Design',
                'Web Development',
                'Power BI',
                'Data Analytics',
                'Custom Web Applications',
                'SEO',
                'Business Intelligence',
              ],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Web Design & Digital Services',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Business Website',
                      description: 'Modern, mobile-responsive business website',
                    },
                    price: '500',
                    priceCurrency: 'GBP',
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'BI Dashboard',
                      description: 'Interactive Power BI dashboard',
                    },
                    price: '500',
                    priceCurrency: 'GBP',
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Custom Web App',
                      description: 'Bespoke web application',
                    },
                    price: '3000',
                    priceCurrency: 'GBP',
                  },
                ],
              },
              sameAs: [],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Nith Digital',
              url: 'https://nithdigital.uk',
              description:
                'Web design, dashboards, and business tools for small businesses in Dumfries & Galloway.',
              publisher: {
                '@type': 'Organization',
                name: 'Nith Digital',
                url: 'https://nithdigital.uk',
              },
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
