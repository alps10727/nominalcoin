
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { MiningBackground } from "./mining/MiningBackground";
import { MiningButton } from "./mining/MiningButton";
import { MiningProgressBar } from "./mining/MiningProgressBar";
import { Zap } from "lucide-react";

interface MiningCardProps {
  miningActive: boolean;
  progress: number;
  miningRate: number;
  miningSession: number;
  miningTime: number;
  onStartMining: () => void;
  onStopMining: () => void;
}

const MiningCard = React.memo<MiningCardProps>(({
  miningActive,
  progress,
  miningRate,
  miningSession,
  miningTime,
  onStartMining,
  onStopMining
}) => {
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();
  
  // Handle button clicks with debounce logic to prevent rapid toggling
  const handleButtonClick = React.useCallback(() => {
    console.log("Mining button clicked, current status:", miningActive);
    if (miningActive) {
      onStopMining();
    } else {
      onStartMining();
    }
  }, [miningActive, onStartMining, onStopMining]);

  return (
    <Card className="mb-4 border border-darkPurple-800/30 overflow-hidden shadow-md transition-all duration-300 relative rounded-xl max-w-md mx-auto">
      {/* Background */}
      <MiningBackground />
      
      {/* Content - larger padding */}
      <CardContent className={`relative z-10 ${isMobile ? "px-4 py-4" : "px-6 py-6"}`}>
        <MiningProgressBar progress={progress} miningActive={miningActive} />
      
        <div className="text-center my-4">
          <MiningButton 
            miningActive={miningActive}
            miningTime={miningTime}
            onButtonClick={handleButtonClick}
          />
        </div>
        
        {/* Mining Rate Display */}
        <div className="mt-5 bg-darkPurple-900/50 backdrop-blur-sm rounded-lg border border-darkPurple-700/30 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-purple-600/20 flex items-center justify-center">
              <Zap className="h-4 w-4 text-purple-400" />
            </div>
            <span className="text-sm font-medium text-purple-200">Mining Rate</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-right">
              <span className="text-md font-bold text-purple-300">0.1 NC</span>
              <span className="text-xs text-purple-400 ml-1">per minute</span>
            </div>
            <div className="text-xs text-purple-500/80 mt-0.5">
              {(miningRate * 60).toFixed(1)} NC/hour
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

MiningCard.displayName = "MiningCard";

export default MiningCard;
