import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Nith Digital',
  description: 'How Nith Digital collects, uses, and protects your personal data. Based in Sanquhar, Dumfries & Galloway, Scotland.',
  alternates: { canonical: 'https://nithdigital.uk/privacy' },
  openGraph: {
    title: 'Privacy Policy — Nith Digital',
    description: 'How Nith Digital collects, uses, and protects your personal data.',
    url: 'https://nithdigital.uk/privacy',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — Nith Digital',
    description: 'How Nith Digital collects, uses, and protects your personal data.',
  },
}

const SECTIONS = [
  {
    title: '1. Who we are',
    body: [
      'Nith Digital is a sole trader web design and development business based in Sanquhar, Dumfries & Galloway, Scotland. We build websites, dashboards, and digital tools for small businesses.',
      'Contact: hello@nithdigital.uk',
    ],
  },
  {
    title: '2. What data we collect',
    body: [
      'We only collect data you provide directly to us. This includes:',
    ],
    list: [
      'Name and email address when you use our contact form or book a call',
      'Business name and details when enquiring about our services',
      'Any information you include in messages sent to us',
      'Basic analytics data (page views, referrer, device type) via privacy-friendly analytics — no cookies, no personal identifiers',
    ],
  },
  {
    title: '3. How we use your data',
    body: [
      'We use the information you provide solely to:',
    ],
    list: [
      'Respond to your enquiry or booking request',
      'Deliver services you have engaged us for',
      'Send occasional project updates or invoices (where you are a client)',
    ],
    footer: 'We do not sell, rent, or share your personal data with third parties for marketing purposes.',
  },
  {
    title: '4. Legal basis for processing',
    body: [
      'Under UK GDPR, we process your data on the following legal bases:',
    ],
    list: [
      'Legitimate interests — to respond to enquiries and run our business',
      'Contract — to deliver services you have requested',
      'Consent — where you have explicitly opted in (e.g. newsletter)',
    ],
  },
  {
    title: '5. Data retention',
    body: [
      'We retain enquiry data for up to 12 months. Client project data (emails, files, invoices) is retained for 6 years in line with HMRC requirements, after which it is securely deleted.',
    ],
  },
  {
    title: '6. Your rights',
    body: [
      'Under UK GDPR you have the right to:',
    ],
    list: [
      'Access the personal data we hold about you',
      'Request correction of inaccurate data',
      'Request deletion of your data',
      'Object to or restrict processing',
      'Data portability',
    ],
    footer: 'To exercise any of these rights, email hello@nithdigital.uk. We will respond within 30 days.',
  },
  {
    title: '7. Cookies',
    body: [
      'Our website does not use tracking or advertising cookies. We use privacy-friendly analytics that collect no personally identifiable information and set no cookies on your device.',
    ],
  },
  {
    title: '8. Third-party services',
    body: [
      'We use a small number of trusted third-party tools to operate the business:',
    ],
    list: [
      'Vercel — website hosting (servers in EU/US)',
      'Cal.com — booking calls (data processed per their privacy policy)',
      'Supabase — database infrastructure',
    ],
    footer: 'Each third party is bound by their own privacy policy and we share only the minimum data necessary.',
  },
  {
    title: '9. Security',
    body: [
      'We take reasonable technical and organisational measures to protect your data, including encrypted connections (HTTPS) and restricted access to any stored information.',
    ],
  },
  {
    title: '10. Complaints',
    body: [
      'If you have a concern about how we handle your data, please contact us first at hello@nithdigital.uk. You also have the right to lodge a complaint with the Information Commissioner\'s Office (ICO) at ico.org.uk.',
    ],
  },
  {
    title: '11. Changes to this policy',
    body: [
      'We may update this policy from time to time. The latest version will always be available at nithdigital.uk/privacy. Last updated: April 2026.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <div style={{ background: '#1B2A4A', padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', maxWidth: 440, margin: '0 auto' }}>
          How we collect, use, and protect your data.
        </p>
      </div>

      <section style={{ padding: '72px 0' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
          {SECTIONS.map((section) => (
            <div key={section.title} style={{ marginBottom: 48 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 12 }}>
                {section.title}
              </h2>
              {section.body.map((para, i) => (
                <p key={i} style={{ fontSize: 14, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 12 }}>
                  {para}
                </p>
              ))}
              {section.list && (
                <ul style={{ margin: '8px 0 12px 0', padding: '0 0 0 20px' }}>
                  {section.list.map((item) => (
                    <li key={item} style={{ fontSize: 14, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 4 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {section.footer && (
                <p style={{ fontSize: 14, lineHeight: 1.8, color: '#5A6A7A' }}>
                  {section.footer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
