
import React from "react";
import { CardFooter } from "@/components/ui/card";

interface MiningCardFooterProps {
  miningSession: number;
  miningRate: number;
}

export const MiningCardFooter: React.FC<MiningCardFooterProps> = ({ miningSession, miningRate }) => {
  // Empty footer - stats have been removed as requested
  return (
    <CardFooter className="hidden">
      {/* Stats have been removed as requested by the user */}
    </CardFooter>
  );
};
