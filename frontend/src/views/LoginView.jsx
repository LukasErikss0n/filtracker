import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../components/ui/Avatar";
import { api } from "../api/client";
import { useAuth } from "../stores/auth";

export default function LoginView() {
  const [accounts, setAccounts] = useState([]);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();

  useEffect(() => {
    api.members().then(setAccounts).catch(() => {});
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (!username || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-9">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-display font-bold text-white">
            S
          </div>
          <div>
            <div className="font-display font-bold text-2xl leading-none">Spool</div>
            <div className="text-[11px] text-black/45 mt-1">Shared filament tracker</div>
          </div>
        </div>

        <form onSubmit={submit} className="bg-base-100 rounded-3xl p-7 shadow-xl">
          <div className="font-display font-bold text-xl mb-1">Who are you?</div>
          <div className="text-sm text-black/50 mb-6">Pick your name and enter your password.</div>

          <div className="flex flex-col gap-2 mb-5">
            {accounts.map((m) => (
              <button
                type="button"
                key={m.key}
                onClick={() => setUsername(m.key)}
                className={`flex items-center gap-3 w-full px-3.5 py-3 rounded-2xl border text-left transition-colors ${
                  username === m.key ? "border-primary bg-primary/5" : "border-black/10 bg-base-200"
                }`}
              >
                <Avatar name={m.name} color={m.color} size={38} />
                <span className="font-semibold text-sm flex-1">{m.name}</span>
              </button>
            ))}
            {accounts.length === 0 && <p className="text-sm text-black/40">Loading accounts…</p>}
          </div>

          {username && (
            <input
              type="password"
              autoFocus
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full mb-4"
            />
          )}

          {error && <div className="text-error text-sm mb-3">{error}</div>}

          <button type="submit" className="btn btn-primary w-full rounded-xl" disabled={!username || submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
