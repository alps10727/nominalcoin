
export async function fetchAdMobConfig(): Promise<any | null> {
  try {
    console.log('AdMob: Fetching AdMob config...');
    const response = await fetch('/functions/get-admob-config');
    if (!response.ok) {
      console.error('Failed to fetch AdMob config:', response.status, response.statusText);
      return null;
    }
    const data = await response.json();
    console.log('AdMob: Config fetched successfully:', data.data);
    return data.data;
  } catch (error) {
    console.error('Error fetching AdMob config:', error);
    return null;
  }
}

export function getPlatformSpecificAdUnit(config: any, platform: string, adType: 'reward' | 'banner' | 'interstitial'): string {
  if (!config) return '';
  
  let adUnitId = '';
  
  if (platform === 'ios') {
    switch (adType) {
      case 'reward':
        adUnitId = config.iOSRewardAdUnitId || '';
        break;
      case 'banner':
        adUnitId = config.iOSBannerAdUnitId || '';
        break;
      case 'interstitial':
        adUnitId = config.iOSInterstitialAdUnitId || '';
        break;
      default:
        adUnitId = '';
    }
  } else {
    // Default to Android
    switch (adType) {
      case 'reward':
        adUnitId = config.rewardAdUnitId || '';
        break;
      case 'banner':
        adUnitId = config.bannerAdUnitId || '';
        break;
      case 'interstitial':
        adUnitId = config.interstitialAdUnitId || '';
        break;
      default:
        adUnitId = '';
    }
  }
  
  console.log(`AdMob: Using ${adType} ad unit for ${platform}: ${adUnitId}`);
  return adUnitId;
}
