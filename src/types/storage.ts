
/**
 * User data interface definition
 */
export interface UserData {
  userId: string; // Required field
  balance: number;
  miningRate: number;
  lastSaved: number;
  miningActive: boolean;
  miningTime: number;
  miningPeriod: number; 
  miningSession: number;
  miningEndTime?: number | null; 
  progress?: number;
  miningStartTime?: number | null;
  name?: string; 
  emailAddress?: string; 
  isAdmin?: boolean;
  tasks?: {
    completed?: number[]
  };
  upgrades?: Array<{id: number, level: number, rateBonus: number}>; 
  [x: string]: any; // Allow additional properties
}
