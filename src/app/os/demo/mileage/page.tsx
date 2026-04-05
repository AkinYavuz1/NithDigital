'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import OSPageHeader from '@/components/OSPageHeader'
import { formatCurrency } from '@/lib/taxCalc'
import { useDemo } from '@/lib/demo-context'

export default function DemoMileagePage() {
  const { data } = useDemo()
  const logs = data.mileage

  const totalMiles = logs.reduce((s, l) => s + l.miles, 0)
  const totalClaim = logs.reduce((s, l) => s + l.total_claim, 0)
  const milesAt45p = Math.min(totalMiles, 10000)
  const milesAt25p = Math.max(0, totalMiles - 10000)

  return (
    <div>
      <OSPageHeader title="Mileage" description="Track business journeys for tax relief"
        action={
          <Link href="/os/demo/mileage/new" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
            <Plus size={14} /> Add journey
          </Link>
        }
      />
      <div style={{ padding: 32 }} className="os-page-wrap">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }} className="mileage-stats-grid">
          {[
            { label: 'Total miles (tax year)', value: `${totalMiles.toFixed(1)} mi` },
            { label: 'Total claim', value: formatCurrency(totalClaim) },
            { label: 'Miles at 45p rate', value: `${milesAt45p.toFixed(0)} / 10,000` },
          ].map(kpi => (
            <div key={kpi.label} style={{ background: '#1B2A4A', borderRadius: 8, padding: '16px 20px' }}>
              <div style={{ fontSize: 11, color: 'rgba(245,240,230,0.5)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{kpi.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#D4A84B' }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 8, padding: '16px 20px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span>Miles at 45p rate: <strong>{milesAt45p.toFixed(0)}</strong> / 10,000</span>
            {milesAt25p > 0 && <span style={{ color: '#D4A84B' }}>+{milesAt25p.toFixed(0)} miles at 25p rate</span>}
          </div>
          <div style={{ height: 8, background: 'rgba(27,42,74,0.1)', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: milesAt45p >= 10000 ? '#EF4444' : '#D4A84B', borderRadius: 100, width: `${Math.min(100, (milesAt45p / 10000) * 100)}%` }} />
          </div>
          <p style={{ fontSize: 11, color: '#5A6A7A', marginTop: 8 }}>HMRC rate: 45p/mile for first 10,000 miles, 25p/mile thereafter</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 560 }}>
            <thead>
              <tr style={{ background: '#F5F0E6' }}>
                {['Date', 'From', 'To', 'Miles', 'Purpose', 'Rate', 'Claim'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: '#5A6A7A', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                  <td style={{ padding: '12px 16px', color: '#5A6A7A' }}>{new Date(log.date).toLocaleDateString('en-GB')}</td>
                  <td style={{ padding: '12px 16px' }}>{log.from_location}</td>
                  <td style={{ padding: '12px 16px' }}>{log.to_location}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{log.miles.toFixed(1)}</td>
                  <td style={{ padding: '12px 16px', color: '#5A6A7A' }}>{log.purpose}</td>
                  <td style={{ padding: '12px 16px' }}>{(log.rate_per_mile * 100).toFixed(0)}p</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{formatCurrency(log.total_claim)}</td>
                </tr>
              ))}
              <tr style={{ background: '#F5F0E6', fontWeight: 700 }}>
                <td colSpan={3} style={{ padding: '12px 16px' }}>Total</td>
                <td style={{ padding: '12px 16px' }}>{totalMiles.toFixed(1)}</td>
                <td colSpan={2} />
                <td style={{ padding: '12px 16px', color: '#D4A84B' }}>{formatCurrency(totalClaim)}</td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>

      <style>{`
        @media (max-width: 640px) {
          .mileage-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
  )
}
