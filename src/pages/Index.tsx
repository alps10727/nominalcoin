
import { User, History, UserPlus, Award, BarChart2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import { useMiningData } from "@/hooks/useMiningData";
import { useLanguage } from "@/contexts/LanguageContext";

// Imported components
import BalanceCard from "@/components/dashboard/BalanceCard";
import MiningCard from "@/components/dashboard/MiningCard";
import MenuCard from "@/components/dashboard/MenuCard";
import StatisticsButton from "@/components/dashboard/StatisticsButton";
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
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 dark:from-gray-950 dark:to-indigo-950 flex flex-col`}>
      <Header />

      <main className={`flex-1 ${isMobile ? 'p-3' : 'p-5'} max-w-3xl mx-auto w-full ${isMobile ? 'pb-20' : 'pb-5'}`}>
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

        <div className="grid grid-cols-2 gap-3 mb-6">
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
      </main>

      <MobileNavigation />
    </div>
  );
};

export default Index;
