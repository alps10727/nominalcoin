
// USER_DATA_VERSION sayesinde API değişikliklerini takip edebiliriz
export const USER_DATA_VERSION = "v1.0";
export const GLOBAL_STORAGE_KEY = 'fcMinerUserData';
export const USER_ID_STORAGE_KEY = 'fcMinerLastUserId';

/**
 * Kullanıcıya özel localStorage anahtarı oluştur
 */
export function getUserStorageKey(userId?: string): string {
  if (userId) {
    return `fcMinerUserData_${userId}_${USER_DATA_VERSION}`;
  }
  return GLOBAL_STORAGE_KEY;
}
