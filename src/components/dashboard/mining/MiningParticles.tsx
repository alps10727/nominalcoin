
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
    
    // Create new data particles
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0';
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      particle.style.animationDuration = `${3 + Math.random() * 2}s`;
      
      // Add a class for the data-point animation variant
      particle.classList.add(`data-point-${i % 6}`);
      particle.classList.add('animate-float-data');
      
      container.appendChild(particle);
    }
  }, [miningActive]);

  // Don't render anything when not mining
  if (!miningActive) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Energy field */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 animate-pulse" style={{animationDuration: '4s'}}></div>
      </div>
      
      {/* Particle container */}
      <div ref={particlesRef} className="absolute inset-0"></div>
      
      {/* Data streams */}
      <div className="absolute w-full h-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`stream-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent animate-data-stream"
            style={{
              width: `${Math.random() * 40 + 80}px`,
              top: `${20 + i * 15}%`,
              left: `${5 + i * 5}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      
      {/* Quantum particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`quantum-${i}`}
          className="absolute w-1 h-1 rounded-full bg-purple-300/70 animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${1 + Math.random() * 3}s`,
            boxShadow: '0 0 5px 2px rgba(139, 92, 246, 0.3)'
          }}
        />
      ))}
    </div>
  );
};
