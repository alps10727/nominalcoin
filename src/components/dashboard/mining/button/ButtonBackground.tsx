
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
      {/* Main gradient background with enhanced glow effects */}
      <div className={`absolute inset-0 rounded-full shadow-lg transition-all duration-700 overflow-hidden ${
        miningActive 
          ? 'bg-gradient-to-tr from-darkPurple-800 via-darkPurple-700 to-darkPurple-900 border-2 border-darkPurple-500/40 shadow-glow' 
          : 'bg-gradient-to-br from-darkPurple-700 via-darkPurple-800 to-darkPurple-950 border border-darkPurple-600/40 shadow-md'
      }`}>
        {/* Enhanced shimmering overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          style={{ 
            transform: 'translateX(-100%)', 
            animation: miningActive ? 'sheen 2.5s infinite' : 'sheen 5s infinite',
            opacity: miningActive ? 1 : 0.7,
            transition: 'opacity 0.7s ease, animation 0.7s ease'
          }}>
        </div>
      </div>
      
      {/* Enhanced inner circle with better color transition */}
      <div className={`absolute inset-2 rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-gradient-to-br from-darkPurple-900 to-darkPurple-950 opacity-80 scale-95' 
          : 'bg-gradient-to-br from-darkPurple-800 to-darkPurple-950 opacity-90 scale-100'
      }`}></div>
      
      {/* Enhanced outer glow effect with brighter colors when active */}
      <div className={`absolute -inset-1 rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-purple-600/40 blur-sm animate-pulse-slow' 
          : 'bg-darkPurple-700/30 blur-sm animate-pulse-slow'
      }`} style={{animationDuration: miningActive ? '2s' : '4s', transition: 'animation-duration 0.7s ease'}}></div>
      
      {/* Enhanced border gradient */}
      <div className={`absolute -inset-px rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-gradient-to-r from-darkPurple-500/50 to-purple-600/50' 
          : 'bg-gradient-to-r from-darkPurple-600/30 to-purple-700/30'
      }`}></div>
      
      {/* New effect - inner rotating gradients */}
      <div className={`absolute inset-4 rounded-full overflow-hidden transition-opacity duration-700 ${
        miningActive ? 'opacity-40' : 'opacity-20'
      }`}>
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent ${
          miningActive ? 'animate-spin-slow' : 'animate-reverse-spin'
        }`} style={{
          animationDuration: miningActive ? '10s' : '15s',
          transition: 'animation 0.7s ease'
        }}></div>
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-darkPurple-500/20 to-transparent ${
          miningActive ? 'animate-reverse-spin' : 'animate-spin-slow'
        }`} style={{
          animationDuration: miningActive ? '12s' : '18s',
          transition: 'animation 0.7s ease'
        }}></div>
      </div>
    </>
  );
});

ButtonBackground.displayName = "ButtonBackground";
