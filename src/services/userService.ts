
// Re-export user data services for backward compatibility
import { loadUserDataFromFirebase, UserData } from './user/userDataLoaderService';
import { saveUserDataToFirebase } from './user/saveUserDataService';
import { updateUserCoinBalance } from './user/updateBalanceService';
import { initializeMiningStateFromFirebase } from './miningStateInitializer';

// Export all functions to maintain backwards compatibility
export { 
  loadUserDataFromFirebase,
  saveUserDataToFirebase,
  initializeMiningStateFromFirebase,
  updateUserCoinBalance
};

// Export types
export type { UserData };
