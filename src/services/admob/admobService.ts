
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

      const { data } = await supabase.functions.invoke<{data: AdMobConfig}>('get-admob-config');
      
      if (!data || !data.appId) {
        console.error('Failed to retrieve AdMob config');
        return;
      }
      
      // @ts-ignore - Admob plugin exists in Capacitor
      await window.Admob?.initialize({
        appId: data.appId,
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

      const { data } = await supabase.functions.invoke<{data: AdMobConfig}>('get-admob-config');
      
      if (!data || !data.rewardAdUnitId) {
        console.error('Failed to retrieve AdMob reward ad unit ID');
        return false;
      }

      // @ts-ignore - Admob plugin exists in Capacitor
      const result = await window.Admob?.showRewardVideo({
        adId: data.rewardAdUnitId,
      });

      return result?.rewarded || false;
    } catch (error) {
      console.error('Failed to show reward ad:', error);
      return false;
    }
  }
}

export const admobService = AdMobService.getInstance();
