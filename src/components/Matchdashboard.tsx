// 📁 src/components/MatchDashboard.tsx
export function MatchDashboard({ match }) {
  return (
    <div className="bg-white dark:bg-zinc-900 dark:text-white p-4 rounded shadow w-full max-w-screen-md mx-auto">
      <h2 className="text-xl font-bold mb-4">🐓 {match.title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded">
          <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-400 mb-1">💸 Bets Summary</h3>
          <p>🟥 Meron: <strong>₱{match.meronBetsTotal?.toLocaleString()}</strong></p>
          <p>🟦 Wala: <strong>₱{match.walaBetsTotal?.toLocaleString()}</strong></p>
        </div>

        <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded">
          <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-400 mb-1">📊 Match Status</h3>
          <p>Status: <strong>{match.status}</strong></p>
          <p>Result: <strong>{match.result || "Pending"}</strong></p>
        </div>
      </div>
    </div>
  );
}
