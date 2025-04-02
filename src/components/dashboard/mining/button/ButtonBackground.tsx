
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
      {/* Main gradient background with even deeper dark colors */}
      <div className={`absolute inset-0 rounded-full shadow-lg transition-all duration-700 overflow-hidden ${
        miningActive 
          ? 'bg-gradient-to-tr from-navy-950 via-darkPurple-950 to-darkPurple-950 border-2 border-darkPurple-700/40 shadow-glow' 
          : 'bg-gradient-to-br from-navy-950 via-darkPurple-950 to-navy-950 border border-darkPurple-800/30 shadow-md'
      }`}>
        {/* Enhanced shimmering overlay effect with reduced opacity */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent button-shimmer"></div>
        
        {/* Hexagon grid pattern for futuristic look with reduced opacity */}
        <div className="absolute inset-0 bg-grid-pattern opacity-2"></div>
      </div>
      
      {/* Inner circle with richer color transition */}
      <div className={`absolute inset-2 rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-gradient-to-br from-navy-950 to-darkPurple-950 opacity-95 scale-95' 
          : 'bg-gradient-to-br from-darkPurple-950 to-navy-950 opacity-95 scale-100'
      }`}></div>
      
      {/* Outer glow effect with deeper colors and reduced brightness when active */}
      <div className={`absolute -inset-1 rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-purple-950/15 blur-md animate-pulse-slow' 
          : 'bg-navy-950/10 blur-md animate-pulse-slow'
      }`} style={{animationDuration: miningActive ? '2s' : '4s', transition: 'animation-duration 0.7s ease'}}></div>
      
      {/* Enhanced border gradient with deeper colors */}
      <div className={`absolute -inset-px rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-gradient-to-r from-darkPurple-900/20 via-navy-900/20 to-darkPurple-900/20' 
          : 'bg-gradient-to-r from-darkPurple-950/15 via-navy-950/15 to-darkPurple-950/15'
      }`}></div>
      
      {/* Inner rotating gradients with deeper shades */}
      <div className={`absolute inset-4 rounded-full overflow-hidden transition-opacity duration-700 ${
        miningActive ? 'opacity-30' : 'opacity-20'
      }`}>
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-purple-900/10 to-transparent ${
          miningActive ? 'animate-spin-slow' : 'animate-reverse-spin'
        }`} style={{
          animationDuration: miningActive ? '10s' : '15s',
          transition: 'animation 0.7s ease'
        }}></div>
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-navy-900/5 to-transparent ${
          miningActive ? 'animate-reverse-spin' : 'animate-spin-slow'
        }`} style={{
          animationDuration: miningActive ? '12s' : '18s',
          transition: 'animation 0.7s ease'
        }}></div>
      </div>
      
      {/* Core glow when active with deeper, richer colors */}
      {miningActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/3 h-1/3 bg-gradient-to-r from-purple-900/10 to-navy-900/10 rounded-full blur-md animate-pulse-slow"></div>
        </div>
      )}
      
      {/* Energy lines when active with deeper color scheme */}
      {miningActive && (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-purple-800/10 to-transparent top-1/2 left-0 animate-data-stream"
               style={{animationDuration: '3s'}}></div>
          <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-navy-800/10 to-transparent top-0 left-1/2 animate-data-stream"
               style={{animationDuration: '3.5s', animationDelay: '0.5s'}}></div>
          <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-navy-800/7 to-transparent top-1/3 left-0 animate-data-stream"
               style={{animationDuration: '4s', animationDelay: '1s'}}></div>
          <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-purple-800/7 to-transparent top-2/3 left-0 animate-data-stream"
               style={{animationDuration: '4.5s', animationDelay: '1.5s'}}></div>
        </div>
      )}
      
      {/* Subtle pulsating ring when inactive with deeper, more subtle color */}
      {!miningActive && (
        <div className="absolute inset-[-5px] rounded-full border border-navy-900/5 animate-pulse-slow"
             style={{animationDuration: '6s'}}></div>
      )}
    </>
  );
});

ButtonBackground.displayName = "ButtonBackground";
