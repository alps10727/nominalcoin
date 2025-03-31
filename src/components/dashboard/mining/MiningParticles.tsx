
import React, { useEffect, useRef } from "react";

interface MiningParticlesProps {
  miningActive: boolean;
}

export const MiningParticles: React.FC<MiningParticlesProps> = ({ miningActive }) => {
  const particlesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!miningActive || !particlesRef.current) return;
    
    // Clean up existing particles
    const container = particlesRef.current;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // Create new particles
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0';
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      particle.style.animationDuration = `${3 + Math.random() * 2}s`;
      particle.classList.add('animate-data-flow');
      container.appendChild(particle);
    }
  }, [miningActive]);

  if (!miningActive) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle energy field */}
      <div className="absolute w-full h-full rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-blue-500/10"></div>
      
      {/* Particle container */}
      <div ref={particlesRef} className="absolute inset-0"></div>
      
      {/* Data streams */}
      <div className="absolute w-full h-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`stream-${i}`}
            className="absolute h-px w-32 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent animate-data-stream"
            style={{
              top: `${30 + i * 20}%`,
              left: '10%',
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
