
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
          <span className="text-sm font-mono text-white font-medium tracking-wider bg-darkPurple-900/60 px-2 py-0.5 rounded-md shadow-inner border border-purple-500/20 transition-all duration-500">
            {displayTime}
          </span>
          <span className="text-xs text-purple-300 mt-1.5 font-semibold animate-pulse tracking-wider transition-all duration-500">
            MINING
          </span>
        </>
      ) : (
        <>
          <div className="relative transition-all duration-500">
            <Play className="h-9 w-9 text-white mb-1 animate-cosmic-pulse drop-shadow-lg" 
              style={{animationDuration: '3s'}} />
            <div className="absolute inset-0 bg-purple-500/20 blur-md rounded-full -z-10 transition-all duration-500"></div>
          </div>
          <span className="text-sm text-white font-bold mt-2 tracking-wider bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-cosmic-pulse transition-all duration-500">
            START
          </span>
        </>
      )}
    </div>
  );
});

ButtonContent.displayName = "ButtonContent";
