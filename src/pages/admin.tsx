// src/pages/admin.tsx
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'

export default function AdminDashboard() {
  const [players, setPlayers] = useState<any[]>([])

  const fetchPlayers = async () => {
    const usersCol = collection(db, 'users')
    const snapshot = await getDocs(usersCol)
    const playerList = snapshot.docs
      .filter((doc) => doc.data().role === 'player')
      .map((doc) => ({ id: doc.id, ...doc.data() }))
    setPlayers(playerList)
  }

  const approveDeposit = async (playerId: string, currentBalance: number, pending: number) => {
    const userRef = doc(db, 'users', playerId)
    await updateDoc(userRef, {
      balance: currentBalance + pending,
      pendingDeposit: 0
    })
    fetchPlayers()
  }

  useEffect(() => {
    fetchPlayers()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🛠 Admin Dashboard</h1>
      {players.map((player, i) => (
        <div key={i} className="bg-white p-4 rounded-xl shadow mb-4">
          <p><strong>Username:</strong> {player.username}</p>
          <p><strong>Balance:</strong> ₱{player.balance}</p>
          <p><strong>Agent:</strong> {player.agent}</p>
          <p><strong>Pending Deposit:</strong> ₱{player.pendingDeposit}</p>
          {player.pendingDeposit > 0 && (
            <button
              className="bg-green-600 text-white px-4 py-1 rounded-full mt-1"
              onClick={() => approveDeposit(player.id, player.balance, player.pendingDeposit)}
            >
              Approve Now
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
