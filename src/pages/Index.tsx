
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
import MiningRateCard from "@/components/dashboard/MiningRateCard";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-950 dark:from-gray-950 dark:via-indigo-950 dark:to-black flex flex-col">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabS0yMCAyMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptMC0yMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptNDAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRaIi8+PC9nPjwvZz48L3N2Zz4=')] bg-fixed opacity-5 pointer-events-none"></div>
      
      <Header />

      <main className={`flex-1 ${isMobile ? 'p-3' : 'p-5'} max-w-3xl mx-auto w-full ${isMobile ? 'pb-20' : 'pb-5'} relative z-10`}>
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
        
        <MiningRateCard miningRate={miningRate} />

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
