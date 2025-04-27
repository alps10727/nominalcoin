import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAdMob } from '@/hooks/useAdMob';
import { toast } from "sonner";
import { debugLog } from "@/utils/debugUtils";
import { MiningButton } from "./mining/MiningButton";
import { MiningProgressBar } from "./mining/MiningProgressBar";
import { MiningParticles } from "./mining/MiningParticles";
import { MiningCardHeader } from "./mining/MiningCardHeader";
import { MiningStats } from "./mining/MiningStats";
import { MiningBackground } from "./mining/MiningBackground";

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
  const { 
    showRewardAd, 
    isLoading: adLoading, 
    preloadNextAd, 
    isInitialized,
    pluginAvailable 
  } = useAdMob();
  
  const [isAttemptingToStart, setIsAttemptingToStart] = useState(false);
  
  useEffect(() => {
    if (!miningActive && isInitialized && pluginAvailable) {
      debugLog('MiningCard', 'Preloading ad on component mount');
      preloadNextAd();
    }
  }, [miningActive, isInitialized, pluginAvailable, preloadNextAd]);
  
  const handleButtonClick = useCallback(async () => {
    if (miningActive) {
      onStopMining();
      return;
    }
    
    setIsAttemptingToStart(true);
    debugLog('MiningCard', `Handling button click. Capacitor available: ${!!window.Capacitor}, Plugin available: ${pluginAvailable}`);
    
    try {
      if (typeof window !== 'undefined' && window.Capacitor && pluginAvailable) {
        debugLog('MiningCard', 'Attempting to show AdMob reward ad');
        
        const rewarded = await showRewardAd();
        
        if (rewarded) {
          debugLog('MiningCard', 'Ad reward successful, starting mining');
          onStartMining();
          setTimeout(preloadNextAd, 1000);
        } else {
          debugLog('MiningCard', 'Ad not rewarded or could not be shown');
          toast.error("Reklam izleme tamamlanamadı. Lütfen tekrar deneyin.", {
            duration: 3000
          });
          setIsAttemptingToStart(false);
          return;
        }
      } else {
        debugLog('MiningCard', 'Not on mobile or plugin not available, starting mining directly');
        onStartMining();
      }
    } catch (error) {
      console.error('Error in mining start process:', error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.", {
        duration: 3000
      });
    } finally {
      setIsAttemptingToStart(false);
    }
  }, [miningActive, onStartMining, onStopMining, showRewardAd, preloadNextAd, pluginAvailable]);

  const hourlyRate = (miningRate * 60).toFixed(1);

  return (
    <Card className="border-0 overflow-hidden shadow-lg transition-all duration-300 relative rounded-xl backdrop-blur-sm group
                  bg-gradient-to-b from-navy-950 via-darkPurple-950 to-navy-950 
                  hover:shadow-deep-glow hover:from-navy-950 hover:via-darkPurple-950 hover:to-navy-950
                  border border-purple-950/30">
      <MiningBackground />
      
      <MiningParticles miningActive={miningActive} />
      
      <CardContent className={`relative z-10 ${isMobile ? "px-4 py-5" : "px-6 py-6"}`}>
        <MiningCardHeader 
          miningActive={miningActive}
          isMobile={isMobile}
        />
        
        <div className="mb-6">
          <p className="text-purple-400/80 text-sm">
            {miningActive 
              ? `Mining at ${hourlyRate} NC/hour` 
              : "Start mining to earn Nominal Coin"}
          </p>
          
          {miningActive && <MiningProgressBar progress={progress} miningActive={miningActive} />}
        </div>
      
        <div className="text-center my-6 perspective-1000">
          <MiningButton 
            miningActive={miningActive}
            miningTime={miningTime}
            onButtonClick={handleButtonClick}
          />
          
          {(!miningActive && (adLoading || isAttemptingToStart)) && (
            <div className="mt-2 text-sm text-purple-300 animate-pulse">
              Reklam yükleniyor, lütfen bekleyin...
            </div>
          )}
        </div>
      
        {miningActive && (
          <MiningStats 
            miningTime={miningTime}
            miningSession={miningSession}
          />
        )}
        
        {!miningActive && !adLoading && !isAttemptingToStart && (
          <div className="mt-4 text-center">
          </div>
        )}
      </CardContent>
    </Card>
  );
});

MiningCard.displayName = "MiningCard";

export default MiningCard;
