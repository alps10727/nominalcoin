
import React from "react";
import { Zap } from "lucide-react";

interface ButtonContentProps {
  miningActive: boolean;
  displayTime: string;
}

export const ButtonContent: React.FC<ButtonContentProps> = ({ 
  miningActive, 
  displayTime
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-purple-200 text-center">
        {miningActive ? (
          <>
            <div className="text-xs font-medium text-purple-300/80 mb-1">Kalan Süre</div>
            <div className="text-lg font-mono font-semibold">{displayTime}</div>
          </>
        ) : (
          <>
            <Zap className="h-8 w-8 mx-auto mb-2 text-purple-300" />
            <div className="text-sm font-semibold uppercase tracking-wide">MADENCİLİĞİ BAŞLAT</div>
          </>
        )}
      </div>
    </div>
  );
};

ButtonContent.displayName = "ButtonContent";
