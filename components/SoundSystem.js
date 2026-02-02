"use client";

import { useEffect, useState } from "react";

// Sistema de sonidos usando Web Audio API
export default function SoundSystem({ enabled = true }) {
  const [audioContext, setAudioContext] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(context);
    }
  }, []);

  const playSound = (type) => {
    if (!enabled || isMuted || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;

    switch (type) {
      case "shot":
        // Sonido de burbujas/líquido
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.3);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;

      case "answer":
        // Sonido de confirmación
        oscillator.frequency.setValueAtTime(523.25, now); // C5
        oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

      case "question":
        // Sonido de notificación
        oscillator.frequency.setValueAtTime(440, now);
        oscillator.frequency.setValueAtTime(554.37, now + 0.1);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

      case "turn":
        // Sonido de cambio de turno
        oscillator.frequency.setValueAtTime(329.63, now); // E4
        oscillator.frequency.setValueAtTime(392, now + 0.15); // G4
        oscillator.frequency.setValueAtTime(523.25, now + 0.3); // C5
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        oscillator.start(now);
        oscillator.stop(now + 0.4);
        break;

      case "success":
        // Sonido de éxito
        oscillator.frequency.setValueAtTime(523.25, now);
        oscillator.frequency.setValueAtTime(659.25, now + 0.1);
        oscillator.frequency.setValueAtTime(783.99, now + 0.2);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;

      case "error":
        // Sonido de error
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.setValueAtTime(150, now + 0.1);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

      default:
        oscillator.frequency.setValueAtTime(440, now);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }
  };

  return null; // Este componente no renderiza nada
}

// Hook personalizado para usar el sistema de sonidos
export function useSoundSystem() {
  const [audioContext, setAudioContext] = useState(null);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sound_muted") === "true";
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(context);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sound_muted", isMuted.toString());
    }
  }, [isMuted]);

  const playSound = (type) => {
    if (isMuted || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;

    switch (type) {
      case "shot":
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.3);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;

      case "answer":
        oscillator.frequency.setValueAtTime(523.25, now);
        oscillator.frequency.setValueAtTime(659.25, now + 0.1);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

      case "question":
        oscillator.frequency.setValueAtTime(440, now);
        oscillator.frequency.setValueAtTime(554.37, now + 0.1);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

      case "turn":
        oscillator.frequency.setValueAtTime(329.63, now);
        oscillator.frequency.setValueAtTime(392, now + 0.15);
        oscillator.frequency.setValueAtTime(523.25, now + 0.3);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        oscillator.start(now);
        oscillator.stop(now + 0.4);
        break;

      case "success":
        oscillator.frequency.setValueAtTime(523.25, now);
        oscillator.frequency.setValueAtTime(659.25, now + 0.1);
        oscillator.frequency.setValueAtTime(783.99, now + 0.2);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;

      case "error":
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.setValueAtTime(150, now + 0.1);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

      default:
        oscillator.frequency.setValueAtTime(440, now);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return { playSound, isMuted, toggleMute };
}
