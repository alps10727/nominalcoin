
interface AdmobPlugin {
  initialize(options: { 
    appId: string; 
    testingDevices?: string[]; 
    initializeForTesting?: boolean 
  }): Promise<void>;
  showRewardVideoAd(options?: any): Promise<{ rewarded: boolean }>;
  prepareRewardVideoAd(options: { adId: string }): Promise<void>;
  addListener(eventName: string, listenerFunc: (info: any) => void): Promise<any>;
  removeAllListeners(): Promise<void>;
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
}
