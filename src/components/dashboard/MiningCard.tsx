import React, { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { MiningButton } from "./mining/MiningButton";
import { MiningProgressBar } from "./mining/MiningProgressBar";
import { Diamond, Zap, Clock, BarChart, AlertCircle } from "lucide-react";
import { MiningParticles } from "./mining/MiningParticles";
import { useAdMob } from '@/hooks/useAdMob';
import { toast } from 'sonner';

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
  const { showRewardAd } = useAdMob();
  
  const handleButtonClick = React.useCallback(async () => {
    if (miningActive) {
      console.log("Mining is already active, ignoring click");
      return;
    }
    
    try {
      if (typeof window !== 'undefined' && window.Capacitor) {
        const rewarded = await showRewardAd();
        if (rewarded) {
          onStartMining();
        }
      } else {
        onStartMining();
      }
    } catch (error) {
      console.error("Error during mining start process:", error);
    }
  }, [miningActive, onStartMining, showRewardAd]);

  const hourlyRate = (miningRate * 60).toFixed(1);

  return (
    <Card className="border-0 overflow-hidden shadow-lg transition-all duration-300 relative rounded-xl backdrop-blur-sm group
                  bg-gradient-to-b from-navy-950 via-darkPurple-950 to-navy-950 
                  hover:shadow-deep-glow hover:from-navy-950 hover:via-darkPurple-950 hover:to-navy-950
                  border border-purple-950/30">
      <div className="absolute inset-0 bg-galaxy opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full fc-deep-nebula opacity-20"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-800/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-800/5 rounded-full blur-2xl transform -translate-x-1/4 translate-y-1/4"></div>
      
      <MiningParticles miningActive={miningActive} />
      
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-800/25 to-transparent"></div>
      
      <CardContent className={`relative z-10 ${isMobile ? "px-4 py-5" : "px-6 py-6"}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-darkPurple-900/20 to-navy-900/20 
                         border border-darkPurple-800/20 shadow-inner">
              <Zap className="text-purple-400 h-4 w-4" />
            </div>
            <span className="text-lg font-medium text-white">FC Mining</span>
          </div>
          
          {miningActive && (
            <div className="flex items-center bg-purple-900/30 text-purple-300 text-xs px-2 py-1 rounded-full 
                         border border-purple-800/20 animate-pulse-slow shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse"></span>
              Active
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <p className="text-purple-400/80 text-sm">
            {miningActive 
              ? `Mining at ${hourlyRate} FC/hour` 
              : "Start mining to earn Future Coin"}
          </p>
          
          {miningActive && <MiningProgressBar progress={progress} miningActive={miningActive} />}
        </div>
      
        <div className="text-center my-6 perspective-1000">
          <MiningButton 
            miningActive={miningActive}
            miningTime={miningTime}
            onButtonClick={handleButtonClick}
          />
        </div>
      
        {miningActive && (
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="bg-darkPurple-950/60 p-3 rounded-lg border border-purple-900/15 backdrop-blur-sm 
                        hover:bg-darkPurple-950/80 transition-all duration-300 group">
              <div className="flex items-center text-xs text-purple-400/80 mb-1">
                <Clock className="h-3 w-3 mr-1 group-hover:text-purple-300 transition-colors" />
                Kalan Süre
              </div>
              <div className="text-sm font-semibold text-white">
                {Math.floor(miningTime / 60)}m {miningTime % 60}s
              </div>
            </div>
            <div className="bg-navy-950/60 p-3 rounded-lg border border-purple-900/15 backdrop-blur-sm 
                        hover:bg-navy-950/80 transition-all duration-300 group">
              <div className="flex items-center text-xs text-purple-400/80 mb-1">
                <Diamond className="h-3 w-3 mr-1 group-hover:text-purple-300 transition-colors" />
                Kazanılan
              </div>
              <div className="text-sm font-semibold text-white">
                +{miningSession.toFixed(2)} FC
              </div>
            </div>
          </div>
        )}
        
        {!miningActive && (
          <div className="mt-4 text-center">
            <p className="text-xs text-purple-400/60 max-w-xs mx-auto leading-relaxed">
              Madenciliği başlatmak için butona tıklayın. 6 saat boyunca FC kazanacaksınız.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

MiningCard.displayName = "MiningCard";

export default MiningCard;
