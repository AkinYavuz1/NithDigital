'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface FileData {
  id: string
  file_name: string
  file_size: number
  file_type: string
  description: string | null
  share_expires_at: string | null
  download_count: number
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileShareClient({ token }: { token: string }) {
  const [file, setFile] = useState<FileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('client_files')
      .select('id, file_name, file_size, file_type, description, share_expires_at, download_count')
      .eq('share_token', token)
      .single()
      .then(({ data }) => {
        if (!data || (data.share_expires_at && new Date(data.share_expires_at) < new Date())) {
          setExpired(true)
        } else {
          setFile(data)
        }
        setLoading(false)
      })
  }, [token])

  return (
    <>
      <header style={{ background: '#1B2A4A', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#F5F0E6', fontWeight: 400, textDecoration: 'none' }}>
          Nith Digital
        </Link>
      </header>

      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        {loading ? (
          <div style={{ color: '#5A6A7A', fontSize: 14 }}>Loading...</div>
        ) : expired ? (
          <div style={{ textAlign: 'center', maxWidth: 420 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#1B2A4A', marginBottom: 12 }}>Link expired or invalid</h1>
            <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.7, marginBottom: 24 }}>
              This download link has expired or is invalid. Contact the sender for a new link.
            </p>
            <Link href="/" style={{ display: 'inline-block', padding: '10px 24px', background: '#1B2A4A', color: '#F5F0E6', borderRadius: 100, fontSize: 13, textDecoration: 'none' }}>
              Go to Nith Digital
            </Link>
          </div>
        ) : file ? (
          <div style={{ textAlign: 'center', maxWidth: 460 }}>
            <div style={{ width: 64, height: 64, background: '#1B2A4A', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>
              📄
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#1B2A4A', marginBottom: 8 }}>
              {file.file_name}
            </h1>
            {file.description && (
              <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 12 }}>{file.description}</p>
            )}
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 24, fontSize: 13, color: '#5A6A7A' }}>
              <span>{formatBytes(file.file_size)}</span>
              <span>·</span>
              <span>{file.file_type.split('/').pop()?.toUpperCase()}</span>
              <span>·</span>
              <span>{file.download_count} download{file.download_count !== 1 ? 's' : ''}</span>
            </div>
            <form action={`/api/files/download/${token}`} method="GET">
              <button
                type="submit"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 32px', background: '#D4A84B', color: '#1B2A4A',
                  borderRadius: 100, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer',
                }}
              >
                ↓ Download file
              </button>
            </form>
            {file.share_expires_at && (
              <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 16 }}>
                Link expires {new Date(file.share_expires_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        ) : null}
      </main>
    </>
  )
}
