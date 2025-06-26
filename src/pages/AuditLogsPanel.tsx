// 📋 AuditLogsPanel.tsx (Dark Mode + Responsive + Friendly UI)
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export const AuditLogsPanel = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "auditLogs"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setLogs(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white dark:bg-zinc-900 dark:text-white rounded shadow sm:p-6 md:p-8">
      <h1 className="text-xl font-bold mb-4">📋 Audit Logs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-zinc-300 dark:border-zinc-700">
          <thead className="bg-zinc-100 dark:bg-zinc-800">
            <tr>
              <th className="px-3 py-2 text-left">🧑‍💻 From</th>
              <th className="px-3 py-2 text-left">🎯 To</th>
              <th className="px-3 py-2 text-left">💰 Amount</th>
              <th className="px-3 py-2 text-left">📅 Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-zinc-200 dark:border-zinc-700">
                <td className="px-3 py-2">{log.from}</td>
                <td className="px-3 py-2">{log.to}</td>
                <td className="px-3 py-2">₱{log.amount?.toLocaleString()}</td>
                <td className="px-3 py-2">
                  {new Date(log.createdAt?.seconds * 1000).toLocaleString()}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-zinc-500">
                  No transactions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
