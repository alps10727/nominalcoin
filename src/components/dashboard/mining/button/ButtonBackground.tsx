
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
      {/* Main gradient background with deeper dark colors */}
      <div className={`absolute inset-0 rounded-full shadow-lg transition-all duration-700 overflow-hidden ${
        miningActive 
          ? 'bg-gradient-to-tr from-navy-950 via-darkPurple-950 to-darkPurple-900 border-2 border-darkPurple-600/40 shadow-glow' 
          : 'bg-gradient-to-br from-navy-950 via-darkPurple-950 to-navy-900 border border-darkPurple-700/30 shadow-md'
      }`}>
        {/* Enhanced shimmering overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent button-shimmer"></div>
        
        {/* Hexagon grid pattern for futuristic look */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      
      {/* Inner circle with richer color transition */}
      <div className={`absolute inset-2 rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-gradient-to-br from-navy-950 to-darkPurple-900 opacity-95 scale-95' 
          : 'bg-gradient-to-br from-darkPurple-950 to-navy-900 opacity-90 scale-100'
      }`}></div>
      
      {/* New! 3D-like inner ring */}
      <div className={`absolute inset-3 rounded-full border transition-all duration-700 ${
        miningActive 
          ? 'border-purple-600/30' 
          : 'border-navy-700/20'
      }`}></div>
      
      {/* Outer glow effect with deeper colors and reduced brightness when active */}
      <div className={`absolute -inset-1 rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-purple-800/20 blur-md animate-pulse-slow' 
          : 'bg-navy-800/15 blur-md animate-pulse-slow'
      }`} style={{animationDuration: miningActive ? '2s' : '4s', transition: 'animation-duration 0.7s ease'}}></div>
      
      {/* Enhanced border gradient with deeper colors */}
      <div className={`absolute -inset-px rounded-full transition-all duration-700 ${
        miningActive 
          ? 'bg-gradient-to-r from-darkPurple-800/30 via-navy-700/30 to-darkPurple-800/30' 
          : 'bg-gradient-to-r from-darkPurple-900/25 via-navy-800/25 to-darkPurple-900/25'
      }`}></div>
      
      {/* New! Illuminated edge effect */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-navy-500/20 to-transparent"></div>
      </div>
      
      {/* Inner rotating gradients with deeper shades */}
      <div className={`absolute inset-4 rounded-full overflow-hidden transition-opacity duration-700 ${
        miningActive ? 'opacity-40' : 'opacity-30'
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
      
      {/* New! Subtle angular accent lines */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute top-[15%] left-[15%] w-[20%] h-[1px] bg-purple-600/20 transform rotate-45"></div>
        <div className="absolute bottom-[15%] right-[15%] w-[20%] h-[1px] bg-navy-600/20 transform rotate-45"></div>
        <div className="absolute top-[15%] right-[15%] w-[20%] h-[1px] bg-purple-600/20 transform -rotate-45"></div>
        <div className="absolute bottom-[15%] left-[15%] w-[20%] h-[1px] bg-navy-600/20 transform -rotate-45"></div>
      </div>
      
      {/* Core glow when active with deeper, richer colors */}
      {miningActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/2 h-1/2 bg-gradient-to-r from-purple-700/15 to-navy-700/15 rounded-full blur-lg animate-pulse-slow"></div>
        </div>
      )}
      
      {/* Energy lines when active with deeper color scheme */}
      {miningActive && (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-purple-600/20 to-transparent top-1/2 left-0 animate-data-stream"
               style={{animationDuration: '3s'}}></div>
          <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-navy-600/20 to-transparent top-0 left-1/2 animate-data-stream"
               style={{animationDuration: '3.5s', animationDelay: '0.5s'}}></div>
          <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-navy-600/15 to-transparent top-1/3 left-0 animate-data-stream"
               style={{animationDuration: '4s', animationDelay: '1s'}}></div>
          <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-purple-600/15 to-transparent top-2/3 left-0 animate-data-stream"
               style={{animationDuration: '4.5s', animationDelay: '1.5s'}}></div>
          
          {/* New! Diagonal energy lines */}
          <div className="absolute h-[1px] w-[141%] bg-gradient-to-r from-transparent via-purple-600/10 to-transparent top-1/2 left-0 animate-data-stream transform rotate-45 origin-center"
               style={{animationDuration: '5s', animationDelay: '0.2s'}}></div>
          <div className="absolute h-[1px] w-[141%] bg-gradient-to-r from-transparent via-navy-600/10 to-transparent top-1/2 left-0 animate-data-stream transform -rotate-45 origin-center"
               style={{animationDuration: '5.5s', animationDelay: '1.2s'}}></div>
        </div>
      )}
      
      {/* New! Subtle pulsating rings when inactive */}
      {!miningActive && (
        <>
          <div className="absolute inset-[-5px] rounded-full border border-purple-800/10 animate-pulse-slow"
              style={{animationDuration: '6s'}}></div>
          <div className="absolute inset-[-10px] rounded-full border border-navy-800/5 animate-pulse-slow"
              style={{animationDuration: '8s'}}></div>
        </>
      )}
    </>
  );
});

ButtonBackground.displayName = "ButtonBackground";
