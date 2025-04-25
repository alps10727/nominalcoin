
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { AdMobListenerManager } from "./listenerManager";
import { fetchAdMobConfig, getPlatformSpecificAdUnit } from "./config";
import type { AdMobServiceInterface } from "./types";

export class AdMobService implements AdMobServiceInterface {
  private static instance: AdMobService;
  private initialized = false;
  private isPreloading = false;
  private adPreloaded = false;
  private bannerAdLoaded = false;
  private adLoadInProgress = false;
  private lastAdLoadAttempt = 0;
  private listenerManager: AdMobListenerManager;

  private constructor() {
    this.listenerManager = new AdMobListenerManager(() => this.preloadRewardAd());
  }

  static getInstance(): AdMobService {
    if (!AdMobService.instance) {
      AdMobService.instance = new AdMobService();
    }
    return AdMobService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      if (!window.Capacitor) {
        debugLog('AdMob', 'Not running on mobile device');
        return;
      }

      if (!window.Capacitor.isPluginAvailable('AdMob')) {
        errorLog('AdMob', 'AdMob plugin is not available', null);
        return;
      }

      const config = await fetchAdMobConfig();
      if (!config) return;

      const platform = window.Capacitor.getPlatform();
      const appId = platform === 'ios' ? (config.iOSAppId || config.appId) : config.appId;
      
      await window.Admob?.initialize({
        appId: appId,
        testingDevices: ['TEST-DEVICE-ID'],
        initializeForTesting: true,
      });

      debugLog('AdMob', `AdMob initialized successfully on platform: ${platform}`);

      await this.listenerManager.setupGlobalListeners();
      this.initialized = true;
      
      setTimeout(() => this.preloadRewardAd(), 1000);
    } catch (error) {
      errorLog('AdMob', 'Failed to initialize AdMob:', error);
    }
  }

  async preloadRewardAd(): Promise<void> {
    const now = Date.now();
    if (this.isPreloading || this.adPreloaded || this.adLoadInProgress || 
        (now - this.lastAdLoadAttempt < 3000)) {
      debugLog('AdMob', 'Skipping preload: already in progress or throttled');
      return;
    }
    
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      if (!window.Capacitor || !window.Admob) {
        debugLog('AdMob', 'Not on mobile or plugin not available, skipping ad preload');
        return;
      }

      this.isPreloading = true;
      this.adLoadInProgress = true;
      this.lastAdLoadAttempt = now;
      
      debugLog('AdMob', 'Started preloading reward ad');

      const config = await fetchAdMobConfig();
      if (!config) {
        this.resetAdStates();
        return;
      }

      const platform = window.Capacitor.getPlatform();
      const adUnitId = getPlatformSpecificAdUnit(config, platform, 'reward');
      
      debugLog('AdMob', `Preloading reward ad with ID: ${adUnitId}`);

      await window.Admob?.prepareRewardVideoAd({
        adId: adUnitId,
      });
    } catch (error) {
      this.resetAdStates();
      errorLog('AdMob', 'Failed to preload reward ad:', error);
    }
  }

  private resetAdStates(): void {
    this.adPreloaded = false;
    this.isPreloading = false;
    this.adLoadInProgress = false;
  }

  async showRewardAd(): Promise<boolean> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      if (!window.Capacitor || !window.Admob) {
        debugLog('AdMob', 'Not running on mobile device, simulating reward');
        return true;
      }
      
      debugLog('AdMob', `Attempting to show reward ad. Preloaded: ${this.adPreloaded}`);

      if (!this.adPreloaded && !this.isPreloading && !this.adLoadInProgress) {
        const config = await fetchAdMobConfig();
        if (!config) return false;

        const platform = window.Capacitor.getPlatform();
        const adUnitId = getPlatformSpecificAdUnit(config, platform, 'reward');
        
        await window.Admob?.prepareRewardVideoAd({
          adId: adUnitId,
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const result = await window.Admob?.showRewardVideoAd();
      this.adPreloaded = false;
      
      setTimeout(() => this.preloadRewardAd(), 1000);
      
      return result?.rewarded || false;
    } catch (error) {
      errorLog('AdMob', 'Failed to show reward ad:', error);
      this.adPreloaded = false;
      setTimeout(() => this.preloadRewardAd(), 3000);
      return false;
    }
  }

  async showBannerAd(): Promise<void> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

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

  isAvailable(): boolean {
    if (!window.Capacitor) return false;
    return window.Capacitor.isPluginAvailable('AdMob');
  }
}

export const admobService = AdMobService.getInstance();
