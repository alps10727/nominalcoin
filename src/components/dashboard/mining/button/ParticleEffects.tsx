
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
      {/* Active state particles with enhanced cosmic-themed colors */}
      {miningActive && (
        <>
          {/* Main particles with improved animation and colors */}
          <div className="absolute top-1/2 left-1/4 h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400/80 to-purple-500/80 animate-float-1 shadow-glow"></div>
          <div className="absolute top-1/2 right-1/4 h-2 w-2 rounded-full bg-gradient-to-r from-navy-400/80 to-indigo-500/80 animate-float-2 shadow-glow" 
            style={{animationDelay: '0.7s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-300/80 to-indigo-400/80 animate-float-3 shadow-glow" 
            style={{animationDelay: '1.3s'}}></div>
          <div className="absolute top-1/3 right-1/3 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-300/80 to-navy-400/80 animate-float-1 shadow-glow" 
            style={{animationDelay: '1.7s'}}></div>
            
          {/* New! Digital energy particles */}
          <div className="absolute top-1/3 left-1/2 h-1 w-4 rounded-sm bg-indigo-500/40 animate-float-1 blur-[1px]" 
            style={{animationDelay: '0.3s', animationDuration: '3.5s'}}></div>
          <div className="absolute bottom-1/3 right-1/2 h-1 w-4 rounded-sm bg-purple-500/40 animate-float-2 blur-[1px]" 
            style={{animationDelay: '1.2s', animationDuration: '3s'}}></div>
          <div className="absolute bottom-1/2 left-1/3 h-4 w-1 rounded-sm bg-indigo-500/40 animate-float-3 blur-[1px]" 
            style={{animationDelay: '2.1s', animationDuration: '4s'}}></div>
          <div className="absolute top-1/2 right-1/3 h-4 w-1 rounded-sm bg-purple-500/40 animate-float-1 blur-[1px]" 
            style={{animationDelay: '0.9s', animationDuration: '4.5s'}}></div>
            
          {/* New! Enhanced data fragments with trails */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-0.5 h-0.5 bg-white/50 rounded-full animate-particle-trace"
              style={{ 
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                "--tx": `${(Math.random() * 40 - 20)}px`,
                opacity: 0.6
              } as React.CSSProperties}
            ></div>
          ))}
          
          {/* New! Geometric debris with glowing effect */}
          {Array.from({ length: 4 }).map((_, i) => {
            const isTriangle = i % 2 === 0;
            const size = Math.random() * 3 + 2;
            return (
              <div key={`geo-${i}`}
                className="absolute animate-float-data"
                style={{ 
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: `${Math.random() * 2 + 3}s`,
                  "--tx": `${(Math.random() * 60 - 30)}px`,
                  "--ty": `${-(Math.random() * 40 + 20)}px`,
                } as React.CSSProperties}
              >
                {isTriangle ? (
                  <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] 
                             border-l-transparent border-r-transparent border-b-indigo-500/40 
                             blur-[0.5px]"></div>
                ) : (
                  <div className={`w-${size} h-${size} bg-purple-500/40 rotate-45 blur-[0.5px]`}></div>
                )}
              </div>
            );
          })}
        </>
      )}
      
      {/* Inactive state particles with enhanced cosmic theme */}
      {!miningActive && (
        <>
          {/* Main hovering particles */}
          <div className="absolute top-1/2 left-1/3 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-indigo-500/40 to-navy-600/40 animate-float-3 shadow-glow"
            style={{animationDuration: '5s'}}></div>
          <div className="absolute bottom-1/2 right-1/3 h-2 w-2 rounded-full bg-gradient-to-r from-purple-500/40 to-indigo-600/40 animate-float-2 shadow-glow" 
            style={{animationDuration: '6s', animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 left-1/2 h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400/40 to-purple-500/40 animate-float-1 shadow-glow" 
            style={{animationDuration: '7s', animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/3 right-1/2 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-navy-400/40 to-indigo-500/40 animate-float-3 shadow-glow" 
            style={{animationDuration: '5.5s', animationDelay: '1.2s'}}></div>
            
          {/* New! Inactive state constellation effect */}
          {Array.from({ length: 16 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full animate-twinkle"
              style={{
                width: `${Math.random() * 0.8 + 0.4}px`,
                height: `${Math.random() * 0.8 + 0.4}px`,
                backgroundColor: i % 3 === 0 ? 'rgba(255, 255, 255, 0.8)' : 
                                i % 3 === 1 ? 'rgba(176, 190, 254, 0.8)' : 'rgba(216, 180, 254, 0.8)',
                boxShadow: i % 3 === 0 ? '0 0 3px rgba(255, 255, 255, 0.8)' : 
                          i % 3 === 1 ? '0 0 3px rgba(176, 190, 254, 0.8)' : '0 0 3px rgba(216, 180, 254, 0.8)',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            ></div>
          ))}
          
          {/* New! Subtle connection lines between stars */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <line x1="25%" y1="30%" x2="65%" y2="40%" className="stroke-indigo-500/20 stroke-[0.3]" />
            <line x1="65%" y1="40%" x2="35%" y2="60%" className="stroke-indigo-500/20 stroke-[0.3]" />
            <line x1="35%" y1="60%" x2="70%" y2="70%" className="stroke-indigo-500/20 stroke-[0.3]" />
            <line x1="70%" y1="70%" x2="25%" y2="30%" className="stroke-indigo-500/20 stroke-[0.3]" />
          </svg>
          
          {/* New! Subtle scanner/radar effect */}
          <div className="absolute top-1/2 left-1/2 w-[120%] h-[120%] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute w-full h-full border-2 border-indigo-500/5 rounded-full"></div>
            <div className="absolute w-0 h-0 left-1/2 top-1/2">
              <div className="absolute h-[1px] bg-gradient-to-r from-indigo-500/20 to-transparent w-[60%] -translate-y-1/2 animate-spin-slow"
                style={{transformOrigin: '0 50%', animationDuration: '10s'}}></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

ParticleEffects.displayName = "ParticleEffects";
