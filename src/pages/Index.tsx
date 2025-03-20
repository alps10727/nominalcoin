import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Circle, 
  Users, 
  ArrowUpRight,
  RefreshCw,
  Zap,
  ArrowRight,
  Shield,
  Coins,
  ChevronRight,
  User,
  History,
  UserPlus,
  Award,
  BarChart2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import { Link } from "react-router-dom";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [miningActive, setMiningActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [balance, setBalance] = useState(0);
  const [miningRate, setMiningRate] = useState(0.1);
  const [miningSession, setMiningSession] = useState(0);
  const [miningTime, setMiningTime] = useState(0);
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    
    if (miningActive) {
      interval = window.setInterval(() => {
        setMiningTime(prev => prev + 1);
        setProgress(prev => {
          if (prev >= 100) {
            setBalance(prevBalance => prevBalance + miningRate);
            setMiningSession(prev => prev + 1);
            toast({
              title: t('mining.successful'),
              description: t('mining.successfulDesc', miningRate.toString()),
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
  }, [miningActive, miningRate, t]);

  const handleStartMining = () => {
    setMiningActive(true);
    toast({
      title: t('mining.started'),
      description: t('mining.startedDesc'),
    });
  };

  const handleStopMining = () => {
    setMiningActive(false);
    toast({
      title: t('mining.stopped'),
      description: t('mining.stoppedDesc', (miningRate * miningSession).toString()),
    });
    setMiningSession(0);
    setMiningTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 dark:from-gray-950 dark:to-indigo-950">
        <div className="text-center">
          <div className="relative">
            <RefreshCw className="mx-auto h-16 w-16 text-indigo-400 animate-spin" />
            <div className="absolute inset-0 rounded-full bg-indigo-400/20 blur-xl"></div>
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-indigo-200">{t('app.title')}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 dark:from-gray-950 dark:to-indigo-950 flex flex-col`}>
      <Header />

      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <Card className="mb-6 overflow-hidden border-none shadow-lg bg-gray-800 dark:bg-gray-850">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-90"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-lg font-medium text-gray-200">{t('balance.title')}</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-baseline">
              <span className="text-5xl font-bold text-white">{balance.toFixed(2)}</span>
              <span className="ml-2 text-xl text-indigo-200">FC</span>
            </div>
            <p className="text-indigo-200 mt-2 opacity-80">{t('balance.total')}</p>
          </CardContent>
          <div className="absolute bottom-0 right-0 p-6 opacity-10">
            <Coins className="h-32 w-32 text-white" />
          </div>
        </Card>

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
                  miningActive ? 'border-red-500 border-t-transparent' : 'border-red-600 border-t-transparent'
                } animate-spin opacity-70`}></div>
                
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
            <div className="mt-4 text-center">
              <Link to="/mining/upgrades">
                <Button variant="outline" className="border-indigo-800 bg-gray-800/50 text-indigo-300 hover:bg-indigo-900/30">
                  {t('mining.upgrades')}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
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

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link to="/profile">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group bg-gray-800 text-gray-100 dark:bg-gray-850">
              <CardHeader className="p-4">
                <CardTitle className="text-md flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-700 group-hover:bg-indigo-900 transition-colors mr-3">
                      <User className="h-5 w-5 text-indigo-400" />
                    </div>
                    <span>{t('profile.title')}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/history">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group bg-gray-800 text-gray-100 dark:bg-gray-850">
              <CardHeader className="p-4">
                <CardTitle className="text-md flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-700 group-hover:bg-indigo-900 transition-colors mr-3">
                      <History className="h-5 w-5 text-indigo-400" />
                    </div>
                    <span>{t('history.title')}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/referral">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group bg-gray-800 text-gray-100 dark:bg-gray-850">
              <CardHeader className="p-4">
                <CardTitle className="text-md flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-700 group-hover:bg-indigo-900 transition-colors mr-3">
                      <UserPlus className="h-5 w-5 text-indigo-400" />
                    </div>
                    <span>{t('referral.title')}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/tasks">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group bg-gray-800 text-gray-100 dark:bg-gray-850">
              <CardHeader className="p-4">
                <CardTitle className="text-md flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-700 group-hover:bg-indigo-900 transition-colors mr-3">
                      <Award className="h-5 w-5 text-indigo-400" />
                    </div>
                    <span>{t('tasks.title')}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <Link to="/statistics">
          <Button 
            className="w-full bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800 text-white shadow-md transition-all hover:shadow-lg border-none" 
            size="lg"
          >
            <BarChart2 className="mr-2 h-5 w-5" />
            <span>{t('stats.title')}</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </main>

      <MobileNavigation />
    </div>
  );
};

export default Index;
