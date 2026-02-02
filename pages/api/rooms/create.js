import { supabaseAdmin } from "@/lib/supabaseAdmin";

function makeRoomCode() {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name } = req.body || {};
  const cleanName = String(name || "").trim().slice(0, 20);
  if (!cleanName) return res.status(400).json({ error: "Name required" });

  for (let i = 0; i < 8; i++) {
    const code = makeRoomCode();

    const { error: roomErr } = await supabaseAdmin
      .from("rooms")
      .insert([{ code }]);

    if (roomErr) continue;

    const { error: playerErr } = await supabaseAdmin
      .from("players")
      .insert([{ room_code: code, name: cleanName, is_host: true, connected: true }]);

    if (playerErr) {
      await supabaseAdmin.from("rooms").delete().eq("code", code);
      return res.status(500).json({ error: "Failed to create host" });
    }

    return res.status(200).json({ code });
  }

  return res.status(500).json({ error: "Failed to create room" });
}
