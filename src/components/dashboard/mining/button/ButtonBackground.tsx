
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
      {/* Enhanced main gradient background with deeper dark colors */}
      <div className={`absolute inset-0 rounded-full shadow-lg transition-all duration-700 overflow-hidden ${
        miningActive 
          ? 'bg-gradient-to-tr from-darkPurple-950 via-darkPurple-900 to-navy-900 border-2 border-darkPurple-700/40 shadow-glow' 
          : 'bg-gradient-to-br from-darkPurple-950 via-navy-950 to-darkPurple-950 border border-darkPurple-800/40 shadow-md'
      }`}>
        {/* Enhanced shimmering overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent button-shimmer"></div>
        
        {/* Hexagon grid pattern for futuristic look */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      
      {/* Enhanced inner circle with better color transition */}
      <div className={`absolute inset-2 rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-gradient-to-br from-darkPurple-950 to-navy-950 opacity-90 scale-95' 
          : 'bg-gradient-to-br from-navy-950 to-darkPurple-950 opacity-95 scale-100'
      }`}></div>
      
      {/* Enhanced outer glow effect with deeper colors when active */}
      <div className={`absolute -inset-1 rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-purple-700/20 blur-md animate-pulse-slow' 
          : 'bg-navy-800/15 blur-md animate-pulse-slow'
      }`} style={{animationDuration: miningActive ? '2s' : '4s', transition: 'animation-duration 0.7s ease'}}></div>
      
      {/* Enhanced border gradient */}
      <div className={`absolute -inset-px rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-gradient-to-r from-darkPurple-800/40 via-navy-700/40 to-darkPurple-800/40' 
          : 'bg-gradient-to-r from-darkPurple-900/25 via-navy-900/25 to-darkPurple-900/25'
      }`}></div>
      
      {/* Enhanced inner rotating gradients */}
      <div className={`absolute inset-4 rounded-full overflow-hidden transition-opacity duration-700 ${
        miningActive ? 'opacity-50' : 'opacity-30'
      }`}>
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-purple-700/15 to-transparent ${
          miningActive ? 'animate-spin-slow' : 'animate-reverse-spin'
        }`} style={{
          animationDuration: miningActive ? '10s' : '15s',
          transition: 'animation 0.7s ease'
        }}></div>
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-navy-700/10 to-transparent ${
          miningActive ? 'animate-reverse-spin' : 'animate-spin-slow'
        }`} style={{
          animationDuration: miningActive ? '12s' : '18s',
          transition: 'animation 0.7s ease'
        }}></div>
      </div>
      
      {/* Enhanced core glow when active */}
      {miningActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/3 h-1/3 bg-gradient-to-r from-purple-600/15 to-navy-600/15 rounded-full blur-md animate-pulse-slow"></div>
        </div>
      )}
      
      {/* Energy lines when active */}
      {miningActive && (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent top-1/2 left-0 animate-data-stream"
               style={{animationDuration: '3s'}}></div>
          <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-navy-500/20 to-transparent top-0 left-1/2 animate-data-stream"
               style={{animationDuration: '3.5s', animationDelay: '0.5s'}}></div>
          <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-navy-500/15 to-transparent top-1/3 left-0 animate-data-stream"
               style={{animationDuration: '4s', animationDelay: '1s'}}></div>
          <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/15 to-transparent top-2/3 left-0 animate-data-stream"
               style={{animationDuration: '4.5s', animationDelay: '1.5s'}}></div>
        </div>
      )}
      
      {/* Subtle pulsating ring when inactive */}
      {!miningActive && (
        <div className="absolute inset-[-5px] rounded-full border border-navy-600/10 animate-pulse-slow"
             style={{animationDuration: '6s'}}></div>
      )}
    </>
  );
});

ButtonBackground.displayName = "ButtonBackground";
