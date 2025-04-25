
import { supabase } from "@/integrations/supabase/client";

// Interface for the AdMob configuration
interface AdMobConfig {
  appId: string;
  rewardAdUnitId: string;
}

// Response type for the Supabase function
interface AdMobResponse {
  data: {
    appId: string;
    rewardAdUnitId: string;
  };
}

export class AdMobService {
  private static instance: AdMobService;
  private initialized = false;
  // Cache the config to avoid multiple API calls
  private config: AdMobConfig | null = null;
  private initializationPromise: Promise<void> | null = null;

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

      console.log('Fetching AdMob config from Supabase');
      const { data, error } = await supabase.functions.invoke<{data: AdMobConfig}>('get-admob-config');
      
      if (error) {
        console.error('Error fetching AdMob config:', error);
        return null;
      }
      
      if (!data || !data.data || !data.data.appId || !data.data.rewardAdUnitId) {
        console.error('Failed to retrieve AdMob config, invalid data structure:', data);
        return null;
      }
      
      console.log('Successfully retrieved AdMob config:', data.data);
      
      // Cache the config
      this.config = data.data;
      return this.config;
    } catch (error) {
      console.error('Failed to fetch AdMob config:', error);
      return null;
    }
  }

  async initialize(): Promise<void> {
    // Return existing initialization promise if one is in progress
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // Create new initialization promise
    this.initializationPromise = this._initialize();
    return this.initializationPromise;
  }

  private async _initialize(): Promise<void> {
    if (this.initialized) {
      console.log('AdMob already initialized, skipping initialization');
      return;
    }

    try {
      if (typeof window === 'undefined' || !window.Capacitor) {
        console.log('AdMob: Not running on mobile device');
        this.initialized = true; // Mark as initialized even on non-mobile platforms
        return;
      }

      // Fetch the AdMob configuration from Supabase
      const config = await this.fetchConfig();
      
      if (!config) {
        console.error('Failed to initialize AdMob: config not available');
        return;
      }
      
      console.log('Initializing AdMob with appId:', config.appId);
      
      // @ts-ignore - Admob plugin exists in Capacitor
      await window.Admob?.initialize({
        appId: config.appId,
      });

      console.log('AdMob initialized successfully');
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
      // Reset initialization state so it can be tried again
      this.initializationPromise = null;
      throw error;
    } finally {
      // Clear the initialization promise reference
      this.initializationPromise = null;
    }
  }

  async showRewardAd(): Promise<boolean> {
    if (!this.initialized) {
      console.log('AdMob not initialized, initializing now');
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

      console.log('Showing reward ad with adId:', config.rewardAdUnitId);
      
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
