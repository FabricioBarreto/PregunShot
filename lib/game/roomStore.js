// lib/game/roomStore.js
const rooms = new Map();

export function getRoom(code) {
  return rooms.get(code);
}

export function createRoom(code) {
  if (!rooms.has(code)) {
    rooms.set(code, {
      code,
      phase: "LOBBY",
      currentRound: 1,
      targetName: null,
      players: new Map(), // socketId -> { id,name,isHost,shots }
    });
  }
  return rooms.get(code);
}

export function deleteRoom(code) {
  rooms.delete(code);
}

export function setShotsByName(room, name, delta) {
  for (const p of room.players.values()) {
    if (p.name === name) {
      p.shots = Math.max(0, (p.shots || 0) + delta);
      return p.shots;
    }
  }
  return null;
}

export function buildSnap(room, extra = {}) {
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
      isMe: false, // el cliente lo marca
    })),
    asking: {
      received: extra.received ?? 0,
      expected,
      waitingNames: [],
    },
    questionsForTarget: extra.questionsForTarget ?? [],
  };
}
