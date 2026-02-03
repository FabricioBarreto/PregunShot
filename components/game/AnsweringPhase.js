// components/game/AnsweringPhase.js
export default function AnsweringPhase({
  questions,
  answered,
  isTarget, // ✅ CAMBIO: ya no isHost
  onChoose,
  onNextRound,
}) {
  const allAnswered = questions.every((_, idx) => answered[idx]);

  return (
    <div className="glass-card rounded-3xl p-6 border border-white/30">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🎯</div>
        <div className="text-2xl font-black text-white">Te toca responder</div>
        {!isTarget && (
          <div className="text-white/70 text-sm mt-2 font-semibold">
            Esperando a que {isTarget ? "respondas" : "el objetivo responda"}...
          </div>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/20 bg-white/5 p-4"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-white/70 font-bold">
                #{idx + 1} — 🔒 Anónima
              </span>
            </div>
            <div className="text-white/90 text-lg mb-4 font-semibold">{q}</div>

            {answered[idx] ? (
              <div className="text-center py-3 rounded-xl bg-white/10 text-white/80 font-bold">
                {answered[idx] === "ANSWER"
                  ? "✅ Respondida"
                  : "🥃 Shot tomado"}
              </div>
            ) : isTarget ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onChoose(idx, "ANSWER")}
                  className="rounded-xl px-4 py-3 font-black text-white bg-green-500/90 hover:bg-green-500 transition"
                >
                  ✅ Responder
                </button>
                <button
                  onClick={() => onChoose(idx, "SHOT")}
                  className="rounded-xl px-4 py-3 font-black text-white bg-red-500/90 hover:bg-red-500 transition"
                >
                  🥃 Shot
                </button>
              </div>
            ) : (
              <div className="text-center py-3 rounded-xl bg-white/5 text-white/60 font-semibold">
                ⏳ Esperando decisión...
              </div>
            )}
          </div>
        ))}
      </div>

      {allAnswered && (
        <div className="mt-6 text-center text-white/70 text-sm font-semibold">
          ¡Todas respondidas! El host puede avanzar a la siguiente ronda.
        </div>
      )}
    </div>
  );
}
