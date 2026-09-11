import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Avatar from "./ui/Avatar";
import Modal from "./ui/Modal";
import PrintModal from "./PrintModal";
import CreditModal from "./CreditModal";
import SpoolModal from "./SpoolModal";
import { useAuth } from "../stores/auth";
import { useModalStore } from "../stores/ui";

const NAV = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/library", label: "Filament library" },
  { to: "/members", label: "Members" },
  { to: "/ledger", label: "Ledger" },
];

export default function Layout() {
  const { member, logout } = useAuth();
  const navigate = useNavigate();
  const { modal, open, close } = useModalStore();

  function signOut() {
    logout();
    navigate("/login");
  }

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-300">
      <input id="nav-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-base-300/90 backdrop-blur border-b border-black/10">
          <label htmlFor="nav-drawer" className="btn btn-square btn-neutral btn-sm">
            ☰
          </label>
          <span className="font-display font-bold text-lg">Spool</span>
        </div>

        <main className="flex-1 w-full max-w-4xl mx-auto p-5 lg:p-10">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="nav-drawer" className="drawer-overlay"></label>
        <aside className="w-64 min-h-full bg-neutral text-neutral-content flex flex-col p-5 gap-1">
          <div className="flex items-center gap-2.5 px-1 pb-5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center font-display font-bold">
              S
            </div>
            <div>
              <div className="font-display font-bold text-lg leading-none">Spool</div>
              <div className="text-[10.5px] text-white/40 mt-0.5">Shared filament tracker</div>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? "bg-white/10 text-white font-semibold" : "text-white/60 hover:text-white/90"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/tracking" className="px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white/90">
              Tracking
            </Link>
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            <button className="btn btn-primary rounded-xl" onClick={() => open("print")}>
              Log a print
            </button>
            <div className="flex items-center gap-2.5 pt-3 px-1 border-t border-white/10">
              <Avatar name={member.name} color={member.color} size={30} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{member.name}</div>
                <div className="text-[10.5px] text-white/40">Signed in</div>
              </div>
              <button onClick={signOut} title="Sign out" className="text-white/45 hover:text-white/80 px-1">
                ⏻
              </button>
            </div>
          </div>
        </aside>
      </div>

      <Modal open={modal === "print"} onClose={close}>
        <PrintModal />
      </Modal>
      <Modal open={modal === "credit"} onClose={close}>
        <CreditModal />
      </Modal>
      <Modal open={modal === "spool"} onClose={close}>
        <SpoolModal />
      </Modal>
    </div>
  );
}
