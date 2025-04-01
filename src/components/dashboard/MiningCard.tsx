
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { MiningButton } from "./mining/MiningButton";
import { MiningProgressBar } from "./mining/MiningProgressBar";
import { Diamond } from "lucide-react";

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
    if (miningActive) {
      onStopMining();
    } else {
      onStartMining();
    }
  }, [miningActive, onStartMining, onStopMining]);

  return (
    <Card className="border-0 bg-purple-900/80 overflow-hidden shadow-md transition-all duration-300 relative rounded-xl backdrop-blur-sm">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-purple-950/50"></div>
      
      {/* Content */}
      <CardContent className={`relative z-10 ${isMobile ? "px-4 py-4" : "px-6 py-6"}`}>
        <div className="flex items-center mb-4">
          <div className="p-1.5 mr-2">
            <Diamond className="text-purple-300 h-5 w-5" />
          </div>
          <span className="text-purple-300 font-medium text-lg">FC Mining</span>
        </div>
        
        <p className="text-purple-300/80 text-sm text-center mb-6">
          Mine to earn Future Coin cryptocurrency
        </p>
      
        <div className="text-center my-6">
          <MiningButton 
            miningActive={miningActive}
            miningTime={miningTime}
            onButtonClick={handleButtonClick}
          />
        </div>
      </CardContent>
    </Card>
  );
});

MiningCard.displayName = "MiningCard";

export default MiningCard;
