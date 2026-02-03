// lib/socket.js
import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io({
      path: "/api/socket", // ✅ ACTUALIZADO de /api/socketio
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      autoConnect: false,
    });

    // Eventos globales de debugging
    socket.on("connect", () => {
      console.log("✅ Socket conectado:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket desconectado");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Error de conexión:", err);
    });

    socket.on("room:error", (error) => {
      console.error("❌ Error de sala:", error);
      alert(error.error || "Error desconocido");
    });
  }
  return socket;
};

export const connectSocket = () => {
  const sock = getSocket();
  if (!sock.connected) {
    sock.connect();
  }
  return sock;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
