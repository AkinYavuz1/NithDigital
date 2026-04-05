'use client'

import { useState } from 'react'
import Link from 'next/link'

type BusinessType = 'sole-trader' | 'landlord' | 'both' | null
type IncomeBand = 'under-20k' | '20k-30k' | '30k-50k' | 'over-50k' | null
type RecordKeeping = 'paper' | 'spreadsheet' | 'software' | 'accountant' | 'nothing' | null

interface MTDResult {
  badge: string
  badgeColor: string
  startDate: string
  explanation: string
  checklist: string[]
  firstQuarterlyUpdate: string | null
  signUpDeadline: string
}

function getMTDResult(income: IncomeBand, records: RecordKeeping): MTDResult {
  const baseChecklist: Record<NonNullable<RecordKeeping>, string[]> = {
    paper: [
      'Stop using paper records — HMRC will not accept them under MTD',
      'Choose MTD-compatible software (free options available from HMRC)',
      'Start recording every transaction digitally from now',
      'Sign up for MTD for Income Tax on GOV.UK before your deadline',
      'Submit your first quarterly update through your software',
    ],
    nothing: [
      'Start recording all income and expenses immediately — even a spreadsheet is a start',
      'Choose MTD-compatible software (free options available from HMRC)',
      'Work through your records from the start of the current tax year',
      'Sign up for MTD for Income Tax on GOV.UK before your deadline',
      'Submit your first quarterly update through your software',
    ],
    spreadsheet: [
      'Check if your spreadsheet can connect to bridging software (e.g. Xero, TaxCalc)',
      'Alternatively, move to a fully MTD-compatible accounting package',
      'Sign up for MTD for Income Tax on GOV.UK before your deadline',
      'Ensure your first quarterly update is submitted on time',
    ],
    software: [
      'Confirm your existing software is on HMRC\'s MTD-compatible list',
      'Contact your software provider to enable MTD for Income Tax',
      'Sign up for MTD for Income Tax on GOV.UK before your deadline',
      'Your quarterly updates should flow automatically from your software',
    ],
    accountant: [
      'Contact your accountant and confirm they are MTD-ready',
      'Ask which MTD-compatible software they will use on your behalf',
      'Ensure your accountant registers you for MTD before the deadline',
      'Agree a process for submitting quarterly updates going forward',
    ],
  }

  const checklists: Record<NonNullable<RecordKeeping>, string[]> = baseChecklist

  if (income === 'over-50k') {
    return {
      badge: 'Action required now',
      badgeColor: '#c0392b',
      startDate: '6 April 2026',
      explanation:
        'Because your income exceeds £50,000, Making Tax Digital for Income Tax is mandatory from 6 April 2026. You must use HMRC-recognised software to keep digital records and submit four quarterly updates to HMRC each year, plus an end-of-year declaration.',
      checklist: checklists[records ?? 'paper'],
      firstQuarterlyUpdate: '7 August 2026',
      signUpDeadline: '6 April 2026',
    }
  }
  if (income === '30k-50k') {
    return {
      badge: 'Prepare for April 2027',
      badgeColor: '#e67e22',
      startDate: '6 April 2027',
      explanation:
        'With income between £30,000 and £50,000, MTD for Income Tax becomes mandatory from 6 April 2027. You have time to prepare, but getting set up now means less stress when the deadline arrives.',
      checklist: checklists[records ?? 'paper'],
      firstQuarterlyUpdate: null,
      signUpDeadline: '6 April 2027',
    }
  }
  if (income === '20k-30k') {
    return {
      badge: 'Coming April 2028',
      badgeColor: '#2980b9',
      startDate: '6 April 2028',
      explanation:
        'With income between £20,000 and £30,000, MTD for Income Tax applies from 6 April 2028. You have a couple of years, but building good digital record-keeping habits now will make the transition easy.',
      checklist: checklists[records ?? 'paper'],
      firstQuarterlyUpdate: null,
      signUpDeadline: '6 April 2028',
    }
  }
  return {
    badge: 'Not currently required',
    badgeColor: '#27ae60',
    startDate: 'Not yet confirmed',
    explanation:
      'With income under £20,000, Making Tax Digital for Income Tax is not currently mandated for you. HMRC may extend it in the future, so it\'s worth keeping an eye on updates. Getting into good digital record-keeping habits now is still a smart move.',
    checklist: [
      'Keep monitoring HMRC announcements — the threshold may be extended',
      'Consider using free accounting software anyway to build good habits',
      'Make sure you\'re filing Self Assessment on time each January',
    ],
    firstQuarterlyUpdate: null,
    signUpDeadline: 'Not yet required',
  }
}

export default function MTDCheckerClient() {
  const [step, setStep] = useState(1)
  const [businessType, setBusinessType] = useState<BusinessType>(null)
  const [income, setIncome] = useState<IncomeBand>(null)
  const [records, setRecords] = useState<RecordKeeping>(null)
  const [showResults, setShowResults] = useState(false)

  const result = income && records ? getMTDResult(income, records) : null

  const handleNext = () => {
    if (step === 1 && businessType) setStep(2)
    else if (step === 2 && income) setStep(3)
    else if (step === 3 && records) setShowResults(true)
  }

  const reset = () => {
    setStep(1)
    setBusinessType(null)
    setIncome(null)
    setRecords(null)
    setShowResults(false)
  }

  const radioStyle = (selected: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 18px',
    border: `2px solid ${selected ? '#D4A84B' : 'rgba(27,42,74,0.15)'}`,
    borderRadius: 8,
    cursor: 'pointer',
    background: selected ? 'rgba(212,168,75,0.08)' : '#fff',
    marginBottom: 10,
    transition: 'all 0.15s ease',
  })

  const dotStyle = (selected: boolean) => ({
    width: 18,
    height: 18,
    borderRadius: '50%',
    border: `2px solid ${selected ? '#D4A84B' : 'rgba(27,42,74,0.3)'}`,
    background: selected ? '#D4A84B' : 'transparent',
    flexShrink: 0,
    transition: 'all 0.15s ease',
  })

  if (showResults && result) {
    return (
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>
        <div
          style={{
            animation: 'slideUp 0.4s ease forwards',
          }}
        >
          {/* Status badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px',
              borderRadius: 100,
              background: result.badgeColor,
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 24,
            }}
          >
            {result.badge}
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#1B2A4A', marginBottom: 8, fontWeight: 400 }}>
            Your MTD start date: <strong>{result.startDate}</strong>
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#4A5A6A', marginBottom: 32, maxWidth: 640 }}>
            {result.explanation}
          </p>

          {/* Checklist */}
          <div style={{ background: '#F5F0E6', borderRadius: 12, padding: '28px 32px', marginBottom: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#1B2A4A', marginBottom: 16, fontWeight: 400 }}>
              What you need to do
            </h3>
            <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {result.checklist.map((item, i) => (
                <li key={i} style={{ fontSize: 14, lineHeight: 1.7, color: '#3A4A5A' }}>{item}</li>
              ))}
            </ol>
          </div>

          {/* Key dates */}
          <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', borderRadius: 12, padding: '28px 32px', marginBottom: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#1B2A4A', marginBottom: 16, fontWeight: 400 }}>
              Key dates
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(27,42,74,0.08)' }}>
                <span style={{ fontSize: 14, color: '#4A5A6A' }}>MTD sign-up deadline</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A' }}>{result.signUpDeadline}</span>
              </div>
              {result.firstQuarterlyUpdate && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(27,42,74,0.08)' }}>
                  <span style={{ fontSize: 14, color: '#4A5A6A' }}>First quarterly update due</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A' }}>{result.firstQuarterlyUpdate}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                <span style={{ fontSize: 14, color: '#4A5A6A' }}>Annual declaration deadline</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A' }}>31 January each year</span>
              </div>
            </div>
          </div>

          {/* GOV.UK links */}
          <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', borderRadius: 12, padding: '20px 28px', marginBottom: 32 }}>
            <p style={{ fontSize: 13, color: '#4A5A6A', marginBottom: 10, fontWeight: 600 }}>Useful GOV.UK links</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="https://www.gov.uk/guidance/sign-up-your-business-for-making-tax-digital-for-income-tax" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#D4A84B', textDecoration: 'none', fontWeight: 600 }}>
                Sign up for MTD for Income Tax →
              </a>
              <a href="https://www.gov.uk/guidance/find-software-thats-compatible-with-making-tax-digital-for-income-tax" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#D4A84B', textDecoration: 'none', fontWeight: 600 }}>
                Find MTD-compatible software →
              </a>
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: '#1B2A4A', borderRadius: 12, padding: '36px', textAlign: 'center', marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
              Need help getting your business ready for MTD?
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.65)', marginBottom: 24 }}>
              We build websites and digital tools that make running your business easier. Let&apos;s talk.
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
            <button onClick={reset} style={{ fontSize: 13, color: '#D4A84B', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Start again
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#9AA8B8', marginTop: 32 }}>
            Built by <a href="https://nithdigital.uk" style={{ color: '#9AA8B8' }}>Nith Digital</a>
          </p>
        </div>

        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>
      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 40, alignItems: 'center' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: s === step ? '#D4A84B' : s < step ? '#1B2A4A' : 'rgba(27,42,74,0.12)',
                color: s <= step ? (s === step ? '#1B2A4A' : '#fff') : '#9AA8B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                transition: 'all 0.2s ease',
              }}
            >
              {s < step ? '✓' : s}
            </div>
            <span style={{ fontSize: 12, color: s === step ? '#1B2A4A' : '#9AA8B8', fontWeight: s === step ? 600 : 400 }}>
              {s === 1 ? 'Business type' : s === 2 ? 'Income' : 'Records'}
            </span>
            {s < 3 && <div style={{ width: 32, height: 2, background: 'rgba(27,42,74,0.1)', margin: '0 4px' }} />}
          </div>
        ))}
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: 16, padding: '36px' }}>
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#1B2A4A', marginBottom: 6, fontWeight: 400 }}>
              What best describes you?
            </h2>
            <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 24 }}>Select the option that best fits your situation.</p>

            {([
              ['sole-trader', 'Sole trader', 'Self-employed, running a business on your own'],
              ['landlord', 'Landlord', 'You earn rental income from one or more properties'],
              ['both', 'Both sole trader and landlord', 'You have both self-employment and rental income'],
            ] as [BusinessType, string, string][]).map(([val, label, sub]) => (
              <label key={val} style={radioStyle(businessType === val)}>
                <div style={dotStyle(businessType === val)} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1B2A4A' }}>{label}</div>
                  <div style={{ fontSize: 12, color: '#5A6A7A' }}>{sub}</div>
                </div>
                <input type="radio" value={val ?? ''} checked={businessType === val} onChange={() => setBusinessType(val)} style={{ display: 'none' }} />
              </label>
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#1B2A4A', marginBottom: 6, fontWeight: 400 }}>
              What is your total annual income?
            </h2>
            <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 24 }}>From self-employment and/or property combined.</p>

            {([
              ['under-20k', 'Under £20,000'],
              ['20k-30k', '£20,000 – £30,000'],
              ['30k-50k', '£30,000 – £50,000'],
              ['over-50k', 'Over £50,000'],
            ] as [IncomeBand, string][]).map(([val, label]) => (
              <label key={val} style={radioStyle(income === val)}>
                <div style={dotStyle(income === val)} />
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1B2A4A' }}>{label}</span>
                <input type="radio" value={val ?? ''} checked={income === val} onChange={() => setIncome(val)} style={{ display: 'none' }} />
              </label>
            ))}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#1B2A4A', marginBottom: 6, fontWeight: 400 }}>
              How do you currently keep your business records?
            </h2>
            <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 24 }}>This helps us give you the right advice.</p>

            {([
              ['paper', 'Paper / pen and paper', 'Invoices, receipts, notebooks'],
              ['spreadsheet', 'Spreadsheet', 'Excel, Google Sheets, or similar'],
              ['software', 'Accounting software', 'Xero, Sage, QuickBooks, FreeAgent, etc.'],
              ['accountant', 'My accountant handles everything', 'You pass records to them'],
              ['nothing', "I don't really track it", 'No regular system in place'],
            ] as [RecordKeeping, string, string][]).map(([val, label, sub]) => (
              <label key={val} style={radioStyle(records === val)}>
                <div style={dotStyle(records === val)} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1B2A4A' }}>{label}</div>
                  <div style={{ fontSize: 12, color: '#5A6A7A' }}>{sub}</div>
                </div>
                <input type="radio" value={val ?? ''} checked={records === val} onChange={() => setRecords(val)} style={{ display: 'none' }} />
              </label>
            ))}
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={
            (step === 1 && !businessType) ||
            (step === 2 && !income) ||
            (step === 3 && !records)
          }
          style={{
            marginTop: 24,
            padding: '13px 32px',
            background: '#D4A84B',
            color: '#1B2A4A',
            border: 'none',
            borderRadius: 100,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            opacity:
              (step === 1 && !businessType) ||
              (step === 2 && !income) ||
              (step === 3 && !records)
                ? 0.45
                : 1,
            transition: 'opacity 0.15s ease',
          }}
        >
          {step === 3 ? 'See my results →' : 'Next →'}
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: '#9AA8B8', marginTop: 32 }}>
        Built by <a href="https://nithdigital.uk" style={{ color: '#9AA8B8' }}>Nith Digital</a>
      </p>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
