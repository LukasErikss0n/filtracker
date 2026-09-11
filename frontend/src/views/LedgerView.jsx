import PageHeader from "../components/ui/PageHeader";
import LedgerRow from "../components/ui/LedgerRow";
import { useSpoolStore } from "../stores/spool";
import { useModalStore } from "../stores/ui";

export default function LedgerView() {
  const ledger = useSpoolStore((s) => s.ledger);
  const open = useModalStore((s) => s.open);

  return (
    <div>
      <PageHeader kicker="History" title="Ledger" actionLabel="Log a print" onAction={() => open("print")} />

      <div className="bg-base-100 border border-black/10 rounded-2xl divide-y divide-black/5">
        {ledger.length === 0 && <div className="p-4 text-sm text-black/40">No activity yet.</div>}
        {ledger.map((t) => (
          <LedgerRow key={t.id} txn={t} />
        ))}
      </div>
    </div>
  );
}
