
import React, { useMemo } from "react";

interface ButtonBackgroundProps {
  miningActive: boolean;
  adLoading?: boolean;
}

export const ButtonBackground: React.FC<ButtonBackgroundProps> = ({ miningActive, adLoading = false }) => {
  // Use different colors for different states
  const glowColor = useMemo(() => {
    if (adLoading) return "from-amber-500/30 via-amber-500/15 to-amber-500/10";
    if (miningActive) return "from-green-500/30 via-green-500/15 to-green-500/10";
    return "from-purple-500/30 via-purple-500/15 to-purple-500/10";
  }, [miningActive, adLoading]);
  
  const borderColor = useMemo(() => {
    if (adLoading) return "border-amber-500/40";
    if (miningActive) return "border-green-500/40";
    return "border-purple-500/40";
  }, [miningActive, adLoading]);
  
  const bgGradient = useMemo(() => {
    if (adLoading) return "from-darkPurple-950 via-amber-950/40 to-darkPurple-950";
    if (miningActive) return "from-darkPurple-950 via-green-950/40 to-darkPurple-950";
    return "from-darkPurple-950 via-purple-950/40 to-darkPurple-950";
  }, [miningActive, adLoading]);

  return (
    <>
      {/* Outer glow effect */}
      <div className={`absolute inset-0 rounded-full bg-gradient-radial ${glowColor} animate-glow-slow blur-md`}></div>
      
      {/* Border */}
      <div className={`absolute inset-0 rounded-full border ${borderColor} ${miningActive || adLoading ? 'animate-pulse' : ''}`}></div>
      
      {/* Inner glass effect */}
      <div className={`absolute inset-1 rounded-full bg-gradient-to-b ${bgGradient} backdrop-blur-sm shadow-inner`}></div>
      
      {/* Inner background pattern */}
      <div className="absolute inset-4 rounded-full bg-grid-pattern opacity-10"></div>
    </>
  );
};

ButtonBackground.displayName = "ButtonBackground";
