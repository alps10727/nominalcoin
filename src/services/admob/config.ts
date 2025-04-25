export async function fetchAdMobConfig(): Promise<any | null> {
  try {
    const response = await fetch('/functions/get-admob-config');
    if (!response.ok) {
      console.error('Failed to fetch AdMob config:', response.status, response.statusText);
      return null;
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching AdMob config:', error);
    return null;
  }
}

export function getPlatformSpecificAdUnit(config: any, platform: string, adType: 'reward' | 'banner' | 'interstitial'): string {
  if (!config) return '';
  
  if (platform === 'ios') {
    switch (adType) {
      case 'reward':
        return config.iOSRewardAdUnitId || '';
      case 'banner':
        return config.iOSBannerAdUnitId || '';
      case 'interstitial':
        return config.iOSInterstitialAdUnitId || '';
      default:
        return '';
    }
  } else {
    // Default to Android
    switch (adType) {
      case 'reward':
        return config.rewardAdUnitId || '';
      case 'banner':
        return config.bannerAdUnitId || '';
      case 'interstitial':
        return config.interstitialAdUnitId || '';
      default:
        return '';
    }
  }
}
