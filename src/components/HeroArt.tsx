import { CarArt } from "./CarArt";

/** Cena urbana noturna em SVG + sedan — dispensa foto e funciona em qualquer resolução. */
export function HeroArt() {
  return (
    <div className="relative h-full min-h-[360px] overflow-hidden bg-gradient-to-b from-[#3b4c66] via-navy-800 to-navy-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_10%,rgba(169,208,250,0.35),transparent_55%)]" />
      <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <g fill="#0c1d38" opacity="0.9">
          <rect x="0" y="170" width="70" height="230" />
          <rect x="78" y="120" width="56" height="280" />
          <rect x="142" y="200" width="80" height="200" />
          <rect x="230" y="90" width="64" height="310" />
          <rect x="302" y="160" width="90" height="240" />
          <rect x="400" y="60" width="60" height="340" />
          <rect x="468" y="140" width="72" height="260" />
          <rect x="548" y="190" width="52" height="210" />
        </g>
        <g fill="#7cb8f7" opacity="0.28">
          {Array.from({ length: 48 }).map((_, i) => {
            const cols = [92, 104, 116, 244, 256, 268, 280, 414, 426, 438, 482, 500, 518];
            const x = cols[i % cols.length];
            const y = 140 + ((i * 37) % 200);
            return <rect key={i} x={x} y={y} width="6" height="9" />;
          })}
        </g>
        <rect x="0" y="330" width="600" height="70" fill="#050f22" />
        <g stroke="#7cb8f7" strokeOpacity="0.25" strokeWidth="3" strokeDasharray="28 22">
          <line x1="0" y1="372" x2="600" y2="372" />
        </g>
      </svg>
      <div className="absolute right-[6%] bottom-[8%] left-[10%]">
        <CarArt body="sedan" color="#14305a" className="w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" />
      </div>
      <span className="eyebrow absolute top-1/2 right-5 hidden -translate-y-1/2 text-white/80 [writing-mode:vertical-rl] md:block">
        Metropolitana / Locações
      </span>
    </div>
  );
}
