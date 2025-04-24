
import React from 'react';
import { Gamepad, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GameCardProps {
  gameScore: number;
  onPlayClick: () => void;
}

const GameCard = ({ gameScore, onPlayClick }: GameCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gamepad className="mr-2 h-5 w-5 text-purple-400" />
          Uzay Madeni
        </CardTitle>
        <CardDescription>
          Ekrana dokunarak coinleri topla ve puanları kazanmaya başla! 30 saniye içinde ne kadar çok coin toplayabilirsin?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-purple-900/20 p-2 rounded-full">
              <Gamepad className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-200">Mini Oyun</p>
              <p className="text-sm text-gray-400">En yüksek skor: {gameScore}</p>
            </div>
          </div>
          <Button 
            onClick={onPlayClick}
            className="bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            Oyna <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
