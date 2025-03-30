
import React, { useMemo } from "react";

interface MiningParticlesProps {
  miningActive: boolean;
}

/**
 * Component that renders cosmic energy particles effect when mining is active
 */
export const MiningParticles: React.FC<MiningParticlesProps> = ({ miningActive }) => {
  // Memoize particles to avoid regenerating on every render
  const energyParticles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 0.8 + 0.3,
      speed: Math.random() * 3 + 2,
      delay: Math.random() * 5,
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100,
      },
      color: i % 3 === 0 ? "bg-purple-400" : i % 3 === 1 ? "bg-indigo-400" : "bg-blue-400",
    }));
  }, []);

  if (!miningActive) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Energy field pulsing effect */}
      <div className="absolute w-full h-full rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-purple-500/10 animate-pulse-slow"></div>
      
      {/* Energy streams */}
      <div className="absolute w-full h-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`stream-${i}`}
            className="absolute h-px w-40 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent animate-data-stream"
            style={{
              top: `${30 + i * 20}%`,
              left: '-100px',
              animationDuration: `${6 + i}s`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Rising energy particles */}
      {energyParticles.map((particle) => (
        <div
          key={`particle-${particle.id}`}
          className={`absolute w-1 h-1 rounded-full ${particle.color} opacity-60 animate-float`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.position.x}%`,
            bottom: '-5px',
            animationDuration: `${particle.speed}s`,
            animationDelay: `${particle.delay}s`,
            animationIterationCount: 'infinite',
          }}
        />
      ))}
      
      {/* Floating data points */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`data-${i}`}
          className="absolute flex items-center justify-center"
          style={{
            left: `${20 + i * 12}%`,
            bottom: '10%',
            opacity: 0,
            animationName: 'float-data',
            animationDuration: `${4 + Math.random() * 2}s`,
            animationDelay: `${i * 0.9}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-out',
          }}
          // Using CSS variables in className rather than inline style
          className={`data-point-${i} animate-float-data`}
        >
          <div className="w-1 h-1 rounded-full bg-purple-400/40"></div>
        </div>
      ))}
      
      {/* Energy rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`ring-${i}`}
            className="absolute rounded-full border border-purple-500/10 animate-ping-slow"
            style={{
              width: `${(i + 1) * 40}px`,
              height: `${(i + 1) * 40}px`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
