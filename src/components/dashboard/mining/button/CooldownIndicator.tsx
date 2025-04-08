
import React from "react";

interface CooldownIndicatorProps {
  visible: boolean;
}

/**
 * Visual feedback component for button cooldown state
 */
export const CooldownIndicator: React.FC<CooldownIndicatorProps> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <div className="absolute -bottom-6 left-0 right-0 text-center">
      <span className="text-xs text-purple-400/80 bg-navy-900/50 px-2 py-0.5 rounded-full animate-pulse">
        Please wait...
      </span>
    </div>
  );
};

CooldownIndicator.displayName = "CooldownIndicator";
