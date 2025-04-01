
import React, { useEffect, useState, useCallback } from "react";
import { Star } from "lucide-react";

interface MiningButtonProps {
  miningActive: boolean;
  miningTime: number;
  onButtonClick: () => void;
}

export const MiningButton = React.memo<MiningButtonProps>(({ 
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

  // Memoize the button click handler
  const handleClick = useCallback(() => {
    onButtonClick();
  }, [onButtonClick]);

  return (
    <div className="mx-auto flex items-center justify-center">
      <button 
        className="relative w-40 h-40 rounded-full flex items-center justify-center cursor-pointer z-10 transition-all duration-500"
        onClick={handleClick}
        aria-label={miningActive ? "Stop mining" : "Start mining"}
      >
        {/* Background circles */}
        <div className="absolute inset-0 rounded-full bg-purple-800/80 border-4 border-purple-700/50"></div>
        <div className="absolute inset-8 rounded-full bg-purple-700/80 border border-purple-600/50"></div>
        <div className="absolute inset-16 rounded-full bg-purple-600/80 border border-purple-500/50"></div>
        
        {/* Ripple animations */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute inset-0 rounded-full border border-purple-500/30 animate-ping" 
            style={{ 
              animationDuration: `${3 + i * 0.5}s`, 
              animationDelay: `${i * 0.3}s`,
              opacity: 0.5 - i * 0.1
            }}
          ></div>
        ))}
        
        {/* Content */}
        <div className="relative flex flex-col items-center justify-center z-10 text-white">
          <Star className="h-6 w-6 mb-1 text-white" />
          <span className="text-lg font-bold uppercase tracking-wide">
            {miningActive ? "STOP" : "START"}
          </span>
        </div>
      </button>
    </div>
  );
});

MiningButton.displayName = "MiningButton";
