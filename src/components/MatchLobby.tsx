// ✅ MatchLobby - Responsive
// 📁 src/components/MatchLobby.tsx
export function MatchLobby({ matches, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {matches.map((match) => (
        <div
          key={match.id}
          className="bg-white p-4 shadow rounded cursor-pointer hover:bg-gray-100"
          onClick={() => onSelect(match)}
        >
          <p className="text-sm">🐓 Match: {match.title}</p>
          <p className="text-xs text-gray-500">Status: {match.status}</p>
        </div>
      ))}
    </div>
  );
}