
import React from "react";
import { Clock, Zap } from "lucide-react";
import { CardFooter } from "@/components/ui/card";

interface MiningCardFooterProps {
  miningSession: number;
  miningRate: number;
}

export const MiningCardFooter: React.FC<MiningCardFooterProps> = ({ miningSession, miningRate }) => {
  return (
    <CardFooter className="flex justify-between items-center gap-2 text-xs py-2 px-4 border-t border-purple-500/20 relative z-10 bg-gradient-to-b from-indigo-900/20 to-purple-950/40">
      {/* Mining stats in a single line with minimal design */}
      <div className="flex items-center gap-2">
        <Clock className="h-3 w-3 text-purple-300" />
        <span className="text-purple-200 font-medium">{miningSession.toFixed(4)}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Zap className="h-3 w-3 text-purple-300" />
        <span className="text-purple-200 font-medium">{miningRate.toFixed(4)}/3m</span>
      </div>
    </CardFooter>
  );
};
