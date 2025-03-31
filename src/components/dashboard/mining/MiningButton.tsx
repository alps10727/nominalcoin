
import React, { useEffect, useState, useCallback } from "react";
import { MiningButtonBase } from "./button/MiningButtonBase";
import { ButtonBackground } from "./button/ButtonBackground";
import { PulseRings } from "./button/PulseRings";
import { ButtonContent } from "./button/ButtonContent";
import { ParticleEffects } from "./button/ParticleEffects";
import { OrbitalEffects } from "./button/OrbitalEffects";

interface MiningButtonProps {
  miningActive: boolean;
  miningTime: number;
  onButtonClick: () => void;
}

export const MiningButton = React.memo<MiningButtonProps>(({ 
  miningActive,
  miningTime, 
  onButtonClick
}) => {
  const [displayTime, setDisplayTime] = useState("");
  
  // Format and update the displayed time
  useEffect(() => {
    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    setDisplayTime(formatTime(miningTime));
  }, [miningTime]);

  // Memoize the button click handler
  const handleClick = useCallback(() => {
    onButtonClick();
  }, [onButtonClick]);

  return (
    <MiningButtonBase 
      miningActive={miningActive} 
      onClick={handleClick}
    >
      {/* Background and effects */}
      <ButtonBackground miningActive={miningActive} />
      <PulseRings miningActive={miningActive} />
      <ParticleEffects miningActive={miningActive} />
      <OrbitalEffects miningActive={miningActive} />
      
      {/* Button content */}
      <ButtonContent 
        miningActive={miningActive} 
        displayTime={displayTime} 
      />
    </MiningButtonBase>
  );
});

MiningButton.displayName = "MiningButton";
