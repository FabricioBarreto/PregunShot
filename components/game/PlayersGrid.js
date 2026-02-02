// components/game/PlayersGrid.js
export default function PlayersGrid({ players }) {
  return (
    <div className="ui-panel">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">👥</span>
        <div className="text-white font-black text-sm">Jugadores</div>
      </div>
      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
        {players.map((p, i) => (
          <PlayerCard key={i} player={p} />
        ))}
      </div>
    </div>
  );
}

function PlayerCard({ player }) {
  return (
    <div
      className={`relative rounded-xl p-3 border transition-all duration-300 ${
        player.isMe
          ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/40 shadow-lg shadow-yellow-500/10"
          : "bg-white/5 border-white/10 hover:bg-white/10"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
            {player.name[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-bold text-sm truncate">
              {player.name}
            </div>
            <div className="text-white/60 text-xs font-medium">
              {player.isHost && "👑 "}
              {player.isMe && "🫵 "}
              {!player.connected && "⚠️ Offline"}
              {player.connected && !player.isHost && !player.isMe && "✓"}
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-white/90 font-black text-base">
            {player.shots}
          </div>
          <div className="text-white/50 text-[10px] font-semibold">shots</div>
        </div>
      </div>
    </div>
  );
}