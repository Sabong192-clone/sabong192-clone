// src/components/contexts/MarcoCoreContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";

interface MarcoCoreContextType {
  enabled: boolean;
  logs: string[];
  toggleRuntime: (state: boolean) => void;
  runCommand: (cmd: string) => void;
  autoSync: () => void;
  divineMemory: () => void;
}

const MarcoCoreContext = createContext<MarcoCoreContextType | null>(null);

export const MarcoCoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [enabled, setEnabled] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  const log = (msg: string) => {
    setLogs((prev) => {
      const updated = [...prev, msg];
      console.log(msg);
      return updated;
    });
  };

  const toggleRuntime = useCallback((state: boolean) => {
    setEnabled(state);
    log(`🧠 Runtime toggled to ${state ? "ENABLED ✅" : "DISABLED ❌"}`);
  }, []);

  const runCommand = useCallback((cmd: string) => {
    const timestamp = new Date().toLocaleTimeString();
    log(`🎙️ Marco heard: "${cmd}" @ ${timestamp}`);
  }, []);

  const autoSync = useCallback(() => {
    log("🔁 MarcoCore auto-synchronizing Firebase ↔︎ App");
  }, []);

  const divineMemory = useCallback(() => {
    log("🧠 MarcoCore memory: Fully retained player + agent credentials (simulated)");
  }, []);

  return (
    <MarcoCoreContext.Provider
      value={{ enabled, logs, toggleRuntime, runCommand, autoSync, divineMemory }}
    >
      {children}
    </MarcoCoreContext.Provider>
  );
};

export const useMarcoCore = () => {
  const context = useContext(MarcoCoreContext);
  if (!context) throw new Error("useMarcoCore must be used within MarcoCoreProvider");
  return context;
};
