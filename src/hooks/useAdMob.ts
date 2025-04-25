
import { useState, useEffect, useCallback, useRef } from 'react';
import { admobService } from '@/services/admob/admobService';
import { toast } from 'sonner';
import { debugLog } from '@/utils/debugUtils';

export function useAdMob() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [adErrorCount, setAdErrorCount] = useState(0);
  const [pluginAvailable, setPluginAvailable] = useState(false);
  const initializationAttempted = useRef(false);

  // Check if the plugin is available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Capacitor) {
      const available = window.Capacitor.isPluginAvailable('AdMob');
      setPluginAvailable(available);
      debugLog('AdMob Hook', `AdMob plugin available: ${available}`);
    }
  }, []);

  // Initialize AdMob when the hook is first used
  useEffect(() => {
    const initAdMob = async () => {
      if (initializationAttempted.current) return;
      
      initializationAttempted.current = true;
      try {
        debugLog('AdMob Hook', 'Initializing AdMob service');
        await admobService.initialize();
        setIsInitialized(true);
        
        // Start preloading the first ad
        admobService.preloadRewardAd();
      } catch (error) {
        console.error('Failed to initialize AdMob:', error);
        setAdErrorCount(prev => prev + 1);
      }
    };
    
    if (!isInitialized && window.Capacitor && pluginAvailable && !initializationAttempted.current) {
      initAdMob();
    }
    
    // Cleanup listeners when component unmounts
    return () => {
      if (window.Capacitor && window.Admob) {
        try {
          // @ts-ignore - Admob plugin exists in Capacitor
          window.Admob.removeAllListeners().catch(console.error);
        } catch (e) {
          console.error("Error removing AdMob listeners:", e);
        }
      }
    };
  }, [isInitialized, pluginAvailable]);

  // Set up event listeners for AdMob events
  useEffect(() => {
    const setupListeners = async () => {
      if (!window.Capacitor || !window.Admob || !isInitialized) return;

      try {
        // @ts-ignore - Admob plugin exists in Capacitor
        await window.Admob.addListener('onAdLoaded', () => {
          debugLog('AdMob Hook', 'Ad loaded successfully');
        });
        
        // @ts-ignore - Admob plugin exists in Capacitor
        await window.Admob.addListener('onAdFailedToLoad', (info) => {
          const errorMessage = info?.message || 'Unknown error';
          const errorCode = info?.code || 'unknown';
          
          debugLog('AdMob Hook', `Ad failed to load: ${errorCode} - ${errorMessage}`);
          setAdErrorCount(prev => prev + 1);
          
          // Try to preload another ad after a delay
          setTimeout(() => admobService.preloadRewardAd(), 5000);
        });
        
        // Listen for reward events
        // @ts-ignore - Admob plugin exists in Capacitor
        await window.Admob.addListener('onRewardedVideoAdFailedToLoad', (info) => {
          debugLog('AdMob Hook', `Rewarded video failed to load: ${JSON.stringify(info)}`);
          setAdErrorCount(prev => prev + 1);
        });
        
        // @ts-ignore - Admob plugin exists in Capacitor
        await window.Admob.addListener('onRewardedVideoAdClosed', () => {
          debugLog('AdMob Hook', 'Rewarded video ad closed');
          // Preload next ad when current one is closed
          setTimeout(() => admobService.preloadRewardAd(), 1000);
        });
        
      } catch (error) {
        console.error('Failed to set up AdMob listeners:', error);
      }
    };
    
    if (isInitialized && window.Capacitor && pluginAvailable) {
      setupListeners();
    }
  }, [isInitialized, pluginAvailable]);

  const showRewardAd = useCallback(async () => {
    setIsLoading(true);
    debugLog('AdMob Hook', 'Attempting to show reward ad');
    
    try {
      if (!pluginAvailable) {
        debugLog('AdMob Hook', 'Plugin not available, simulating reward');
        setIsLoading(false);
        return true; // Simulate success in development
      }
      
      const rewarded = await admobService.showRewardAd();
      setIsLoading(false);
      
      if (rewarded) {
        debugLog('AdMob Hook', 'User was rewarded');
      } else {
        debugLog('AdMob Hook', 'User was not rewarded');
        if (window.Capacitor && pluginAvailable) {
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
  }, [pluginAvailable]);

  const preloadNextAd = useCallback(() => {
    if (isInitialized && pluginAvailable) {
      debugLog('AdMob Hook', 'Manually preloading next ad');
      admobService.preloadRewardAd();
    }
  }, [isInitialized, pluginAvailable]);

  return {
    showRewardAd,
    isLoading,
    preloadNextAd,
    isInitialized,
    pluginAvailable,
    adErrorCount
  };
}
