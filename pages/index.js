// pages/index.js - DISEÑO PREMIUM MODERNO ✨

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function makeRoomCode() {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const disabledCreate = loading || !name.trim();
  const disabledJoin = loading || !name.trim() || room.trim().length !== 5;

  useEffect(() => {
    const saved = localStorage.getItem("ps_name");
    if (saved) setName(saved);
  }, []);

  useEffect(() => {
    if (!name) return;
    localStorage.setItem("ps_name", name);
  }, [name]);

  const goRoom = (code) => {
    router.push(`/game/${code}?name=${encodeURIComponent(name.trim())}`);
  };

  const createRoom = async () => {
    if (!name.trim()) return;
    setLoading(true);

    const res = await fetch("/api/rooms/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data?.error || "No se pudo crear la sala");
      return;
    }

    goRoom(data.code);
  };

  const joinRoom = () => {
    const code = room.trim().toUpperCase();
    if (!name.trim() || code.length !== 5) return;
    goRoom(code);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 🎨 Fondo mejorado con animación sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Orbes de luz animados */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-1/3 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500/25 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Grid pattern mejorado */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(255,255,255,0.03)_1.5px,transparent_1.5px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_40%,transparent_100%)]" />

      {/* Contenido */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr,500px] gap-8 lg:gap-12 items-center">
            {/* ===== COLUMNA IZQUIERDA: BRANDING ===== */}
            <div className="text-white space-y-8 order-2 lg:order-1">
              {/* Badge superior */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-gradient-to-r from-white/10 to-white/5 px-5 py-2.5 backdrop-blur-xl shadow-lg">
                <span className="text-2xl">🎯</span>
                <span className="text-sm font-bold text-white/90 tracking-wide">
                  Preguntas • Anónimas • Shots
                </span>
              </div>

              {/* Título principal */}
              <div>
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none">
                  <span className="block bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-2xl">
                    PregunShot
                  </span>
                </h1>
                <div className="mt-3 h-1.5 w-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg" />
              </div>

              {/* Descripción */}
              <p className="text-xl sm:text-2xl text-white/80 leading-relaxed max-w-2xl font-medium">
                El juego de preguntas anónimas para juntadas épicas.{" "}
                <span className="text-white font-bold">
                  Preguntá sin filtro
                </span>
                ,{" "}
                <span className="text-purple-300 font-bold">
                  respondé con valentía
                </span>{" "}
                o <span className="text-pink-300 font-bold">tomá un shot</span>.
              </p>

              {/* Features badges */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: "🔒", text: "100% Anónimo" },
                  { icon: "⚡", text: "Sin registro" },
                  { icon: "🎮", text: "Multijugador" },
                  { icon: "🧊", text: "Opción sin alcohol" },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30 hover:scale-105"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </span>
                    <span className="text-sm font-bold text-white/90">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Testimonial o stats */}
              <div className="hidden lg:block p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm">
                <p className="text-white/70 italic mb-3 text-lg">
                  "La mejor forma de conocer a tus amigos... o dejar de
                  hablarles"
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[
                      "bg-gradient-to-br from-purple-400 to-purple-600",
                      "bg-gradient-to-br from-pink-400 to-pink-600",
                      "bg-gradient-to-br from-indigo-400 to-indigo-600",
                    ].map((bg, i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-full ${bg} border-2 border-slate-900 flex items-center justify-center text-sm font-black text-white shadow-lg`}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-white/60 text-sm font-semibold">
                    +1,000 jugadores activos
                  </span>
                </div>
              </div>
            </div>

            {/* ===== COLUMNA DERECHA: FORMULARIO ===== */}
            <div className="order-1 lg:order-2 w-full">
              <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden">
                {/* Header del card */}
                <div className="relative p-4 sm:p-6 lg:p-8 border-b border-white/10 bg-gradient-to-br from-indigo-500/10 to-pink-500/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-black mb-1 truncate">
                        Empezar
                      </h2>
                      <p className="text-white/70 text-xs sm:text-sm font-semibold">
                        Creá o unite en 10 segundos
                      </p>
                    </div>

                    {/* Botón de reglas */}
                    <button
                      onClick={() => setShowRules(!showRules)}
                      className="shrink-0 px-3 sm:px-4 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
                    >
                      {showRules ? "✕" : "❓"}
                    </button>
                  </div>
                </div>

                {/* Cuerpo del formulario */}
                <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
                  {/* Input de nombre */}
                  <div className="space-y-2">
                    <label className="text-white/90 text-sm font-bold flex items-center gap-2">
                      <span>👤</span>
                      <span>Tu nombre</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && createRoom()}
                      disabled={loading}
                      maxLength={20}
                      placeholder="Ej: Mateo"
                      className="w-full rounded-2xl border border-white/20 bg-black/30 px-4 sm:px-5 py-3 sm:py-4 text-white text-base sm:text-lg font-semibold placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/60 transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Botón crear sala */}
                  <button
                    onClick={createRoom}
                    disabled={disabledCreate}
                    className="w-full group relative overflow-hidden rounded-2xl px-4 sm:px-6 py-3 sm:py-4 font-black text-base sm:text-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 transition-opacity group-hover:opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 shrink-0"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span className="truncate">Creando sala...</span>
                        </>
                      ) : (
                        <>
                          <span className="shrink-0">🎮</span>
                          <span className="truncate">Crear sala nueva</span>
                        </>
                      )}
                    </span>
                  </button>

                  {/* Divisor */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="text-white/50 text-xs sm:text-sm font-bold shrink-0">
                      O
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>

                  {/* Unirse a sala */}
                  <div className="space-y-3 p-4 sm:p-5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm">
                    <label className="text-white/90 text-sm font-bold flex items-center gap-2">
                      <span>🔑</span>
                      <span>Unirse con código</span>
                    </label>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={room}
                        onChange={(e) => setRoom(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                        disabled={loading}
                        maxLength={5}
                        placeholder="ABC12"
                        className="w-full sm:flex-1 rounded-2xl border border-white/20 bg-black/40 px-4 sm:px-5 py-3 sm:py-4 text-white text-center text-xl sm:text-2xl font-black tracking-[0.3em] uppercase placeholder:text-white/30 placeholder:tracking-normal placeholder:text-base sm:placeholder:text-lg focus:outline-none focus:ring-2 focus:ring-pink-400/60 focus:border-pink-400/60 transition-all disabled:opacity-50"
                      />

                      <button
                        onClick={joinRoom}
                        disabled={disabledJoin}
                        className="w-full sm:w-auto sm:shrink-0 group relative overflow-hidden rounded-2xl px-6 py-3 sm:py-4 font-black text-base sm:text-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-600 transition-opacity group-hover:opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative">Entrar</span>
                      </button>
                    </div>

                    <p className="text-xs text-white/60 font-semibold flex items-start gap-1.5">
                      <span className="shrink-0">💡</span>
                      <span className="leading-relaxed">
                        El código tiene 5 letras. Sin espacios ni números.
                      </span>
                    </p>
                  </div>

                  {/* Reglas expandibles */}
                  {showRules && (
                    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 sm:p-5 space-y-3 animate-slide-up backdrop-blur-sm">
                      <h3 className="text-white font-black text-base sm:text-lg flex items-center gap-2">
                        <span className="shrink-0">📋</span>
                        <span>Cómo se juega</span>
                      </h3>

                      <ol className="space-y-2.5">
                        {[
                          "Uno crea la sala y comparte el código",
                          "El host inicia cuando todos estén listos",
                          "Cada ronda, todos hacen 1 pregunta anónima al objetivo",
                          "El objetivo decide: responder o tomar un shot 🥃",
                          "Nueva ronda, nuevo objetivo. ¡A divertirse!",
                        ].map((rule, i) => (
                          <li
                            key={i}
                            className="flex gap-2.5 sm:gap-3 text-white/80 text-xs sm:text-sm font-semibold"
                          >
                            <span className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-lg">
                              {i + 1}
                            </span>
                            <span className="pt-0.5 leading-relaxed">
                              {rule}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>

                {/* Footer del card */}
                <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-t border-white/10 bg-black/20">
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 sm:gap-4 text-xs text-white/60 font-bold">
                    <span className="flex items-center gap-1.5 shrink-0">
                      <span>🔞</span>
                      <span>Jugá responsablemente</span>
                    </span>
                    <span className="text-center sm:text-right">
                      Para juntadas, no para juicios
                    </span>
                  </div>
                </div>
              </div>

              {/* Info extra debajo del card - solo mobile */}
              <div className="lg:hidden mt-4 sm:mt-6 p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-center">
                <p className="text-white/70 italic mb-2 sm:mb-3 text-xs sm:text-sm leading-relaxed">
                  "La mejor forma de conocer a tus amigos..."
                </p>
                <span className="text-white/60 text-xs font-semibold">
                  +1,000 jugadores
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
