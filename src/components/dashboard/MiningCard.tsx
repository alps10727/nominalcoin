
import React, { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
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
  
  const handleButtonClick = useCallback(async () => {
    if (miningActive) {
      onStopMining();
      return;
    }
    
    debugLog('MiningCard', 'Starting mining directly');
    onStartMining();
    
  }, [miningActive, onStartMining, onStopMining]);

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
        </div>
      
        {miningActive && (
          <MiningStats 
            miningTime={miningTime}
            miningSession={miningSession}
          />
        )}
      </CardContent>
    </Card>
  );
});

MiningCard.displayName = "MiningCard";

export default MiningCard;
