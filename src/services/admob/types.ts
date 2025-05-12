export interface AdMobServiceInterface {
  initialize(): Promise<void>;
  showRewardAd(): Promise<boolean>;
  preloadRewardAd(): Promise<void>;
  showBannerAd(): Promise<void>;
  hideBannerAd(): Promise<void>;
  showInterstitialAd(): Promise<boolean>; // Add this line
  isAvailable(): boolean;
}
