
// Re-export user data services for backward compatibility
import { loadUserDataFromSupabase } from './user/userDataLoaderService';
import { saveUserDataToSupabase } from './user/saveUserDataService';
import { updateUserCoinBalance } from './user/updateBalanceService';
import { initializeMiningStateFromSupabase } from './miningStateInitializer';

// Export all functions to maintain backwards compatibility
export { 
  loadUserDataFromSupabase as loadUserDataFromFirebase,
  saveUserDataToSupabase as saveUserDataToFirebase,
  initializeMiningStateFromSupabase as initializeMiningStateFromFirebase,
  updateUserCoinBalance
};

// Export types
export type { UserData } from './user/userDataLoaderService';
