
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
  
  // Format and update time display - yeni formatTimeDisplay fonksiyonunu kullanıyoruz
  useEffect(() => {
    setDisplayTime(formatTimeDisplay(miningTime));
  }, [miningTime]);

  // Memoize click handler with debounce logic
  const handleClick = useCallback(() => {
    const now = Date.now();
    // Prevent rapid clicks (3-second cooldown)
    if (now - lastClickTimeRef.current < 3000) {
      console.log("Button clicked too quickly, ignoring");
      return;
    }
    
    // Set button as not clickable
    setIsClickable(false);
    lastClickTimeRef.current = now;
    
    // Call the actual handler
    onButtonClick();
    
    // Re-enable button after cooldown
    setTimeout(() => {
      setIsClickable(true);
    }, 3000);
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
      
      {/* Cooldown indicator */}
      {!isClickable && (
        <div className="absolute top-full left-0 right-0 text-xs text-purple-400/80 text-center mt-2">
          Please wait...
        </div>
      )}
    </div>
  );
};

MiningButton.displayName = "MiningButton";
