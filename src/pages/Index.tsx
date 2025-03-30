
import { User, History, UserPlus, Award, BarChart2, Stars } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-darkPurple-900 via-navy-900 to-darkPurple-950">
      {/* Enhanced Background patterns with reduced opacity for better readability */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern with reduced opacity */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0tMjAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTQwIDIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00WiIvPjwvZz48L2c+PC9zdmc+')] bg-fixed opacity-20"></div>
        
        {/* Dots pattern with reduced opacity */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjAzIi8+PC9zdmc+')]"></div>
        
        {/* Fixed stars with fewer stars for less distraction */}
        <div className="fixed inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3 + 0.05
              }}
            />
          ))}
        </div>
        
        {/* Diagonal lines with reduced opacity */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 11px)`
        }}></div>
        
        {/* Softer gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-darkPurple-500/3 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-navy-500/3 to-transparent"></div>
        
        {/* Bottom gradient overlay for better content visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-darkPurple-900 via-darkPurple-900/70 to-transparent"></div>
      </div>

      <main className={`flex-1 ${isMobile ? 'px-4 py-4' : 'px-6 py-5'} max-w-3xl mx-auto w-full ${isMobile ? 'pb-24' : 'pb-8'} relative z-10`}>
        {/* Increased spacing between cards for better visual separation */}
        <div className="space-y-6">
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
          <div className="grid grid-cols-2 gap-4 mb-6">
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
