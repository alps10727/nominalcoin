
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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  const { 
    showRewardAd, 
    isLoading: adLoading, 
    preloadNextAd, 
    isInitialized,
    pluginAvailable 
  } = useAdMob();
  
  const [isAttemptingToStart, setIsAttemptingToStart] = useState(false);
  
  useEffect(() => {
    console.log("MiningCard - AdMob info:");
    console.log("- Is Capacitor available:", typeof window !== 'undefined' && !!window.Capacitor);
    if (typeof window !== 'undefined' && window.Capacitor) {
      console.log("- Capacitor platform:", window.Capacitor.getPlatform());
      console.log("- Is @capacitor-community/admob plugin available:", 
                 window.Capacitor.isPluginAvailable('@capacitor-community/admob'));
      console.log("- Plugin status (from hook):", pluginAvailable);
      console.log("- AdMob initialized:", isInitialized);
    }
  }, [pluginAvailable, isInitialized]);
  
  useEffect(() => {
    if (!miningActive && isInitialized && pluginAvailable) {
      debugLog('MiningCard', 'Preloading ad initially');
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
        
        // Add a notification for visibility
        toast.info(t("mining.adLoading") || "Loading advertisement...", { duration: 3000 });
        
        const rewarded = await showRewardAd();
        console.log('Ad display result:', rewarded);
        
        if (rewarded) {
          debugLog('MiningCard', 'Ad successful, starting mining');
          onStartMining();
          setTimeout(preloadNextAd, 1000);
          toast.success(t("mining.adCompleted") || "Advertisement completed successfully", { duration: 2000 });
        } else {
          debugLog('MiningCard', 'Ad was not rewarded or could not be displayed');
          toast.error(t("mining.adFailed") || "Failed to complete ad viewing. Please try again.", {
            duration: 3000
          });
          setIsAttemptingToStart(false);
          return;
        }
      } else {
        // Start directly when no Capacitor/AdMob (Development mode)
        debugLog('MiningCard', 'Not mobile or plugin not available, starting mining directly');
        console.log('Development mode - starting without ads');
        toast.info(t("mining.devModeStart") || "Development mode - starting without ads", { duration: 2000 });
        onStartMining();
      }
    } catch (error) {
      console.error('Error in mining start process:', error);
      toast.error(t("mining.adError") || "Error showing advertisement. Please try again.", {
        duration: 3000
      });
    } finally {
      setIsAttemptingToStart(false);
    }
  }, [miningActive, onStartMining, onStopMining, showRewardAd, preloadNextAd, pluginAvailable, t]);

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
              ? t("mining.miningRate", (miningRate * 60).toFixed(1)) || `Mining at ${(miningRate * 60).toFixed(1)} NC/hour` 
              : t("mining.startPrompt") || "Start mining to earn Nominal Coin"}
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
              {t("mining.adLoadingWait") || "Loading advertisement, please wait..."}
            </div>
          )}
        </div>
      
        {miningActive && (
          <MiningStats 
            miningTime={miningTime}
            miningSession={miningSession}
          />
        )}
        
        {!miningActive && !adLoading && !isAttemptingToStart && pluginAvailable && (
          <div className="mt-4 text-center">
            <p className="text-xs text-purple-300/70">
              {t("mining.adRequirement") || "You need to watch an ad to start mining"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

MiningCard.displayName = "MiningCard";

export default MiningCard;
