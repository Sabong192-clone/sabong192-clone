// This will be spread across multiple files. Let's focus first on:
// 1. Leaderboard real-time display
// 2. Spin logic with real-time history
// 3. Player-triggered spin with fallback to automatic

// --- File: src/pages/PlayerDashboard.tsx ---

import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';

const PlayerDashboard = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [depositTotal, setDepositTotal] = useState(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [spinHistory, setSpinHistory] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ id: user.uid, ...userDoc.data() });
        }
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('weeklyDeposit', 'desc'), limit(5));
    const unsub = onSnapshot(q, (snap) => {
      setLeaderboard(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const unsub = onSnapshot(collection(db, `users/${currentUser.id}/spins`), (snap) => {
      setSpinHistory(snap.docs.map((doc) => doc.data()).reverse());
    });
    return () => unsub();
  }, [currentUser]);

  const performSpin = async () => {
    if (!currentUser) return;

    const outcomes = [
      { prize: '₱200', chance: 50 },
      { prize: '₱500', chance: 30 },
      { prize: '₱1000', chance: 15 },
      { prize: '₱2000', chance: 5 },
    ];

    const rand = Math.random() * 100;
    let cumulative = 0;
    let result = '₱0';
    for (const o of outcomes) {
      cumulative += o.chance;
      if (rand <= cumulative) {
        result = o.prize;
        break;
      }
    }

    const spinDoc = doc(collection(db, `users/${currentUser.id}/spins`));
    await setDoc(spinDoc, {
      result,
      timestamp: new Date(),
    });
    setSpinResult(result);
    toast.success(`🎉 You won ${result}`);
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4 font-bold">🏆 Leaderboard</h2>
      <ul className="mb-6">
        {leaderboard.map((u, i) => (
          <li key={u.id}>
            {i + 1}. {u.username} — ₱{u.weeklyDeposit || 0}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">🎡 Spin the Wheel</h2>
      <button
        onClick={performSpin}
        className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
      >
        SPIN NOW
      </button>
      {spinResult && <p className="mt-2">🎁 Latest Win: {spinResult}</p>}

      <h2 className="mt-6 text-lg font-semibold">📜 Spin History</h2>
      <ul>
        {spinHistory.map((entry, i) => (
          <li key={i}>
            {new Date(entry.timestamp.seconds * 1000).toLocaleString()} — {entry.result}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerDashboard;
