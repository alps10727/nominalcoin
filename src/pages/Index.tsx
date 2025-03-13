
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
      <div className="flex items-center justify-center min-h-screen bg-purple-50">
        <div className="text-center">
          <RefreshCw className="mx-auto h-12 w-12 text-purple-600 animate-spin" />
          <h2 className="mt-4 text-xl font-semibold text-purple-800">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        <MenuIcon className="h-6 w-6 text-purple-700" />
        <h1 className="text-2xl font-bold text-purple-700">Future Coin</h1>
        <Bell className="h-6 w-6 text-purple-700" />
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Balance Card */}
        <Card className="mb-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Your FC Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold">{balance.toFixed(2)}</span>
              <span className="ml-1 text-xl">FC</span>
            </div>
            <p className="text-purple-100 mt-2">Total earned Future Coin</p>
          </CardContent>
        </Card>

        {/* Mining Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              FC Mining
            </CardTitle>
            <CardDescription>
              Mine to earn Future Coin cryptocurrency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div 
                className={`relative mx-auto w-36 h-36 rounded-full flex items-center justify-center cursor-pointer ${miningActive ? 'bg-green-100' : 'bg-gray-100'}`}
                onClick={miningActive ? handleStopMining : handleStartMining}
              >
                <Circle className={`h-32 w-32 ${miningActive ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  {miningActive ? (
                    <>
                      <span className="text-sm font-medium">STOP</span>
                      <span className="text-xs mt-1">{formatTime(miningTime)}</span>
                    </>
                  ) : (
                    <span className="text-sm font-medium">START</span>
                  )}
                </div>
              </div>
              {miningActive && (
                <div className="mt-4">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-gray-600 mt-2">
                    Mining in progress... {progress}%
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-gray-600 bg-gray-50">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>Miner Network</span>
            </div>
            <div className="flex items-center">
              <span>Earning Rate: {miningRate} FC/hour</span>
            </div>
          </CardFooter>
        </Card>

        {/* Function Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-md flex justify-between items-center">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-purple-600" />
                  <span>Security Center</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-md flex justify-between items-center">
                <div className="flex items-center">
                  <ArrowUpRight className="h-5 w-5 mr-2 text-purple-600" />
                  <span>Transfer FC</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Button 
          className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white" 
          size="lg"
        >
          <span>Explore FC Ecosystem</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </main>

      {/* Bottom navigation for mobile */}
      {isMobile && (
        <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 flex justify-around p-3">
          <div className="flex flex-col items-center text-purple-600">
            <Zap className="h-6 w-6" />
            <span className="text-xs mt-1">Mining</span>
          </div>
          <div className="flex flex-col items-center text-gray-500">
            <Users className="h-6 w-6" />
            <span className="text-xs mt-1">Team</span>
          </div>
          <div className="flex flex-col items-center text-gray-500">
            <ArrowUpRight className="h-6 w-6" />
            <span className="text-xs mt-1">Transfer</span>
          </div>
          <div className="flex flex-col items-center text-gray-500">
            <Shield className="h-6 w-6" />
            <span className="text-xs mt-1">Security</span>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Index;
