
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
          miningActive ? 'scale-105' : 'scale-100 hover:scale-105'
        }`}
        onClick={onButtonClick}
        aria-label={miningActive ? "Stop mining" : "Start mining"}
        title={miningActive ? "Stop mining" : "Start mining"}
      >
        {/* Main button background with enhanced gradient */}
        <div className={`absolute inset-0 rounded-full shadow-lg transition-all duration-300 ${
          miningActive 
            ? 'bg-gradient-to-br from-indigo-600 via-purple-500 to-darkPurple-700 border-2 border-indigo-400/40' 
            : 'bg-gradient-to-br from-navy-700 via-navy-800 to-darkPurple-900 border border-indigo-500/20'
        }`}>
          {/* Animated pulse rings when active */}
          {miningActive && (
            <>
              <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-pulse-slow"></div>
              <div className="absolute -inset-3 rounded-full bg-indigo-500/5 animate-pulse opacity-75" style={{animationDelay: '0.5s'}}></div>
            </>
          )}
        </div>
        
        {/* Inner circle for depth effect */}
        <div className={`absolute inset-2 rounded-full transition-all duration-300 ${
          miningActive 
            ? 'bg-gradient-to-br from-darkPurple-800 to-navy-900 opacity-30' 
            : 'bg-gradient-to-br from-navy-800 to-darkPurple-900 opacity-50'
        }`}></div>
        
        {/* Button content */}
        <div className="relative flex flex-col items-center justify-center z-10">
          {miningActive ? (
            <>
              <Pause className="h-8 w-8 text-white mb-2 animate-fade-in" />
              <span className="text-sm font-mono text-white font-medium tracking-wider">
                {displayTime}
              </span>
              <span className="text-xs text-indigo-200 mt-1 animate-pulse">MINING</span>
            </>
          ) : (
            <>
              <Play className="h-8 w-8 text-white mb-1" />
              <span className="text-sm text-white font-medium mt-1">START</span>
            </>
          )}
        </div>
        
        {/* Subtle border glow when active */}
        {miningActive && (
          <div className="absolute -inset-1 rounded-full bg-indigo-600/10 blur-sm"></div>
        )}
      </button>
    </div>
  );
};
