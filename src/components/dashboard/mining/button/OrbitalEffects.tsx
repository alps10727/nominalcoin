
import React from "react";

interface OrbitalEffectsProps {
  miningActive: boolean;
}

/**
 * Orbital animation effects that circle the button
 */
export const OrbitalEffects = React.memo<OrbitalEffectsProps>(({ miningActive }) => {
  return (
    <div className={`absolute inset-0 z-0 ${miningActive ? 'opacity-80' : 'opacity-60'}`}>
      {/* First orbit */}
      <div className={`absolute w-3 h-3 rounded-full ${
        miningActive 
          ? 'bg-cyan-500/40 animate-reverse-spin' 
          : 'bg-indigo-500/30 animate-reverse-spin'
      }`} style={{
        top: '10%', 
        left: '10%', 
        transformOrigin: '350% 350%',
        animationDuration: miningActive ? '6s' : '10s'
      }}></div>
      
      {/* Second orbit (spinning in opposite direction) */}
      <div className={`absolute w-2 h-2 rounded-full ${
        miningActive 
          ? 'bg-indigo-500/40 animate-spin-slow' 
          : 'bg-darkPurple-500/30 animate-spin-slow'
      }`} style={{
        bottom: '10%', 
        right: '10%', 
        transformOrigin: '-250% -250%',
        animationDuration: miningActive ? '8s' : '12s'
      }}></div>
      
      {/* Third orbit - always visible but different speeds */}
      <div className={`absolute w-2.5 h-2.5 rounded-full ${
        miningActive 
          ? 'bg-purple-500/30 animate-spin-slow' 
          : 'bg-indigo-500/20 animate-reverse-spin'
      }`} style={{
        top: '15%', 
        right: '15%', 
        transformOrigin: '-200% 300%',
        animationDuration: miningActive ? '9s' : '14s'
      }}></div>
      
      {/* Fourth orbit - always visible but different speeds */}
      <div className={`absolute w-2 h-2 rounded-full ${
        miningActive 
          ? 'bg-cyan-500/30 animate-reverse-spin' 
          : 'bg-purple-500/20 animate-spin-slow'
      }`} style={{
        bottom: '15%', 
        left: '15%', 
        transformOrigin: '300% -200%',
        animationDuration: miningActive ? '7s' : '16s'
      }}></div>
    </div>
  );
});

OrbitalEffects.displayName = "OrbitalEffects";
