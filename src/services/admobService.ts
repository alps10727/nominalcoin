
import { Capacitor } from '@capacitor/core';
import { AdMob, AdOptions, AdMobRewardItem, AdLoadInfo, InterstitialAdPluginEvents, RewardAdPluginEvents } from '@capacitor-community/admob';
import { debugLog, errorLog } from '@/utils/debugUtils';

// Test ad units from Google
const TEST_INTERSTITIAL_ID = {
  android: 'ca-app-pub-3940256099942544/1033173712',
  ios: 'ca-app-pub-3940256099942544/4411468910'
};

const TEST_REWARDED_ID = {
  android: 'ca-app-pub-3940256099942544/5224354917',
  ios: 'ca-app-pub-3940256099942544/1712485313'
};

// Track ad load status to prevent multiple loads
let isInterstitialLoading = false;
let isRewardedLoading = false;
let isInterstitialReady = false;
let isRewardedReady = false;

/**
 * Initialize AdMob at app startup
 */
export async function initializeAdMob() {
  if (!isPlatformSupported()) {
    debugLog('AdMobService', 'Platform does not support AdMob');
    return;
  }

  try {
    await AdMob.initialize({
      initializeForTesting: true,
    });
    debugLog('AdMobService', 'AdMob initialized successfully');
    
    // Pre-load ads for faster display
    preloadInterstitialAd();
    preloadRewardedAd();
  } catch (error) {
    errorLog('AdMobService', 'Failed to initialize AdMob:', error);
  }
}

/**
 * Check if the current platform supports AdMob
 */
export function isPlatformSupported(): boolean {
  return Capacitor.isPluginAvailable('AdMob') && Capacitor.isNativePlatform();
}

/**
 * Preload interstitial ad for future display
 */
export async function preloadInterstitialAd(): Promise<boolean> {
  if (!isPlatformSupported() || isInterstitialLoading) {
    return false;
  }

  try {
    isInterstitialLoading = true;
    
    // Load interstitial ad
    const adId = Capacitor.getPlatform() === 'ios' ? TEST_INTERSTITIAL_ID.ios : TEST_INTERSTITIAL_ID.android;
    
    // Set up event listeners
    AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => {
      debugLog('AdMobService', 'Interstitial ad loaded successfully:', info);
      isInterstitialReady = true;
      isInterstitialLoading = false;
    });

    AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (error) => {
      errorLog('AdMobService', 'Interstitial ad failed to load:', error);
      isInterstitialReady = false;
      isInterstitialLoading = false;
    });
    
    // Load the ad
    await AdMob.prepareInterstitial({
      adId: adId,
    });
    
    return true;
  } catch (error) {
    errorLog('AdMobService', 'Error preloading interstitial ad:', error);
    isInterstitialLoading = false;
    isInterstitialReady = false;
    return false;
  }
}

/**
 * Show interstitial ad
 */
export async function showInterstitialAd(): Promise<boolean> {
  if (!isPlatformSupported()) {
    return false;
  }

  try {
    // Check if ad is ready or needs to be loaded
    if (!isInterstitialReady && !isInterstitialLoading) {
      await preloadInterstitialAd();
    }
    
    // Show the ad if ready
    if (isInterstitialReady) {
      await AdMob.showInterstitial();
      isInterstitialReady = false;
      
      // Preload the next ad immediately
      setTimeout(() => preloadInterstitialAd(), 1000);
      return true;
    }
    
    return false;
  } catch (error) {
    errorLog('AdMobService', 'Error showing interstitial ad:', error);
    isInterstitialReady = false;
    
    // Retry preloading
    setTimeout(() => preloadInterstitialAd(), 2000);
    return false;
  }
}

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
    const adId = Capacitor.getPlatform() === 'ios' ? TEST_REWARDED_ID.ios : TEST_REWARDED_ID.android;
    
    // Set up event listeners for rewarded ads
    AdMob.addListener(RewardAdPluginEvents.Loaded, (info: AdLoadInfo) => {
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
      
      // Fix: Access the reward directly from result, not from rewardItem property
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

// Export ad status checkers
export const isInterstitialAdReady = () => isInterstitialReady;
export const isRewardedAdReady = () => isRewardedReady;
