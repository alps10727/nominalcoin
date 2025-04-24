
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  onBack: () => void;
  isPlaying: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({ onBack, isPlaying }) => (
  <Button
    onClick={onBack}
    className="absolute top-4 left-4 z-50 bg-black/50 hover:bg-black/70"
    size="sm"
    variant="ghost"
  >
    <ArrowLeft className="h-5 w-5" />
  </Button>
);

export default BackButton;
