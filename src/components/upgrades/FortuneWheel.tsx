
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WheelPrize } from '@/types/missions';
import { toast } from 'sonner';
import { debugLog } from '@/utils/debugUtils';

interface FortuneWheelProps {
  isOpen: boolean;
  onClose: () => void;
  onPrizeWon: (prize: WheelPrize) => void;
}

const prizes: WheelPrize[] = [
  { id: 'nc-1', label: '1 NC', value: 1, type: 'coins' },
  { id: 'nc-5', label: '5 NC', value: 5, type: 'coins' },
  { id: 'nc-10', label: '10 NC', value: 10, type: 'coins' },
  { id: 'nc-50', label: '50 NC', value: 50, type: 'coins' },
  { id: 'rate-001', label: '+0.001', value: 0.001, type: 'mining_rate', duration: 24 * 60 * 60 * 1000 },
  { id: 'rate-003', label: '+0.003', value: 0.003, type: 'mining_rate', duration: 24 * 60 * 60 * 1000 },
  { id: 'rate-005', label: '+0.005', value: 0.005, type: 'mining_rate', duration: 24 * 60 * 60 * 1000 },
  { id: 'nc-2', label: '2 NC', value: 2, type: 'coins' },
];

const FortuneWheel: React.FC<FortuneWheelProps> = ({ isOpen, onClose, onPrizeWon }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<WheelPrize | null>(null);
  const spinCompleted = useRef(false);

  // Debug logging for component state
  useEffect(() => {
    if (isOpen) {
      debugLog("FortuneWheel", "Wheel opened");
    }
    
    if (!isOpen) {
      // Reset state when dialog closes
      setSelectedPrize(null);
      spinCompleted.current = false;
      setRotation(0);
      debugLog("FortuneWheel", "Wheel closed, state reset");
    }
  }, [isOpen]);

  const spinWheel = () => {
    if (spinning || spinCompleted.current) return;
    
    setSpinning(true);
    setSelectedPrize(null);
    debugLog("FortuneWheel", "Starting wheel spin");
    
    // Rastgele bir ödül seç
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[prizeIndex];
    debugLog("FortuneWheel", `Selected prize: ${JSON.stringify(prize)}`);
    
    // Çarkı döndür
    const spinAngle = 5 * 360 + (360 / prizes.length) * (prizes.length - prizeIndex);
    const newRotation = rotation + spinAngle;
    
    setRotation(newRotation);
    
    // Döndürme animasyonu tamamlandığında
    setTimeout(() => {
      setSpinning(false);
      setSelectedPrize(prize);
      spinCompleted.current = true;
      
      // Debug log to verify animation completion
      debugLog("FortuneWheel", "Spin animation completed");
      debugLog("FortuneWheel", `Final prize: ${JSON.stringify(prize)}`);
      
      // Ödülü kullanıcıya bildir
      if (prize.type === 'coins') {
        toast.success(`Tebrikler! ${prize.value} NC kazandınız!`);
      } else {
        toast.success(`Tebrikler! ${prize.value} kazım hızı artışı kazandınız!`);
      }
    }, 5000); // 5 saniyelik animasyon
  };
  
  const handleClaimPrize = () => {
    if (!selectedPrize || !spinCompleted.current) return;
    
    debugLog("FortuneWheel", `Claiming prize: ${JSON.stringify(selectedPrize)}`);
    onPrizeWon(selectedPrize);
    
    // Important: Close the dialog AFTER prize is processed
    setTimeout(() => {
      onClose();
      // Durumu sıfırla
      spinCompleted.current = false;
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700 max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-center mb-4">Şans Çarkı</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center">
          {selectedPrize && (
            <div className="mb-4 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-bold text-center">
              {selectedPrize.type === 'coins' 
                ? `Tebrikler! ${selectedPrize.value} NC Kazandınız!`
                : `Tebrikler! ${selectedPrize.value} Kazım Hızı (24 saat) Kazandınız!`}
            </div>
          )}
          
          {/* Çark Konteyner */}
          <div className="relative w-64 h-64 mb-6">
            {/* İşaretçi */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-10">
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-yellow-500"></div>
            </div>
            
            {/* Çark */}
            <div 
              className="w-full h-full rounded-full bg-gradient-to-br from-indigo-900 to-purple-900 border-4 border-indigo-600 relative overflow-hidden"
              style={{ 
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67)' : 'none'
              }}
            >
              {prizes.map((prize, index) => {
                const rotation = (360 / prizes.length) * index;
                const isCoins = prize.type === 'coins';
                
                return (
                  <div 
                    key={prize.id}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    {/* Dilim kenarı */}
                    <div className="absolute top-0 left-1/2 h-1/2 w-[2px] bg-white/40"></div>
                    
                    {/* Dilim içeriği */}
                    <div 
                      className="absolute top-[10%] left-[50%] transform -translate-x-1/2 text-white font-bold"
                      style={{ 
                        transform: `translateX(-50%) rotate(${rotation * -1}deg)`,
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
          </div>
          
          <div className="flex space-x-4 mt-2 mb-2">
            <Button
              onClick={spinWheel}
              disabled={spinning || spinCompleted.current}
              className="w-32 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
            >
              {spinning ? 'Çevriliyor...' : 'Çevir'}
            </Button>
            
            {selectedPrize && (
              <Button
                onClick={handleClaimPrize}
                className="w-32 h-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Ödülü Al
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FortuneWheel;
