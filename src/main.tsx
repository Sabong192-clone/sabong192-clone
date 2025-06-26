import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import PlayerDashboard from './pages/dashboard'
import AdminDashboard from './pages/admin'
import AgentDashboard from './pages/agent'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PlayerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/agent" element={<AgentDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
