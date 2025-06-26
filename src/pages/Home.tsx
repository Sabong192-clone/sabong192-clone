// src/pages/Home.tsx
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const data = snapshot.docs
        .map((doc) => doc.data())
        .filter((user) => user.role === 'player')
        .sort((a, b) => (b.totalDeposit || 0) - (a.totalDeposit || 0))
        .slice(0, 5)

      setLeaderboard(data)
    })
    return () => unsub()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🐓 Sabong192</h1>
        <p className="text-gray-400 mb-4">Bet. Win. Repeat.</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate('/register')} className="bg-green-600 px-4 py-2 rounded">Register</button>
          <button onClick={() => navigate('/login')} className="bg-blue-600 px-4 py-2 rounded">Login</button>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-xl text-center">
        <h2 className="text-xl font-semibold mb-2">🎁 PROMO:</h2>
        <p>Deposit ₱1,000 — Get 20 Free Betting Points!</p>
      </div>

      <div className="bg-gray-800 p-4 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🏆 Leaderboard</h2>
        <ol className="space-y-2">
          {leaderboard.map((user, i) => (
            <li key={i} className="flex justify-between">
              <span>{i + 1}. {user.username}</span>
              <span>₱{user.totalDeposit || 0}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-full"
        >
          🎮 Play Now
        </button>
      </div>
    </div>
  )
}

export default Home
