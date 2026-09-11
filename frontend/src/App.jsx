import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoginView from "./views/LoginView";
import DashboardView from "./views/DashboardView";
import LibraryView from "./views/LibraryView";
import MembersView from "./views/MembersView";
import LedgerView from "./views/LedgerView";
import TrackingView from "./views/TrackingView";
import { useAuth } from "./stores/auth";
import { useSpoolStore } from "./stores/spool";

function ProtectedRoute({ children }) {
  const token = useAuth((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const token = useAuth((s) => s.token);
  const refreshAll = useSpoolStore((s) => s.refreshAll);

  useEffect(() => {
    if (token) refreshAll().catch(() => {});
  }, [token, refreshAll]);

  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route
        path="/tracking"
        element={
          <ProtectedRoute>
            <TrackingView />
          </ProtectedRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardView />} />
        <Route path="/library" element={<LibraryView />} />
        <Route path="/members" element={<MembersView />} />
        <Route path="/ledger" element={<LedgerView />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
