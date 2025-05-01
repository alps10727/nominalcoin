
import { debugLog, errorLog } from "@/utils/debugUtils";
import { fetchAdMobConfig } from "../config";
import type { AdMobServiceInterface } from "../types";

export class AdMobInitializationService {
  private static instance: AdMobInitializationService;
  private initialized = false;
  private initializationInProgress = false;
  private initializationRetries = 0;
  private MAX_RETRIES = 3;

  static getInstance(): AdMobInitializationService {
    if (!AdMobInitializationService.instance) {
      AdMobInitializationService.instance = new AdMobInitializationService();
    }
    return AdMobInitializationService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      debugLog('AdMob', 'AdMob already initialized, skipping');
      return;
    }

    if (this.initializationInProgress) {
      debugLog('AdMob', 'AdMob initialization already in progress, skipping');
      return;
    }

    this.initializationInProgress = true;

    try {
      if (typeof window === 'undefined' || !window.Capacitor) {
        debugLog('AdMob', 'Not running on mobile device');
        this.initializationInProgress = false;
        return;
      }

      if (!window.Capacitor.isPluginAvailable('AdMob')) {
        errorLog('AdMob', 'AdMob plugin is not available', null);
        console.error('AdMob plugin is not available in Capacitor');
        this.initializationInProgress = false;
        return;
      }

      const config = await fetchAdMobConfig();
      if (!config) {
        errorLog('AdMob', 'Failed to fetch AdMob config', null);
        console.error('Failed to fetch AdMob config');
        this.initializationInProgress = false;
        return;
      }

      console.log('AdMob: Fetched config successfully', config);
      const platform = window.Capacitor.getPlatform();
      const appId = platform === 'ios' ? (config.iOSAppId || config.appId) : config.appId;
      
      console.log(`AdMob: Initializing with appId: ${appId} on platform: ${platform}`);
      
      if (!window.Admob || !window.Admob.initialize) {
        errorLog('AdMob', 'Admob.initialize method is not available', null);
        this.initializationInProgress = false;
        return;
      }
      
      await window.Admob.initialize({
        appId: appId,
        testingDevices: ['EMULATOR'],
        initializeForTesting: true, // Test moduna geç, daha güvenilir çalışır
      });

      debugLog('AdMob', `AdMob initialized successfully on platform: ${platform} with appId: ${appId}`);
      console.log(`AdMob initialized successfully on platform: ${platform} with appId: ${appId}`);

      // Consent ayarlaması güvenlik kontrolü ile
      if (window.Admob?.setConsent) {
        await window.Admob.setConsent({ status: 'PERSONALIZED' });
        debugLog('AdMob', 'AdMob consent set to PERSONALIZED');
        console.log('AdMob: Consent set to PERSONALIZED');
      }

      // iOS izin kontrolü güvenlik kontrolü ile
      if (platform === 'ios' && window.Admob?.requestTrackingAuthorization) {
        const { status } = await window.Admob.requestTrackingAuthorization();
        debugLog('AdMob', `iOS tracking authorization status: ${status}`);
        console.log(`AdMob: iOS tracking authorization status: ${status}`);
      }

      this.initialized = true;
      this.initializationRetries = 0;
    } catch (error) {
      errorLog('AdMob', 'Failed to initialize AdMob:', error);
      console.error('Failed to initialize AdMob:', error);
      this.initialized = false;
      
      // Tekrar deneme mantığı
      this.initializationRetries++;
      if (this.initializationRetries < this.MAX_RETRIES) {
        debugLog('AdMob', `Retrying initialization (${this.initializationRetries}/${this.MAX_RETRIES})...`);
        setTimeout(() => {
          this.initializationInProgress = false;
          this.initialize();
        }, 2000 * this.initializationRetries); // Her denemede artan bekleme süresi
      }
    } finally {
      this.initializationInProgress = false;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const admobInitService = AdMobInitializationService.getInstance();
