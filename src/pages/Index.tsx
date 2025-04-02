
import { Diamond, Activity, Zap, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { useMiningData } from "@/hooks/useMiningData";
import { useLanguage } from "@/contexts/LanguageContext";

// Imported components
import BalanceCard from "@/components/dashboard/BalanceCard";
import MiningCard from "@/components/dashboard/MiningCard";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import MiningRateCard from "@/components/dashboard/MiningRateCard";
import { Button } from "@/components/ui/button";

const Index = () => {
  const {
    isLoading,
    miningActive,
    progress,
    balance,
    miningRate,
    miningSession,
    miningTime,
    handleStartMining,
    handleStopMining
  } = useMiningData();
  
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const { theme } = useTheme();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative pb-20">
      {/* Main content */}
      <main className={`flex-1 ${isMobile ? 'px-4 py-4' : 'px-6 py-6'} max-w-3xl mx-auto w-full relative z-10`}>
        {/* Welcome section */}
        <div className="mt-2 mb-6">
          <h1 className="text-2xl font-bold fc-gradient-text">NOMINAL Coin Dashboard</h1>
          <p className="text-purple-300/80 text-sm mt-1">
            Welcome to the NC mining hub - Earn cryptocurrency by mining!
          </p>
        </div>
        
        {/* Cards */}
        <div className="space-y-5">
          {/* Balance card */}
          <BalanceCard balance={balance} />
          
          {/* Mining section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold fc-gradient-text flex items-center">
                <Zap className="h-5 w-5 mr-1.5 text-purple-400" />
                Mining Hub
              </h2>
              
              <Button variant="link" size="sm" className="text-purple-400 hover:text-purple-300 -mr-2">
                Boosts <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            {/* Mining card */}
            <MiningCard 
              miningActive={miningActive}
              progress={progress}
              miningRate={miningRate}
              miningSession={miningSession}
              miningTime={miningTime}
              onStartMining={handleStartMining}
              onStopMining={handleStopMining}
            />
            
            {/* Mining rate card for stats */}
            <MiningRateCard miningRate={miningRate} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
