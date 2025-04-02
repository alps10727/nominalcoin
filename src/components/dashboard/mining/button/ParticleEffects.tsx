
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
          {/* Main particles with improved animation and colors */}
          <div className="absolute top-1/2 left-1/4 h-2 w-2 rounded-full bg-gradient-to-r from-purple-400/80 to-purple-500/80 animate-float-1 shadow-glow"></div>
          <div className="absolute top-1/2 right-1/4 h-2 w-2 rounded-full bg-gradient-to-r from-navy-400/80 to-navy-500/80 animate-float-2 shadow-glow" 
            style={{animationDelay: '0.7s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-300/80 to-purple-400/80 animate-float-3 shadow-glow" 
            style={{animationDelay: '1.3s'}}></div>
          <div className="absolute top-1/3 right-1/3 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-navy-300/80 to-navy-400/80 animate-float-1 shadow-glow" 
            style={{animationDelay: '1.7s'}}></div>
            
          {/* Additional active particles with subtle glow */}
          <div className="absolute top-1/4 left-1/2 h-2 w-2 rounded-full bg-gradient-to-r from-purple-300/80 to-purple-400/80 animate-float-2 shadow-glow" 
            style={{animationDelay: '2.1s'}}></div>
          <div className="absolute bottom-1/4 right-1/2 h-2 w-2 rounded-full bg-gradient-to-r from-navy-300/80 to-navy-400/80 animate-float-3 shadow-glow"
            style={{animationDelay: '2.5s'}}></div>
          <div className="absolute top-1/5 right-1/4 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-400/80 to-navy-400/80 animate-float-1 shadow-glow"
            style={{animationDelay: '2.9s'}}></div>
          <div className="absolute bottom-1/5 left-1/4 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-navy-400/80 to-purple-400/80 animate-float-2 shadow-glow"
            style={{animationDelay: '3.3s'}}></div>
            
          {/* Glowing trail particles */}
          <div className="absolute top-2/3 left-1/3 h-1 w-1 rounded-full bg-gradient-to-r from-purple-300/60 to-purple-400/60 animate-particle-trace"
            style={{animationDelay: '0.3s', "--tx": '-15px'} as React.CSSProperties}></div>
          <div className="absolute bottom-2/3 right-1/3 h-1 w-1 rounded-full bg-gradient-to-r from-navy-300/60 to-navy-400/60 animate-particle-trace"
            style={{animationDelay: '1.2s', "--tx": '12px'} as React.CSSProperties}></div>
          <div className="absolute bottom-1/4 left-1/4 h-1 w-1 rounded-full bg-gradient-to-r from-purple-300/60 to-navy-300/60 animate-particle-trace"
            style={{animationDelay: '2.1s', "--tx": '18px'} as React.CSSProperties}></div>
          <div className="absolute top-1/4 right-1/4 h-1 w-1 rounded-full bg-gradient-to-r from-navy-300/60 to-purple-300/60 animate-particle-trace"
            style={{animationDelay: '3.0s', "--tx": '-14px'} as React.CSSProperties}></div>
        </>
      )}
      
      {/* Inactive state particles with enhanced colors */}
      {!miningActive && (
        <>
          {/* Main hovering particles */}
          <div className="absolute top-1/2 left-1/3 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-navy-500/40 to-navy-600/40 animate-float-3 shadow-glow"
            style={{animationDuration: '5s'}}></div>
          <div className="absolute bottom-1/2 right-1/3 h-2 w-2 rounded-full bg-gradient-to-r from-purple-500/40 to-purple-600/40 animate-float-2 shadow-glow" 
            style={{animationDuration: '6s', animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 left-1/2 h-2 w-2 rounded-full bg-gradient-to-r from-purple-400/40 to-purple-500/40 animate-float-1 shadow-glow" 
            style={{animationDuration: '7s', animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/3 right-1/2 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-navy-400/40 to-navy-500/40 animate-float-3 shadow-glow" 
            style={{animationDuration: '5.5s', animationDelay: '1.2s'}}></div>
            
          {/* Orbital particles for inactive state with glowing trails */}
          <div className="absolute top-1/2 right-0 h-3 w-3 rounded-full bg-gradient-to-r from-navy-500/20 to-navy-600/20 animate-double-spin shadow-glow" 
            style={{
              transformOrigin: 'center left', 
              animationDuration: '8s',
              left: '50%'
            }}></div>
          <div className="absolute bottom-0 left-1/2 h-3 w-3 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-600/20 animate-double-reverse-spin shadow-glow" 
            style={{
              transformOrigin: 'center top', 
              animationDuration: '10s',
              top: '50%'
            }}></div>
            
          {/* Enhanced starlike particles with subtle pulsation */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full animate-twinkle"
              style={{
                width: `${Math.random() * 0.8 + 0.4}px`,
                height: `${Math.random() * 0.8 + 0.4}px`,
                backgroundColor: i % 2 === 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(216, 180, 254, 0.8)',
                boxShadow: i % 2 === 0 ? '0 0 3px rgba(255, 255, 255, 0.8)' : '0 0 3px rgba(216, 180, 254, 0.8)',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            ></div>
          ))}
          
          {/* Subtle energy waves */}
          <div className="absolute inset-0 rounded-full border border-dashed border-purple-500/10 animate-spin-slow"
              style={{animationDuration: '25s'}}></div>
          <div className="absolute inset-2 rounded-full border border-dotted border-navy-500/10 animate-reverse-spin"
              style={{animationDuration: '30s'}}></div>
        </>
      )}
    </div>
  );
});

ParticleEffects.displayName = "ParticleEffects";
