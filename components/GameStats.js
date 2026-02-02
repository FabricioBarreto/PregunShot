// components/GameStats.js - REDISEÑO COMPLETO

"use client";

import { useState, useEffect } from "react";

export default function GameStats({ players, shots, onClose, onReset }) {
  const [showStats, setShowStats] = useState(false);
  const [podium, setPodium] = useState([]);

  useEffect(() => {
    const sorted = Object.entries(shots)
      .map(([player, count]) => ({ player, shots: count }))
      .sort((a, b) => b.shots - a.shots);

    setPodium(sorted);
    setTimeout(() => setShowStats(true), 100);
  }, [shots]);

  const getMedal = (index) => {
    switch (index) {
      case 0:
        return {
          emoji: "🥇",
          gradient: "from-yellow-400 via-yellow-500 to-orange-500",
          title: "Rey/Reina de los Shots",
          shadow: "shadow-yellow-500/50",
        };
      case 1:
        return {
          emoji: "🥈",
          gradient: "from-gray-300 via-gray-400 to-gray-500",
          title: "Subcampeón",
          shadow: "shadow-gray-500/50",
        };
      case 2:
        return {
          emoji: "🥉",
          gradient: "from-orange-400 via-orange-500 to-amber-600",
          title: "Tercer Lugar",
          shadow: "shadow-orange-500/50",
        };
      default:
        return {
          emoji: "🎖️",
          gradient: "from-purple-400 via-purple-500 to-purple-600",
          title: "Participante",
          shadow: "shadow-purple-500/50",
        };
    }
  };

  const getTotalShots = () => {
    return Object.values(shots).reduce((acc, curr) => acc + curr, 0);
  };

  const getAverage = () => {
    const total = getTotalShots();
    return (total / players.length).toFixed(1);
  };

  const getMostBrave = () => {
    const sorted = Object.entries(shots).sort((a, b) => a[1] - b[1]);
    return sorted.length > 0 ? sorted[0][0] : "";
  };

  const getMostWild = () => {
    const sorted = Object.entries(shots).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : "";
  };

  if (!showStats) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg animate-fade-in">
      <div className="glass-card-stats rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-yellow-400/50 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4 animate-bounce">🏆</div>
          <h2 className="text-6xl font-black mb-4 text-white drop-shadow-lg">
            Estadísticas
          </h2>
          <p className="text-2xl text-white/90 font-bold">
            ¡Mira quién fue el más salvaje! 😈
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="glass-card rounded-2xl p-6 border-2 border-purple-400/50 text-center transform hover:scale-105 transition-all">
            <div className="text-5xl mb-3 animate-bounce">🍻</div>
            <div className="text-5xl font-black text-white mb-2">
              {getTotalShots()}
            </div>
            <div className="text-lg text-white/80 font-semibold">
              Shots totales
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border-2 border-blue-400/50 text-center transform hover:scale-105 transition-all">
            <div className="text-5xl mb-3 animate-bounce animation-delay-100">
              📊
            </div>
            <div className="text-5xl font-black text-white mb-2">
              {getAverage()}
            </div>
            <div className="text-lg text-white/80 font-semibold">Promedio</div>
          </div>

          <div className="glass-card rounded-2xl p-6 border-2 border-green-400/50 text-center transform hover:scale-105 transition-all">
            <div className="text-5xl mb-3 animate-bounce animation-delay-200">
              👥
            </div>
            <div className="text-5xl font-black text-white mb-2">
              {players.length}
            </div>
            <div className="text-lg text-white/80 font-semibold">Jugadores</div>
          </div>
        </div>

        {/* Awards */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <div className="glass-card rounded-2xl p-6 border-2 border-green-400/50 transform hover:scale-105 transition-all">
            <div className="flex items-center gap-4">
              <div className="text-6xl">🦸</div>
              <div>
                <div className="text-sm text-green-300 font-bold uppercase tracking-wider">
                  Más Valiente
                </div>
                <div className="text-3xl font-black text-white">
                  {getMostBrave()}
                </div>
                <div className="text-sm text-white/70 font-semibold">
                  Respondió más preguntas
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border-2 border-red-400/50 transform hover:scale-105 transition-all">
            <div className="flex items-center gap-4">
              <div className="text-6xl">🔥</div>
              <div>
                <div className="text-sm text-red-300 font-bold uppercase tracking-wider">
                  Más Salvaje
                </div>
                <div className="text-3xl font-black text-white">
                  {getMostWild()}
                </div>
                <div className="text-sm text-white/70 font-semibold">
                  Tomó más shots
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Podium */}
        <div className="mb-8">
          <h3 className="text-3xl font-black text-center mb-6 text-white flex items-center justify-center gap-3">
            <span className="text-4xl">🏅</span>
            Podium de Bebedores
          </h3>
          <div className="space-y-4">
            {podium.map((entry, index) => {
              const medal = getMedal(index);
              return (
                <div
                  key={entry.player}
                  className={`glass-card rounded-2xl p-6 border-2 transform transition-all hover:scale-105 animate-fade-in ${medal.shadow} border-white/30`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div
                        className="text-6xl animate-bounce"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {medal.emoji}
                      </div>
                      <div>
                        <div className="font-black text-2xl text-white mb-1">
                          {entry.player}
                        </div>
                        <div
                          className={`text-sm font-bold bg-gradient-to-r ${medal.gradient} bg-clip-text text-transparent`}
                        >
                          {medal.title}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-black text-white mb-1">
                        {entry.shots}
                      </div>
                      <div className="text-sm text-white/70 font-bold">
                        shots
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fun Facts */}
        <div className="glass-card rounded-2xl p-6 border-2 border-yellow-400/50 mb-8">
          <h4 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
            <span className="text-3xl">💡</span>
            Datos curiosos
          </h4>
          <div className="space-y-3 text-white/90 font-semibold">
            <p className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              Se jugaron un total de {players.length} turnos
            </p>
            <p className="flex items-center gap-2">
              <span className="text-xl">❓</span>
              Se hicieron {players.length * (players.length - 1)} preguntas en
              total
            </p>
            <p className="flex items-center gap-2">
              <span className="text-xl">🔥</span>
              El juego fue{" "}
              {getTotalShots() > getAverage() * players.length
                ? "muy"
                : "moderadamente"}{" "}
              salvaje
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={onReset}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-5 rounded-2xl font-black text-xl text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl border-2 border-white/30"
          >
            🔄 Jugar de Nuevo
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-8 py-5 rounded-2xl font-black text-xl text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl border-2 border-white/30"
          >
            📊 Ver Sala
          </button>
        </div>

        {/* Share Message */}
        <div className="text-center">
          <p className="text-white/70 text-sm font-semibold">
            💙 ¿Te divertiste? ¡Comparte PregunShot con tus amigos!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .glass-card-stats {
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.3),
            rgba(236, 72, 153, 0.3)
          );
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
        }
      `}</style>
    </div>
  );
}
