
import React from "react";
import { Zap, Loader2 } from "lucide-react";

interface ButtonContentProps {
  miningActive: boolean;
  displayTime: string;
  adLoading?: boolean;
}

export const ButtonContent: React.FC<ButtonContentProps> = ({ 
  miningActive, 
  displayTime,
  adLoading = false
}) => {
  if (adLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-purple-200 text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-2 text-purple-300 animate-spin" />
          <div className="text-sm font-semibold uppercase tracking-wide">YÜKLENIYOR</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-purple-200 text-center">
        {miningActive ? (
          <>
            <div className="text-xs font-medium text-purple-300/70 mb-1">Remaining</div>
            <div className="text-lg font-mono font-semibold">{displayTime}</div>
          </>
        ) : (
          <>
            <Zap className="h-8 w-8 mx-auto mb-2 text-purple-300" />
            <div className="text-sm font-semibold uppercase tracking-wide">START MINING</div>
          </>
        )}
      </div>
    </div>
  );
};

ButtonContent.displayName = "ButtonContent";
