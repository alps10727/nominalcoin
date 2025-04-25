
import React from "react";

interface CooldownIndicatorProps {
  visible: boolean;
}

export const CooldownIndicator: React.FC<CooldownIndicatorProps> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <div className="absolute -bottom-6 left-0 right-0 text-center">
      <span className="text-xs text-yellow-400 bg-navy-900/80 px-2 py-0.5 rounded-full animate-pulse shadow-inner shadow-yellow-500/30 border border-yellow-500/20">
        Lütfen bekleyin...
      </span>
    </div>
  );
};

CooldownIndicator.displayName = "CooldownIndicator";
