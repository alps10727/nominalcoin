
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
  MenuIcon, 
  Bell, 
  ChevronRight,
  RefreshCw,
  Zap,
  ArrowRight,
  Shield,
  Coins
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [miningActive, setMiningActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [balance, setBalance] = useState(0);
  const [miningRate, setMiningRate] = useState(0.1);
  const [miningSession, setMiningSession] = useState(0);
  const [miningTime, setMiningTime] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Sayfa yüklendiğinde loading'i kapatalım
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Cleanup timer
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    
    if (miningActive) {
      interval = window.setInterval(() => {
        setMiningTime(prev => prev + 1);
        setProgress(prev => {
          if (prev >= 100) {
            // Mining tamamlandı, balance'ı artıralım
            setBalance(prevBalance => prevBalance + miningRate);
            setMiningSession(prev => prev + 1);
            toast({
              title: "Mining successful!",
              description: `You earned ${miningRate} FC.`,
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
  }, [miningActive, miningRate]);

  const handleStartMining = () => {
    setMiningActive(true);
    toast({
      title: "Mining started",
      description: "You will earn rewards every 30 seconds.",
    });
  };

  const handleStopMining = () => {
    setMiningActive(false);
    toast({
      title: "Mining stopped",
      description: `You earned a total of ${miningRate * miningSession} FC in this session.`,
    });
    setMiningSession(0);
    setMiningTime(0);
  };

  // Madencilik süresini dakika ve saniye olarak formatlayalım
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950">
        <div className="text-center">
          <div className="relative">
            <RefreshCw className="mx-auto h-16 w-16 text-indigo-400 animate-spin" />
            <div className="absolute inset-0 rounded-full bg-indigo-400/20 blur-xl"></div>
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-indigo-200">Loading Future Coin</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md p-4 flex justify-between items-center shadow-md sticky top-0 z-10 border-b border-gray-800">
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <MenuIcon className="h-6 w-6 text-indigo-300" />
        </button>
        <div className="flex items-center">
          <Coins className="h-6 w-6 mr-2 text-indigo-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Future Coin
          </h1>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors relative">
          <Bell className="h-6 w-6 text-indigo-300" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        {/* Balance Card */}
        <Card className="mb-6 overflow-hidden border-none shadow-lg bg-gray-800">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-90"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-lg font-medium text-gray-200">Your FC Balance</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-baseline">
              <span className="text-5xl font-bold text-white">{balance.toFixed(2)}</span>
              <span className="ml-2 text-xl text-indigo-200">FC</span>
            </div>
            <p className="text-indigo-200 mt-2 opacity-80">Total earned Future Coin</p>
          </CardContent>
          <div className="absolute bottom-0 right-0 p-6 opacity-10">
            <Coins className="h-32 w-32 text-white" />
          </div>
        </Card>

        {/* Mining Card */}
        <Card className="mb-6 border-none shadow-md hover:shadow-lg transition-shadow bg-gray-800 text-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Zap className="h-5 w-5 text-yellow-400" />
              FC Mining
            </CardTitle>
            <CardDescription className="text-gray-400">
              Mine to earn Future Coin cryptocurrency
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
                      <span className="text-sm font-semibold bg-gray-900/80 px-3 py-1 rounded-full shadow-sm text-green-400">STOP</span>
                      <span className="text-xs mt-2 font-mono bg-gray-900/80 px-2 py-1 rounded-md text-green-400">{formatTime(miningTime)}</span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold bg-indigo-700 px-4 py-1.5 rounded-full shadow-sm text-white">START</span>
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
              <span>Active Miners</span>
            </div>
            <div className="flex items-center font-medium">
              <span>Rate: {miningRate} FC/cycle</span>
            </div>
          </CardFooter>
        </Card>

        {/* Function Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group bg-gray-800 text-gray-100">
            <CardHeader className="p-4">
              <CardTitle className="text-md flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-gray-700 group-hover:bg-indigo-900 transition-colors mr-3">
                    <Shield className="h-5 w-5 text-indigo-400" />
                  </div>
                  <span>Security Center</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-indigo-400 transition-colors" />
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group bg-gray-800 text-gray-100">
            <CardHeader className="p-4">
              <CardTitle className="text-md flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-gray-700 group-hover:bg-indigo-900 transition-colors mr-3">
                    <ArrowUpRight className="h-5 w-5 text-indigo-400" />
                  </div>
                  <span>Transfer FC</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-indigo-400 transition-colors" />
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Button 
          className="w-full bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800 text-white shadow-md transition-all hover:shadow-lg border-none" 
          size="lg"
        >
          <span>Explore FC Ecosystem</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </main>

      {/* Bottom navigation for mobile */}
      {isMobile && (
        <nav className="bg-gray-900/90 backdrop-blur-md border-t border-gray-800 fixed bottom-0 left-0 right-0 flex justify-around p-3 z-10 shadow-[0_-1px_5px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col items-center text-indigo-400">
            <div className="p-1.5 rounded-full bg-indigo-900/50">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1 font-medium">Mining</span>
          </div>
          <div className="flex flex-col items-center text-gray-500">
            <div className="p-1.5 rounded-full">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1">Team</span>
          </div>
          <div className="flex flex-col items-center text-gray-500">
            <div className="p-1.5 rounded-full">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1">Transfer</span>
          </div>
          <div className="flex flex-col items-center text-gray-500">
            <div className="p-1.5 rounded-full">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1">Security</span>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Index;
