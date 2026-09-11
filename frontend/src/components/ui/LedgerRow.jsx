import { describeTxn, fmtWhen, timeAgo } from "../../lib/format";

export default function LedgerRow({ txn, compact = false }) {
  const d = describeTxn(txn);
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{d.title}</div>
        <div className="text-xs text-black/50 truncate">{d.detail}</div>
      </div>
      <div className="text-right shrink-0">
        <div className={`font-mono font-semibold text-sm ${d.amountClass}`}>{d.amountText}</div>
        <div className="text-xs text-black/40 font-mono">
          {compact ? timeAgo(txn.created_at) : fmtWhen(txn.created_at)}
        </div>
      </div>
    </div>
  );
}
