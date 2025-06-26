// 📁 src/utils/resolveMatch.ts (🧮 Auto-Resolve Logic)
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const resolveMatch = async (matchId, result) => {
  const matchRef = doc(db, "matches", matchId);
  await updateDoc(matchRef, {
    status: "resolved",
    result: result
  });

  const betsRef = collection(db, "bets");
  const q = query(betsRef, where("matchId", "==", matchId));
  const snapshot = await getDocs(q);

  snapshot.forEach(async (docSnap) => {
    const bet = docSnap.data();
    const betRef = doc(db, "bets", docSnap.id);
    const userRef = doc(db, "users", bet.userId);

    let won = false;
    let payout = 0;

    if (bet.side === result) {
      won = true;
      payout = bet.amount * 2;
      await updateDoc(userRef, { wallet: increment(payout) });
    }

    await updateDoc(betRef, {
      resolved: true,
      won,
      payout
    });
  });
};
