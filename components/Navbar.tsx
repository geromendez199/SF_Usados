import Link from 'next/link'
import SFLogo from './SFLogo'

export default function Navbar() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10,10,10,0.96)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid #1c1c1c',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
            <SFLogo size={32} />
            <div style={{ borderLeft: '1px solid #222', paddingLeft: 14 }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic',
                fontSize: 17, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, display: 'block',
              }}>SF_Usados</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: '#555', marginTop: 1, display: 'block' }}>
                Autos usados · Santa Fe
              </span>
            </div>
          </Link>

          {/* Instagram */}
          <a href="https://www.instagram.com/sf_usados" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#666', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: 13, transition: 'color 0.2s' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            <span className="hidden sm:inline">@sf_usados</span>
          </a>
        </div>
      </div>
    </nav>
  )
}
