
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, Users, Circle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCoinContext } from "@/contexts/CoinContext";
import { toast } from "@/hooks/use-toast";

const MiningCard = () => {
  const [miningActive, setMiningActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [miningRate, setMiningRate] = useState(0.1);
  const [miningSession, setMiningSession] = useState(0);
  const [miningTime, setMiningTime] = useState(0);
  const { t } = useLanguage();
  const { addCoins } = useCoinContext();

  useEffect(() => {
    let interval: number | undefined;
    
    if (miningActive) {
      interval = window.setInterval(() => {
        setMiningTime(prev => prev + 1);
        setProgress(prev => {
          if (prev >= 100) {
            addCoins(miningRate);
            setMiningSession(prev => prev + 1);
            toast({
              title: t('mining.successful'),
              description: t('mining.successfulDesc', miningRate.toString())
            });
            return 0;
          }
          return prev + 1;
        });
      }, 300);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [miningActive, miningRate, t, addCoins]);

  const handleStartMining = () => {
    setMiningActive(true);
    toast({
      title: t('mining.started'),
      description: t('mining.startedDesc')
    });
  };

  const handleStopMining = () => {
    setMiningActive(false);
    toast({
      title: t('mining.stopped'),
      description: t('mining.stoppedDesc', (miningRate * miningSession).toString())
    });
    setMiningSession(0);
    setMiningTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Card className="mb-6 border-none shadow-md hover:shadow-lg transition-shadow bg-gray-800 text-gray-100 dark:bg-gray-850">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Zap className="h-5 w-5 text-yellow-400" />
          {t('mining.title')}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {t('mining.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div 
            className={`relative mx-auto w-44 h-44 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
              miningActive 
                ? 'bg-gradient-to-br from-green-900 to-emerald-800 shadow-lg shadow-green-900/50' 
                : 'bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-md'
            }`}
            onClick={miningActive ? handleStopMining : handleStartMining}
          >
            <div className={`absolute inset-2 rounded-full border-4 ${
              miningActive ? 'border-green-500 border-t-transparent' : 'border-gray-600 border-t-transparent'
            } animate-spin opacity-20`}></div>
            
            <Circle className={`h-36 w-36 ${
              miningActive 
                ? 'text-green-400 animate-pulse' 
                : 'text-gray-500 hover:text-indigo-400 transition-colors'
            }`} />
            
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              {miningActive ? (
                <>
                  <span className="text-sm font-semibold bg-gray-900/80 px-3 py-1 rounded-full shadow-sm text-green-400">{t('mining.active')}</span>
                  <span className="text-xs mt-2 font-mono bg-gray-900/80 px-2 py-1 rounded-md text-green-400">{formatTime(miningTime)}</span>
                </>
              ) : (
                <span className="text-sm font-semibold bg-indigo-700 px-4 py-1.5 rounded-full shadow-sm text-white">{t('mining.inactive')}</span>
              )}
            </div>
          </div>
          
          {miningActive && (
            <div className="mt-6 animate-fade-in">
              <Progress value={progress} className="h-3 bg-gray-700" />
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <p>Mining... {progress}%</p>
                <p>+{miningRate} FC</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-gray-400 bg-gray-850 py-4 px-6 border-t border-gray-700">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2 text-indigo-400" />
          <span>{t('mining.activeminers')}</span>
        </div>
        <div className="flex items-center font-medium">
          <span>{t('mining.rate')}: {miningRate} FC/cycle</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MiningCard;
