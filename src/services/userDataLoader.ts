
// Re-export from refactored modules to maintain backward compatibility
import { loadUserDataFromSupabase } from "./user/userDataLoaderService";
import { createDefaultUserData, validateUserData } from "./user/userDataValidator";

export { 
  loadUserDataFromSupabase,
  createDefaultUserData,
  validateUserData
};

// For backward compatibility
export const loadUserDataFromFirebase = loadUserDataFromSupabase;

// Re-export the UserData type for consumers of this module
export type { UserData } from "@/utils/storage";
