import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";

export const AdminPanel = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "matches"), (snap) => {
      setMatches(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const startNewMatch = async () => {
    await addDoc(collection(db, "matches"), {
      createdAt: new Date(),
      status: "open",
      meronBetsTotal: 0,
      walaBetsTotal: 0,
      result: null,
      lockAt: new Date(Date.now() + 30000), // 30 sec
    });
    toast.success("🆕 New match created");
  };

  const updateMatch = async (id, updates) => {
    await updateDoc(doc(db, "matches", id), updates);
    toast.success("✅ Match updated");
  };

  const resolveMatch = async (matchId, result) => {
    const q = query(collection(db, "bets"), where("matchId", "==", matchId));
    const snap = await getDocs(q);
    const batch = writeBatch(db);

    snap.forEach((docSnap) => {
      const bet = docSnap.data();
      const won = bet.side === result;
      const winnings = won ? bet.amount * 2 : 0;

      batch.update(docSnap.ref, { resolved: true, won });

      if (won) {
        const userRef = doc(db, "users", bet.userId);
        batch.update(userRef, {
          wallet: (bet.userWallet || 0) + winnings,
        });
      }
    });

    await batch.commit();
    await updateMatch(matchId, { status: "resolved", result });
    toast.success(`🏁 Match resolved: ${result.toUpperCase()} wins`);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">👨‍⚖️ Admin Match Panel</h1>
      <button
        onClick={startNewMatch}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        ➕ Start New Match
      </button>

      <ul className="space-y-2">
        {matches.map((match) => (
          <li key={match.id} className="p-4 border rounded shadow">
            <p>Match ID: {match.id}</p>
            <p>Status: {match.status}</p>
            <div className="space-x-2 mt-2">
              <button
                onClick={() => updateMatch(match.id, { status: "locked" })}
                className="px-2 py-1 bg-yellow-500 text-white rounded"
              >
                🔒 Lock
              </button>
              <button
                onClick={() => resolveMatch(match.id, "meron")}
                className="px-2 py-1 bg-red-600 text-white rounded"
              >
                🟥 Meron Wins
              </button>
              <button
                onClick={() => resolveMatch(match.id, "wala")}
                className="px-2 py-1 bg-blue-600 text-white rounded"
              >
                🟦 Wala Wins
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
