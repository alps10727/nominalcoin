
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
  indirectReferrals?: {  // Dolaylı referanslar (2. ve 3. seviye)
    secondLevel?: string[]; // 2. seviye referanslar
    thirdLevel?: string[]; // 3. seviye referanslar
  };
  name?: string; // User's name
  emailAddress?: string; // User's email address
  isAdmin?: boolean; // Added isAdmin property for admin panel access
  tasks?: {
    completed?: number[]  // Tamamlanan görev ID'leri
  };
  miningEndTime?: number; // Added absolute end time for reliable timing
}
