
import { AdMobListenerManager } from "./listenerManager";
import { admobInitService } from "./services/initializationService";
import { adLoadingService } from "./services/adLoadingService";
import { adDisplayService } from "./services/adDisplayService";
import type { AdMobServiceInterface } from "./types";

export class AdMobService implements AdMobServiceInterface {
  private static instance: AdMobService;
  private listenerManager: AdMobListenerManager;

  private constructor() {
    this.listenerManager = new AdMobListenerManager(() => this.preloadRewardAd());
  }

  static getInstance(): AdMobService {
    if (!AdMobService.instance) {
      AdMobService.instance = new AdMobService();
    }
    return AdMobService.instance;
  }

  async initialize(): Promise<void> {
    await admobInitService.initialize();
    if (admobInitService.isInitialized()) {
      await this.listenerManager.setupGlobalListeners();
      setTimeout(() => {
        this.preloadRewardAd();
        this.preloadInterstitialAd(); // Preload interstitial ads on initialization
      }, 1000);
    }
  }

  async showRewardAd(): Promise<boolean> {
    if (!admobInitService.isInitialized()) {
      await this.initialize();
    }
    return adDisplayService.showRewardAd();
  }

  async preloadRewardAd(): Promise<void> {
    if (!admobInitService.isInitialized()) {
      await this.initialize();
    }
    return adLoadingService.preloadRewardAd();
  }

  async showBannerAd(): Promise<void> {
    if (!admobInitService.isInitialized()) {
      await this.initialize();
    }
    return adDisplayService.showBannerAd();
  }

  async hideBannerAd(): Promise<void> {
    return adDisplayService.hideBannerAd();
  }

  async showInterstitialAd(): Promise<boolean> {
    if (!admobInitService.isInitialized()) {
      await this.initialize();
    }
    return adDisplayService.showInterstitialAd();
  }

  async preloadInterstitialAd(): Promise<void> {
    if (!admobInitService.isInitialized()) {
      await this.initialize();
    }
    return adDisplayService.preloadInterstitialAd();
  }

  isAvailable(): boolean {
    return window.Capacitor?.isPluginAvailable('AdMob') || false;
  }
}

export const admobService = AdMobService.getInstance();
