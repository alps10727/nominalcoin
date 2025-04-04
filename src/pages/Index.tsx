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
  
  // Get local storage data directly first for fastest possible rendering and keep it consistent
  const [balance, setBalance] = useState<number>(() => {
    const localData = loadUserData();
    debugLog("Index", "Initial balance from localStorage:", localData?.balance || 0);
    return localData?.balance || 0;
  });
  
  const isFirstRender = useRef(true);
  const storedBalanceRef = useRef(balance);
  
  // Also get balance from auth context as a backup
  const { userData, loading: authLoading, isOffline } = useAuth();
  const [isInitialized, setIsInitialized] = useState(!!loadUserData());
  
  // Update balance when mining balance changes (after initialization)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (!miningLoading && miningBalance > 0) {
      debugLog("Index", "Updating balance from mining:", miningBalance, "Previous:", storedBalanceRef.current);
      
      // Sadece daha yüksek değerler için güncelle (kaybolan bakiye sorununu önlemek için)
      if (miningBalance >= storedBalanceRef.current) {
        setBalance(miningBalance);
        storedBalanceRef.current = miningBalance;
      }
    }
  }, [miningBalance, miningLoading]);
  
  // Backup method: If auth userData has balance and it's higher than our current balance
  useEffect(() => {
    if (!authLoading && userData?.balance) {
      debugLog("Index", "Checking auth balance:", userData.balance, "Current:", storedBalanceRef.current);
      
      // Sadece daha yüksek değerler için güncelle
      if (userData.balance > storedBalanceRef.current) {
        setBalance(userData.balance);
        storedBalanceRef.current = userData.balance;
        debugLog("Index", "Using higher balance from auth:", userData.balance);
      }
    }
  }, [userData, authLoading]);
  
  // Short timeout (2 seconds) to force initialization even if data loading fails
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsInitialized(true);
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, []);

  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Only show loading if we have no data from any source
  const isLoading = !isInitialized && balance === 0;

  if (isLoading) {
    return <LoadingScreen message={isOffline ? "Çevrimdışı modda yükleniyor..." : "Veriler hazırlanıyor..."} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative pb-20">
      {/* Main content */}
      <main className={`flex-1 ${isMobile ? 'px-4 py-4' : 'px-6 py-6'} max-w-3xl mx-auto w-full relative z-10`}>
        {/* Welcome section */}
        <div className="mt-2 mb-6">
          <h1 className="text-2xl font-bold fc-gradient-text">NOMINAL Coin Dashboard</h1>
          <p className="text-purple-300/80 text-sm mt-1">
            Welcome to the NC mining hub - Earn cryptocurrency by mining!
          </p>
        </div>
        
        {/* Cards */}
        <div className="space-y-5">
          {/* Balance card */}
          <BalanceCard balance={balance} />
          
          {/* Mining section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold fc-gradient-text flex items-center">
                <Zap className="h-5 w-5 mr-1.5 text-purple-400" />
                Mining Hub
              </h2>
              
              <Button variant="link" size="sm" className="text-purple-400 hover:text-purple-300 -mr-2">
                Boosts <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            {/* Mining card */}
            <MiningCard 
              miningActive={miningActive}
              progress={progress}
              miningRate={miningRate}
              miningSession={miningSession}
              miningTime={miningTime}
              onStartMining={handleStartMining}
              onStopMining={handleStopMining}
            />
            
            {/* Mining rate card for stats */}
            <MiningRateCard miningRate={miningRate} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
