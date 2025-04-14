
/**
 * User data interface definition
 */
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
  miningEndTime?: number; // Added absolute end time for reliable timing
  progress?: number; // Added progress property for mining state tracking
  miningStartTime?: number; // Added start time for better tracking and calculations
  name?: string; // User's name
  emailAddress?: string; // User's email address
  isAdmin?: boolean; // Added isAdmin property for admin panel access
  tasks?: {
    completed?: number[]  // Tamamlanan görev ID'leri
  };
}
