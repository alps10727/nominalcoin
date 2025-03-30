
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
      {/* Energy field simulation with improved visual effects */}
      <div className={`absolute w-36 h-36 rounded-full border-2 border-purple-500/30 transition-all duration-700 ${miningActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}></div>
      <div className={`absolute w-44 h-44 rounded-full border border-indigo-400/20 transition-all duration-900 ${miningActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}></div>
      <div className={`absolute w-52 h-52 rounded-full border border-purple-500/15 transition-all duration-1000 ${miningActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}></div>
      
      {/* Dynamic effects that only appear when active */}
      {miningActive && (
        <>
          {/* Pulsing energy rings */}
          <div className="absolute w-60 h-60 rounded-full animate-ping-slow opacity-10 border-2 border-indigo-400/40"></div>
          <div className="absolute inset-0 w-36 h-36 mx-auto my-auto">
            <div className="absolute inset-0 bg-purple-500/10 rounded-full animate-pulse-slow"></div>
          </div>
          
          {/* Cosmic energy particles */}
          <div className="absolute w-full h-full pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-indigo-300/60 rounded-full animate-particle-trace"
                style={{
                  left: '50%',
                  top: '50%',
                  animationDelay: `${i * 0.2}s`,
                  transform: `rotate(${i * 45}deg) translateX(${20 + Math.random() * 10}px)`
                }}
              />
            ))}
          </div>
          
          {/* Data flow lines */}
          <div className="absolute w-full h-full pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div 
                key={`flow-${i}`}
                className="absolute h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent animate-data-stream"
                style={{
                  width: `${30 + i * 10}px`,
                  left: `calc(50% - ${15 + i * 5}px)`,
                  top: `calc(50% + ${15 - i * 15}px)`,
                  animationDelay: `${i * 0.7}s`,
                  animationDuration: `${3 + i}s`
                }}
              />
            ))}
          </div>
        </>
      )}
      
      {/* The main button - enhanced with more dynamic effects */}
      <button 
        className={`relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer z-10 overflow-hidden transition-all duration-700 group ${miningActive ? 'scale-110' : 'scale-100'}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        aria-label={ariaLabel}
        title={ariaLabel}
      >
        {/* Button background with enhanced gradient */}
        <div className={`absolute inset-0 rounded-full transition-all duration-700 ${miningActive 
          ? 'bg-gradient-to-br from-purple-500 via-indigo-600 to-darkPurple-700 border-2 border-purple-400/70 shadow-[0_0_15px_rgba(147,51,234,0.5)]' 
          : 'bg-gradient-to-br from-purple-600 via-indigo-700 to-darkPurple-800 border-2 border-purple-500/50'
        } group-hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]`}></div>
        
        {/* Inner circle textures */}
        <div className="absolute inset-3 rounded-full border border-purple-300/15 bg-gradient-to-br from-purple-500/5 to-indigo-500/5"></div>
        <div className="absolute inset-6 rounded-full border border-purple-300/10"></div>
        
        {/* Center icon that shows when inactive - enhanced with pulsing effect */}
        {!miningActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className={`w-14 h-14 text-purple-200/60 ${isHovering ? 'animate-pulse' : ''}`} />
          </div>
        )}
        
        {/* Pulsing highlight effect */}
        <div className={`absolute inset-0 bg-gradient-to-t from-transparent via-purple-400/25 to-transparent opacity-0 ${isHovering ? 'animate-pulse-gradient opacity-100' : ''}`}></div>
        
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
