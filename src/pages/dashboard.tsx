// src/pages/dashboard.tsx
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function PlayerDashboard() {
  const [playerData, setPlayerData] = useState<any>(null)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || '{}')
    const fetchData = async () => {
      const userRef = doc(db, 'users', stored.username)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) setPlayerData(userSnap.data())
    }
    fetchData()
  }, [])

  if (!playerData) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-2">👤 Player Profile</h2>
        <p>Username: <strong>{playerData.username}</strong></p>
        <p>Balance: ₱{playerData.balance}</p>
        <p>Agent: {playerData.agent}</p>
      </div>

      {/* More UI below here */}
    </div>
  )
}
