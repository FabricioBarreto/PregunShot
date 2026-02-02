// components/game/RoundEndPhase.js
export default function RoundEndPhase({ isHost, onNextRound }) {
  return (
    <div className="glass-card rounded-3xl p-6 border border-white/30 mb-6 text-center">
      <div className="text-3xl font-black mb-3">✅ Ronda terminada</div>
      <div className="text-white/80 font-semibold mb-4">
        Host: pasá a la siguiente ronda cuando quieras.
      </div>
      {isHost && (
        <button className="btn-primary" onClick={onNextRound}>
          ➡️ Siguiente ronda
        </button>
      )}
    </div>
  );
}
