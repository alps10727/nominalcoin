
import { useState, useEffect, useCallback } from 'react';
import { fetchAdMobConfig, getPlatformSpecificAdUnit } from '@/services/admob/config';
import { debugLog, errorLog } from "@/utils/debugUtils";
import { admobService } from '@/services/admob/admobService';
import { toast } from "sonner";

export function useAdMob() {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pluginAvailable, setPluginAvailable] = useState(false);

  // AdMob plugininin kullanılabilir olup olmadığını kontrol et
  useEffect(() => {
    const checkAvailability = async () => {
      if (
        typeof window !== 'undefined' && 
        window.Capacitor && 
        window.Capacitor.isPluginAvailable('AdMob')
      ) {
        setPluginAvailable(true);
        debugLog("AdMob Hook", "AdMob plugin available: true");

        try {
          // AdMob servisini başlat
          await admobService.initialize();
          setIsInitialized(true);
          
          // Konfigürasyonu yükle
          const adMobConfig = await fetchAdMobConfig();
          setConfig(adMobConfig);
        } catch (error) {
          errorLog("AdMob Hook", "AdMob initialization error:", error);
        }
      } else {
        setPluginAvailable(false);
        debugLog("AdMob Hook", "AdMob plugin available: false");
        console.warn("AdMob plugin is not available. Please check capacitor config and plugin installation.");
      }
    };
    
    checkAvailability();
  }, []);

  // Bir sonraki reklamı önceden yükle
  const preloadNextAd = useCallback(async () => {
    if (!pluginAvailable) {
      return;
    }

    setIsLoading(true);
    
    try {
      debugLog("AdMob Hook", "Preloading next ad");
      await admobService.preloadRewardAd();
      debugLog("AdMob Hook", "Reward ad preloaded successfully");
    } catch (error) {
      errorLog("AdMob Hook", "Error preloading ad:", error);
      toast.error("Reklam yüklenirken bir hata oluştu", {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [pluginAvailable]);

  // Ödüllü reklamı göster
  const showRewardAd = useCallback(async (): Promise<boolean> => {
    if (!pluginAvailable) {
      debugLog("AdMob Hook", "Plugin not available, skipping ad");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      debugLog("AdMob Hook", "Showing reward ad");
      
      // Test modunda daha iyi debug için bildirim göster
      if (config?.isTestMode) {
        toast.info("Test modu: Reklam gösteriliyor", { 
          description: "Test reklam yükleniyor",
          duration: 3000
        });
      }
      
      const rewarded = await admobService.showRewardAd();
      
      debugLog("AdMob Hook", "Reward ad result:", rewarded);
      
      setIsLoading(false);
      return rewarded;
    } catch (error) {
      errorLog("AdMob Hook", "Error showing reward ad:", error);
      toast.error("Reklam gösterilirken bir hata oluştu");
      setIsLoading(false);
      return false;
    }
  }, [pluginAvailable, config]);

  // Banner reklamı göster
  const showBannerAd = useCallback(async (): Promise<void> => {
    if (!pluginAvailable) {
      debugLog("AdMob Hook", "Plugin not available, skipping banner ad");
      return;
    }
    
    try {
      debugLog("AdMob Hook", "Showing banner ad");
      await admobService.showBannerAd();
      
      // Test modunda daha iyi debug için bildirim göster
      if (config?.isTestMode) {
        toast.info("Test modu: Banner reklam gösteriliyor", { 
          duration: 2000
        });
      }
    } catch (error) {
      errorLog("AdMob Hook", "Error showing banner ad:", error);
    }
  }, [pluginAvailable, config]);

  // Banner reklamı gizle
  const hideBannerAd = useCallback(async (): Promise<void> => {
    if (!pluginAvailable) {
      return;
    }
    
    try {
      debugLog("AdMob Hook", "Hiding banner ad");
      await admobService.hideBannerAd();
    } catch (error) {
      errorLog("AdMob Hook", "Error hiding banner ad:", error);
    }
  }, [pluginAvailable]);

  // Interstitial reklam göster
  const showInterstitialAd = useCallback(async (): Promise<boolean> => {
    if (!pluginAvailable) {
      debugLog("AdMob Hook", "Plugin not available, simulating interstitial ad");
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    }
    
    setIsLoading(true);
    
    try {
      debugLog("AdMob Hook", "Showing interstitial ad");
      
      // Test modunda daha iyi debug için bildirim göster
      if (config?.isTestMode) {
        toast.info("Test modu: Interstitial reklam gösteriliyor", { 
          duration: 3000
        });
      }
      
      const result = await admobService.showInterstitialAd();
      
      debugLog("AdMob Hook", "Interstitial ad result:", result);
      setIsLoading(false);
      return result;
    } catch (error) {
      errorLog("AdMob Hook", "Error showing interstitial ad:", error);
      toast.error("Reklam gösterilirken bir hata oluştu");
      setIsLoading(false);
      return false;
    }
  }, [pluginAvailable, config]);

  return {
    showRewardAd,
    showInterstitialAd,
    showBannerAd,
    hideBannerAd,
    isLoading,
    config,
    preloadNextAd,
    isInitialized,
    pluginAvailable,
  };
}
