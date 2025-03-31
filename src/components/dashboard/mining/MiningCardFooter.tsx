
import React from "react";
import { Clock, Zap, Activity } from "lucide-react";
import { CardFooter } from "@/components/ui/card";

interface MiningCardFooterProps {
  miningSession: number;
  miningRate: number;
}

export const MiningCardFooter: React.FC<MiningCardFooterProps> = ({ miningSession, miningRate }) => {
  return (
    <CardFooter className="flex flex-row justify-between items-center gap-2 text-sm py-3 px-4 border-t border-purple-500/20 relative z-10 bg-gradient-to-b from-indigo-900/40 to-purple-950/70">
      {/* Session stats */}
      <div className="flex items-center gap-2 bg-gradient-to-br from-indigo-800/50 to-purple-900/50 px-3 py-1.5 rounded-lg border border-purple-500/30 backdrop-blur-sm">
        <Clock className="h-4 w-4 text-purple-300" />
        <div className="flex flex-col">
          <span className="text-xs text-purple-100 font-medium">Session</span>
          <span className="text-sm text-purple-300 font-bold">{miningSession.toFixed(4)}</span>
        </div>
      </div>
      
      {/* Mining rate */}
      <div className="flex items-center gap-2 bg-gradient-to-br from-indigo-800/50 to-purple-900/50 px-3 py-1.5 rounded-lg border border-purple-500/30 backdrop-blur-sm">
        <Zap className="h-4 w-4 text-purple-300" />
        <div className="flex flex-col">
          <span className="text-xs text-purple-100 font-medium">Mining Rate</span>
          <span className="text-sm text-purple-300 font-bold">{miningRate.toFixed(4)}/3m</span>
        </div>
      </div>
    </CardFooter>
  );
};
