// src/pages/admin.tsx
import React, { useEffect, useState } from 'react'
import { collection, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const navigate = useNavigate()

  // Check auth + role
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login')
        return
      }

      const userDocs = await getDocs(collection(db, 'users'))
      const loggedInUser = userDocs.docs.find(doc => doc.id === user.uid)?.data()

      if (loggedInUser?.role !== 'admin') {
        alert('Access Denied')
        navigate('/login')
        return
      }

      setCurrentUser(loggedInUser)
    })

    return () => unsub()
  }, [])

  // Live fetch users
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setUsers(fetched)
    })

    return () => unsub()
  }, [])

  // Balance update handler
  const updateBalance = async (userId: string, newBalance: number) => {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, { balance: newBalance })
      toast.success('Balance updated successfully')
    } catch (error) {
      toast.error('Error updating balance')
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4">🛠️ Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users
          .filter((user) => user.username !== currentUser?.username) // prevent self-edit
          .map((user) => (
            <div key={user.id} className="p-4 bg-gray-800 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold mb-2">{user.username}</h2>
              <p>Role: {user.role}</p>
              <p>Current Balance: ₱{user.balance}</p>
              <input
                type="number"
                className="mt-2 p-2 bg-gray-700 rounded w-full text-black"
                defaultValue={user.balance}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value)
                  if (!isNaN(value) && value >= 0) {
                    updateBalance(user.id, value)
                  } else {
                    toast.error('❌ Invalid balance input')
                  }
                }}
              />
              <p className="text-sm mt-1 text-gray-400">💾 Auto-saves on blur</p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default AdminDashboard
