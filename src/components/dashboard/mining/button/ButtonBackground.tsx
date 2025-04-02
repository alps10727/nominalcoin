
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
      {/* Main gradient background with enhanced dark colors */}
      <div className={`absolute inset-0 rounded-full shadow-lg transition-all duration-700 overflow-hidden ${
        miningActive 
          ? 'bg-gradient-to-tr from-darkPurple-950 via-darkPurple-900 to-navy-900 border-2 border-darkPurple-700/40 shadow-glow' 
          : 'bg-gradient-to-br from-darkPurple-900 via-navy-900 to-darkPurple-950 border border-darkPurple-800/40 shadow-md'
      }`}>
        {/* Enhanced shimmering overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent button-shimmer"></div>
      </div>
      
      {/* Enhanced inner circle with better color transition */}
      <div className={`absolute inset-2 rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-gradient-to-br from-darkPurple-950 to-navy-950 opacity-90 scale-95' 
          : 'bg-gradient-to-br from-navy-900 to-darkPurple-950 opacity-95 scale-100'
      }`}></div>
      
      {/* Enhanced outer glow effect with brighter colors when active */}
      <div className={`absolute -inset-1 rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-purple-600/30 blur-sm animate-pulse-slow' 
          : 'bg-navy-700/20 blur-sm animate-pulse-slow'
      }`} style={{animationDuration: miningActive ? '2s' : '4s', transition: 'animation-duration 0.7s ease'}}></div>
      
      {/* Enhanced border gradient */}
      <div className={`absolute -inset-px rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-gradient-to-r from-darkPurple-700/50 to-navy-600/50' 
          : 'bg-gradient-to-r from-darkPurple-800/30 to-navy-800/30'
      }`}></div>
      
      {/* Enhanced inner rotating gradients */}
      <div className={`absolute inset-4 rounded-full overflow-hidden transition-opacity duration-700 ${
        miningActive ? 'opacity-50' : 'opacity-30'
      }`}>
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-purple-600/20 to-transparent ${
          miningActive ? 'animate-spin-slow' : 'animate-reverse-spin'
        }`} style={{
          animationDuration: miningActive ? '10s' : '15s',
          transition: 'animation 0.7s ease'
        }}></div>
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-navy-600/15 to-transparent ${
          miningActive ? 'animate-reverse-spin' : 'animate-spin-slow'
        }`} style={{
          animationDuration: miningActive ? '12s' : '18s',
          transition: 'animation 0.7s ease'
        }}></div>
      </div>
      
      {/* Core glow when active */}
      {miningActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/3 h-1/3 bg-purple-500/15 rounded-full blur-md animate-pulse-slow"></div>
        </div>
      )}
      
      {/* New subtle grid pattern overlay */}
      <div className="absolute inset-0 rounded-full bg-grid-pattern opacity-5"></div>
    </>
  );
});

ButtonBackground.displayName = "ButtonBackground";
