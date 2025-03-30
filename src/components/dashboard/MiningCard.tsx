
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
    <Card className="mb-6 border border-purple-500/20 overflow-hidden shadow-xl transition-all duration-500 relative group bg-gradient-to-br from-darkPurple-900/90 via-navy-900/90 to-darkPurple-900/90 rounded-xl hover:shadow-[0_0_25px_rgba(147,51,234,0.15)]">
      {/* Enhanced background with dynamic elements */}
      <MiningBackground />
      
      {/* Improved particles animation */}
      <MiningParticles miningActive={miningActive} />
      
      {/* Header with improved design */}
      <CardHeader className={`relative z-10 ${isMobile ? "px-4 py-3" : ""} text-white`}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/40 to-indigo-600/40 backdrop-blur-md border border-purple-400/30 shadow-sm">
              <Flame className="h-5 w-5 text-purple-200" />
            </div>
            <span className="bg-gradient-to-r from-purple-100 to-indigo-200 bg-clip-text text-transparent font-sans">Mining Lab</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-purple-500/30 backdrop-blur-sm border border-purple-400/20 shadow-sm">
              <Layers className="h-4 w-4 text-purple-200" />
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
      
      {/* Card content with improved progress indicator */}
      <CardContent className={`relative z-10 ${isMobile ? "px-4 pb-4" : ""}`}>
        <div className="mb-6 mt-2">
          <div className="h-2.5 w-full bg-darkPurple-800/80 rounded-full overflow-hidden backdrop-blur-sm border border-purple-500/10">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-400 rounded-full transition-all duration-500 relative"
              style={{ width: `${progress * 100}%` }}
            >
              {/* Animated sheen effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-flow"></div>
            </div>
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
            {/* Enhanced mining button component */}
            <MiningButton 
              miningActive={miningActive}
              miningTime={miningTime}
              onButtonClick={handleButtonClick}
            />
          </div>
        </div>
      </CardContent>
      
      {/* Enhanced footer with mining stats */}
      <MiningCardFooter 
        miningSession={miningSession}
        miningRate={miningRate}
      />
    </Card>
  );
};

export default MiningCard;
