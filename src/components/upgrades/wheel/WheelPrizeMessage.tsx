
import React from 'react';
import { WheelPrize } from '@/types/missions';

interface WheelPrizeMessageProps {
  selectedPrize: WheelPrize | null;
}

const WheelPrizeMessage: React.FC<WheelPrizeMessageProps> = ({ selectedPrize }) => {
  if (!selectedPrize) return null;

  return (
    <div className="mb-4 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-bold text-center">
      {selectedPrize.type === 'coins' 
        ? `Tebrikler! ${selectedPrize.value} NC Kazandınız!`
        : `Tebrikler! ${selectedPrize.value} Kazım Hızı (24 saat) Kazandınız!`}
    </div>
  );
};

export default WheelPrizeMessage;
