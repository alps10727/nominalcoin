
// Re-export authentication modules for backwards compatibility
import { 
  registerUser,
  UserRegistrationData,
  findUsersByReferralCode
} from './auth/registerService';

import {
  loginUser,
  logoutUser,
  sendPasswordResetEmail
} from './auth/loginService';

// Export all functions to maintain backwards compatibility
export {
  registerUser,
  loginUser,
  logoutUser,
  sendPasswordResetEmail,
  findUsersByReferralCode
};

// Export types
export type { UserRegistrationData };
