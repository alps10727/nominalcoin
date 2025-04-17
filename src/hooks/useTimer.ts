
import { useState, useEffect, useRef } from 'react';

interface TimerProps {
  initialTime?: number;
  autoStart?: boolean;
}

export function useTimer(initialTime: number = 0, { autoStart = false }: TimerProps = {}) {
  const [time, setTime] = useState<number>(initialTime);
  const [isActive, setIsActive] = useState<boolean>(autoStart);
  const [progress, setProgress] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  const initialTimeRef = useRef<number>(initialTime);
  
  // Timer'ı başlat
  const startTimer = (newDuration?: number) => {
    if (newDuration !== undefined) {
      setTime(newDuration);
      initialTimeRef.current = newDuration;
    }
    setIsActive(true);
  };
  
  // Timer'ı durdur
  const stopTimer = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  // Zamanı manuel ayarla
  const setTimeRemaining = (newTime: number) => {
    setTime(newTime);
    // Progress'i güncelle
    const progressValue = initialTimeRef.current > 0 ? 
      1 - (newTime / initialTimeRef.current) : 0;
    setProgress(Math.min(Math.max(progressValue, 0), 1)); // 0-1 arasında sınırla
  };
  
  // Timer aktif olduğunda interval başlat
  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            stopTimer();
            return 0;
          }
          // Yeni zamanı hesapla
          const newTime = prevTime - 1;
          
          // Progress'i güncelle (1'den 0'a doğru)
          const progressValue = initialTimeRef.current > 0 ? 
            1 - (newTime / initialTimeRef.current) : 0;
          setProgress(Math.min(Math.max(progressValue, 0), 1)); // 0-1 arasında sınırla
          
          return newTime;
        });
      }, 1000);
    }

    // Cleanup interval
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive]);
  
  // Initial timer değişirse state'i güncelle
  useEffect(() => {
    initialTimeRef.current = initialTime;
    if (!isActive) {
      setTime(initialTime);
      // Progress'i güncelle
      setProgress(0);
    }
  }, [initialTime]);
  
  return { 
    time, 
    startTimer, 
    stopTimer,
    setTimeRemaining,
    isActive,
    progress 
  };
}
