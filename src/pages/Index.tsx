
import { Diamond, Activity, Zap, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { useMiningData } from "@/hooks/useMiningData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useEffect, useState, useRef, useMemo } from "react";

// Imported components
import BalanceCard from "@/components/dashboard/BalanceCard";
import MiningCard from "@/components/dashboard/MiningCard";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import MiningRateCard from "@/components/dashboard/MiningRateCard";
import MiningRateDisplay from "@/components/mining/MiningRateDisplay"; // Yeni eklenen bileşen
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; 
import { toast } from "sonner";
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
    handleStopMining,
    isOffline
  } = useMiningData();
  
  // Optimistik UI güncelleme için bakiye durumu
  const [balance, setBalance] = useState<number>(0);
  
  const isFirstRender = useRef(true);
  const storedBalanceRef = useRef(balance);
  
  const { userData, isLoading: authLoading, isOffline: authOffline } = useSupabaseAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // İlk yüklemede userData'dan balance değerini al
  useEffect(() => {
    if (userData?.balance !== undefined) {
      setBalance(userData.balance);
      storedBalanceRef.current = userData.balance;
      setIsInitialized(true);
    }
  }, [userData]);
  
  // Optimistik veri güncelleme - UI'ı anında güncellemek için
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
  
  // Supabase'den gelen veri senkronizasyonu
  useEffect(() => {
    if (!authLoading && userData?.balance !== undefined) {
      debugLog("Index", `Checking auth balance: ${userData.balance}, Current: ${storedBalanceRef.current}`);
      
      // Supabase verisinde daha yüksek bakiye varsa güncelle
      if (userData.balance > storedBalanceRef.current) {
        debugLog("Index", `Using higher balance from auth: ${userData.balance}`);
        setBalance(userData.balance);
        storedBalanceRef.current = userData.balance;
      }
    }
  }, [userData, authLoading]);

  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Yükleme durumu kontrolü
  const isLoading = !isInitialized && authLoading;
  
  // İki sistemden de çevrimdışıysa göster
  const showOfflineIndicator = isOffline && authOffline;
  
  // Memoize edilen kartlar - gereksiz render'ları önlemek için
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

  return (
    <div className="min-h-screen flex flex-col relative pb-20">
      {showOfflineIndicator && (
        <div className="bg-orange-500/80 text-white text-center text-sm py-1.5 px-2 shadow-sm">
          Çevrimdışı moddasınız. Senkronizasyon internet bağlantısıyla yeniden sağlanacak.
        </div>
      )}
      
      {/* Ana içerik */}
      <main className={`flex-1 ${isMobile ? 'px-4 py-4' : 'px-6 py-6'} max-w-3xl mx-auto w-full relative z-10`}>
        {/* Karşılama bölümü */}
        <div className="mt-2 mb-6">
          <h1 className="text-2xl font-bold text-purple-300">NOMINAL Coin Dashboard</h1>
          <p className="text-purple-300/80 text-sm mt-1">
            Welcome to the NC mining hub - Earn cryptocurrency by mining!
          </p>
        </div>
        
        {/* Kartlar */}
        <div className="space-y-5">
          {/* Bakiye kartı */}
          {isLoading ? (
            <Skeleton className="h-28 w-full" />
          ) : (
            memoizedBalanceCard
          )}
          
          {/* Madencilik bölümü */}
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
            
            {/* Mining card */}
            {isLoading ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : (
              memoizedMiningCard
            )}
            
            {/* Madencilik hızı kartları */}
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
