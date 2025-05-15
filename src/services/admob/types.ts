
import { AdLoadInfo, AdMobRewardItem } from '@capacitor-community/admob';

// Ad unit IDs
export interface AdUnitIDs {
  android: string;
  ios: string;
}

// Ad status types
export interface AdStatus {
  isLoading: boolean;
  isReady: boolean;
}

// Event handler types
export type AdLoadedHandler = (info: AdLoadInfo) => void;
export type AdFailedHandler = (error: any) => void;
export type RewardedAdHandler = () => void;

