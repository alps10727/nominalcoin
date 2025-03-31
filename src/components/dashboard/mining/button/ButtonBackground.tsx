
import React from "react";

interface ButtonBackgroundProps {
  miningActive: boolean;
}

/**
 * The main background layers for the mining button
 */
export const ButtonBackground: React.FC<ButtonBackgroundProps> = ({ miningActive }) => {
  return (
    <>
      {/* Main gradient background with glow effects */}
      <div className={`absolute inset-0 rounded-full shadow-lg transition-all duration-500 overflow-hidden ${
        miningActive 
          ? 'bg-gradient-to-tr from-indigo-700 via-purple-600 to-darkPurple-800 border-2 border-indigo-400/40 shadow-glow' 
          : 'bg-gradient-to-br from-navy-800 via-darkPurple-800 to-navy-950 border border-indigo-500/30 shadow-md'
      }`}>
        {/* Shimmering overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-sheen"
          style={{ 
            transform: 'translateX(-100%)', 
            animation: miningActive ? 'sheen 2.5s infinite' : 'sheen 5s infinite',
            opacity: miningActive ? 1 : 0.5
          }}>
        </div>
      </div>
      
      {/* Inner circle */}
      <div className={`absolute inset-2 rounded-full transition-all duration-500 ${
        miningActive 
          ? 'bg-gradient-to-br from-darkPurple-900 to-navy-950 opacity-60 scale-95' 
          : 'bg-gradient-to-br from-navy-900 to-darkPurple-950 opacity-70 scale-100'
      }`}></div>
      
      {/* Outer glow effect */}
      <div className={`absolute -inset-1 rounded-full ${
        miningActive 
          ? 'bg-indigo-600/30 blur-sm animate-pulse-slow' 
          : 'bg-navy-900/40 blur-sm animate-pulse-slow'
      }`} style={{animationDuration: miningActive ? '2s' : '4s'}}></div>
      
      {/* Border gradient */}
      <div className={`absolute -inset-px rounded-full ${
        miningActive 
          ? 'bg-gradient-to-r from-indigo-500/40 to-purple-500/40' 
          : 'bg-gradient-to-r from-navy-800/30 to-darkPurple-800/30'
      }`}></div>
    </>
  );
};
