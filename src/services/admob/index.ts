
// Re-export everything from the admob service files
export { initializeAdMob, isPlatformSupported } from './utils';

export {
  preloadInterstitialAd,
  showInterstitialAd,
  isInterstitialAdReady
} from './interstitialAds';

export {
  preloadRewardedAd,
  showRewardedAd,
  isRewardedAdReady
} from './rewardedAds';

// Initialize and pre-load ads
import { initializeAdMob } from './utils';
import { preloadInterstitialAd } from './interstitialAds';
import { preloadRewardedAd } from './rewardedAds';

// Export a function to initialize everything at once
export async function initializeAds(): Promise<void> {
  await initializeAdMob();
  
  // Pre-load ads for faster display
  preloadInterstitialAd();
  preloadRewardedAd();
}

