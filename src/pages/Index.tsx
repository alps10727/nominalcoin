
import { Diamond } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { useMiningData } from "@/hooks/useMiningData";
import { useLanguage } from "@/contexts/LanguageContext";

// Imported components
import BalanceCard from "@/components/dashboard/BalanceCard";
import MiningCard from "@/components/dashboard/MiningCard";
import LoadingScreen from "@/components/dashboard/LoadingScreen";

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
    <div className="min-h-screen flex flex-col bg-purple-950 relative">
      {/* Background starfield */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-star-twinkle"
            style={{
              width: Math.random() < 0.8 ? '1px' : Math.random() < 0.95 ? '2px' : '3px',
              height: Math.random() < 0.8 ? '1px' : Math.random() < 0.95 ? '2px' : '3px',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8,
              animationDuration: `${Math.random() * 5 + 2}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      <main className={`flex-1 ${isMobile ? 'px-3 pt-0 pb-20' : 'px-6 py-4 pb-8'} max-w-3xl mx-auto w-full relative z-10`}>
        <div className="space-y-4 mt-4">
          <BalanceCard balance={balance} />
          <MiningCard 
            miningActive={miningActive}
            progress={progress}
            miningRate={miningRate}
            miningSession={miningSession}
            miningTime={miningTime}
            onStartMining={handleStartMining}
            onStopMining={handleStopMining}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
