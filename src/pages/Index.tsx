
import { Diamond, Activity, Zap, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { useMiningData } from "@/hooks/useMiningData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef } from "react";

// Imported components
import BalanceCard from "@/components/dashboard/BalanceCard";
import MiningCard from "@/components/dashboard/MiningCard";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import MiningRateCard from "@/components/dashboard/MiningRateCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Import skeleton for better loading states
import { toast } from "sonner";
import { loadUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

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
    handleStopMining
  } = useMiningData();
  
  // Optimistik UI güncelleme için hazırlık
  const [balance, setBalance] = useState<number>(() => {
    const localData = loadUserData();
    const initialBalance = localData?.balance || 0;
    debugLog("Index", `Initial balance from localStorage: ${initialBalance}`);
    return initialBalance;
  });
  
  const isFirstRender = useRef(true);
  const storedBalanceRef = useRef(balance);
  
  const { userData, loading: authLoading, isOffline } = useAuth();
  const [isInitialized, setIsInitialized] = useState(!!loadUserData());
  
  // Optimistik veri güncelleme - API yanıtı beklemeden UI güncelleme
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
  
  // Veri senkronizasyonu - gereksiz beklemeler kaldırıldı
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
  
  // Yükleme durumunda gecikmeli başlatma - performans için gereksiz beklemeler kaldırıldı
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Tüm kaynakların yüklenmesi için optimistik kontrol
  const isLoading = !isInitialized && authLoading;

  return (
    <div className="min-h-screen flex flex-col relative pb-20">
      {/* Main content */}
      <main className={`flex-1 ${isMobile ? 'px-4 py-4' : 'px-6 py-6'} max-w-3xl mx-auto w-full relative z-10`}>
        {/* Welcome section */}
        <div className="mt-2 mb-6">
          <h1 className="text-2xl font-bold text-purple-300">NOMINAL Coin Dashboard</h1>
          <p className="text-purple-300/80 text-sm mt-1">
            Welcome to the NC mining hub - Earn cryptocurrency by mining!
          </p>
        </div>
        
        {/* Cards - Skeleton UI kullanımı eklenmiş */}
        <div className="space-y-5">
          {/* Balance card with loading state */}
          {isLoading ? (
            <Skeleton className="h-28 w-full" />
          ) : (
            <BalanceCard balance={balance} />
          )}
          
          {/* Mining section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-purple-200 flex items-center">
                <Zap className="h-5 w-5 mr-1.5 text-purple-400" />
                Mining Hub
              </h2>
              
              <Button variant="link" size="sm" className="text-purple-400 hover:text-purple-300 -mr-2">
                Boosts <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            {/* Mining card with optimized loading */}
            {isLoading ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : (
              <MiningCard 
                miningActive={miningActive}
                progress={progress}
                miningRate={miningRate}
                miningSession={miningSession}
                miningTime={miningTime}
                onStartMining={handleStartMining}
                onStopMining={handleStopMining}
              />
            )}
            
            {/* Mining rate card with loading */}
            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <MiningRateCard miningRate={miningRate} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
