// components/game/GameOverPhase.js
export default function GameOverPhase({ onShowStats }) {
  return (
    <div className="glass-card rounded-3xl p-6 border border-white/30 mb-6 text-center">
      <div className="text-4xl font-black mb-3">🏁 Fin del juego</div>
      <button className="btn-info" onClick={onShowStats}>
        📊 Ver estadísticas
      </button>
    </div>
  );
}
