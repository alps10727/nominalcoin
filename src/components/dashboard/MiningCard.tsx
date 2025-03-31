
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Layers } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { MiningBackground } from "../mining/MiningBackground";
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
    <Card className="mb-6 border border-indigo-800/20 overflow-hidden shadow-md transition-all duration-300 relative rounded-xl">
      {/* Background */}
      <MiningBackground />
      
      {/* Header */}
      <CardHeader className={`relative z-10 ${isMobile ? "px-4 py-3" : ""} text-white`}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="p-2 rounded-lg bg-navy-700/60 backdrop-blur-sm border border-navy-600/20">
              <Flame className="h-5 w-5 text-indigo-200" />
            </div>
            <span className="text-white font-sans">Cosmic Miner</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-navy-700/60 backdrop-blur-sm border border-navy-600/20">
              <Layers className="h-4 w-4 text-indigo-200" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-indigo-200">Power</span>
              <span className="text-sm font-bold text-indigo-200">{(miningRate * 100).toFixed(2)}%</span>
            </div>
          </div>
        </div>
        <CardDescription className="text-indigo-200/80 mt-2 font-light">
          Mine cryptocurrency with quantum computing power
        </CardDescription>
      </CardHeader>
      
      {/* Content */}
      <CardContent className={`relative z-10 ${isMobile ? "px-4 pb-4" : ""}`}>
        <div className="mb-6 mt-2">
          <div className="h-2.5 w-full bg-navy-800/80 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            ></div>
          </div>
          {miningActive && (
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-indigo-300/80">Progress</span>
              <span className="text-xs text-indigo-300 font-medium">{(progress * 100).toFixed(1)}%</span>
            </div>
          )}
        </div>
      
        <div className="text-center my-8">
          <MiningButton 
            miningActive={miningActive}
            miningTime={miningTime}
            onButtonClick={handleButtonClick}
          />
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
