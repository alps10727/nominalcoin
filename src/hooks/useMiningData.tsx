
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

interface UserData {
  balance: number;
  miningRate: number;
  lastSaved: number;
}

export function useMiningData() {
  const [isLoading, setIsLoading] = useState(true);
  const [miningActive, setMiningActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [balance, setBalance] = useState(0);
  const [miningRate, setMiningRate] = useState(0.1);
  const [miningSession, setMiningSession] = useState(0);
  const [miningTime, setMiningTime] = useState(0);
  const { t } = useLanguage();

  // Load user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedData = localStorage.getItem('fcMinerUserData');
        if (savedData) {
          const userData: UserData = JSON.parse(savedData);
          setBalance(userData.balance);
          setMiningRate(userData.miningRate);
          
          const now = Date.now();
          const lastSaved = userData.lastSaved || 0;
          const dayInMs = 24 * 60 * 60 * 1000;
          
          if (now - lastSaved < dayInMs) {
            toast({
              title: t('balance.restored'),
              description: t('balance.restoredDesc'),
            });
          }
        }
      } catch (err) {
        console.error('Kullanıcı verisi yüklenirken hata oluştu:', err);
      }
    };

    const timer = setTimeout(() => {
      setIsLoading(false);
      loadUserData();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [t]);

  // Save user data periodically
  useEffect(() => {
    if (!isLoading) {
      const saveUserData = () => {
        try {
          const userData: UserData = {
            balance,
            miningRate,
            lastSaved: Date.now()
          };
          localStorage.setItem('fcMinerUserData', JSON.stringify(userData));
        } catch (err) {
          console.error('Kullanıcı verisi kaydedilirken hata oluştu:', err);
        }
      };

      const saveInterval = setInterval(saveUserData, 30000);
      
      return () => {
        clearInterval(saveInterval);
        saveUserData();
      };
    }
  }, [balance, miningRate, isLoading]);

  // Mining process
  useEffect(() => {
    let interval: number | undefined;
    
    if (miningActive) {
      interval = window.setInterval(() => {
        setMiningTime(prev => prev + 1);
        setProgress(prev => {
          if (prev >= 100) {
            setBalance(prevBalance => {
              const newBalance = prevBalance + miningRate;
              try {
                const userData: UserData = {
                  balance: newBalance,
                  miningRate,
                  lastSaved: Date.now()
                };
                localStorage.setItem('fcMinerUserData', JSON.stringify(userData));
              } catch (err) {
                console.error('Veri kaydedilirken hata oluştu:', err);
              }
              return newBalance;
            });
            setMiningSession(prev => prev + 1);
            toast({
              title: t('mining.successful'),
              description: t('mining.successfulDesc', miningRate.toString()),
            });
            return 0;
          }
          return prev + 1;
        });
      }, 300);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [miningActive, miningRate, t]);

  const handleStartMining = () => {
    setMiningActive(true);
    toast({
      title: t('mining.started'),
      description: t('mining.startedDesc'),
    });
  };

  const handleStopMining = () => {
    setMiningActive(false);
    toast({
      title: t('mining.stopped'),
      description: t('mining.stoppedDesc', (miningRate * miningSession).toString()),
    });
    
    try {
      const userData: UserData = {
        balance,
        miningRate,
        lastSaved: Date.now()
      };
      localStorage.setItem('fcMinerUserData', JSON.stringify(userData));
    } catch (err) {
      console.error('Veri kaydedilirken hata oluştu:', err);
    }
    
    setMiningSession(0);
    setMiningTime(0);
  };

  return {
    isLoading,
    miningActive,
    progress,
    balance,
    miningRate,
    miningSession,
    miningTime,
    handleStartMining,
    handleStopMining
  };
}
