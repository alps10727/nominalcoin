
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";

interface AdMobConfig {
  appId: string;
  rewardAdUnitId: string;
  iOSAppId?: string;
  iOSRewardAdUnitId?: string;
  bannerAdUnitId?: string;
  interstitialAdUnitId?: string;
}

export class AdMobService {
  private static instance: AdMobService;
  private initialized = false;
  private isPreloading = false;
  private adPreloaded = false;
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
      
      // Check if we're running on iOS - if so, use iOS specific app ID
      const platform = window.Capacitor.getPlatform();
      const appId = platform === 'ios' ? (config.iOSAppId || config.appId) : config.appId;
      
      // @ts-ignore - Admob plugin exists in Capacitor
      await window.Admob?.initialize({
        appId: appId,
        testingDevices: ['TEST-DEVICE-ID'],
        initializeForTesting: true, // Use test ads
      });

      // Debugging - log initialization success with platform info
      debugLog('AdMob', `AdMob initialized successfully on platform: ${platform} with appId: ${appId}`);

      // Set up global error listeners
      this.setupGlobalErrorListeners();

      this.initialized = true;
      
      // Start preloading the first ad after initialization
      setTimeout(() => this.preloadRewardAd(), 1000);
    } catch (error) {
      errorLog('AdMob', 'Failed to initialize AdMob:', error);
    }
  }

  private setupGlobalErrorListeners(): void {
    if (!window.Capacitor || !window.Admob) return;

    try {
      // @ts-ignore - Admob plugin exists in Capacitor
      window.Admob.addListener('onAdFailedToLoad', (info) => {
        const errorMessage = info?.message || 'Unknown error';
        const errorCode = info?.code || 'unknown';
        
        errorLog('AdMob', `Ad failed to load with error code: ${errorCode}, message: ${errorMessage}`, null);
        
        // Reset loading state
        this.adPreloaded = false;
        this.isPreloading = false;
        this.adLoadInProgress = false;
        this.adLoadRetryCount++;
        
        // Auto retry with exponential backoff
        if (this.adLoadRetryCount <= this.MAX_RETRY_COUNT) {
          const delay = this.RETRY_DELAY * Math.pow(2, this.adLoadRetryCount - 1);
          debugLog('AdMob', `Will retry loading ad in ${delay}ms (attempt ${this.adLoadRetryCount})`);
          setTimeout(() => this.preloadRewardAd(), delay);
        }
      });
      
      // @ts-ignore - Admob plugin exists in Capacitor
      window.Admob.addListener('onAdLoaded', () => {
        debugLog('AdMob', 'Ad loaded successfully');
        this.adPreloaded = true;
        this.isPreloading = false;
        this.adLoadInProgress = false;
        this.adLoadRetryCount = 0; // Reset retry count on success
      });
      
      debugLog('AdMob', 'Global error listeners set up');
    } catch (error) {
      errorLog('AdMob', 'Failed to set up global error listeners', error);
    }
  }

  async preloadRewardAd(): Promise<void> {
    // Prevent multiple simultaneous load attempts and throttle requests
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

      // Check if we're running on iOS - if so, use iOS specific ad unit ID
      const platform = window.Capacitor.getPlatform();
      const adUnitId = platform === 'ios' 
        ? (config.iOSRewardAdUnitId || config.rewardAdUnitId) 
        : config.rewardAdUnitId;
      
      debugLog('AdMob', `Preloading reward ad with ID: ${adUnitId} for platform: ${platform}`);

      // @ts-ignore - Admob plugin exists in Capacitor
      await window.Admob?.prepareRewardVideoAd({
        adId: adUnitId,
      });
      
      // Note: We don't set adPreloaded=true here. That happens in the onAdLoaded listener
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
        return true; // Simulate successful reward on non-mobile
      }
      
      debugLog('AdMob', `Attempting to show reward ad. Preloaded: ${this.adPreloaded}`);

      // If we don't have a preloaded ad, try to prepare one on-demand
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

        // Check if we're running on iOS - if so, use iOS specific ad unit ID
        const platform = window.Capacitor.getPlatform();
        const adUnitId = platform === 'ios' 
          ? (config.iOSRewardAdUnitId || config.rewardAdUnitId) 
          : config.rewardAdUnitId;

        debugLog('AdMob', `Loading reward ad on demand with ID: ${adUnitId}`);

        // @ts-ignore - Admob plugin exists in Capacitor
        await window.Admob?.prepareRewardVideoAd({
          adId: adUnitId,
        });
        
        // Give a little time for the ad to load
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      debugLog('AdMob', 'Showing reward ad');
      // @ts-ignore - Admob plugin exists in Capacitor
      const result = await window.Admob?.showRewardVideoAd();
      
      debugLog('AdMob', `Show reward ad result: ${JSON.stringify(result)}`);
      
      // Reset preloaded state after showing
      this.adPreloaded = false;
      
      // Start preloading the next ad immediately
      setTimeout(() => this.preloadRewardAd(), 1000);
      
      const rewarded = result?.rewarded || false;
      debugLog('AdMob', `Reward ad result: ${rewarded ? 'rewarded' : 'not rewarded'}`);
      return rewarded;
    } catch (error) {
      errorLog('AdMob', 'Failed to show reward ad:', error);
      this.adPreloaded = false;
      
      // Try to preload again after error
      setTimeout(() => this.preloadRewardAd(), 3000);
      return false;
    }
  }

  // Check if plugin is available
  isAvailable(): boolean {
    if (!window.Capacitor) return false;
    return window.Capacitor.isPluginAvailable('AdMob');
  }
}

export const admobService = AdMobService.getInstance();
