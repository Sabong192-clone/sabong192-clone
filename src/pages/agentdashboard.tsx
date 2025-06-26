// src/pages/register.tsx
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const queryParams = new URLSearchParams(location.search)
  const referrer = queryParams.get('ref') || ''

  useEffect(() => {
    // optional prefill or tracking logic
  }, [referrer])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const email = (form.email as HTMLInputElement).value
    const password = (form.password as HTMLInputElement).value
    const username = (form.username as HTMLInputElement).value

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', userCred.user.uid), {
        username,
        email,
        role: 'player',
        balance: 0,
        pendingDeposit: 0,
        agent: referrer,
        createdAt: new Date()
      })
      toast.success('Account created!')
      navigate('/login')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
      <form onSubmit={handleRegister} className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input name="username" placeholder="Username" className="mb-2 p-2 w-full bg-gray-700 rounded" required />
        <input name="email" type="email" placeholder="Email" className="mb-2 p-2 w-full bg-gray-700 rounded" required />
        <input name="password" type="password" placeholder="Password" className="mb-4 p-2 w-full bg-gray-700 rounded" required />
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-2 rounded">Create Account</button>
        {referrer && (
          <p className="text-sm text-gray-400 mt-2">🔗 Referral: {referrer}</p>
        )}
      </form>
    </div>
  )
}

export default RegisterPage
