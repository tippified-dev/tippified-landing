interface VerifiedBadgeProps {
  size?: number;
  className?: string;
}

const VerifiedBadge = ({ size = 18, className = "" }: VerifiedBadgeProps) => {
  const points = 16;
  const cx = 50;
  const cy = 50;
  const outer = 46;
  const inner = 39;

  let d = "";

  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI * i) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;

    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;

    if (i === 0) {
      d += `M ${x} ${y}`;
    } else {
      d += ` Q ${cx + Math.cos(angle - Math.PI / (points * 2)) * outer}
                  ${cy + Math.sin(angle - Math.PI / (points * 2)) * outer}
                  ${x} ${y}`;
    }
  }

  d += " Z";

  return (
    <span
      title="Verified"
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} fill="none">
        {/* Rosette */}
        <path d={d} fill="#7C3AED" />

        {/* Check */}
        <path
          d="M33 52L45 64L68 39"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};

export default VerifiedBadge;
