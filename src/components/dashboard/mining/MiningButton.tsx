
import React, { useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";

interface MiningButtonProps {
  miningActive: boolean;
  miningTime: number;
  onButtonClick: () => void;
}

export const MiningButton: React.FC<MiningButtonProps> = ({ 
  miningActive,
  miningTime, 
  onButtonClick
}) => {
  const [displayTime, setDisplayTime] = useState("");
  
  // Format and update the displayed time
  useEffect(() => {
    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    setDisplayTime(formatTime(miningTime));
  }, [miningTime]);

  return (
    <div className="mx-auto flex items-center justify-center">
      <button 
        className={`relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer z-10 transition-all duration-500 ${
          miningActive ? 'scale-110' : 'scale-100 hover:scale-105'
        }`}
        onClick={onButtonClick}
        aria-label={miningActive ? "Stop mining" : "Start mining"}
        title={miningActive ? "Stop mining" : "Start mining"}
      >
        {/* Improved animated background gradient */}
        <div className={`absolute inset-0 rounded-full shadow-lg transition-all duration-300 overflow-hidden ${
          miningActive 
            ? 'bg-gradient-to-tr from-indigo-600 via-purple-500 to-darkPurple-700 border-2 border-indigo-400/40' 
            : 'bg-gradient-to-br from-navy-700 via-navy-800 to-darkPurple-900 border border-indigo-500/20'
        }`}>
          {/* Shimmering overlay effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
            transition-all duration-300 ${miningActive ? '' : 'opacity-0'}`} 
            style={{ 
              transform: 'translateX(-100%)', 
              animation: miningActive ? 'sheen 3s infinite' : 'none',
              animationDelay: '1s'
            }}>
          </div>
          
          {/* Animated pulse rings when active */}
          {miningActive && (
            <>
              <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-pulse-slow"></div>
              <div className="absolute -inset-2 rounded-full bg-indigo-500/5 animate-pulse-slow" 
                style={{animationDelay: '0.5s'}}></div>
              <div className="absolute -inset-4 rounded-full bg-indigo-500/5 animate-pulse-slow" 
                style={{animationDelay: '1s'}}></div>
            </>
          )}
        </div>
        
        {/* Inner circle with dynamic animation */}
        <div className={`absolute inset-2 rounded-full transition-all duration-300 ${
          miningActive 
            ? 'bg-gradient-to-br from-darkPurple-800 to-navy-900 opacity-30 scale-95' 
            : 'bg-gradient-to-br from-navy-800 to-darkPurple-900 opacity-50'
        }`}></div>
        
        {/* Button content with enhanced animations */}
        <div className="relative flex flex-col items-center justify-center z-10">
          {miningActive ? (
            <>
              <Pause className="h-8 w-8 text-white mb-2 animate-fade-in" />
              <span className="text-sm font-mono text-white font-medium tracking-wider bg-darkPurple-900/30 px-2 py-0.5 rounded-md">
                {displayTime}
              </span>
              <span className="text-xs text-indigo-200 mt-1.5 font-semibold animate-pulse tracking-wider">
                MINING
              </span>
            </>
          ) : (
            <>
              <Play className="h-8 w-8 text-white mb-1 transition-transform group-hover:scale-110" />
              <span className="text-sm text-white font-medium mt-1 tracking-wider">START</span>
            </>
          )}
        </div>
        
        {/* Enhanced glow effect when active */}
        {miningActive && (
          <>
            <div className="absolute -inset-1 rounded-full bg-indigo-600/20 blur-sm animate-pulse-slow"></div>
            <div className="absolute -inset-px rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30"></div>
          </>
        )}
        
        {/* Particle effects when active */}
        {miningActive && (
          <div className="absolute -inset-8 z-0 overflow-hidden rounded-full">
            <div className="absolute top-1/2 left-1/4 h-1 w-1 rounded-full bg-indigo-300/80 animate-float-1"></div>
            <div className="absolute top-1/2 right-1/4 h-1 w-1 rounded-full bg-purple-300/80 animate-float-2" 
              style={{animationDelay: '0.7s'}}></div>
            <div className="absolute bottom-1/3 left-1/3 h-1 w-1 rounded-full bg-indigo-300/80 animate-float-3" 
              style={{animationDelay: '1.3s'}}></div>
          </div>
        )}
      </button>
    </div>
  );
};
