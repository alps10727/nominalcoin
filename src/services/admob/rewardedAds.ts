
import { AdMob, RewardAdPluginEvents, AdMobRewardItem } from '@capacitor-community/admob';
import { debugLog, errorLog } from '@/utils/debugUtils';
import { TEST_REWARDED_ID } from './constants';
import { isPlatformSupported, getPlatformAdId } from './utils';

// Track ad load status
let isRewardedLoading = false;
let isRewardedReady = false;

/**
 * Preload rewarded ad
 */
export async function preloadRewardedAd(): Promise<boolean> {
  if (!isPlatformSupported() || isRewardedLoading) {
    return false;
  }

  try {
    isRewardedLoading = true;
    
    // Load rewarded ad
    const adId = getPlatformAdId(TEST_REWARDED_ID);
    
    // Set up event listeners for rewarded ads
    AdMob.addListener(RewardAdPluginEvents.Loaded, (info) => {
      debugLog('AdMobService', 'Rewarded ad loaded successfully:', info);
      isRewardedReady = true;
      isRewardedLoading = false;
    });

    AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error) => {
      errorLog('AdMobService', 'Rewarded ad failed to load:', error);
      isRewardedReady = false;
      isRewardedLoading = false;
    });
    
    // Load the ad
    await AdMob.prepareRewardVideoAd({
      adId: adId,
    });
    
    return true;
  } catch (error) {
    errorLog('AdMobService', 'Error preloading rewarded ad:', error);
    isRewardedLoading = false;
    isRewardedReady = false;
    return false;
  }
}

/**
 * Show rewarded ad and return a Promise that resolves with reward information
 */
export async function showRewardedAd(): Promise<AdMobRewardItem | null> {
  if (!isPlatformSupported()) {
    return null;
  }

  try {
    // Check if ad is ready or needs to be loaded
    if (!isRewardedReady && !isRewardedLoading) {
      await preloadRewardedAd();
    }
    
    // Show the ad if ready
    if (isRewardedReady) {
      const result = await AdMob.showRewardVideoAd();
      isRewardedReady = false;
      
      // Preload the next ad immediately
      setTimeout(() => preloadRewardedAd(), 1000);
      
      // Access the reward directly from result
      return result || null;
    }
    
    return null;
  } catch (error) {
    errorLog('AdMobService', 'Error showing rewarded ad:', error);
    isRewardedReady = false;
    
    // Retry preloading
    setTimeout(() => preloadRewardedAd(), 2000);
    return null;
  }
}

/**
 * Check if rewarded ad is ready to show
 */
export const isRewardedAdReady = (): boolean => isRewardedReady;

