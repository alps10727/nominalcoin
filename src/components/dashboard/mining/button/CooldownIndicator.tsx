
import React from "react";

interface CooldownIndicatorProps {
  visible: boolean;
}

/**
 * Visual feedback component for button cooldown state
 * Updated to show a more noticeable indicator for slower mining rate
 */
export const CooldownIndicator: React.FC<CooldownIndicatorProps> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <div className="absolute -bottom-6 left-0 right-0 text-center">
      <span className="text-xs text-yellow-400/90 bg-navy-900/70 px-2 py-0.5 rounded-full animate-pulse shadow-inner shadow-yellow-500/20 border border-yellow-500/10">
        Please wait...
      </span>
    </div>
  );
};

CooldownIndicator.displayName = "CooldownIndicator";
