export default function Loading() {
  return (
    <main style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <div style={{
        height: 64,
        borderBottom: '1px solid #1c1c1c',
        background: 'rgba(10,10,10,0.96)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        maxWidth: 1200,
        margin: '0 auto',
        gap: 12,
      }}>
        <div className="skeleton" style={{ width: 40, height: 32, borderRadius: 6 }} />
        <div className="skeleton" style={{ width: 120, height: 18, borderRadius: 6 }} />
      </div>

      <section style={{ padding: '40px 20px 36px', borderBottom: '1px solid #161616' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="skeleton" style={{ height: 56, width: 220, maxWidth: '80%', borderRadius: 8, marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 14, width: 280, borderRadius: 6, marginBottom: 20 }} />
          <div className="skeleton" style={{ height: 3, width: 100, borderRadius: 2, marginBottom: 20 }} />
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div className="skeleton" style={{ height: 14, width: 160, borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 14, width: 120, borderRadius: 6 }} />
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 80px' }}>
        <div className="skeleton" style={{ height: 48, width: '100%', maxWidth: 520, borderRadius: 10, marginBottom: 28 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: 16, overflow: 'hidden' }}>
              <div className="skeleton" style={{ paddingBottom: '62%' }} />
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="skeleton" style={{ height: 20, width: '70%' }} />
                <div className="skeleton" style={{ height: 28, width: '50%' }} />
                <div style={{ display: 'flex', gap: 6 }}>
                  <div className="skeleton" style={{ height: 28, width: 80 }} />
                  <div className="skeleton" style={{ height: 28, width: 60 }} />
                </div>
                <div className="skeleton" style={{ height: 40, borderRadius: 10 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
