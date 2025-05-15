
import { useEffect, useState } from 'react';
import { 
  initializeAdMob, 
  isPlatformSupported, 
  isRewardedAdReady, 
  isInterstitialAdReady,
  showRewardedAd,
  showInterstitialAd,
  preloadRewardedAd,
  preloadInterstitialAd
} from '@/services/admobService';
import { debugLog } from '@/utils/debugUtils';

export function useAdMob() {
  const [adMobInitialized, setAdMobInitialized] = useState(false);
  const [adMobSupported, setAdMobSupported] = useState(false);
  
  // Initialize AdMob on component mount
  useEffect(() => {
    const initialize = async () => {
      const supported = isPlatformSupported();
      setAdMobSupported(supported);
      
      if (supported) {
        await initializeAdMob();
        setAdMobInitialized(true);
        debugLog('useAdMob', 'AdMob initialized successfully');
      }
    };
    
    initialize();
  }, []);
  
  // Show a rewarded ad and execute callback when user earns reward
  const showRewardedAdWithCallback = async (onRewarded: () => void) => {
    if (!adMobSupported) {
      // If AdMob is not supported (e.g., in web development), call the callback directly
      onRewarded();
      return true;
    }
    
    const reward = await showRewardedAd();
    if (reward) {
      debugLog('useAdMob', `User earned reward: ${reward.amount} ${reward.type}`);
      onRewarded();
      return true;
    }
    return false;
  };
  
  // Show an interstitial ad
  const showInterstitialAdWithCallback = async (onComplete: () => void) => {
    if (!adMobSupported) {
      // If AdMob is not supported, call the callback directly
      onComplete();
      return true;
    }
    
    const shown = await showInterstitialAd();
    if (shown) {
      onComplete();
      return true;
    }
    return false;
  };
  
  return {
    adMobInitialized,
    adMobSupported,
    isRewardedAdReady: isRewardedAdReady(),
    isInterstitialAdReady: isInterstitialAdReady(),
    showRewardedAd: showRewardedAdWithCallback,
    showInterstitialAd: showInterstitialAdWithCallback,
    preloadRewardedAd,
    preloadInterstitialAd
  };
}
