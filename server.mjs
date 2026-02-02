// server.mjs - VERSIÓN CON TODOS LOS FIXES APLICADOS ✅
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// ⚠️ CRÍTICO: Cargar variables de entorno PRIMERO
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env.local") });

// Validar que las variables de entorno están cargadas
if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  console.error("❌ ERROR: Faltan variables de entorno de Supabase");
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL:",
    process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓" : "✗",
  );
  console.error(
    "SUPABASE_SERVICE_ROLE_KEY:",
    process.env.SUPABASE_SERVICE_ROLE_KEY ? "✓" : "✗",
  );
  process.exit(1);
}

// ✅ AHORA SÍ importar módulos que usan las variables
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { supabaseAdmin } from "./lib/supabaseAdmin.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Store de salas en memoria
const rooms = new Map();

// ✅ FIX #2: Sugerencias de preguntas
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

// 🎲 Función para desordenar array (algoritmo Fisher-Yates)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRoom(code) {
  return rooms.get(code) || null;
}

function createRoom(code) {
  if (!rooms.has(code)) {
    rooms.set(code, {
      code,
      phase: "LOBBY",
      currentRound: 1,
      targetName: null,
      players: new Map(),
      shuffledQuestions: [], // 🎲 Guardamos el orden shuffleado para mantener consistencia
    });
  }
  return rooms.get(code);
}

function deleteRoom(code) {
  rooms.delete(code);
}

// ✅ FIX #1: Agregar answered y suggestions al snap
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
    answered: extra.answered ?? {}, // ✅ AGREGADO
    suggestions: room.phase === "ASKING" ? getRandomSuggestions(6) : [], // ✅ AGREGADO
  };
}

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error handling request", err);
      res.statusCode = 500;
      res.end("Internal server error");
    }
  });

  const io = new Server(httpServer, {
    path: "/api/socketio",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Cliente conectado:", socket.id);

    // JOIN ROOM
    socket.on("room:join", async ({ code, name }) => {
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

        // Validar que la sala existe en Supabase
        const { data: roomExists, error } = await supabaseAdmin
          .from("rooms")
          .select("code")
          .eq("code", roomCode)
          .maybeSingle();

        if (error) {
          console.error("❌ Error consultando Supabase:", error);
          socket.emit("room:error", { error: "Error al consultar la sala." });
          return;
        }

        if (!roomExists) {
          console.log("❌ Sala no existe:", roomCode);
          socket.emit("room:error", { error: "La sala no existe." });
          return;
        }

        const room = createRoom(roomCode);
        const isHost = room.players.size === 0;

        room.players.set(socket.id, {
          id: socket.id,
          name: playerName,
          isHost,
          shots: 0,
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
    socket.on("game:start", async () => {
      try {
        console.log("🎮 Iniciando juego...");
        const roomCode = socket.data.roomCode;
        const room = getRoom(roomCode);

        if (!room) {
          console.log("❌ Sala no encontrada");
          socket.emit("room:error", { error: "Sala no encontrada." });
          return;
        }

        const me = room.players.get(socket.id);
        if (!me?.isHost) {
          console.log("❌ No es host");
          socket.emit("room:error", { error: "Solo el host puede iniciar." });
          return;
        }

        if (room.players.size < 2) {
          console.log("❌ Faltan jugadores");
          socket.emit("room:error", { error: "Mínimo 2 jugadores." });
          return;
        }

        room.phase = "ASKING";

        const playersArr = Array.from(room.players.values());
        const idx = (room.currentRound - 1) % playersArr.length;
        room.targetName = playersArr[idx]?.name ?? null;

        console.log(
          "✅ Juego iniciado. Target:",
          room.targetName,
          "Phase:",
          room.phase,
        );

        io.to(roomCode).emit("room:snap", buildSnap(room));
      } catch (error) {
        console.error("❌ Error en game:start:", error);
      }
    });

    // SEND QUESTION
    socket.on("question:send", async ({ text }) => {
      try {
        const room = getRoom(socket.data.roomCode);
        if (!room || room.phase !== "ASKING") return;

        const me = room.players.get(socket.id);
        if (!me || me.name === room.targetName) return;

        const qText = String(text || "")
          .trim()
          .slice(0, 200);
        if (!qText) return;

        await supabaseAdmin.from("questions").insert([
          {
            room_code: room.code,
            round: room.currentRound,
            target_name: room.targetName,
            text: qText,
          },
        ]);

        const expected = Math.max(room.players.size - 1, 0);

        const { data: qs } = await supabaseAdmin
          .from("questions")
          .select("id,text")
          .eq("room_code", room.code)
          .eq("round", room.currentRound)
          .eq("target_name", room.targetName)
          .order("created_at", { ascending: true });

        const received = qs?.length || 0;
        console.log("📝 Pregunta recibida:", received, "/", expected);

        if (expected > 0 && received >= expected) {
          room.phase = "ANSWERING";

          // 🎲 Desordenar preguntas UNA SOLA VEZ y guardar el orden
          room.shuffledQuestions = shuffleArray(qs || []);

          console.log(
            "✅ Todas las preguntas recibidas. Cambiando a ANSWERING (preguntas desordenadas)",
          );
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
    socket.on("answer:choose", async ({ idx, action }) => {
      try {
        const room = getRoom(socket.data.roomCode);
        if (!room || room.phase !== "ANSWERING") return;

        const me = room.players.get(socket.id);
        if (!me || me.name !== room.targetName) return;

        const act = action === "ANSWER" || action === "SHOT" ? action : null;
        if (!act) return;

        // 🎲 Usar el orden shuffleado guardado en memoria
        const q = room.shuffledQuestions?.[idx];
        if (!q?.id) return;

        await supabaseAdmin
          .from("questions")
          .update({ action: act })
          .eq("id", q.id);

        if (act === "SHOT") {
          const player = room.players.get(socket.id);
          if (player) {
            player.shots = (player.shots || 0) + 1;
            console.log("🥃 Shot para:", player.name, "Total:", player.shots);
          }
        }

        // 🎲 Actualizar el array shuffleado en memoria
        const { data: qs2 } = await supabaseAdmin
          .from("questions")
          .select("id,action,text")
          .eq("room_code", room.code)
          .eq("round", room.currentRound)
          .eq("target_name", room.targetName)
          .order("created_at", { ascending: true });

        // Mantener el mismo orden shuffleado pero con las acciones actualizadas
        room.shuffledQuestions = room.shuffledQuestions.map((sq) => {
          const updated = qs2?.find((q) => q.id === sq.id);
          return updated || sq;
        });

        const allDone =
          room.shuffledQuestions.length > 0 &&
          room.shuffledQuestions.every((x) => !!x.action);

        if (allDone) {
          room.phase = "ROUND_END";
          console.log("✅ Todas respondidas. ROUND_END");
        }

        // ✅ FIX #3: Construir objeto answered desde shuffledQuestions
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
            answered, // ✅ AGREGADO
          }),
        );
      } catch (error) {
        console.error("❌ Error en answer:choose:", error);
      }
    });

    // NEXT ROUND
    socket.on("round:next", async () => {
      try {
        const room = getRoom(socket.data.roomCode);
        if (!room) return;

        const me = room.players.get(socket.id);
        if (!me?.isHost) return;

        room.currentRound += 1;
        room.phase = "ASKING";
        room.shuffledQuestions = []; // 🎲 Limpiar preguntas shuffleadas

        const playersArr = Array.from(room.players.values());
        const idx = (room.currentRound - 1) % playersArr.length;
        room.targetName = playersArr[idx]?.name ?? null;

        console.log(
          "➡️ Nueva ronda:",
          room.currentRound,
          "Target:",
          room.targetName,
        );

        await supabaseAdmin
          .from("questions")
          .delete()
          .eq("room_code", room.code)
          .lt("round", room.currentRound);

        io.to(room.code).emit("room:snap", buildSnap(room));
      } catch (error) {
        console.error("❌ Error en round:next:", error);
      }
    });

    // ✅ FIX #4: RESET GAME
    socket.on("game:reset", async () => {
      try {
        const room = getRoom(socket.data.roomCode);
        if (!room) return;

        const me = room.players.get(socket.id);
        if (!me?.isHost) return;

        // Resetear estado del juego
        room.phase = "LOBBY";
        room.currentRound = 1;
        room.targetName = null;
        room.shuffledQuestions = [];

        // Resetear shots de jugadores
        room.players.forEach((player) => {
          player.shots = 0;
        });

        console.log("🔄 Juego reseteado:", room.code);

        // Limpiar preguntas de la base de datos
        await supabaseAdmin
          .from("questions")
          .delete()
          .eq("room_code", room.code);

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

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`✅ Servidor listo en http://${hostname}:${port}`);
    });
});
