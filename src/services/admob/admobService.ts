
import { supabase } from "@/integrations/supabase/client";

// Updated interface to match the expected response structure
interface AdMobConfig {
  appId: string;
  rewardAdUnitId: string;
}

// Response type for the Supabase function
interface AdMobResponse {
  data: AdMobConfig;
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
      if (typeof window === 'undefined' || !window.Capacitor) {
        console.log('AdMob: Not running on mobile device');
        return;
      }

      // Updated to use the correct response type
      const response = await supabase.functions.invoke<AdMobResponse>('get-admob-config');
      
      if (!response || !response.data || !response.data.appId) {
        console.error('Failed to retrieve AdMob config');
        return;
      }
      
      // @ts-ignore - Admob plugin exists in Capacitor
      await window.Admob?.initialize({
        appId: response.data.appId,
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
      if (typeof window === 'undefined' || !window.Capacitor) {
        console.log('AdMob: Not running on mobile device');
        return false;
      }

      // Updated to use the correct response type
      const response = await supabase.functions.invoke<AdMobResponse>('get-admob-config');
      
      if (!response || !response.data || !response.data.rewardAdUnitId) {
        console.error('Failed to retrieve AdMob reward ad unit ID');
        return false;
      }

      // @ts-ignore - Admob plugin exists in Capacitor
      const result = await window.Admob?.showRewardVideo({
        adId: response.data.rewardAdUnitId,
      });

      return result?.rewarded || false;
    } catch (error) {
      console.error('Failed to show reward ad:', error);
      return false;
    }
  }
}

export const admobService = AdMobService.getInstance();
