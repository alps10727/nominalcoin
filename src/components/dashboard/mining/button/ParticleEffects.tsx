
import React from "react";

interface ParticleEffectsProps {
  miningActive: boolean;
}

/**
 * Floating particle effects around the button
 */
export const ParticleEffects = React.memo<ParticleEffectsProps>(({ miningActive }) => {
  return (
    <div className="absolute -inset-10 z-0 overflow-hidden rounded-full">
      {/* Active state particles with enhanced colors and more particles */}
      {miningActive && (
        <>
          <div className="absolute top-1/2 left-1/4 h-1.5 w-1.5 rounded-full bg-purple-400/80 animate-float-1"></div>
          <div className="absolute top-1/2 right-1/4 h-1.5 w-1.5 rounded-full bg-navy-400/80 animate-float-2" 
            style={{animationDelay: '0.7s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 h-1.5 w-1.5 rounded-full bg-purple-400/80 animate-float-3" 
            style={{animationDelay: '1.3s'}}></div>
          <div className="absolute top-1/3 right-1/3 h-1.5 w-1.5 rounded-full bg-navy-400/80 animate-float-1" 
            style={{animationDelay: '1.7s'}}></div>
            
          {/* Additional active particles */}
          <div className="absolute top-1/4 left-1/2 h-1.5 w-1.5 rounded-full bg-purple-400/80 animate-float-2" 
            style={{animationDelay: '2.1s'}}></div>
          <div className="absolute bottom-1/4 right-1/2 h-1.5 w-1.5 rounded-full bg-navy-400/80 animate-float-3"
            style={{animationDelay: '2.5s'}}></div>
            
          {/* Glowing trail particles */}
          <div className="absolute top-2/3 left-1/3 h-1 w-1 rounded-full bg-purple-300/60 animate-particle-trace"
            style={{animationDelay: '0.3s', "--tx": '-15px'} as React.CSSProperties}></div>
          <div className="absolute bottom-2/3 right-1/3 h-1 w-1 rounded-full bg-navy-300/60 animate-particle-trace"
            style={{animationDelay: '1.2s', "--tx": '12px'} as React.CSSProperties}></div>
        </>
      )}
      
      {/* Inactive state particles with enhanced colors */}
      {!miningActive && (
        <>
          <div className="absolute top-1/2 left-1/3 h-2 w-2 rounded-full bg-navy-500/50 animate-float-3"
            style={{animationDuration: '5s'}}></div>
          <div className="absolute bottom-1/2 right-1/3 h-1.5 w-1.5 rounded-full bg-purple-500/50 animate-float-2" 
            style={{animationDuration: '6s', animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 left-1/2 h-1.5 w-1.5 rounded-full bg-purple-500/50 animate-float-1" 
            style={{animationDuration: '7s', animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/3 right-1/2 h-2 w-2 rounded-full bg-navy-500/50 animate-float-3" 
            style={{animationDuration: '5.5s', animationDelay: '1.2s'}}></div>
            
          {/* Orbital particles for inactive state */}
          <div className="absolute top-1/2 right-0 h-2.5 w-2.5 rounded-full bg-navy-500/20 animate-double-spin" 
            style={{
              transformOrigin: 'center left', 
              animationDuration: '8s',
              left: '50%'
            }}></div>
          <div className="absolute bottom-0 left-1/2 h-2.5 w-2.5 rounded-full bg-purple-500/20 animate-double-reverse-spin" 
            style={{
              transformOrigin: 'center top', 
              animationDuration: '10s',
              top: '50%'
            }}></div>
            
          {/* New starlike particles */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-0.5 h-0.5 bg-white/70 rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            ></div>
          ))}
        </>
      )}
    </div>
  );
});

ParticleEffects.displayName = "ParticleEffects";
