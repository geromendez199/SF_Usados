export default function ListingLoading() {
  return (
    <main style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <div style={{
        height: 64,
        borderBottom: '1px solid #1c1c1c',
        background: 'rgba(10,10,10,0.96)',
      }} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px 80px' }}>
        <div className="skeleton" style={{ height: 14, width: 140, borderRadius: 6, marginBottom: 24 }} />
        <div style={{ display: 'grid', gap: 20 }}>
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #1e1e1e' }}>
            <div className="skeleton" style={{ paddingBottom: '54%' }} />
          </div>
          <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: 14, padding: 24 }}>
            <div className="skeleton" style={{ height: 36, width: '75%', marginBottom: 12, borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 44, width: '45%', marginBottom: 20, borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 12, width: 200, marginBottom: 20, borderRadius: 6 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 64, borderRadius: 8 }} />
              ))}
            </div>
            <div className="skeleton" style={{ height: 48, width: '100%', marginTop: 24, borderRadius: 10 }} />
            <div className="skeleton" style={{ height: 48, width: '100%', marginTop: 10, borderRadius: 10 }} />
          </div>
        </div>
      </div>
    </main>
  )
}
