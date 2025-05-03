
export interface CapacitorAdMobPlugin {
  initialize(): Promise<void>;
  showRewardVideoAd(): Promise<{ value: boolean }>;
  prepareRewardVideoAd(options: { adId: string }): Promise<void>;
  prepareInterstitial(options: { adId: string }): Promise<void>;
  showInterstitial(): Promise<void>;
  showBanner(options: { adId: string; position?: string; margin?: number }): Promise<void>;
  hideBanner(): Promise<void>;
  resumeBanner(): Promise<void>;
  removeBanner(): Promise<void>;
  addListener(eventName: string, listenerFunc: (info: any) => void): Promise<any>;
  removeAllListeners(): Promise<void>;
}

export interface CapacitorInterface {
  getPlatform(): string;
  isPluginAvailable(name: string): boolean;
}

declare global {
  interface Window {
    Capacitor?: CapacitorInterface;
    CapacitorAdMob?: CapacitorAdMobPlugin;
  }
}
