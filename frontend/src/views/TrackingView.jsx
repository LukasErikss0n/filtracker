import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../components/ui/Avatar";
import LineChart from "../components/ui/LineChart";
import { fmtGrams } from "../lib/format";
import { api } from "../api/client";

function BarRow({ member, value, max, lowIsBad }) {
  const pct = Math.max(2, Math.round((value / max) * 100));
  const low = lowIsBad && value <= 0;
  const warn = lowIsBad && value > 0 && value < 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <Avatar name={member.name} color={member.color} size={28} />
          <span className="font-semibold text-sm">{member.name}</span>
        </div>
        <span className={`font-mono font-semibold text-sm ${low ? "text-error" : warn ? "text-warning" : "text-black/60"}`}>
          {fmtGrams(value)}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-black/[.07] overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: low ? "#d63b2f" : warn ? "#c26a00" : member.color }}
        />
      </div>
    </div>
  );
}

export default function TrackingView() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.tracking(7).then(setData).catch(() => {});
  }, []);

  if (!data) return null;

  const maxPrinted = Math.max(...data.series.map((s) => s.grams_printed), 1);
  const maxBalance = Math.max(...data.series.map((s) => s.gram_balance), 1);
  const byPrinted = [...data.series].sort((a, b) => b.grams_printed - a.grams_printed);
  const byBalance = [...data.series].sort((a, b) => b.gram_balance - a.gram_balance);

  return (
    <div className="min-h-screen bg-base-300">
      <div className="sticky top-0 z-10 flex items-center gap-3 px-5 py-3.5 bg-base-300/90 backdrop-blur border-b border-black/10">
        <Link to="/" className="btn btn-square btn-neutral btn-sm">
          ←
        </Link>
        <span className="font-display font-bold text-lg">Tracking</span>
      </div>

      <div className="max-w-2xl mx-auto p-5 pb-16 flex flex-col gap-7">
        <section>
          <div className="text-xs uppercase tracking-wide text-black/40 font-semibold mb-1.5">Usage by member</div>
          <h2 className="font-display font-bold text-2xl mb-4">Grams printed per person</h2>
          <div className="bg-base-100 border border-black/10 rounded-2xl p-5 flex flex-col gap-3.5">
            {byPrinted.map((m) => (
              <BarRow key={m.member_id} member={m} value={m.grams_printed} max={maxPrinted} />
            ))}
          </div>
        </section>

        <section>
          <div className="text-xs uppercase tracking-wide text-black/40 font-semibold mb-1.5">Stock</div>
          <h2 className="font-display font-bold text-2xl mb-4">Gram balance remaining</h2>
          <div className="bg-base-100 border border-black/10 rounded-2xl p-5 flex flex-col gap-3.5">
            {byBalance.map((m) => (
              <BarRow key={m.member_id} member={m} value={m.gram_balance} max={maxBalance} lowIsBad />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-2xl mb-4">Grams per day</h2>
          <div className="bg-base-100 border border-black/10 rounded-2xl p-5">
            <LineChart
              labels={data.labels}
              series={data.series.map((s) => ({ name: s.name, color: s.color, values: s.grams_per_day }))}
            />
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-2xl mb-4">Prints per day</h2>
          <div className="bg-base-100 border border-black/10 rounded-2xl p-5">
            <LineChart
              labels={data.labels}
              series={data.series.map((s) => ({ name: s.name, color: s.color, values: s.prints_per_day }))}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
