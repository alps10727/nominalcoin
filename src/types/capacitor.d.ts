
interface AdmobPlugin {
  initialize(options: { appId: string; testingDevices?: string[]; initializeForTesting?: boolean }): Promise<void>;
  showRewardVideo(options?: { adId: string }): Promise<{ rewarded: boolean }>;
  prepareRewardVideoAd(options: { adId: string }): Promise<void>;
}

interface CapacitorInterface {
  getPlatform(): string;
  isPluginAvailable(name: string): boolean;
}

interface Window {
  Capacitor?: CapacitorInterface;
  Admob?: AdmobPlugin;
}
