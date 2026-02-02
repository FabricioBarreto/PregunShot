// components/game/AskingPhase.js
import QuestionSuggestions from "./QuestionSuggestions";

export default function AskingPhase({ snap, question, setQuestion, onSend }) {
  const waiting = snap.asking?.waitingNames?.length
    ? snap.asking.waitingNames.join(", ")
    : "Nadie";

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0">
          <span className="text-xl">❓</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-white font-black text-base">
            Pregunta para{" "}
            <span className="text-yellow-300">{snap.targetName}</span>
          </div>
          <div className="text-white/60 text-xs font-medium">
            {snap.asking.received}/{snap.asking.expected} recibidas •
            Pendientes: {waiting}
          </div>
        </div>
      </div>

      <textarea
        className="w-full p-3 bg-black/30 backdrop-blur-sm rounded-xl text-white text-sm placeholder:text-white/40 border border-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 resize-none"
        rows={3}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Escribí una pregunta..."
        maxLength={200}
      />

      <div className="flex items-center justify-between mt-3 gap-3">
        <div className="text-xs text-white/50 font-medium">
          {question.length}/200
        </div>

        <button
          onClick={onSend}
          disabled={!question.trim()}
          className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Enviar
        </button>
      </div>

      <QuestionSuggestions
        suggestions={snap.suggestions || []}
        disabled={false}
        onPick={(s) => setQuestion((prev) => (prev ? `${prev}\n${s}` : s))}
      />
    </div>
  );
}
