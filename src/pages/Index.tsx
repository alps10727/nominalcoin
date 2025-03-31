
import { User, History, UserPlus, Award } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { useMiningData } from "@/hooks/useMiningData";
import { useLanguage } from "@/contexts/LanguageContext";

// Imported components
import BalanceCard from "@/components/dashboard/BalanceCard";
import MiningCard from "@/components/dashboard/MiningCard";
import MiningRateCard from "@/components/dashboard/MiningRateCard";
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Simplified background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0tMjAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTQwIDIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00WiIvPjwvZz48L2c+PC9zdmc+')] bg-fixed opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent"></div>
      </div>

      <main className={`flex-1 ${isMobile ? 'px-2 pt-0 pb-20' : 'px-6 py-4 pb-8'} max-w-3xl mx-auto w-full relative z-10`}>
        {/* Header decoration - no gaps */}
        <HeaderDecoration />
        
        {/* App content with improved spacing - no gaps */}
        <div className="space-y-3">
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
