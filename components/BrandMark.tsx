/**
 * Marca tipográfica “SF” — tratamiento refinado estilo Apple (gradiente sutil).
 */
export default function BrandMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const fontSize =
    size === 'sm' ? 24 : size === 'md' ? 34 : size === 'lg' ? 52 : 'clamp(56px, 12vw, 96px)'

  return (
    <span
      aria-hidden
      className="brand-mark-sf"
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontStyle: 'normal',
        fontSize,
        letterSpacing: '-0.045em',
        lineHeight: 1,
        display: 'inline-block',
        userSelect: 'none',
        background: 'linear-gradient(180deg, #ffffff 20%, #d1d1d6 45%, #86868b 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
      }}
    >
      SF
    </span>
  )
}
