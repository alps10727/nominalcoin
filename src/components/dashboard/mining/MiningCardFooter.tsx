
import React from "react";
import { Clock, Zap, Activity } from "lucide-react";
import { CardFooter } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";

interface MiningCardFooterProps {
  miningSession: number;
  miningRate: number;
}

/**
 * Component that renders the footer of the mining card with session and rate information
 * Enhanced with more modern styling and visual effects
 */
export const MiningCardFooter: React.FC<MiningCardFooterProps> = ({ miningSession, miningRate }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm py-4 px-4 border-t border-purple-600/20 rounded-b-lg relative z-10 bg-gradient-to-b from-darkPurple-900/40 to-navy-950/70">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjAzIi8+PC9zdmc+')]"></div>
      
      {/* Power indicator with enhanced styling */}
      <div className="flex items-center font-medium text-white w-full sm:w-auto">
        <div className="flex items-center gap-2 bg-darkPurple-800/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-purple-400/30 w-full sm:w-auto justify-center sm:justify-start shadow-sm hover:shadow-md transition-shadow duration-300">
          <Activity className="h-5 w-5 text-purple-300" />
          <div className="flex flex-col">
            <span className="text-xs text-purple-100 font-medium">Mining Power</span>
            <span className="text-sm text-purple-300 font-bold">{(miningRate * 100).toFixed(2)}%</span>
          </div>
        </div>
      </div>
      
      {/* Mining stats with enhanced styling */}
      <div className="flex items-center gap-3 flex-wrap justify-center w-full sm:w-auto">
        <div className="flex items-center gap-2 bg-darkPurple-800/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-purple-400/30 shadow-sm hover:shadow-md transition-shadow duration-300 group">
          <Clock className="h-5 w-5 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
          <div className="flex flex-col">
            <span className="text-xs text-purple-100 font-medium">Session</span>
            <span className="text-sm text-purple-300 font-bold group-hover:text-purple-200 transition-colors duration-300">{miningSession.toFixed(4)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-darkPurple-800/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-purple-400/30 shadow-sm hover:shadow-md transition-shadow duration-300 group">
          <Zap className="h-5 w-5 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
          <div className="flex flex-col">
            <span className="text-xs text-purple-100 font-medium">Mining Rate</span>
            <span className="text-sm text-purple-300 font-bold group-hover:text-purple-200 transition-colors duration-300">{miningRate.toFixed(4)}/3m</span>
          </div>
        </div>
      </div>
    </CardFooter>
  );
};
