
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WheelPrize } from '@/types/missions';
import { DEFAULT_PRIZES } from './wheel/WheelSettings';
import { WheelTimer } from './wheel/WheelTimer';
import WheelPointer from './wheel/WheelPointer';
import WheelDisk from './wheel/WheelDisk';
import WheelPrizeMessage from './wheel/WheelPrizeMessage';
import WheelControls from './wheel/WheelControls';
import { useWheelLogic } from './wheel/useWheelLogic';

interface FortuneWheelProps {
  isOpen: boolean;
  onClose: () => void;
  onPrizeWon: (prize: WheelPrize) => void;
  cooldownEnd?: number | null;
}

const FortuneWheel: React.FC<FortuneWheelProps> = ({ isOpen, onClose, onPrizeWon, cooldownEnd }) => {
  const {
    spinning,
    rotation,
    selectedPrize,
    timeLeft,
    spinWheel,
    handleClaimPrize,
    setTimeLeft
  } = useWheelLogic(isOpen, onPrizeWon, cooldownEnd);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700 max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-center mb-4">Şans Çarkı</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center">
          <WheelTimer cooldownEnd={cooldownEnd} />
          <WheelPrizeMessage selectedPrize={selectedPrize} />
          
          {/* Wheel Container */}
          <div className="relative w-64 h-64 mb-6">
            <WheelPointer />
            <WheelDisk 
              prizes={DEFAULT_PRIZES} 
              rotation={rotation} 
              spinning={spinning}
            />
          </div>
          
          <WheelControls
            spinning={spinning}
            timeLeft={timeLeft}
            selectedPrize={!!selectedPrize}
            onSpin={spinWheel}
            onClaim={handleClaimPrize}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FortuneWheel;
