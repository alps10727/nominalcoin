
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { useLanguage } from '@/contexts/LanguageContext';

interface MissionProgressProps {
  progress: number;
  total: number;
}

const MissionProgress = ({ progress, total }: MissionProgressProps) => {
  const { t } = useLanguage();
  const progressPercentage = (progress / total) * 100;
  
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{t("missions.progress") || "İlerleme"}</span>
        <span>{progress}/{total}</span>
      </div>
      <Progress value={progressPercentage} className="h-2 bg-gray-700" />
    </div>
  );
};

export default MissionProgress;
