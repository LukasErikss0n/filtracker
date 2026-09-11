import { useEffect, useState } from "react";
import Avatar from "./ui/Avatar";
import { fmtGrams } from "../lib/format";
import { useSpoolStore } from "../stores/spool";
import { useModalStore } from "../stores/ui";

const QUICK_GRAMS = [250, 500, 750, 1000];

export default function CreditModal() {
  const { members, creditMember } = useSpoolStore();
  const { close, creditPreset } = useModalStore();
  const [memberId, setMemberId] = useState(creditPreset);
  const [grams, setGrams] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (creditPreset) setMemberId(creditPreset);
  }, [creditPreset]);

  const g = parseFloat(grams) || 0;
  const complete = Boolean(memberId && g > 0);

  async function submit() {
    if (!complete || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await creditMember(memberId, g, note);
      close();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h3 className="font-display font-bold text-xl">Add filament</h3>
      <p className="text-sm text-black/50 mt-1">
        Credit a member's gram balance. They spend these grams when they print.
      </p>

      <div className="text-xs font-semibold text-black/55 mt-5 mb-2 tracking-wide">WHO BROUGHT FILAMENT</div>
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

      <div className="text-xs font-semibold text-black/55 mt-5 mb-2 tracking-wide">GRAMS</div>
      <div className="relative">
        <input
          type="number"
          min="0"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
          placeholder="1000"
          className="input input-bordered w-full font-mono font-semibold pr-10"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 text-sm font-mono">g</span>
      </div>
      <div className="flex gap-2 mt-2.5">
        {QUICK_GRAMS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setGrams(String(v))}
            className="btn btn-sm flex-1 bg-base-200 border-black/10 font-mono"
          >
            {v}g
          </button>
        ))}
      </div>

      <div className="text-xs font-semibold text-black/55 mt-4 mb-2 tracking-wide">NOTE (optional)</div>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="e.g. Bambu Lab PLA Basic 1kg"
        className="input input-bordered w-full"
      />

      {error && <div className="text-error text-sm mt-3">{error}</div>}

      <div className="flex gap-3 mt-5">
        <button type="button" className="btn bg-base-200 border-black/10" onClick={close}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary flex-1" disabled={!complete || submitting} onClick={submit}>
          {complete ? `Add ${fmtGrams(g)} to balance` : "Add filament"}
        </button>
      </div>
    </>
  );
}
