
import React from "react";
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
      <div className={`absolute w-36 h-36 rounded-full border-2 border-purple-500/30 transition-all duration-700 ${miningActive ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`absolute w-44 h-44 rounded-full border border-indigo-400/20 transition-all duration-700 ${miningActive ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* The main button */}
      <button 
        className={`relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer z-10 overflow-hidden transition-all duration-700 ${miningActive ? 'scale-110' : 'scale-100'}`}
        onClick={handleClick}
        aria-label={ariaLabel}
        title={ariaLabel}
      >
        {/* Button background */}
        <div className={`absolute inset-0 rounded-full transition-all duration-700 ${miningActive 
          ? 'bg-gradient-to-br from-purple-500 via-indigo-600 to-darkPurple-700 border-2 border-purple-400/70 shadow-lg' 
          : 'bg-gradient-to-br from-purple-600 via-indigo-700 to-darkPurple-800 border-2 border-purple-500/50'
        }`}></div>
        
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
              <Play className="h-9 w-9 text-purple-100" />
              <span className="text-sm mt-2 text-purple-100 font-medium">START</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};
