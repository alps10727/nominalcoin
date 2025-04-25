
import { debugLog, errorLog } from "@/utils/debugUtils";
import { fetchAdMobConfig, getPlatformSpecificAdUnit } from "../config";
import { adLoadingService } from "./adLoadingService";

export class AdDisplayService {
  private static instance: AdDisplayService;
  private bannerAdLoaded = false;

  static getInstance(): AdDisplayService {
    if (!AdDisplayService.instance) {
      AdDisplayService.instance = new AdDisplayService();
    }
    return AdDisplayService.instance;
  }

  async showRewardAd(): Promise<boolean> {
    try {
      if (!window.Capacitor || !window.Admob) {
        debugLog('AdMob', 'Not running on mobile device, simulating reward');
        return true;
      }
      
      debugLog('AdMob', `Attempting to show reward ad. Preloaded: ${adLoadingService.isAdPreloaded()}`);

      if (!adLoadingService.isAdPreloaded()) {
        debugLog('AdMob', 'No preloaded ad available, loading ad now');
        
        const config = await fetchAdMobConfig();
        if (!config) return false;

        const platform = window.Capacitor.getPlatform();
        const adUnitId = getPlatformSpecificAdUnit(config, platform, 'reward');
        
        await window.Admob?.prepareRewardVideoAd({
          adId: adUnitId,
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      debugLog('AdMob', 'Showing reward ad now');
      const result = await window.Admob?.showRewardVideoAd();
      adLoadingService.setAdPreloaded(false);
      
      setTimeout(() => adLoadingService.preloadRewardAd(), 1000);
      
      if (result?.rewarded) {
        debugLog('AdMob', 'User was rewarded for watching the ad');
      } else {
        debugLog('AdMob', 'User was not rewarded (ad may have been skipped or failed)');
      }
      
      return result?.rewarded || false;
    } catch (error) {
      errorLog('AdMob', 'Failed to show reward ad:', error);
      adLoadingService.setAdPreloaded(false);
      setTimeout(() => adLoadingService.preloadRewardAd(), 3000);
      return false;
    }
  }

  async showBannerAd(): Promise<void> {
    try {
      if (!window.Capacitor || !window.Admob) {
        debugLog('AdMob', 'Not running on mobile device, skipping banner ad');
        return;
      }

      const config = await fetchAdMobConfig();
      if (!config) return;
      
      const platform = window.Capacitor.getPlatform();
      const adUnitId = getPlatformSpecificAdUnit(config, platform, 'banner');
      
      if (!adUnitId) {
        errorLog('AdMob', 'No banner ad unit ID available', null);
        return;
      }

      debugLog('AdMob', `Showing banner ad with ID: ${adUnitId}`);

      await window.Admob?.showBanner({
        adId: adUnitId,
        position: 'BOTTOM_CENTER',
        margin: 0,
      });

      this.bannerAdLoaded = true;
    } catch (error) {
      errorLog('AdMob', 'Failed to show banner ad:', error);
      this.bannerAdLoaded = false;
    }
  }

  async hideBannerAd(): Promise<void> {
    try {
      if (!window.Capacitor || !window.Admob || !this.bannerAdLoaded) return;

      await window.Admob?.hideBanner();
      this.bannerAdLoaded = false;
      debugLog('AdMob', 'Banner ad hidden successfully');
    } catch (error) {
      errorLog('AdMob', 'Failed to hide banner ad:', error);
    }
  }
}

export const adDisplayService = AdDisplayService.getInstance();
