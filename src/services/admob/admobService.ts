
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";

interface AdMobConfig {
  appId: string;
  rewardAdUnitId: string;
}

export class AdMobService {
  private static instance: AdMobService;
  private initialized = false;
  private isPreloading = false;
  private adPreloaded = false;

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

      const { data, error } = await supabase.functions.invoke<{data: AdMobConfig}>('get-admob-config');
      
      if (error || !data || !data.data || !data.data.appId) {
        errorLog('AdMob', 'Failed to retrieve AdMob config', error);
        return;
      }
      
      // @ts-ignore - Admob plugin exists in Capacitor
      await window.Admob?.initialize({
        appId: data.data.appId,
        testingDevices: ['TEST-DEVICE-ID'],
        initializeForTesting: true, // Use test ads
      });

      this.initialized = true;
      debugLog('AdMob', 'AdMob initialized successfully');
      
      // Start preloading the first ad after initialization
      this.preloadRewardAd();
    } catch (error) {
      errorLog('AdMob', 'Failed to initialize AdMob:', error);
    }
  }

  async preloadRewardAd(): Promise<void> {
    if (this.isPreloading || this.adPreloaded) return;
    
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      if (!window.Capacitor) {
        debugLog('AdMob', 'Not on mobile, skipping ad preload');
        return;
      }

      this.isPreloading = true;
      debugLog('AdMob', 'Started preloading reward ad');

      const { data, error } = await supabase.functions.invoke<{data: AdMobConfig}>('get-admob-config');
      
      if (error || !data || !data.data || !data.data.rewardAdUnitId) {
        errorLog('AdMob', 'Failed to retrieve AdMob reward ad unit ID', error);
        this.isPreloading = false;
        return;
      }

      // @ts-ignore - Admob plugin exists in Capacitor
      await window.Admob?.prepareRewardVideoAd({
        adId: data.data.rewardAdUnitId,
      });
      
      this.adPreloaded = true;
      this.isPreloading = false;
      debugLog('AdMob', 'Reward ad preloaded successfully');
    } catch (error) {
      this.adPreloaded = false;
      this.isPreloading = false;
      errorLog('AdMob', 'Failed to preload reward ad:', error);
    }
  }

  async showRewardAd(): Promise<boolean> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      if (!window.Capacitor) {
        debugLog('AdMob', 'Not running on mobile device, simulating reward');
        return true; // Simulate successful reward on non-mobile
      }

      // If we don't have a preloaded ad, try to prepare one on-demand
      if (!this.adPreloaded && !this.isPreloading) {
        debugLog('AdMob', 'No preloaded ad available, loading on demand');
        
        const { data, error } = await supabase.functions.invoke<{data: AdMobConfig}>('get-admob-config');
        
        if (error || !data || !data.data || !data.data.rewardAdUnitId) {
          errorLog('AdMob', 'Failed to retrieve AdMob reward ad unit ID', error);
          return false;
        }

        // @ts-ignore - Admob plugin exists in Capacitor
        await window.Admob?.prepareRewardVideoAd({
          adId: data.data.rewardAdUnitId,
        });
      }

      debugLog('AdMob', 'Showing reward ad');
      // @ts-ignore - Admob plugin exists in Capacitor
      const result = await window.Admob?.showRewardVideoAd();
      
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
}

export const admobService = AdMobService.getInstance();
