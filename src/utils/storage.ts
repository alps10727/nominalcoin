
interface UserData {
  balance: number;
  miningRate: number;
  lastSaved: number;
  miningActive?: boolean;
  miningTime?: number;
  miningSession?: number;
  upgrades?: any[];
  miningPeriod?: number; // Total mining period in seconds
}

/**
 * Load user data from localStorage
 */
export function loadUserData(): UserData | null {
  try {
    const savedData = localStorage.getItem('fcMinerUserData');
    if (savedData) {
      return JSON.parse(savedData) as UserData;
    }
  } catch (err) {
    console.error('Error loading user data:', err);
  }
  // Return null if no data found - this ensures new users get default values
  return null;
}

/**
 * Save user data to localStorage
 */
export function saveUserData(userData: UserData): void {
  try {
    localStorage.setItem('fcMinerUserData', JSON.stringify(userData));
  } catch (err) {
    console.error('Error saving user data:', err);
  }
}

/**
 * Clear user data from localStorage (for sign out)
 */
export function clearUserData(): void {
  try {
    localStorage.removeItem('fcMinerUserData');
  } catch (err) {
    console.error('Error clearing user data:', err);
  }
}
