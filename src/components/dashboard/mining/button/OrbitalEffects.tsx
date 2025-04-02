
import React from "react";

interface OrbitalEffectsProps {
  miningActive: boolean;
}

/**
 * Orbital animation effects that circle the button
 */
export const OrbitalEffects = React.memo<OrbitalEffectsProps>(({ miningActive }) => {
  return (
    <div className={`absolute inset-0 z-0 ${miningActive ? 'opacity-90' : 'opacity-70'}`}>
      {/* First orbit */}
      <div className={`absolute w-3 h-3 rounded-full ${
        miningActive 
          ? 'bg-purple-600/40 animate-reverse-spin' 
          : 'bg-navy-600/30 animate-reverse-spin'
      }`} style={{
        top: '10%', 
        left: '10%', 
        transformOrigin: '350% 350%',
        animationDuration: miningActive ? '6s' : '10s',
        transition: 'background-color 0.7s ease, animation-duration 0.7s ease'
      }}></div>
      
      {/* Second orbit (spinning in opposite direction) */}
      <div className={`absolute w-2 h-2 rounded-full ${
        miningActive 
          ? 'bg-navy-600/40 animate-spin-slow' 
          : 'bg-purple-700/30 animate-spin-slow'
      }`} style={{
        bottom: '10%', 
        right: '10%', 
        transformOrigin: '-250% -250%',
        animationDuration: miningActive ? '8s' : '12s',
        transition: 'background-color 0.7s ease, animation-duration 0.7s ease'
      }}></div>
      
      {/* Third orbit - always visible but different speeds */}
      <div className={`absolute w-2.5 h-2.5 rounded-full ${
        miningActive 
          ? 'bg-purple-600/30 animate-spin-slow' 
          : 'bg-navy-600/20 animate-reverse-spin'
      }`} style={{
        top: '15%', 
        right: '15%', 
        transformOrigin: '-200% 300%',
        animationDuration: miningActive ? '9s' : '14s',
        transition: 'background-color 0.7s ease, animation-duration 0.7s ease'
      }}></div>
      
      {/* Fourth orbit - always visible but different speeds */}
      <div className={`absolute w-2 h-2 rounded-full ${
        miningActive 
          ? 'bg-navy-500/30 animate-reverse-spin' 
          : 'bg-purple-600/20 animate-spin-slow'
      }`} style={{
        bottom: '15%', 
        left: '15%', 
        transformOrigin: '300% -200%',
        animationDuration: miningActive ? '7s' : '16s',
        transition: 'background-color 0.7s ease, animation-duration 0.7s ease'
      }}></div>

      {/* New outer orbits - visible only in inactive state */}
      {!miningActive && (
        <>
          <div className="absolute w-4 h-4 rounded-full bg-navy-500/20 animate-spin-slow" 
            style={{
              top: '5%', 
              right: '50%', 
              transformOrigin: '100% 450%',
              animationDuration: '20s'
            }}></div>
          <div className="absolute w-3 h-3 rounded-full bg-purple-500/20 animate-reverse-spin" 
            style={{
              bottom: '5%', 
              left: '50%', 
              transformOrigin: '0% -450%',
              animationDuration: '18s'
            }}></div>
        </>
      )}
      
      {/* Enhanced inner orbits - visible only in active state */}
      {miningActive && (
        <>
          <div className="absolute w-1.5 h-1.5 rounded-full bg-purple-500/60 animate-spin-slow" 
            style={{
              top: '30%', 
              left: '30%', 
              transformOrigin: '150% 150%',
              animationDuration: '4s'
            }}></div>
          <div className="absolute w-1.5 h-1.5 rounded-full bg-navy-500/60 animate-reverse-spin" 
            style={{
              bottom: '30%', 
              right: '30%', 
              transformOrigin: '-50% -50%',
              animationDuration: '4.5s'
            }}></div>
            
          {/* New data stream effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-purple-400/30 to-transparent 
                         absolute top-1/2 left-0 animate-data-stream"></div>
            <div className="h-full w-0.5 bg-gradient-to-b from-transparent via-navy-400/30 to-transparent 
                         absolute top-0 left-1/2 animate-data-stream" 
                 style={{animationDelay: '1s'}}></div>
          </div>
        </>
      )}
    </div>
  );
});

OrbitalEffects.displayName = "OrbitalEffects";
