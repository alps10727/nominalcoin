
import React from "react";
import { Play, Pause } from "lucide-react";

interface ButtonContentProps {
  miningActive: boolean;
  displayTime: string;
}

/**
 * The content displayed inside the mining button
 */
export const ButtonContent = React.memo<ButtonContentProps>(({ miningActive, displayTime }) => {
  return (
    <div className="relative flex flex-col items-center justify-center z-10">
      {miningActive ? (
        <>
          <Pause className="h-8 w-8 text-white mb-2 animate-pulse" style={{animationDuration: '1.5s'}} />
          <span className="text-sm font-mono text-white font-medium tracking-wider bg-darkPurple-900/60 px-2 py-0.5 rounded-md shadow-inner border border-indigo-500/20">
            {displayTime}
          </span>
          <span className="text-xs text-navy-300 mt-1.5 font-semibold animate-pulse tracking-wider">
            MINING
          </span>
        </>
      ) : (
        <>
          <div className="relative">
            <Play className="h-9 w-9 text-white mb-1 animate-cosmic-pulse drop-shadow-lg" 
              style={{animationDuration: '3s'}} />
            <div className="absolute inset-0 bg-darkPurple-500/20 blur-md rounded-full -z-10"></div>
          </div>
          <span className="text-sm text-white font-bold mt-2 tracking-wider bg-gradient-to-r from-navy-400 to-indigo-400 bg-clip-text text-transparent animate-cosmic-pulse">
            START
          </span>
        </>
      )}
    </div>
  );
});

ButtonContent.displayName = "ButtonContent";
