
import React from "react";
import { Activity, Zap } from "lucide-react";
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
    <CardFooter className="flex justify-between items-center text-sm bg-navy-900/80 py-4 border-t border-darkPurple-700/30 rounded-b-lg relative z-10">
      <div className="flex items-center font-medium text-white">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-darkPurple-300" />
          <span>Session: <span className="text-darkPurple-200 font-semibold">{miningSession.toFixed(4)} NC</span></span>
        </div>
      </div>
      
      <div className="flex items-center font-medium text-white">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-darkPurple-300" />
          <span>Rate: <span className="text-darkPurple-200 font-semibold">{miningRate.toFixed(4)} NC/3min</span></span>
        </div>
      </div>
    </CardFooter>
  );
};
