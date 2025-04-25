
import { debugLog, errorLog } from "@/utils/debugUtils";
import { AdMobErrorHandler } from "./errorHandler";

export class AdMobListenerManager {
  private errorHandler: AdMobErrorHandler;

  constructor(private preloadCallback: () => void) {
    this.errorHandler = new AdMobErrorHandler();
  }

  async setupGlobalListeners(): Promise<void> {
    if (!window.Capacitor || !window.Admob) return;

    try {
      await window.Admob.addListener('onAdFailedToLoad', (info) => {
        this.errorHandler.handleAdLoadError(info, this.preloadCallback);
      });
      
      await window.Admob.addListener('onAdLoaded', () => {
        debugLog('AdMob', 'Ad loaded successfully');
        this.errorHandler.resetRetryCount();
      });
      
      await window.Admob.addListener('onRewardedVideoAdClosed', () => {
        debugLog('AdMob', 'Rewarded video ad closed');
        setTimeout(this.preloadCallback, 1000);
      });
      
      debugLog('AdMob', 'Global listeners set up successfully');
    } catch (error) {
      errorLog('AdMob', 'Failed to set up global listeners', error);
    }
  }

  async removeListeners(): Promise<void> {
    if (!window.Capacitor || !window.Admob) return;
    
    try {
      await window.Admob.removeAllListeners();
    } catch (error) {
      errorLog('AdMob', 'Error removing listeners:', error);
    }
  }
}
