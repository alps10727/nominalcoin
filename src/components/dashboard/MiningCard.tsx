
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Layers } from "lucide-react";
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
    <Card className="mb-6 border border-purple-500/20 overflow-hidden shadow-lg transition-all duration-500 relative group bg-gradient-to-br from-darkPurple-900/90 via-navy-900/90 to-darkPurple-900/90 rounded-xl">
      {/* Background elements */}
      <MiningBackground />
      
      {/* Particles */}
      <MiningParticles miningActive={miningActive} />
      
      <CardHeader className={`relative z-10 ${isMobile ? "px-4 py-3" : ""} text-white`}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/30 to-indigo-600/30 backdrop-blur-md border border-purple-400/20">
              <Flame className="h-5 w-5 text-purple-300" />
            </div>
            <span className="bg-gradient-to-r from-purple-100 to-indigo-200 bg-clip-text text-transparent font-sans">Mining Lab</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/20 backdrop-blur-sm border border-purple-400/10">
              <Layers className="h-4 w-4 text-purple-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-purple-200">Power</span>
              <span className="text-sm font-bold text-purple-200">{(miningRate * 100).toFixed(2)}%</span>
            </div>
          </div>
        </div>
        <CardDescription className="text-purple-200/80 mt-2 font-light">
          Mine cryptocurrency with your device's computing power
        </CardDescription>
      </CardHeader>
      
      <CardContent className={`relative z-10 ${isMobile ? "px-4 pb-4" : ""}`}>
        {/* Progress indicator */}
        <div className="mb-6 mt-2">
          <div className="h-2 w-full bg-darkPurple-800 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            ></div>
          </div>
          {miningActive && (
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-purple-300/80">Progress</span>
              <span className="text-xs text-purple-300 font-medium">{(progress * 100).toFixed(1)}%</span>
            </div>
          )}
        </div>
      
        <div className="text-center my-8">
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
