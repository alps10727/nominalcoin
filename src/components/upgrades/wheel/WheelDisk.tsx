
import React from 'react';
import { WheelPrize } from '@/types/missions';

interface WheelDiskProps {
  prizes: WheelPrize[];
  rotation: number;
  spinning: boolean;
}

const WheelDisk: React.FC<WheelDiskProps> = ({ prizes, rotation, spinning }) => {
  return (
    <div 
      className="w-full h-full rounded-full bg-gradient-to-br from-indigo-900 to-purple-900 border-4 border-indigo-600 relative overflow-hidden"
      style={{ 
        transform: `rotate(${rotation}deg)`,
        transition: spinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67)' : 'none'
      }}
    >
      {prizes.map((prize, index) => {
        const segmentRotation = (360 / prizes.length) * index;
        const isCoins = prize.type === 'coins';
        
        return (
          <div 
            key={prize.id}
            className="absolute top-0 left-0 w-full h-full"
            style={{ transform: `rotate(${segmentRotation}deg)` }}
          >
            {/* Slice border */}
            <div className="absolute top-0 left-1/2 h-1/2 w-[2px] bg-white/40"></div>
            
            {/* Slice content */}
            <div 
              className="absolute top-[10%] left-[50%] transform -translate-x-1/2 text-white font-bold"
              style={{ 
                transform: `translateX(-50%) rotate(${segmentRotation * -1}deg)`,
                fontSize: '12px'
              }}
            >
              <span className={`${isCoins ? 'text-yellow-400' : 'text-cyan-400'}`}>
                {prize.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WheelDisk;
