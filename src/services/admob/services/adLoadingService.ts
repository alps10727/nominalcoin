
import { debugLog, errorLog } from "@/utils/debugUtils";

export class AdLoadingService {
  private static instance: AdLoadingService;
  private isPreloading = false;
  private adPreloaded = false;
  private adLoadInProgress = false;
  private lastAdLoadAttempt = 0;

  static getInstance(): AdLoadingService {
    if (!AdLoadingService.instance) {
      AdLoadingService.instance = new AdLoadingService();
    }
    return AdLoadingService.instance;
  }

  async preloadRewardAd(): Promise<void> {
    const now = Date.now();
    if (this.isPreloading || this.adPreloaded || this.adLoadInProgress || 
        (now - this.lastAdLoadAttempt < 3000)) {
      debugLog('AdMob', 'Skipping preload: already in progress or throttled');
      return;
    }
    
    try {
      if (!window.Capacitor || !window.Admob) {
        debugLog('AdMob', 'Not on mobile or plugin not available, skipping ad preload');
        return;
      }

      this.isPreloading = true;
      this.adLoadInProgress = true;
      this.lastAdLoadAttempt = now;
      
      debugLog('AdMob', 'Started preloading reward ad');

      // Always use test ad IDs
      const platform = window.Capacitor.getPlatform();
      const adUnitId = platform === 'ios' 
        ? 'ca-app-pub-3940256099942544/1712485313' // iOS test reward ad
        : 'ca-app-pub-3940256099942544/5224354917'; // Android test reward ad
      
      debugLog('AdMob', `Preloading reward ad with ID: ${adUnitId}`);

      await window.Admob?.prepareRewardVideoAd({
        adId: adUnitId,
      });
      
      this.adPreloaded = true;
      this.isPreloading = false;
      this.adLoadInProgress = false;
      
      debugLog('AdMob', 'Reward ad preloaded successfully');
    } catch (error) {
      this.resetAdStates();
      errorLog('AdMob', 'Failed to preload reward ad:', error);
    }
  }

  private resetAdStates(): void {
    this.adPreloaded = false;
    this.isPreloading = false;
    this.adLoadInProgress = false;
  }

  isAdPreloaded(): boolean {
    return this.adPreloaded;
  }

  setAdPreloaded(value: boolean): void {
    this.adPreloaded = value;
  }
}

export const adLoadingService = AdLoadingService.getInstance();
