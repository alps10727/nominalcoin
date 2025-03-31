
import React from "react";

interface OrbitalEffectsProps {
  miningActive: boolean;
}

/**
 * Orbital animation effects that circle the button
 */
export const OrbitalEffects: React.FC<OrbitalEffectsProps> = ({ miningActive }) => {
  return (
    <div className={`absolute inset-0 z-0 ${miningActive ? 'opacity-70' : 'opacity-50'}`}>
      {/* First orbit */}
      <div className={`absolute w-3 h-3 rounded-full ${
        miningActive 
          ? 'bg-indigo-400/30 animate-reverse-spin' 
          : 'bg-navy-400/30 animate-reverse-spin'
      }`} style={{
        top: '10%', 
        left: '10%', 
        transformOrigin: '350% 350%',
        animationDuration: miningActive ? '8s' : '12s'
      }}></div>
      
      {/* Second orbit (spinning in opposite direction) */}
      <div className={`absolute w-2 h-2 rounded-full ${
        miningActive 
          ? 'bg-purple-400/30 animate-spin-slow' 
          : 'bg-darkPurple-400/30 animate-spin-slow'
      }`} style={{
        bottom: '10%', 
        right: '10%', 
        transformOrigin: '-250% -250%',
        animationDuration: miningActive ? '10s' : '14s'
      }}></div>
      
      {/* Third orbit for inactive state */}
      {!miningActive && (
        <div className="absolute w-2.5 h-2.5 rounded-full bg-navy-400/20 animate-spin-slow" 
          style={{
            top: '15%', 
            right: '15%', 
            transformOrigin: '-200% 300%',
            animationDuration: '16s'
          }}>
        </div>
      )}
      
      {/* Fourth orbit for inactive state */}
      {!miningActive && (
        <div className="absolute w-2 h-2 rounded-full bg-darkPurple-400/20 animate-reverse-spin" 
          style={{
            bottom: '15%', 
            left: '15%', 
            transformOrigin: '300% -200%',
            animationDuration: '18s'
          }}>
        </div>
      )}
    </div>
  );
};
