
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
  // Cache the config to avoid multiple API calls
  private config: AdMobConfig | null = null;

  private constructor() {}

  static getInstance(): AdMobService {
    if (!AdMobService.instance) {
      AdMobService.instance = new AdMobService();
    }
    return AdMobService.instance;
  }

  // Fetch AdMob configuration from Supabase
  private async fetchConfig(): Promise<AdMobConfig | null> {
    try {
      // Return cached config if available
      if (this.config) {
        return this.config;
      }

      const { data, error } = await supabase.functions.invoke<AdMobResponse>('get-admob-config');
      
      if (error) {
        console.error('Error fetching AdMob config:', error);
        return null;
      }
      
      if (!data || !data.data || !data.data.appId || !data.data.rewardAdUnitId) {
        console.error('Failed to retrieve AdMob config, invalid data structure:', data);
        return null;
      }
      
      // Cache the config
      this.config = data.data;
      return this.config;
    } catch (error) {
      console.error('Failed to fetch AdMob config:', error);
      return null;
    }
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      if (typeof window === 'undefined' || !window.Capacitor) {
        console.log('AdMob: Not running on mobile device');
        return;
      }

      // Fetch the AdMob configuration from Supabase
      const config = await this.fetchConfig();
      
      if (!config) {
        console.error('Failed to initialize AdMob: config not available');
        return;
      }
      
      // @ts-ignore - Admob plugin exists in Capacitor
      await window.Admob?.initialize({
        appId: config.appId,
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

      // Fetch the AdMob config
      const config = await this.fetchConfig();
      
      if (!config) {
        console.error('Failed to show reward ad: config not available');
        return false;
      }

      // @ts-ignore - Admob plugin exists in Capacitor
      const result = await window.Admob?.showRewardVideo({
        adId: config.rewardAdUnitId,
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
