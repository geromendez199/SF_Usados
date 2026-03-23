import Link from 'next/link'
import BrandMark from './BrandMark'

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
              gap: 14,
              borderRadius: 12,
              marginLeft: -8,
              padding: '6px 8px',
            }}
          >
            <BrandMark size="md" />
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: 14 }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  fontSize: 15,
                  color: 'var(--text-secondary)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  display: 'block',
                }}
              >
                _Usados
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--text-tertiary)',
                  marginTop: 2,
                  display: 'block',
                  letterSpacing: '-0.01em',
                }}
              >
                Santa Fe
              </span>
            </div>
          </Link>

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
    </nav>
  )
}
