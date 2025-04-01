
import { User, UserPlus, Award } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { useMiningData } from "@/hooks/useMiningData";
import { useLanguage } from "@/contexts/LanguageContext";

// Imported components
import BalanceCard from "@/components/dashboard/BalanceCard";
import MiningCard from "@/components/dashboard/MiningCard";
import MenuCard from "@/components/dashboard/MenuCard";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import StatisticsButton from "@/components/dashboard/StatisticsButton";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 to-navy-950 relative">
      {/* Background decoration elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-900/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-900/10 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-60 h-60 rounded-full bg-darkPurple-800/10 blur-3xl"></div>
      </div>
      
      <main className={`flex-1 ${isMobile ? 'px-3 pt-0 pb-20' : 'px-6 py-4 pb-8'} max-w-3xl mx-auto w-full relative z-10`}>
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
          
          {/* Menu cards with improved grid layout */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <MenuCard 
              title={t('profile.title')}
              icon={User}
              to="/profile"
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
