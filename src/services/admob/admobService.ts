
import { supabase } from "@/integrations/supabase/client";

// Interface for the AdMob configuration
interface AdMobConfig {
  appId: string;
  rewardAdUnitId: string;
}

// Response type for the Supabase function with correct nesting
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
  private lastFetchTime: number = 0;
  private fetchConfigPromise: Promise<AdMobConfig | null> | null = null;

  private constructor() {}

  static getInstance(): AdMobService {
    if (!AdMobService.instance) {
      AdMobService.instance = new AdMobService();
    }
    return AdMobService.instance;
  }

  // Fetch AdMob configuration from Supabase with improved error handling and caching
  private async fetchConfig(): Promise<AdMobConfig | null> {
    try {
      // Return cached config if available and recently fetched (less than 5 minutes ago)
      const now = Date.now();
      if (this.config && (now - this.lastFetchTime < 300000)) {
        console.log('Using cached AdMob config');
        return this.config;
      }

      // If there's already a fetch in progress, return that promise
      if (this.fetchConfigPromise) {
        return this.fetchConfigPromise;
      }

      // Create new fetch promise
      this.fetchConfigPromise = this._fetchConfigFromSupabase();
      const config = await this.fetchConfigPromise;
      this.fetchConfigPromise = null;
      return config;
    } catch (error) {
      console.error('Failed to fetch AdMob config:', error);
      this.fetchConfigPromise = null;
      return null;
    }
  }

  private async _fetchConfigFromSupabase(): Promise<AdMobConfig | null> {
    console.log('Fetching AdMob config from Supabase');
    
    try {
      const { data, error } = await supabase.functions.invoke<AdMobResponse>('get-admob-config');
      
      if (error) {
        console.error('Supabase function error:', error);
        return null;
      }
      
      if (!data || !data.data || !data.data.appId || !data.data.rewardAdUnitId) {
        console.error('Invalid AdMob config data structure:', data);
        return null;
      }
      
      console.log('Successfully retrieved AdMob config with appId:', data.data.appId.substring(0, 5) + '...');
      
      // Update cache
      this.config = {
        appId: data.data.appId,
        rewardAdUnitId: data.data.rewardAdUnitId
      };
      this.lastFetchTime = Date.now();
      
      return this.config;
    } catch (error) {
      console.error('Exception fetching AdMob config:', error);
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
    try {
      await this.initializationPromise;
    } catch (error) {
      console.error('AdMob initialization failed:', error);
    } finally {
      this.initializationPromise = null;
    }
  }

  private async _initialize(): Promise<void> {
    if (this.initialized) {
      console.log('AdMob already initialized, skipping initialization');
      return;
    }

    try {
      if (typeof window === 'undefined') {
        console.log('AdMob: Not running in browser environment');
        this.initialized = true; // Mark as initialized even on non-browser platforms
        return;
      }

      if (!window.Capacitor) {
        console.log('AdMob: Not running on mobile device with Capacitor');
        this.initialized = true; // Mark as initialized even on non-mobile platforms
        return;
      }

      // Fetch the AdMob configuration from Supabase
      const config = await this.fetchConfig();
      
      if (!config) {
        console.error('Failed to initialize AdMob: config not available');
        return;
      }
      
      console.log('Initializing AdMob with appId:', config.appId.substring(0, 5) + '...');
      
      // @ts-ignore - Admob plugin exists in Capacitor
      if (!window.Admob) {
        console.error('AdMob plugin not found in Capacitor');
        return;
      }
      
      try {
        // @ts-ignore - Admob plugin exists in Capacitor
        await window.Admob.initialize({
          appId: config.appId,
        });
        console.log('AdMob initialized successfully');
        this.initialized = true;
      } catch (initError) {
        console.error('AdMob initialization plugin error:', initError);
        throw initError;
      }
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
      throw error;
    }
  }

  async showRewardAd(): Promise<boolean> {
    console.log('showRewardAd: Starting to show reward ad');
    
    if (!this.initialized) {
      console.log('AdMob not initialized, initializing now');
      try {
        await this.initialize();
      } catch (error) {
        console.error('Failed to initialize AdMob before showing ad:', error);
        return false;
      }
    }

    try {
      if (typeof window === 'undefined') {
        console.log('AdMob: Not running in browser environment');
        // For testing in server environment, simulate success
        return true;
      }

      if (!window.Capacitor) {
        console.log('AdMob: Not running on mobile device with Capacitor');
        // For testing in browser, simulate success
        return true;
      }

      // Fetch the AdMob config
      const config = await this.fetchConfig();
      
      if (!config) {
        console.error('Failed to show reward ad: config not available');
        return false;
      }

      console.log('Showing reward ad with adId:', config.rewardAdUnitId.substring(0, 5) + '...');
      
      // @ts-ignore - Admob plugin exists in Capacitor
      if (!window.Admob) {
        console.error('AdMob plugin not found in Capacitor');
        
        // For development/testing, return true to allow functionality without ads
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: simulating successful ad view');
          return true;
        }
        return false;
      }
      
      try {
        // @ts-ignore - Admob plugin exists in Capacitor
        const result = await window.Admob.showRewardVideo({
          adId: config.rewardAdUnitId,
        });

        console.log('AdMob reward video result:', result);
        return result?.rewarded || false;
      } catch (adError) {
        console.error('AdMob showRewardVideo plugin error:', adError);
        
        // For development/testing, return true to allow functionality without ads
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: simulating successful ad view despite error');
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('General error showing reward ad:', error);
      
      // For development/testing, return true to allow functionality without ads
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: simulating successful ad view despite error');
        return true;
      }
      return false;
    }
  }
}

export const admobService = AdMobService.getInstance();
