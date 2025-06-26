import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [params] = useSearchParams();
  const agentRef = params.get("ref") || "-";
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (username.length < 5 || password.length < 4) {
      toast.error("Invalid username or password");
      return;
    }

    try {
      const userRef = doc(db, "users", username);
      await setDoc(userRef, {
        username,
        password,
        balance: 0,
        pendingDeposit: 0,
        role: "player",
        agent: agentRef,
        createdAt: new Date(),
        history: {},
      });

      localStorage.setItem("user", JSON.stringify({ username, role: "player" }));
      toast.success("Registered!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input
          type="text"
          placeholder="Phone number"
          className="w-full p-2 mb-3 text-black rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 text-black rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-sm mb-2 text-gray-300">
          Referred by: <span className="font-bold">{agentRef}</span>
        </p>
        <button
          className="bg-green-600 w-full py-2 rounded hover:bg-green-700"
          onClick={handleRegister}
        >
          Register Now
        </button>
      </div>
    </div>
  );
};

export default Register;
