// pages/api/rooms/[code].js
import { getRoom } from "@/lib/game/roomStore";

export default function handler(req, res) {
  const code = String(req.query.code || "")
    .trim()
    .toUpperCase();

  if (code.length !== 5) {
    return res.status(400).json({ error: "Invalid code" });
  }

  const room = getRoom(code);

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  // Convertir Map de jugadores a array
  const players = Array.from(room.players.values()).map((p) => ({
    name: p.name,
    is_host: p.isHost,
    connected: p.connected ?? true,
  }));

  return res.status(200).json({
    code: room.code,
    players,
  });
}
