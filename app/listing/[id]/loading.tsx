export default function ListingLoading() {
  return (
    <main style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <div style={{ height: 52, borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.72)' }} />

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 20px 140px' }}>
        <div className="skeleton" style={{ height: 16, width: 120, borderRadius: 999, marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          <div>
            <div className="skeleton" style={{ height: 220, borderRadius: 24, marginBottom: 18 }} />
            <div className="skeleton" style={{ paddingBottom: '56%', borderRadius: 24, marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ width: 88, height: 62, borderRadius: 14 }} />
              ))}
            </div>
          </div>

          <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: 24, overflow: 'hidden' }}>
            <div style={{ padding: 28, borderBottom: '1px solid #1c1c1c' }}>
              <div className="skeleton" style={{ height: 14, width: 110, borderRadius: 999, marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 54, width: '62%', borderRadius: 12, marginBottom: 18 }} />
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <div className="skeleton" style={{ height: 34, width: 84, borderRadius: 999 }} />
                <div className="skeleton" style={{ height: 34, width: 94, borderRadius: 999 }} />
                <div className="skeleton" style={{ height: 34, width: 90, borderRadius: 999 }} />
              </div>
            </div>

            <div style={{ padding: 28, borderBottom: '1px solid #1c1c1c' }}>
              <div className="skeleton" style={{ height: 48, borderRadius: 999, marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 44, borderRadius: 999, marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 44, borderRadius: 999 }} />
            </div>

            <div style={{ padding: 28, borderBottom: '1px solid #1c1c1c' }}>
              <div className="skeleton" style={{ height: 14, width: 120, borderRadius: 999, marginBottom: 16 }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 76, borderRadius: 16 }} />
                ))}
              </div>
            </div>

            <div style={{ padding: 28 }}>
              <div className="skeleton" style={{ height: 14, width: 140, borderRadius: 999, marginBottom: 14 }} />
              <div className="skeleton" style={{ height: 18, width: '100%', borderRadius: 10, marginBottom: 10 }} />
              <div className="skeleton" style={{ height: 18, width: '92%', borderRadius: 10, marginBottom: 10 }} />
              <div className="skeleton" style={{ height: 18, width: '75%', borderRadius: 10 }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
