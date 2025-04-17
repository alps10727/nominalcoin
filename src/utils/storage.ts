
// User data types
export interface UserData {
  balance: number;
  miningRate: number;
  lastSaved: number;
  userId?: string;
  miningActive?: boolean;
  miningTime?: number;
  miningPeriod?: number;
  miningSession?: number;
  miningEndTime?: number;
  progress?: number;
  poolMembership?: {
    currentPool?: string;
    joinDate?: string | Date;
    lastPoolChangeDate?: string | Date;
  };
  upgrades?: any[];
  tasks?: {
    completed?: number[];
  };
  name?: string;
  emailAddress?: string;
  isAdmin?: boolean;
  miningStats?: {
    totalDays?: number;
    dailyAverage?: number;
    rank?: string;
  };
}

const LOCAL_STORAGE_KEY = 'fcMinerUserData';

// Load user data from localStorage
export function loadUserData(): UserData | null {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error("Error loading user data from localStorage:", error);
    return null;
  }
}

// Save user data to localStorage
export function saveUserData(userData: UserData): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error("Error saving user data to localStorage:", error);
  }
}

// Clear user data from localStorage
export function clearUserData(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing user data from localStorage:", error);
  }
}

// Get next user ID (used for generating random IDs)
export function getNextUserId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

// Export enhanced storage functions for high-scale operations
export const optimizedStorage = {
  /**
   * Access localStorage with error handling and automatic stringification
   */
  set: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting localStorage key ${key}:`, error);
      return false;
    }
  },
  
  /**
   * Get from localStorage with error handling and automatic parsing
   */
  get: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting localStorage key ${key}:`, error);
      return defaultValue;
    }
  },
  
  /**
   * Remove a key from localStorage with error handling
   */
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key ${key}:`, error);
      return false;
    }
  }
};
