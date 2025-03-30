
import React, { useState, useEffect } from "react";

interface MiningParticlesProps {
  miningActive: boolean;
}

/**
 * Component that renders decorative particles for the mining card
 */
export const MiningParticles: React.FC<MiningParticlesProps> = ({ miningActive }) => {
  const [particles, setParticles] = useState<Array<{id: number, delay: number, speed: number, x: number, size: number, color: string}>>([]);
  
  // Generate random particles when mining is active
  useEffect(() => {
    if (miningActive) {
      const colors = ['amber-400', 'orange-400', 'red-400'];
      const newParticles = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        delay: Math.random() * 6,
        speed: 3 + Math.random() * 4,
        x: Math.random() * 100,
        size: 0.5 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)]
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
          className={`absolute rounded-full animate-float-data bg-${particle.color}/80`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            bottom: '20%',
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.speed}s`
          }}
        />
      ))}
      
      {/* Heat waves that appear when mining is active */}
      {miningActive && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32">
            <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-amber-400/30 to-transparent animate-pulse-slow rotate-45"></div>
            <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-amber-400/20 to-transparent animate-pulse-slow rotate-90"></div>
            <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-amber-400/10 to-transparent animate-pulse-slow rotate-135"></div>
          </div>
        </>
      )}
      
      {/* Fire-like effects that flow when mining is active */}
      {miningActive && (
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="absolute h-0.5 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent animate-data-stream" 
              style={{
                width: '50%',
                top: `${20 + i * 30}%`,
                left: '25%',
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
