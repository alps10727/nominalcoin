
interface AdmobPlugin {
  initialize(options: { 
    appId: string; 
    testingDevices?: string[]; 
    initializeForTesting?: boolean 
  }): Promise<void>;
  showRewardVideoAd(options?: any): Promise<{ rewarded: boolean }>;
  prepareRewardVideoAd(options: { adId: string }): Promise<void>;
  prepareInterstitial(options: { adId: string }): Promise<void>; // Add this line
  showInterstitial(): Promise<void>; // Add this line
  addListener(eventName: string, listenerFunc: (info: any) => void): Promise<any>;
  removeAllListeners(): Promise<void>;
  showBanner(options: { adId: string; position?: string; margin?: number }): Promise<void>;
  hideBanner(): Promise<void>;
  // GDPR ve veri koruma için ek metodlar
  requestTrackingAuthorization?(): Promise<{ status: number }>;
  setConsent?(options: { status: string }): Promise<void>;
}

interface CapacitorInterface {
  getPlatform(): string;
  isPluginAvailable(name: string): boolean;
}

interface Window {
  Capacitor?: CapacitorInterface;
  Admob?: AdmobPlugin;
  EdgeRuntime?: {
    userAgent: string;
  };
}
