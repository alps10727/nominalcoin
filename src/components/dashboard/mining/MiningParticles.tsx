
import React, { useState, useEffect } from "react";

interface MiningParticlesProps {
  miningActive: boolean;
}

/**
 * Component that renders decorative particles for the mining card
 */
export const MiningParticles: React.FC<MiningParticlesProps> = ({ miningActive }) => {
  const [particles, setParticles] = useState<Array<{id: number, delay: number, speed: number, x: number, size: number}>>([]);
  
  // Generate random particles when mining is active
  useEffect(() => {
    if (miningActive) {
      const newParticles = Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        delay: Math.random() * 5,
        speed: 3 + Math.random() * 3,
        x: Math.random() * 100,
        size: 0.5 + Math.random() * 1.5
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [miningActive]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <div 
          key={particle.id}
          className="absolute w-1 h-1 rounded-full bg-darkPurple-300/80 animate-float-1"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            bottom: '10%',
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.speed}s`
          }}
        />
      ))}
    </div>
  );
};
