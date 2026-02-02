// lib/game/mockSnap.js
export function getMockSnap({ phase = "ASKING" } = {}) {
  return {
    code: "ABC12",
    phase,
    targetName: "María",
    currentRound: 1,
    players: [
      { name: "Juan", shots: 2, isHost: true, isMe: true, connected: true },
      { name: "María", shots: 1, isHost: false, isMe: false, connected: true },
      { name: "Pedro", shots: 3, isHost: false, isMe: false, connected: true },
      { name: "Ana", shots: 0, isHost: false, isMe: false, connected: true },
    ],
    asking: {
      received: 2,
      expected: 3,
      waitingNames: ["Pedro"],
    },
    questionsForTarget: [
      "¿Cuál fue tu peor cita?",
      "¿Qué es lo más vergonzoso que hiciste después de salir?",
      "",
    ],
    // Sugerencias para la fase de preguntas
    suggestions: [
      "¿Qué hábito te gustaría mejorar este año?",
      "¿Qué fue lo mejor que te pasó últimamente?",
      "¿Qué cosa te cuesta decir en voz alta?",
      "¿Qué te gustaría que la gente entienda mejor de vos?",
      "¿Qué te da vergüenza admitir que te gusta?",
      "¿Qué consejo te hubiese servido hace un año?",
    ],
  };
}

export function getShotsFromPlayers(players = []) {
  return players.reduce((acc, p) => {
    acc[p.name] = p.shots ?? 0;
    return acc;
  }, {});
}
