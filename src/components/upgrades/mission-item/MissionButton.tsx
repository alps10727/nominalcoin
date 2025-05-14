
import React from 'react';
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";

interface MissionButtonProps {
  id: string;
  isDisabled: boolean;
  timeLeft: string | null;
  claimed: boolean;
  onClick: () => void;
  isLoading: boolean;
}

const MissionButton = ({ 
  id, 
  isDisabled, 
  timeLeft, 
  claimed, 
  onClick, 
  isLoading 
}: MissionButtonProps) => {
  const getButtonText = () => {
    if (timeLeft) {
      return timeLeft;
    }
    
    switch (id) {
      case 'mining-boost':
        return "Aktifleştir";
      case 'wheel-of-fortune':
        return "Çevir";
      case 'purchase-reward':
        return claimed ? "Alındı" : "Talep Et";
      default:
        return claimed ? "Alındı" : "Talep Et";
    }
  };

  return (
    <Button 
      onClick={onClick}
      disabled={isDisabled || isLoading}
      size="sm" 
      className={`${
        isDisabled 
          ? 'bg-gray-700 text-gray-400' 
          : 'bg-gradient-to-r from-indigo-600 to-purple-600'
      } h-8`}
    >
      {isDisabled && timeLeft ? (
        <Lock className="mr-1 h-3 w-3" />
      ) : null}
      {getButtonText()} {!isDisabled && !claimed && <ArrowRight className="ml-1 h-3 w-3" />}
    </Button>
  );
};

export default MissionButton;
