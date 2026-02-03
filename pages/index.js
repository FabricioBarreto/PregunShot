// pages/index.js - VERSIÓN ACTUALIZADA SIN API JOIN ✅

import { useEffect, useMemo, useState } from "react";
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

  const title = useMemo(() => "PregunShot", []);

  useEffect(() => {
    // Prefill cómodo: si ya puso nombre antes
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

  // ✅ ACTUALIZADO: Ya no llama a la API, va directo a la sala
  const joinRoom = () => {
    const code = room.trim().toUpperCase();
    if (!name.trim() || code.length !== 5) return;

    // El socket validará si la sala existe cuando intente conectarse
    goRoom(code);
  };

  return (
    <div className="min-h-screen relative">
      {/* Fondo moderno, suave, no gritón */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.25),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.18),transparent_55%)]" />
      <div className="absolute inset-0 pointer-events-none [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px] opacity-20" />

      <div className="relative z-10 flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: branding */}
          <div className="text-white">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
              <span className="text-lg">🍸</span>
              <span className="text-sm font-semibold text-white/80">
                Preguntas anónimas • Rondas • Sala con amigos
              </span>
            </div>

            <h1 className="mt-6 text-5xl md:text-6xl font-black tracking-tight">
              {title}
            </h1>

            <p className="mt-4 text-lg text-white/75 leading-relaxed max-w-xl">
              Entrás con tu nombre, armás una sala y en cada ronda todos le
              tiran preguntas anónimas a una persona. O responde… o toma.
              Simple.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
                🔒 Anónimo real
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
                ⚡ Sin registro
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
                🧊 Modo sin alcohol
              </span>
            </div>
          </div>

          {/* Right: card */}
          <div className="w-full">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
              <div className="p-7 md:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-white text-2xl font-black">Empezar</h2>
                    <p className="text-white/65 text-sm font-medium">
                      Todo lo que necesitás en 10 segundos.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowRules((v) => !v)}
                    className="text-white/70 hover:text-white text-sm font-bold px-3 py-2 rounded-xl border border-white/10 bg-white/5 transition"
                  >
                    {showRules ? "Cerrar guía" : "Cómo se juega"}
                  </button>
                </div>

                <div className="mt-6 space-y-5">
                  {/* Name */}
                  <div>
                    <label className="text-white/80 text-sm font-bold">
                      Tu nombre
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      maxLength={20}
                      placeholder="Ej: Enzo"
                      onKeyDown={(e) => e.key === "Enter" && createRoom()}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
                    />
                  </div>

                  {/* Actions */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      onClick={createRoom}
                      disabled={disabledCreate}
                      className="rounded-2xl px-4 py-3 font-black text-white bg-indigo-500/90 hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Creando..." : "Crear sala"}
                    </button>

                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white/70 text-sm font-semibold flex items-center justify-center">
                      Código de 5 letras
                    </div>
                  </div>

                  {/* Join */}
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <label className="text-white/80 text-sm font-bold">
                      Unirse a una sala
                    </label>
                    <div className="mt-2 flex gap-3">
                      <input
                        value={room}
                        onChange={(e) => setRoom(e.target.value.toUpperCase())}
                        disabled={loading}
                        maxLength={5}
                        placeholder="ABC12"
                        onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                        className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 tracking-[0.35em] font-black uppercase focus:outline-none focus:ring-2 focus:ring-pink-400/50"
                      />
                      <button
                        onClick={joinRoom}
                        disabled={disabledJoin}
                        className="rounded-2xl px-4 py-3 font-black text-white bg-pink-500/90 hover:bg-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Entrar
                      </button>
                    </div>
                    <p className="mt-3 text-xs text-white/55 font-semibold">
                      Tip: si te falta una letra, no adivines. Esto no es
                      Wordle.
                    </p>
                  </div>

                  {/* Rules */}
                  {showRules && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div className="text-white font-black text-lg mb-3">
                        Mini guía
                      </div>
                      <ol className="space-y-2 text-white/75 text-sm font-semibold">
                        <li>1) Uno crea sala, el resto entra con el código</li>
                        <li>2) El host inicia</li>
                        <li>3) Todos mandan 1 pregunta anónima al objetivo</li>
                        <li>4) Objetivo: responde o shot 🥃</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-7 md:px-8 py-5 border-t border-white/10 flex items-center justify-between text-white/50 text-xs font-semibold">
                <span>🔞 Jugá responsablemente</span>
                <span className="hidden sm:inline">
                  Hecho para juntadas, no para juicios
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
