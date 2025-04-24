
import React from 'react';
import { Mission } from '@/pages/Upgrades';
import MissionItem from './MissionItem';

interface MissionsListProps {
  missions: Mission[];
  onClaim: (mission: Mission) => void;
  onConnect?: (missionId: string) => void;
  isLoading: boolean;
}

const MissionsList = ({ missions, onClaim, onConnect, isLoading }: MissionsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {missions.map(mission => (
        <MissionItem 
          key={mission.id} 
          mission={mission} 
          onClaim={() => onClaim(mission)}
          onConnect={mission.id === "social-twitter" ? () => onConnect?.("social-twitter") : undefined}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default MissionsList;
