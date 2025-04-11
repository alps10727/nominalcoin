// Re-export everything from the refactored modules
// This maintains backward compatibility with existing code

export { loadUserData, saveUserData, clearUserData } from './storageOperations';
export { getNextUserId } from './userIdGenerator';
export type { UserData } from '../types/storage';

// Enhanced user data interface with mining end time
export interface UserData {
  balance: number;
  miningRate: number;
  lastSaved: number;
  miningActive?: boolean;
  miningTime?: number;
  miningPeriod?: number;
  miningSession?: number;
  userId?: string;
  referralCount?: number;
  miningEndTime?: number; // Added absolute end time for reliable timing
  upgrades?: any[];
  [key: string]: any; // Allow for additional properties
}
