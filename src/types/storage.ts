
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
    completed?: (number | string)[]  // Updated to support both number and string IDs
  };
  referralCode?: string; // User's unique referral code
  invitedBy?: string; // UserID of the inviter
  referralCount?: number; // Number of successful referrals
  referrals?: string[]; // Array of user IDs referred by this user
  indirectReferrals?: number; // Count of indirect referrals (level 2)
  miningStats?: {
    totalDays?: number;
    dailyAverage?: number;
    rank?: string;
  };
  socialConnections?: {
    twitter?: boolean;
    facebook?: boolean;
    instagram?: boolean;
  };
  completedMissions?: string[]; // Array of completed mission IDs
}
