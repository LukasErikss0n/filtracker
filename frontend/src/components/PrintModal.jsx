import { useState } from "react";
import Avatar from "./ui/Avatar";
import { fmtGrams, fmtMoney, fmtPerGram } from "../lib/format";
import { useSpoolStore } from "../stores/spool";
import { useModalStore } from "../stores/ui";

export default function PrintModal() {
  const { members, filaments, currency, logPrint } = useSpoolStore();
  const close = useModalStore((s) => s.close);
  const [memberId, setMemberId] = useState(null);
  const [filamentId, setFilamentId] = useState(null);
  const [grams, setGrams] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const member = members.find((m) => m.id === memberId);
  const filament = filaments.find((f) => f.id === filamentId);
  const g = parseFloat(grams) || 0;
  const fromBalance = member ? Math.min(member.gram_balance, g) : 0;
  const shortfall = Math.max(0, g - fromBalance);
  const perGram = filament ? filament.price_per_kg / 1000 : 0;
  const cost = +(shortfall * perGram).toFixed(2);
  const resultBalance = member ? member.gram_balance - fromBalance : 0;
  const complete = Boolean(memberId && filamentId && g > 0);

  async function submit() {
    if (!complete || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await logPrint(memberId, filamentId, g);
      close();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h3 className="font-display font-bold text-xl">Log a print</h3>
      <p className="text-sm text-black/50 mt-1">Charge grams × price to a member.</p>

      <div className="text-xs font-semibold text-black/55 mt-5 mb-2 tracking-wide">WHO PRINTED</div>
      <div className="flex flex-wrap gap-2">
        {members.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMemberId(m.id)}
            className={`btn btn-sm rounded-full gap-2 ${memberId === m.id ? "btn-neutral" : "bg-base-200 border-black/10"}`}
          >
            <Avatar name={m.name} color={m.color} size={20} />
            {m.name}
          </button>
        ))}
      </div>

      <div className="text-xs font-semibold text-black/55 mt-5 mb-2 tracking-wide">FILAMENT</div>
      <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
        {filaments.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilamentId(f.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left ${
              filamentId === f.id ? "border-primary bg-primary/5" : "border-black/10 bg-base-200"
            }`}
          >
            <span className="w-5 h-5 rounded shrink-0" style={{ background: f.hex }} />
            <span className="flex-1 min-w-0">
              <b className="font-semibold text-sm">{f.color_name}</b>{" "}
              <span className="text-black/45 text-xs">{f.material}</span>
            </span>
            <span className="font-mono text-xs text-black/60">
              {fmtPerGram(f.price_per_kg / 1000, currency)}/g
            </span>
          </button>
        ))}
        {filaments.length === 0 && <p className="text-sm text-black/40">No filament in the library yet.</p>}
      </div>

      <div className="text-xs font-semibold text-black/55 mt-5 mb-2 tracking-wide">GRAMS USED</div>
      <div className="relative">
        <input
          type="number"
          min="0"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
          placeholder="0"
          className="input input-bordered w-full font-mono font-semibold pr-10"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 text-sm font-mono">g</span>
      </div>

      <div className={`mt-5 rounded-2xl p-4 ${shortfall > 0 && complete ? "bg-error/10" : "bg-base-200"}`}>
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-black/60">Cost of this print</span>
          <span className="font-mono font-semibold text-xl">
            {shortfall > 0 ? `${fmtMoney(cost, currency)} cash` : "Free (from stock)"}
          </span>
        </div>
        <div className="flex justify-between items-baseline mt-2.5 pt-2.5 border-t border-black/10">
          <span className="text-xs text-black/60">
            {member ? `${member.name}'s gram balance after` : "Gram balance after"}
          </span>
          <span className={`font-mono font-semibold text-sm ${resultBalance <= 0 ? "text-error" : "text-success"}`}>
            {member ? fmtGrams(resultBalance) : "—"}
          </span>
        </div>
        <div
          className={`text-xs mt-2.5 font-medium ${
            !complete ? "text-black/40" : shortfall > 0 ? "text-error" : "text-success"
          }`}
        >
          {!complete
            ? "Pick a member, filament and grams."
            : shortfall > 0
              ? `⚠ ${fmtGrams(shortfall)} has no stock — ${fmtMoney(cost, currency)} will be charged.`
              : `✓ Fully covered by ${member.name}'s gram balance.`}
        </div>
      </div>

      {error && <div className="text-error text-sm mt-3">{error}</div>}

      <div className="flex gap-3 mt-5">
        <button type="button" className="btn bg-base-200 border-black/10" onClick={close}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary flex-1"
          disabled={!complete || submitting}
          onClick={submit}
        >
          {complete
            ? cost > 0
              ? `Deduct ${fmtGrams(g)} + charge ${fmtMoney(cost, currency)}`
              : `Deduct ${fmtGrams(g)} from balance`
            : "Log print"}
        </button>
      </div>
    </>
  );
}
