
import React from "react";
import { useMiningButtonClick } from "@/hooks/useMiningButtonClick";
import { CooldownIndicator } from "./CooldownIndicator";

interface MiningButtonBaseProps {
  miningActive: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const MiningButtonBase = React.memo<MiningButtonBaseProps>(({ 
  miningActive, 
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled = false,
  children 
}) => {
  // Use the extracted click handler logic
  const { handleClick, cooldown, isDisabled } = useMiningButtonClick({
    onClick,
    // Disable button if mining is active or other disable conditions are met
    disabled: disabled || miningActive,
    cooldownTime: 3000
  });

  return (
    <div className="mx-auto flex items-center justify-center">
      <button 
        className={`relative w-36 h-36 rounded-full flex items-center justify-center z-10 transform transition-all duration-500 ${
          miningActive ? 'scale-110 opacity-80' : 'scale-100 hover:scale-105'
        } ${isDisabled ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        disabled={isDisabled}
        aria-label={miningActive ? "Mining in progress" : "Start mining"}
        title={miningActive ? "Mining in progress" : "Start mining"}
        type="button"
      >
        {children}
      </button>
      
      <CooldownIndicator visible={cooldown} />
    </div>
  );
});

MiningButtonBase.displayName = "MiningButtonBase";
