// SF_Usados logo as inline SVG — white + metallic gray, always crisp
export default function SFLogo({ size = 48 }: { size?: number }) {
  const h = size
  const w = size * 2.2

  return (
    <svg width={w} height={h} viewBox="0 0 220 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow layer — metallic gray offset */}
      <g transform="translate(8,8)" opacity="0.55">
        {/* S shadow */}
        <path d="M20 15 L80 15 L65 40 L80 40 L45 85 L10 85 L30 58 L15 58 Z" fill="#8A8A8A"/>
        {/* F shadow */}
        <path d="M100 15 L160 15 L145 38 L130 38 L125 52 L155 52 L142 72 L112 72 L108 85 L75 85 L100 38 L88 38 Z" fill="#8A8A8A"/>
      </g>
      {/* White layer — main letterforms */}
      {/* S */}
      <path d="M12 8 L72 8 L57 33 L72 33 L37 78 L2 78 L22 51 L7 51 Z" fill="#FFFFFF"/>
      {/* F */}
      <path d="M92 8 L152 8 L137 31 L122 31 L117 45 L147 45 L134 65 L104 65 L100 78 L67 78 L92 31 L80 31 Z" fill="#FFFFFF"/>
    </svg>
  )
}
