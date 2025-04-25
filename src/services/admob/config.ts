
import { debugLog, errorLog } from "@/utils/debugUtils";
import { supabase } from "@/integrations/supabase/client";
import type { AdMobConfig } from "./types";

export async function fetchAdMobConfig(): Promise<AdMobConfig | null> {
  try {
    const { data: responseData, error } = await supabase.functions.invoke<{data: AdMobConfig}>('get-admob-config');
    
    if (error || !responseData) {
      errorLog('AdMob Config', 'Failed to retrieve AdMob config', error);
      return null;
    }
    
    const config = responseData.data;
    if (!config || !config.appId) {
      errorLog('AdMob Config', 'Invalid AdMob config: missing appId', null);
      return null;
    }
    
    return config;
  } catch (error) {
    errorLog('AdMob Config', 'Error fetching config:', error);
    return null;
  }
}

export function getPlatformSpecificAdUnit(config: AdMobConfig, platform: string, type: 'reward' | 'banner' | 'interstitial'): string {
  if (platform === 'ios') {
    switch (type) {
      case 'reward':
        return config.iOSRewardAdUnitId || config.rewardAdUnitId;
      case 'banner':
        return config.iOSBannerAdUnitId || config.bannerAdUnitId || '';
      case 'interstitial':
        return config.iOSInterstitialAdUnitId || config.interstitialAdUnitId || '';
    }
  }
  
  switch (type) {
    case 'reward':
      return config.rewardAdUnitId;
    case 'banner':
      return config.bannerAdUnitId || '';
    case 'interstitial':
      return config.interstitialAdUnitId || '';
  }
}
