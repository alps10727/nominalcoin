
import React, { useState, useEffect } from 'react';
import { debugLog } from '@/utils/debugUtils';

interface WheelTimerProps {
  cooldownEnd: number | null | undefined;
}

export const WheelTimer: React.FC<WheelTimerProps> = ({ cooldownEnd }) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    const checkCooldown = () => {
      if (!cooldownEnd) return null;
      
      const now = Date.now();
      if (now < cooldownEnd) {
        const remaining = Math.ceil((cooldownEnd - now) / 1000);
        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
      
      return null;
    };
    
    // Initial check
    setTimeLeft(checkCooldown());
    debugLog("WheelTimer", `Initial timeLeft check: ${checkCooldown()}`);
    
    // Update every second
    const intervalId = setInterval(() => {
      const remaining = checkCooldown();
      setTimeLeft(remaining);
      
      if (!remaining && cooldownEnd) {
        clearInterval(intervalId);
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [cooldownEnd]);

  if (!timeLeft) return null;

  return (
    <div className="mb-4 p-3 bg-gradient-to-r from-amber-600 to-red-600 rounded-lg text-white font-bold text-center">
      Bir sonraki çevirme için bekleyiniz: {timeLeft}
    </div>
  );
};
