// components/game/AnsweringPhase.js
export default function AnsweringPhase({
  questions,
  answered,
  isHost,
  onChoose,
  onNextRound,
}) {
  const allAnswered =
    questions.length > 0 && Object.keys(answered).length === questions.length;

  return (
    <div className="glass-card rounded-3xl p-6 border border-white/30 mb-6">
      <div className="text-3xl font-black mb-4">🎯 Te toca responder</div>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const status = answered[idx]; // "ANSWER" | "SHOT"
          const empty = !q || q.trim() === "";

          return (
            <div
              key={idx}
              className="glass-card rounded-2xl p-5 border border-white/20"
            >
              <div className="font-black mb-2">
                #{idx + 1} — {empty ? "🎁 Regalo" : "🔒 Anónima"}
              </div>

              <div className="text-white/90 mb-4">
                {empty ? "Pregunta vacía. Alguien te perdonó el shot 🥹" : q}
              </div>

              {!status ? (
                <div className="flex gap-3 flex-wrap">
                  <button
                    className="btn-success flex-1"
                    onClick={() => onChoose(idx, "ANSWER")}
                  >
                    ✅ Responder
                  </button>

                  {!empty && (
                    <button
                      className="btn-danger flex-1"
                      onClick={() => onChoose(idx, "SHOT")}
                    >
                      🥃 Shot
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-white/80 font-bold">
                  {status === "ANSWER"
                    ? "✅ Marcada como respondida"
                    : "🥃 Shot tomado"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allAnswered && (
        <div className="mt-6 text-center">
          {isHost ? (
            <button className="btn-primary" onClick={onNextRound}>
              ➡️ Siguiente ronda
            </button>
          ) : (
            <div className="text-white/80 font-semibold">
              Esperando al host para pasar de ronda...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
