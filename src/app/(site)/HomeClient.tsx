'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'

/* ═══════════════════════════════════════════════════════════════
   TYPEWRITER PHRASES
   ═══════════════════════════════════════════════════════════════ */
const PHRASES = [
  'Websites that actually get you customers',
  'Your site, live in 1 week. From \u00a3500.',
  'Designed in Dumfries & Galloway. Built for Scotland.',
]

/* ═══════════════════════════════════════════════════════════════
   WORK PROJECTS
   ═══════════════════════════════════════════════════════════════ */
const PROJECTS = [
  { name: 'DG Directory', desc: 'Local business directory \u2014 Dumfries & Galloway', url: 'https://www.dgdirectory.com/', browserUrl: 'dgdirectory.com', type: 'scroll-slow' as const, src: '/work/dgdirectory.webp' },
  { name: 'gAIns', desc: 'AI gym tracker with built-in coach', url: 'https://gainsai.uk/', browserUrl: 'gainsai.uk', type: 'video' as const, src: '/work/gains.mp4' },
  { name: 'Daily Duel', desc: '30 daily mini-games with leaderboards', url: 'https://daily-duel.akinyavuz.workers.dev/', browserUrl: 'dailyduel.uk', type: 'video' as const, src: '/work/dailyduel.mp4' },
  { name: 'Not an Octavia', desc: 'ML-powered used car deals finder', url: 'https://www.not-an-octavia.uk/', browserUrl: 'not-an-octavia.uk', type: 'scroll' as const, src: '/work/notanoctavia.webp' },
]

/* ═══════════════════════════════════════════════════════════════
   SERVICES
   ═══════════════════════════════════════════════════════════════ */
const SERVICES = [
  { num: '01', name: 'Website Design & Development', desc: 'Custom-built, mobile-first websites. Not templates \u2014 every site is designed from scratch for your business, your customers, and your location. Built on Next.js for speed, SEO, and reliability.' },
  { num: '02', name: 'Social Media Management', desc: 'Consistent, professional content across Facebook and Instagram \u2014 scheduled, published, and managed. We handle the posting so you can focus on the work.' },
  { num: '03', name: 'Search Engine Optimisation', desc: 'Get found on Google. Local SEO that puts you in front of customers searching for what you do, where you do it.' },
  { num: '04', name: 'Analytics & Software Development', desc: 'Turn your spreadsheets into interactive dashboards. Power BI reporting, custom web apps, job trackers, customer portals \u2014 built by someone with a decade in data and software.' },
]

/* ═══════════════════════════════════════════════════════════════
   TECH STACK SVG LOGOS (inline for self-containment)
   ═══════════════════════════════════════════════════════════════ */
function NextLogo() { return <svg viewBox="0 0 180 180" width="40" height="40"><mask id="nj" style={{maskType:'alpha' as never}}><circle cx="90" cy="90" r="90" fill="#000"/></mask><g mask="url(#nj)"><circle cx="90" cy="90" r="90" fill="#000"/><path d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 009.509-7.325z" fill="url(#a1)"/><circle cx="115.5" cy="54" r="9" fill="url(#b1)"/></g><defs><linearGradient id="a1" x1="76" y1="56" x2="131" y2="143" gradientUnits="userSpaceOnUse"><stop stopColor="#fff"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient><linearGradient id="b1" x1="115.5" y1="45" x2="115.5" y2="63" gradientUnits="userSpaceOnUse"><stop stopColor="#fff"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient></defs></svg> }
function VercelLogo() { return <svg viewBox="0 0 256 256" width="40" height="40"><path d="M128 0L256 221.7H0z" fill="#1A1A1A"/></svg> }
function SupabaseLogo() { return <svg viewBox="0 0 109 113" width="40" height="40"><path d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-43.151 54.347z" fill="url(#c1)"/><path d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-43.151 54.347z" fill="url(#d1)" fillOpacity=".2"/><path d="M45.317 2.07c2.86-3.601 8.657-1.628 8.726 2.971l.442 67.251H9.83c-8.19 0-12.759-9.46-7.665-15.875L45.317 2.07z" fill="#3ECF8E"/><defs><linearGradient id="c1" x1="54" y1="55" x2="94" y2="95" gradientUnits="userSpaceOnUse"><stop stopColor="#249361"/><stop offset="1" stopColor="#3ECF8E"/></linearGradient><linearGradient id="d1" x1="37" y1="32" x2="56" y2="69" gradientUnits="userSpaceOnUse"><stop/><stop offset="1" stopOpacity="0"/></linearGradient></defs></svg> }
function GoogleLogo() { return <svg viewBox="0 0 24 24" width="40" height="40"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> }
function StripeLogo() { return <svg viewBox="0 0 24 24" width="40" height="40"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.918 3.757 7.083c0 3.629 2.822 5.229 5.879 6.378 2.172.806 2.881 1.468 2.881 2.409 0 .943-.77 1.536-2.172 1.536-1.901 0-4.868-1.02-6.86-2.284l-.89 5.549c1.842 1.071 4.927 1.846 8.033 1.846 2.578 0 4.747-.654 6.271-1.843 1.632-1.275 2.478-3.158 2.478-5.437 0-3.742-2.852-5.341-5.401-6.087z" fill="#635BFF"/></svg> }
function ResendLogo() { return <svg viewBox="0 0 256 256" width="40" height="40"><rect width="256" height="256" rx="128" fill="#0070f3"/><path d="M121.451 28.929l-56 112c-2.484 4.968.645 10.071 6.049 10.071h23.613l-13.146 75.073c-.902 5.155 5.659 8.118 8.87 4.003l72.096-92.41c3.612-4.63.453-11.338-5.333-11.338h-25.137l18.248-88.202c1.086-5.245-5.143-8.508-8.669-4.197l-21.291 25z" fill="#fff"/></svg> }

const TECH = [
  { name: 'Next.js', desc: 'React framework', Logo: NextLogo },
  { name: 'Vercel', desc: 'Hosting & deploy', Logo: VercelLogo },
  { name: 'Supabase', desc: 'Database & auth', Logo: SupabaseLogo },
  { name: 'Google', desc: 'SEO & analytics', Logo: GoogleLogo },
  { name: 'Stripe', desc: 'Payments', Logo: StripeLogo },
  { name: 'Resend', desc: 'Email delivery', Logo: ResendLogo },
]

const PILL_OPTIONS = ['Website', 'Social media', 'SEO', 'Something else']

/* ═══════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════ */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVisible(true); return }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function useScrollSelect(elRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = elRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const nodes = Array.from(el.childNodes)
    el.innerHTML = ''
    nodes.forEach(node => {
      if (node.nodeType === 3) {
        ;(node.textContent || '').split('').forEach(ch => {
          const span = document.createElement('span')
          span.className = 'ss-char'
          span.textContent = ch
          el.appendChild(span)
        })
      } else if (node.nodeType === 1) {
        const wrapper = document.createElement('span')
        wrapper.className = 'ss-char'
        wrapper.appendChild((node as Element).cloneNode(true))
        el.appendChild(wrapper)
      }
    })

    const chars = el.querySelectorAll('.ss-char')

    let hasScrolled = false
    const initialY = window.scrollY

    function update() {
      if (!hasScrolled) {
        if (Math.abs(window.scrollY - initialY) > 150) hasScrolled = true
        else return
      }
      const rect = el!.getBoundingClientRect()
      const vh = window.innerHeight
      let progress = 1 - (rect.top - vh * 0.15) / (vh * 0.5)
      progress = Math.max(0, Math.min(1, progress))
      const count = Math.floor(progress * chars.length)
      chars.forEach((ch, i) => {
        const c = ch as HTMLElement
        if (i < count) { c.style.background = '#E85D3A'; c.style.color = '#fff' }
        else { c.style.background = ''; c.style.color = '' }
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [elRef])
}

/* ═══════════════════════════════════════════════════════════════
   SECTION LABEL
   ═══════════════════════════════════════════════════════════════ */
function SectionLabel({ num, title }: { num: string; title: string }) {
  const iv = useInView(0.15)
  return (
    <div ref={iv.ref} className="nd-section-label">
      <span className="nd-section-num nd-parallax">{num}</span>
      <span className={`nd-section-title ${iv.visible ? 'nd-revealed' : ''}`}>{title}</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ANIM WRAPPER
   ═══════════════════════════════════════════════════════════════ */
function Anim({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const iv = useInView()
  return (
    <div
      ref={iv.ref}
      className={`nd-anim ${iv.visible ? 'nd-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL SELECT TEXT
   ═══════════════════════════════════════════════════════════════ */
function ScrollSelectText({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null)
  useScrollSelect(ref)
  return <p ref={ref} className={className} style={style}>{children}</p>
}

/* ═══════════════════════════════════════════════════════════════
   MAIN HOME CLIENT COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function HomeClient() {
  const [typed, setTyped] = useState('')
  const [showSub, setShowSub] = useState(false)
  const [activeService, setActiveService] = useState<number | null>(null)
  const [selectedPill, setSelectedPill] = useState(0)
  const [formSending, setFormSending] = useState(false)
  const [formSent, setFormSent] = useState(false)

  /* ── Typewriter ── */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(PHRASES[0])
      setShowSub(true)
      return
    }
    let phraseIdx = 0, charIdx = 0, deleting = false, pauseEnd = 0, firstDone = false
    let active = true

    function tick() {
      if (!active) return
      const now = Date.now()
      if (now < pauseEnd) { requestAnimationFrame(tick); return }
      const phrase = PHRASES[phraseIdx]
      if (!deleting) {
        charIdx++
        if (charIdx > phrase.length) {
          pauseEnd = now + 2500
          deleting = true
          if (!firstDone) { firstDone = true; setShowSub(true) }
          requestAnimationFrame(tick); return
        }
      } else {
        charIdx--
        if (charIdx < 0) {
          charIdx = 0; deleting = false
          phraseIdx = (phraseIdx + 1) % PHRASES.length
          pauseEnd = now + 400
          requestAnimationFrame(tick); return
        }
      }
      setTyped(phrase.substring(0, charIdx))
      setTimeout(() => requestAnimationFrame(tick), deleting ? 25 : 55)
    }
    tick()
    return () => { active = false }
  }, [])

  /* ── Mouse parallax for section numbers ── */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth <= 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    function onMove(e: MouseEvent) {
      const mx = (e.clientX / window.innerWidth - 0.5) * 2
      const my = (e.clientY / window.innerHeight - 0.5) * 2
      document.querySelectorAll('.nd-parallax').forEach(el => {
        ;(el as HTMLElement).style.transform = `translate(${mx * 2}vw, ${my * 2}vh)`
      })
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  /* ── Contact form handler ── */
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const data = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      message: fd.get('message') as string,
      service: PILL_OPTIONS[selectedPill],
    }
    setFormSending(true)
    try {
      const res = await fetch('/api/notify-contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (res.ok) {
        setFormSent(true)
      } else {
        console.error('Contact form error:', await res.text())
        alert('Something went wrong. Please try calling us on 07404 173024.')
      }
    } catch (err) {
      console.error('Contact form error:', err)
      alert('Something went wrong. Please try calling us on 07404 173024.')
    }
    setFormSending(false)
  }, [selectedPill])

  return (
    <>
      {/* ══════════ HERO ══════════ */}
      <section className="nd-hero" id="hero">
        <h1 className="nd-hero-headline">
          {typed}
          <span className="nd-typed-cursor" />
        </h1>
        <p className={`nd-hero-sub ${showSub ? 'nd-show' : ''}`}>
          Custom-built, mobile-friendly websites for tradesmen and local businesses. Based in Dumfries &amp; Galloway.
        </p>
        <div className={`nd-hero-ctas ${showSub ? 'nd-show' : ''}`}>
          <a href="#work" className="nd-btn-accent">See our work<span className="nd-arrow">{'\u2192'}</span></a>
          <a href="tel:+447404173024" className="nd-btn-ghost">07404 173024</a>
        </div>
      </section>

      {/* ══════════ INTRO ══════════ */}
      <section className="nd-section nd-intro-section">
        <ScrollSelectText className="nd-intro-text">
          Websites that look like they cost thousands. Built in a week. Priced for real businesses.
        </ScrollSelectText>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="nd-section nd-how-section">
        <SectionLabel num="01" title="How it works" />
        <div className="nd-steps-grid">
          {[
            { num: '01', title: 'Tell us about your business', desc: 'A 15-minute phone call. What you do, who your customers are, what you need. No forms, no questionnaires.' },
            { num: '02', title: 'We design and build your site', desc: "You'll see 3 design options before we write a line of code. Pick the one you like, we handle the rest." },
            { num: '03', title: "You're live in 1 week", desc: "Your site is live, found on Google, and working for you. You own everything \u2014 no lock-in, no monthly surprises." },
          ].map((step, i) => (
            <Anim key={step.num} delay={i * 0.1}>
              <div className="nd-step-card">
                <div className="nd-step-num">{step.num}</div>
                <div className="nd-step-title">{step.title}</div>
                <div className="nd-step-desc">{step.desc}</div>
              </div>
            </Anim>
          ))}
        </div>
      </section>

      {/* ══════════ WORK ══════════ */}
      <section className="nd-section" id="work">
        <SectionLabel num="02" title="Work" />
        <div className="nd-work-grid">
          {PROJECTS.map((p, i) => (
            <Anim key={p.name} delay={i * 0.1}>
              <div className="nd-work-card">
                <div className="nd-browser-chrome">
                  <div className="nd-browser-dots"><span /><span /><span /></div>
                  <div className="nd-browser-url">{p.browserUrl}</div>
                </div>
                <div className="nd-work-video">
                  {p.type === 'video' ? (
                    <video autoPlay muted loop playsInline><source src={p.src} type="video/mp4" /></video>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className={`nd-scroll-preview ${p.type === 'scroll-slow' ? 'nd-scroll-slow' : ''}`}
                      src={p.src}
                      alt={`${p.name} \u2014 full page preview`}
                    />
                  )}
                </div>
                <div className="nd-work-info">
                  <div className="nd-work-header">
                    <span className="nd-work-name">{p.name}</span>
                    <a href={p.url} className="nd-work-link" target="_blank" rel="noopener noreferrer">Visit site {'\u2192'}</a>
                  </div>
                  <p className="nd-work-desc">{p.desc}</p>
                </div>
              </div>
            </Anim>
          ))}
        </div>
      </section>

      {/* ══════════ PRICING ══════════ */}
      <section className="nd-section nd-pricing-section" id="pricing">
        <SectionLabel num="03" title="Transparent pricing" />
        <div className="nd-pricing-grid">
          <Anim><div className="nd-pricing-card">
            <div className="nd-pricing-service">Business Website</div>
            <div className="nd-pricing-price">&pound;500</div>
            <div className="nd-pricing-detail">Design, build, deploy, hosting, SSL, SEO, contact form, booking system, mobile responsive</div>
            <div className="nd-pricing-detail" style={{ marginTop: 12, fontWeight: 600, color: '#1A1A1A' }}>&pound;40/mo hosting &amp; support</div>
          </div></Anim>
          <Anim delay={0.1}><div className="nd-pricing-card">
            <div className="nd-pricing-service">E-commerce</div>
            <div className="nd-pricing-price">&pound;800</div>
            <div className="nd-pricing-detail">Everything in Business, plus product listings, payments, and order management</div>
            <div className="nd-pricing-detail" style={{ marginTop: 12, fontWeight: 600, color: '#1A1A1A' }}>&pound;40/mo hosting &amp; support</div>
          </div></Anim>
        </div>
        <ScrollSelectText className="nd-pricing-note">
          Website builds can be split over the first 12 months at no additional cost.
        </ScrollSelectText>
      </section>

      {/* ══════════ SERVICES ══════════ */}
      <section className="nd-section nd-services-section" id="services">
        <SectionLabel num="04" title="Services" />
        {SERVICES.map((s, i) => (
          <Anim key={s.num} delay={i * 0.05}>
            <div
              className={`nd-service-item ${activeService === i ? 'nd-active' : ''}`}
              onClick={() => setActiveService(activeService === i ? null : i)}
            >
              <span className="nd-service-num">{s.num}</span>
              <span className="nd-service-name">{s.name} <span className="nd-service-arrow">+</span></span>
              <span className="nd-service-desc">{s.desc}</span>
            </div>
          </Anim>
        ))}
      </section>

      {/* ══════════ TRUST ══════════ */}
      <section className="nd-section nd-trust-section">
        <ScrollSelectText className="nd-trust-text">
          10 years building software for the NHS, energy, and finance. Now one call away in Dumfries &amp; Galloway.
        </ScrollSelectText>
      </section>

      {/* ══════════ CONTACT ══════════ */}
      <section className="nd-section nd-contact-section" id="contact">
        <SectionLabel num="05" title="Get in touch" />
        <p className="nd-contact-sub">Tell us a bit about your project and we&apos;ll get back to you within 24 hours.</p>

        {formSent ? (
          <Anim>
            <div className="nd-contact-form" style={{ textAlign: 'center', padding: '64px 48px' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>Thank you</div>
              <p style={{ color: '#7A7A7A' }}>We&apos;ll be in touch within 24 hours.</p>
            </div>
          </Anim>
        ) : (
          <Anim>
            <form className="nd-contact-form" onSubmit={handleSubmit}>
              <span className="nd-form-label">What do you need?</span>
              <div className="nd-pills">
                {PILL_OPTIONS.map((p, i) => (
                  <button key={p} type="button" className={`nd-pill ${selectedPill === i ? 'nd-selected' : ''}`} onClick={() => setSelectedPill(i)}>{p}</button>
                ))}
              </div>
              <div className="nd-form-row">
                <div className="nd-form-field">
                  <label htmlFor="cf-name">Full name</label>
                  <input type="text" id="cf-name" name="name" placeholder="What's your name?" required />
                </div>
                <div className="nd-form-field">
                  <label htmlFor="cf-email">Email address</label>
                  <input type="email" id="cf-email" name="email" placeholder="Your email address" required />
                </div>
              </div>
              <div className="nd-form-row">
                <div className="nd-form-field">
                  <label htmlFor="cf-phone">Phone number</label>
                  <input type="tel" id="cf-phone" name="phone" placeholder="Your phone number (optional)" />
                </div>
                <div className="nd-form-field" />
              </div>
              <div className="nd-form-field">
                <label htmlFor="cf-message">Message</label>
                <textarea id="cf-message" name="message" placeholder="Tell us about your project&hellip;" required />
              </div>
              <div className="nd-form-bottom">
                <button type="submit" className="nd-form-submit" disabled={formSending}>
                  {formSending ? 'Sending...' : 'Send message'}<span className="nd-arrow">{'\u2192'}</span>
                </button>
                <p className="nd-form-privacy">By sending, you agree to our <Link href="/privacy">privacy policy</Link>.</p>
              </div>
            </form>
          </Anim>
        )}

        <ScrollSelectText className="nd-contact-phone" style={{ textAlign: 'center', marginTop: 28, fontSize: '0.95rem', color: '#7A7A7A' }}>
          Prefer to talk? Call <a href="tel:+447404173024" style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>07404 173024</a>
        </ScrollSelectText>

        <div className="nd-map-wrap">
          <iframe src={typeof window !== 'undefined' && window.innerWidth <= 768 ? 'https://maps.google.com/maps?q=55.3802589,-3.9226708&z=8&output=embed' : 'https://maps.google.com/maps?q=55.3802589,-3.9226708&z=10&output=embed'} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Nith Digital location"></iframe>
        </div>
      </section>

      {/* ══════════ BUILT WITH ══════════ */}
      <section className="nd-section nd-tech-section" id="tech">
        <SectionLabel num="06" title="Built with" />
        <div className="nd-tech-grid">
          {TECH.map((t, i) => (
            <Anim key={t.name} delay={i * 0.05}>
              <div className="nd-tech-item">
                <div className="nd-tech-logo"><t.Logo /></div>
                <span className="nd-tech-name">{t.name}</span>
                <span className="nd-tech-desc">{t.desc}</span>
              </div>
            </Anim>
          ))}
        </div>
      </section>
    </>
  )
}
