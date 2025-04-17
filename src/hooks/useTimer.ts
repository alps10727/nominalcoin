
import { useState, useEffect, useCallback } from 'react';
import { debugLog } from '@/utils/debugUtils';

/**
 * A timer hook for countdown functionality
 */
export function useTimer(initialTime: number = 0) {
  const [time, setTime] = useState<number>(initialTime);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(initialTime);

  // Function to set time remaining
  const setTimeRemaining = useCallback((seconds: number) => {
    setTime(seconds);
    if (seconds > 0 && totalDuration === 0) {
      setTotalDuration(seconds);
    }
    setProgress(calculateProgress(seconds, totalDuration || seconds));
  }, [totalDuration]);

  // Function to start timer
  const startTimer = useCallback((duration?: number) => {
    if (duration !== undefined) {
      setTime(duration);
      setTotalDuration(duration);
      setProgress(0);
    }
    setIsActive(true);
    debugLog('useTimer', 'Timer started with duration:', duration ?? time);
  }, [time]);

  // Function to stop timer
  const stopTimer = useCallback(() => {
    setIsActive(false);
    debugLog('useTimer', 'Timer stopped at:', time);
  }, [time]);

  // Function to reset timer
  const resetTimer = useCallback(() => {
    setTime(totalDuration);
    setIsActive(false);
    setProgress(0);
    debugLog('useTimer', 'Timer reset to:', totalDuration);
  }, [totalDuration]);

  // Calculate progress percentage
  const calculateProgress = (currentTime: number, total: number): number => {
    if (total <= 0) return 0;
    return Math.max(0, Math.min(100, ((total - currentTime) / total) * 100));
  };

  // Timer effect
  useEffect(() => {
    let interval: number | undefined;

    if (isActive && time > 0) {
      interval = window.setInterval(() => {
        setTime(prevTime => {
          const newTime = Math.max(0, prevTime - 1);
          setProgress(calculateProgress(newTime, totalDuration));
          if (newTime === 0) {
            setIsActive(false);
            debugLog('useTimer', 'Timer completed');
          }
          return newTime;
        });
      }, 1000);
    } else if (time === 0 && isActive) {
      setIsActive(false);
    }

    return () => {
      if (interval !== undefined) {
        clearInterval(interval);
      }
    };
  }, [isActive, time, totalDuration]);

  return {
    time,
    isActive,
    progress,
    startTimer,
    stopTimer,
    resetTimer,
    setTimeRemaining
  };
}
