<<<<<<< HEAD
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
=======
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Login = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim()) return toast.error("Enter your username");

    setLoading(true);
    try {
      const ref = doc(db, "users", username);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        toast.error("User not found");
        return;
      }

      const data = snap.data();
      localStorage.setItem("user", JSON.stringify({ username, role: data.role }));

      toast.success("Welcome back!");
      if (data.role === "player") navigate("/dashboard");
      else if (data.role === "admin") navigate("/admin");
      else if (data.role === "agent") navigate("/agent");
    } catch (e) {
      console.error(e);
      toast.error("Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded mb-3 text-black"
        />
        <button
          className="bg-blue-600 w-full py-2 rounded hover:bg-blue-700"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p
          className="mt-3 text-sm underline text-blue-400 cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Don’t have an account? Register
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
>>>>>>> de72957 (Initial commit with full Vite project)
