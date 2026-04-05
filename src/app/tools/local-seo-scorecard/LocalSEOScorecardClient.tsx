'use client'

import { useState } from 'react'
import Link from 'next/link'

type Answer = 'yes' | 'no' | 'notsure' | null

interface Question {
  id: string
  text: string
  noExplanation: string
  notsureExplanation: string
  fix: string
  impact: 'high' | 'medium'
}

const QUESTIONS: Question[] = [
  {
    id: 'speed',
    text: 'Does your website load in under 3 seconds on your phone?',
    noExplanation: 'Slow sites lose visitors fast — 53% of people leave a mobile page that takes more than 3 seconds to load.',
    notsureExplanation: 'You can check your speed for free at pagespeed.web.dev. Slow sites are penalised by Google.',
    fix: 'Compress images, switch to faster hosting, and remove unnecessary plugins or scripts.',
    impact: 'high',
  },
  {
    id: 'mobile',
    text: 'Does your website look good and work properly on a mobile phone?',
    noExplanation: 'Over 60% of local searches happen on mobile. If your site doesn\'t work on a phone, you\'re losing more than half your potential customers.',
    notsureExplanation: 'Open your site on your phone and try to use it as a customer would. If it\'s hard to read or navigate, it needs fixing.',
    fix: 'Have your website rebuilt with a mobile-first responsive design.',
    impact: 'high',
  },
  {
    id: 'https',
    text: 'Does your website URL start with https:// (shows a padlock in the browser)?',
    noExplanation: 'Without HTTPS, Google marks your site as "Not Secure" — this puts off visitors and hurts your search ranking.',
    notsureExplanation: 'Look at the address bar in your browser when viewing your site. If you see "Not Secure" or http:// instead of https://, you need SSL.',
    fix: 'Install an SSL certificate on your website — most modern hosting providers offer this free.',
    impact: 'high',
  },
  {
    id: 'contact-form',
    text: 'Does your website have a contact form (not just an email address or phone number)?',
    noExplanation: 'Contact forms reduce friction — people fill them in at 11pm without needing to open their email. They also protect you from spam.',
    notsureExplanation: 'Check your contact or enquiry page. A form with fields like name, email, and message is what counts.',
    fix: 'Add a simple contact form to your website. This is straightforward for any web developer.',
    impact: 'medium',
  },
  {
    id: 'fresh-content',
    text: 'Have you updated your website content in the last 6 months?',
    noExplanation: 'Google favours websites that are kept up to date. Stale content sends a signal that your business may not be active.',
    notsureExplanation: 'Think about when you last changed your prices, added a new service, or updated your "about" section.',
    fix: 'Add a news or blog section, update your prices or services, or add a recent project to your portfolio.',
    impact: 'medium',
  },
  {
    id: 'google-rank',
    text: 'Does your website appear on the first page of Google when you search for your service + your town?',
    noExplanation: 'If you\'re not on page one, most people will never find you. 95% of clicks go to the first page of results.',
    notsureExplanation: 'Try searching "[your service] [your town]" in a private/incognito browser. If you\'re not there, you\'re missing out.',
    fix: 'Invest in local SEO — optimise your pages with local keywords and build your Google Business Profile.',
    impact: 'high',
  },
  {
    id: 'gbp',
    text: 'Do you have a Google Business Profile (the box that shows up on Google Maps)?',
    noExplanation: 'A Google Business Profile is free and puts you on Google Maps. Without one, you\'re invisible to people searching for your service nearby.',
    notsureExplanation: 'Search your business name on Google. If a card with your address, hours, and reviews doesn\'t appear, you don\'t have one set up.',
    fix: 'Set up a free Google Business Profile at business.google.com — it takes about 30 minutes.',
    impact: 'high',
  },
  {
    id: 'ctas',
    text: 'Does your website have clear calls to action (e.g. "Book now", "Get a quote", "Call us")?',
    noExplanation: 'Without clear calls to action, visitors don\'t know what to do next and leave without getting in touch.',
    notsureExplanation: 'Look at your homepage — is it obvious what you want visitors to do? Is there a prominent button?',
    fix: 'Add a prominent button on every key page telling visitors what action to take.',
    impact: 'high',
  },
  {
    id: 'reviews',
    text: 'Do you have any customer reviews visible on your website or Google profile?',
    noExplanation: '88% of people trust online reviews as much as personal recommendations. No reviews = less trust.',
    notsureExplanation: 'Check your Google Business Profile and your website. Reviews from real customers build confidence for new visitors.',
    fix: 'Ask your best customers to leave a Google review. You can copy the link from your Google Business Profile.',
    impact: 'high',
  },
  {
    id: 'service-pages',
    text: 'Does your website have individual pages for each service you offer?',
    noExplanation: 'Individual service pages help Google understand what you do and rank you for specific searches like "emergency plumber Dumfries".',
    notsureExplanation: 'Do you have one combined "Services" page, or separate pages for each service? Separate pages perform much better in search.',
    fix: 'Create individual pages for each of your main services, optimised with local keywords.',
    impact: 'medium',
  },
]

export default function LocalSEOScorecardClient() {
  const [businessName, setBusinessName] = useState('')
  const [hasWebsite, setHasWebsite] = useState<boolean | null>(null)
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [started, setStarted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [showResults, setShowResults] = useState(false)

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined && answers[q.id] !== null)

  const score = QUESTIONS.reduce((total, q) => {
    const a = answers[q.id]
    if (a === 'yes') return total + 10
    if (a === 'notsure') return total + 3
    return total
  }, 0)

  const band = score >= 80
    ? { label: 'Excellent', color: '#27ae60', bg: 'rgba(39,174,96,0.1)', desc: 'Your online presence is in great shape. Keep it up!' }
    : score >= 60
    ? { label: 'Good', color: '#2980b9', bg: 'rgba(41,128,185,0.1)', desc: 'You\'re doing well but there are a few things worth improving.' }
    : score >= 40
    ? { label: 'Needs Work', color: '#e67e22', bg: 'rgba(230,126,34,0.1)', desc: 'There are some important gaps that are likely costing you customers.' }
    : { label: 'Critical', color: '#c0392b', bg: 'rgba(192,57,43,0.1)', desc: 'Your online presence has significant issues that need addressing urgently.' }

  const issues = QUESTIONS.filter(q => answers[q.id] === 'no' || answers[q.id] === 'notsure')
  const highImpactIssues = issues.filter(q => q.impact === 'high').slice(0, 3)
  const priorityFixes = highImpactIssues.length > 0 ? highImpactIssues : issues.slice(0, 3)

  const setAnswer = (questionId: string, val: Answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: val }))
  }

  const answerBtnStyle = (selected: boolean, variant: 'yes' | 'no' | 'notsure') => {
    const colors: Record<string, string> = { yes: '#27ae60', no: '#c0392b', notsure: '#e67e22' }
    const color = colors[variant]
    return {
      padding: '7px 16px',
      borderRadius: 100,
      border: `2px solid ${selected ? color : 'rgba(27,42,74,0.15)'}`,
      background: selected ? `${color}18` : '#fff',
      color: selected ? color : '#5A6A7A',
      cursor: 'pointer',
      fontSize: 12,
      fontWeight: 600,
      transition: 'all 0.15s ease',
    }
  }

  const reset = () => {
    setBusinessName('')
    setHasWebsite(null)
    setWebsiteUrl('')
    setStarted(false)
    setAnswers({})
    setShowResults(false)
  }

  // No-website results
  if (started && hasWebsite === false) {
    return (
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px', animation: 'slideUp 0.4s ease' }}>
        <div style={{ background: '#c0392b', color: '#fff', display: 'inline-block', padding: '8px 20px', borderRadius: 100, fontWeight: 700, fontSize: 14, marginBottom: 24 }}>
          No website detected
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#1B2A4A', marginBottom: 12, fontWeight: 400 }}>
          {businessName ? `${businessName} is` : 'You\'re'} invisible to 97% of online searchers
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: '#4A5A6A', marginBottom: 24, maxWidth: 600 }}>
          97% of consumers search online for local businesses before making a purchase. Without a website, you&apos;re relying entirely on word of mouth — and missing out on customers actively looking for what you offer right now.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }} className="stats-grid">
          {[
            ['97%', 'of people research online before buying locally'],
            ['88%', 'use Google to find local business info'],
            ['£0', 'is the cost of a Google Business Profile listing'],
          ].map(([stat, label]) => (
            <div key={stat} style={{ background: '#F5F0E6', borderRadius: 12, padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#D4A84B', marginBottom: 4 }}>{stat}</div>
              <div style={{ fontSize: 12, color: '#4A5A6A', lineHeight: 1.5 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#1B2A4A', borderRadius: 12, padding: '36px', textAlign: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
            Let&apos;s get {businessName || 'your business'} online
          </h3>
          <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.65)', marginBottom: 24 }}>
            We build professional websites for small businesses across Dumfries & Galloway, starting from £360. Book a free call to get started.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{ display: 'inline-block', padding: '12px 28px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Book a free call
            </Link>
            <Link href="/services" style={{ display: 'inline-block', padding: '12px 28px', border: '2px solid rgba(245,240,230,0.3)', color: '#F5F0E6', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              View our services
            </Link>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button onClick={reset} style={{ fontSize: 13, color: '#D4A84B', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Start again</button>
        </div>
        <style>{`
          @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          @media (max-width: 600px) { .stats-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </div>
    )
  }

  // Results
  if (showResults) {
    const circumference = 2 * Math.PI * 48
    const dashOffset = circumference - (score / 100) * circumference

    return (
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px', animation: 'slideUp 0.4s ease' }}>

        {/* Score circle */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <svg width="130" height="130" viewBox="0 0 110 110" aria-label={`Score: ${score} out of 100`}>
            <circle cx="55" cy="55" r="48" fill="none" stroke="rgba(27,42,74,0.08)" strokeWidth="8" />
            <circle
              cx="55" cy="55" r="48" fill="none"
              stroke={band.color} strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 55 55)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
            <text x="55" y="50" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1B2A4A">{score}</text>
            <text x="55" y="66" textAnchor="middle" fontSize="11" fill="#5A6A7A">out of 100</text>
          </svg>
          <div style={{ display: 'inline-block', padding: '6px 18px', borderRadius: 100, background: band.bg, color: band.color, fontWeight: 700, fontSize: 14, marginTop: 8 }}>
            {band.label}
          </div>
          <p style={{ fontSize: 14, color: '#4A5A6A', marginTop: 8 }}>{band.desc}</p>
        </div>

        {/* Priority fixes */}
        {priorityFixes.length > 0 && (
          <div style={{ background: '#F5F0E6', borderRadius: 12, padding: '28px 32px', marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#1B2A4A', marginBottom: 16, fontWeight: 400 }}>
              Your top priority fixes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {priorityFixes.map((q, i) => (
                <div key={q.id} style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#D4A84B', color: '#1B2A4A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A', marginBottom: 2 }}>{q.text}</div>
                    <div style={{ fontSize: 12, color: '#4A5A6A', lineHeight: 1.6 }}>{q.fix}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full breakdown */}
        {issues.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', borderRadius: 12, padding: '28px 32px', marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#1B2A4A', marginBottom: 16, fontWeight: 400 }}>
              Full breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {QUESTIONS.map(q => {
                const a = answers[q.id]
                if (a === 'yes') return (
                  <div key={q.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#27ae60', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0, marginTop: 1 }}>✓</div>
                    <span style={{ fontSize: 13, color: '#3A4A5A' }}>{q.text}</span>
                  </div>
                )
                return (
                  <div key={q.id} style={{ borderLeft: `3px solid ${a === 'no' ? '#c0392b' : '#e67e22'}`, paddingLeft: 16 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: a === 'no' ? '#c0392b' : '#e67e22', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0, marginTop: 1 }}>
                        {a === 'no' ? '✗' : '?'}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A' }}>{q.text}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#4A5A6A', lineHeight: 1.6, margin: '0 0 4px' }}>
                      {a === 'no' ? q.noExplanation : q.notsureExplanation}
                    </p>
                    <p style={{ fontSize: 12, color: '#D4A84B', fontWeight: 600, margin: 0 }}>Fix: {q.fix}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ background: '#1B2A4A', borderRadius: 12, padding: '36px', textAlign: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
            Want us to fix these for you?
          </h3>
          <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.65)', marginBottom: 24 }}>
            Book a free call and we&apos;ll walk you through exactly what needs doing — no jargon, no pressure.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{ display: 'inline-block', padding: '12px 28px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Book a free call
            </Link>
            <Link href="/services" style={{ display: 'inline-block', padding: '12px 28px', border: '2px solid rgba(245,240,230,0.3)', color: '#F5F0E6', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              View our services
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={reset} style={{ fontSize: 13, color: '#D4A84B', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Start again</button>
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#9AA8B8', marginTop: 32 }}>
          Built by <a href="https://nithdigital.uk" style={{ color: '#9AA8B8' }}>Nith Digital</a>
        </p>
        <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    )
  }

  // Intro / questions
  if (!started) {
    return (
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ background: '#F5F0E6', borderRadius: 16, padding: '36px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#1B2A4A', marginBottom: 6, fontWeight: 400 }}>
            Let&apos;s check your online presence
          </h2>
          <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 24 }}>Answer 10 quick questions to get your score. Takes about 2 minutes.</p>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 8 }}>Your business name</label>
            <input
              type="text"
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              placeholder="e.g. Nith Valley Plumbing"
              style={{ width: '100%', padding: '11px 14px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 8, fontSize: 14, color: '#1B2A4A', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 12 }}>Do you currently have a website?</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setHasWebsite(true)}
                style={{ padding: '10px 24px', borderRadius: 100, border: `2px solid ${hasWebsite === true ? '#D4A84B' : 'rgba(27,42,74,0.2)'}`, background: hasWebsite === true ? 'rgba(212,168,75,0.1)' : '#fff', color: '#1B2A4A', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
              >
                Yes, I have a website
              </button>
              <button
                onClick={() => setHasWebsite(false)}
                style={{ padding: '10px 24px', borderRadius: 100, border: `2px solid ${hasWebsite === false ? '#D4A84B' : 'rgba(27,42,74,0.2)'}`, background: hasWebsite === false ? 'rgba(212,168,75,0.1)' : '#fff', color: '#1B2A4A', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
              >
                No, I don&apos;t
              </button>
            </div>
            {hasWebsite === true && (
              <div style={{ marginTop: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 6 }}>Your website URL (optional)</label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                  placeholder="e.g. www.nithvalleyplumbing.co.uk"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 8, fontSize: 13, color: '#1B2A4A', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>
            )}
          </div>

          <button
            onClick={() => setStarted(true)}
            disabled={hasWebsite === null || !businessName.trim()}
            style={{
              padding: '13px 32px',
              background: '#D4A84B',
              color: '#1B2A4A',
              border: 'none',
              borderRadius: 100,
              fontSize: 14,
              fontWeight: 700,
              cursor: hasWebsite === null || !businessName.trim() ? 'default' : 'pointer',
              opacity: hasWebsite === null || !businessName.trim() ? 0.45 : 1,
              transition: 'opacity 0.15s ease',
            }}
          >
            {hasWebsite === false ? 'See your results →' : 'Start the check →'}
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#9AA8B8', marginTop: 32 }}>
          Built by <a href="https://nithdigital.uk" style={{ color: '#9AA8B8' }}>Nith Digital</a>
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#5A6A7A', fontWeight: 600 }}>
            {Object.keys(answers).length} of {QUESTIONS.length} answered
          </span>
          <span style={{ fontSize: 12, color: '#5A6A7A' }}>{businessName}</span>
        </div>
        <div style={{ height: 6, background: 'rgba(27,42,74,0.1)', borderRadius: 100, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              background: '#D4A84B',
              borderRadius: 100,
              width: `${(Object.keys(answers).length / QUESTIONS.length) * 100}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {QUESTIONS.map((q, i) => {
          const a = answers[q.id]
          return (
            <div
              key={q.id}
              style={{
                background: a ? (a === 'yes' ? 'rgba(39,174,96,0.04)' : 'rgba(27,42,74,0.02)') : '#F5F0E6',
                border: `1px solid ${a ? 'rgba(27,42,74,0.1)' : 'rgba(27,42,74,0.08)'}`,
                borderRadius: 12,
                padding: '20px 24px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#D4A84B', minWidth: 20 }}>{i + 1}</span>
                <p style={{ fontSize: 14, color: '#1B2A4A', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{q.text}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, paddingLeft: 32, flexWrap: 'wrap' }}>
                {(['yes', 'no', 'notsure'] as const).map(val => (
                  <button
                    key={val}
                    onClick={() => setAnswer(q.id, val)}
                    style={answerBtnStyle(a === val, val)}
                    aria-pressed={a === val}
                  >
                    {val === 'yes' ? 'Yes' : val === 'no' ? 'No' : 'Not sure'}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <button
          onClick={() => setShowResults(true)}
          disabled={!allAnswered}
          style={{
            padding: '14px 40px',
            background: '#D4A84B',
            color: '#1B2A4A',
            border: 'none',
            borderRadius: 100,
            fontSize: 15,
            fontWeight: 700,
            cursor: allAnswered ? 'pointer' : 'default',
            opacity: allAnswered ? 1 : 0.45,
            transition: 'opacity 0.15s ease',
          }}
        >
          Get my score →
        </button>
        {!allAnswered && (
          <p style={{ fontSize: 12, color: '#9AA8B8', marginTop: 8 }}>
            Answer all {QUESTIONS.length} questions to see your score
          </p>
        )}
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: '#9AA8B8', marginTop: 32 }}>
        Built by <a href="https://nithdigital.uk" style={{ color: '#9AA8B8' }}>Nith Digital</a>
      </p>
    </div>
  )
}
