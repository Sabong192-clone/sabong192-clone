import { useEffect, useState } from "react";
import { MarcoCore } from "./MarcoCore";
import { useAuth } from "../components/contexts/AuthContext";

export const MarcoDashboard = () => {
  const [enabled, setEnabled] = useState(true);
  const [log, setLog] = useState<string[]>([]);
  const [micStatus, setMicStatus] = useState("Idle");
  const [memory, setMemory] = useState("512MB");

  const { isAdmin, isAgent, isPlayer } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setLog((prev) => [
        ...prev.slice(-49),
        `🧠 Marco running @ ${new Date().toLocaleTimeString()}`,
      ]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleMarco = () => {
    const newStatus = !enabled;
    setEnabled(newStatus);
    MarcoCore.toggleRuntime(newStatus);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white dark:bg-zinc-900 text-black dark:text-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">🧠 MarcoCore Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Marco Status Control */}
        <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded">
          <h2 className="font-semibold mb-2">🎛️ Status Control</h2>
          <p>Status: <strong>{enabled ? "Enabled ✅" : "Disabled ❌"}</strong></p>
          <button
            onClick={toggleMarco}
            className="mt-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {enabled ? "Disable MarcoCore" : "Enable MarcoCore"}
          </button>
          <p className="text-sm mt-2 text-gray-400">Runtime Memory: {memory}</p>
        </div>

        {/* Microphone Status */}
        <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded">
          <h2 className="font-semibold mb-2">🎙️ Microphone</h2>
          <p>Status: <strong>{micStatus}</strong></p>
          <p className="text-sm mt-1 text-gray-400">
            Voice Commands ready (Tagalog/English)
          </p>
        </div>

        {/* Live Logs */}
        <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded md:col-span-2">
          <h2 className="font-semibold mb-2">📡 Activity Logs</h2>
          <div className="max-h-48 overflow-y-auto text-sm">
            {log.map((entry, i) => (
              <p key={i} className="text-zinc-700 dark:text-zinc-300">{entry}</p>
            ))}
          </div>
        </div>

        {/* Role Permission Matrix */}
        <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded md:col-span-2">
          <h2 className="font-semibold mb-2">🔐 Role Permission Matrix</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left">
                <th className="border-b p-2">Role</th>
                <th className="border-b p-2">Transfer</th>
                <th className="border-b p-2">Audit Logs</th>
                <th className="border-b p-2">Betting</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">Admin</td>
                <td className="p-2">✅</td>
                <td className="p-2">✅</td>
                <td className="p-2">❌</td>
              </tr>
              <tr>
                <td className="p-2">Agent</td>
                <td className="p-2">✅</td>
                <td className="p-2">❌</td>
                <td className="p-2">❌</td>
              </tr>
              <tr>
                <td className="p-2">Player</td>
                <td className="p-2">❌</td>
                <td className="p-2">❌</td>
                <td className="p-2">✅</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
