// src/pages/SpinHistory.tsx
import React, { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const SpinHistory = () => {
  const [logs, setLogs] = useState<any[]>([])
  const [userId, setUserId] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login')
        return
      }
      setUserId(user.uid)
      const q = query(collection(db, 'spinLogs'), where('userId', '==', user.uid))
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setLogs(data)
      })
    })
    return () => unsub()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">🎡 Spin History</h1>
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="p-4 bg-gray-800 rounded">
            <p className="text-lg font-semibold">Prize: ₱{log.reward}</p>
            <p className="text-sm text-gray-400">Date: {new Date(log.timestamp?.seconds * 1000).toLocaleString()}</p>
            <p className="text-sm">Status: {log.claimed ? '✅ Claimed' : '❌ Pending'}</p>
          </div>
        ))}
        {logs.length === 0 && <p>No spin history yet.</p>}
      </div>
    </div>
  )
}

export default SpinHistory
