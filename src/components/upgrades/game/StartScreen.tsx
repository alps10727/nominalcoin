
import React from 'react';
import { Button } from '@/components/ui/button';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-indigo-950/90 to-purple-950/90 backdrop-blur-sm">
    <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in">Uzay Madeni</h2>
    <p className="text-gray-300 mb-6 max-w-xs animate-fade-in delay-100">
      Ekrana dokunarak coinleri topla ve puanları kazanmaya başla! Asteroidlerden ve uydulardan kaçın! 30 saniye içinde ne kadar çok coin toplayabilirsin?
    </p>
    <Button 
      onClick={onStart}
      className="animate-fade-in delay-200 bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
    >
      Oyuna Başla
    </Button>
  </div>
);

export default StartScreen;
