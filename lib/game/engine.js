// lib/game/engine.js
import { PHASES } from "./types";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function reduceEvent(state, ev) {
  switch (ev.type) {
    case "START_GAME": {
      const order = state.players.map((p) => p.id);
      const targetId = order[0] ?? null;
      if (!targetId) return state;

      const expectedAskIds = order.filter((id) => id !== targetId);

      return {
        ...state,
        phase: PHASES.ASKING,
        order,
        roundIndex: 0,
        targetId,
        questions: [],
        expectedAskIds,
        receivedAskIds: [],
        answered: {},
        updatedAt: Date.now(),
      };
    }

    case "SUBMIT_QUESTION": {
      if (state.phase !== PHASES.ASKING) return state;
      if (!state.targetId) return state;
      if (ev.playerId === state.targetId) return state; // target no pregunta
      if (!state.expectedAskIds.includes(ev.playerId)) return state;
      if (state.receivedAskIds.includes(ev.playerId)) return state; // 1 sola

      const text = (ev.text ?? "").trim(); // puede ser vacío
      const receivedAskIds = [...state.receivedAskIds, ev.playerId];
      const questions = [...state.questions, { text }];

      const done = receivedAskIds.length === state.expectedAskIds.length;

      if (done) {
        const shuffled = shuffle(questions);
        return {
          ...state,
          questions: shuffled,
          receivedAskIds,
          phase: PHASES.ANSWERING,
          updatedAt: Date.now(),
        };
      }

      return {
        ...state,
        questions,
        receivedAskIds,
        updatedAt: Date.now(),
      };
    }

    case "ANSWER": {
      if (state.phase !== PHASES.ANSWERING) return state;
      if (ev.playerId !== state.targetId) return state;

      const index = ev.index;
      if (typeof index !== "number") return state;
      if (index < 0 || index >= state.questions.length) return state;
      if (state.answered[index]) return state;

      const action = ev.action; // "ANSWER" | "SHOT"
      if (action !== "ANSWER" && action !== "SHOT") return state;

      const answered = { ...state.answered, [index]: action };

      let players = state.players;
      if (action === "SHOT") {
        players = players.map((p) =>
          p.id === ev.playerId ? { ...p, shots: (p.shots || 0) + 1 } : p
        );
      }

      const allDone = Object.keys(answered).length === state.questions.length;

      return {
        ...state,
        players,
        answered,
        phase: allDone ? PHASES.ROUND_END : state.phase,
        updatedAt: Date.now(),
      };
    }

    case "NEXT_ROUND": {
      // Solo avanza si está en ROUND_END (o te permito forzarlo)
      if (![PHASES.ROUND_END, PHASES.ANSWERING].includes(state.phase)) return state;

      const nextIndex = state.roundIndex + 1;
      const isOver = nextIndex >= state.order.length;

      if (isOver) {
        return {
          ...state,
          phase: PHASES.GAME_OVER,
          updatedAt: Date.now(),
        };
      }

      const targetId = state.order[nextIndex];
      const expectedAskIds = state.order.filter((id) => id !== targetId);

      return {
        ...state,
        phase: PHASES.ASKING,
        roundIndex: nextIndex,
        targetId,
        questions: [],
        expectedAskIds,
        receivedAskIds: [],
        answered: {},
        updatedAt: Date.now(),
      };
    }

    case "RESET_ROOM": {
      // Mantener players, resetear juego
      return {
        ...state,
        phase: PHASES.LOBBY,
        order: [],
        roundIndex: 0,
        targetId: null,
        questions: [],
        expectedAskIds: [],
        receivedAskIds: [],
        answered: {},
        players: state.players.map((p) => ({ ...p, shots: 0 })),
        updatedAt: Date.now(),
      };
    }

    default:
      return state;
  }
}

/**
 * Snapshot público (lo que ve cualquier jugador)
 * - No filtra preguntas salvo para el target
 */
export function publicSnapshotFor(state, viewerId) {
  const target = state.players.find((p) => p.id === state.targetId);
  const viewerIsTarget = viewerId && viewerId === state.targetId;

  const waitingIds = state.expectedAskIds.filter(
    (id) => !state.receivedAskIds.includes(id)
  );

  const waitingNames = waitingIds
    .map((id) => state.players.find((p) => p.id === id)?.name)
    .filter(Boolean);

  return {
    code: state.code,
    phase: state.phase,

    players: state.players.map((p) => ({
      name: p.name,
      shots: p.shots || 0,
      connected: !!p.connected,
      isHost: p.id === state.hostId,
      isMe: p.id === viewerId,
    })),

    targetName: target ? target.name : null,

    round: {
      index: state.order.length ? state.roundIndex + 1 : 0,
      total: state.order.length,
    },

    asking: {
      received: state.receivedAskIds.length,
      expected: state.expectedAskIds.length,
      waitingNames,
    },

    // Solo el target ve las preguntas
    questionsForTarget:
      viewerIsTarget && state.phase !== PHASES.LOBBY
        ? state.questions.map((q) => q.text)
        : null,

    answered:
      viewerIsTarget && state.phase !== PHASES.LOBBY ? state.answered : null,
  };
}
