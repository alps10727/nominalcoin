
import { supabase } from "@/integrations/supabase/client";

// Interface for the AdMob configuration
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

      // Fetch the AdMob configuration from Supabase
      const { data, error } = await supabase.functions.invoke<AdMobResponse>('get-admob-config');
      
      if (error) {
        console.error('Error fetching AdMob config:', error);
        return;
      }
      
      if (!data || !data.appId || !data.rewardAdUnitId) {
        console.error('Failed to retrieve AdMob config, invalid data structure:', data);
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
      if (typeof window === 'undefined' || !window.Capacitor) {
        console.log('AdMob: Not running on mobile device');
        // For testing in browser, simulate success
        return true;
      }

      // Fetch the AdMob reward ad unit ID from Supabase
      const { data, error } = await supabase.functions.invoke<AdMobResponse>('get-admob-config');
      
      if (error) {
        console.error('Error fetching AdMob reward ad unit ID:', error);
        return false;
      }
      
      if (!data || !data.appId || !data.rewardAdUnitId) {
        console.error('Failed to retrieve AdMob reward ad unit ID, invalid data structure:', data);
        return false;
      }

      // @ts-ignore - Admob plugin exists in Capacitor
      const result = await window.Admob?.showRewardVideo({
        adId: data.rewardAdUnitId,
      });

      console.log('AdMob reward video result:', result);
      return result?.rewarded || false;
    } catch (error) {
      console.error('Failed to show reward ad:', error);
      return false;
    }
  }
}

export const admobService = AdMobService.getInstance();
