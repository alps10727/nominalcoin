
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const [miningTime, setMiningTime] = useState(30); // Start from 30 seconds
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
        setMiningTime(prev => {
          if (prev <= 1) {
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
            return 30; // Reset to 30 seconds
          }
          return prev - 1; // Count down
        });
        
        setProgress(prev => {
          // Calculate progress based on time remaining (30 seconds to 0)
          const newProgress = ((30 - miningTime + 1) / 30) * 100;
          return newProgress;
        });
      }, 1000); // Update every second
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [miningActive, miningRate, miningTime, t]);

  const handleStartMining = () => {
    setMiningActive(true);
    setMiningTime(30); // Reset to 30 seconds when starting
    setProgress(0); // Reset progress
  };

  const handleStopMining = () => {
    setMiningActive(false);
    
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
    setMiningTime(30); // Reset to 30 seconds
    setProgress(0); // Reset progress
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
