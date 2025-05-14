
import React from 'react';
import { CheckCircle } from "lucide-react";
import MissionIcon from './MissionIcon';

interface MissionHeaderProps {
  title: string;
  description: string;
  icon: string;
  claimed: boolean;
  isSingleUse: boolean;
}

const MissionHeader = ({ title, description, icon, claimed, isSingleUse }: MissionHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center">
        <div className="p-2 rounded-lg bg-gray-800/70 mr-3">
          <MissionIcon iconName={icon} />
        </div>
        <div>
          <h3 className="font-medium text-gray-200">{title}</h3>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      {(claimed && isSingleUse) && (
        <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
      )}
    </div>
  );
};

export default MissionHeader;
