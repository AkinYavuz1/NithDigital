interface OSPageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export default function OSPageHeader({ title, description, action }: OSPageHeaderProps) {
  return (
    <div
      style={{
        padding: '32px 32px 24px',
        borderBottom: '1px solid rgba(27,42,74,0.08)',
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 16,
      }}
    >
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1B2A4A', marginBottom: 4 }}>
          {title}
        </h1>
        {description && (
          <p style={{ fontSize: 13, color: '#5A6A7A' }}>{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
