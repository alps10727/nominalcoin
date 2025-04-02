
import React from "react";

interface ButtonBackgroundProps {
  miningActive: boolean;
}

/**
 * The main background layers for the mining button
 */
export const ButtonBackground = React.memo<ButtonBackgroundProps>(({ miningActive }) => {
  return (
    <>
      {/* Main gradient background with deep space-inspired colors */}
      <div className={`absolute inset-0 rounded-full shadow-lg transition-all duration-700 overflow-hidden ${
        miningActive 
          ? 'bg-gradient-to-tr from-navy-950 via-indigo-950 to-darkPurple-900 border-2 border-indigo-600/40 shadow-glow' 
          : 'bg-gradient-to-br from-navy-950 via-indigo-950 to-navy-900 border border-indigo-700/30 shadow-md'
      }`}>
        {/* Enhanced glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent button-shimmer"></div>
        
        {/* Subtle dot matrix pattern for texture */}
        <div className="absolute inset-0 bg-noise-pattern opacity-5"></div>
      </div>
      
      {/* Inner ring with subtle glow */}
      <div className={`absolute inset-2 rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-gradient-to-br from-navy-950 to-indigo-900 opacity-95 scale-95' 
          : 'bg-gradient-to-br from-darkPurple-950 to-navy-900 opacity-90 scale-100'
      }`}></div>
      
      {/* New! Holographic concentric circles */}
      <div className={`absolute inset-6 rounded-full border-2 transition-all duration-700 opacity-20 ${
        miningActive 
          ? 'border-indigo-500/40 animate-spin-slow' 
          : 'border-navy-600/30 animate-reverse-spin'
      }`} style={{animationDuration: miningActive ? '15s' : '30s'}}></div>
      
      <div className={`absolute inset-10 rounded-full border transition-all duration-700 opacity-10 ${
        miningActive 
          ? 'border-purple-500/50 animate-reverse-spin' 
          : 'border-navy-600/20 animate-spin-slow'
      }`} style={{animationDuration: miningActive ? '18s' : '35s'}}></div>
      
      {/* Outer glow effect with deeper colors */}
      <div className={`absolute -inset-1 rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-indigo-800/20 blur-md animate-pulse-slow' 
          : 'bg-navy-800/15 blur-md animate-pulse-slow'
      }`} style={{animationDuration: miningActive ? '2s' : '4s', transition: 'animation-duration 0.7s ease'}}></div>
      
      {/* Enhanced border gradient with deeper colors */}
      <div className={`absolute -inset-px rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-gradient-to-r from-indigo-800/30 via-darkPurple-700/30 to-indigo-800/30' 
          : 'bg-gradient-to-r from-darkPurple-900/25 via-navy-800/25 to-darkPurple-900/25'
      }`}></div>
      
      {/* New! Digital circuit pattern overlays */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className={`absolute h-[1px] w-3/4 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent top-1/3 left-[12.5%] ${
          miningActive ? 'animate-data-stream' : 'opacity-10'
        }`} style={{animationDuration: '3s'}}></div>
        
        <div className={`absolute h-[1px] w-1/2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent bottom-1/3 left-1/4 ${
          miningActive ? 'animate-data-stream' : 'opacity-10'
        }`} style={{animationDuration: '4s', animationDelay: '1s'}}></div>
        
        <div className={`absolute h-full w-[1px] bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent top-0 left-1/3 ${
          miningActive ? 'animate-data-stream' : 'opacity-10'
        }`} style={{animationDuration: '3.5s', animationDelay: '0.5s'}}></div>
        
        <div className={`absolute h-full w-[1px] bg-gradient-to-b from-transparent via-purple-500/20 to-transparent top-0 right-1/3 ${
          miningActive ? 'animate-data-stream' : 'opacity-10'
        }`} style={{animationDuration: '4.5s', animationDelay: '1.5s'}}></div>
      </div>
      
      {/* New! Geometric accent shapes */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className={`absolute top-[15%] left-[15%] w-[3px] h-[20px] bg-indigo-600/20 transform rotate-45 ${
          miningActive ? 'animate-pulse-slow' : ''
        }`}></div>
        <div className={`absolute bottom-[15%] right-[15%] w-[3px] h-[20px] bg-purple-600/20 transform rotate-45 ${
          miningActive ? 'animate-pulse-slow' : ''
        }`} style={{animationDelay: '1s'}}></div>
        <div className={`absolute top-[15%] right-[15%] w-[3px] h-[20px] bg-indigo-600/20 transform -rotate-45 ${
          miningActive ? 'animate-pulse-slow' : ''
        }`} style={{animationDelay: '1.5s'}}></div>
        <div className={`absolute bottom-[15%] left-[15%] w-[3px] h-[20px] bg-purple-600/20 transform -rotate-45 ${
          miningActive ? 'animate-pulse-slow' : ''
        }`} style={{animationDelay: '0.5s'}}></div>
      </div>
      
      {/* Core energy effect when active */}
      {miningActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/2 h-1/2 bg-gradient-to-r from-indigo-700/15 to-purple-700/15 rounded-full blur-lg animate-pulse-slow"></div>
        </div>
      )}
      
      {/* New! 3D holographic hexagons (visible only when active) */}
      {miningActive && (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-reverse-spin" style={{animationDuration: '20s'}}>
              <polygon points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25" 
                className="fill-none stroke-indigo-500/50 stroke-[0.5]" />
              <polygon points="50 10, 85 30, 85 70, 50 90, 15 70, 15 30" 
                className="fill-none stroke-purple-500/50 stroke-[0.3]" />
              <polygon points="50 20, 76.6 35, 76.6 65, 50 80, 23.4 65, 23.4 35" 
                className="fill-none stroke-indigo-500/50 stroke-[0.2]" />
            </svg>
          </div>
        </div>
      )}
      
      {/* New! Pulsating energy nodes (visible only when active) */}
      {miningActive && (
        <>
          <div className="absolute top-[25%] left-[25%] w-1.5 h-1.5 rounded-full bg-indigo-500/50 animate-cosmic-pulse"></div>
          <div className="absolute top-[25%] right-[25%] w-1.5 h-1.5 rounded-full bg-purple-500/50 animate-cosmic-pulse" 
            style={{animationDelay: '0.7s'}}></div>
          <div className="absolute bottom-[25%] left-[25%] w-1.5 h-1.5 rounded-full bg-purple-500/50 animate-cosmic-pulse" 
            style={{animationDelay: '1.4s'}}></div>
          <div className="absolute bottom-[25%] right-[25%] w-1.5 h-1.5 rounded-full bg-indigo-500/50 animate-cosmic-pulse" 
            style={{animationDelay: '2.1s'}}></div>
        </>
      )}
      
      {/* New! Radial data transmission effect */}
      {miningActive && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-500/10 animate-ping-slow"
                style={{
                  width: `${(i+1) * 25}%`, 
                  height: `${(i+1) * 25}%`,
                  animationDuration: `${3 + i}s`,
                  animationDelay: `${i * 0.7}s`
                }}>
            </div>
          ))}
        </div>
      )}
      
      {/* New! Inactive state subtle scanner effect */}
      {!miningActive && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute h-[40%] w-full bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent 
                       animate-data-stream" 
              style={{animationDuration: '4s', top: '30%'}}></div>
        </div>
      )}
    </>
  );
});

ButtonBackground.displayName = "ButtonBackground";
