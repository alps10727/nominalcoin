
import React from 'react';

interface MissionRewardProps {
  id: string;
  reward: number;
  t: (key: string) => string;
}

const MissionReward = ({ id, reward, t }: MissionRewardProps) => {
  if (id === 'wheel-of-fortune') {
    return (
      <span className="text-indigo-400 font-semibold">
        {t("missions.randomReward") || "Rastgele Ödül"}
      </span>
    );
  }
  
  return (
    <>
      <span className="text-gray-400">{t("missions.reward") || "Ödül"} </span> 
      <span className="text-indigo-400 font-semibold">
        {id === 'mining-boost' ? 
          "+0.005 Kazım Hızı" : 
          `${reward} NC`}
      </span>
    </>
  );
};

export default MissionReward;
