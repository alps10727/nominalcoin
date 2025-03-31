
import React from "react";

interface ParticleEffectsProps {
  miningActive: boolean;
}

/**
 * Floating particle effects around the button
 */
export const ParticleEffects = React.memo<ParticleEffectsProps>(({ miningActive }) => {
  return (
    <div className="absolute -inset-8 z-0 overflow-hidden rounded-full">
      {/* Active state particles with enhanced colors */}
      {miningActive && (
        <>
          <div className="absolute top-1/2 left-1/4 h-1 w-1 rounded-full bg-cyan-300/80 animate-float-1"></div>
          <div className="absolute top-1/2 right-1/4 h-1 w-1 rounded-full bg-indigo-300/80 animate-float-2" 
            style={{animationDelay: '0.7s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 h-1 w-1 rounded-full bg-cyan-300/80 animate-float-3" 
            style={{animationDelay: '1.3s'}}></div>
          <div className="absolute top-1/3 right-1/3 h-1 w-1 rounded-full bg-indigo-300/80 animate-float-1" 
            style={{animationDelay: '1.7s'}}></div>
        </>
      )}
      
      {/* Inactive state particles with enhanced colors */}
      {!miningActive && (
        <>
          <div className="absolute top-1/2 left-1/3 h-1.5 w-1.5 rounded-full bg-indigo-400/70 animate-float-3"
            style={{animationDuration: '5s'}}></div>
          <div className="absolute bottom-1/2 right-1/3 h-1 w-1 rounded-full bg-darkPurple-400/70 animate-float-2" 
            style={{animationDuration: '6s', animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 left-1/2 h-1 w-1 rounded-full bg-purple-400/70 animate-float-1" 
            style={{animationDuration: '7s', animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/3 right-1/2 h-1.5 w-1.5 rounded-full bg-cyan-400/70 animate-float-3" 
            style={{animationDuration: '5.5s', animationDelay: '1.2s'}}></div>
        </>
      )}
    </div>
  );
});

ParticleEffects.displayName = "ParticleEffects";
