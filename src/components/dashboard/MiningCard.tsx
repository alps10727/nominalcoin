
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
    <Card className="mb-4 border border-darkPurple-800/30 overflow-hidden shadow-md transition-all duration-300 relative rounded-xl backdrop-blur-sm">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-darkPurple-900 via-navy-900 to-darkPurple-900 opacity-90"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-indigo-600/5"></div>
      
      {/* Animated particles in background */}
      <div className="absolute inset-0 overflow-hidden">
        {miningActive && (
          <>
            <div className="absolute h-1 w-1 bg-purple-400/40 rounded-full animate-float-1" style={{top: '20%', left: '10%'}}></div>
            <div className="absolute h-1 w-1 bg-indigo-400/40 rounded-full animate-float-2" style={{top: '70%', left: '80%', animationDelay: '1s'}}></div>
            <div className="absolute h-1 w-1 bg-purple-400/40 rounded-full animate-float-3" style={{top: '40%', left: '70%', animationDelay: '0.5s'}}></div>
            <div className="absolute h-1 w-1 bg-indigo-400/40 rounded-full animate-float-1" style={{top: '80%', left: '30%', animationDelay: '1.5s'}}></div>
          </>
        )}
      </div>
      
      {/* Content */}
      <CardContent className={`relative z-10 ${isMobile ? "px-4 py-4" : "px-6 py-6"}`}>
        <MiningProgressBar progress={progress} miningActive={miningActive} />
      
        <div className="text-center my-4">
          <MiningButton 
            miningActive={miningActive}
            miningTime={miningTime}
            onButtonClick={handleButtonClick}
          />
        </div>
        
        {/* Mining statistics */}
        <div className="mt-5 flex justify-between items-center">
          <div className="text-center flex-1">
            <p className="text-sm text-gray-400 mb-1">Rate</p>
            <p className="text-lg font-bold text-white flex items-center justify-center">
              <span className="flex items-center gap-1">
                <span className="text-purple-300">{miningRate.toFixed(2)}</span>
                <span className="text-xs text-gray-400">NC/min</span>
              </span>
            </p>
          </div>
          
          {miningActive && (
            <div className="text-center flex-1">
              <p className="text-sm text-gray-400 mb-1">Session</p>
              <p className="text-lg font-bold text-white">
                <span className="text-purple-300">+{miningSession.toFixed(1)}</span>
                <span className="text-xs text-gray-400 ml-1">NC</span>
              </p>
            </div>
          )}
          
          <div className="text-center flex-1">
            <p className="text-sm text-gray-400 mb-1">Status</p>
            <div className="flex items-center justify-center">
              <span className={`inline-block h-2 w-2 rounded-full mr-2 ${miningActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
              <span className={`text-sm font-medium ${miningActive ? 'text-green-400' : 'text-gray-400'}`}>
                {miningActive ? 'Mining' : 'Idle'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

MiningCard.displayName = "MiningCard";

export default MiningCard;
