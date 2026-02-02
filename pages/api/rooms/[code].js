import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function handler(req, res) {
  const code = String(req.query.code || "")
    .trim()
    .toUpperCase();
  if (code.length !== 5) return res.status(400).json({ error: "Invalid code" });

  const { data: room, error: roomErr } = await supabaseAdmin
    .from("rooms")
    .select("code")
    .eq("code", code)
    .maybeSingle();

  if (roomErr) return res.status(500).json({ error: "DB error" });
  if (!room) return res.status(404).json({ error: "Room not found" });

  const { data: players, error: pErr } = await supabaseAdmin
    .from("players")
    .select("name,is_host,connected")
    .eq("room_code", code)
    .order("joined_at", { ascending: true });

  if (pErr) return res.status(500).json({ error: "DB error" });

  return res.status(200).json({ code, players });
}
