export default function Loading() {
  return (
    <main style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <div style={{ height: 52, borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.72)' }} />

      <section style={{ padding: '72px 20px 56px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          <div>
            <div className="skeleton" style={{ height: 14, width: 140, borderRadius: 999, marginBottom: 18 }} />
            <div className="skeleton" style={{ height: 82, width: '85%', borderRadius: 22, marginBottom: 18 }} />
            <div className="skeleton" style={{ height: 20, width: '72%', borderRadius: 10, marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 20, width: '64%', borderRadius: 10, marginBottom: 22 }} />
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
              <div className="skeleton" style={{ height: 46, width: 190, borderRadius: 999 }} />
              <div className="skeleton" style={{ height: 46, width: 180, borderRadius: 999 }} />
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div className="skeleton" style={{ height: 34, width: 120, borderRadius: 999 }} />
              <div className="skeleton" style={{ height: 34, width: 100, borderRadius: 999 }} />
              <div className="skeleton" style={{ height: 34, width: 140, borderRadius: 999 }} />
            </div>
          </div>

          <div style={{ borderRadius: 32, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', padding: 24, background: '#111113' }}>
            <div className="skeleton" style={{ height: 28, width: 180, borderRadius: 999, marginBottom: 18 }} />
            <div className="skeleton" style={{ height: 36, width: '78%', borderRadius: 12, marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 16, width: '68%', borderRadius: 10, marginBottom: 22 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 96, borderRadius: 20 }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 20px 120px' }}>
        <div className="skeleton" style={{ height: 170, borderRadius: 30, marginBottom: 28 }} />
        <div className="skeleton" style={{ height: 150, borderRadius: 22, marginBottom: 28 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: 24, overflow: 'hidden' }}>
              <div className="skeleton" style={{ paddingBottom: '62%' }} />
              <div style={{ padding: '18px 20px 20px' }}>
                <div className="skeleton" style={{ height: 22, width: '70%', borderRadius: 8, marginBottom: 12 }} />
                <div className="skeleton" style={{ height: 18, width: '42%', borderRadius: 8, marginBottom: 14 }} />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  <div className="skeleton" style={{ height: 30, width: 90, borderRadius: 999 }} />
                  <div className="skeleton" style={{ height: 30, width: 80, borderRadius: 999 }} />
                  <div className="skeleton" style={{ height: 30, width: 100, borderRadius: 999 }} />
                </div>
                <div className="skeleton" style={{ height: 46, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
