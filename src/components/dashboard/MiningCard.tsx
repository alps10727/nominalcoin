
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gem } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { MiningBackground } from "./mining/MiningBackground";
import { MiningParticles } from "./mining/MiningParticles";
import { MiningButton } from "./mining/MiningButton";
import { MiningCardFooter } from "./mining/MiningCardFooter";

interface MiningCardProps {
  miningActive: boolean;
  progress: number;
  miningRate: number;
  miningSession: number;
  miningTime: number;
  onStartMining: () => void;
  onStopMining: () => void;
}

const MiningCard = ({
  miningActive,
  progress,
  miningRate,
  miningSession,
  miningTime,
  onStartMining,
  onStopMining
}: MiningCardProps) => {
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
    <Card className="mb-6 border border-darkPurple-700/30 overflow-hidden shadow-xl transition-all duration-500 relative group">
      {/* Background elements */}
      <MiningBackground />
      
      {/* Particles */}
      <MiningParticles miningActive={miningActive} />
      
      <CardHeader className={`relative z-10 ${isMobile ? "px-4 py-3" : ""} text-white`}>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
          <Gem className="h-5 w-5 text-darkPurple-300" />
          <span className="text-shadow">NC Mining</span>
        </CardTitle>
        <CardDescription className="text-gray-300">
          Mine to earn NOMINAL Coin cryptocurrency
        </CardDescription>
      </CardHeader>
      
      <CardContent className={`relative z-10 ${isMobile ? "px-4 py-2" : ""}`}>
        <div className="text-center mb-6">
          <div className="relative mx-auto">
            {/* Mining button component */}
            <MiningButton 
              miningActive={miningActive}
              miningTime={miningTime}
              onButtonClick={handleButtonClick}
            />
          </div>
        </div>
      </CardContent>
      
      {/* Footer with mining stats */}
      <MiningCardFooter 
        miningSession={miningSession}
        miningRate={miningRate}
      />
    </Card>
  );
};

export default MiningCard;
