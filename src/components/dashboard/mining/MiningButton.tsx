
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
}

export const MiningButton: React.FC<MiningButtonProps> = ({ 
  miningActive, 
  miningTime, 
  onButtonClick,
}) => {
  const [displayTime, setDisplayTime] = useState("");
  const [buttonHovered, setButtonHovered] = useState(false);
  
  // Format and update time display
  React.useEffect(() => {
    setDisplayTime(formatTimeDisplay(miningTime));
  }, [miningTime]);
  
  // Only allow starting mining, not stopping
  const handleClick = useCallback(() => {
    if (!miningActive) {
      onButtonClick();
    }
  }, [miningActive, onButtonClick]);
  
  // Optimized hover handlers with useCallback
  const handleMouseEnter = useCallback(() => {
    setButtonHovered(true);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setButtonHovered(false);
  }, []);

  return (
    <div className="relative perspective-800">
      {buttonHovered && !miningActive && (
        <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      )}
      
      <ParticleEffects miningActive={miningActive} />
      <OrbitalEffects miningActive={miningActive} />
      
      <MiningButtonBase 
        miningActive={miningActive} 
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={miningActive}
      >
        <ButtonBackground miningActive={miningActive} />
        <ButtonContent 
          miningActive={miningActive} 
          displayTime={displayTime} 
        />
      </MiningButtonBase>
      
      {miningActive && (
        <div className="absolute top-full left-0 right-0 text-xs text-purple-400/80 text-center mt-2">
          Madencilik işlemi devam ediyor. 6 saat sonunda otomatik olarak duracak.
        </div>
      )}
    </div>
  );
};

MiningButton.displayName = "MiningButton";
