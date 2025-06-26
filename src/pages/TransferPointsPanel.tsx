// 💸 TransferPointsPanel.tsx (Realtime Wallet Refresh + Mobile Responsive + Dark Mode + Toasts + MarcoCore Integration + Self-Healing Skills)
import { useEffect, useState } from "react";
import { useAuth } from "../components/contexts/AuthContext";
import { db } from "../firebase";
import {
  doc,
  updateDoc,
  increment,
  collection,
  addDoc,
  getDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import toast from "react-hot-toast";

// 🧠 MarcoCore Integration (Auto-Command + Notification + Self-Healing Skills)
import { MarcoCore } from "../marco/MarcoCore";

export const TransferPointsPanel = () => {
  const { currentUser, allUsers, reloadAllUsers, setAllUsers } = useAuth();
  const [amount, setAmount] = useState(0);
  const [targetUid, setTargetUid] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    reloadAllUsers();
    MarcoCore.selfDebug();
    MarcoCore.autoRewrite();
    MarcoCore.divineBalance();
    MarcoCore.autoAlign();
    MarcoCore.embedAcrossModules();
  }, []);

  const isAllowed = (user) => user.role === "player";

  const handleTransfer = async () => {
    if (!targetUid || amount <= 0) return toast.error("Invalid transfer");
    setLoading(true);

    try {
      const targetRef = doc(db, "users", targetUid);
      await updateDoc(targetRef, {
        wallet: increment(amount),
      });

      await addDoc(collection(db, "auditLogs"), {
        from: currentUser.uid,
        to: targetUid,
        amount,
        initiatedBy: currentUser.uid,
        createdAt: new Date(),
      });

      // 🟢 Refresh wallet data
      const updatedSnap = await getDoc(targetRef);
      setAllUsers((prev) =>
        prev.map((u) => (u.uid === targetUid ? { ...u, ...updatedSnap.data() } : u))
      );

      // 🧠 Marco logs the command and speaks confirmation
      MarcoCore.listen(`transfer ${amount} to ${targetUid}`, { currentUser });
      MarcoCore.speak("Transfer successful, parekoy!", "Tagalog");

      // 🔔 Optional mobile push or SMS
      MarcoCore.notifyAdmin(`₱${amount} transferred to ${targetUid}`);

      toast.success("Transfer successful");
      setAmount(0);
      setTargetUid("");
    } catch (err) {
      console.error(err);
      toast.error("Transfer failed");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white dark:bg-zinc-900 dark:text-white rounded shadow sm:p-6 md:p-8">
      <h1 className="text-xl font-bold mb-4">💸 Transfer Points</h1>

      <label className="block mb-2 text-sm">Select Player</label>
      <select
        value={targetUid}
        onChange={(e) => setTargetUid(e.target.value)}
        className="w-full border rounded p-2 mb-4 bg-white dark:bg-zinc-800 dark:border-zinc-700"
      >
        <option value="">-- Choose --</option>
        {allUsers.filter(isAllowed).map((u) => (
          <option key={u.uid} value={u.uid}>
            {u.email || u.uid} (₱{u.wallet?.toLocaleString?.() || 0})
          </option>
        ))}
      </select>

      <label className="block mb-2 text-sm">Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full border rounded p-2 mb-4 bg-white dark:bg-zinc-800 dark:border-zinc-700"
        placeholder="₱0.00"
      />

      <button
        onClick={handleTransfer}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Transferring..." : "Transfer Now"}
      </button>
    </div>
  );
};

// 📋 AuditLogsPanel.tsx (Dark Mode + Real-time Log Viewer)
export const AuditLogsPanel = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "auditLogs"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setLogs(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });
    return () => unsub();
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white dark:bg-zinc-900 dark:text-white rounded shadow sm:p-6 md:p-8">
      <h1 className="text-xl font-bold mb-4">📋 Audit Logs</h1>
      <div className="overflow-auto max-h-[70vh] space-y-2">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-300 dark:border-zinc-700"
          >
            <p><strong>From:</strong> {log.from}</p>
            <p><strong>To:</strong> {log.to}</p>
            <p><strong>Amount:</strong> ₱{log.amount?.toLocaleString?.()}</p>
            <p><strong>Time:</strong> {new Date(log.createdAt?.seconds * 1000).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
