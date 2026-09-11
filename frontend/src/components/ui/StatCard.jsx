export default function StatCard({ label, value, sub }) {
  return (
    <div className="bg-base-100 border border-black/10 rounded-2xl p-4">
      <div className="text-xs text-black/45 font-medium mb-2">{label}</div>
      <div className="font-mono font-semibold text-xl leading-none">{value}</div>
      {sub && <div className="text-xs text-black/40 mt-1.5">{sub}</div>}
    </div>
  );
}
