// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./components/contexts/AuthContext";
import { MarcoCoreProvider } from "./components/contexts/MarcoCoreContext";

import AuthBox from "./components/AuthBox";
import { TransferPointsPanel } from "./components/TransferPointsPanel";
import { AuditLogsPanel } from "./components/AuditLogsPanel";
import { MarcoDashboard } from "./components/MarcoDashboard";
import { MatchDashboard } from "./components/MatchDashboard";
import { MarcoVoiceOverlay } from "./components/MarcoVoiceOverlay";
import { MarcoInstaller } from "./marco/MarcoInstaller";

const sampleMatch = {
  id: 1,
  teamA: "Sabong Warriors",
  teamB: "Battle Roosters",
  scoreA: 2,
  scoreB: 3,
  status: "ongoing",
};

function ProtectedRoute({
  element,
  roles,
}: {
  element: JSX.Element;
  roles: string[];
}) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!roles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return element;
}

function Sidebar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="w-64 h-screen fixed bg-gray-900 text-white p-6 space-y-6 shadow-xl">
      <h2 className="text-xl font-bold">🧠 MarcoCore</h2>
      <nav className="space-y-4">
        <Link to="/marco" className="block hover:text-yellow-300">
          📊 Dashboard
        </Link>
        {user.role !== "player" && (
          <>
            <Link to="/transfer" className="block hover:text-yellow-300">
              ➕ Transfer
            </Link>
            <Link to="/audit" className="block hover:text-yellow-300">
              📋 Audit Logs
            </Link>
          </>
        )}
        <Link to="/match" className="block hover:text-yellow-300">
          🐓 Match
        </Link>
        <button
          onClick={logout}
          className="mt-6 text-sm text-red-400 hover:text-red-200"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full min-h-screen bg-gray-100 p-6">
        {children}
      </div>
      <MarcoVoiceOverlay />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MarcoCoreProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<AuthBox />} />
            <Route
              path="/unauthorized"
              element={
                <div className="p-10 text-center text-xl text-red-600">
                  🚫 Unauthorized Access
                </div>
              }
            />
            <Route
              path="/marco"
              element={
                <ProtectedRoute
                  roles={["admin", "agent", "player"]}
                  element={
                    <MarcoInstaller>
                      <Layout>
                        <MarcoDashboard />
                      </Layout>
                    </MarcoInstaller>
                  }
                />
              }
            />
            <Route
              path="/transfer"
              element={
                <ProtectedRoute
                  roles={["admin", "agent"]}
                  element={
                    <Layout>
                      <TransferPointsPanel />
                    </Layout>
                  }
                />
              }
            />
            <Route
              path="/audit"
              element={
                <ProtectedRoute
                  roles={["admin", "agent"]}
                  element={
                    <Layout>
                      <AuditLogsPanel />
                    </Layout>
                  }
                />
              }
            />
            <Route
              path="/match"
              element={
                <ProtectedRoute
                  roles={["admin", "agent", "player"]}
                  element={
                    <Layout>
                      <MatchDashboard match={sampleMatch} />
                    </Layout>
                  }
                />
              }
            />
            <Route path="*" element={<Navigate to="/marco" />} />
          </Routes>
        </Router>
      </MarcoCoreProvider>
    </AuthProvider>
  );
}
