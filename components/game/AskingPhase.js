// components/game/AskingPhase.js - VERSIÓN ACTUALIZADA ✅
import { useState } from "react";

export default function AskingPhase({ snap, question, setQuestion, onSend }) {
  const [hasAsked, setHasAsked] = useState(false);

  // ✅ NUEVO: Verificar si el usuario es el objetivo
  const isTarget = snap.players.find((p) => p.isMe)?.name === snap.targetName;

  const handleSend = () => {
    onSend();
    setHasAsked(true);
  };

  const targetPlayer = snap.players.find((p) => p.name === snap.targetName);
  const expected = snap.asking?.expected || 0;
  const received = snap.asking?.received || 0;

  return (
    <div className="glass-card rounded-3xl p-6 border border-white/30">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🎯</div>
        <div className="text-2xl font-black text-white mb-2">
          Ronda {snap.currentRound}
        </div>
        <div className="text-lg text-white/80 font-semibold">
          Objetivo:{" "}
          <span className="text-yellow-300 font-black">
            {targetPlayer?.name || "..."}
          </span>
        </div>
      </div>

      {/* ✅ NUEVO: Mostrar mensaje si es el objetivo */}
      {isTarget ? (
        <div className="rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-6 text-center">
          <div className="text-3xl mb-3">🎯</div>
          <div className="text-white font-black text-xl mb-2">
            ¡Eres el objetivo!
          </div>
          <div className="text-white/70 font-semibold">
            Espera a que todos envíen sus preguntas... ({received}/{expected})
          </div>
        </div>
      ) : hasAsked ? (
        // ✅ Ya envió su pregunta
        <div className="rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 p-6 text-center">
          <div className="text-3xl mb-3">✅</div>
          <div className="text-white font-black text-xl mb-2">
            Pregunta enviada
          </div>
          <div className="text-white/70 font-semibold">
            Esperando a los demás... ({received}/{expected})
          </div>
        </div>
      ) : (
        // ✅ Puede enviar pregunta
        <>
          <div className="mb-4">
            <label className="text-white/80 text-sm font-bold mb-2 block">
              Tu pregunta anónima para {targetPlayer?.name}:
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={200}
              rows={3}
              placeholder="Escribe tu pregunta..."
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 resize-none"
            />
            <div className="text-right text-xs text-white/50 mt-1 font-semibold">
              {question.length}/200
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={!question.trim()}
            className="w-full rounded-xl px-4 py-3 font-black text-white bg-indigo-500/90 hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            📤 Enviar pregunta anónima
          </button>

          <div className="mt-4 text-center text-sm text-white/60 font-semibold">
            {received}/{expected} preguntas recibidas
          </div>
        </>
      )}

      {/* ✅ Sugerencias solo si no es el objetivo y no ha preguntado */}
      {!isTarget && !hasAsked && snap.suggestions?.length > 0 && (
        <div className="mt-6">
          <div className="text-white/70 text-xs font-bold mb-2">
            💡 Sugerencias:
          </div>
          <div className="grid grid-cols-1 gap-2">
            {snap.suggestions.slice(0, 3).map((sug, i) => (
              <button
                key={i}
                onClick={() => setQuestion(sug)}
                className="text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold transition border border-white/10"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
