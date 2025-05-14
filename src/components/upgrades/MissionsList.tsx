
import React from 'react';
import { Mission, WheelPrize } from '@/types/missions';
import MissionItem from './mission-item/MissionItem';

interface MissionsListProps {
  missions: Mission[];
  onClaim: (mission: Mission) => void;
  onActivateBoost?: () => void;
  onWheel?: () => void;
  onWheelPrize?: (prize: WheelPrize, mission: Mission) => void;
  isLoading: boolean;
}

const MissionsList = ({ 
  missions, 
  onClaim, 
  onActivateBoost, 
  onWheel,
  onWheelPrize,
  isLoading 
}: MissionsListProps) => {
  if (!missions || missions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-gray-900/50 border border-gray-800 rounded-lg">
        <p className="text-gray-400">Henüz görev bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {missions.map(mission => (
        <MissionItem
          key={mission.id}
          mission={mission}
          onClaim={onClaim}
          onActivateBoost={mission.id === 'mining-boost' ? onActivateBoost : undefined}
          onWheel={mission.id === 'wheel-of-fortune' ? onWheel : undefined}
          onWheelPrize={onWheelPrize}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default MissionsList;
