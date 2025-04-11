
// Re-export user data services for backward compatibility
import { loadUserDataFromFirebase, UserData } from './user/userDataLoaderService';
import { saveUserDataToFirebase, updateUserCoinBalance } from './user/saveUserDataService';
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
