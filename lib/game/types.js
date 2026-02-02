export const PHASES = {
  LOBBY: "LOBBY",
  ASKING: "ASKING",
  ANSWERING: "ANSWERING",
  ROUND_END: "ROUND_END",
  GAME_OVER: "GAME_OVER",
};

export function createInitialRoomState(code, hostId) {
  return {
    code,
    hostId,

    phase: PHASES.LOBBY,

    players: [], // { id, name, connected, shots }
    order: [],

    roundIndex: 0,
    targetId: null,

    questions: [], // [{ text }]
    expectedAskIds: [],
    receivedAskIds: [], // guardamos array para JSON fácil (Set en runtime si querés)

    answered: {}, // { [index]: "ANSWER" | "SHOT" }

    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
