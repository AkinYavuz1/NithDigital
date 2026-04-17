'use client'

interface LogoProps {
  size?: number
}

export default function Logo({ size = 32 }: LogoProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: '#E85D3A',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body)',
        fontSize: size * 0.5,
        fontWeight: 700,
        color: '#FFFFFF',
        flexShrink: 0,
      }}
    >
      N
    </div>
  )
}
