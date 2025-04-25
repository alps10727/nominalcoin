
import { useState, useEffect, useCallback } from 'react';
import { admobService } from '@/services/admob/admobService';
import { toast } from 'sonner';
import { debugLog } from '@/utils/debugUtils';

export function useAdMob() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize AdMob when the hook is first used
  useEffect(() => {
    const initAdMob = async () => {
      try {
        await admobService.initialize();
        setIsInitialized(true);
        
        // Start preloading the first ad
        admobService.preloadRewardAd();
      } catch (error) {
        console.error('Failed to initialize AdMob:', error);
      }
    };
    
    if (!isInitialized && window.Capacitor) {
      initAdMob();
    }
  }, [isInitialized]);

  const showRewardAd = useCallback(async () => {
    setIsLoading(true);
    debugLog('AdMob', 'Attempting to show reward ad');
    
    try {
      const rewarded = await admobService.showRewardAd();
      setIsLoading(false);
      
      if (rewarded) {
        debugLog('AdMob', 'User was rewarded');
      } else {
        debugLog('AdMob', 'User was not rewarded');
        if (window.Capacitor) {
          toast.error('Reklam tamamlanamadı, lütfen tekrar deneyin');
        }
      }
      
      return rewarded;
    } catch (error) {
      console.error('Error showing reward ad:', error);
      toast.error('Reklam gösterilirken bir hata oluştu, lütfen tekrar deneyin');
      setIsLoading(false);
      return false;
    }
  }, []);

  const preloadNextAd = useCallback(() => {
    if (isInitialized) {
      admobService.preloadRewardAd();
    }
  }, [isInitialized]);

  return {
    showRewardAd,
    isLoading,
    preloadNextAd,
    isInitialized
  };
}
