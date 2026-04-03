'use client'

import OSPageHeader from '@/components/OSPageHeader'
import Link from 'next/link'

export default function DemoFilesPage() {
  return (
    <div>
      <OSPageHeader title="Files" description="Share files securely with clients" />
      <div style={{ padding: 32, maxWidth: 640 }}>
        <div style={{ background: '#fff', borderRadius: 10, padding: 40, textAlign: 'center', border: '1px solid rgba(27,42,74,0.08)' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📁</div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1B2A4A', marginBottom: 8 }}>File uploads available with a free account</h3>
          <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 24, lineHeight: 1.6 }}>
            In your real account you can upload files, generate secure share links for clients, and track download counts — all linked to specific clients.
          </p>
          <Link
            href="/auth/signup"
            style={{ display: 'inline-block', padding: '12px 28px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}
          >
            Create free account to upload files
          </Link>
        </div>

        {/* Demo preview of what the file manager looks like */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A', marginBottom: 16 }}>Preview: what your file manager will look like</h3>
          <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', opacity: 0.6, pointerEvents: 'none' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F5F0E6' }}>
                  {['File', 'Client', 'Uploaded', 'Size', 'Downloads'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: '#5A6A7A', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { file: 'mcgregor-website-files.zip', client: 'McGregor Plumbing', date: '15 Mar 2026', size: '2.4 MB', downloads: 3 },
                  { file: 'invoice-0047.pdf', client: 'McGregor Plumbing', date: '10 Oct 2025', size: '48 KB', downloads: 1 },
                  { file: 'seo-report-galloway.pdf', client: 'Galloway Electrical', date: '05 Nov 2025', size: '280 KB', downloads: 2 },
                ].map(f => (
                  <tr key={f.file} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>📄 {f.file}</td>
                    <td style={{ padding: '12px 16px', color: '#5A6A7A' }}>{f.client}</td>
                    <td style={{ padding: '12px 16px', color: '#5A6A7A' }}>{f.date}</td>
                    <td style={{ padding: '12px 16px', color: '#5A6A7A' }}>{f.size}</td>
                    <td style={{ padding: '12px 16px' }}>{f.downloads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
