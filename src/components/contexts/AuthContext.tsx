// src/components/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "admin" | "agent" | "player";

interface User {
  id: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("MarcoAuthUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (role: Role) => {
    const newUser = { id: "123", name: "Dan", role };
    setUser(newUser);
    localStorage.setItem("MarcoAuthUser", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("MarcoAuthUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
