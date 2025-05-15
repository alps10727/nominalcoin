
import React, { useState, useCallback } from "react";
import { OrbitalEffects } from "./button/OrbitalEffects";
import { ParticleEffects } from "./button/ParticleEffects";
import { ButtonBackground } from "./button/ButtonBackground";
import { ButtonContent } from "./button/ButtonContent";
import { MiningButtonBase } from "./button/MiningButtonBase";
import { formatTimeDisplay } from "@/utils/miningUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { useAdMob } from "@/hooks/useAdMob";

interface MiningButtonProps {
  miningActive: boolean;
  miningTime: number;
  onButtonClick: () => void;
}

export const MiningButton: React.FC<MiningButtonProps> = ({ 
  miningActive, 
  miningTime, 
  onButtonClick 
}) => {
  const [displayTime, setDisplayTime] = useState("");
  const [buttonHovered, setButtonHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const { showRewardedAd, adMobSupported } = useAdMob();
  
  // Format and update time display
  React.useEffect(() => {
    setDisplayTime(formatTimeDisplay(miningTime));
  }, [miningTime]);
  
  // Enhanced click handler that shows an ad before starting mining
  const handleClick = useCallback(async () => {
    if (miningActive || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const adShown = await showRewardedAd(() => {
        // This callback is executed when the ad completes or isn't available
        onButtonClick();
      });
      
      // If ad couldn't be shown on a supported platform, show message
      if (!adShown && adMobSupported) {
        toast.error(t("mining.adLoadError") || "Reklam yüklenemedi, lütfen daha sonra tekrar deneyin");
      }
    } catch (error) {
      console.error("Error showing ad:", error);
    } finally {
      setIsLoading(false);
    }
  }, [miningActive, onButtonClick, showRewardedAd, adMobSupported, t, isLoading]);
  
  // Optimized hover handlers with useCallback
  const handleMouseEnter = useCallback(() => {
    setButtonHovered(true);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setButtonHovered(false);
  }, []);

  return (
    <div className="relative perspective-800">
      {/* Enhanced button glow effect when hovered */}
      {buttonHovered && !miningActive && (
        <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      )}
      
      {/* Particle floating effects */}
      <ParticleEffects miningActive={miningActive} />
      
      {/* Orbital rotating elements */}
      <OrbitalEffects miningActive={miningActive} />
      
      {/* Button with all its layers */}
      <MiningButtonBase 
        miningActive={miningActive} 
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={miningActive || isLoading} // Button is disabled when mining is active or loading
      >
        {/* Background layers */}
        <ButtonBackground miningActive={miningActive} />
        
        {/* Content (text, icon) */}
        <ButtonContent 
          miningActive={miningActive} 
          displayTime={displayTime} 
          isLoading={isLoading}
        />
      </MiningButtonBase>
      
      {/* Info text when mining is active */}
      {miningActive && (
        <div className="absolute top-full left-0 right-0 text-xs text-purple-400/80 text-center mt-2">
          {t("mining.activeInfo") || "Mining process is ongoing. It will automatically stop after 6 hours."}
        </div>
      )}
      
      {/* Info text about rewarded ads */}
      {!miningActive && !isLoading && (
        <div className="absolute top-full left-0 right-0 text-xs text-purple-400/80 text-center mt-2">
          {t("mining.adInfo") || "Watch an ad to start mining and earn bonus rewards"}
        </div>
      )}
    </div>
  );
};

MiningButton.displayName = "MiningButton";
