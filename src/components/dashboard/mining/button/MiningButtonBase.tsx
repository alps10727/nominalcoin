
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

/**
 * Base button component that handles the click event and scaling animation
 */
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
    disabled,
    cooldownTime: 3000
  });

  return (
    <div className="mx-auto flex items-center justify-center">
      <button 
        className={`relative w-36 h-36 rounded-full flex items-center justify-center z-10 transform transition-all duration-500 ${
          miningActive ? 'scale-110' : 'scale-100 hover:scale-105'
        } ${isDisabled ? 'opacity-80 cursor-wait' : 'cursor-pointer'}`}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        disabled={isDisabled}
        aria-label={miningActive ? "Stop mining" : "Start mining"}
        title={miningActive ? "Stop mining" : "Start mining"}
        type="button"
      >
        {children}
      </button>
      
      <CooldownIndicator visible={cooldown} />
    </div>
  );
});

MiningButtonBase.displayName = "MiningButtonBase";
