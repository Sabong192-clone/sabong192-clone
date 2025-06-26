// src/pages/login.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export default function Login() {
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('player')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!username.match(/^[a-zA-Z0-9_]+$/)) {
      setError('❌ Invalid username format.')
      return
    }

    const userRef = doc(db, 'users', username)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()
      localStorage.setItem('user', JSON.stringify(userData))
      navigate(`/${userData.role}`)
    } else {
      await setDoc(userRef, {
        username,
        role,
        balance: 0,
        pendingDeposit: 0,
        agent: '-',
        createdAt: serverTimestamp(),
        history: {}
      })
      const newUser = {
        username,
        role,
        balance: 0,
        pendingDeposit: 0,
        agent: '-'
      }
      localStorage.setItem('user', JSON.stringify(newUser))
      navigate(`/${role}`)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        className="border p-2 mb-2"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <select
        className="border p-2 mb-4"
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="player">Player</option>
        <option value="admin">Admin</option>
        <option value="agent">Agent</option>
      </select>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleLogin}
      >
        Enter
      </button>
    </div>
  )
}
