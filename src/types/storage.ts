
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
  referralCode?: string; // User's unique referral code
  referralCount?: number; // Count of successful referrals
  referrals?: string[]; // Array of user IDs referred by this user
  referredBy?: string | null; // User ID who referred this user, if any
  indirectReferrals?: string[]; // Added back for backward compatibility with existing code
  name?: string; // User's name
  emailAddress?: string; // User's email address
  isAdmin?: boolean; // Added isAdmin property for admin panel access
  tasks?: {
    completed?: number[]  // Tamamlanan görev ID'leri
  };
  miningEndTime?: number; // Added absolute end time for reliable timing
  progress?: number; // Added progress property for mining state tracking
  miningStartTime?: number; // Added start time for better tracking and calculations
}
