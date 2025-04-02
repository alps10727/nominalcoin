
import React, { useEffect, useRef } from "react";

interface MiningParticlesProps {
  miningActive: boolean;
}

export const MiningParticles: React.FC<MiningParticlesProps> = ({ miningActive }) => {
  const particlesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!miningActive || !particlesRef.current) return;
    
    // Clear existing particles
    const container = particlesRef.current;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // Create new particles
    const createParticles = () => {
      // Generate random particles
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        
        // Add base styling
        particle.className = 'absolute h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0';
        
        // Randomize position
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        
        // Random timing
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particle.style.animationDuration = `${3 + Math.random() * 2}s`;
        
        // Add a data point variation for the animation
        particle.classList.add(`data-point-${i % 6}`);
        particle.classList.add('animate-float-data');
        
        // Add glow effect to some particles
        if (Math.random() > 0.7) {
          particle.style.boxShadow = '0 0 4px rgba(139, 92, 246, 0.7)';
          particle.style.height = '2px';
          particle.style.width = '2px';
        }
        
        container.appendChild(particle);
      }
      
      // Data streams - horizontal lines that move across
      for (let i = 0; i < 5; i++) {
        const stream = document.createElement('div');
        
        // Styling
        stream.className = 'absolute h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent';
        
        // Position and size
        stream.style.width = `${Math.random() * 40 + 80}px`;
        stream.style.top = `${20 + i * 15}%`;
        stream.style.left = `${5 + i * 5}%`;
        
        // Animation
        stream.style.animationDelay = `${i * 0.7}s`;
        stream.style.animationDuration = `${3 + Math.random() * 2}s`;
        stream.classList.add('animate-data-stream');
        
        container.appendChild(stream);
      }
    };
    
    // Initial creation
    createParticles();
    
    // Periodically refresh particles for continuous effect
    const interval = setInterval(createParticles, 5000);
    
    return () => clearInterval(interval);
  }, [miningActive]);

  // Don't render the container when not mining
  if (!miningActive) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {/* Energy field - subtle glow effect */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 animate-pulse" 
             style={{animationDuration: '4s'}}></div>
      </div>
      
      {/* Particle container - will be populated by useEffect */}
      <div ref={particlesRef} className="absolute inset-0"></div>
      
      {/* Fixed quantum particles - small floating dots */}
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
