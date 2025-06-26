// ✅ MyBets - with Filter UI
// 📁 src/pages/MyBets.tsx
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";

export default function MyBets() {
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState("all");
  const [bets, setBets] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const baseQuery = query(collection(db, "bets"), where("userId", "==", currentUser.uid));
    const unsub = onSnapshot(baseQuery, (snap) => {
      let data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (filter === "won") data = data.filter((b) => b.won === true);
      if (filter === "lost") data = data.filter((b) => b.resolved && b.won === false);
      if (filter === "unresolved") data = data.filter((b) => !b.resolved);
      setBets(data);
    });
    return () => unsub();
  }, [currentUser, filter]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">📜 My Bets</h2>
      <div className="flex gap-2 mb-4">
        {['all', 'won', 'lost', 'unresolved'].map((f) => (
          <button
            key={f}
            className={`px-3 py-1 rounded ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>
      <ul className="space-y-2">
        {bets.map((bet) => (
          <li key={bet.id} className="bg-white p-3 rounded shadow text-sm">
            ₱{bet.amount} on {bet.side.toUpperCase()} — {bet.resolved ? (bet.won ? "✅ WON" : "❌ LOST") : "🕒 PENDING"}
          </li>
        ))}
      </ul>
    </div>
  );
}