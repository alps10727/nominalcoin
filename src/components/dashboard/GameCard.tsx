
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

const GameCard = () => {
  const { t } = useLanguage();

  const handlePlayGame = () => {
    toast({
      title: t('game.unavailable'),
      description: t('game.comingSoon'),
      variant: "destructive"
    });
  };

  return (
    <Card 
      className="mb-6 border-none shadow-md hover:shadow-lg transition-shadow bg-gray-800 text-gray-100 dark:bg-gray-850 overflow-hidden cursor-pointer group" 
      onClick={handlePlayGame}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900 opacity-0 group-hover:opacity-30 transition-opacity"></div>
      <CardHeader className="p-4">
        <CardTitle className="text-xl flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-900/80 group-hover:bg-purple-700 transition-colors mr-3">
              <Gamepad className="h-6 w-6 text-purple-300" />
            </div>
            <div>
              <span className="block">{t('game.title')}</span>
              <span className="text-sm font-normal text-indigo-300">{t('game.playtoearn')}</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default GameCard;
