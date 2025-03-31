
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
          <span className="text-sm font-mono text-white font-medium tracking-wider bg-darkPurple-900/40 px-2 py-0.5 rounded-md">
            {displayTime}
          </span>
          <span className="text-xs text-indigo-200 mt-1.5 font-semibold animate-pulse tracking-wider">
            MINING
          </span>
        </>
      ) : (
        <>
          <Play className="h-8 w-8 text-white mb-1 animate-cosmic-pulse" style={{animationDuration: '3s'}} />
          <span className="text-sm text-white font-medium mt-1 tracking-wider animate-cosmic-pulse">START</span>
        </>
      )}
    </div>
  );
});

ButtonContent.displayName = "ButtonContent";
