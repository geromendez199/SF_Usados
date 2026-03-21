export default function Loading() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px' }}>
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
  )
}
