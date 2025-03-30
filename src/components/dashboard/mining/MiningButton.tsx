
import React, { useState, useEffect } from "react";
import { Play, Pause, Flame } from "lucide-react";

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
      <div className={`absolute w-36 h-36 rounded-full border border-amber-500/20 transition-all duration-500 ${miningActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}></div>
      <div className={`absolute w-44 h-44 rounded-full border border-orange-400/15 transition-all duration-700 ${miningActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}></div>
      <div className={`absolute w-52 h-52 rounded-full border border-red-500/10 transition-all duration-900 ${miningActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}></div>
      
      {/* Dynamic effects that only appear when active - reduced for less distraction */}
      {miningActive && (
        <>
          <div className="absolute w-60 h-60 rounded-full animate-ping-slow opacity-5 border border-orange-400/30"></div>
          <div className="absolute inset-0 w-36 h-36 mx-auto my-auto">
            <div className="absolute inset-0 bg-amber-500/5 rounded-full animate-pulse-slow"></div>
          </div>
          
          {/* Reduced ember particles for cleaner look */}
          <div className="absolute w-full h-full pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-0.5 h-0.5 bg-amber-300 rounded-full animate-particle-trace"
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
        {/* Button background with warm gradient - higher contrast for better visibility */}
        <div className={`absolute inset-0 rounded-full transition-all duration-500 ${miningActive 
          ? 'bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 border-2 border-amber-400/60' 
          : 'bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 border-2 border-amber-500/40'
        } group-hover:shadow-[0_0_20px_rgba(251,191,36,0.5)]`}></div>
        
        {/* Inner circle texture - more subtle */}
        <div className="absolute inset-3 rounded-full border border-amber-300/10"></div>
        <div className="absolute inset-6 rounded-full border border-amber-300/5"></div>
        
        {/* Center Flame icon that shows when inactive - larger and more visible */}
        {!miningActive && (
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <Flame className="w-14 h-14 text-amber-200" />
          </div>
        )}
        
        {/* Pulsing highlight effect - more noticeable for better feedback */}
        <div className={`absolute inset-0 bg-gradient-to-t from-transparent via-amber-400/15 to-transparent opacity-0 ${isHovering ? 'animate-pulse-gradient opacity-100' : ''}`}></div>
        
        {/* Button content - larger text and icons for better visibility */}
        <div className="relative flex flex-col items-center justify-center z-10">
          {miningActive ? (
            <>
              <div className="flex flex-col items-center">
                <Pause className="h-7 w-7 text-amber-100 mb-2" />
                <span className="text-base font-mono text-amber-100 font-semibold tracking-wider">
                  {displayTime}
                </span>
              </div>
            </>
          ) : (
            <>
              <Play className={`h-9 w-9 text-amber-100 ${isHovering ? 'animate-pulse' : ''}`} />
              <span className="text-sm mt-2 text-amber-100 font-medium">START</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};
