/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Configuración explícita para Turbopack (Next.js 16+)
  turbopack: {},

  // Si necesitas deshabilitar Turbopack y usar webpack tradicional:
  // experimental: {
  //   turbo: false
  // },

  // Configuración para producción
  output: "standalone", // Optimiza para deploy

  // Variables de entorno públicas
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
