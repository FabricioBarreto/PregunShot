// pages/api/socket.js - VERSIÓN ACTUALIZADA CON ROTACIÓN ALEATORIA ✅
import { Server } from "socket.io";
import { getRoom, createRoom, deleteRoom } from "@/lib/game/roomStore";

const QUESTION_SUGGESTIONS = [
  "¿Cuál es tu mayor miedo?",
  "¿Qué es lo más vergonzoso que te pasó?",
  "¿A quién le tienes envidia y por qué?",
  "¿Cuál fue tu peor cita?",
  "¿Qué secreto nunca le contaste a nadie?",
  "¿De qué te arrepientes más?",
  "¿Qué pensarían tus padres si supieran...?",
  "¿Cuál es tu fantasía más loca?",
  "¿Con quién de acá saldrías?",
  "¿Qué cosa harías si nadie se enterara?",
  "¿Cuál es tu guilty pleasure?",
  "¿Qué mentira dijiste que se salió de control?",
  "¿Cuál es la cosa más rara que hiciste borracho/a?",
  "¿A quién stalkeas en redes sociales?",
  "¿Qué harías si tuvieras $1 millón hoy?",
];

function getRandomSuggestions(count = 6) {
  const shuffled = [...QUESTION_SUGGESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ✅ NUEVO: Función para elegir objetivo aleatorio sin repeticiones
function getRandomTarget(room) {
  const playersArr = Array.from(room.players.values());

  if (playersArr.length === 0) return null;

  // Filtrar jugadores que no han sido objetivo recientemente
  const recentTargets = room.recentTargets || [];
  const availablePlayers = playersArr.filter(
    (p) => !recentTargets.includes(p.name),
  );

  // Si todos ya fueron objetivo, resetear la lista
  const candidates =
    availablePlayers.length > 0 ? availablePlayers : playersArr;

  // Elegir uno aleatorio
  const randomIdx = Math.floor(Math.random() * candidates.length);
  const target = candidates[randomIdx]?.name ?? null;

  // Actualizar lista de objetivos recientes
  if (!room.recentTargets) room.recentTargets = [];
  room.recentTargets.push(target);

  // Mantener solo los últimos N objetivos en memoria
  const maxHistory = Math.min(playersArr.length - 1, 3);
  if (room.recentTargets.length > maxHistory) {
    room.recentTargets.shift();
  }

  return target;
}

function buildSnap(room, extra = {}) {
  const expected = Math.max(room.players.size - 1, 0);

  return {
    code: room.code,
    phase: room.phase,
    currentRound: room.currentRound,
    targetName: room.targetName,
    players: Array.from(room.players.values()).map((p) => ({
      name: p.name,
      isHost: p.isHost,
      shots: p.shots ?? 0,
      connected: true,
    })),
    asking: {
      received: extra.received ?? 0,
      expected: extra.expected ?? expected,
      waitingNames: extra.waitingNames || [],
    },
    questionsForTarget: extra.questionsForTarget ?? [],
    answered: extra.answered ?? {},
    suggestions: room.phase === "ASKING" ? getRandomSuggestions(6) : [],
  };
}

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket.io ya está inicializado");
    res.end();
    return;
  }

  console.log("🚀 Inicializando Socket.io...");

  const io = new Server(res.socket.server, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("✅ Cliente conectado:", socket.id);

    // JOIN ROOM
    socket.on("room:join", ({ code, name }) => {
      try {
        const roomCode = String(code || "")
          .trim()
          .toUpperCase();
        const playerName = String(name || "")
          .trim()
          .slice(0, 20);

        if (roomCode.length !== 5 || !playerName) {
          socket.emit("room:error", { error: "Datos inválidos." });
          return;
        }

        console.log("🔍 Validando sala:", roomCode);

        let room = getRoom(roomCode);

        if (!room) {
          console.log("🆕 Creando nueva sala:", roomCode);
          room = createRoom(roomCode);
        }

        // ✅ NUEVO: Verificar si el jugador ya está conectado
        const existingPlayer = Array.from(room.players.values()).find(
          (p) => p.name === playerName,
        );

        if (existingPlayer) {
          console.log("⚠️ Jugador ya existe, actualizando socket ID");
          // Eliminar la conexión antigua
          room.players.delete(existingPlayer.id);
        }

        const isHost = room.players.size === 0;

        room.players.set(socket.id, {
          id: socket.id,
          name: playerName,
          isHost,
          shots: 0,
          connected: true,
        });

        socket.data.roomCode = roomCode;
        socket.data.playerName = playerName;
        socket.join(roomCode);

        console.log(
          "👤 Jugador unido:",
          playerName,
          "Total:",
          room.players.size,
        );

        io.to(roomCode).emit("room:snap", buildSnap(room));
      } catch (error) {
        console.error("❌ Error en room:join:", error);
        socket.emit("room:error", { error: "Error al unirse." });
      }
    });

    // START GAME
    socket.on("game:start", () => {
      try {
        console.log("🎮 Iniciando juego...");
        const roomCode = socket.data.roomCode;
        const room = getRoom(roomCode);

        if (!room) {
          socket.emit("room:error", { error: "Sala no encontrada." });
          return;
        }

        const me = room.players.get(socket.id);
        if (!me?.isHost) {
          socket.emit("room:error", { error: "Solo el host puede iniciar." });
          return;
        }

        if (room.players.size < 2) {
          socket.emit("room:error", { error: "Mínimo 2 jugadores." });
          return;
        }

        room.phase = "ASKING";

        // ✅ CAMBIO: Usar selección aleatoria
        room.targetName = getRandomTarget(room);

        console.log("✅ Juego iniciado. Target:", room.targetName);

        io.to(roomCode).emit("room:snap", buildSnap(room));
      } catch (error) {
        console.error("❌ Error en game:start:", error);
      }
    });

    // SEND QUESTION
    socket.on("question:send", ({ text }) => {
      try {
        const room = getRoom(socket.data.roomCode);
        if (!room || room.phase !== "ASKING") return;

        const me = room.players.get(socket.id);
        if (!me) return;

        // ✅ VALIDACIÓN 1: El objetivo NO puede hacer preguntas
        if (me.name === room.targetName) {
          console.log("❌ El objetivo no puede hacer preguntas");
          socket.emit("room:error", {
            error: "¡Eres el objetivo! No puedes hacer preguntas esta ronda.",
          });
          return;
        }

        const qText = String(text || "")
          .trim()
          .slice(0, 200);
        if (!qText) return;

        // ✅ VALIDACIÓN 2: Verificar si este jugador YA envió una pregunta en esta ronda
        const existingQuestion = Array.from(room.questions.values()).find(
          (q) =>
            q.round === room.currentRound &&
            q.targetName === room.targetName &&
            q.askerSocketId === socket.id,
        );

        if (existingQuestion) {
          console.log("❌ Jugador ya envió su pregunta:", me.name);
          socket.emit("room:error", {
            error: "Ya enviaste tu pregunta para esta ronda.",
          });
          return;
        }

        // Guardar pregunta con el ID del que pregunta
        const questionId = `q_${room.code}_${++room.questionCounter}`;
        room.questions.set(questionId, {
          id: questionId,
          text: qText,
          round: room.currentRound,
          targetName: room.targetName,
          askerSocketId: socket.id, // ✅ NUEVO: Guardar quién preguntó
          askerName: me.name, // ✅ NUEVO: Guardar nombre (para debug)
          action: null,
        });

        const expected = Math.max(room.players.size - 1, 0);

        const currentQuestions = Array.from(room.questions.values()).filter(
          (q) =>
            q.round === room.currentRound && q.targetName === room.targetName,
        );

        const received = currentQuestions.length;
        console.log(
          "📝 Pregunta recibida de:",
          me.name,
          "-",
          received,
          "/",
          expected,
        );

        if (expected > 0 && received >= expected) {
          room.phase = "ANSWERING";
          room.shuffledQuestions = shuffleArray(currentQuestions);
          console.log("✅ Cambiando a ANSWERING");
        }

        io.to(room.code).emit(
          "room:snap",
          buildSnap(room, {
            received,
            expected,
            questionsForTarget:
              room.phase === "ANSWERING"
                ? room.shuffledQuestions.map((q) => q.text)
                : [],
          }),
        );
      } catch (error) {
        console.error("❌ Error en question:send:", error);
      }
    });

    // ANSWER CHOOSE
    socket.on("answer:choose", ({ idx, action }) => {
      try {
        const room = getRoom(socket.data.roomCode);
        if (!room || room.phase !== "ANSWERING") return;

        const me = room.players.get(socket.id);

        // ✅ CAMBIO: Validar que solo el objetivo pueda responder
        if (!me || me.name !== room.targetName) {
          console.log("❌ Jugador no autorizado intentó responder:", me?.name);
          return;
        }

        const act = action === "ANSWER" || action === "SHOT" ? action : null;
        if (!act) return;

        const q = room.shuffledQuestions?.[idx];
        if (!q?.id) return;

        const question = room.questions.get(q.id);
        if (question) {
          question.action = act;
        }

        if (act === "SHOT") {
          const player = room.players.get(socket.id);
          if (player) {
            player.shots = (player.shots || 0) + 1;
            console.log("🥃 Shot para:", player.name, "Total:", player.shots);
          }
        }

        room.shuffledQuestions = room.shuffledQuestions.map((sq) => {
          const updated = room.questions.get(sq.id);
          return updated || sq;
        });

        const allDone =
          room.shuffledQuestions.length > 0 &&
          room.shuffledQuestions.every((x) => !!x.action);

        if (allDone) {
          room.phase = "ROUND_END";
          console.log("✅ Todas respondidas. ROUND_END");
        }

        const answered = room.shuffledQuestions.reduce((acc, q, idx) => {
          if (q.action) acc[idx] = q.action;
          return acc;
        }, {});

        io.to(room.code).emit(
          "room:snap",
          buildSnap(room, {
            questionsForTarget: room.shuffledQuestions.map((q) => q.text),
            received: room.shuffledQuestions.length || 0,
            expected: Math.max(room.players.size - 1, 0),
            answered,
          }),
        );
      } catch (error) {
        console.error("❌ Error en answer:choose:", error);
      }
    });

    // NEXT ROUND
    socket.on("round:next", () => {
      try {
        const room = getRoom(socket.data.roomCode);
        if (!room) return;

        const me = room.players.get(socket.id);
        if (!me?.isHost) return;

        room.currentRound += 1;
        room.phase = "ASKING";
        room.shuffledQuestions = [];

        for (const [id, q] of room.questions.entries()) {
          if (q.round < room.currentRound) {
            room.questions.delete(id);
          }
        }

        // ✅ CAMBIO: Usar selección aleatoria
        room.targetName = getRandomTarget(room);

        console.log(
          "➡️ Nueva ronda:",
          room.currentRound,
          "Target:",
          room.targetName,
        );

        io.to(room.code).emit("room:snap", buildSnap(room));
      } catch (error) {
        console.error("❌ Error en round:next:", error);
      }
    });

    // RESET GAME
    socket.on("game:reset", () => {
      try {
        const room = getRoom(socket.data.roomCode);
        if (!room) return;

        const me = room.players.get(socket.id);
        if (!me?.isHost) return;

        room.phase = "LOBBY";
        room.currentRound = 1;
        room.targetName = null;
        room.shuffledQuestions = [];
        room.questions.clear();
        room.questionCounter = 0;
        room.recentTargets = []; // ✅ AGREGADO: Limpiar historial de objetivos

        room.players.forEach((player) => {
          player.shots = 0;
        });

        console.log("🔄 Juego reseteado:", room.code);

        io.to(room.code).emit("room:snap", buildSnap(room));
      } catch (error) {
        console.error("❌ Error en game:reset:", error);
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log("🔌 Desconectado:", socket.id);
      const room = getRoom(socket.data.roomCode);
      if (!room) return;

      room.players.delete(socket.id);

      if (room.players.size === 0) {
        console.log("🗑️ Sala vacía, eliminando:", room.code);
        deleteRoom(room.code);
        return;
      }

      io.to(room.code).emit("room:snap", buildSnap(room));
    });
  });

  console.log("✅ Socket.io inicializado");
  res.end();
}
