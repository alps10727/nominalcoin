
interface AdmobPlugin {
  initialize(options: { appId: string }): Promise<void>;
  showRewardVideo(options: { adId: string }): Promise<{ rewarded: boolean }>;
}

interface CapacitorInterface {
  getPlatform(): string;
  isPluginAvailable(name: string): boolean;
}

interface Window {
  Capacitor?: CapacitorInterface;
  Admob?: AdmobPlugin;
}
