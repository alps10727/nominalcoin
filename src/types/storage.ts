
/**
 * User data interface definition
 */
export interface UserData {
  userId: string; // Changed to required
  balance: number;
  miningRate: number;
  lastSaved: number;
  miningActive: boolean;
  miningTime: number;
  miningPeriod: number; 
  miningSession: number;
  upgrades?: Array<{id: number, level: number, rateBonus: number}>; // Added upgrades array
  miningEndTime?: number | null; 
  progress?: number;
  miningStartTime?: number | null;
  name?: string; 
  emailAddress?: string; 
  isAdmin?: boolean;
  tasks?: {
    completed?: number[]
  };
  [x: string]: any; // Allow additional properties
}
