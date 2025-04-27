
import React from "react";
import { CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface MiningCardHeaderProps {
  miningActive: boolean;
  isMobile: boolean;
}

export const MiningCardHeader = React.memo<MiningCardHeaderProps>(({ 
  miningActive,
  isMobile 
}) => {
  return (
    <div className={`flex items-center justify-between mb-4`}>
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-darkPurple-900/20 to-navy-900/20 
                     border border-darkPurple-800/20 shadow-inner">
          <Zap className="text-purple-400 h-4 w-4" />
        </div>
        <span className="text-lg font-medium text-white">NC Mining</span>
      </div>
      
      {miningActive && (
        <div className="flex items-center bg-purple-900/30 text-purple-300 text-xs px-2 py-1 rounded-full 
                     border border-purple-800/20 animate-pulse-slow shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse"></span>
          Active
        </div>
      )}
    </div>
  );
});

MiningCardHeader.displayName = "MiningCardHeader";
