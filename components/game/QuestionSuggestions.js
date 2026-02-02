// components/game/QuestionSuggestions.js
export default function QuestionSuggestions({
  suggestions = [],
  onPick,
  disabled,
}) {
  if (!suggestions.length) return null;

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-white/80 text-sm font-bold mb-3">Sugerencias</div>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((s, i) => (
          <button
            key={`${s}-${i}`}
            type="button"
            disabled={disabled}
            onClick={() => onPick(s)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-white/10 bg-black/20 text-white/80 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Usar sugerencia"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-3 text-xs text-white/50">
        Consejo: podés editar la sugerencia antes de enviarla.
      </div>
    </div>
  );
}
