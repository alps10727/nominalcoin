import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";

interface AdMobConfig {
  appId: string;
  rewardAdUnitId: string;
  iOSAppId?: string;
  iOSRewardAdUnitId?: string;
  bannerAdUnitId?: string;
  iOSBannerAdUnitId?: string;
  interstitialAdUnitId?: string;
  iOSInterstitialAdUnitId?: string;
}

export class AdMobService {
  private static instance: AdMobService;
  private initialized = false;
  private isPreloading = false;
  private adPreloaded = false;
  private bannerAdLoaded = false;
  private adLoadInProgress = false;
  private lastAdLoadAttempt = 0;
  private adLoadRetryCount = 0;
  private readonly MAX_RETRY_COUNT = 3;
  private readonly RETRY_DELAY = 5000; // 5 seconds

  private constructor() {}

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

      const { data: responseData, error } = await supabase.functions.invoke<{data: AdMobConfig}>('get-admob-config');
      
      if (error || !responseData) {
        errorLog('AdMob', 'Failed to retrieve AdMob config', error);
        return;
      }
      
      const config = responseData.data;
      if (!config || !config.appId) {
        errorLog('AdMob', 'Invalid AdMob config: missing appId', null);
        return;
      }

      debugLog('AdMob', `Initializing with appId: ${config.appId}`);
      
      const platform = window.Capacitor.getPlatform();
      const appId = platform === 'ios' ? (config.iOSAppId || config.appId) : config.appId;
      
      await window.Admob?.initialize({
        appId: appId,
        testingDevices: ['TEST-DEVICE-ID'],
        initializeForTesting: true, // Use test ads
      });

      debugLog('AdMob', `AdMob initialized successfully on platform: ${platform} with appId: ${appId}`);

      this.setupGlobalErrorListeners();

      this.initialized = true;
      
      setTimeout(() => this.preloadRewardAd(), 1000);
    } catch (error) {
      errorLog('AdMob', 'Failed to initialize AdMob:', error);
    }
  }

  private setupGlobalErrorListeners(): void {
    if (!window.Capacitor || !window.Admob) return;

    try {
      window.Admob.addListener('onAdFailedToLoad', (info) => {
        const errorMessage = info?.message || 'Unknown error';
        const errorCode = info?.code || 'unknown';
        
        errorLog('AdMob', `Ad failed to load with error code: ${errorCode}, message: ${errorMessage}`, null);
        
        this.adPreloaded = false;
        this.isPreloading = false;
        this.adLoadInProgress = false;
        this.adLoadRetryCount++;
        
        if (this.adLoadRetryCount <= this.MAX_RETRY_COUNT) {
          const delay = this.RETRY_DELAY * Math.pow(2, this.adLoadRetryCount - 1);
          debugLog('AdMob', `Will retry loading ad in ${delay}ms (attempt ${this.adLoadRetryCount})`);
          setTimeout(() => this.preloadRewardAd(), delay);
        }
      });
      
      window.Admob.addListener('onAdLoaded', () => {
        debugLog('AdMob', 'Ad loaded successfully');
        this.adPreloaded = true;
        this.isPreloading = false;
        this.adLoadInProgress = false;
        this.adLoadRetryCount = 0;
      });
      
      debugLog('AdMob', 'Global error listeners set up');
    } catch (error) {
      errorLog('AdMob', 'Failed to set up global error listeners', error);
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

      const { data: responseData, error } = await supabase.functions.invoke<{data: AdMobConfig}>('get-admob-config');
      
      if (error || !responseData) {
        errorLog('AdMob', 'Failed to retrieve AdMob config', error);
        this.isPreloading = false;
        this.adLoadInProgress = false;
        return;
      }
      
      const config = responseData.data;
      if (!config || !config.rewardAdUnitId) {
        errorLog('AdMob', 'Invalid AdMob config: missing rewardAdUnitId', null);
        this.isPreloading = false;
        this.adLoadInProgress = false;
        return;
      }

      const platform = window.Capacitor.getPlatform();
      const adUnitId = platform === 'ios' 
        ? (config.iOSRewardAdUnitId || config.rewardAdUnitId) 
        : config.rewardAdUnitId;
      
      debugLog('AdMob', `Preloading reward ad with ID: ${adUnitId} for platform: ${platform}`);

      await window.Admob?.prepareRewardVideoAd({
        adId: adUnitId,
      });
      
      debugLog('AdMob', 'Reward ad preload request sent');
    } catch (error) {
      this.adPreloaded = false;
      this.isPreloading = false;
      this.adLoadInProgress = false;
      errorLog('AdMob', 'Failed to preload reward ad:', error);
    }
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
        debugLog('AdMob', 'No preloaded ad available, loading on demand');
        
        const { data: responseData, error } = await supabase.functions.invoke<{data: AdMobConfig}>('get-admob-config');
        
        if (error || !responseData) {
          errorLog('AdMob', 'Failed to retrieve AdMob config', error);
          return false;
        }
        
        const config = responseData.data;
        if (!config || !config.rewardAdUnitId) {
          errorLog('AdMob', 'Invalid AdMob config: missing rewardAdUnitId', null);
          return false;
        }

        const platform = window.Capacitor.getPlatform();
        const adUnitId = platform === 'ios' 
          ? (config.iOSRewardAdUnitId || config.rewardAdUnitId) 
          : config.rewardAdUnitId;

        debugLog('AdMob', `Loading reward ad on demand with ID: ${adUnitId}`);

        await window.Admob?.prepareRewardVideoAd({
          adId: adUnitId,
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      debugLog('AdMob', 'Showing reward ad');
      const result = await window.Admob?.showRewardVideoAd();
      
      debugLog('AdMob', `Show reward ad result: ${JSON.stringify(result)}`);
      
      this.adPreloaded = false;
      
      setTimeout(() => this.preloadRewardAd(), 1000);
      
      const rewarded = result?.rewarded || false;
      debugLog('AdMob', `Reward ad result: ${rewarded ? 'rewarded' : 'not rewarded'}`);
      return rewarded;
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

      const { data: responseData, error } = await supabase.functions.invoke<{data: AdMobConfig}>('get-admob-config');
      
      if (error || !responseData?.data) {
        errorLog('AdMob', 'Failed to retrieve AdMob config', error);
        return;
      }
      
      const config = responseData.data;
      if (!config.bannerAdUnitId) {
        errorLog('AdMob', 'Invalid AdMob config: missing bannerAdUnitId', null);
        return;
      }

      const platform = window.Capacitor.getPlatform();
      const adUnitId = platform === 'ios' 
        ? (config.iOSBannerAdUnitId || config.bannerAdUnitId) 
        : config.bannerAdUnitId;

      debugLog('AdMob', `Showing banner ad with ID: ${adUnitId}`);

      await window.Admob?.showBanner({
        adId: adUnitId,
        position: 'BOTTOM_CENTER',
        margin: 0,
      });

      this.bannerAdLoaded = true;
      debugLog('AdMob', 'Banner ad shown successfully');
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
