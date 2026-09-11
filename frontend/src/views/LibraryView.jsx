import PageHeader from "../components/ui/PageHeader";
import { fmtGrams, fmtMoney, fmtPerGram, initials } from "../lib/format";
import { useSpoolStore } from "../stores/spool";
import { useModalStore } from "../stores/ui";

function isLight(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

export default function LibraryView() {
  const { filaments, members, currency } = useSpoolStore();
  const open = useModalStore((s) => s.open);

  return (
    <div>
      <PageHeader kicker="Shared stock" title="Filament library" actionLabel="+ Add filament" onAction={() => open("spool")} />

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
        {filaments.map((f) => {
          const owner = members.find((m) => m.id === f.owner_id);
          const pct = Math.max(0, Math.min(100, Math.round((f.grams / f.full_grams) * 100)));
          const light = isLight(f.hex);
          return (
            <div key={f.id} className="bg-base-100 border border-black/10 rounded-2xl overflow-hidden flex flex-col">
              <div className="h-16 relative flex items-end p-3" style={{ background: f.hex }}>
                <span
                  className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: light ? "rgba(0,0,0,.14)" : "rgba(255,255,255,.22)",
                    color: light ? "#1c1b1f" : "#fff",
                  }}
                >
                  {f.material}
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col">
                <div className="font-semibold text-[14.5px] leading-tight">{f.color_name}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className="w-[22px] h-[22px] rounded-full inline-flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                    style={{ background: owner ? owner.color : "#999" }}
                  >
                    {owner ? initials(owner.name) : "?"}
                  </span>
                  <span className="text-[11.5px] text-black/45">
                    {f.brand} · {owner ? owner.name : "Shared"}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="font-mono font-semibold text-[17px]">{fmtMoney(f.price_per_kg, currency)}</span>
                  <span className="text-[11px] text-black/40">/kg</span>
                </div>
                <div className="text-[11.5px] text-black/50 mt-0.5 font-mono">
                  {fmtPerGram(f.price_per_kg / 1000, currency)} / g
                </div>
                <div className="mt-3.5">
                  <div className="flex justify-between text-[11px] text-black/50 mb-1">
                    <span>on spool</span>
                    <span className="font-mono">{fmtGrams(f.grams)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-black/[.08] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: pct < 20 ? "#d63b2f" : "#15141a" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filaments.length === 0 && <p className="text-sm text-black/40">No filament in the library yet.</p>}
      </div>
    </div>
  );
}
