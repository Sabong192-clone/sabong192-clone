// src/components/AuthBox.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { Toaster, toast } from "react-hot-toast";

const roles = ["admin", "agent", "player"] as const;

export default function AuthBox() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"admin" | "agent" | "player">("player");

  const handleLogin = () => {
    login(selectedRole);
    toast.success(`Logged in as ${selectedRole.toUpperCase()} ✅`);
    setTimeout(() => navigate("/marco"), 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <Toaster position="top-center" />

      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-6">
        <h1 className="text-2xl font-bold text-yellow-400">🔐 MarcoCore Login</h1>

        <div className="space-y-3">
          <label htmlFor="role" className="block text-left font-medium">
            Select Role
          </label>
          <select
            id="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as any)}
            className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 rounded-xl transition duration-300"
        >
          🚀 Enter MarcoCore
        </button>
      </div>
    </div>
  );
}
