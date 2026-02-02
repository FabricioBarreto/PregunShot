import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { code, name } = req.body || {};
  const cleanCode = String(code || "")
    .trim()
    .toUpperCase();
  const cleanName = String(name || "")
    .trim()
    .slice(0, 20);

  if (cleanCode.length !== 5)
    return res.status(400).json({ error: "Invalid code" });
  if (!cleanName) return res.status(400).json({ error: "Name required" });

  const { data: room, error: roomErr } = await supabaseAdmin
    .from("rooms")
    .select("code")
    .eq("code", cleanCode)
    .maybeSingle();

  if (roomErr) return res.status(500).json({ error: "DB error" });
  if (!room) return res.status(404).json({ error: "Room not found" });

  const { error: insertErr } = await supabaseAdmin
    .from("players")
    .insert([
      {
        room_code: cleanCode,
        name: cleanName,
        is_host: false,
        connected: true,
      },
    ]);

  if (insertErr) {
    // si ya existía, lo marcamos conectado
    await supabaseAdmin
      .from("players")
      .update({ connected: true })
      .eq("room_code", cleanCode)
      .eq("name", cleanName);
  }

  return res.status(200).json({ ok: true });
}
