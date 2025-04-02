
import React, { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { MiningButton } from "./mining/MiningButton";
import { MiningProgressBar } from "./mining/MiningProgressBar";
import { Diamond, Zap, Clock, BarChart } from "lucide-react";
import { MiningParticles } from "./mining/MiningParticles";

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

  // Quick stats for display
  const hourlyRate = (miningRate * 20).toFixed(1); // 20 cycles per hour (3 mins each)

  return (
    <Card className="border-0 bg-gradient-to-b from-purple-900/80 via-darkPurple-900/80 to-darkPurple-950/80 overflow-hidden shadow-md transition-all duration-300 relative rounded-xl backdrop-blur-sm hover-lift group">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-galaxy opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full fc-nebula opacity-30"></div>
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-600/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl transform -translate-x-1/4 translate-y-1/4"></div>
      
      {/* Animated particles when mining */}
      <MiningParticles miningActive={miningActive} />
      
      {/* Content */}
      <CardContent className={`relative z-10 ${isMobile ? "px-4 py-5" : "px-6 py-6"}`}>
        {/* Header with info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="fc-icon-container">
              <Zap className="text-purple-300 h-4 w-4" />
            </div>
            <span className="text-lg font-medium text-white">FC Mining</span>
          </div>
          
          {miningActive && (
            <div className="flex items-center bg-purple-800/40 text-purple-200 text-xs px-2 py-1 rounded-full border border-purple-600/30 animate-pulse-slow">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5"></span>
              Active
            </div>
          )}
        </div>
        
        {/* Mining info */}
        <div className="mb-6">
          <p className="text-purple-300/80 text-sm">
            {miningActive 
              ? `Mining at ${hourlyRate} FC/hour` 
              : "Start mining to earn Future Coin"}
          </p>
          
          {/* Progress bar - only shown when active */}
          {miningActive && <MiningProgressBar progress={progress} miningActive={miningActive} />}
        </div>
      
        {/* Mining button */}
        <div className="text-center my-6 perspective-800">
          <MiningButton 
            miningActive={miningActive}
            miningTime={miningTime}
            onButtonClick={handleButtonClick}
          />
        </div>
      
        {/* Live mining stats - only shown when active */}
        {miningActive && (
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="bg-darkPurple-800/40 p-3 rounded-lg border border-purple-700/20">
              <div className="flex items-center text-xs text-purple-300 mb-1">
                <Clock className="h-3 w-3 mr-1" />
                Session Time
              </div>
              <div className="text-sm font-semibold text-white">
                {Math.floor(miningTime / 60)}m {miningTime % 60}s
              </div>
            </div>
            <div className="bg-darkPurple-800/40 p-3 rounded-lg border border-purple-700/20">
              <div className="flex items-center text-xs text-purple-300 mb-1">
                <Diamond className="h-3 w-3 mr-1" />
                Session Earned
              </div>
              <div className="text-sm font-semibold text-white">
                +{miningSession.toFixed(2)} FC
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

MiningCard.displayName = "MiningCard";

export default MiningCard;
