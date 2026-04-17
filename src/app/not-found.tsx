import Link from 'next/link'
import Logo from '@/components/Logo'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FAF8F5',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      <Logo size={48} />
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 32,
          fontWeight: 400,
          color: '#1A1A1A',
          marginTop: 24,
          marginBottom: 8,
        }}
      >
        Page not found
      </h1>
      <p style={{ fontSize: 14, color: '#7A7A7A', marginBottom: 32, maxWidth: 360 }}>
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        style={{
          padding: '12px 28px',
          background: '#E85D3A',
          color: '#fff',
          borderRadius: 100,
          fontSize: 13,
          fontWeight: 600,
          border: 'none',
        }}
      >
        Back to homepage
      </Link>
    </div>
  )
}
