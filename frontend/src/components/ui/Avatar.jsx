import { initials } from "../../lib/format";

export default function Avatar({ name, color, size = 32 }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-display font-bold text-white shrink-0"
      style={{ width: size, height: size, background: color, fontSize: Math.round(size * 0.38) }}
    >
      {initials(name)}
    </span>
  );
}
