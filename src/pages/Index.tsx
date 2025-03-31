
import { User, History, UserPlus, Award } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { useMiningData } from "@/hooks/useMiningData";
import { useLanguage } from "@/contexts/LanguageContext";

// Imported components
import BalanceCard from "@/components/dashboard/BalanceCard";
import MiningCard from "@/components/dashboard/MiningCard";
import MenuCard from "@/components/dashboard/MenuCard";
import StatisticsButton from "@/components/dashboard/StatisticsButton";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import HeaderDecoration from "@/components/dashboard/HeaderDecoration";

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
    <div className="min-h-screen flex flex-col bg-gray-950">
      <main className={`flex-1 ${isMobile ? 'px-3 pt-0 pb-20' : 'px-6 py-4 pb-8'} max-w-3xl mx-auto w-full relative z-10`}>
        {/* Header decoration */}
        <HeaderDecoration />
        
        {/* App content with improved spacing */}
        <div className="space-y-4">
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
          
          {/* MiningRateCard removed as requested */}
          
          {/* Menu cards with improved grid layout */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <MenuCard 
              title={t('profile.title')}
              icon={User}
              to="/profile"
            />
            <MenuCard 
              title={t('history.title')}
              icon={History}
              to="/history"
            />
            <MenuCard 
              title={t('referral.title')}
              icon={UserPlus}
              to="/referral"
            />
            <MenuCard 
              title={t('tasks.title')}
              icon={Award}
              to="/tasks"
            />
          </div>

          <StatisticsButton />
        </div>
      </main>
    </div>
  );
};

export default Index;
