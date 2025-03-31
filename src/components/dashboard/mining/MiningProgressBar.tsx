
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
    <div className="mb-6 mt-2">
      <div className="h-3 w-full bg-gradient-to-r from-navy-900/80 to-darkPurple-900/80 rounded-full overflow-hidden backdrop-blur-sm border border-darkPurple-600/30">
        <div 
          className="h-full bg-gradient-to-r from-darkPurple-500 via-indigo-500 to-navy-500 rounded-full transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
      {miningActive && (
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-darkPurple-300/80">Progress</span>
          <span className="text-xs text-darkPurple-300 font-medium">{(progress * 100).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
});

MiningProgressBar.displayName = "MiningProgressBar";
