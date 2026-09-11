import PageHeader from "../components/ui/PageHeader";
import Avatar from "../components/ui/Avatar";
import { fmtGrams, fmtMoney } from "../lib/format";
import { useSpoolStore } from "../stores/spool";
import { useModalStore } from "../stores/ui";

export default function MembersView() {
  const { members, currency, markPaid } = useSpoolStore();
  const open = useModalStore((s) => s.open);

  return (
    <div>
      <PageHeader
        kicker="People"
        title="Members"
        actionLabel="+ Add filament"
        onAction={() => open("credit")}
      />

      <div className="bg-base-100 border border-black/10 rounded-2xl overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-[2fr_1fr_1fr] gap-3 px-5 py-3 text-[11px] tracking-wide uppercase text-black/40 font-semibold bg-base-200">
            <span>Member</span>
            <span>Gram balance</span>
            <span>Total printed</span>
          </div>
          {members.map((m) => {
            const balanceColor = m.gram_balance <= 0 ? "text-error" : m.gram_balance < 100 ? "text-warning" : "text-success";
            return (
              <div key={m.id} className="border-t border-black/5">
                <div className="grid grid-cols-[2fr_1fr_1fr] gap-3 items-center px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.name} color={m.color} size={34} />
                    <span className="font-semibold text-sm">{m.name}</span>
                  </div>
                  <span className={`font-mono font-semibold text-[15px] ${balanceColor}`}>
                    {fmtGrams(m.gram_balance)}
                  </span>
                  <span className="font-mono text-sm text-black/70">{fmtGrams(m.grams_printed)}</span>
                </div>
                {m.cash_owed.length > 0 && (
                  <div className="mx-5 mb-3.5 rounded-xl bg-error/5 border border-error/20 p-3 flex flex-col gap-1.5">
                    <div className="text-[11px] font-semibold tracking-wide uppercase text-error mb-0.5">
                      Cash owed
                    </div>
                    {m.cash_owed.map((d) => (
                      <div key={d.creditor_id} className="flex items-center gap-2.5">
                        <span
                          className="w-6 h-6 rounded-full inline-flex items-center justify-center text-[9.5px] font-bold text-white shrink-0"
                          style={{ background: d.creditor_color }}
                        >
                          {d.creditor_name.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="flex-1 text-sm">
                          To <b>{d.creditor_name}</b>
                        </span>
                        <span className="font-mono font-semibold text-sm text-error">
                          {fmtMoney(d.amount, currency)}
                        </span>
                        <button
                          className="btn btn-xs bg-success text-white border-none"
                          onClick={() => markPaid(m.id, d.creditor_id)}
                        >
                          ✓ Paid
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
