// ✅ LoadingScreen.tsx
// 📁 src/components/LoadingScreen.tsx
import { useNavigate } from "react-router-dom";

export function LoadingScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-yellow-100 text-center">
      <p className="text-2xl font-bold text-red-600 animate-pulse">Minimum balance at least ₱10</p>
      <p className="text-gray-700 mt-2 mb-4">Please top up before joining a match.</p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow"
      >
        ← Back to Lobby
      </button>
    </div>
  );
}