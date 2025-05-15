
import { Capacitor } from '@capacitor/core';
import { AdMob } from '@capacitor-community/admob';
import { debugLog } from '@/utils/debugUtils';

/**
 * Check if the current platform supports AdMob
 */
export function isPlatformSupported(): boolean {
  return Capacitor.isPluginAvailable('AdMob') && Capacitor.isNativePlatform();
}

/**
 * Get the correct ad ID based on platform
 */
export function getPlatformAdId(adIds: { android: string; ios: string }): string {
  return Capacitor.getPlatform() === 'ios' ? adIds.ios : adIds.android;
}

/**
 * Initialize AdMob at app startup
 */
export async function initializeAdMob(): Promise<void> {
  if (!isPlatformSupported()) {
    debugLog('AdMobService', 'Platform does not support AdMob');
    return;
  }

  try {
    await AdMob.initialize({
      initializeForTesting: true,
    });
    debugLog('AdMobService', 'AdMob initialized successfully');
  } catch (error) {
    console.error('Failed to initialize AdMob:', error);
  }
}

