
import React from 'react';
import { Mission } from '@/types/missions';
import MissionItem from './MissionItem';

interface MissionsListProps {
  missions: Mission[];
  onClaim: (mission: Mission, byAdReward?: boolean) => void;
  onActivateBoost?: () => void;
  onWheel?: () => void;
  onConnect?: (missionId: string) => void;
  isLoading: boolean;
}

const MissionsList = ({ 
  missions, 
  onClaim, 
  onActivateBoost,
  onWheel,
  onConnect, 
  isLoading 
}: MissionsListProps) => {
  // Add safety check to ensure missions is always an array
  const safeMissions = Array.isArray(missions) ? missions : [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {safeMissions.map(mission => (
        <MissionItem 
          key={mission.id} 
          mission={mission} 
          onClaim={onClaim}
          onActivateBoost={mission.id === "mining-boost" ? onActivateBoost : undefined}
          onWheel={mission.id === "wheel-of-fortune" ? onWheel : undefined}
          onConnect={mission.id === "social-twitter" ? () => onConnect?.("social-twitter") : undefined}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default MissionsList;
