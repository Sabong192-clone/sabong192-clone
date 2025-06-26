// 📁 src/components/BetFeed.tsx (📱 Realtime Bet Feed)
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export const BetFeed = ({ matchId }) => {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "bets"),
      where("matchId", "==", matchId),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setFeed(snap.docs.map(doc => doc.data()));
    });
    return () => unsub();
  }, [matchId]);

  return (
    <div className="bg-white p-2 rounded shadow max-h-40 overflow-y-auto text-sm">
      <p className="font-bold mb-1">📢 Latest Bets:</p>
      {feed.map((bet, i) => (
        <p key={i}>{bet.userId.slice(0, 6)} bet ₱{bet.amount} on {bet.side.toUpperCase()}</p>
      ))}
    </div>
  );
};