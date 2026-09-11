export default function LineChart({ labels, series }) {
  const W = 500,
    H = 180,
    padL = 36,
    padR = 12,
    padT = 14,
    padB = 32;
  const cW = W - padL - padR,
    cH = H - padT - padB;
  const n = labels.length;
  const allVals = series.flatMap((s) => s.values);
  const maxVal = Math.max(...allVals, 1);
  const nTicks = 4;
  const tickStep = Math.ceil(maxVal / nTicks / 10) * 10 || 1;
  const yMax = tickStep * nTicks;
  const cx = (i) => padL + i * (cW / Math.max(1, n - 1));
  const cy = (v) => padT + cH - (v / yMax) * cH;

  return (
    <div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 mb-3">
        {series.map((s) => (
          <div key={s.name} className="flex items-center gap-1.5 text-xs">
            <span className="w-3 h-3 rounded-full inline-block shrink-0" style={{ background: s.color }} />
            <span className="font-medium">{s.name}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible">
        {Array.from({ length: nTicks + 1 }, (_, i) => {
          const v = i * tickStep;
          const y = cy(v);
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="rgba(0,0,0,.08)" strokeWidth={1} />
              {v > 0 && (
                <text x={padL - 5} y={y + 4} textAnchor="end" fontSize={9} fill="rgba(0,0,0,.42)">
                  {v}g
                </text>
              )}
            </g>
          );
        })}
        {labels.map((label, i) => (
          <text key={i} x={cx(i)} y={H - 2} textAnchor="middle" fontSize={9.5} fill="rgba(0,0,0,.45)">
            {label}
          </text>
        ))}
        {series.map((s) => {
          const pts = s.values.map((v, i) => [cx(i), cy(v)]);
          const d = pts
            .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
            .join(" ");
          return (
            <g key={s.name}>
              <path d={d} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
              {pts.map(([px, py], i) => (
                <circle key={i} cx={px} cy={py} r={4} fill="#fff" stroke={s.color} strokeWidth={2.5} />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
