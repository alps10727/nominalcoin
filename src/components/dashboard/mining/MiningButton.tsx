
import React, { useState, useCallback } from "react";
import { OrbitalEffects } from "./button/OrbitalEffects";
import { ParticleEffects } from "./button/ParticleEffects";
import { ButtonBackground } from "./button/ButtonBackground";
import { ButtonContent } from "./button/ButtonContent";
import { MiningButtonBase } from "./button/MiningButtonBase";
import { formatTimeDisplay } from "@/utils/miningUtils";

interface MiningButtonProps {
  miningActive: boolean;
  miningTime: number;
  onButtonClick: () => void;
  adLoading?: boolean;
}

export const MiningButton: React.FC<MiningButtonProps> = ({ 
  miningActive, 
  miningTime, 
  onButtonClick,
  adLoading = false
}) => {
  const [displayTime, setDisplayTime] = useState("");
  const [buttonHovered, setButtonHovered] = useState(false);
  
  // Format and update time display
  React.useEffect(() => {
    setDisplayTime(formatTimeDisplay(miningTime));
  }, [miningTime]);
  
  // Only allow starting mining, not stopping
  const handleClick = useCallback(() => {
    if (!miningActive && !adLoading) {
      onButtonClick();
    }
  }, [miningActive, adLoading, onButtonClick]);
  
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
      {buttonHovered && !miningActive && !adLoading && (
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
        disabled={miningActive || adLoading} // Button is disabled when mining is active or ad is loading
        className={adLoading ? "animate-pulse" : ""}
      >
        {/* Background layers */}
        <ButtonBackground miningActive={miningActive} adLoading={adLoading} />
        
        {/* Content (text, icon) */}
        <ButtonContent 
          miningActive={miningActive} 
          displayTime={displayTime} 
          adLoading={adLoading}
        />
      </MiningButtonBase>
      
      {/* Info text when mining is active */}
      {miningActive && (
        <div className="absolute top-full left-0 right-0 text-xs text-purple-400/80 text-center mt-2">
          Madencilik işlemi devam ediyor. 6 saat sonunda otomatik olarak duracak.
        </div>
      )}
      
      {/* Info text when ad is loading */}
      {adLoading && (
        <div className="absolute top-full left-0 right-0 text-xs text-amber-400/80 text-center mt-2 animate-pulse">
          Reklam yükleniyor, lütfen bekleyin...
        </div>
      )}
    </div>
  );
};

MiningButton.displayName = "MiningButton";
