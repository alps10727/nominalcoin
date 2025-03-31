
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

  return (
    <div className="mx-auto flex items-center justify-center">
      {/* Simplified button with minimal effects */}
      <button 
        className={`relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer z-10 transition-all duration-300 ${miningActive ? 'scale-105' : 'scale-100 hover:scale-102'}`}
        onClick={onButtonClick}
        aria-label={miningActive ? "Stop mining" : "Start mining"}
        title={miningActive ? "Stop mining" : "Start mining"}
      >
        {/* Button background with subtle gradient */}
        <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
          miningActive 
            ? 'bg-gradient-to-b from-purple-600 to-navy-700 border border-purple-400/30 shadow-md' 
            : 'bg-gradient-to-b from-navy-700 to-navy-900 border border-navy-600/20 shadow-sm'
        }`}></div>
        
        {/* Button content with simplified design */}
        <div className="relative flex flex-col items-center justify-center z-10">
          {miningActive ? (
            <>
              <Pause className="h-8 w-8 text-white mb-2" />
              <span className="text-sm font-mono text-white font-medium tracking-wider">
                {displayTime}
              </span>
              <span className="text-xs text-indigo-200 mt-1">MINING</span>
            </>
          ) : (
            <>
              <Play className="h-8 w-8 text-white mb-1" />
              <span className="text-sm text-white font-medium mt-1">START</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};
