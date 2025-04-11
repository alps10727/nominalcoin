
import React, { useState, useEffect, useCallback, useRef } from "react";
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
  onButtonClick 
}) => {
  const [displayTime, setDisplayTime] = useState("");
  const [buttonHovered, setButtonHovered] = useState(false);
  const [isClickable, setIsClickable] = useState(true);
  const lastClickTimeRef = useRef<number>(0);
  
  // Format and update time display
  useEffect(() => {
    setDisplayTime(formatTimeDisplay(miningTime));
  }, [miningTime]);

  // Optimized debounce logic with useCallback
  const handleClick = useCallback(() => {
    const now = Date.now();
    // Cooldown period decreased from 3s to 1s for better UX
    const cooldownPeriod = 1000;
    
    if (now - lastClickTimeRef.current < cooldownPeriod) {
      console.log("Button clicked too quickly, ignoring");
      return;
    }
    
    setIsClickable(false);
    lastClickTimeRef.current = now;
    
    // Call handler immediately
    onButtonClick();
    
    // Enable after cooldown - optimized to minimize delay
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsClickable(true);
      }, cooldownPeriod);
    });
  }, [onButtonClick]);
  
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
        disabled={!isClickable}
      >
        {/* Background layers */}
        <ButtonBackground miningActive={miningActive} />
        
        {/* Content (text, icon) */}
        <ButtonContent 
          miningActive={miningActive} 
          displayTime={displayTime} 
        />
      </MiningButtonBase>
      
      {/* Optimized cooldown indicator - only shows when needed */}
      {!isClickable && (
        <div className="absolute top-full left-0 right-0 text-xs text-purple-400/80 text-center mt-2">
          Lütfen bekleyin...
        </div>
      )}
    </div>
  );
};

MiningButton.displayName = "MiningButton";
