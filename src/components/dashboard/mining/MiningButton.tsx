
import React from "react";
import { Play, Pause, Zap } from "lucide-react";

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
  const [displayTime, setDisplayTime] = React.useState("");
  
  // Format and update the displayed time
  React.useEffect(() => {
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
      {/* Status rings */}
      <div className={`absolute w-36 h-36 rounded-full border-2 border-teal-500/30 transition-all duration-700 ${miningActive ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`absolute w-44 h-44 rounded-full border border-blue-400/20 transition-all duration-700 ${miningActive ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* The main button */}
      <button 
        className={`relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer z-10 overflow-hidden transition-all duration-700 ${miningActive ? 'scale-110' : 'scale-100'}`}
        onClick={handleClick}
        aria-label={ariaLabel}
        title={ariaLabel}
      >
        {/* Button background with glowing effect */}
        <div className={`absolute inset-0 rounded-full transition-all duration-700 ${miningActive 
          ? 'bg-gradient-to-r from-teal-600 via-blue-700 to-navy-800 border-2 border-teal-400/50 shadow-[0_0_25px_rgba(20,184,166,0.5)]' 
          : 'bg-gradient-to-r from-teal-500 via-blue-600 to-navy-700 border-2 border-teal-300/30'
        }`}></div>
        
        {/* Pulsing inner glow */}
        <div className={`absolute inset-2 rounded-full bg-gradient-to-br from-teal-400/20 to-blue-500/10 animate-pulse-slow opacity-70 ${miningActive ? 'opacity-100' : 'opacity-60'}`}></div>
        
        {/* Button content */}
        <div className="relative flex flex-col items-center justify-center z-10">
          {miningActive ? (
            <>
              <div className="flex flex-col items-center">
                <Pause className="h-7 w-7 text-white mb-2" />
                <span className="text-base font-mono text-white font-semibold tracking-wider">
                  {displayTime}
                </span>
                <span className="text-xs text-teal-200 mt-1">MINING</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Zap className="h-9 w-9 text-white" />
                  <div className="absolute -inset-1 rounded-full bg-teal-500/20 animate-ping-slow"></div>
                </div>
                <span className="text-sm mt-2 text-white font-medium">START</span>
              </div>
            </>
          )}
        </div>
      </button>
    </div>
  );
};
