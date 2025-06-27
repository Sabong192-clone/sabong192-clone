// 📢 MarcoVoiceOverlay.tsx
import React, { useEffect, useState } from "react";

export const MarcoVoiceOverlay = () => {
  const [listening, setListening] = useState(false);
  const [command, setCommand] = useState("Initializing...");

  useEffect(() => {
    // Simulate voice recognition init
    const timeout = setTimeout(() => {
      setListening(true);
      setCommand("🧠 Marco is listening...");
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`rounded-xl p-4 text-sm shadow-lg transition-all ${listening ? "bg-green-600 text-white" : "bg-gray-800 text-gray-300"}`}>
        <div className="font-bold">🎙️ MarcoVoice</div>
        <div className="mt-1 italic">{command}</div>
      </div>
    </div>
  );
};
