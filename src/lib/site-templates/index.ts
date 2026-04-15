// ─── Site Template Library ────────────────────────────────────────────────────
// Pre-built Tailwind component templates used by the scaffold generator.
// Claude selects and populates these rather than inventing components from scratch.

export interface IndustryPreset {
  sitemap: string[]
  heroLayout: 'centered' | 'split' | 'fullwidth'
  unsplashImages: {
    hero: string
    about: string
    services: string
  }
}

// ─── Industry presets ─────────────────────────────────────────────────────────

export const INDUSTRY_PRESETS: Record<string, IndustryPreset> = {
  construction: {
    sitemap: ['Home', 'Services', 'Projects', 'About', 'Contact'],
    heroLayout: 'fullwidth',
    unsplashImages: {
      hero: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&auto=format&fit=crop',
      about: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80&auto=format&fit=crop',
      services: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80&auto=format&fit=crop',
    },
  },
  plumbing: {
    sitemap: ['Home', 'Services', 'Emergency', 'About', 'Contact'],
    heroLayout: 'split',
    unsplashImages: {
      hero: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80&auto=format&fit=crop',
      about: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=80&auto=format&fit=crop',
      services: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80&auto=format&fit=crop',
    },
  },
  electrical: {
    sitemap: ['Home', 'Services', 'Emergency', 'About', 'Contact'],
    heroLayout: 'split',
    unsplashImages: {
      hero: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&q=80&auto=format&fit=crop',
      about: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&q=80&auto=format&fit=crop',
      services: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80&auto=format&fit=crop',
    },
  },
  restaurant: {
    sitemap: ['Home', 'Menu', 'About', 'Reservations', 'Contact'],
    heroLayout: 'fullwidth',
    unsplashImages: {
      hero: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80&auto=format&fit=crop',
      about: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80&auto=format&fit=crop',
      services: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80&auto=format&fit=crop',
    },
  },
  hospitality: {
    sitemap: ['Home', 'Rooms', 'Dining', 'About', 'Contact'],
    heroLayout: 'fullwidth',
    unsplashImages: {
      hero: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&auto=format&fit=crop',
      about: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80&auto=format&fit=crop',
      services: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80&auto=format&fit=crop',
    },
  },
  legal: {
    sitemap: ['Home', 'Practice Areas', 'Our Team', 'About', 'Contact'],
    heroLayout: 'split',
    unsplashImages: {
      hero: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=80&auto=format&fit=crop',
      about: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80&auto=format&fit=crop',
      services: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80&auto=format&fit=crop',
    },
  },
  accountancy: {
    sitemap: ['Home', 'Services', 'About', 'Resources', 'Contact'],
    heroLayout: 'split',
    unsplashImages: {
      hero: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600&q=80&auto=format&fit=crop',
      about: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop',
      services: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80&auto=format&fit=crop',
    },
  },
  healthcare: {
    sitemap: ['Home', 'Services', 'Our Team', 'Patient Info', 'Contact'],
    heroLayout: 'split',
    unsplashImages: {
      hero: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80&auto=format&fit=crop',
      about: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=80&auto=format&fit=crop',
      services: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&auto=format&fit=crop',
    },
  },
  beauty: {
    sitemap: ['Home', 'Services', 'Gallery', 'About', 'Book Now', 'Contact'],
    heroLayout: 'centered',
    unsplashImages: {
      hero: 'https://images.unsplash.com/photo-1560066984-138daaa4e4e4?w=1600&q=80&auto=format&fit=crop',
      about: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80&auto=format&fit=crop',
      services: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=1200&q=80&auto=format&fit=crop',
    },
  },
  fitness: {
    sitemap: ['Home', 'Classes', 'Memberships', 'About', 'Contact'],
    heroLayout: 'fullwidth',
    unsplashImages: {
      hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80&auto=format&fit=crop',
      about: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80&auto=format&fit=crop',
      services: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1200&q=80&auto=format&fit=crop',
    },
  },
  technology: {
    sitemap: ['Home', 'Services', 'Case Studies', 'About', 'Contact'],
    heroLayout: 'split',
    unsplashImages: {
      hero: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80&auto=format&fit=crop',
      about: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop',
      services: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80&auto=format&fit=crop',
    },
  },
  estate_agency: {
    sitemap: ['Home', 'Buy', 'Rent', 'Sell', 'About', 'Contact'],
    heroLayout: 'fullwidth',
    unsplashImages: {
      hero: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80&auto=format&fit=crop',
      about: 'https://images.unsplash.com/photo-1582407947304-fd86f28f3e3a?w=1200&q=80&auto=format&fit=crop',
      services: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=1200&q=80&auto=format&fit=crop',
    },
  },
  default: {
    sitemap: ['Home', 'About', 'Services', 'Contact'],
    heroLayout: 'split',
    unsplashImages: {
      hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80&auto=format&fit=crop',
      about: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop',
      services: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop',
    },
  },
}

export function getIndustryPreset(industry: string): IndustryPreset {
  const key = industry.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '')
  return INDUSTRY_PRESETS[key] || INDUSTRY_PRESETS.default
}

// ─── Component templates ──────────────────────────────────────────────────────

export const NAVBAR_TEMPLATE = `'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[var(--color-background)]/95 backdrop-blur border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="font-heading text-lg font-semibold text-[var(--color-primary)] tracking-tight">
          BRAND_NAME
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="text-sm font-semibold bg-[var(--color-primary)] text-white px-4 py-2 rounded-[var(--radius)] hover:opacity-90 transition-opacity">
            Get in Touch
          </Link>
        </nav>
        <button className="md:hidden p-2 text-[var(--color-text)]" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-black/5 bg-[var(--color-background)] px-4 pb-4 pt-2 flex flex-col gap-3">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-[var(--color-text)] py-2">
              {l.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)} className="text-sm font-semibold bg-[var(--color-primary)] text-white px-4 py-2 rounded-[var(--radius)] text-center">
            Get in Touch
          </Link>
        </div>
      )}
    </header>
  )
}`

export const FOOTER_TEMPLATE = `import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="font-heading text-lg font-semibold mb-3">BRAND_NAME</p>
          <p className="text-sm text-white/70 leading-relaxed max-w-xs">BRAND_TAGLINE</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest mb-4 text-white/50">Quick Links</p>
          <ul className="space-y-2">
            {[['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/contact', 'Contact']].map(([href, label]) => (
              <li key={href}><Link href={href} className="text-sm text-white/70 hover:text-white transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest mb-4 text-white/50">Contact</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>CONTACT_EMAIL</li>
            <li>CONTACT_PHONE</li>
            <li>CONTACT_LOCATION</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <p className="text-center text-xs text-white/40">© {new Date().getFullYear()} BRAND_NAME. All rights reserved.</p>
      </div>
    </footer>
  )
}`

export const HERO_CENTERED_TEMPLATE = `import Image from 'next/image'
import Link from 'next/link'

export default function HeroCentered({ headline, subheading, cta, imageUrl }: {
  headline: string; subheading: string; cta: string; imageUrl: string
}) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center text-center overflow-hidden pt-16">
      <Image src={imageUrl} alt="Hero background" fill className="object-cover brightness-[0.35]" priority sizes="100vw" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">{headline}</h1>
        <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">{subheading}</p>
        <Link href="/contact" className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-primary)] font-bold px-8 py-4 rounded-[var(--radius)] hover:opacity-90 transition-opacity text-base">
          {cta}
        </Link>
      </div>
    </section>
  )
}`

export const HERO_SPLIT_TEMPLATE = `import Image from 'next/image'
import Link from 'next/link'

export default function HeroSplit({ headline, subheading, cta, imageUrl }: {
  headline: string; subheading: string; cta: string; imageUrl: string
}) {
  return (
    <section className="min-h-[90vh] grid md:grid-cols-2 pt-16">
      <div className="flex items-center px-6 sm:px-10 lg:px-16 py-16 bg-[var(--color-surface)]">
        <div className="max-w-lg">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[var(--color-primary)] leading-tight mb-6">{headline}</h1>
          <p className="text-base sm:text-lg text-[var(--color-text-muted)] mb-10 leading-relaxed">{subheading}</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white font-bold px-8 py-4 rounded-[var(--radius)] hover:opacity-90 transition-opacity">
            {cta}
          </Link>
        </div>
      </div>
      <div className="relative min-h-[400px] md:min-h-full">
        <Image src={imageUrl} alt="Hero background" fill className="object-cover" priority sizes="50vw" />
      </div>
    </section>
  )
}`

export const HERO_FULLWIDTH_TEMPLATE = `import Image from 'next/image'
import Link from 'next/link'

export default function HeroFullwidth({ headline, subheading, cta, imageUrl }: {
  headline: string; subheading: string; cta: string; imageUrl: string
}) {
  return (
    <section className="relative min-h-[85vh] flex items-end pb-16 sm:pb-24 overflow-hidden pt-16">
      <Image src={imageUrl} alt="Hero background" fill className="object-cover brightness-[0.4]" priority sizes="100vw" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-none mb-6 max-w-3xl">{headline}</h1>
        <p className="text-lg sm:text-xl text-white/75 mb-10 max-w-xl leading-relaxed">{subheading}</p>
        <Link href="/contact" className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-primary)] font-bold px-8 py-4 rounded-[var(--radius)] hover:opacity-90 transition-opacity text-base">
          {cta}
        </Link>
      </div>
    </section>
  )
}`

export const SERVICES_GRID_TEMPLATE = `import Link from 'next/link'

interface Service { name: string; description: string; cta: string }

export default function ServicesGrid({ headline, intro, services }: {
  headline: string; intro: string; services: Service[]
}) {
  return (
    <section className="py-20 sm:py-28 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-4">{headline}</h2>
          <p className="text-[var(--color-text-muted)] leading-relaxed">{intro}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={i} className="p-7 bg-[var(--color-surface)] rounded-[var(--radius)] border border-black/5 hover:border-[var(--color-primary)]/20 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--color-primary)]/10 mb-5 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[var(--color-primary)]" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-[var(--color-primary)] mb-3">{s.name}</h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-5">{s.description}</p>
              <Link href="/contact" className="text-sm font-semibold text-[var(--color-primary)] group-hover:underline">{s.cta} →</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}`

export const TRUST_BADGES_TEMPLATE = `export default function TrustBadges({ statement, badges }: {
  statement: string; badges: string[]
}) {
  return (
    <section className="py-12 border-y border-black/5 bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-center text-sm text-[var(--color-text-muted)] mb-8 font-medium">{statement}</p>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
          {badges.map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-[var(--color-primary)]">
              <svg className="w-5 h-5 text-[var(--color-accent)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}`

export const CTA_SECTION_TEMPLATE = `import Link from 'next/link'

export default function CTASection({ headline, body, button }: {
  headline: string; body: string; button: string
}) {
  return (
    <section className="py-20 sm:py-28 bg-[var(--color-primary)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-5">{headline}</h2>
        <p className="text-white/75 mb-10 leading-relaxed text-lg">{body}</p>
        <Link href="/contact" className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-primary)] font-bold px-10 py-4 rounded-[var(--radius)] hover:opacity-90 transition-opacity text-base">
          {button}
        </Link>
      </div>
    </section>
  )
}`

export const FAQ_TEMPLATE = `'use client'
import { useState } from 'react'

interface FaqItem { question: string; answer: string }

export default function FaqSection({ intro, items }: { intro: string; items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="py-20 sm:py-28 bg-[var(--color-surface)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-4">Frequently Asked Questions</h2>
        <p className="text-[var(--color-text-muted)] mb-12 leading-relaxed">{intro}</p>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="border border-black/10 rounded-[var(--radius)] overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-6 py-4 flex items-center justify-between font-semibold text-[var(--color-primary)] hover:bg-[var(--color-background)] transition-colors"
                aria-expanded={open === i}
              >
                {item.question}
                <span className="ml-4 text-lg leading-none">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-[var(--color-text-muted)] leading-relaxed border-t border-black/5 pt-4">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}`

export const MAPS_EMBED_TEMPLATE = `export default function MapsEmbed({ embedUrl, businessName }: { embedUrl: string; businessName: string }) {
  if (!embedUrl) return null
  return (
    <section className="py-12 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-[var(--radius)] overflow-hidden border border-black/10 shadow-sm" style={{ height: '380px' }}>
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={\`\${businessName} location map\`}
          />
        </div>
      </div>
    </section>
  )
}`

export const NOT_FOUND_TEMPLATE = `import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="text-center max-w-lg">
        <p className="font-heading text-8xl font-bold text-[var(--color-primary)]/10 mb-4">404</p>
        <h1 className="font-heading text-3xl font-bold text-[var(--color-primary)] mb-4">Page not found</h1>
        <p className="text-[var(--color-text-muted)] mb-10 leading-relaxed">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white font-bold px-8 py-3.5 rounded-[var(--radius)] hover:opacity-90 transition-opacity">
          Back to home
        </Link>
      </div>
    </main>
  )
}`

export const ERROR_TEMPLATE = `'use client'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="text-center max-w-lg">
        <h2 className="font-heading text-3xl font-bold text-[var(--color-primary)] mb-4">Something went wrong</h2>
        <p className="text-[var(--color-text-muted)] mb-8 leading-relaxed">
          We've encountered an unexpected error. Please try again or contact us directly.
        </p>
        <button onClick={reset} className="bg-[var(--color-primary)] text-white font-bold px-8 py-3.5 rounded-[var(--radius)] hover:opacity-90 transition-opacity">
          Try again
        </button>
      </div>
    </main>
  )
}`

export const LOADING_TEMPLATE = `export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] animate-spin" />
    </div>
  )
}`

export const CONTACT_FORM_TEMPLATE = `'use client'
import { useState } from 'react'

export default function ContactForm({ headline, intro, formCta }: {
  headline: string; intro: string; formCta: string
}) {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (res.ok) { setSent(true) } else { setError('Something went wrong. Please try calling us directly.') }
    } catch {
      setError('Something went wrong. Please try calling us directly.')
    }
    setLoading(false)
  }

  return (
    <section className="py-20 sm:py-28 bg-[var(--color-background)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-4">{headline}</h1>
        <p className="text-[var(--color-text-muted)] mb-10 leading-relaxed">{intro}</p>
        {sent ? (
          <div className="p-6 bg-green-50 border border-green-200 rounded-[var(--radius)] text-center">
            <p className="font-semibold text-green-700">Message sent — we'll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Full name</label>
                <input id="name" name="name" type="text" required autoComplete="name" className="w-full px-4 py-3 border border-black/10 rounded-[var(--radius)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 bg-[var(--color-surface)]" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Email</label>
                <input id="email" name="email" type="email" required autoComplete="email" className="w-full px-4 py-3 border border-black/10 rounded-[var(--radius)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 bg-[var(--color-surface)]" />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Phone</label>
              <input id="phone" name="phone" type="tel" autoComplete="tel" className="w-full px-4 py-3 border border-black/10 rounded-[var(--radius)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 bg-[var(--color-surface)]" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Message</label>
              <textarea id="message" name="message" required rows={5} className="w-full px-4 py-3 border border-black/10 rounded-[var(--radius)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 bg-[var(--color-surface)] resize-none" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-[var(--color-primary)] text-white font-bold py-3.5 rounded-[var(--radius)] hover:opacity-90 transition-opacity disabled:opacity-60">
              {loading ? 'Sending…' : formCta}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}`
