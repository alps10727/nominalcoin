
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MiningSectionHeader } from "./MiningSectionHeader";
import MiningCard from "../MiningCard";
import MiningRateDisplay from "@/components/mining/MiningRateDisplay";
import MiningRateCard from "../MiningRateCard";

interface MiningSectionContainerProps {
  isLoading: boolean;
  miningActive: boolean;
  progress: number;
  miningRate: number;
  miningSession: number;
  miningTime: number;
  onStartMining: () => void;
  onStopMining: () => void;
}

export const MiningSectionContainer: React.FC<MiningSectionContainerProps> = ({
  isLoading,
  miningActive,
  progress,
  miningRate,
  miningSession,
  miningTime,
  onStartMining,
  onStopMining,
}) => {
  return (
    <div className="space-y-4">
      <MiningSectionHeader />
      
      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <MiningCard 
          miningActive={miningActive}
          progress={progress}
          miningRate={miningRate}
          miningSession={miningSession}
          miningTime={miningTime}
          onStartMining={onStartMining}
          onStopMining={onStopMining}
        />
      )}
      
      {isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MiningRateDisplay />
          <MiningRateCard miningRate={miningRate} />
        </div>
      )}
    </div>
  );
};
