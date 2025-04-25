
export interface AdMobConfig {
  appId: string;
  rewardAdUnitId: string;
  iOSAppId?: string;
  iOSRewardAdUnitId?: string;
  bannerAdUnitId?: string;
  iOSBannerAdUnitId?: string;
  interstitialAdUnitId?: string;
  iOSInterstitialAdUnitId?: string;
}

export interface AdMobServiceInterface {
  initialize(): Promise<void>;
  showRewardAd(): Promise<boolean>;
  preloadRewardAd(): Promise<void>;
  showBannerAd(): Promise<void>;
  hideBannerAd(): Promise<void>;
  isAvailable(): boolean;
}
