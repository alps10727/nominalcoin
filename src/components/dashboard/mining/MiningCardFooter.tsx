
import React from "react";
import { Clock, Zap, Activity } from "lucide-react";
import { CardFooter } from "@/components/ui/card";

interface MiningCardFooterProps {
  miningSession: number;
  miningRate: number;
}

/**
 * Component that renders the footer of the mining card with session and rate information
 */
export const MiningCardFooter: React.FC<MiningCardFooterProps> = ({ miningSession, miningRate }) => {
  return (
    <CardFooter className="flex justify-between items-center text-sm py-4 border-t border-amber-600/20 rounded-b-lg relative z-10 bg-gradient-to-b from-amber-900/30 to-orange-950/60">
      <div className="flex items-center font-medium text-white">
        <div className="flex items-center gap-2 bg-amber-900/30 px-3 py-1.5 rounded-full backdrop-blur-sm border border-amber-400/10">
          <Activity className="h-4 w-4 text-amber-300" />
          <span className="text-xs text-amber-200">Power: <span className="text-amber-300 font-semibold">{(miningRate * 100).toFixed(2)}%</span></span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-amber-900/30 px-3 py-1.5 rounded-full backdrop-blur-sm border border-amber-400/10">
          <Clock className="h-4 w-4 text-amber-300" />
          <span className="text-xs text-amber-200">Session: <span className="text-amber-300 font-semibold">{miningSession.toFixed(4)}</span></span>
        </div>
        
        <div className="flex items-center gap-2 bg-amber-900/30 px-3 py-1.5 rounded-full backdrop-blur-sm border border-amber-400/10">
          <Zap className="h-4 w-4 text-amber-300" />
          <span className="text-xs text-amber-200">Rate: <span className="text-amber-300 font-semibold">{miningRate.toFixed(4)}/3m</span></span>
        </div>
      </div>
    </CardFooter>
  );
};
