
import { Diamond, Activity, Zap, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { useMiningData } from "@/hooks/useMiningData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef, useMemo } from "react";
import { useAdMob } from "@/hooks/useAdMob";

// Imported components
import BalanceCard from "@/components/dashboard/BalanceCard";
import MiningCard from "@/components/dashboard/MiningCard";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import MiningRateCard from "@/components/dashboard/MiningRateCard";
import MiningRateDisplay from "@/components/mining/MiningRateDisplay";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; 
import { toast } from "sonner";
import { loadUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";
import { QueryCacheManager } from "@/services/optimizationService";
import MenuCard from "@/components/dashboard/MenuCard";

const Index = () => {
  const {
    isLoading: miningLoading,
    miningActive,
    progress,
    balance: miningBalance,
    miningRate,
    miningSession,
    miningTime,
    handleStartMining,
    handleStopMining,
    isOffline
  } = useMiningData();
  
  const [balance, setBalance] = useState<number>(() => {
    const localData = loadUserData();
    const initialBalance = localData?.balance || 0;
    debugLog("Index", `Initial balance from localStorage: ${initialBalance}`);
    return initialBalance;
  });
  
  const isFirstRender = useRef(true);
  const storedBalanceRef = useRef(balance);
  
  const { userData, loading: authLoading, isOffline: authOffline } = useAuth();
  const [isInitialized, setIsInitialized] = useState(!!loadUserData());
  const { t } = useLanguage();
  
  useEffect(() => {
    if (!isFirstRender.current && !miningLoading && miningBalance > 0) {
      debugLog("Index", `Checking mining balance: ${miningBalance}, Current: ${storedBalanceRef.current}`);
      
      if (miningBalance > storedBalanceRef.current) {
        debugLog("Index", `Updating balance from mining: ${miningBalance}`);
        setBalance(miningBalance);
        storedBalanceRef.current = miningBalance;
      }
    }
    
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [miningBalance, miningLoading]);
  
  useEffect(() => {
    if (!authLoading && userData?.balance !== undefined) {
      debugLog("Index", `Checking auth balance: ${userData.balance}, Current: ${storedBalanceRef.current}`);
      
      if (userData.balance > storedBalanceRef.current) {
        debugLog("Index", `Using higher balance from auth: ${userData.balance}`);
        setBalance(userData.balance);
        storedBalanceRef.current = userData.balance;
      }
    }
  }, [userData, authLoading]);
  
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      QueryCacheManager.manageSize(500);
    }, 300000);
    
    return () => clearInterval(cleanupInterval);
  }, []);
  
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const isMobile = useIsMobile();
  const { theme } = useTheme();

  const isLoading = !isInitialized && authLoading;
  
  const showOfflineIndicator = isOffline && authOffline;
  
  const memoizedBalanceCard = useMemo(() => (
    <BalanceCard balance={balance} />
  ), [balance]);
  
  const memoizedMiningCard = useMemo(() => (
    <MiningCard 
      miningActive={miningActive}
      progress={progress}
      miningRate={miningRate}
      miningSession={miningSession}
      miningTime={miningTime}
      onStartMining={handleStartMining}
      onStopMining={handleStopMining}
    />
  ), [miningActive, progress, miningRate, miningSession, miningTime, handleStartMining, handleStopMining]);

  const { showBannerAd } = useAdMob();

  useEffect(() => {
    showBannerAd();
  }, [showBannerAd]);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col relative pb-20">
      {showOfflineIndicator && (
        <div className="bg-orange-500/80 text-white text-center text-sm py-1.5 px-2 shadow-sm">
          {t("app.offlineMessage")}
        </div>
      )}
      
      <main className={`flex-1 ${isMobile ? 'px-4 py-4' : 'px-6 py-6'} w-full mx-auto relative z-10`}>
        <div className="mt-2 mb-6">
          <h1 className="text-2xl font-bold text-purple-300">NOMINAL Coin Dashboard</h1>
          <p className="text-purple-300/80 text-sm mt-1">
            {t("dashboard.welcomeMessage")}
          </p>
        </div>
        
        <div className="space-y-5">
          {isLoading ? (
            <Skeleton className="h-28 w-full" />
          ) : (
            memoizedBalanceCard
          )}
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-purple-200 flex items-center">
                <Zap className="h-5 w-5 mr-1.5 text-purple-400" />
                {t("dashboard.miningHub")}
              </h2>
              
              <MenuCard
                title={t("dashboard.boosts")}
                icon={ChevronRight}
                to="/upgrades"
                showAd={true}
              />
            </div>
            
            {isLoading ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : (
              memoizedMiningCard
            )}
            
            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MiningRateDisplay />
                <MiningRateCard miningRate={miningRate} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
