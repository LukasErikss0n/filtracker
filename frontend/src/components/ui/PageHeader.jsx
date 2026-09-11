export default function PageHeader({ kicker, title, actionLabel, onAction }) {
  return (
    <header className="flex items-end justify-between flex-wrap gap-4 mb-7">
      <div>
        <div className="text-xs uppercase tracking-widest text-black/40 font-semibold mb-1.5">
          {kicker}
        </div>
        <h1 className="font-display font-bold text-3xl">{title}</h1>
      </div>
      {actionLabel && (
        <button className="btn btn-neutral rounded-xl" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </header>
  );
}
