import React, { useState, useRef, useMemo, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMiningData } from "@/hooks/useMiningData";
import { useAuth } from "@/contexts/AuthContext";
import { loadUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";
import { QueryCacheManager } from "@/services/optimizationService";
import { Skeleton } from "@/components/ui/skeleton";
import BalanceCard from "@/components/dashboard/BalanceCard";
import { WelcomeSection } from "@/components/dashboard/sections/WelcomeSection";
import { OfflineIndicator } from "@/components/dashboard/sections/OfflineIndicator";
import { MiningSectionContainer } from "@/components/dashboard/sections/MiningSectionContainer";

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
  
  const isLoading = !isInitialized && authLoading;
  
  const showOfflineIndicator = isOffline && authOffline;
  
  const memoizedBalanceCard = useMemo(() => (
    <BalanceCard balance={balance} />
  ), [balance]);
  
  return (
    <div className="min-h-screen flex flex-col relative pb-20">
      <OfflineIndicator show={showOfflineIndicator} />
      
      <main className={`flex-1 ${isMobile ? 'px-4 py-4' : 'px-6 py-6'} max-w-3xl mx-auto w-full relative z-10`}>
        <WelcomeSection />
        
        <div className="space-y-5">
          {isLoading ? (
            <Skeleton className="h-28 w-full" />
          ) : (
            memoizedBalanceCard
          )}
          
          <MiningSectionContainer 
            isLoading={isLoading}
            miningActive={miningActive}
            progress={progress}
            miningRate={miningRate}
            miningSession={miningSession}
            miningTime={miningTime}
            onStartMining={handleStartMining}
            onStopMining={handleStopMining}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
