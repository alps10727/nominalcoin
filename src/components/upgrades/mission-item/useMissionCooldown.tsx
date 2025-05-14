
import { useState, useEffect } from 'react';

export const useMissionCooldown = (cooldownEnd?: number | null) => {
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
    
    // Update every second
    const intervalId = setInterval(() => {
      const remaining = checkCooldown();
      setTimeLeft(remaining);
      
      if (!remaining && cooldownEnd) {
        // Clear interval when cooldown ends
        clearInterval(intervalId);
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [cooldownEnd]);

  return { timeLeft };
};
