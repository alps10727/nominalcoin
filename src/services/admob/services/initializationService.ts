
import { debugLog, errorLog } from "@/utils/debugUtils";
import { fetchAdMobConfig } from "../config";
import type { AdMobServiceInterface } from "../types";

export class AdMobInitializationService {
  private static instance: AdMobInitializationService;
  private initialized = false;

  static getInstance(): AdMobInitializationService {
    if (!AdMobInitializationService.instance) {
      AdMobInitializationService.instance = new AdMobInitializationService();
    }
    return AdMobInitializationService.instance;
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

      const config = await fetchAdMobConfig();
      if (!config) return;

      const platform = window.Capacitor.getPlatform();
      const appId = platform === 'ios' ? (config.iOSAppId || config.appId) : config.appId;
      
      await window.Admob?.initialize({
        appId: appId,
        testingDevices: ['EMULATOR'],
        initializeForTesting: true,
      });

      debugLog('AdMob', `AdMob initialized successfully on platform: ${platform} with appId: ${appId}`);

      if (window.Admob?.setConsent) {
        await window.Admob.setConsent({ status: 'PERSONALIZED' });
        debugLog('AdMob', 'AdMob consent set to PERSONALIZED');
      }

      if (platform === 'ios' && window.Admob?.requestTrackingAuthorization) {
        const { status } = await window.Admob.requestTrackingAuthorization();
        debugLog('AdMob', `iOS tracking authorization status: ${status}`);
      }

      this.initialized = true;
    } catch (error) {
      errorLog('AdMob', 'Failed to initialize AdMob:', error);
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const admobInitService = AdMobInitializationService.getInstance();
