
import { useState, useEffect, useCallback } from 'react';
import { fetchAdMobConfig, getPlatformSpecificAdUnit } from '@/services/admob/config';
import { debugLog, errorLog } from "@/utils/debugUtils";
import { AdmobPlugin } from '@/types/capacitor';
import { admobInitService } from '@/services/admob/services/initializationService';
import { toast } from "sonner";

declare global {
  interface Window {
    Capacitor?: {
      isPluginAvailable: (name: string) => boolean;
      getPlatform: () => string;
    };
    Admob?: AdmobPlugin;
  }
}

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
          await admobInitService.initialize();
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
    if (!pluginAvailable || !window.Admob) {
      return;
    }

    setIsLoading(true);
    
    try {
      debugLog("AdMob Hook", "Preloading next ad");
      
      const adConfig = await fetchAdMobConfig();
      
      if (!adConfig) {
        setIsLoading(false);
        return;
      }
      
      const platform = window.Capacitor?.getPlatform() || 'android';
      const adUnitId = getPlatformSpecificAdUnit(adConfig, platform, 'reward');
      
      await window.Admob.prepareRewardVideoAd({
        adId: adUnitId,
      });
      
      debugLog("AdMob Hook", `Reward ad prepared with ID: ${adUnitId}`);
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
    if (!pluginAvailable || !window.Admob) {
      debugLog("AdMob Hook", "Plugin not available, skipping ad");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      const adConfig = await fetchAdMobConfig();
      
      if (!adConfig) {
        setIsLoading(false);
        return false;
      }
      
      const platform = window.Capacitor?.getPlatform() || 'android';
      const adUnitId = getPlatformSpecificAdUnit(adConfig, platform, 'reward');
      
      debugLog("AdMob Hook", `Showing reward ad with ID: ${adUnitId}`);
      
      // Test modunda daha iyi debug için bildirim göster
      if (adConfig.isTestMode) {
        toast.info("Test modu: Reklam gösteriliyor", { 
          description: `Reklam ID: ${adUnitId}`,
          duration: 3000
        });
      }
      
      const result = await window.Admob.showRewardVideoAd({
        adId: adUnitId,
      });
      
      debugLog("AdMob Hook", "Reward ad result:", result);
      
      setIsLoading(false);
      
      if (result && result.type === "earned") {
        return true;
      }
      return false;
    } catch (error) {
      errorLog("AdMob Hook", "Error showing reward ad:", error);
      toast.error("Reklam gösterilirken bir hata oluştu");
      setIsLoading(false);
      return false;
    }
  }, [pluginAvailable]);

  return {
    showRewardAd,
    isLoading,
    config,
    preloadNextAd,
    isInitialized,
    pluginAvailable,
  };
}
