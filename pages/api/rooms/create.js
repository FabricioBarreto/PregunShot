// pages/api/rooms/create.js
function makeRoomCode() {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name } = req.body || {};
  const cleanName = String(name || "")
    .trim()
    .slice(0, 20);

  if (!cleanName) {
    return res.status(400).json({ error: "Name required" });
  }

  const code = makeRoomCode();

  // La sala se creará cuando el jugador se conecte por socket
  return res.status(200).json({ code });
}
