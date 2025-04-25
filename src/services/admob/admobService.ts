
import { supabase } from "@/integrations/supabase/client";

interface AdMobConfig {
  appId: string;
  rewardAdUnitId: string;
}

export class AdMobService {
  private static instance: AdMobService;
  private initialized = false;

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
        console.log('AdMob: Not running on mobile device');
        return;
      }

      const { data: { ADMOB_APP_ID, ADMOB_REWARD_AD_UNIT_ID } } = await supabase.functions.invoke<AdMobConfig>('get-admob-config');
      
      // @ts-ignore - Admob plugin exists in Capacitor
      await window.Admob.initialize({
        appId: ADMOB_APP_ID,
      });

      this.initialized = true;
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  }

  async showRewardAd(): Promise<boolean> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      if (!window.Capacitor) {
        console.log('AdMob: Not running on mobile device');
        return false;
      }

      const { data: { ADMOB_REWARD_AD_UNIT_ID } } = await supabase.functions.invoke<AdMobConfig>('get-admob-config');

      // @ts-ignore - Admob plugin exists in Capacitor
      const result = await window.Admob.showRewardVideo({
        adId: ADMOB_REWARD_AD_UNIT_ID,
      });

      return result.rewarded || false;
    } catch (error) {
      console.error('Failed to show reward ad:', error);
      return false;
    }
  }
}

export const admobService = AdMobService.getInstance();
