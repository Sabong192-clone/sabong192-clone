// src/pages/agent.tsx
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function AgentDashboard() {
  const [agentData, setAgentData] = useState<any>(null)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || '{}')
    const fetchData = async () => {
      const agentRef = doc(db, 'agents', stored.username)
      const agentSnap = await getDoc(agentRef)
      if (agentSnap.exists()) setAgentData(agentSnap.data())
    }
    fetchData()
  }, [])

  if (!agentData) return <p className="text-center mt-10">Loading agent data...</p>

  const totalCommission = agentData.totalCommission || 0

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📈 Agent Dashboard</h1>
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <p><strong>Your Referral Link:</strong></p>
        <code className="block bg-gray-100 p-2 rounded mt-1">
          https://192tamasa.vercel.app/register?ref={agentData.username}
        </code>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-2">Referred Players</h2>
        <ul className="text-sm">
          {agentData.referrals.map((ref: string, i: number) => (
            <li key={i}>👤 {ref}</li>
          ))}
        </ul>
        <p className="mt-3 font-bold text-green-700">💰 Total Commission: ₱{totalCommission}</p>
      </div>
    </div>
  )
}
