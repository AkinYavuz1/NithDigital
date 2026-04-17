import Link from 'next/link'

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com/nithdigital' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/nith-digital' },
]

const LINKS = [
  {
    heading: 'Services',
    items: [
      { label: 'Business websites', href: '/#services' },
      { label: 'Dashboards & reporting', href: '/#services' },
      { label: 'Booking systems', href: '/#services' },
      { label: 'Custom apps', href: '/#services' },
      { label: 'Contact us', href: '/#contact' },
    ],
  },
  {
    heading: 'Free Tools',
    items: [
      { label: 'VAT Threshold Checker', href: '/tools/vat-checker' },
      { label: 'Take-Home Calculator', href: '/tools/take-home-calculator' },
      { label: 'Invoice Generator', href: '/tools/invoice-generator' },
      { label: 'Website Quote', href: '/tools/website-quote' },
      { label: 'Site Audit', href: '/tools/site-audit' },
    ],
  },
  {
    heading: 'Blog',
    items: [
      { label: 'Starting a Business', href: '/blog?category=starting-a-business' },
      { label: 'Tax & Finance', href: '/blog?category=tax-and-finance' },
      { label: 'Marketing', href: '/blog?category=marketing' },
      { label: 'Websites & Digital', href: '/blog?category=websites-and-digital' },
      { label: 'Local Business', href: '/blog?category=local-business' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'Our Work', href: '/#work' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Launchpad', href: '/launchpad' },
      { label: 'Help Centre', href: '/help' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
    ],
  },
]

const LOCATION_LINKS = [
  { label: 'Web Design Dumfries', href: '/web-design/dumfries' },
  { label: 'Web Design Thornhill', href: '/web-design/thornhill' },
  { label: 'Web Design Castle Douglas', href: '/web-design/castle-douglas' },
  { label: 'Web Design Stranraer', href: '/web-design/stranraer' },
  { label: 'Web Design Moffat', href: '/web-design/moffat' },
  { label: 'Web Design Annan', href: '/web-design/annan' },
  { label: 'Web Design Lockerbie', href: '/web-design/lockerbie' },
  { label: 'Web Design Sanquhar', href: '/web-design/sanquhar' },
]

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: 80, position: 'relative', zIndex: 2 }}>
      {/* Main link grid */}
      <div
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          padding: '48px 24px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 32,
        }}
        className="footer-grid"
      >
        {LINKS.map((col) => (
          <div key={col.heading}>
            <div
              style={{
                fontSize: 10,
                letterSpacing: '1.5px',
                textTransform: 'uppercase' as const,
                color: '#7A7A7A',
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              {col.heading}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {col.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    style={{
                      fontSize: 13,
                      color: '#7A7A7A',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Local SEO links */}
      <div
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          padding: '20px 24px 24px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: '1.5px',
            textTransform: 'uppercase' as const,
            color: '#7A7A7A',
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          Web Design in Dumfries &amp; Galloway
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
          {LOCATION_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontSize: 12, color: '#7A7A7A', textDecoration: 'none' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid rgba(0,0,0,0.06)',
          padding: '16px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--max-width)',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 12,
            color: '#7A7A7A',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span>
            © 2026 Nith Digital —{' '}
            <span itemScope itemType="https://schema.org/LocalBusiness">
              <span itemProp="name" style={{ display: 'none' }}>Nith Digital</span>
              <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <span itemProp="addressLocality">Sanquhar</span>,{' '}
                <span itemProp="addressRegion">Dumfries &amp; Galloway</span>,{' '}
                <span itemProp="postalCode">DG4</span>
              </span>
            </span>
          </span>
          <span style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/privacy" style={{ color: '#7A7A7A', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
              Privacy Policy
            </Link>
            <a href="mailto:hello@nithdigital.uk" style={{ color: 'inherit' }}>
              hello@nithdigital.uk
            </a>
            <a href="tel:+447404173024" style={{ color: 'inherit' }}>
              +44 7404 173024
            </a>
            {SOCIAL_LINKS.map(s => (
              <a key={s.label} href={s.href} rel="noopener noreferrer" aria-label={s.label} style={{ color: 'inherit' }}>
                {s.label}
              </a>
            ))}
          </span>
        </div>
      </div>

      <style>{`
        .footer-grid a:hover { color: #E85D3A !important; }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
