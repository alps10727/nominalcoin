
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
      <div className="h-3 w-full bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-full overflow-hidden backdrop-blur-sm border border-emerald-600/30">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
      {miningActive && (
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-emerald-300/80">Progress</span>
          <span className="text-xs text-emerald-300 font-medium">{(progress * 100).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
});

MiningProgressBar.displayName = "MiningProgressBar";
