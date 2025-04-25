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
  const adLoadTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Capacitor) {
      const available = window.Capacitor.isPluginAvailable('AdMob');
      setPluginAvailable(available);
      debugLog('AdMob Hook', `AdMob plugin available: ${available}`);
    }
  }, []);

  useEffect(() => {
    const initAdMob = async () => {
      if (initializationAttempted.current) return;
      
      initializationAttempted.current = true;
      try {
        debugLog('AdMob Hook', 'Initializing AdMob service');
        await admobService.initialize();
        setIsInitialized(true);
        
        setTimeout(() => {
          admobService.preloadRewardAd();
        }, 1500);
      } catch (error) {
        console.error('Failed to initialize AdMob:', error);
        setAdErrorCount(prev => prev + 1);
      }
    };
    
    if (!isInitialized && window.Capacitor && pluginAvailable && !initializationAttempted.current) {
      initAdMob();
    }
    
    return () => {
      if (window.Capacitor && window.Admob) {
        try {
          window.Admob.removeAllListeners().catch(console.error);
        } catch (e) {
          console.error("Error removing AdMob listeners:", e);
        }
      }
      
      if (adLoadTimeoutRef.current) {
        clearTimeout(adLoadTimeoutRef.current);
      }
    };
  }, [isInitialized, pluginAvailable]);

  useEffect(() => {
    const setupListeners = async () => {
      if (!window.Capacitor || !window.Admob || !isInitialized) return;

      try {
        await window.Admob.addListener('onAdLoaded', () => {
          debugLog('AdMob Hook', 'Ad loaded successfully');
        });
        
        await window.Admob.addListener('onAdFailedToLoad', (info) => {
          const errorMessage = info?.message || 'Unknown error';
          const errorCode = info?.code || 'unknown';
          
          debugLog('AdMob Hook', `Ad failed to load: ${errorCode} - ${errorMessage}`);
          setAdErrorCount(prev => prev + 1);
          
          adLoadTimeoutRef.current = window.setTimeout(() => {
            admobService.preloadRewardAd();
          }, 5000);
        });
        
        await window.Admob.addListener('onRewardedVideoAdFailedToLoad', (info) => {
          debugLog('AdMob Hook', `Rewarded video failed to load: ${JSON.stringify(info)}`);
          setAdErrorCount(prev => prev + 1);
          
          adLoadTimeoutRef.current = window.setTimeout(() => {
            admobService.preloadRewardAd();
          }, 5000);
        });
        
        await window.Admob.addListener('onRewardedVideoAdClosed', () => {
          debugLog('AdMob Hook', 'Rewarded video ad closed');
          
          adLoadTimeoutRef.current = window.setTimeout(() => {
            admobService.preloadRewardAd();
          }, 1000);
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
      if (!window.Capacitor || !pluginAvailable) {
        debugLog('AdMob Hook', 'Plugin not available, simulating reward');
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsLoading(false);
        return true;
      }
      
      if (!isInitialized) {
        await admobService.initialize();
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
  }, [pluginAvailable, isInitialized]);

  const preloadNextAd = useCallback(() => {
    if (isInitialized && pluginAvailable) {
      debugLog('AdMob Hook', 'Manually preloading next ad');
      admobService.preloadRewardAd();
    }
  }, [isInitialized, pluginAvailable]);

  const showBannerAd = useCallback(async () => {
    if (!pluginAvailable) return;
    
    try {
      await admobService.showBannerAd();
    } catch (error) {
      console.error('Error showing banner ad:', error);
      toast.error('Banner reklam gösterilirken bir hata oluştu');
    }
  }, [pluginAvailable]);

  const hideBannerAd = useCallback(async () => {
    if (!pluginAvailable) return;
    
    try {
      await admobService.hideBannerAd();
    } catch (error) {
      console.error('Error hiding banner ad:', error);
    }
  }, [pluginAvailable]);

  const showInterstitialAd = useCallback(async () => {
    if (!window.Capacitor || !pluginAvailable) {
      debugLog('AdMob Hook', 'Plugin not available, simulating interstitial ad');
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    }
    
    try {
      if (!isInitialized) {
        await admobService.initialize();
      }
      
      return await admobService.showInterstitialAd();
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      return false;
    }
  }, [pluginAvailable, isInitialized]);

  return {
    showRewardAd,
    isLoading,
    preloadNextAd,
    isInitialized,
    pluginAvailable,
    adErrorCount,
    showBannerAd,
    hideBannerAd,
    showInterstitialAd
  };
}
