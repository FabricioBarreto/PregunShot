// components/game/LobbyPhase.js
export default function LobbyPhase({ snap, isHost, onStart }) {
  const connectedCount = snap.players.filter((p) => p.connected).length;

  // Debug logs corregidos
  console.log("Players in lobby:", snap.players);
  console.log("Connected count:", connectedCount);
  console.log("Room data:", snap);

  return (
    <div className="glass-card rounded-3xl p-6 border border-white/30 mb-6 text-center">
      <div className="text-4xl font-black mb-2">🧩 Lobby</div>
      <div className="text-white/80 font-semibold mb-4">
        Esperando jugadores… ({connectedCount} conectados, mínimo 2)
      </div>

      {isHost ? (
        <button
          className="btn-primary"
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
