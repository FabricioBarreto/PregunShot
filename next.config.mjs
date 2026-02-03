/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ⚠️ IMPORTANTE: Next.js con Socket.io NO puede ser standalone
  // standalone es solo para deployments serverless (Vercel, Netlify)
  // Como usas Socket.io, necesitas un servidor Node.js persistente

  // Descomentar solo si vas a deployar en un VPS/servidor dedicado
  // output: "standalone",
};

export default nextConfig;
