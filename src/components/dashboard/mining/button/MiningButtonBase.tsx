
import React from "react";

interface MiningButtonBaseProps {
  miningActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

/**
 * Base button component that handles the click event and scaling animation
 */
export const MiningButtonBase: React.FC<MiningButtonBaseProps> = ({ 
  miningActive, 
  onClick, 
  children 
}) => {
  return (
    <div className="mx-auto flex items-center justify-center">
      <button 
        className={`relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer z-10 transition-all duration-700 ${
          miningActive ? 'scale-110' : 'scale-100 hover:scale-105'
        }`}
        onClick={onClick}
        aria-label={miningActive ? "Stop mining" : "Start mining"}
        title={miningActive ? "Stop mining" : "Start mining"}
      >
        {children}
      </button>
    </div>
  );
};
