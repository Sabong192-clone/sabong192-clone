// ✅ Auto-trigger Spin + Weekly Reset + Admin Spin Logs Export

// File: src/lib/spinManager.ts
import { doc, getDoc, updateDoc, setDoc, collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const spinThresholds = {
  player: [10000, 35000, 50000],
  agent: [50000, 100000, 150000],
};

const spinWheel = () => {
  const roll = Math.random() * 100;
  if (roll < 50) return 200;
  if (roll < 80) return 500;
  if (roll < 95) return 1000;
  return 2000;
};

export async function checkAndSpin(userId: string, isAgent: boolean) {
  const col = isAgent ? 'agents' : 'users';
  const docRef = doc(db, col, userId);
  const snap = await getDoc(docRef);
  const data = snap.data();
  if (!data) return;

  const totalDeposit = data.totalWeeklyDeposit || 0;
  const spinsGiven = data.weeklySpins || 0;

  const thresholds = isAgent ? spinThresholds.agent : spinThresholds.player;

  if (spinsGiven >= thresholds.length) return; // Already max spins

  const nextThreshold = thresholds[spinsGiven];
  if (totalDeposit >= nextThreshold) {
    const prize = spinWheel();
    await updateDoc(docRef, {
      weeklySpins: spinsGiven + 1,
      balance: (data.balance || 0) + prize,
    });

    // Log spin
    await setDoc(doc(db, 'spinLogs', `${userId}-${Date.now()}`), {
      userId,
      role: isAgent ? 'agent' : 'player',
      prize,
      timestamp: Timestamp.now(),
    });
  }
}

export async function resetWeeklyCounters() {
  const usersSnap = await getDocs(collection(db, 'users'));
  const agentsSnap = await getDocs(collection(db, 'agents'));

  for (const docu of usersSnap.docs) {
    await updateDoc(doc(db, 'users', docu.id), {
      totalWeeklyDeposit: 0,
      weeklySpins: 0,
    });
  }

  for (const docu of agentsSnap.docs) {
    await updateDoc(doc(db, 'agents', docu.id), {
      totalWeeklyDeposit: 0,
      weeklySpins: 0,
    });
  }
}

// File: src/pages/AdminSpinLogs.tsx
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminSpinLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const snap = await getDocs(collection(db, 'spinLogs'));
      const parsed = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(parsed);
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">🎡 Spin Logs</h1>
      <table className="w-full bg-gray-800 rounded-lg text-sm">
        <thead>
          <tr className="bg-gray-700 text-left">
            <th className="p-2">User ID</th>
            <th className="p-2">Role</th>
            <th className="p-2">Prize</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id} className="border-t border-gray-600">
              <td className="p-2">{log.userId}</td>
              <td className="p-2">{log.role}</td>
              <td className="p-2 text-green-400">₱{log.prize}</td>
              <td className="p-2">{new Date(log.timestamp?.seconds * 1000).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
