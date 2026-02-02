// load-env.js - Crear en la raíz del proyecto
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, ".env.local") });

// Validación
if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  console.error("❌ ERROR: Variables de entorno no cargadas correctamente");
  console.error("Verifica que .env.local existe y tiene el formato correcto");
  process.exit(1);
}
