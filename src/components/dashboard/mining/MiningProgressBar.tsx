
import React from "react";

interface MiningProgressBarProps {
  progress: number;
  miningActive: boolean;
}

export const MiningProgressBar = React.memo<MiningProgressBarProps>(({ 
  progress, 
  miningActive 
}) => {
  return (
    <div className="my-4">
      <div className="h-3 w-full bg-gradient-to-r from-darkPurple-900/80 to-purple-900/50 rounded-full overflow-hidden backdrop-blur-sm border border-purple-600/20">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 via-darkPurple-500 to-purple-600 rounded-full transition-all duration-500 relative"
          style={{ width: `${progress * 100}%` }}
        >
          {/* Animated reflections/particles within the bar */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Moving reflection */}
            <div 
              className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent button-shimmer"
              style={{ animationDuration: '2s' }}
            ></div>
            
            {/* Small sparkling dots */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white/70 animate-pulse"
                style={{ 
                  right: `${i * 25}%`, 
                  top: '50%',
                  transform: 'translateY(-50%)',
                  animationDuration: `${1 + i * 0.3}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      {miningActive && (
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-purple-300/80 flex items-center">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400/80 mr-1 animate-pulse"></span>
            Mining Progress
          </span>
          <span className="text-xs text-purple-300 font-medium">{(progress * 100).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
});

MiningProgressBar.displayName = "MiningProgressBar";
