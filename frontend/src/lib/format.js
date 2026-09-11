export function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function fmtGrams(n) {
  return `${Math.round(n)}g`;
}

export function fmtMoney(n, currency) {
  return `${Number(n).toFixed(2)} ${currency}`;
}

export function fmtPerGram(n, currency) {
  return `${Number(n).toFixed(3)} ${currency}`;
}

export function fmtWhen(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}

export function timeAgo(iso) {
  const diffSec = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diffSec < 3600) return `${Math.max(1, Math.round(diffSec / 60))}m ago`;
  if (diffSec < 86400) return `${Math.round(diffSec / 3600)}h ago`;
  return `${Math.round(diffSec / 86400)}d ago`;
}

export function describeTxn(txn) {
  const memberName = txn.member?.name ?? "";
  if (txn.type === "paid") {
    return {
      title: `${memberName} paid ${txn.owed_to?.name ?? ""}`,
      detail: "Cash debt cleared",
      amountText: "Paid",
      amountClass: "text-success",
    };
  }
  if (txn.type === "contrib") {
    return {
      title: `${memberName} added filament`,
      detail: txn.note || "Filament contribution",
      amountText: `+${fmtGrams(txn.grams)}`,
      amountClass: "text-success",
    };
  }
  const cashNote = txn.cash_charged > 0 ? ` · owed to ${txn.owed_to?.name ?? "owner"}` : "";
  return {
    title: `${memberName} printed ${fmtGrams(txn.grams)}`,
    detail: `${txn.filament ? `${txn.filament.color_name} ${txn.filament.material}` : "filament"}${cashNote}`,
    amountText: `−${fmtGrams(txn.grams)}`,
    amountClass: "text-base-content",
  };
}
