import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Avatar from "../components/ui/Avatar";
import LedgerRow from "../components/ui/LedgerRow";
import { fmtGrams, fmtMoney } from "../lib/format";
import { useSpoolStore } from "../stores/spool";
import { useModalStore } from "../stores/ui";

export default function DashboardView() {
  const { dashboard, members, ledger, currency } = useSpoolStore();
  const open = useModalStore((s) => s.open);

  if (!dashboard) return null;
  const recent = ledger.slice(0, 6);

  return (
    <div>
      <PageHeader kicker="Overview" title="Dashboard" actionLabel="+ Add filament" onAction={() => open("spool")} />

      <div className="bg-neutral text-neutral-content rounded-2xl p-7 mb-4">
        <div className="text-[11.5px] uppercase tracking-wide text-white/50 font-medium">Grams in pool</div>
        <div className="font-mono font-bold text-5xl mt-2.5 mb-1.5 leading-none">
          {fmtGrams(dashboard.total_grams_in_pool)}
        </div>
        <div className="text-sm text-white/45">across {dashboard.member_count} members</div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <StatCard
          label="Spools in library"
          value={dashboard.spool_count}
          sub={`${fmtGrams(dashboard.grams_on_hand)} on hand`}
        />
        <StatCard label="Cash owed" value={fmtMoney(dashboard.total_cash_owed, currency)} sub="printed without stock" />
        <StatCard label="Prints logged" value={dashboard.print_count} sub="all time" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <section>
          <h2 className="font-display font-bold text-xl mb-3">Recent activity</h2>
          <div className="bg-base-100 border border-black/10 rounded-2xl divide-y divide-black/5">
            {recent.length === 0 && <div className="p-4 text-sm text-black/40">No activity yet.</div>}
            {recent.map((t) => (
              <LedgerRow key={t.id} txn={t} compact />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl mb-3">Member balances</h2>
          <div className="bg-base-100 border border-black/10 rounded-2xl divide-y divide-black/5">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-4">
                <Avatar name={m.name} color={m.color} size={34} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{m.name}</div>
                  <div className="text-xs text-black/45">{fmtGrams(m.gram_balance)} balance</div>
                </div>
                <button className="btn btn-xs bg-base-200 border-black/10" onClick={() => open("credit", m.id)}>
                  + Credit
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
