
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface UserData {
  balance: number;
  miningRate: number;
  lastSaved: number;
  miningActive?: boolean;
  miningTime?: number;
  miningSession?: number;
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
          
          // Restore mining state if it was active when the app was closed
          if (userData.miningActive) {
            setMiningActive(userData.miningActive);
            setMiningTime(userData.miningTime || 30);
            setMiningSession(userData.miningSession || 0);
            
            // Calculate progress based on remaining time
            if (userData.miningTime) {
              const timeElapsed = 30 - userData.miningTime;
              const newProgress = (timeElapsed / 30) * 100;
              setProgress(newProgress);
            }
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

  // Save user data periodically and when mining state changes
  useEffect(() => {
    if (!isLoading) {
      const saveUserData = () => {
        try {
          const userData: UserData = {
            balance,
            miningRate,
            lastSaved: Date.now(),
            miningActive,
            miningTime,
            miningSession
          };
          localStorage.setItem('fcMinerUserData', JSON.stringify(userData));
        } catch (err) {
          console.error('Kullanıcı verisi kaydedilirken hata oluştu:', err);
        }
      };

      const saveInterval = setInterval(saveUserData, 10000); // Save more frequently
      
      // Save when mining state changes
      saveUserData();
      
      return () => {
        clearInterval(saveInterval);
        saveUserData();
      };
    }
  }, [balance, miningRate, miningActive, miningTime, miningSession, isLoading]);

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
                  lastSaved: Date.now(),
                  miningActive,
                  miningTime: 30, // Reset to 30 seconds
                  miningSession: miningSession + 1
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
        
        // Update progress calculation
        setProgress(prev => {
          // Calculate progress percentage (from 0 to 100)
          const timeElapsed = 30 - miningTime;
          const newProgress = (timeElapsed / 30) * 100;
          return newProgress;
        });
      }, 1000); // Update every second
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [miningActive, miningRate, miningTime, miningSession, t]);

  const handleStartMining = () => {
    setMiningActive(true);
    setMiningTime(30); // Reset to 30 seconds when starting
    setProgress(0); // Reset progress when starting
    
    // Save the new mining state immediately
    try {
      const userData: UserData = {
        balance,
        miningRate,
        lastSaved: Date.now(),
        miningActive: true,
        miningTime: 30,
        miningSession
      };
      localStorage.setItem('fcMinerUserData', JSON.stringify(userData));
    } catch (err) {
      console.error('Veri kaydedilirken hata oluştu:', err);
    }
  };

  const handleStopMining = () => {
    setMiningActive(false);
    
    // Save the stopped mining state immediately
    try {
      const userData: UserData = {
        balance,
        miningRate,
        lastSaved: Date.now(),
        miningActive: false,
        miningTime: 30,
        miningSession: 0
      };
      localStorage.setItem('fcMinerUserData', JSON.stringify(userData));
    } catch (err) {
      console.error('Veri kaydedilirken hata oluştu:', err);
    }
    
    setMiningSession(0);
    setMiningTime(30); // Reset to 30 seconds
    setProgress(0); // Reset progress when stopping
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
