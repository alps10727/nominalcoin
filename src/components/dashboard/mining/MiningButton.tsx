
import React, { useState, useEffect } from "react";
import { Play, Pause, Zap } from "lucide-react";

interface MiningButtonProps {
  miningActive: boolean;
  miningTime: number;
  onButtonClick: () => void;
}

/**
 * Component that renders the mining button with clearer user feedback and state indicators
 */
export const MiningButton: React.FC<MiningButtonProps> = ({ 
  miningActive,
  miningTime, 
  onButtonClick
}) => {
  const [isHovering, setIsHovering] = useState(false);
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

  // Prevent default and stop propagation to avoid double-clicks
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onButtonClick();
  };

  // Descriptive aria labels for better accessibility
  const ariaLabel = miningActive ? "Stop mining" : "Start mining";

  return (
    <div className="relative mx-auto flex items-center justify-center">
      {/* Energy field simulation - more subtle and with better visual hierarchy */}
      <div className={`absolute w-36 h-36 rounded-full border border-purple-500/20 transition-all duration-500 ${miningActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}></div>
      <div className={`absolute w-44 h-44 rounded-full border border-indigo-400/15 transition-all duration-700 ${miningActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}></div>
      <div className={`absolute w-52 h-52 rounded-full border border-purple-500/10 transition-all duration-900 ${miningActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}></div>
      
      {/* Dynamic effects that only appear when active */}
      {miningActive && (
        <>
          <div className="absolute w-60 h-60 rounded-full animate-ping-slow opacity-5 border border-indigo-400/30"></div>
          <div className="absolute inset-0 w-36 h-36 mx-auto my-auto">
            <div className="absolute inset-0 bg-purple-500/5 rounded-full animate-pulse-slow"></div>
          </div>
          
          {/* Energy particles */}
          <div className="absolute w-full h-full pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-0.5 h-0.5 bg-indigo-300 rounded-full animate-particle-trace"
                style={{
                  left: '50%',
                  top: '50%',
                  animationDelay: `${i * 0.3}s`,
                  transform: `rotate(${i * 60}deg) translateX(${20 + Math.random() * 15}px)`
                }}
              />
            ))}
          </div>
        </>
      )}
      
      {/* The main button - larger touch target and clearer visual state */}
      <button 
        className={`relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer z-10 overflow-hidden transition-all duration-500 group ${miningActive ? 'scale-105' : 'scale-100'}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        aria-label={ariaLabel}
        title={ariaLabel}
      >
        {/* Button background with gradient */}
        <div className={`absolute inset-0 rounded-full transition-all duration-500 ${miningActive 
          ? 'bg-gradient-to-br from-purple-500 via-indigo-600 to-darkPurple-700 border-2 border-purple-400/60' 
          : 'bg-gradient-to-br from-purple-600 via-indigo-700 to-darkPurple-800 border-2 border-purple-500/40'
        } group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]`}></div>
        
        {/* Inner circle texture */}
        <div className="absolute inset-3 rounded-full border border-purple-300/10"></div>
        <div className="absolute inset-6 rounded-full border border-purple-300/5"></div>
        
        {/* Center icon that shows when inactive */}
        {!miningActive && (
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <Zap className="w-14 h-14 text-purple-200" />
          </div>
        )}
        
        {/* Pulsing highlight effect */}
        <div className={`absolute inset-0 bg-gradient-to-t from-transparent via-purple-400/15 to-transparent opacity-0 ${isHovering ? 'animate-pulse-gradient opacity-100' : ''}`}></div>
        
        {/* Button content */}
        <div className="relative flex flex-col items-center justify-center z-10">
          {miningActive ? (
            <>
              <div className="flex flex-col items-center">
                <Pause className="h-7 w-7 text-purple-100 mb-2" />
                <span className="text-base font-mono text-purple-100 font-semibold tracking-wider">
                  {displayTime}
                </span>
              </div>
            </>
          ) : (
            <>
              <Play className={`h-9 w-9 text-purple-100 ${isHovering ? 'animate-pulse' : ''}`} />
              <span className="text-sm mt-2 text-purple-100 font-medium">START</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};
