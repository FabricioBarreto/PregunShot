// components/game/LobbyPhase.js - VERSIÓN CORREGIDA ✅
export default function LobbyPhase({ snap, isHost, onStart }) {
  const connectedCount = snap?.players?.length || 0;

  console.log("🔍 DEBUG Lobby:");
  console.log("- Players:", snap.players);
  console.log("- Connected count:", connectedCount);
  console.log("- Is host:", isHost);
  console.log("- Phase:", snap.phase);

  return (
    <div className="glass-card rounded-3xl p-6 border border-white/30 mb-6 text-center">
      <div className="text-4xl font-black mb-2">🧩 Lobby</div>
      <div className="text-white/80 font-semibold mb-4">
        Esperando jugadores… ({connectedCount} conectados, mínimo 2)
      </div>

      {isHost ? (
        <button
          className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          onClick={onStart}
          disabled={connectedCount < 2}
        >
          🎲 Iniciar juego
        </button>
      ) : (
        <div className="text-white/70 font-semibold">
          El host inicia cuando estén listos.
        </div>
      )}
    </div>
  );
}
