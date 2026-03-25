import Link from 'next/link'

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 max(20px, env(safe-area-inset-right)) 0 max(20px, env(safe-area-inset-left))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52 }}>

          <Link
            href="/"
            className="nav-brand-link"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 12,
              marginLeft: -8,
              padding: '6px 8px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 30,
                letterSpacing: '-0.045em',
                lineHeight: 1,
                background: 'linear-gradient(180deg, #ffffff 18%, #d9d9de 48%, #8e8e93 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              SF_Usados
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a
              href="/#inventario"
              className="nav-ig-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 500,
                padding: '8px 12px',
                border: '1px solid transparent',
              }}
            >
              Inventario
            </a>
            <a
              href="https://www.instagram.com/sf_usados"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-ig-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 500,
                padding: '8px 12px',
                border: '1px solid transparent',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              <span className="hidden sm:inline">Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
