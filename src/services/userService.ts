
// Re-export user data services for backward compatibility
import { loadUserDataFromFirebase, UserData } from './userDataLoader';
import { saveUserDataToFirebase } from './userDataSaver';
import { initializeMiningStateFromFirebase } from './miningStateInitializer';

// Export all functions to maintain backwards compatibility
export { 
  loadUserDataFromFirebase,
  saveUserDataToFirebase,
  initializeMiningStateFromFirebase
};

// Export types
export type { UserData };
