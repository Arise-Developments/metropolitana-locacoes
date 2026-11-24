import type { BodyType } from "@/data/cars";

/**
 * Ilustração vetorial do carro (vista lateral) por tipo de carroceria.
 * Substitui fotos enquanto o cliente não tem imagens próprias da frota.
 */
const bodies: Record<BodyType, { body: string; windows: string[] }> = {
  hatch: {
    body: "M28 100V74Q28 46 56 40L80 34Q90 32 110 32H190Q205 32 220 44L248 64L282 70Q296 74 296 86V100Z",
    windows: ["M54 62L62 45Q66 40 80 40H140V62Z", "M148 40H188Q200 40 210 48L228 62H148Z"],
  },
  sedan: {
    body: "M18 100V80Q20 68 38 66L94 62L128 38Q138 32 158 32H212Q230 32 243 44L268 62L292 68Q302 72 302 84V100Z",
    windows: ["M106 62L134 41Q138 39 146 39H180V62Z", "M188 39H210Q222 39 232 49L244 62H188Z"],
  },
  suv: {
    body: "M22 100V58Q22 34 44 30L200 26Q214 26 226 38L252 60L288 66Q300 70 300 84V100Z",
    windows: ["M40 58L44 38L140 35V58Z", "M148 35L196 33Q208 33 216 41L232 58H148Z"],
  },
  van: {
    body: "M20 100V30Q20 20 30 20H218Q230 20 238 30L266 62L292 68Q300 72 300 84V100Z",
    windows: ["M198 28H220Q228 28 234 36L250 60H198Z"],
  },
};

export function CarArt({
  body,
  color,
  className = "",
  title,
}: {
  body: BodyType;
  color: string;
  className?: string;
  title?: string;
}) {
  const shape = bodies[body];
  const id = `g-${body}-${color.replace("#", "")}`;
  return (
    <svg viewBox="0 0 320 132" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <ellipse cx="160" cy="120" rx="150" ry="7" fill="#000" opacity="0.18" />
      <path d={shape.body} fill={color} />
      <path d={shape.body} fill={`url(#${id})`} />
      {shape.windows.map((w) => (
        <path key={w} d={w} fill="#0b1626" opacity="0.82" />
      ))}
      <rect x="282" y="74" width="12" height="5" rx="2" fill="#fde7a8" />
      <rect x="22" y="76" width="8" height="5" rx="2" fill="#e25555" />
      {[80, 240].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="102" r="24" fill="#0b1220" />
          <circle cx={cx} cy="102" r="12" fill="#9aa7b8" />
          <circle cx={cx} cy="102" r="4" fill="#0b1220" />
        </g>
      ))}
    </svg>
  );
}
