
interface UserData {
  balance: number;
  miningRate: number;
  lastSaved: number;
  miningActive?: boolean;
  miningTime?: number;
  miningSession?: number;
  upgrades?: any[];
  miningPeriod?: number; // Toplam madencilik periyodu (sn olarak)
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
