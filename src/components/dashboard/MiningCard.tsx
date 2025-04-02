
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
    <Card className="border-0 overflow-hidden shadow-lg transition-all duration-300 relative rounded-xl backdrop-blur-sm group
                  bg-gradient-to-b from-darkPurple-950/90 via-navy-950/90 to-darkPurple-950/90 
                  hover:shadow-deep-glow hover:from-darkPurple-950/95 hover:via-navy-950/95 hover:to-darkPurple-950/95
                  border border-purple-900/30">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-galaxy opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full fc-deep-nebula opacity-20"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-700/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-700/5 rounded-full blur-2xl transform -translate-x-1/4 translate-y-1/4"></div>
      
      {/* Animated particles when mining */}
      <MiningParticles miningActive={miningActive} />
      
      {/* Hexagon grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      
      {/* Subtle top border glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-700/30 to-transparent"></div>
      
      {/* Content */}
      <CardContent className={`relative z-10 ${isMobile ? "px-4 py-5" : "px-6 py-6"}`}>
        {/* Header with info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-darkPurple-800/20 to-navy-800/20 
                         border border-darkPurple-700/30 shadow-inner">
              <Zap className="text-purple-400 h-4 w-4" />
            </div>
            <span className="text-lg font-medium text-white">FC Mining</span>
          </div>
          
          {miningActive && (
            <div className="flex items-center bg-purple-900/40 text-purple-300 text-xs px-2 py-1 rounded-full 
                         border border-purple-700/30 animate-pulse-slow shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse"></span>
              Active
            </div>
          )}
        </div>
        
        {/* Mining info with enhanced styling */}
        <div className="mb-6">
          <p className="text-purple-400/90 text-sm">
            {miningActive 
              ? `Mining at ${hourlyRate} FC/hour` 
              : "Start mining to earn Future Coin"}
          </p>
          
          {/* Progress bar - only shown when active */}
          {miningActive && <MiningProgressBar progress={progress} miningActive={miningActive} />}
        </div>
      
        {/* Mining button - main interaction point */}
        <div className="text-center my-6 perspective-1000">
          <MiningButton 
            miningActive={miningActive}
            miningTime={miningTime}
            onButtonClick={handleButtonClick}
          />
        </div>
      
        {/* Live mining stats - enhanced only shown when active */}
        {miningActive && (
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="bg-darkPurple-900/40 p-3 rounded-lg border border-purple-800/20 backdrop-blur-sm 
                        hover:bg-darkPurple-900/50 transition-all duration-300 group">
              <div className="flex items-center text-xs text-purple-400 mb-1">
                <Clock className="h-3 w-3 mr-1 group-hover:text-purple-300 transition-colors" />
                Session Time
              </div>
              <div className="text-sm font-semibold text-white">
                {Math.floor(miningTime / 60)}m {miningTime % 60}s
              </div>
            </div>
            <div className="bg-darkPurple-900/40 p-3 rounded-lg border border-purple-800/20 backdrop-blur-sm 
                        hover:bg-darkPurple-900/50 transition-all duration-300 group">
              <div className="flex items-center text-xs text-purple-400 mb-1">
                <Diamond className="h-3 w-3 mr-1 group-hover:text-purple-300 transition-colors" />
                Session Earned
              </div>
              <div className="text-sm font-semibold text-white">
                +{miningSession.toFixed(2)} FC
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced inactive state description */}
        {!miningActive && (
          <div className="mt-4 text-center">
            <p className="text-xs text-purple-400/70 max-w-xs mx-auto leading-relaxed">
              Earn Future Coin by mining with your device. The longer you mine, the more FC you'll earn.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

MiningCard.displayName = "MiningCard";

export default MiningCard;
