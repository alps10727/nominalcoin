
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
      <div className={`absolute inset-0 rounded-full shadow-lg transition-all duration-500 overflow-hidden ${
        miningActive 
          ? 'bg-gradient-to-tr from-navy-600 via-indigo-700 to-darkPurple-900 border-2 border-navy-400/40 shadow-glow' 
          : 'bg-gradient-to-br from-indigo-800 via-darkPurple-900 to-navy-950 border border-navy-500/40 shadow-md'
      }`}>
        {/* Enhanced shimmering overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-sheen"
          style={{ 
            transform: 'translateX(-100%)', 
            animation: miningActive ? 'sheen 2.5s infinite' : 'sheen 5s infinite',
            opacity: miningActive ? 1 : 0.7
          }}>
        </div>
      </div>
      
      {/* Enhanced inner circle with better color transition */}
      <div className={`absolute inset-2 rounded-full transition-all duration-500 ${
        miningActive 
          ? 'bg-gradient-to-br from-darkPurple-900 to-navy-950 opacity-80 scale-95' 
          : 'bg-gradient-to-br from-navy-900 to-navy-950 opacity-90 scale-100'
      }`}></div>
      
      {/* Enhanced outer glow effect with brighter colors when active */}
      <div className={`absolute -inset-1 rounded-full ${
        miningActive 
          ? 'bg-navy-600/40 blur-sm animate-pulse-slow' 
          : 'bg-indigo-800/30 blur-sm animate-pulse-slow'
      }`} style={{animationDuration: miningActive ? '2s' : '4s'}}></div>
      
      {/* Enhanced border gradient */}
      <div className={`absolute -inset-px rounded-full ${
        miningActive 
          ? 'bg-gradient-to-r from-navy-500/50 to-indigo-600/50' 
          : 'bg-gradient-to-r from-indigo-700/30 to-darkPurple-700/30'
      }`}></div>
    </>
  );
});

ButtonBackground.displayName = "ButtonBackground";
