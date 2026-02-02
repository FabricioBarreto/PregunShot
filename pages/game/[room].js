// pages/game/[room].js - VERSIÓN CON TODAS LAS INTEGRACIONES ✅
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";

import {
  HeaderBar,
  PlayersGrid,
  LobbyPhase,
  AskingPhase,
  AnsweringPhase,
  RoundEndPhase,
  GameOverPhase,
} from "@/components/game";

// ✅ AGREGADO: Importar GameStats y SoundSystem
import GameStats from "@/components/GameStats";
import { useSoundSystem } from "@/components/SoundSystem";

let socket;

export default function GameRoom() {
  const router = useRouter();
  const roomCode = String(router.query.room || "")
    .trim()
    .toUpperCase();
  const name = String(router.query.name || "").trim();

  const [snap, setSnap] = useState(null);
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [answered, setAnswered] = useState({});
  const [isConnected, setIsConnected] = useState(false);

  // ✅ AGREGADO: Estado para GameStats
  const [showStats, setShowStats] = useState(false);

  // ✅ AGREGADO: Hook de sonidos
  const { playSound, isMuted, toggleMute } = useSoundSystem();

  useEffect(() => {
    if (!roomCode || roomCode.length !== 5 || !name) return;

    const initSocket = async () => {
      socket = io({
        path: "/api/socketio",
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      socket.on("connect", () => {
        console.log("✅ Socket conectado:", socket.id);
        setIsConnected(true);
        socket.emit("room:join", { code: roomCode, name });
      });

      socket.on("room:snap", (s) => {
        console.log("📥 Room snap recibido:", s);
        const withMe = {
          ...s,
          players: (s.players || []).map((p) => ({
            ...p,
            isMe: p.name === name,
          })),
        };
        setSnap(withMe);

        // ✅ AGREGADO: Sincronizar answered desde el servidor
        if (s.answered) {
          setAnswered(s.answered);
        }
      });

      socket.on("room:error", (e) => {
        console.error("❌ Error de sala:", e);
        setError(e?.error || "Error desconocido");
      });

      socket.on("disconnect", () => {
        console.log("🔌 Socket desconectado");
        setIsConnected(false);
      });

      socket.on("connect_error", (err) => {
        console.error("❌ Error de conexión:", err);
        setError("Error de conexión al servidor");
      });
    };

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [roomCode, name]);

  // ✅ AGREGADO: Auto-abrir stats al terminar el juego
  useEffect(() => {
    if (snap?.phase === "GAME_OVER") {
      setShowStats(true);
    }
  }, [snap?.phase]);

  const isHost = useMemo(() => {
    if (!snap) return false;
    const me = snap.players?.find((p) => p.name === name);
    return Boolean(me?.isHost);
  }, [snap, name]);

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-950 text-white p-6">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-xl font-black mb-2">❌ No se pudo entrar</div>
          <div className="text-white/70 text-sm mb-4">{error}</div>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!snap) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="text-xl mb-2">⏳ Conectando...</div>
          <div className="text-sm text-white/60">
            {isConnected ? "Cargando sala..." : "Conectando al servidor..."}
          </div>
        </div>
      </div>
    );
  }

  const phase = snap.phase;

  const handleStart = () => {
    if (!socket) {
      console.error("❌ Socket no disponible");
      return;
    }
    console.log("🎮 Enviando game:start");
    socket.emit("game:start");
    playSound("success"); // ✅ AGREGADO: Sonido al iniciar
  };

  const handleSendQuestion = () => {
    if (!question.trim() || !socket) return;
    console.log("📝 Enviando pregunta:", question);
    socket.emit("question:send", { text: question.trim() });
    setQuestion("");
    playSound("question"); // ✅ AGREGADO: Sonido al enviar pregunta
  };

  const handleChooseAction = (idx, action) => {
    if (!socket) return;
    console.log("✅ Eligiendo acción:", { idx, action });
    setAnswered((prev) => ({ ...prev, [idx]: action }));
    socket.emit("answer:choose", { idx, action });
    playSound(action === "SHOT" ? "shot" : "answer"); // ✅ AGREGADO: Sonido según acción
  };

  const handleNextRound = () => {
    if (!socket) return;
    console.log("➡️ Siguiente ronda");
    setAnswered({});
    socket.emit("round:next");
    playSound("turn"); // ✅ AGREGADO: Sonido de cambio de turno
  };

  // ✅ AGREGADO: Handler para reset desde GameStats
  const handleReset = () => {
    setShowStats(false);
    if (socket) {
      socket.emit("game:reset");
      playSound("success");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      <div className="relative z-10 min-h-screen p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <HeaderBar
            snap={snap}
            isHost={isHost}
            onStart={handleStart}
            onShowStats={() => setShowStats(true)} // ✅ MODIFICADO
            onReset={() => router.push("/")}
            isMuted={isMuted} // ✅ AGREGADO
            onToggleMute={toggleMute} // ✅ AGREGADO
          />

          <div className="grid lg:grid-cols-[300px_1fr] gap-4">
            <div className="lg:sticky lg:top-4 lg:self-start">
              <PlayersGrid players={snap.players || []} />
            </div>

            <div className="space-y-4">
              {phase === "LOBBY" && (
                <LobbyPhase snap={snap} isHost={isHost} onStart={handleStart} />
              )}

              {phase === "ASKING" && (
                <AskingPhase
                  snap={snap}
                  question={question}
                  setQuestion={setQuestion}
                  onSend={handleSendQuestion}
                />
              )}

              {phase === "ANSWERING" && (
                <AnsweringPhase
                  questions={snap.questionsForTarget || []}
                  answered={answered}
                  isHost={isHost}
                  onChoose={handleChooseAction}
                  onNextRound={handleNextRound}
                />
              )}

              {phase === "ROUND_END" && (
                <RoundEndPhase isHost={isHost} onNextRound={handleNextRound} />
              )}

              {phase === "GAME_OVER" && (
                <GameOverPhase onShowStats={() => setShowStats(true)} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ AGREGADO: Modal de GameStats */}
      {showStats && (
        <GameStats
          players={snap.players || []}
          shots={snap.players.reduce((acc, p) => {
            acc[p.name] = p.shots || 0;
            return acc;
          }, {})}
          onClose={() => setShowStats(false)}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
