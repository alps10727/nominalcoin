
interface UserData {
  userId?: string;
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
    // If there's an error parsing, clean up the corrupt data
    localStorage.removeItem('fcMinerUserData');
  }
  // Return null if no data found - this ensures new users get default values
  return null;
}

/**
 * Save user data to localStorage
 */
export function saveUserData(userData: UserData): void {
  try {
    // Ensure we're not saving undefined or null values
    const sanitizedData = {
      ...userData,
      balance: userData.balance || 0,
      miningRate: userData.miningRate || 0.1, // 3 dakikada 0.3 NC (0.1 * 3)
      lastSaved: userData.lastSaved || Date.now(),
    };
    
    localStorage.setItem('fcMinerUserData', JSON.stringify(sanitizedData));
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

/**
 * Get next available user ID
 * This function reads the last assigned ID from localStorage and increments it
 */
export function getNextUserId(): string {
  try {
    const lastIdData = localStorage.getItem('fcMinerLastUserId');
    let nextId = 1; // Default start at 1
    
    if (lastIdData) {
      nextId = parseInt(lastIdData, 10) + 1;
    }
    
    // Save the new last ID
    localStorage.setItem('fcMinerLastUserId', nextId.toString());
    
    // Format with leading zeros to create 8-digit ID
    return nextId.toString().padStart(8, '0');
  } catch (err) {
    console.error('Error generating user ID:', err);
    // Fallback to timestamp-based ID if something goes wrong
    return Date.now().toString().slice(-8).padStart(8, '0');
  }
}
