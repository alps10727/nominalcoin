
import { useState, useEffect, useCallback } from 'react';
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

// Sabit test ID'leri - Fetch etmeye gerek kalmadı
const TEST_CONFIG = {
  isTestMode: true,
  android: {
    appId: "ca-app-pub-3940256099942544~3347511713",
    rewardAdUnitId: "ca-app-pub-3940256099942544/5224354917",
    bannerAdUnitId: "ca-app-pub-3940256099942544/6300978111", 
    interstitialAdUnitId: "ca-app-pub-3940256099942544/1033173712"
  },
  ios: {
    appId: "ca-app-pub-3940256099942544~1458002511",
    rewardAdUnitId: "ca-app-pub-3940256099942544/1712485313",
    bannerAdUnitId: "ca-app-pub-3940256099942544/2934735716",
    interstitialAdUnitId: "ca-app-pub-3940256099942544/4411468910"
  }
};

export function useAdMob() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pluginAvailable, setPluginAvailable] = useState(false);
  const [adPreloaded, setAdPreloaded] = useState(false);

  // Plugin kullanılabilirliğini kontrol et
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        // Capacitor'un mevcut olup olmadığını kontrol et
        if (typeof window === 'undefined' || !window.Capacitor) {
          setPluginAvailable(false);
          debugLog("AdMob", "Capacitor kullanılamıyor");
          return;
        }

        // Plugin varlığını kontrol et - Yeni plugin ismi ile
        const isAvailable = window.Capacitor.isPluginAvailable('@capacitor-community/admob');
        setPluginAvailable(isAvailable);
        debugLog("AdMob", `Plugin kullanılabilir: ${isAvailable}`);
        
        if (isAvailable) {
          try {
            // AdMob plugin'ini başlat
            if (window.CapacitorAdMob) {
              await window.CapacitorAdMob.initialize();
              setIsInitialized(true);
              debugLog("AdMob", "AdMob başarıyla başlatıldı");
              
              // İlk reklamı yükle
              setTimeout(() => preloadNextAd(), 2000);
            } else {
              errorLog("AdMob", "CapacitorAdMob objesi bulunamadı", null);
            }
          } catch (error) {
            errorLog("AdMob", "AdMob başlatma hatası:", error);
            toast.error("AdMob başlatılamadı");
          }
        } else {
          console.log("@capacitor-community/admob eklentisi bulunamadı");
        }
      } catch (error) {
        setPluginAvailable(false);
        errorLog("AdMob", "Plugin kullanılabilirlik kontrolü hatası:", error);
      }
    };
    
    checkAvailability();
  }, []);

  // Bir sonraki ödüllü reklamı önceden yükle
  const preloadNextAd = useCallback(async () => {
    if (!pluginAvailable || !window.CapacitorAdMob) {
      return;
    }

    setIsLoading(true);
    
    try {
      debugLog("AdMob", "Sonraki ödül reklamı yükleniyor");
      
      const platform = window.Capacitor.getPlatform();
      const adUnitId = platform === 'ios' 
        ? TEST_CONFIG.ios.rewardAdUnitId 
        : TEST_CONFIG.android.rewardAdUnitId;
      
      await window.CapacitorAdMob.prepareRewardVideoAd({
        adId: adUnitId
      });
      
      setAdPreloaded(true);
      debugLog("AdMob", "Ödül reklamı başarıyla yüklendi");
    } catch (error) {
      errorLog("AdMob", "Reklam yükleme hatası:", error);
      toast.error("Reklam yüklenirken bir hata oluştu", {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [pluginAvailable]);

  // Ödüllü reklam göster
  const showRewardAd = useCallback(async (): Promise<boolean> => {
    if (!pluginAvailable || !window.CapacitorAdMob) {
      debugLog("AdMob", "Plugin mevcut değil, geliştirme modunda ödül simüle ediliyor");
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true; // Geliştirme modunda başarılı olarak kabul et
    }
    
    setIsLoading(true);
    
    try {
      debugLog("AdMob", "Ödül reklamı gösteriliyor");
      
      if (TEST_CONFIG.isTestMode) {
        toast.info("Test modu: Reklam gösteriliyor", { 
          duration: 3000
        });
      }
      
      // Reklam daha önce yüklenmediyse yükle
      if (!adPreloaded) {
        const platform = window.Capacitor.getPlatform();
        const adUnitId = platform === 'ios' 
          ? TEST_CONFIG.ios.rewardAdUnitId 
          : TEST_CONFIG.android.rewardAdUnitId;
          
        await window.CapacitorAdMob.prepareRewardVideoAd({
          adId: adUnitId
        });
        
        // Reklamın yüklenmesi için kısa bir bekleme süresi
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Reklamı göster
      const result = await window.CapacitorAdMob.showRewardVideoAd();
      setAdPreloaded(false);
      
      // Sonraki reklamı yükle
      setTimeout(() => preloadNextAd(), 1000);
      
      debugLog("AdMob", "Reklam sonucu:", result);
      return result?.value || false;
    } catch (error) {
      errorLog("AdMob", "Ödül reklamı gösterme hatası:", error);
      toast.error("Reklam gösterilirken bir hata oluştu");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [pluginAvailable, adPreloaded, preloadNextAd]);

  // Banner reklamı göster
  const showBannerAd = useCallback(async (): Promise<void> => {
    if (!pluginAvailable || !window.CapacitorAdMob) {
      debugLog("AdMob", "Plugin mevcut değil, banner reklamı atlanıyor");
      return;
    }
    
    try {
      debugLog("AdMob", "Banner reklamı gösteriliyor");
      
      const platform = window.Capacitor.getPlatform();
      const adUnitId = platform === 'ios' 
        ? TEST_CONFIG.ios.bannerAdUnitId 
        : TEST_CONFIG.android.bannerAdUnitId;
      
      await window.CapacitorAdMob.showBanner({
        adId: adUnitId,
        position: 'BOTTOM_CENTER',
      });
      
      if (TEST_CONFIG.isTestMode) {
        toast.info("Test modu: Banner reklam gösteriliyor", { 
          duration: 2000
        });
      }
    } catch (error) {
      errorLog("AdMob", "Banner reklamı gösterme hatası:", error);
    }
  }, [pluginAvailable]);

  // Banner reklamı gizle
  const hideBannerAd = useCallback(async (): Promise<void> => {
    if (!pluginAvailable || !window.CapacitorAdMob) {
      return;
    }
    
    try {
      debugLog("AdMob", "Banner reklamı gizleniyor");
      await window.CapacitorAdMob.hideBanner();
    } catch (error) {
      errorLog("AdMob", "Banner reklamı gizleme hatası:", error);
    }
  }, [pluginAvailable]);

  // Interstitial reklamı göster
  const showInterstitialAd = useCallback(async (): Promise<boolean> => {
    if (!pluginAvailable || !window.CapacitorAdMob) {
      debugLog("AdMob", "Plugin mevcut değil, geçiş reklamı simüle ediliyor");
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    }
    
    setIsLoading(true);
    
    try {
      debugLog("AdMob", "Geçiş reklamı gösteriliyor");
      
      const platform = window.Capacitor.getPlatform();
      const adUnitId = platform === 'ios' 
        ? TEST_CONFIG.ios.interstitialAdUnitId 
        : TEST_CONFIG.android.interstitialAdUnitId;
      
      // Önce reklamı hazırla
      await window.CapacitorAdMob.prepareInterstitial({
        adId: adUnitId
      });
      
      // Kısa bir bekleme süresi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reklamı göster
      await window.CapacitorAdMob.showInterstitial();
      
      if (TEST_CONFIG.isTestMode) {
        toast.info("Test modu: Geçiş reklamı gösteriliyor", { 
          duration: 3000
        });
      }
      
      return true;
    } catch (error) {
      errorLog("AdMob", "Geçiş reklamı gösterme hatası:", error);
      toast.error("Reklam gösterilirken bir hata oluştu");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [pluginAvailable]);

  return {
    showRewardAd,
    showInterstitialAd,
    showBannerAd,
    hideBannerAd,
    isLoading,
    preloadNextAd,
    isInitialized,
    pluginAvailable,
  };
}
