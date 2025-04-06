
// Re-export authentication modules for backwards compatibility
import { 
  registerUser,
  UserRegistrationData
} from './auth/registerService';

import {
  loginUser,
  logoutUser,
  sendPasswordResetEmail
} from './auth/loginService';

import {
  findUsersByReferralCode,
  updateReferrerInfo
} from './auth/referralService';

// Export all functions to maintain backwards compatibility
export {
  registerUser,
  loginUser,
  logoutUser,
  sendPasswordResetEmail,
  findUsersByReferralCode,
  updateReferrerInfo
};

// Export types
export type { UserRegistrationData };
