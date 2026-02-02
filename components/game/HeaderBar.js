// components/game/HeaderBar.js - VERSIÓN MEJORADA ✅
import { useState } from "react";

export default function HeaderBar({
  snap,
  isHost,
  onStart,
  onShowStats,
  onReset,
  isMuted, // ✅ AGREGADO
  onToggleMute, // ✅ AGREGADO
}) {
  const connectedCount = snap.players.filter((p) => p.connected).length;
  const [copied, setCopied] = useState(false); // ✅ AGREGADO

  // ✅ AGREGADO: Función para copiar código
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(snap.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error copiando:", err);
    }
  };

  return (
    <div className="ui-panel">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl p-2.5 shadow-lg">
            <span className="text-xl">🎮</span>
          </div>
          <div>
            {/* ✅ MODIFICADO: Código copiable */}
            <button
              onClick={copyCode}
              className="text-lg font-black text-white hover:text-yellow-300 transition cursor-pointer"
              title="Copiar código"
            >
              {copied ? "✅ Copiado!" : `Sala ${snap.code}`}
            </button>
            <div className="text-xs text-white/70 font-medium">
              {connectedCount}/{snap.players.length} online • Ronda{" "}
              {snap.currentRound || 1}
              {/* ✅ AGREGADO: Mostrar fase actual */}
              {snap.phase !== "LOBBY" && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-[10px] uppercase">
                  {snap.phase === "ASKING" && "📝 Preguntando"}
                  {snap.phase === "ANSWERING" && "💭 Respondiendo"}
                  {snap.phase === "ROUND_END" && "✅ Fin de ronda"}
                  {snap.phase === "GAME_OVER" && "🏁 Juego terminado"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {/* ✅ AGREGADO: Botón de mute */}
          {onToggleMute && (
            <button
              onClick={onToggleMute}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-xs transition shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              title={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
          )}

          {/* Botones existentes */}
          {isHost && snap.phase !== "LOBBY" && (
            <>
              <button
                onClick={onShowStats}
                className="px-3 py-2 bg-blue-500/90 hover:bg-blue-500 text-white rounded-lg font-bold text-xs transition shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                title="Ver estadísticas"
              >
                📊
              </button>
              <button
                onClick={onReset}
                className="px-3 py-2 bg-red-500/90 hover:bg-red-500 text-white rounded-lg font-bold text-xs transition shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                title="Salir"
              >
                🚪
              </button>
            </>
          )}

          {/* ✅ AGREGADO: Botón salir siempre visible si no es host */}
          {!isHost && (
            <button
              onClick={onReset}
              className="px-3 py-2 bg-red-500/90 hover:bg-red-500 text-white rounded-lg font-bold text-xs transition shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              title="Salir"
            >
              🚪
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
