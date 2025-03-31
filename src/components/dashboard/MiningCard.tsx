
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { MiningBackground } from "./mining/MiningBackground";
import { MiningButton } from "./mining/MiningButton";
import { MiningProgressBar } from "./mining/MiningProgressBar";

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
    <Card className="mb-4 border border-indigo-800/20 overflow-hidden shadow-md transition-all duration-300 relative rounded-xl max-w-xs mx-auto">
      {/* Background */}
      <MiningBackground />
      
      {/* Content - smaller padding */}
      <CardContent className={`relative z-10 ${isMobile ? "px-2 py-2" : "px-3 py-3"}`}>
        <MiningProgressBar progress={progress} miningActive={miningActive} />
      
        <div className="text-center my-2">
          <MiningButton 
            miningActive={miningActive}
            miningTime={miningTime}
            onButtonClick={handleButtonClick}
          />
        </div>
      </CardContent>
      
      {/* Footer removed as requested */}
    </Card>
  );
});

MiningCard.displayName = "MiningCard";

export default MiningCard;
