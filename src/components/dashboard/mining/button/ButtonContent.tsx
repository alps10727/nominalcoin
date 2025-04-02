
import React from "react";
import { Play, Pause, Zap } from "lucide-react";

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
          {/* Active mining state */}
          <div className="relative">
            <Pause className="h-7 w-7 text-white mb-1 animate-pulse-slow" />
            <div className="absolute inset-0 blur-sm bg-purple-500/20 rounded-full -z-10"></div>
          </div>
          
          <span className="text-xs font-mono text-white font-medium tracking-wider bg-darkPurple-900/70 px-2 py-0.5 rounded-md shadow-inner border border-purple-500/30 transition-all duration-500">
            {displayTime}
          </span>
          
          {/* Energy particles */}
          <div className="absolute inset-0 flex items-center justify-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-purple-300 rounded-full animate-float-data"
                style={{ 
                  top: '50%', 
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${i * 0.3}s` 
                }}
              ></div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Inactive state - start mining */}
          <div className="relative transition-all duration-500">
            <div className="relative">
              <Zap className="h-8 w-8 text-white mb-1 animate-cosmic-pulse drop-shadow-md" 
                style={{animationDuration: '3s'}} />
              <div className="absolute inset-0 bg-purple-500/30 blur-md rounded-full -z-10 transition-all duration-500"></div>
            </div>
          </div>
          <span className="text-sm text-white font-bold tracking-wider bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-400 bg-clip-text text-transparent animate-cosmic-pulse transition-all duration-500">
            START
          </span>
          
          {/* Light beam effect */}
          <div className="absolute top-0 left-1/2 w-px h-12 -translate-x-1/2 -translate-y-full">
            <div className="w-full h-full bg-gradient-to-b from-transparent to-purple-400/40"></div>
          </div>
        </>
      )}
    </div>
  );
});

ButtonContent.displayName = "ButtonContent";
