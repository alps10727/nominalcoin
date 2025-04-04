
export interface UserData {
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
      try {
        const parsedData = JSON.parse(savedData) as UserData;
        return parsedData;
      } catch (parseErr) {
        console.error('JSON parse hatası:', parseErr);
        // If there's an error parsing, clean up the corrupt data
        localStorage.removeItem('fcMinerUserData');
        return null;
      }
    }
  } catch (err) {
    console.error('Error loading user data:', err);
    // If there's an error parsing, clean up the corrupt data
    try {
      localStorage.removeItem('fcMinerUserData');
    } catch (removeErr) {
      console.error('Corrupt data temizleme hatası:', removeErr);
    }
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
      miningRate: userData.miningRate || 0.1, // Updated default to 0.1 NC/min
      lastSaved: userData.lastSaved || Date.now(),
    };
    
    try {
      const jsonData = JSON.stringify(sanitizedData);
      localStorage.setItem('fcMinerUserData', jsonData);
    } catch (stringifyErr) {
      console.error('JSON stringify hatası:', stringifyErr);
      throw stringifyErr;
    }
  } catch (err) {
    console.error('Error saving user data:', err);
    throw err; // Yeniden fırlat, böylece çağıran fonksiyon işleyebilir
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
    let nextId = 1; // Default start at 1
    
    try {
      const lastIdData = localStorage.getItem('fcMinerLastUserId');
      if (lastIdData) {
        nextId = parseInt(lastIdData, 10) + 1;
      }
    } catch (readErr) {
      console.error('User ID okuma hatası:', readErr);
      // Fail gracefully, continue with default
    }
    
    // Save the new last ID
    try {
      localStorage.setItem('fcMinerLastUserId', nextId.toString());
    } catch (writeErr) {
      console.error('User ID yazma hatası:', writeErr);
    }
    
    // Format with leading zeros to create 8-digit ID
    return nextId.toString().padStart(8, '0');
  } catch (err) {
    console.error('Error generating user ID:', err);
    // Fallback to timestamp-based ID if something goes wrong
    return Date.now().toString().slice(-8).padStart(8, '0');
  }
}
