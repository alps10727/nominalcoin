
import React, { useState, useEffect, useCallback } from "react";
import { OrbitalEffects } from "./button/OrbitalEffects";
import { ParticleEffects } from "./button/ParticleEffects";
import { ButtonBackground } from "./button/ButtonBackground";
import { ButtonContent } from "./button/ButtonContent";
import { MiningButtonBase } from "./button/MiningButtonBase";

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
  
  // Format and update time display
  useEffect(() => {
    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    setDisplayTime(formatTime(miningTime));
  }, [miningTime]);

  // Memoize click handler
  const handleClick = useCallback(() => {
    onButtonClick();
  }, [onButtonClick]);
  
  // Handle hover state
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
      >
        {/* Background layers */}
        <ButtonBackground miningActive={miningActive} />
        
        {/* Content (text, icon) */}
        <ButtonContent 
          miningActive={miningActive} 
          displayTime={displayTime} 
        />
      </MiningButtonBase>
    </div>
  );
};

MiningButton.displayName = "MiningButton";
