require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("🧪 PREGUNSHOT - TEST DE CONEXIÓN\n");
console.log("=================================");

// Test 1: Variables de entorno
console.log("\n📝 Test 1: Variables de entorno");
console.log("--------------------------------");
console.log("✓ NEXT_PUBLIC_SUPABASE_URL:", SUPABASE_URL ? "✅ OK" : "❌ FALTA");
console.log(
  "✓ SUPABASE_SERVICE_ROLE_KEY:",
  SUPABASE_SERVICE_KEY ? "✅ OK" : "❌ FALTA"
);
console.log(
  "✓ NEXT_PUBLIC_SUPABASE_ANON_KEY:",
  SUPABASE_ANON_KEY ? "✅ OK" : "❌ FALTA"
);

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.log("\n❌ Error: Faltan variables de entorno críticas");
  console.log("Verifica tu archivo .env.local");
  process.exit(1);
}

// Test 2: Conexión con Service Role
console.log("\n📡 Test 2: Conexión con Service Role");
console.log("--------------------------------");

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testConnection() {
  try {
    // Test básico de conexión
    const { data, error } = await supabaseAdmin.from("rooms").select("count");

    if (error) {
      console.log("❌ Error de conexión:", error.message);
      return false;
    }

    console.log("✅ Conexión exitosa a Supabase");
    return true;
  } catch (err) {
    console.log("❌ Error inesperado:", err.message);
    return false;
  }
}

// Test 3: Verificar tablas
console.log("\n🗄️  Test 3: Verificar tablas");
console.log("--------------------------------");

async function checkTables() {
  const tables = ["rooms", "players", "questions"];
  const results = {};

  for (const table of tables) {
    try {
      const { data, error } = await supabaseAdmin
        .from(table)
        .select("*")
        .limit(1);

      if (error) {
        results[table] = `❌ Error: ${error.message}`;
      } else {
        results[table] = "✅ OK";
      }
    } catch (err) {
      results[table] = `❌ Error: ${err.message}`;
    }
  }

  for (const [table, status] of Object.entries(results)) {
    console.log(`  ${table}: ${status}`);
  }

  return Object.values(results).every((r) => r.includes("✅"));
}

// Test 4: Crear sala de prueba
console.log("\n🧪 Test 4: Crear sala de prueba");
console.log("--------------------------------");

async function testCreateRoom() {
  const testCode =
    "TEST" + Math.random().toString(36).slice(2, 3).toUpperCase();

  try {
    // Crear sala
    const { data: room, error: roomError } = await supabaseAdmin
      .from("rooms")
      .insert([{ code: testCode }])
      .select()
      .single();

    if (roomError) {
      console.log("❌ Error al crear sala:", roomError.message);
      return false;
    }

    console.log(`✅ Sala creada: ${testCode}`);

    // Crear jugador
    const { data: player, error: playerError } = await supabaseAdmin
      .from("players")
      .insert([
        {
          room_code: testCode,
          name: "TestPlayer",
          is_host: true,
          connected: true,
        },
      ])
      .select()
      .single();

    if (playerError) {
      console.log("❌ Error al crear jugador:", playerError.message);
      return false;
    }

    console.log("✅ Jugador creado: TestPlayer");

    // Limpiar
    await supabaseAdmin.from("rooms").delete().eq("code", testCode);
    console.log("✅ Sala de prueba eliminada");

    return true;
  } catch (err) {
    console.log("❌ Error inesperado:", err.message);
    return false;
  }
}

// Ejecutar todos los tests
(async () => {
  let allPassed = true;

  if (!(await testConnection())) {
    allPassed = false;
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!(await checkTables())) {
    allPassed = false;
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!(await testCreateRoom())) {
    allPassed = false;
  }

  console.log("\n=================================");
  if (allPassed) {
    console.log("✅ TODOS LOS TESTS PASARON");
    console.log("Tu configuración está correcta!");
    console.log("\nPuedes ejecutar: npm run dev");
  } else {
    console.log("❌ ALGUNOS TESTS FALLARON");
    console.log("Revisa la configuración arriba");
    console.log("\nPasos sugeridos:");
    console.log("1. Verifica .env.local");
    console.log("2. Ejecuta el script SQL en Supabase");
    console.log("3. Verifica las políticas RLS");
  }
  console.log("=================================\n");

  process.exit(allPassed ? 0 : 1);
})();
