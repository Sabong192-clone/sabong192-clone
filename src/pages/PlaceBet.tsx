// 📁 src/pages/PlaceBet.tsx (🖱️ Finalized Betting UI)
import { useState } from "react";
import { db } from "../firebase";
import {
  doc,
  addDoc,
  collection,
  updateDoc,
  increment
} from "firebase/firestore";
import { useAuth } from "../components/contexts/AuthContext";
import toast from "react-hot-toast";

export const PlaceBet = ({ matchId }) => {
  const [side, setSide] = useState(null);
  const [amount, setAmount] = useState(0);
  const { currentUser, userData, walletLow, loading } = useAuth();

  const placeBet = async () => {
    if (!currentUser || loading) return toast.error("Login required.");
    if (!side || amount <= 0) return toast.error("Invalid bet.");
    if (userData.wallet < amount)
      return toast.error("Insufficient wallet balance.");

    try {
      // 1. Deduct wallet
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, { wallet: increment(-amount) });

      // 2. Add bet
      await addDoc(collection(db, "bets"), {
        matchId,
        userId: currentUser.uid,
        side,
        amount,
        resolved: false,
        won: null,
        payout: 0,
        createdAt: Date.now()
      });

      // 3. Update match stats
      const matchRef = doc(db, "matches", matchId);
      await updateDoc(matchRef, {
        [`${side}BetsTotal`]: increment(amount)
      });

      toast.success("Bet placed!");
      setAmount(0);
      setSide(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place bet.");
    }
  };

  return (
    <div className="p-4 space-y-2 bg-white rounded shadow">
      {walletLow && (
        <div className="text-red-600 text-sm font-bold">
          ⚠️ Minimum balance at least ₱10
        </div>
      )}
      <div>
        <button
          onClick={() => setSide("meron")}
          className={`px-4 py-2 rounded ${
            side === "meron" ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
        >
          Meron
        </button>
        <button
          onClick={() => setSide("wala")}
          className={`px-4 py-2 rounded ml-2 ${
            side === "wala" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Wala
        </button>
      </div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border px-2 py-1 w-full"
        placeholder="Enter bet amount"
      />
      <button
        onClick={placeBet}
        disabled={walletLow}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Place Bet
      </button>
    </div>
  );
};
