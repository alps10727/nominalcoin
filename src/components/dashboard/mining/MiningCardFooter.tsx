
import React from "react";
import { Clock, Zap, Activity } from "lucide-react";
import { CardFooter } from "@/components/ui/card";

interface MiningCardFooterProps {
  miningSession: number;
  miningRate: number;
}

export const MiningCardFooter: React.FC<MiningCardFooterProps> = ({ miningSession, miningRate }) => {
  return (
    <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm py-4 px-4 border-t border-cyan-500/20 rounded-b-lg relative z-10 bg-gradient-to-b from-navy-900/40 to-darkPurple-950/70">
      {/* Power indicator with updated design */}
      <div className="flex items-center font-medium text-white w-full sm:w-auto">
        <div className="flex items-center gap-2 bg-gradient-to-br from-navy-800/50 to-darkPurple-900/50 px-4 py-2 rounded-xl border border-cyan-500/30 w-full sm:w-auto justify-center sm:justify-start backdrop-blur-sm">
          <Activity className="h-5 w-5 text-cyan-300" />
          <div className="flex flex-col">
            <span className="text-xs text-cyan-100 font-medium">Mining Power</span>
            <span className="text-sm text-cyan-300 font-bold">{(miningRate * 100).toFixed(2)}%</span>
          </div>
        </div>
      </div>
      
      {/* Mining stats with updated design */}
      <div className="flex items-center gap-3 flex-wrap justify-center w-full sm:w-auto">
        <div className="flex items-center gap-2 bg-gradient-to-br from-navy-800/50 to-darkPurple-900/50 px-4 py-2 rounded-xl border border-cyan-500/30 backdrop-blur-sm">
          <Clock className="h-5 w-5 text-cyan-300" />
          <div className="flex flex-col">
            <span className="text-xs text-cyan-100 font-medium">Session</span>
            <span className="text-sm text-cyan-300 font-bold">{miningSession.toFixed(4)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-gradient-to-br from-navy-800/50 to-darkPurple-900/50 px-4 py-2 rounded-xl border border-cyan-500/30 backdrop-blur-sm">
          <Zap className="h-5 w-5 text-cyan-300" />
          <div className="flex flex-col">
            <span className="text-xs text-cyan-100 font-medium">Mining Rate</span>
            <span className="text-sm text-cyan-300 font-bold">{miningRate.toFixed(4)}/3m</span>
          </div>
        </div>
      </div>
    </CardFooter>
  );
};
