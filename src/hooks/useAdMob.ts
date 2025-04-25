
import { useState, useEffect, useCallback } from 'react';
import { admobService } from '@/services/admob/admobService';
import { toast } from 'sonner';
import { debugLog } from '@/utils/debugUtils';

export function useAdMob() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [adErrorCount, setAdErrorCount] = useState(0);

  // Initialize AdMob when the hook is first used
  useEffect(() => {
    const initAdMob = async () => {
      try {
        debugLog('AdMob', 'Initializing AdMob service');
        await admobService.initialize();
        setIsInitialized(true);
        
        // Start preloading the first ad
        admobService.preloadRewardAd();
      } catch (error) {
        console.error('Failed to initialize AdMob:', error);
        setAdErrorCount(prev => prev + 1);
      }
    };
    
    if (!isInitialized && window.Capacitor) {
      initAdMob();
    }
    
    // Cleanup listeners when component unmounts
    return () => {
      if (window.Capacitor && window.Admob) {
        // @ts-ignore - Admob plugin exists in Capacitor
        window.Admob.removeAllListeners().catch(console.error);
      }
    };
  }, [isInitialized]);

  // Set up event listeners for AdMob events
  useEffect(() => {
    const setupListeners = async () => {
      if (!window.Capacitor || !window.Admob || !isInitialized) return;

      try {
        // @ts-ignore - Admob plugin exists in Capacitor
        await window.Admob.addListener('onAdLoaded', () => {
          debugLog('AdMob', 'Ad loaded successfully');
        });
        
        // @ts-ignore - Admob plugin exists in Capacitor
        await window.Admob.addListener('onAdFailedToLoad', (info) => {
          debugLog('AdMob', `Ad failed to load: ${JSON.stringify(info)}`);
          setAdErrorCount(prev => prev + 1);
          
          // Try to preload another ad after a delay
          setTimeout(() => admobService.preloadRewardAd(), 5000);
        });
      } catch (error) {
        console.error('Failed to set up AdMob listeners:', error);
      }
    };
    
    if (isInitialized && window.Capacitor) {
      setupListeners();
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
      setAdErrorCount(prev => prev + 1);
      return false;
    }
  }, []);

  const preloadNextAd = useCallback(() => {
    if (isInitialized) {
      debugLog('AdMob', 'Manually preloading next ad');
      admobService.preloadRewardAd();
    }
  }, [isInitialized]);

  return {
    showRewardAd,
    isLoading,
    preloadNextAd,
    isInitialized,
    adErrorCount
  };
}
