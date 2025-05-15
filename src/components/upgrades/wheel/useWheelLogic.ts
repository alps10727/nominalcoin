
import { useState, useRef, useEffect } from 'react';
import { WheelPrize } from '@/types/missions';
import { debugLog } from '@/utils/debugUtils';
import { toast } from 'sonner';
import { DEFAULT_PRIZES } from './WheelSettings';

export function useWheelLogic(
  isOpen: boolean, 
  onPrizeWon: (prize: WheelPrize) => void,
  cooldownEnd?: number | null
) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<WheelPrize | null>(null);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const spinCompleted = useRef(false);

  // Reset state when dialog closes
  useEffect(() => {
    if (isOpen) {
      debugLog("FortuneWheel", "Wheel opened");
      debugLog("FortuneWheel", `Cooldown end: ${cooldownEnd ? new Date(cooldownEnd).toISOString() : 'none'}`);
    }
    
    if (!isOpen) {
      setSelectedPrize(null);
      spinCompleted.current = false;
      setRotation(0);
      debugLog("FortuneWheel", "Wheel closed, state reset");
    }
  }, [isOpen, cooldownEnd]);

  const spinWheel = () => {
    if (spinning || spinCompleted.current || timeLeft) {
      debugLog("FortuneWheel", "Spin prevented - conditions not met", 
        { spinning, spinCompleted: spinCompleted.current, timeLeft });
      return;
    }
    
    setSpinning(true);
    setSelectedPrize(null);
    debugLog("FortuneWheel", "Starting wheel spin");
    
    // Select a random prize
    const prizeIndex = Math.floor(Math.random() * DEFAULT_PRIZES.length);
    const prize = DEFAULT_PRIZES[prizeIndex];
    debugLog("FortuneWheel", `Selected prize: ${JSON.stringify(prize)}`);
    
    // Calculate spin angle
    const spinAngle = 5 * 360 + (360 / DEFAULT_PRIZES.length) * (DEFAULT_PRIZES.length - prizeIndex);
    const newRotation = rotation + spinAngle;
    
    setRotation(newRotation);
    
    // Handle completion of spin animation
    setTimeout(() => {
      setSpinning(false);
      setSelectedPrize(prize);
      spinCompleted.current = true;
      
      debugLog("FortuneWheel", "Spin animation completed");
      debugLog("FortuneWheel", `Final prize: ${JSON.stringify(prize)}`);
      
      // Notify user of prize
      if (prize.type === 'coins') {
        toast.success(`Tebrikler! ${prize.value} NC kazandınız!`);
      } else {
        toast.success(`Tebrikler! ${prize.value} kazım hızı artışı kazandınız!`);
      }
    }, 5000); // 5 second animation
  };
  
  const handleClaimPrize = () => {
    if (!selectedPrize || !spinCompleted.current) return;
    
    debugLog("FortuneWheel", `Claiming prize: ${JSON.stringify(selectedPrize)}`);
    onPrizeWon(selectedPrize);
  };

  return {
    spinning,
    rotation,
    selectedPrize,
    timeLeft,
    spinWheel,
    handleClaimPrize,
    setTimeLeft
  };
}
