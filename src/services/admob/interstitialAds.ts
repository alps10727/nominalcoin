
import { Capacitor } from '@capacitor/core';
import { AdMob, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { debugLog, errorLog } from '@/utils/debugUtils';
import { TEST_INTERSTITIAL_ID } from './constants';
import { isPlatformSupported, getPlatformAdId } from './utils';

// Track ad load status
let isInterstitialLoading = false;
let isInterstitialReady = false;

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
    const adId = getPlatformAdId(TEST_INTERSTITIAL_ID);
    
    // Set up event listeners
    AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info) => {
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
 * Check if interstitial ad is ready to show
 */
export const isInterstitialAdReady = (): boolean => isInterstitialReady;

