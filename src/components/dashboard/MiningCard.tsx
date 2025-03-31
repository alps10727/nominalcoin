
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
    <Card className="mb-6 border border-gray-700/30 overflow-hidden shadow-xl transition-all duration-500 relative group bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-xl hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]">
      {/* Background */}
      <MiningBackground />
      
      {/* Particles */}
      <MiningParticles miningActive={miningActive} />
      
      {/* Header */}
      <CardHeader className={`relative z-10 ${isMobile ? "px-4 py-3" : ""} text-white`}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-600/30 backdrop-blur-md border border-blue-400/20 shadow-sm">
              <Flame className="h-5 w-5 text-blue-200" />
            </div>
            <span className="bg-gradient-to-r from-gray-100 to-blue-200 bg-clip-text text-transparent font-sans">Mining Lab</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-blue-500/20 backdrop-blur-sm border border-blue-400/20 shadow-sm">
              <Layers className="h-4 w-4 text-blue-200" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-blue-200">Power</span>
              <span className="text-sm font-bold text-blue-200">{(miningRate * 100).toFixed(2)}%</span>
            </div>
          </div>
        </div>
        <CardDescription className="text-blue-200/80 mt-2 font-light">
          Mine cryptocurrency with your device's computing power
        </CardDescription>
      </CardHeader>
      
      {/* Content */}
      <CardContent className={`relative z-10 ${isMobile ? "px-4 pb-4" : ""}`}>
        <div className="mb-6 mt-2">
          <div className="h-2.5 w-full bg-gray-800/80 rounded-full overflow-hidden backdrop-blur-sm border border-blue-500/10">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-400 rounded-full transition-all duration-500 relative"
              style={{ width: `${progress * 100}%` }}
            >
              {/* Animated sheen effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-flow"></div>
            </div>
          </div>
          {miningActive && (
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-blue-300/80">Progress</span>
              <span className="text-xs text-blue-300 font-medium">{(progress * 100).toFixed(1)}%</span>
            </div>
          )}
        </div>
      
        <div className="text-center my-8">
          <div className="relative mx-auto">
            <MiningButton 
              miningActive={miningActive}
              miningTime={miningTime}
              onButtonClick={handleButtonClick}
            />
          </div>
        </div>
      </CardContent>
      
      <MiningCardFooter 
        miningSession={miningSession}
        miningRate={miningRate}
      />
    </Card>
  );
};

export default MiningCard;
