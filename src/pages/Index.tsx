
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
    <div className="min-h-screen bg-gradient-to-br from-darkPurple-900 via-navy-800 to-darkPurple-900 flex flex-col">
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0tMjAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTQwIDIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00WiIvPjwvZz48L2c+PC9zdmc+')] bg-fixed opacity-70"></div>
        
        {/* Radial light effect */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-darkPurple-500/10 rounded-full blur-[100px] animate-pulse" style={{animationDuration: '10s'}}></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-navy-500/10 rounded-full blur-[120px] animate-pulse" style={{animationDuration: '15s', animationDelay: '2s'}}></div>
        
        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-darkPurple-900 to-transparent"></div>
      </div>
      
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
