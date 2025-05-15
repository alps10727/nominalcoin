
import React from 'react';
import { Button } from '@/components/ui/button';

interface WheelControlsProps {
  spinning: boolean;
  timeLeft: string | null;
  selectedPrize: boolean;
  onSpin: () => void;
  onClaim: () => void;
}

const WheelControls: React.FC<WheelControlsProps> = ({ 
  spinning, 
  timeLeft, 
  selectedPrize, 
  onSpin, 
  onClaim 
}) => {
  const isButtonDisabled = spinning || timeLeft !== null;

  return (
    <div className="flex space-x-4 mt-2 mb-2">
      <Button
        onClick={onSpin}
        disabled={isButtonDisabled}
        className={`w-32 h-10 ${
          isButtonDisabled 
            ? 'bg-gray-700 text-gray-400' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
        } disabled:opacity-50`}
      >
        {spinning 
          ? 'Çevriliyor...' 
          : timeLeft 
            ? 'Bekleniyor' 
            : 'Çevir'}
      </Button>
      
      {selectedPrize && (
        <Button
          onClick={onClaim}
          className="w-32 h-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          Ödülü Al
        </Button>
      )}
    </div>
  );
};

export default WheelControls;
