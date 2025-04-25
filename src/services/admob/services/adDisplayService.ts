import { debugLog, errorLog } from "@/utils/debugUtils";
import { fetchAdMobConfig, getPlatformSpecificAdUnit } from "../config";
import { adLoadingService } from "./adLoadingService";

export class AdDisplayService {
  private static instance: AdDisplayService;
  private bannerAdLoaded = false;
  private interstitialAdLoaded = false;

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

  async showInterstitialAd(): Promise<boolean> {
    try {
      if (!window.Capacitor || !window.Admob) {
        debugLog('AdMob', 'Not running on mobile device, simulating interstitial ad');
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
      }
      
      debugLog('AdMob', 'Attempting to show interstitial ad');
      
      // Get the config and prepare the ad if not already loaded
      const config = await fetchAdMobConfig();
      if (!config) return false;
      
      const platform = window.Capacitor.getPlatform();
      const adUnitId = getPlatformSpecificAdUnit(config, platform, 'interstitial');
      
      if (!this.interstitialAdLoaded) {
        debugLog('AdMob', 'Preparing interstitial ad before showing');
        
        await window.Admob?.prepareInterstitial({
          adId: adUnitId,
        });
        
        // Short delay to ensure the ad is ready
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Show the ad
      await window.Admob?.showInterstitial();
      this.interstitialAdLoaded = false;
      
      // Preload the next interstitial ad after a delay
      setTimeout(() => {
        this.preloadInterstitialAd(adUnitId);
      }, 1000);
      
      return true;
    } catch (error) {
      errorLog('AdMob', 'Failed to show interstitial ad:', error);
      this.interstitialAdLoaded = false;
      return false;
    }
  }

  async preloadInterstitialAd(adUnitId?: string): Promise<void> {
    try {
      if (!window.Capacitor || !window.Admob) return;
      
      if (!adUnitId) {
        const config = await fetchAdMobConfig();
        if (!config) return;
        
        const platform = window.Capacitor.getPlatform();
        adUnitId = getPlatformSpecificAdUnit(config, platform, 'interstitial');
      }
      
      await window.Admob?.prepareInterstitial({
        adId: adUnitId,
      });
      
      this.interstitialAdLoaded = true;
      debugLog('AdMob', 'Interstitial ad preloaded successfully');
    } catch (error) {
      errorLog('AdMob', 'Failed to preload interstitial ad:', error);
      this.interstitialAdLoaded = false;
    }
  }
}

export const adDisplayService = AdDisplayService.getInstance();
